import { createImageFrame, generateUniqueId } from '../canvas-helpers'

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
  canvasSize: { width: number; height: number }
) => {
  if (!canvas) return

  canvas.clear()
  canvas.setBackgroundColor('#0d1117', canvas.renderAll.bind(canvas))

  const { width, height } = canvasSize

  // Professional color palette
  const PRIMARY = '#1a1a1a'
  const SECONDARY = '#2c3e50'
  const ACCENT = '#e74c3c'
  const GOLD = '#d4a574'
  const WHITE = '#ffffff'
  const TEXT_LIGHT = '#ecf0f1'
  const PADDING = 60
  const GAP = 18

  // Layout
  const LEFT_WIDTH = width * 0.65
  const RIGHT_WIDTH = width - LEFT_WIDTH - GAP
  const SMALL_IMG_HEIGHT = (height - GAP * 2 - 80) / 3

  // 1. Full background hero image
  await createImageFrame(canvas, fabricLib, images[0] || '', 0, 0, width, height, { cornerRadius: 0 })

  // 2. Professional directional gradient overlay
  const premiumOverlay = new fabricLib.Rect({
    left: 0,
    top: 0,
    width: width,
    height: height,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: width, y2: height },
      colorStops: [
        { offset: 0, color: 'rgba(0,0,0,0.25)' },
        { offset: 0.5, color: 'rgba(0,0,0,0.35)' },
        { offset: 1, color: 'rgba(0,0,0,0.5)' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(premiumOverlay)

  // 3. Three elegant small images on the right
  const imagesToAdd = [
    { img: images[1] || '', y: 50 },
    { img: images[2] || '', y: 50 + SMALL_IMG_HEIGHT + GAP },
    { img: images[3] || '', y: 50 + SMALL_IMG_HEIGHT * 2 + GAP * 2 },
  ]

  for (const imageData of imagesToAdd) {
    await createImageFrame(canvas, fabricLib, imageData.img, LEFT_WIDTH + GAP, imageData.y, RIGHT_WIDTH, SMALL_IMG_HEIGHT, { cornerRadius: 6 })
  }

  // 4. Premium Price Badge - Professional styling
  const priceValue = propertyInfo?.price || '$1,250,000'

  const priceBg = new fabricLib.Rect({
    left: PADDING,
    top: PADDING,
    rx: 12,
    ry: 12,
    width: 480,
    height: 95,
    fill: 'rgba(20, 20, 20, 0.9)',
    stroke: GOLD,
    strokeWidth: 2,
    selectable: true,
    evented: true,
    shadow: new fabricLib.Shadow({
      color: 'rgba(212, 165, 116, 0.35)',
      blur: 25,
      offsetX: 0,
      offsetY: 10,
    }),
    id: generateUniqueId(),
  })
  canvas.add(priceBg)

  const priceText = new fabricLib.Textbox(priceValue, {
    left: PADDING + 30,
    top: PADDING + 18,
    fontSize: 58,
    fontWeight: 800,
    fill: GOLD,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    selectable: true,
    evented: true,
    editable: true,
    width: 420,
    id: generateUniqueId(),
  })
  canvas.add(priceText)

  // 5. Property Type - Professional tag
  const typeText = new fabricLib.Textbox((propertyInfo?.property_type || 'Luxury Villa').toUpperCase(), {
    left: PADDING,
    top: PADDING + 110,
    fontSize: 18,
    fontWeight: 700,
    fill: ACCENT,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    selectable: true,
    evented: true,
    editable: true,
    letterSpacing: 2.5,
    width: 500,
    id: generateUniqueId(),
  })
  canvas.add(typeText)

  // 6. Professional Footer Area
  const footerY = height - 280

  // Sophisticated gradient footer band
  const footerBand = new fabricLib.Rect({
    left: 0,
    top: footerY,
    width: width,
    height: 280,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: footerY, x2: 0, y2: height },
      colorStops: [
        { offset: 0, color: 'rgba(0, 0, 0, 0.2)' },
        { offset: 1, color: 'rgba(0, 0, 0, 0.8)' },
      ],
    }),
    selectable: true,
    evented: true,
    id: generateUniqueId(),
  })
  canvas.add(footerBand)

  // Elegant accent line
  const accentLine = new fabricLib.Rect({
    left: PADDING,
    top: footerY + 8,
    width: 120,
    height: 4,
    fill: ACCENT,
    rx: 2,
    ry: 2,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(accentLine)

  // Address - Professional layout
  const address = propertyInfo?.address || '123 Ocean Drive'
  const cityLine = propertyInfo
    ? `${propertyInfo.city}, ${propertyInfo.state} ${propertyInfo.zip_code}`
    : 'Miami Beach, FL 33139'

  const addressText = new fabricLib.Textbox(`${address}\n${cityLine}`, {
    left: PADDING,
    top: footerY + 35,
    fontSize: 32,
    fontWeight: 700,
    fill: TEXT_LIGHT,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    selectable: true,
    evented: true,
    editable: true,
    width: width * 0.55,
    lineHeight: 1.4,
    shadow: new fabricLib.Shadow({
      color: 'rgba(0,0,0,0.4)',
      blur: 15,
      offsetX: 0,
      offsetY: 6,
    }),
    id: generateUniqueId(),
  })
  canvas.add(addressText)

  // Details
  const beds = propertyInfo?.bedrooms || '4'
  const baths = propertyInfo?.bathrooms || '3'
  const sqft = propertyInfo?.square_feet ? Number(propertyInfo.square_feet).toLocaleString() : '2,800'

  const detailsText = new fabricLib.Textbox(`${beds} BEDROOMS  ${baths} BATHROOMS  ${sqft} SQ FT`, {
    left: width - PADDING - 420,
    top: footerY + 50,
    fontSize: 26,
    fontWeight: 600,
    fill: GOLD,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    selectable: true,
    evented: true,
    editable: true,
    width: 420,
    textAlign: 'right',
    letterSpacing: 1,
    id: generateUniqueId(),
  })
  canvas.add(detailsText)

  // Bring all text and editable elements to front
  setTimeout(() => {
    canvas.getObjects().forEach((obj: any) => {
      if (obj.type === 'textbox' || obj.type === 'rect' || obj.type === 'text') {
        canvas.bringToFront(obj)
      }
    })
    canvas.renderAll()
  }, 400)
}