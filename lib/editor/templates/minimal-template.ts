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
  canvas.setBackgroundColor('#0f1419', canvas.renderAll.bind(canvas))

  const { width, height } = canvasSize

  // Dark luxury color palette
  const BG_DARK = '#0f1419'         // Deep charcoal
  const BG_CARD = '#1a2332'         // Card background
  const PRIMARY = '#ffffff'         // White text
  const ACCENT = '#e74c3c'          // Professional red
  const GOLD = '#d4a574'            // Bronze-gold
  const TEXT_MUTED = '#a0aec0'      // Muted gray
  const PADDING = 70

  // Full screen layout with dark theme
  // 1. Full-width hero image
  await createImageFrame(canvas, fabricLib, images[0] || '', 0, 0, width, height * 0.65, { cornerRadius: 0 })

  // 2. Dark gradient overlay on hero
  const heroOverlay = new fabricLib.Rect({
    left: 0,
    top: 0,
    width: width,
    height: height * 0.65,
    fill: new fabricLib.Gradient({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: 0, y2: height * 0.65 },
      colorStops: [
        { offset: 0, color: 'rgba(0,0,0,0)' },
        { offset: 0.7, color: 'rgba(0,0,0,0.3)' },
        { offset: 1, color: 'rgba(0,0,0,0.6)' },
      ],
    }),
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(heroOverlay)

  // 3. Dark info section
  const infoTop = height * 0.65
  const infoBg = new fabricLib.Rect({
    left: 0,
    top: infoTop,
    width: width,
    height: height * 0.35,
    fill: BG_DARK,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(infoBg)

  // Top gold border accent
  const topBorder = new fabricLib.Rect({
    left: 0,
    top: infoTop,
    width: width,
    height: 3,
    fill: GOLD,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(topBorder)

  const contentTop = infoTop + 30

  // 4. Property Type Badge - Modern style
  const typeValue = (propertyInfo?.property_type || 'Luxury Home').toUpperCase()

  const typeBadgeBg = new fabricLib.Rect({
    left: PADDING,
    top: contentTop - 5,
    width: 180,
    height: 42,
    rx: 21,
    ry: 21,
    fill: `${ACCENT}20`,
    stroke: ACCENT,
    strokeWidth: 1.5,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(typeBadgeBg)

  const typeText = new fabricLib.Textbox(typeValue, {
    left: PADDING + 20,
    top: contentTop + 2,
    width: 140,
    fontSize: 12,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 700,
    fill: ACCENT,
    textAlign: 'center',
    selectable: true,
    editable: true,
    letterSpacing: 0.5,
    lineHeight: 1,
    id: generateUniqueId(),
  })
  canvas.add(typeText)

  // 5. Price - Large and bold with proper spacing
  const priceText = new fabricLib.Textbox(propertyInfo?.price || '$2,450,000', {
    left: PADDING,
    top: contentTop + 45,
    fontSize: 66,
    fontFamily: "'Poppins', Arial, sans-serif",
    fontWeight: 800,
    fill: PRIMARY,
    selectable: true,
    editable: true,
    lineHeight: 1,
    id: generateUniqueId(),
  })
  canvas.add(priceText)

  // Price underline - Gold accent
  const priceUnderline = new fabricLib.Rect({
    left: PADDING,
    top: contentTop + 120,
    width: 110,
    height: 3,
    fill: GOLD,
    rx: 1.5,
    ry: 1.5,
    selectable: false,
    evented: false,
    id: generateUniqueId(),
  })
  canvas.add(priceUnderline)

  // 6. Address - Clean and elegant with proper spacing
  const fullAddress = propertyInfo
    ? `${propertyInfo.address || '123 Luxury Lane'}`
    : '123 Luxury Lane'

  const addressText = new fabricLib.Textbox(fullAddress, {
    left: PADDING,
    top: contentTop + 145,
    fontSize: 22,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 700,
    fill: PRIMARY,
    selectable: true,
    editable: true,
    width: width - PADDING * 2,
    lineHeight: 1.2,
    id: generateUniqueId(),
  })
  canvas.add(addressText)

  // 7. City, State, Zip
  const cityState = propertyInfo
    ? `${propertyInfo.city || 'Los Angeles'}, ${propertyInfo.state || 'CA'} ${propertyInfo.zip_code || '90001'}`
    : 'Los Angeles, CA 90001'

  const cityText = new fabricLib.Textbox(cityState, {
    left: PADDING,
    top: contentTop + 180,
    fontSize: 14,
    fontFamily: "'Inter', Arial, sans-serif",
    fontWeight: 400,
    fill: TEXT_MUTED,
    selectable: true,
    editable: true,
    id: generateUniqueId(),
  })
  canvas.add(cityText)

  // 8. Property specs
  const beds = propertyInfo?.bedrooms || '5'
  const baths = propertyInfo?.bathrooms || '4.5'
  const sqft = propertyInfo?.square_feet ? Number(propertyInfo.square_feet).toLocaleString() : '3,800'

  const specsText = new fabricLib.Textbox(`${beds} BD  •  ${baths} BA  •  ${sqft} SF`, {
    left: PADDING,
    top: contentTop + 210,
    fontSize: 16,
    fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
    fontWeight: 600,
    fill: GOLD,
    selectable: true,
    editable: true,
    letterSpacing: 0.5,
    id: generateUniqueId(),
  })
  canvas.add(specsText)

  // 9. Bottom image gallery - Three supporting images with professional styling
  const galleryTop = height - 145
  const gallerySpacing = 12
  const galleryImgWidth = (width - PADDING * 2 - gallerySpacing * 2) / 3
  const galleryImgHeight = 135

  const galleryImages = [
    images[1] || images[0],
    images[2] || images[0],
    images[3] || images[0],
  ]

  for (let i = 0; i < 3; i++) {
    // Dark card background for each image
    const imgCard = new fabricLib.Rect({
      left: PADDING + i * (galleryImgWidth + gallerySpacing),
      top: galleryTop,
      width: galleryImgWidth,
      height: galleryImgHeight,
      fill: BG_CARD,
      rx: 8,
      ry: 8,
      selectable: false,
      evented: false,
      stroke: GOLD,
      strokeWidth: 1,
      shadow: new fabricLib.Shadow({
        color: 'rgba(0, 0, 0, 0.3)',
        blur: 15,
        offsetX: 0,
        offsetY: 5,
      }),
      id: generateUniqueId(),
    })
    canvas.add(imgCard)

    await createImageFrame(
      canvas,
      fabricLib,
      galleryImages[i],
      PADDING + i * (galleryImgWidth + gallerySpacing) + 2,
      galleryTop + 2,
      galleryImgWidth - 4,
      galleryImgHeight - 4,
      { cornerRadius: 6 }
    )
  }

  // Final render
  setTimeout(() => {
    bringTextToFront(canvas)
    saveToHistory(canvas)
  }, 500)
}