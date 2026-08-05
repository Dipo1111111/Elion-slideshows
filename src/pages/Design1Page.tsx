import { Navigate, useParams } from 'react-router-dom'
import { designs } from '@/components/design1/designs'

// Full-page renderer for a single design direction: /design1/:slug → that
// design's complete mocked app screen. Unknown slugs bounce back to the gallery.
export default function Design1Page() {
  const { slug } = useParams()
  const design = designs.find((d) => d.slug === slug)
  if (!design) return <Navigate to="/design1" replace />
  const Page = design.Page
  return <Page />
}
