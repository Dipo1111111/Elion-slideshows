import { Link } from 'react-router-dom'
import { designs } from '@/components/design1/designs'
import { BRAND_NAME } from '@/lib/brand'

// Design studio gallery (batch 1): preview cards ONLY. Each card links to the
// full mocked product screen for that design (/design1/:slug).
export default function Design1() {
  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">{BRAND_NAME} · design batch 1</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-400">
          Seven fully distinct product UI mockups, with different bones, palettes, and type. Each
          opens the complete static app screen (Style, Slideshows, Plan, generate, export).
          Pick one, or tell me what to change.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {designs.map((design) => (
          <Link key={design.slug} to={`/design1/${design.slug}`} className="group space-y-2">
            <figure className="space-y-2">
              <figcaption className="flex items-baseline justify-between text-sm">
                <span className="font-medium">
                  {design.index} · {design.name}
                </span>
                <span className="text-neutral-500">{design.note}</span>
              </figcaption>
              <div className="overflow-hidden rounded-xl border border-neutral-800 transition-colors group-hover:border-neutral-600">
                <design.Preview />
              </div>
              <p className="text-xs text-neutral-500 transition-colors group-hover:text-brand">
                Open full mockup →
              </p>
            </figure>
          </Link>
        ))}
      </div>
    </main>
  )
}
