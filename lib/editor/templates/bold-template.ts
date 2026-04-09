import { createImageFrame, generateUniqueId, bringTextToFront } from '../canvas-helpers'

interface PropertyInfo {
  price?: string
  property_type?: string
  city?: string
  state?: string
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
  canvas.setBackgroundColor('#0d1b2a', canvas.renderAll.bind(canvas))

  const { width, height } = canvasSize
  const heroHeight = 700
  const PADDING = 60

  // Professional color palette - Modern luxury
  const PRIMARY = '#1f3a52'      // Deep navy
  const ACCENT = '#e74c3c'       // Professional red
  const GOLD = '#e8b923'         // Warm gold
  const WHITE = '#ffffff'
  const TEXT_LIGHT = '#f5f5f5'   // Off-white for text
  const TEXT_MUTED = '#b8c9d9'   // Muted blue-gray

  // 1. Hero Image with professional frame
  await createImageFrame(canvas, fabricLib, images[0] || '', 0, 0, width, heroHeight, { cornerRadius: 0 })

  // 2. Professional gradient overlay
  const overlay = new fabricLib.Rect({
    left: 0,
    top: 0,
    width: width,
    height: heroHeight,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: heroHeight },
      colorStops: [
        { offset: 0, color: 'rgba(0,0,0,0.1)' },
        { offset: 0.5, color: 'rgba(0,0,0,0.3)' },
        { offset: 1, color: 'rgba(0,0,0,0.7)' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(overlay)

  // 3. Premium badge (Featured/Hot listing)
  const badgeBg = new fabricLib.Rect({
    left: PADDING,
    top: PADDING + 10,
    width: 200,
    height: 55,
    rx: 28,
    ry: 28,
    fill: ACCENT,
    selectable: true,
    evented: true,
    shadow: new fabricLib.Shadow({
      color: 'rgba(231, 76, 60, 0.4)',
      blur: 20,
      offsetX: 0,
      offsetY: 8,
    }),
    id: generateUniqueId(),
  })
  canvas.add(badgeBg)

  const badgeText = new fabricLib.Textbox('FEATURED', {
    left: PADDING + 10,
    top: PADDING + 12,
    width: 180,
    fontSize: 18,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 700,
    fill: WHITE,
    textAlign: 'center',
    selectable: true,
    evented: true,
    editable: true,
    letterSpacing: 2,
    lineHeight: 1,
    id: generateUniqueId(),
  })
  canvas.add(badgeText)

  // 4. Property Type - Professional header
  const propertyType = propertyInfo?.property_type || 'Single Family Home'

  const typeLabel = new fabricLib.Textbox(propertyType.toUpperCase(), {
    left: PADDING,
    top: heroHeight - 140,
    fontSize: 18,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 700,
    fill: GOLD,
    selectable: true,
    evented: true,
    editable: true,
    letterSpacing: 2,
    id: generateUniqueId(),
  })
  canvas.add(typeLabel)

  // 5. Price - Premium professional styling
  const priceValue = propertyInfo?.price || '$1,250,000'

  const price = new fabricLib.Textbox(priceValue, {
    left: PADDING,
    top: heroHeight - 75,
    fontSize: 68,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 800,
    fill: WHITE,
    selectable: true,
    evented: true,
    editable: true,
    shadow: new fabricLib.Shadow({
      color: 'rgba(0,0,0,0.5)',
      blur: 25,
      offsetX: 0,
      offsetY: 10,
    }),
    id: generateUniqueId(),
  })
  canvas.add(price)

  // Elegant underline for price
  const priceLine = new fabricLib.Rect({
    left: PADDING,
    top: heroHeight - 30,
    width: 160,
    height: 4,
    fill: ACCENT,
    rx: 2,
    ry: 2,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(priceLine)

  // 6. Bottom Supporting Images (Side by Side, no gaps, full width) - seamless connection
  const bottomTop = heroHeight
  const bottomImgWidth = width / 2  // Each image takes half the width, no gaps
  const bottomImgHeight = height - bottomTop - 110

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
    bottomImgWidth,
    bottomTop,
    bottomImgWidth,
    bottomImgHeight,
    { cornerRadius: 0 }
  )

  // 7. Elegant gradient overlay on bottom images
  const imgOverlay = new fabricLib.Rect({
    left: 0,
    top: bottomTop,
    width: width,
    height: bottomImgHeight,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: bottomImgHeight },
      colorStops: [
        { offset: 0, color: 'rgba(0,0,0,0)' },
        { offset: 0.7, color: 'rgba(0,0,0,0.2)' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(imgOverlay)

  // 8. Bottom Info Bar with professional gradient
  const infoBarHeight = 115
  const infoBar = new fabricLib.Rect({
    left: 0,
    top: height - infoBarHeight,
    width: width,
    height: infoBarHeight,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: infoBarHeight },
      colorStops: [
        { offset: 0, color: PRIMARY },
        { offset: 1, color: '#051d2d' },
      ],
    }),
    selectable: true,
    evented: true,
    id: generateUniqueId(),
  })
  canvas.add(infoBar)

  // Top accent border
  const infoBorder = new fabricLib.Rect({
    left: 0,
    top: height - infoBarHeight,
    width: width,
    height: 3,
    fill: GOLD,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(infoBorder)

  // 9. Professional Property Details
  const beds = propertyInfo?.bedrooms || '4'
  const baths = propertyInfo?.bathrooms || '3'
  const sqft = propertyInfo?.square_feet ? Number(propertyInfo.square_feet).toLocaleString() : '2,800'

  const detailsText = `${beds} Beds  •  ${baths} Baths  •  ${sqft} Sq Ft`

  const details = new fabricLib.Textbox(detailsText, {
    left: PADDING,
    top: height - 50,
    fontSize: 22,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 600,
    fill: TEXT_LIGHT,
    selectable: true,
    evented: true,
    editable: true,
    width: width - PADDING * 2,
    textAlign: 'center',
    letterSpacing: 0.5,
    id: generateUniqueId(),
  })
  canvas.add(details)

  // Final render & save
  setTimeout(() => {
    bringTextToFront(canvas)
    saveToHistory(canvas)
  }, 400)
}