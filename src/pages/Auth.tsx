// Sign in / create account. Outside the locked DESIGN.md contract (the mockup
// has no auth screen), so it follows the palette + brand rules only: black
// page, hairline borders, white-glass primary, blue state. Layout is a split:
// brand narrative (logo, pitch, a staggered row of real slide thumbs) on the
// left, the mode + form on the right. No em dashes.
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { BRAND_NAME } from '@/lib/brand'
import { FieldLabel, FOCUS, MintButton, SlideThumb, TextInput } from '@/components/primitives'
import logoUrl from '@/assets/elion-logo.png'

type Mode = 'signin' | 'signup'

// Dev/demo photos (picsum seeds, the same fallback the image pipeline uses).
// SlideThumb degrades to the dark fill + numeral if an image ever fails.
const DEMO_SLIDES = [
  'https://picsum.photos/seed/elion-auth-1/540/960',
  'https://picsum.photos/seed/elion-auth-2/540/960',
  'https://picsum.photos/seed/elion-auth-3/540/960',
]

const MODES: { key: Mode; label: string }[] = [
  { key: 'signup', label: 'Create account' },
  { key: 'signin', label: 'Sign in' },
]

// Official Google "G" mark (four brand colors, the standard OAuth button glyph).
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.19 7.19 0 0 1 0-4.58V6.62H1.29a12.04 12.04 0 0 0 0 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  )
}

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!supabase) {
      setError('Authentication is not configured on the server.')
      return
    }
    setError('')
    setLoading(true)
    const result =
      mode === 'signup'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (result.error) {
      setError(result.error.message)
      return
    }
    // Email confirmation is on: signUp returns a user but no session. Show the
    // confirmation state instead of navigating (the app would bounce back).
    if (mode === 'signup' && result.data?.session === null) {
      setSent(email)
      return
    }
    navigate('/app')
  }

  async function resendConfirmation() {
    if (!supabase || !sent) return
    setLoading(true)
    const { error } = await supabase.auth.resend({ type: 'signup', email: sent })
    setLoading(false)
    if (error) setError(error.message)
    else setError('Email sent. Check your inbox.')
  }

  async function signInWithGoogle() {
    if (!supabase) {
      setError('Authentication is not configured on the server.')
      return
    }
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app` },
    })
    if (error) setError(error.message)
  }

  return (
    <main className="flex min-h-screen items-start justify-center px-4 py-5 sm:px-6">
      <div className="elion-rise grid w-full max-w-[1080px] grid-cols-1 lg:grid-cols-2">
      <aside className="hidden flex-col gap-6 overflow-hidden border-r border-[#16171D] p-8 sm:p-10 lg:flex lg:py-6 lg:pl-14 lg:pr-12">
        <img src={logoUrl} alt={BRAND_NAME} className="h-6 w-auto self-start shrink-0" />

        <div className="max-w-md">
          <h1 className="font-display text-[32px] font-bold leading-[1.08] tracking-[-0.03em] text-white">
            Writes your slideshow for you.
          </h1>
          <p className="mt-3 text-[13.5px] leading-relaxed text-[#9CA0A8]">
            Set up your brand, and {BRAND_NAME} writes the script, pulls Pinterest backgrounds, and hands you
            ready-to-post slides.
          </p>
          <div className="mt-5 flex items-start gap-3">
            <SlideThumb image={DEMO_SLIDES[0]} index={1} className="w-24" />
            <div className="flex flex-col gap-2 pt-4">
              <SlideThumb image={DEMO_SLIDES[1]} index={2} className="w-16" />
              <SlideThumb image={DEMO_SLIDES[2]} index={3} className="w-16" />
            </div>
          </div>
        </div>

        <p className="text-[12.5px] text-[#8E8E93]">Free to start. 3 lifetime slideshows, then Creator from $19/mo.</p>
      </aside>

      <section className="flex w-full items-center justify-center p-8 sm:p-10 lg:px-14 lg:py-8">
        <div className="w-full max-w-sm">
          <img src={logoUrl} alt={BRAND_NAME} className="h-6 w-auto lg:hidden" />
          <p className="mt-5 font-display text-[22px] font-bold leading-tight tracking-[-0.02em] text-white lg:hidden">
            Writes your slideshow for you.
          </p>

          <div className="mt-6 flex gap-1.5 lg:mt-0">
            {MODES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                aria-pressed={mode === key}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${FOCUS} ${
                  mode === key ? 'bg-[#3B82F6]/20 text-white' : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="mt-3 text-[13px] text-[#9CA0A8]">
            {mode === 'signup'
              ? 'Start with 3 free slideshows. No card needed.'
              : 'Welcome back. Your slideshows are waiting.'}
          </p>

          {sent ? (
            <div className="mt-6 rounded-xl border border-[#1E2028] p-5">
              <h2 className="font-display text-[16px] font-bold text-white">Check your email.</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[#9CA0A8]">
                We sent a confirmation link to <span className="font-semibold text-white">{sent}</span>. Click it
                to finish creating your account, then sign in.
              </p>
              {error && <p className="mt-3 text-[12.5px] text-[#F4877E]">{error}</p>}
              <div className="mt-4 flex gap-2">
                <MintButton type="button" onClick={() => void resendConfirmation()} disabled={loading} className="flex-1">
                  {loading ? 'Sending...' : 'Resend email'}
                </MintButton>
                <button
                  type="button"
                  onClick={() => {
                    setSent('')
                    setError('')
                  }}
                  className={`rounded-full border border-[#2A2C35] px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-white/5 ${FOCUS}`}
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block">
                <FieldLabel>Email</FieldLabel>
                <TextInput
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="block">
                <FieldLabel>Password</FieldLabel>
                <TextInput
                  type="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  required
                  minLength={8}
                  placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              {error && <p className="text-[12.5px] text-[#F4877E]">{error}</p>}

              <MintButton type="submit" disabled={loading} className="w-full">
                {loading ? (mode === 'signup' ? 'Creating...' : 'Signing in...') : mode === 'signup' ? 'Sign up' : 'Sign in'}
              </MintButton>
            </form>
          )}

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#1F2026]" />
            <span className="text-[11px] font-medium text-[#6E737B]">or</span>
            <span className="h-px flex-1 bg-[#1F2026]" />
          </div>

          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#2A2C35] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:border-[#3A3D48] hover:bg-white/5 disabled:opacity-50 ${FOCUS}`}
          >
            <GoogleIcon className="h-4 w-4" />
            {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
          </button>

          <p className="mt-8 text-center text-[11.5px] leading-relaxed text-[#6E737B]">
            By continuing, you agree to {BRAND_NAME}'s{' '}
            <Link to="/terms" className="text-[#9CA0A8] underline-offset-2 hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-[#9CA0A8] underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
      </div>
    </main>
  )
}
