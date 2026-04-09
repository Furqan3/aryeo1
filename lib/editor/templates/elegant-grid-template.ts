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

export const applyElegantGridTemplate = async (
  canvas: any,
  fabricLib: any,
  images: string[],
  propertyInfo: PropertyInfo,
  canvasSize: { width: number; height: number },
  saveToHistory: (canvas: any) => void
) => {
  if (!canvas) return

  canvas.clear()
  canvas.setBackgroundColor('#0e0e12', canvas.renderAll.bind(canvas))

  const { width, height } = canvasSize

  // Elegant palette
  const BG = '#0e0e12'
  const EMERALD = '#2ecc71'
  const GOLD = '#c9a96e'
  const WHITE = '#ffffff'
  const TEXT_MUTED = '#8a8a9a'
  const GAP = 8
  const PADDING = 50

  // Grid layout: 2x2 mosaic with center info overlay
  const halfW = (width - GAP) / 2
  const halfH = (height - GAP) / 2

  // 1. Four images in a 2x2 grid
  await createImageFrame(canvas, fabricLib, images[0] || '', 0, 0, halfW, halfH, { cornerRadius: 0 })
  await createImageFrame(canvas, fabricLib, images[1] || images[0], halfW + GAP, 0, halfW, halfH, { cornerRadius: 0 })
  await createImageFrame(canvas, fabricLib, images[2] || images[0], 0, halfH + GAP, halfW, halfH, { cornerRadius: 0 })
  await createImageFrame(canvas, fabricLib, images[3] || images[0], halfW + GAP, halfH + GAP, halfW, halfH, { cornerRadius: 0 })

  // 2. Full overlay to darken
  const fullOverlay = new fabricLib.Rect({
    left: 0,
    top: 0,
    width: width,
    height: height,
    fill: 'rgba(14, 14, 18, 0.45)',
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(fullOverlay)

  // 3. Grid line separators (cross pattern)
  const hLine = new fabricLib.Rect({
    left: 0,
    top: halfH,
    width: width,
    height: GAP,
    fill: BG,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(hLine)

  const vLine = new fabricLib.Rect({
    left: halfW,
    top: 0,
    width: GAP,
    height: height,
    fill: BG,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(vLine)

  // 4. Center info panel - frosted glass card
  const cardW = 520
  const cardH = 380
  const cardX = (width - cardW) / 2
  const cardY = (height - cardH) / 2

  // Outer glow
  const cardGlow = new fabricLib.Rect({
    left: cardX - 4,
    top: cardY - 4,
    width: cardW + 8,
    height: cardH + 8,
    rx: 20,
    ry: 20,
    fill: 'transparent',
    stroke: 'rgba(201,169,110,0.15)',
    strokeWidth: 2,
    selectable: false,
    evented: false,
    shadow: new fabricLib.Shadow({
      color: 'rgba(201,169,110,0.1)',
      blur: 40,
      offsetX: 0,
      offsetY: 0,
    }),
    id: generateUniqueId(),
  })
  canvas.add(cardGlow)

  // Card background
  const cardBg = new fabricLib.Rect({
    left: cardX,
    top: cardY,
    width: cardW,
    height: cardH,
    rx: 16,
    ry: 16,
    fill: 'rgba(14, 14, 18, 0.88)',
    stroke: 'rgba(201,169,110,0.3)',
    strokeWidth: 1,
    selectable: true,
    evented: true,
    shadow: new fabricLib.Shadow({
      color: 'rgba(0, 0, 0, 0.6)',
      blur: 50,
      offsetX: 0,
      offsetY: 15,
    }),
    id: generateUniqueId(),
  })
  canvas.add(cardBg)

  // 5. Decorative top accent on card
  const cardAccent = new fabricLib.Rect({
    left: cardX + cardW / 2 - 40,
    top: cardY,
    width: 80,
    height: 3,
    fill: GOLD,
    rx: 1.5,
    ry: 1.5,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(cardAccent)

  // 6. Property type
  const typeValue = (propertyInfo?.property_type || 'Exclusive Listing').toUpperCase()

  const typeText = new fabricLib.Textbox(typeValue, {
    left: cardX,
    top: cardY + 35,
    width: cardW,
    fontSize: 12,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 700,
    fill: GOLD,
    textAlign: 'center',
    selectable: true,
    editable: true,
    letterSpacing: 4,
    lineHeight: 1,
    id: generateUniqueId(),
  })
  canvas.add(typeText)

  // 7. Price - centered hero text
  const priceText = new fabricLib.Textbox(propertyInfo?.price || '$3,750,000', {
    left: cardX + 20,
    top: cardY + 65,
    width: cardW - 40,
    fontSize: 60,
    fontFamily: "'Poppins', Arial, sans-serif",
    fontWeight: 800,
    fill: WHITE,
    textAlign: 'center',
    selectable: true,
    editable: true,
    lineHeight: 1.1,
    id: generateUniqueId(),
  })
  canvas.add(priceText)

  // Decorative divider
  const dividerW = 180
  const dividerY = cardY + 150
  const dividerLeft = new fabricLib.Rect({
    left: cardX + cardW / 2 - dividerW / 2,
    top: dividerY,
    width: dividerW / 2 - 15,
    height: 1,
    fill: 'rgba(201,169,110,0.5)',
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(dividerLeft)

  const dividerDiamond = new fabricLib.Rect({
    left: cardX + cardW / 2 - 5,
    top: dividerY - 4,
    width: 8,
    height: 8,
    fill: GOLD,
    angle: 45,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(dividerDiamond)

  const dividerRight = new fabricLib.Rect({
    left: cardX + cardW / 2 + 15,
    top: dividerY,
    width: dividerW / 2 - 15,
    height: 1,
    fill: 'rgba(201,169,110,0.5)',
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(dividerRight)

  // 8. Address
  const fullAddress = propertyInfo?.address || '456 Prestige Avenue'
  const cityState = propertyInfo
    ? `${propertyInfo.city || 'Beverly Hills'}, ${propertyInfo.state || 'CA'} ${propertyInfo.zip_code || '90210'}`
    : 'Beverly Hills, CA 90210'

  const addressText = new fabricLib.Textbox(fullAddress, {
    left: cardX + 20,
    top: dividerY + 25,
    width: cardW - 40,
    fontSize: 22,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 600,
    fill: WHITE,
    textAlign: 'center',
    selectable: true,
    editable: true,
    lineHeight: 1.3,
    id: generateUniqueId(),
  })
  canvas.add(addressText)

  const cityText = new fabricLib.Textbox(cityState, {
    left: cardX + 20,
    top: dividerY + 58,
    width: cardW - 40,
    fontSize: 14,
    fontFamily: "'Inter', Arial, sans-serif",
    fontWeight: 400,
    fill: TEXT_MUTED,
    textAlign: 'center',
    selectable: true,
    editable: true,
    id: generateUniqueId(),
  })
  canvas.add(cityText)

  // 9. Stats row at bottom of card
  const beds = propertyInfo?.bedrooms || '6'
  const baths = propertyInfo?.bathrooms || '5'
  const sqft = propertyInfo?.square_feet ? Number(propertyInfo.square_feet).toLocaleString() : '5,200'

  const stats = [
    { value: `${beds}`, label: 'BEDS' },
    { value: `${baths}`, label: 'BATHS' },
    { value: sqft, label: 'SQ FT' },
  ]

  const statsY = cardY + cardH - 90
  const statColW = cardW / 3

  stats.forEach((stat, i) => {
    const cx = cardX + statColW * i + statColW / 2

    const valText = new fabricLib.Textbox(stat.value, {
      left: cx - 50,
      top: statsY,
      width: 100,
      fontSize: 30,
      fontFamily: "'Poppins', Arial, sans-serif",
      fontWeight: 700,
      fill: WHITE,
      textAlign: 'center',
      selectable: true,
      editable: true,
      lineHeight: 1,
      id: generateUniqueId(),
    })
    canvas.add(valText)

    const lblText = new fabricLib.Textbox(stat.label, {
      left: cx - 50,
      top: statsY + 35,
      width: 100,
      fontSize: 10,
      fontFamily: "'Inter', Arial, sans-serif",
      fontWeight: 600,
      fill: GOLD,
      textAlign: 'center',
      selectable: true,
      editable: true,
      letterSpacing: 2,
      lineHeight: 1,
      id: generateUniqueId(),
    })
    canvas.add(lblText)

    // Separators
    if (i < 2) {
      const sep = new fabricLib.Rect({
        left: cardX + statColW * (i + 1),
        top: statsY + 5,
        width: 1,
        height: 35,
        fill: 'rgba(201,169,110,0.3)',
        selectable: false,
        evented: false,
        id: generateUniqueId(),
      })
      canvas.add(sep)
    }
  })

  // Final render
  setTimeout(() => {
    bringTextToFront(canvas)
    saveToHistory(canvas)
  }, 500)
}
