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

export const applyBoldTemplate = async (
  canvas: any,
  fabricLib: any,
  images: string[],
  propertyInfo: PropertyInfo,
  canvasSize: { width: number; height: number },
  saveToHistory: (canvas: any) => void
) => {
  if (!canvas) return

  canvas.clear()
  canvas.setBackgroundColor('#0a1628', canvas.renderAll.bind(canvas))

  const { width, height } = canvasSize
  const heroHeight = 660
  const PADDING = 55

  // Bold luxury palette
  const NAVY = '#0a1628'
  const ACCENT = '#e74c3c'
  const GOLD = '#e8b923'
  const WHITE = '#ffffff'
  const TEXT_LIGHT = '#f5f5f5'
  const TEXT_MUTED = '#7a8ea0'

  // 1. Hero Image
  await createImageFrame(canvas, fabricLib, images[0] || '', 0, 0, width, heroHeight, { cornerRadius: 0 })

  // 2. Dramatic gradient overlay
  const overlay = new fabricLib.Rect({
    left: 0,
    top: 0,
    width: width,
    height: heroHeight,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: heroHeight },
      colorStops: [
        { offset: 0, color: 'rgba(10,22,40,0.3)' },
        { offset: 0.35, color: 'rgba(10,22,40,0.1)' },
        { offset: 0.65, color: 'rgba(10,22,40,0.2)' },
        { offset: 1, color: 'rgba(10,22,40,0.85)' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(overlay)

  // 3. Featured badge - angled pill
  const badgeBg = new fabricLib.Rect({
    left: PADDING,
    top: PADDING,
    width: 180,
    height: 48,
    rx: 6,
    ry: 6,
    fill: ACCENT,
    selectable: true,
    evented: true,
    shadow: new fabricLib.Shadow({
      color: 'rgba(231, 76, 60, 0.5)',
      blur: 25,
      offsetX: 0,
      offsetY: 8,
    }),
    id: generateUniqueId(),
  })
  canvas.add(badgeBg)

  const badgeText = new fabricLib.Textbox('FEATURED', {
    left: PADDING + 10,
    top: PADDING + 13,
    width: 160,
    fontSize: 16,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 700,
    fill: WHITE,
    textAlign: 'center',
    selectable: true,
    evented: true,
    editable: true,
    letterSpacing: 3,
    lineHeight: 1,
    id: generateUniqueId(),
  })
  canvas.add(badgeText)

  // 4. Property Type label
  const propertyType = propertyInfo?.property_type || 'Single Family Home'

  const typeLabel = new fabricLib.Textbox(propertyType.toUpperCase(), {
    left: PADDING,
    top: heroHeight - 185,
    fontSize: 14,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 700,
    fill: GOLD,
    selectable: true,
    evented: true,
    editable: true,
    letterSpacing: 3,
    id: generateUniqueId(),
  })
  canvas.add(typeLabel)

  // 5. Price - Large bold with shadow
  const priceValue = propertyInfo?.price || '$1,250,000'

  const price = new fabricLib.Textbox(priceValue, {
    left: PADDING,
    top: heroHeight - 155,
    fontSize: 64,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 800,
    fill: WHITE,
    selectable: true,
    evented: true,
    editable: true,
    shadow: new fabricLib.Shadow({
      color: 'rgba(0,0,0,0.6)',
      blur: 20,
      offsetX: 0,
      offsetY: 8,
    }),
    id: generateUniqueId(),
  })
  canvas.add(price)

  // Gold + Red dual accent underline
  const underlineGold = new fabricLib.Rect({
    left: PADDING,
    top: heroHeight - 78,
    width: 100,
    height: 4,
    fill: GOLD,
    rx: 2,
    ry: 2,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(underlineGold)

  const underlineRed = new fabricLib.Rect({
    left: PADDING + 108,
    top: heroHeight - 78,
    width: 50,
    height: 4,
    fill: ACCENT,
    rx: 2,
    ry: 2,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(underlineRed)

  // 6. Address on hero
  const address = propertyInfo?.address || '123 Ocean Drive'
  const cityLine = propertyInfo
    ? `${propertyInfo.city || 'Miami Beach'}, ${propertyInfo.state || 'FL'}`
    : 'Miami Beach, FL'

  const addressText = new fabricLib.Textbox(`${address}  |  ${cityLine}`, {
    left: PADDING,
    top: heroHeight - 60,
    fontSize: 16,
    fontFamily: "'Inter', Arial, sans-serif",
    fontWeight: 500,
    fill: 'rgba(255,255,255,0.7)',
    selectable: true,
    evented: true,
    editable: true,
    width: width - PADDING * 2,
    id: generateUniqueId(),
  })
  canvas.add(addressText)

  // 7. Two supporting images
  const bottomTop = heroHeight + 4
  const bottomImgWidth = width / 2 - 3
  const bottomImgHeight = height - heroHeight - 130

  await createImageFrame(
    canvas,
    fabricLib,
    images[1] || images[0],
    0,
    bottomTop,
    bottomImgWidth,
    bottomImgHeight,
    { cornerRadius: 0 }
  )

  await createImageFrame(
    canvas,
    fabricLib,
    images[2] || images[0],
    width / 2 + 3,
    bottomTop,
    bottomImgWidth,
    bottomImgHeight,
    { cornerRadius: 0 }
  )

  // Subtle overlay on bottom images
  const imgOverlay = new fabricLib.Rect({
    left: 0,
    top: bottomTop,
    width: width,
    height: bottomImgHeight,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: bottomImgHeight },
      colorStops: [
        { offset: 0, color: 'rgba(10,22,40,0)' },
        { offset: 0.8, color: 'rgba(10,22,40,0.3)' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(imgOverlay)

  // Vertical divider between images
  const divider = new fabricLib.Rect({
    left: width / 2 - 1.5,
    top: bottomTop,
    width: 3,
    height: bottomImgHeight,
    fill: NAVY,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(divider)

  // 8. Bottom info bar
  const infoBarHeight = 120
  const infoBar = new fabricLib.Rect({
    left: 0,
    top: height - infoBarHeight,
    width: width,
    height: infoBarHeight,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: width, y2: 0 },
      colorStops: [
        { offset: 0, color: '#0d1f35' },
        { offset: 0.5, color: '#132b45' },
        { offset: 1, color: '#0d1f35' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(infoBar)

  // Gold top border
  const infoBorder = new fabricLib.Rect({
    left: 0,
    top: height - infoBarHeight,
    width: width,
    height: 3,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: width, y2: 0 },
      colorStops: [
        { offset: 0, color: 'rgba(232,185,35,0.1)' },
        { offset: 0.3, color: GOLD },
        { offset: 0.7, color: GOLD },
        { offset: 1, color: 'rgba(232,185,35,0.1)' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(infoBorder)

  // 9. Stats in info bar - separated columns
  const beds = propertyInfo?.bedrooms || '4'
  const baths = propertyInfo?.bathrooms || '3'
  const sqft = propertyInfo?.square_feet ? Number(propertyInfo.square_feet).toLocaleString() : '2,800'

  const stats = [
    { value: `${beds}`, label: 'BEDROOMS' },
    { value: `${baths}`, label: 'BATHROOMS' },
    { value: sqft, label: 'SQ FT' },
  ]

  const colWidth = (width - PADDING * 2) / 3

  stats.forEach((stat, i) => {
    const centerX = PADDING + colWidth * i + colWidth / 2

    const valueText = new fabricLib.Textbox(stat.value, {
      left: centerX - 60,
      top: height - infoBarHeight + 25,
      width: 120,
      fontSize: 36,
      fontFamily: "'Poppins', Arial, sans-serif",
      fontWeight: 800,
      fill: WHITE,
      textAlign: 'center',
      selectable: true,
      evented: true,
      editable: true,
      lineHeight: 1,
      id: generateUniqueId(),
    })
    canvas.add(valueText)

    const labelText = new fabricLib.Textbox(stat.label, {
      left: centerX - 60,
      top: height - infoBarHeight + 70,
      width: 120,
      fontSize: 11,
      fontFamily: "'Inter', Arial, sans-serif",
      fontWeight: 600,
      fill: GOLD,
      textAlign: 'center',
      selectable: true,
      evented: true,
      editable: true,
      letterSpacing: 2,
      lineHeight: 1,
      id: generateUniqueId(),
    })
    canvas.add(labelText)

    // Vertical separators between stats
    if (i < 2) {
      const sepX = PADDING + colWidth * (i + 1)
      const sep = new fabricLib.Rect({
        left: sepX,
        top: height - infoBarHeight + 30,
        width: 1,
        height: 55,
        fill: 'rgba(232,185,35,0.25)',
        selectable: false,
        evented: false,
        id: generateUniqueId(),
      })
      canvas.add(sep)
    }
  })

  // Final render & save
  setTimeout(() => {
    bringTextToFront(canvas)
    saveToHistory(canvas)
  }, 400)
}
