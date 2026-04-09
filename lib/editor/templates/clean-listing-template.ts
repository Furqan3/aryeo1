import { createImageFrame, generateUniqueId, bringTextToFront } from '../canvas-helpers'

interface PropertyInfo {
  price?: string
  property_type?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  bedrooms?: string | number
  bathrooms?: string | number
  square_feet?: string | number
}

export const applyCleanListingTemplate = async (
  canvas: any,
  fabricLib: any,
  images: string[],
  propertyInfo: PropertyInfo,
  canvasSize: { width: number; height: number },
  saveToHistory: (canvas: any) => void
) => {
  if (!canvas) return

  canvas.clear()
  canvas.setBackgroundColor('#f8f6f3', canvas.renderAll.bind(canvas))

  const { width, height } = canvasSize

  // Clean light palette
  const BG = '#f8f6f3'
  const WHITE = '#ffffff'
  const DARK = '#1a1a1a'
  const CHARCOAL = '#333333'
  const MUTED = '#888888'
  const SAGE = '#6b8f71'     // Fresh sage green accent
  const WARM_GRAY = '#e8e4df'
  const PADDING = 55

  // 1. Warm background
  const bgRect = new fabricLib.Rect({
    left: 0,
    top: 0,
    width: width,
    height: height,
    fill: BG,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(bgRect)

  // 2. Large hero image with subtle rounded corners
  const heroX = PADDING
  const heroY = PADDING
  const heroW = width - PADDING * 2
  const heroH = height * 0.52

  // White border frame behind image
  const heroFrame = new fabricLib.Rect({
    left: heroX - 4,
    top: heroY - 4,
    width: heroW + 8,
    height: heroH + 8,
    rx: 16,
    ry: 16,
    fill: WHITE,
    selectable: false,
    evented: false,
    shadow: new fabricLib.Shadow({
      color: 'rgba(0, 0, 0, 0.08)',
      blur: 25,
      offsetX: 0,
      offsetY: 8,
    }),
    id: generateUniqueId(),
  })
  canvas.add(heroFrame)

  await createImageFrame(canvas, fabricLib, images[0] || '', heroX, heroY, heroW, heroH, { cornerRadius: 12 })

  // 3. "FOR SALE" badge on hero
  const badgeW = 120
  const badgeBg = new fabricLib.Rect({
    left: heroX + 20,
    top: heroY + 20,
    width: badgeW,
    height: 36,
    rx: 6,
    ry: 6,
    fill: SAGE,
    selectable: true,
    evented: true,
    shadow: new fabricLib.Shadow({
      color: 'rgba(107,143,113,0.3)',
      blur: 12,
      offsetX: 0,
      offsetY: 4,
    }),
    id: generateUniqueId(),
  })
  canvas.add(badgeBg)

  const badgeText = new fabricLib.Textbox('FOR SALE', {
    left: heroX + 20,
    top: heroY + 28,
    width: badgeW,
    fontSize: 12,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 700,
    fill: WHITE,
    textAlign: 'center',
    selectable: true,
    editable: true,
    letterSpacing: 2,
    lineHeight: 1,
    id: generateUniqueId(),
  })
  canvas.add(badgeText)

  // 4. Content area below hero
  const contentY = heroY + heroH + 30

  // Property type
  const typeValue = (propertyInfo?.property_type || 'Single Family Home').toUpperCase()

  const typeText = new fabricLib.Textbox(typeValue, {
    left: PADDING,
    top: contentY,
    fontSize: 11,
    fontFamily: "'Inter', Arial, sans-serif",
    fontWeight: 700,
    fill: SAGE,
    selectable: true,
    editable: true,
    letterSpacing: 3,
    id: generateUniqueId(),
  })
  canvas.add(typeText)

  // 5. Price
  const priceText = new fabricLib.Textbox(propertyInfo?.price || '$1,895,000', {
    left: PADDING,
    top: contentY + 22,
    fontSize: 52,
    fontFamily: "'Poppins', Arial, sans-serif",
    fontWeight: 800,
    fill: DARK,
    selectable: true,
    editable: true,
    lineHeight: 1.1,
    id: generateUniqueId(),
  })
  canvas.add(priceText)

  // 6. Subtle divider line
  const dividerY = contentY + 85
  const divider = new fabricLib.Rect({
    left: PADDING,
    top: dividerY,
    width: 60,
    height: 3,
    fill: SAGE,
    rx: 1.5,
    ry: 1.5,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(divider)

  // 7. Address
  const address = propertyInfo?.address || '742 Evergreen Terrace'
  const cityState = propertyInfo
    ? `${propertyInfo.city || 'Portland'}, ${propertyInfo.state || 'OR'} ${propertyInfo.zip_code || '97201'}`
    : 'Portland, OR 97201'

  const addressText = new fabricLib.Textbox(address, {
    left: PADDING,
    top: dividerY + 18,
    fontSize: 22,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 600,
    fill: CHARCOAL,
    selectable: true,
    editable: true,
    width: width * 0.55,
    lineHeight: 1.3,
    id: generateUniqueId(),
  })
  canvas.add(addressText)

  const cityText = new fabricLib.Textbox(cityState, {
    left: PADDING,
    top: dividerY + 48,
    fontSize: 14,
    fontFamily: "'Inter', Arial, sans-serif",
    fontWeight: 400,
    fill: MUTED,
    selectable: true,
    editable: true,
    id: generateUniqueId(),
  })
  canvas.add(cityText)

  // 8. Stat cards - right side, aligned with content
  const beds = propertyInfo?.bedrooms || '4'
  const baths = propertyInfo?.bathrooms || '3'
  const sqft = propertyInfo?.square_feet ? Number(propertyInfo.square_feet).toLocaleString() : '2,450'

  const stats = [
    { value: `${beds}`, label: 'Beds' },
    { value: `${baths}`, label: 'Baths' },
    { value: sqft, label: 'Sq Ft' },
  ]

  const statCardW = 120
  const statCardH = 80
  const statGap = 12
  const statsStartX = width - PADDING - (statCardW * 3 + statGap * 2)
  const statsY = contentY + 10

  stats.forEach((stat, i) => {
    const x = statsStartX + i * (statCardW + statGap)

    const card = new fabricLib.Rect({
      left: x,
      top: statsY,
      width: statCardW,
      height: statCardH,
      rx: 12,
      ry: 12,
      fill: WHITE,
      selectable: false,
      evented: false,
      shadow: new fabricLib.Shadow({
        color: 'rgba(0, 0, 0, 0.06)',
        blur: 15,
        offsetX: 0,
        offsetY: 4,
      }),
      id: generateUniqueId(),
    })
    canvas.add(card)

    const valText = new fabricLib.Textbox(stat.value, {
      left: x,
      top: statsY + 16,
      width: statCardW,
      fontSize: 28,
      fontFamily: "'Poppins', Arial, sans-serif",
      fontWeight: 700,
      fill: DARK,
      textAlign: 'center',
      selectable: true,
      editable: true,
      lineHeight: 1,
      id: generateUniqueId(),
    })
    canvas.add(valText)

    const lblText = new fabricLib.Textbox(stat.label, {
      left: x,
      top: statsY + 50,
      width: statCardW,
      fontSize: 12,
      fontFamily: "'Inter', Arial, sans-serif",
      fontWeight: 500,
      fill: MUTED,
      textAlign: 'center',
      selectable: true,
      editable: true,
      lineHeight: 1,
      id: generateUniqueId(),
    })
    canvas.add(lblText)
  })

  // 9. Bottom gallery - 3 small images
  const galleryY = height - PADDING - 120
  const galleryGap = 10
  const galleryImgW = (width - PADDING * 2 - galleryGap * 2) / 3
  const galleryImgH = 110

  const galleryImages = [
    images[1] || images[0],
    images[2] || images[0],
    images[3] || images[0],
  ]

  for (let i = 0; i < 3; i++) {
    const imgX = PADDING + i * (galleryImgW + galleryGap)

    // White frame
    const frame = new fabricLib.Rect({
      left: imgX - 3,
      top: galleryY - 3,
      width: galleryImgW + 6,
      height: galleryImgH + 6,
      rx: 10,
      ry: 10,
      fill: WHITE,
      selectable: false,
      evented: false,
      shadow: new fabricLib.Shadow({
        color: 'rgba(0, 0, 0, 0.06)',
        blur: 12,
        offsetX: 0,
        offsetY: 3,
      }),
      id: generateUniqueId(),
    })
    canvas.add(frame)

    await createImageFrame(
      canvas,
      fabricLib,
      galleryImages[i],
      imgX,
      galleryY,
      galleryImgW,
      galleryImgH,
      { cornerRadius: 8 }
    )
  }

  // Final render
  setTimeout(() => {
    bringTextToFront(canvas)
    saveToHistory(canvas)
  }, 500)
}
