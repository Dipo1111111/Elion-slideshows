// Editor Post tab: caption + hashtags, DESIGN.md EditorModal recipe. Text
// inputs use the exact contract recipe (not the primitives) to keep the
// mockup's verbatim class strings.
import { TextArea, TextInput } from '@/components/primitives'
import type { EditorDraft } from '@/components/SlideshowEditorModal'

export function PostTab({
  draft,
  patch,
}: {
  draft: EditorDraft
  patch: (p: Partial<EditorDraft>) => void
}) {
  return (
    <>
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">Caption</span>
        <TextArea
          rows={5}
          value={draft.caption}
          onChange={(e) => patch({ caption: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-bold text-[#9CA0A8]">Hashtags</span>
        <TextInput
          value={draft.hashtagsText}
          onChange={(e) => patch({ hashtagsText: e.target.value })}
          placeholder="#tag1 #tag2"
        />
      </label>
    </>
  )
}
