/**
 * Generate a unique ID for canvas objects
 */
export const generateUniqueId = (): string => {
  return `layer_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Debounce utility for performance optimization
 */
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Create an image frame on the canvas.
 * Fills the given box (cover behavior) and centers the crop, so the
 * object's bounding box matches the requested frame exactly.
 */
export const createImageFrame = (
  canvas: any,
  fabricLib: any,
  imageUrl: string,
  left: number,
  top: number,
  width: number,
  height: number,
  _options: { cornerRadius: number }
) => {
  return new Promise<any>((resolve) => {
    fabricLib.Image.fromURL(
      imageUrl,
      (img: any) => {
        const naturalW = img.width!
        const naturalH = img.height!

        const scale = Math.max(width / naturalW, height / naturalH)

        const visibleW = Math.min(naturalW, width / scale)
        const visibleH = Math.min(naturalH, height / scale)

        img.set({
          left,
          top,
          scaleX: scale,
          scaleY: scale,
          cropX: Math.max(0, (naturalW - visibleW) / 2),
          cropY: Math.max(0, (naturalH - visibleH) / 2),
          width: visibleW,
          height: visibleH,
          selectable: true,
          hasControls: true,
          id: generateUniqueId(),
        })

        canvas.add(img)
        canvas.renderAll()
        resolve(img)
      },
      { crossOrigin: 'anonymous' }
    )
  })
}

/**
 * Initialize Fabric.js selection styling
 */
export const initializeCanvasSelection = (fabricLib: any, canvas: any) => {
  // Set selection colors
  fabricLib.Object.prototype.set({
    borderColor: '#2563eb',
    cornerColor: '#2563eb',
    cornerStrokeColor: '#ffffff',
    borderScaleFactor: 2.5,
    cornerSize: 12,
    cornerStyle: 'circle',
    transparentCorners: false,
    borderOpacityWhenMoving: 0.8,
  })

  // Selection area color
  canvas.selectionColor = 'rgba(37, 99, 235, 0.15)'
  canvas.selectionBorderColor = '#2563eb'
  canvas.selectionLineWidth = 2
}

/**
 * Bring text and overlay objects to front
 */
export const bringTextToFront = (canvas: any) => {
  canvas.getObjects().forEach((obj: any) => {
    if (
      obj.type === 'textbox' ||
      obj.type === 'text' ||
      (obj.fill && typeof obj.fill === 'string' && obj.fill.includes('rgba'))
    ) {
      canvas.bringToFront(obj)
    }
  })
  canvas.renderAll()
}
