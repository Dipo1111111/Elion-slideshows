// 1080x1920 canvas renderer for export. Background-only: text is added in
// TikTok/IG's native font. A light scrim keeps the text legible. The free
// plan bakes the watermark in; Pro skips it (BUILD_PLAN §11).
import { drawWatermark } from './watermark'

const WIDTH = 1080
const HEIGHT = 1920
const SCRIM = 'rgba(0, 0, 0, 0.25)'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load the background image.'))
    img.src = src
  })
}

export async function renderSlideBackground(opts: { imageUrl: string; watermark: boolean }): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not supported in this browser.')

  const img = await loadImage(opts.imageUrl)
  // Cover the canvas without distorting the image.
  const scale = Math.max(WIDTH / img.naturalWidth, HEIGHT / img.naturalHeight)
  const drawWidth = img.naturalWidth * scale
  const drawHeight = img.naturalHeight * scale
  ctx.drawImage(img, (WIDTH - drawWidth) / 2, (HEIGHT - drawHeight) / 2, drawWidth, drawHeight)

  ctx.fillStyle = SCRIM
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  if (opts.watermark) drawWatermark(ctx, WIDTH, HEIGHT)
  return canvas
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, 'image/png')
}
