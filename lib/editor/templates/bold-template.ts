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
  canvas.setBackgroundColor('#080b12', canvas.renderAll.bind(canvas))

  const { width, height } = canvasSize

  const NAVY = '#080b12'
  const GOLD = '#d9a84a'
  const WHITE = '#ffffff'
  const MUTED = 'rgba(255,255,255,0.65)'
  const PADDING = 70

  // 1. Full-bleed hero image
  await createImageFrame(canvas, fabricLib, images[0] || '', 0, 0, width, height, { cornerRadius: 0 })

  // 2. Top gradient scrim for header text
  const topScrim = new fabricLib.Rect({
    left: 0,
    top: 0,
    width: width,
    height: 200,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: 200 },
      colorStops: [
        { offset: 0, color: 'rgba(8,11,18,0.75)' },
        { offset: 1, color: 'rgba(8,11,18,0)' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(topScrim)

  // 3. Bottom gradient scrim for info block
  const bottomScrim = new fabricLib.Rect({
    left: 0,
    top: height - 500,
    width: width,
    height: 500,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: 500 },
      colorStops: [
        { offset: 0, color: 'rgba(8,11,18,0)' },
        { offset: 0.45, color: 'rgba(8,11,18,0.55)' },
        { offset: 1, color: 'rgba(8,11,18,0.95)' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(bottomScrim)

  // 4. Header - FEATURED LISTING label
  const headerDot = new fabricLib.Circle({
    left: PADDING,
    top: PADDING + 6,
    radius: 5,
    fill: GOLD,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(headerDot)

  const headerLabel = new fabricLib.Textbox('FEATURED LISTING', {
    left: PADDING + 22,
    top: PADDING,
    width: 400,
    fontSize: 13,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 700,
    fill: GOLD,
    letterSpacing: 4,
    lineHeight: 1,
    selectable: true,
    editable: true,
    id: generateUniqueId(),
  })
  canvas.add(headerLabel)

  // 5. Top-right property type tag
  const propertyType = (propertyInfo?.property_type || 'Luxury Residence').toUpperCase()
  const typeTag = new fabricLib.Textbox(propertyType, {
    left: width - PADDING - 400,
    top: PADDING,
    width: 400,
    fontSize: 13,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 600,
    fill: WHITE,
    letterSpacing: 3,
    textAlign: 'right',
    lineHeight: 1,
    selectable: true,
    editable: true,
    id: generateUniqueId(),
  })
  canvas.add(typeTag)

  // 6. Info block starts here
  const blockLeft = PADDING
  const blockRight = width - PADDING
  const blockWidth = blockRight - blockLeft

  // Gold accent line above the address
  const addressAccent = new fabricLib.Rect({
    left: blockLeft,
    top: height - 400,
    width: 72,
    height: 3,
    fill: GOLD,
    rx: 1.5,
    ry: 1.5,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(addressAccent)

  // 7. Address
  const address = propertyInfo?.address || '123 Ocean Drive'
  const cityLine = propertyInfo
    ? `${propertyInfo.city || 'Miami Beach'}, ${propertyInfo.state || 'FL'} ${propertyInfo.zip_code || '33139'}`
    : 'Miami Beach, FL 33139'

  const addressText = new fabricLib.Textbox(address, {
    left: blockLeft,
    top: height - 380,
    width: blockWidth,
    fontSize: 30,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 600,
    fill: WHITE,
    lineHeight: 1.1,
    selectable: true,
    editable: true,
    id: generateUniqueId(),
  })
  canvas.add(addressText)

  const cityText = new fabricLib.Textbox(cityLine, {
    left: blockLeft,
    top: height - 340,
    width: blockWidth,
    fontSize: 16,
    fontFamily: "'Inter', Arial, sans-serif",
    fontWeight: 400,
    fill: MUTED,
    letterSpacing: 1,
    lineHeight: 1.2,
    selectable: true,
    editable: true,
    id: generateUniqueId(),
  })
  canvas.add(cityText)

  // 8. Price - dominant focal point
  const priceValue = propertyInfo?.price || '$2,450,000'
  const priceText = new fabricLib.Textbox(priceValue, {
    left: blockLeft,
    top: height - 280,
    width: blockWidth,
    fontSize: 108,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 800,
    fill: WHITE,
    lineHeight: 1,
    shadow: new fabricLib.Shadow({
      color: 'rgba(0,0,0,0.55)',
      blur: 24,
      offsetX: 0,
      offsetY: 8,
    }),
    selectable: true,
    editable: true,
    id: generateUniqueId(),
  })
  canvas.add(priceText)

  // 9. Divider between price and stats
  const divider = new fabricLib.Rect({
    left: blockLeft,
    top: height - 150,
    width: blockWidth,
    height: 1,
    fill: 'rgba(217,168,74,0.35)',
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(divider)

  // 10. Stats row - clean editorial columns
  const beds = propertyInfo?.bedrooms || '5'
  const baths = propertyInfo?.bathrooms || '4'
  const sqft = propertyInfo?.square_feet ? Number(propertyInfo.square_feet).toLocaleString() : '3,800'

  const stats = [
    { label: 'BEDROOMS', value: `${beds}` },
    { label: 'BATHROOMS', value: `${baths}` },
    { label: 'SQ FT', value: sqft },
  ]

  const statsTop = height - 115
  const colWidth = blockWidth / 3

  stats.forEach((stat, i) => {
    const colX = blockLeft + colWidth * i

    const labelText = new fabricLib.Textbox(stat.label, {
      left: colX,
      top: statsTop,
      width: colWidth,
      fontSize: 11,
      fontFamily: "'Inter', Arial, sans-serif",
      fontWeight: 600,
      fill: GOLD,
      letterSpacing: 2.5,
      textAlign: 'left',
      lineHeight: 1,
      selectable: true,
      editable: true,
      id: generateUniqueId(),
    })
    canvas.add(labelText)

    const valueText = new fabricLib.Textbox(stat.value, {
      left: colX,
      top: statsTop + 22,
      width: colWidth,
      fontSize: 38,
      fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
      fontWeight: 700,
      fill: WHITE,
      textAlign: 'left',
      lineHeight: 1,
      selectable: true,
      editable: true,
      id: generateUniqueId(),
    })
    canvas.add(valueText)
  })

  // 11. Corner frame marks (bottom-right)
  const cornerSize = 32
  const cornerOffset = 28
  const cornerBR_H = new fabricLib.Rect({
    left: width - cornerOffset - cornerSize,
    top: height - cornerOffset - 2,
    width: cornerSize,
    height: 2,
    fill: GOLD,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(cornerBR_H)

  const cornerBR_V = new fabricLib.Rect({
    left: width - cornerOffset - 2,
    top: height - cornerOffset - cornerSize,
    width: 2,
    height: cornerSize,
    fill: GOLD,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(cornerBR_V)

  // Top-left corner frame marks
  const cornerTL_H = new fabricLib.Rect({
    left: cornerOffset,
    top: cornerOffset,
    width: cornerSize,
    height: 2,
    fill: GOLD,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(cornerTL_H)

  const cornerTL_V = new fabricLib.Rect({
    left: cornerOffset,
    top: cornerOffset,
    width: 2,
    height: cornerSize,
    fill: GOLD,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(cornerTL_V)

  // Final render & save
  setTimeout(() => {
    bringTextToFront(canvas)
    saveToHistory(canvas)
  }, 400)
}
