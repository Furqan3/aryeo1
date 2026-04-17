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

export const applyRealEstateTemplate = async (
  canvas: any,
  fabricLib: any,
  images: string[],
  propertyInfo: PropertyInfo,
  canvasSize: { width: number; height: number },
  saveToHistory?: (canvas: any) => void
) => {
  if (!canvas) return

  canvas.clear()
  canvas.setBackgroundColor('#0d1117', canvas.renderAll.bind(canvas))

  const { width, height } = canvasSize

  // Refined color palette
  const ACCENT = '#c0392b'
  const GOLD = '#d4a574'
  const WHITE = '#ffffff'
  const TEXT_LIGHT = '#f0f0f0'
  const PADDING = 55
  const GAP = 14

  // Layout
  const LEFT_WIDTH = width * 0.62
  const RIGHT_WIDTH = width - LEFT_WIDTH - GAP
  const RIGHT_X = LEFT_WIDTH + GAP
  const SMALL_IMG_HEIGHT = (height - GAP * 2 - 70) / 3

  // 1. Full background hero image
  await createImageFrame(canvas, fabricLib, images[0] || '', 0, 0, LEFT_WIDTH, height, { cornerRadius: 0 })

  // 2. Cinematic gradient overlay on hero
  const heroOverlay = new fabricLib.Rect({
    left: 0,
    top: 0,
    width: LEFT_WIDTH,
    height: height,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: height },
      colorStops: [
        { offset: 0, color: 'rgba(0,0,0,0.15)' },
        { offset: 0.4, color: 'rgba(0,0,0,0.05)' },
        { offset: 0.7, color: 'rgba(0,0,0,0.25)' },
        { offset: 1, color: 'rgba(0,0,0,0.75)' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(heroOverlay)

  // 3. Right column dark background
  const rightBg = new fabricLib.Rect({
    left: LEFT_WIDTH,
    top: 0,
    width: RIGHT_WIDTH + GAP,
    height: height,
    fill: '#111827',
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(rightBg)

  // 4. Three detail images on right
  const imagesToAdd = [
    { img: images[1] || images[0], y: 50 },
    { img: images[2] || images[0], y: 50 + SMALL_IMG_HEIGHT + GAP },
    { img: images[3] || images[0], y: 50 + SMALL_IMG_HEIGHT * 2 + GAP * 2 },
  ]

  for (const imageData of imagesToAdd) {
    await createImageFrame(canvas, fabricLib, imageData.img, RIGHT_X, imageData.y, RIGHT_WIDTH - 10, SMALL_IMG_HEIGHT, { cornerRadius: 8 })
  }

  // 5. Top-left corner frame accent
  const cornerTopH = new fabricLib.Rect({
    left: PADDING - 10,
    top: PADDING - 10,
    width: 80,
    height: 3,
    fill: GOLD,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(cornerTopH)

  const cornerTopV = new fabricLib.Rect({
    left: PADDING - 10,
    top: PADDING - 10,
    width: 3,
    height: 80,
    fill: GOLD,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(cornerTopV)

  // 7. Property Type Tag
  const typeValue = (propertyInfo?.property_type || 'Luxury Villa').toUpperCase()

  const typeBg = new fabricLib.Rect({
    left: PADDING,
    top: PADDING + 25,
    width: 180,
    height: 36,
    rx: 4,
    ry: 4,
    fill: ACCENT,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(typeBg)

  const typeText = new fabricLib.Textbox(typeValue, {
    left: PADDING + 14,
    top: PADDING + 31,
    fontSize: 13,
    fontWeight: 700,
    fill: WHITE,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    selectable: true,
    evented: true,
    editable: true,
    letterSpacing: 2.5,
    width: 155,
    id: generateUniqueId(),
  })
  canvas.add(typeText)

  // 8. Price badge - frosted glass style
  const priceValue = propertyInfo?.price || '$1,250,000'

  const priceBg = new fabricLib.Rect({
    left: PADDING,
    top: PADDING + 75,
    rx: 10,
    ry: 10,
    width: 420,
    height: 90,
    fill: 'rgba(0, 0, 0, 0.65)',
    stroke: 'rgba(212, 165, 116, 0.5)',
    strokeWidth: 1.5,
    selectable: true,
    evented: true,
    shadow: new fabricLib.Shadow({
      color: 'rgba(0, 0, 0, 0.5)',
      blur: 30,
      offsetX: 0,
      offsetY: 10,
    }),
    id: generateUniqueId(),
  })
  canvas.add(priceBg)

  const priceText = new fabricLib.Textbox(priceValue, {
    left: PADDING + 25,
    top: PADDING + 90,
    fontSize: 54,
    fontWeight: 800,
    fill: GOLD,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    selectable: true,
    evented: true,
    editable: true,
    width: 380,
    id: generateUniqueId(),
  })
  canvas.add(priceText)

  // 9. Footer area with property info
  const footerY = height - 260

  // Gradient footer
  const footerBand = new fabricLib.Rect({
    left: 0,
    top: footerY,
    width: LEFT_WIDTH,
    height: 260,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: 260 },
      colorStops: [
        { offset: 0, color: 'rgba(0, 0, 0, 0)' },
        { offset: 0.4, color: 'rgba(0, 0, 0, 0.5)' },
        { offset: 1, color: 'rgba(0, 0, 0, 0.85)' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(footerBand)

  // Gold accent line
  const accentLine = new fabricLib.Rect({
    left: PADDING,
    top: footerY + 50,
    width: 60,
    height: 4,
    fill: GOLD,
    rx: 2,
    ry: 2,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(accentLine)

  // Address
  const address = propertyInfo?.address || '123 Ocean Drive'
  const cityLine = propertyInfo
    ? `${propertyInfo.city || 'Miami Beach'}, ${propertyInfo.state || 'FL'} ${propertyInfo.zip_code || '33139'}`
    : 'Miami Beach, FL 33139'

  const addressText = new fabricLib.Textbox(address, {
    left: PADDING,
    top: footerY + 65,
    fontSize: 28,
    fontWeight: 700,
    fill: WHITE,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    selectable: true,
    evented: true,
    editable: true,
    width: LEFT_WIDTH - PADDING * 2,
    lineHeight: 1.15,
    shadow: new fabricLib.Shadow({
      color: 'rgba(0,0,0,0.5)',
      blur: 10,
      offsetX: 0,
      offsetY: 4,
    }),
    id: generateUniqueId(),
  })
  canvas.add(addressText)

  const cityText = new fabricLib.Textbox(cityLine, {
    left: PADDING,
    top: footerY + 115,
    fontSize: 16,
    fontWeight: 400,
    fill: 'rgba(255,255,255,0.7)',
    fontFamily: "'Inter', Arial, sans-serif",
    selectable: true,
    evented: true,
    editable: true,
    width: LEFT_WIDTH - PADDING * 2,
    lineHeight: 1.2,
    id: generateUniqueId(),
  })
  canvas.add(cityText)

  // 10. Stat cards row
  const beds = propertyInfo?.bedrooms || '4'
  const baths = propertyInfo?.bathrooms || '3'
  const sqft = propertyInfo?.square_feet ? Number(propertyInfo.square_feet).toLocaleString() : '2,800'

  const statCardWidth = 135
  const statCardHeight = 65
  const statCardGap = 14
  const statY = footerY + 160

  const stats = [
    { value: `${beds}`, label: 'BEDS' },
    { value: `${baths}`, label: 'BATHS' },
    { value: sqft, label: 'SQ FT' },
  ]

  stats.forEach((stat, i) => {
    const x = PADDING + i * (statCardWidth + statCardGap)

    // Card background
    const cardBg = new fabricLib.Rect({
      left: x,
      top: statY,
      width: statCardWidth,
      height: statCardHeight,
      rx: 8,
      ry: 8,
      fill: 'rgba(255, 255, 255, 0.08)',
      stroke: 'rgba(212, 165, 116, 0.3)',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      id: generateUniqueId(),
    })
    canvas.add(cardBg)

    // Stat value
    const valueText = new fabricLib.Textbox(stat.value, {
      left: x + 15,
      top: statY + 10,
      fontSize: 24,
      fontWeight: 800,
      fill: GOLD,
      fontFamily: "'Poppins', Arial, sans-serif",
      selectable: true,
      evented: true,
      editable: true,
      width: statCardWidth - 30,
      id: generateUniqueId(),
    })
    canvas.add(valueText)

    // Stat label
    const labelText = new fabricLib.Textbox(stat.label, {
      left: x + 15,
      top: statY + 38,
      fontSize: 11,
      fontWeight: 600,
      fill: 'rgba(255,255,255,0.5)',
      fontFamily: "'Inter', Arial, sans-serif",
      selectable: true,
      evented: true,
      editable: true,
      letterSpacing: 1.5,
      width: statCardWidth - 30,
      id: generateUniqueId(),
    })
    canvas.add(labelText)
  })

  // Final render
  setTimeout(() => {
    bringTextToFront(canvas)
    if (saveToHistory) saveToHistory(canvas)
  }, 500)
}
