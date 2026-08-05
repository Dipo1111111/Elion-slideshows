import { Navigate, Route, Routes } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Auth from '@/pages/Auth'
import Legal from '@/pages/Legal'
import AppShell from '@/pages/AppShell'
import DashboardView from '@/views/DashboardView'
import LibraryView from '@/views/LibraryView'
import BrandVoiceView from '@/views/BrandVoiceView'
import BillingView from '@/views/BillingView'
import { MeProvider } from '@/lib/me'
import { GenerateProvider } from '@/lib/generate'
import Design1 from '@/pages/Design1'
import Design1Page from '@/pages/Design1Page'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/terms" element={<Legal slug="terms" />} />
      <Route path="/privacy" element={<Legal slug="privacy" />} />
      <Route path="/refund" element={<Legal slug="refund" />} />
      <Route
        path="/app"
        element={
          <MeProvider>
            <GenerateProvider>
              <AppShell />
            </GenerateProvider>
          </MeProvider>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardView />} />
        <Route path="library" element={<LibraryView />} />
        <Route path="brand" element={<BrandVoiceView />} />
        <Route path="billing" element={<BillingView />} />
      </Route>
      <Route path="/design1" element={<Design1 />} />
      <Route path="/design1/:slug" element={<Design1Page />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
