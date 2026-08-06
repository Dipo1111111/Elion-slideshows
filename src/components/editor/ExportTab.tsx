// Editor Export tab: background-only PNGs + copyable slide text, added in
// TikTok's native font. Free plan bakes the watermark into each export. A
// "Send to your phone" share snapshots the finished slideshow to a QR link so
// the creator can post straight from the TikTok app.
import { useState } from 'react'
import QRCode from 'qrcode'
import { Copy, Download, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { api, imageUrl } from '@/lib/api'
import { downloadCanvas, renderSlideBackground } from '@/lib/render'
import { BRAND_NAME } from '@/lib/brand'
import { useMe } from '@/lib/me'
import type { Slide, Slideshow } from '@/lib/types'
import { FOCUS, MintButton, QuietButton } from '@/components/primitives'
import type { EditorDraft } from '@/components/SlideshowEditorModal'

function safeName(title: string): string {
  const base = title
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  return base || 'slideshow'
}

export function ExportTab({
  slideshow,
  draft,
  watermark,
}: {
  slideshow: Slideshow
  draft: EditorDraft
  watermark: boolean
}) {
  const { activeProject } = useMe()
  const [busy, setBusy] = useState(false)
  const [share, setShare] = useState<{ url: string; qr: string } | null>(null)

  const hasAllBgs = draft.slides.every((s) => s.bg)

  async function downloadImage(slide: Slide, n: number) {
    if (!slide.bg) throw new Error('This slide has no background yet.')
    const canvas = await renderSlideBackground({ imageUrl: imageUrl(slide.bg), watermark })
    downloadCanvas(canvas, `elion-${safeName(slideshow.title)}-${n}.png`)
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true)
    try {
      await fn()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Export failed. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied.')
    } catch {
      toast.error('Clipboard is not available.')
    }
  }

  const downloadAll = () =>
    run(async () => {
      for (const [i, slide] of draft.slides.entries()) {
        await downloadImage(slide, i + 1)
      }
    })

  const copyAll = () =>
    copyText(draft.slides.map((s, i) => `${i + 1}. ${s.text}`).join('\n\n'))

  // Snapshot the current draft to a share, then render its URL as a QR the
  // phone can scan. The server snapshots text + background ids only; image
  // bytes stay in the Library and load same-origin on the share page.
  const sendToPhone = async () => {
    if (!activeProject) throw new Error('Select a project first.')
    if (!hasAllBgs) throw new Error('Add a background to every slide first.')
    const { url } = await api.createExport({
      projectId: activeProject.id,
      slideshowId: slideshow.id,
      caption: draft.caption,
      hashtags: draft.hashtagsText
        .split(/\s+/)
        .map((t) => t.replace(/^#/, ''))
        .filter(Boolean),
      slides: draft.slides.map((s) => ({ text: s.text, bg: s.bg ? { id: s.bg.id } : null })),
    })
    const qr = await QRCode.toDataURL(url, {
      width: 280,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0A0A0A', light: '#FFFFFF' },
    })
    setShare({ url, qr })
  }

  return (
    <>
      <p className="text-[12px] leading-relaxed text-[#9CA0A8]">
        Download the background images, then add text inside TikTok with the native font. The free
        plan adds a small {BRAND_NAME} watermark.
      </p>
      <div className="space-y-1.5">
        {draft.slides.map((slide, i) => (
          <div key={slide.id} className="flex items-center gap-2 rounded-lg border border-[#1F212B] bg-[#08080A] p-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6]/20 font-num text-[11px] font-bold text-white">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-[12px] text-[#E5E7EB]">{slide.text}</span>
            <button
              type="button"
              onClick={() => void copyText(slide.text)}
              disabled={busy}
              className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#9CA0A8] transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-50 ${FOCUS}`}
            >
              <Copy className="h-3 w-3" strokeWidth={1.5} />
              Copy
            </button>
            <button
              type="button"
              onClick={() => void run(() => downloadImage(slide, i + 1))}
              disabled={busy || !slide.bg}
              className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#9CA0A8] transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-50 ${FOCUS}`}
            >
              <Download className="h-3 w-3" strokeWidth={1.5} />
              Image
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-1">
        <MintButton icon={Download} onClick={() => void downloadAll()} disabled={busy} className="px-4 py-2 text-[12px]">
          Download all
        </MintButton>
        <QuietButton icon={Copy} onClick={() => void copyAll()} disabled={busy} className="px-4 py-2 text-[12px]">
          Copy all text
        </QuietButton>
      </div>

      <div className="mt-2 border-t border-[#1F2026] pt-4">
        <div className="flex items-center gap-2">
          <QrCode className="h-4 w-4 text-[#3B82F6]" strokeWidth={1.5} />
          <span className="text-[12.5px] font-bold text-white">Send to your phone</span>
        </div>
        <p className="mt-1 text-[11.5px] leading-relaxed text-[#9CA0A8]">
          Scan the QR with your phone camera. It opens a page with every background image and the full
          caption, ready to post in TikTok.
        </p>
        {share ? (
          <div className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-[#1F212B] bg-[#0C0D10] p-4">
            <img
              src={share.qr}
              alt="Send to phone QR code"
              width={200}
              height={200}
              className="rounded-lg bg-white p-2"
            />
            <p className="break-all text-center font-mono text-[10px] leading-relaxed text-[#8E8E93]">{share.url}</p>
            <p className="text-center text-[10.5px] font-medium text-[#5F646B]">Link expires in 24 hours.</p>
            <QuietButton icon={QrCode} onClick={() => void run(sendToPhone)} disabled={busy} className="mt-1 px-3 py-1.5 text-[11px]">
              New link
            </QuietButton>
          </div>
        ) : (
          <MintButton
            icon={QrCode}
            onClick={() => void run(sendToPhone)}
            disabled={busy || !hasAllBgs}
            className="mt-3 px-4 py-2 text-[12px]"
          >
            {busy ? 'Creating link...' : 'Create QR code'}
          </MintButton>
        )}
      </div>
    </>
  )
}
