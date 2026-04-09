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
  year_built?: string | number
}

export const applyMinimalTemplate = async (
  canvas: any,
  fabricLib: any,
  images: string[],
  propertyInfo: PropertyInfo,
  canvasSize: { width: number; height: number },
  saveToHistory: (canvas: any) => void
) => {
  if (!canvas) return

  canvas.clear()
  canvas.setBackgroundColor('#111318', canvas.renderAll.bind(canvas))

  const { width, height } = canvasSize

  // Refined dark palette
  const BG_DARK = '#111318'
  const BG_CARD = '#1a1f2e'
  const PRIMARY = '#ffffff'
  const ACCENT = '#c0392b'
  const GOLD = '#c9a96e'
  const TEXT_MUTED = '#8899aa'
  const PADDING = 65

  // 1. Hero image - top 58%
  const heroHeight = height * 0.58
  await createImageFrame(canvas, fabricLib, images[0] || '', 0, 0, width, heroHeight, { cornerRadius: 0 })

  // 2. Subtle vignette overlay on hero
  const heroOverlay = new fabricLib.Rect({
    left: 0,
    top: 0,
    width: width,
    height: heroHeight,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: heroHeight },
      colorStops: [
        { offset: 0, color: 'rgba(0,0,0,0.05)' },
        { offset: 0.5, color: 'rgba(0,0,0,0)' },
        { offset: 0.85, color: 'rgba(0,0,0,0.3)' },
        { offset: 1, color: 'rgba(17,19,24,1)' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(heroOverlay)

  // 3. Dark info section
  const infoTop = heroHeight
  const infoBg = new fabricLib.Rect({
    left: 0,
    top: infoTop,
    width: width,
    height: height - heroHeight,
    fill: BG_DARK,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(infoBg)

  // 4. Thin gold accent line at transition
  const topBorder = new fabricLib.Rect({
    left: PADDING,
    top: infoTop,
    width: width - PADDING * 2,
    height: 2,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: width - PADDING * 2, y2: 0 },
      colorStops: [
        { offset: 0, color: GOLD },
        { offset: 0.5, color: 'rgba(201,169,110,0.3)' },
        { offset: 1, color: GOLD },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(topBorder)

  const contentTop = infoTop + 28

  // 5. Property type + Price row
  const typeValue = (propertyInfo?.property_type || 'Luxury Home').toUpperCase()

  const typeText = new fabricLib.Textbox(typeValue, {
    left: PADDING,
    top: contentTop,
    width: 300,
    fontSize: 12,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 700,
    fill: GOLD,
    selectable: true,
    editable: true,
    letterSpacing: 3,
    lineHeight: 1,
    id: generateUniqueId(),
  })
  canvas.add(typeText)

  // 6. Price - Large and bold
  const priceText = new fabricLib.Textbox(propertyInfo?.price || '$2,450,000', {
    left: PADDING,
    top: contentTop + 28,
    fontSize: 62,
    fontFamily: "'Poppins', Arial, sans-serif",
    fontWeight: 800,
    fill: PRIMARY,
    selectable: true,
    editable: true,
    lineHeight: 1,
    id: generateUniqueId(),
  })
  canvas.add(priceText)

  // 7. Address block
  const fullAddress = propertyInfo?.address || '123 Luxury Lane'
  const cityState = propertyInfo
    ? `${propertyInfo.city || 'Los Angeles'}, ${propertyInfo.state || 'CA'} ${propertyInfo.zip_code || '90001'}`
    : 'Los Angeles, CA 90001'

  const addressText = new fabricLib.Textbox(fullAddress, {
    left: PADDING,
    top: contentTop + 105,
    fontSize: 20,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 600,
    fill: PRIMARY,
    selectable: true,
    editable: true,
    width: width - PADDING * 2,
    lineHeight: 1.2,
    id: generateUniqueId(),
  })
  canvas.add(addressText)

  const cityText = new fabricLib.Textbox(cityState, {
    left: PADDING,
    top: contentTop + 133,
    fontSize: 14,
    fontFamily: "'Inter', Arial, sans-serif",
    fontWeight: 400,
    fill: TEXT_MUTED,
    selectable: true,
    editable: true,
    id: generateUniqueId(),
  })
  canvas.add(cityText)

  // 8. Property stat pills
  const beds = propertyInfo?.bedrooms || '5'
  const baths = propertyInfo?.bathrooms || '4.5'
  const sqft = propertyInfo?.square_feet ? Number(propertyInfo.square_feet).toLocaleString() : '3,800'

  const pillData = [
    { text: `${beds} Beds`, w: 100 },
    { text: `${baths} Baths`, w: 110 },
    { text: `${sqft} Sq Ft`, w: 130 },
  ]

  const pillY = contentTop + 168
  const pillH = 38
  const pillGap = 12
  let pillX = PADDING

  pillData.forEach((pill) => {
    const pillBg = new fabricLib.Rect({
      left: pillX,
      top: pillY,
      width: pill.w,
      height: pillH,
      rx: 19,
      ry: 19,
      fill: BG_CARD,
      stroke: 'rgba(201,169,110,0.25)',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      id: generateUniqueId(),
    })
    canvas.add(pillBg)

    const pillText = new fabricLib.Textbox(pill.text, {
      left: pillX + 5,
      top: pillY + 10,
      width: pill.w - 10,
      fontSize: 14,
      fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
      fontWeight: 600,
      fill: GOLD,
      textAlign: 'center',
      selectable: true,
      editable: true,
      lineHeight: 1,
      id: generateUniqueId(),
    })
    canvas.add(pillText)

    pillX += pill.w + pillGap
  })

  // 9. Bottom gallery - 3 images with refined styling
  const galleryTop = height - 130
  const gallerySpacing = 10
  const galleryImgWidth = (width - PADDING * 2 - gallerySpacing * 2) / 3
  const galleryImgHeight = 115

  const galleryImages = [
    images[1] || images[0],
    images[2] || images[0],
    images[3] || images[0],
  ]

  for (let i = 0; i < 3; i++) {
    const imgX = PADDING + i * (galleryImgWidth + gallerySpacing)

    // Subtle card background
    const imgCard = new fabricLib.Rect({
      left: imgX - 2,
      top: galleryTop - 2,
      width: galleryImgWidth + 4,
      height: galleryImgHeight + 4,
      fill: BG_CARD,
      rx: 10,
      ry: 10,
      selectable: false,
      evented: false,
      shadow: new fabricLib.Shadow({
        color: 'rgba(0, 0, 0, 0.4)',
        blur: 12,
        offsetX: 0,
        offsetY: 4,
      }),
      id: generateUniqueId(),
    })
    canvas.add(imgCard)

    await createImageFrame(
      canvas,
      fabricLib,
      galleryImages[i],
      imgX,
      galleryTop,
      galleryImgWidth,
      galleryImgHeight,
      { cornerRadius: 8 }
    )
  }

  // Final render
  setTimeout(() => {
    bringTextToFront(canvas)
    saveToHistory(canvas)
  }, 500)
}
