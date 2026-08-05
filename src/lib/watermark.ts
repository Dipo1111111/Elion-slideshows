// Free-tier watermark: a small "Made with {BRAND_NAME}" mark in the bottom-right
// corner of every exported background. Deliberately tiny and discreet. The
// 3-lifetime cap is what converts free users (they cannot make a 4th slideshow),
// so the mark's only job is brand exposure on free posts, never blocking them.
// Pro skips it. This is the only watermark in the product.
import { BRAND_NAME } from './brand'

const CORNER_PAD = 40 // px from the bottom-right edge on the 1080px export canvas
const MARK_FONT = '500 24px "Inter Tight Variable", "Inter Tight", sans-serif'
const MARK_ALPHA = 0.6

export function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.save()
  ctx.globalAlpha = MARK_ALPHA
  ctx.fillStyle = '#FFFFFF'
  ctx.font = MARK_FONT
  ctx.textAlign = 'right'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(`Made with ${BRAND_NAME}`, width - CORNER_PAD, height - CORNER_PAD)
  ctx.restore()
}
