export { applyRealEstateTemplate } from './real-estate-template'
export { applyMinimalTemplate } from './minimal-template'
export { applyBoldTemplate } from './bold-template'
export { applyElegantGridTemplate } from './elegant-grid-template'
export { applyCleanListingTemplate } from './clean-listing-template'

export type TemplateId = 'real-estate-classic' | 'minimal-modern' | 'bold-luxury' | 'elegant-grid' | 'clean-listing'

export interface TemplateApplyOptions {
  canvas: any
  fabricLib: any
  images: string[]
  propertyInfo: any
  canvasSize: { width: number; height: number }
  saveToHistory: (canvas: any) => void
}
