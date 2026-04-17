const SNAP_THRESHOLD = 6
const GUIDE_COLOR = '#ec4899'

type Bounds = {
  left: number
  top: number
  right: number
  bottom: number
  centerX: number
  centerY: number
}

const getBounds = (obj: any): Bounds => {
  const br = obj.getBoundingRect(true, true)
  return {
    left: br.left,
    top: br.top,
    right: br.left + br.width,
    bottom: br.top + br.height,
    centerX: br.left + br.width / 2,
    centerY: br.top + br.height / 2,
  }
}

export function attachSnapAlign(fabricCanvas: any): () => void {
  let modifierHeld = false
  let verticalGuides: number[] = []
  let horizontalGuides: number[] = []

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) modifierHeld = true
  }
  const onKeyUp = (e: KeyboardEvent) => {
    if (!e.ctrlKey && !e.metaKey) modifierHeld = false
  }
  const onBlur = () => {
    modifierHeld = false
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)

  const clearGuidesCanvas = () => {
    const ctx = fabricCanvas.contextTop
    if (!ctx) return
    if (typeof fabricCanvas.clearContext === 'function') {
      fabricCanvas.clearContext(ctx)
    } else {
      ctx.clearRect(0, 0, fabricCanvas.width, fabricCanvas.height)
    }
  }

  const drawGuides = () => {
    clearGuidesCanvas()
    if (!verticalGuides.length && !horizontalGuides.length) return

    const ctx = fabricCanvas.contextTop
    if (!ctx) return
    ctx.save()
    ctx.strokeStyle = GUIDE_COLOR
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])

    for (const x of verticalGuides) {
      ctx.beginPath()
      ctx.moveTo(x + 0.5, 0)
      ctx.lineTo(x + 0.5, fabricCanvas.height)
      ctx.stroke()
    }
    for (const y of horizontalGuides) {
      ctx.beginPath()
      ctx.moveTo(0, y + 0.5)
      ctx.lineTo(fabricCanvas.width, y + 0.5)
      ctx.stroke()
    }
    ctx.restore()
  }

  const clearGuides = () => {
    verticalGuides = []
    horizontalGuides = []
    clearGuidesCanvas()
  }

  const handleMoving = (e: any) => {
    verticalGuides = []
    horizontalGuides = []

    const target = e.target
    if (!target) {
      clearGuidesCanvas()
      return
    }

    if (modifierHeld) {
      clearGuidesCanvas()
      return
    }

    const moving = getBounds(target)
    const canvasW = fabricCanvas.width
    const canvasH = fabricCanvas.height

    const xTargets: number[] = [0, canvasW / 2, canvasW]
    const yTargets: number[] = [0, canvasH / 2, canvasH]

    fabricCanvas.getObjects().forEach((obj: any) => {
      if (obj === target) return
      if (obj.selectable === false || obj.evented === false) return
      const b = getBounds(obj)
      xTargets.push(b.left, b.centerX, b.right)
      yTargets.push(b.top, b.centerY, b.bottom)
    })

    const movingX = [
      { edge: moving.left, label: 'left' as const },
      { edge: moving.centerX, label: 'cx' as const },
      { edge: moving.right, label: 'right' as const },
    ]
    const movingY = [
      { edge: moving.top, label: 'top' as const },
      { edge: moving.centerY, label: 'cy' as const },
      { edge: moving.bottom, label: 'bottom' as const },
    ]

    let bestX: { delta: number; guide: number } | null = null
    let bestY: { delta: number; guide: number } | null = null

    for (const m of movingX) {
      for (const tx of xTargets) {
        const d = tx - m.edge
        if (Math.abs(d) <= SNAP_THRESHOLD) {
          if (!bestX || Math.abs(d) < Math.abs(bestX.delta)) {
            bestX = { delta: d, guide: tx }
          }
        }
      }
    }
    for (const m of movingY) {
      for (const ty of yTargets) {
        const d = ty - m.edge
        if (Math.abs(d) <= SNAP_THRESHOLD) {
          if (!bestY || Math.abs(d) < Math.abs(bestY.delta)) {
            bestY = { delta: d, guide: ty }
          }
        }
      }
    }

    if (bestX) {
      target.set({ left: target.left + bestX.delta })
      verticalGuides.push(bestX.guide)
    }
    if (bestY) {
      target.set({ top: target.top + bestY.delta })
      horizontalGuides.push(bestY.guide)
    }

    target.setCoords?.()
    drawGuides()
  }

  fabricCanvas.on('object:moving', handleMoving)
  fabricCanvas.on('mouse:up', clearGuides)
  fabricCanvas.on('selection:cleared', clearGuides)
  fabricCanvas.on('object:modified', clearGuides)

  return () => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', onBlur)
    fabricCanvas.off('object:moving', handleMoving)
    fabricCanvas.off('mouse:up', clearGuides)
    fabricCanvas.off('selection:cleared', clearGuides)
    fabricCanvas.off('object:modified', clearGuides)
    clearGuidesCanvas()
  }
}
