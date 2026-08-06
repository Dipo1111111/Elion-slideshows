// Legal pages: /terms, /privacy, /refund. One shell, content keyed by slug.
// Outside the locked DESIGN.md contract, so they follow palette + brand rules
// only: black page, hairline dividers, readable prose, no em dashes.
// These are template documents. Swap in a lawyer-reviewed version before a
// real launch, and update the contact + company fields.
import { Link } from 'react-router-dom'
import { BRAND_NAME } from '@/lib/brand'
import { FOCUS } from '@/components/primitives'
import logoUrl from '@/assets/elion-logo.png'

const CONTACT = 'skyletlabs@gmail.com'

interface Doc {
  title: string
  updated: string
  sections: { heading: string; body: string[] }[]
}

const DOCS: Record<string, Doc> = {
  terms: {
    title: 'Terms of Service',
    updated: 'August 5, 2026',
    sections: [
      {
        heading: '1. Agreement',
        body: [
          `These Terms of Service govern your use of ${BRAND_NAME} ("the Service"), a slideshow generator that writes carousel scripts, sources background images, and exports ready-to-post slides. By creating an account or using the Service, you agree to these Terms.`,
          `If you do not agree, do not use the Service. We may update these Terms from time to time; the latest version always appears on this page.`,
        ],
      },
      {
        heading: '2. Your account',
        body: [
          `You are responsible for keeping your password secure and for everything done with your account. You must provide accurate contact information and be at least 13 years old.`,
          `One person, one account. Sharing an account to bypass plan limits is not allowed.`,
        ],
      },
      {
        heading: '3. The Service',
        body: [
          `The Service generates text and sources images using third-party tools and providers. Generated content is for your use as a draft and starting point. You are responsible for reviewing, editing, and posting what you publish, and for following the rules of the platforms where you post.`,
          `Background images are sourced from public web results. The Service does not guarantee that any image is free to use commercially. You should verify rights before using a background in content you monetize.`,
        ],
      },
      {
        heading: '4. Plans and payment',
        body: [
          `The free plan includes a limited number of lifetime slideshows with a small corner mark on exports. Paid plans add a monthly allowance, no watermark, and additional brand projects, and are billed through our payment processor.`,
          `Subscriptions renew automatically until you cancel. Cancel anytime from your account or the payment processor; access continues until the end of the paid period.`,
        ],
      },
      {
        heading: '5. Your content',
        body: [
          `You keep all rights to the text, ideas, and final slides you create. We do not claim ownership of your content.`,
          `You grant us a limited license to process your content to run the Service (for example, to generate, store, and export your slideshows).`,
        ],
      },
      {
        heading: '6. Acceptable use',
        body: [
          `Do not use the Service to create content that is illegal, defamatory, or infringing, or that harms others. We may suspend accounts that violate these rules.`,
          `You may not attempt to circumvent usage limits, scrape the Service, or use automated tools to abuse it.`,
        ],
      },
      {
        heading: '7. Disclaimers',
        body: [
          `The Service is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the Service will be uninterrupted or error-free, or that generated output will be accurate or suitable for your purposes.`,
        ],
      },
      {
        heading: '8. Limitation of liability',
        body: [
          `To the maximum extent permitted by law, ${BRAND_NAME} is not liable for indirect, incidental, special, or consequential damages, or for any loss of data, revenue, or profits, arising from your use of the Service. Our total liability is limited to the amount you paid us in the three months before the claim.`,
        ],
      },
      {
        heading: '9. Termination',
        body: [
          `You can delete your account at any time. We may suspend or terminate access for violations of these Terms. Upon termination, your data may be deleted after a short grace period.`,
        ],
      },
      {
        heading: '10. Contact',
        body: [`Questions about these Terms? Email ${CONTACT}.`],
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'August 5, 2026',
    sections: [
      {
        heading: '1. What we collect',
        body: [
          `Account information: the email address you sign up with, and your name if you provide one.`,
          `Content you create: brand settings, generated slideshows, and edits. This is stored so you can return to your work.`,
          `Usage data: basic counts such as slideshows generated and plan status, used to enforce limits and show your usage.`,
        ],
      },
      {
        heading: '2. How we use it',
        body: [
          `We use your information to run the Service: to authenticate you, generate content in your brand voice, store your slideshows, enforce plan limits, and process payments.`,
          `We do not sell your personal information.`,
        ],
      },
      {
        heading: '3. Third parties',
        body: [
          `The Service relies on a small set of processors: Supabase (hosting, database, and authentication), Google (optional sign in), an AI model provider (text generation), Apify (background image sourcing), and our payment processor (billing).`,
          `When you sign in with Google, Google shares the email address and profile information you approve. Payment details are handled by the payment processor and never touch our servers.`,
        ],
      },
      {
        heading: '4. Storage and retention',
        body: [
          `Your data is stored by our hosting provider. We keep your account and content while your account is active, and delete it after you close your account or request deletion.`,
          `A small token is kept in your browser so you stay signed in.`,
        ],
      },
      {
        heading: '5. Your choices',
        body: [
          `You can delete individual slideshows or your whole account at any time. You can also email ${CONTACT} to request a copy or deletion of your data.`,
        ],
      },
      {
        heading: '6. Children',
        body: [
          `The Service is not directed at children under 13, and we do not knowingly collect their information.`,
        ],
      },
      {
        heading: '7. Contact',
        body: [`Privacy questions? Email ${CONTACT}.`],
      },
    ],
  },
  refund: {
    title: 'Refund Policy',
    updated: 'August 5, 2026',
    sections: [
      {
        heading: '1. Creator and Studio subscriptions',
        body: [
          `Payments are processed by our payment processor, Lemon Squeezy. If you are not satisfied with a paid plan, you may request a full refund within 14 days of purchase, no questions asked.`,
          `To request a refund, email ${CONTACT} with the email on your account and the reason. Refunds are issued back to the original payment method within 5 to 10 business days.`,
        ],
      },
      {
        heading: '2. After the refund window',
        body: [
          `After 14 days, refunds are considered case by case. Because the Service has real costs per generation, we generally cannot refund partial periods after the window has closed.`,
        ],
      },
      {
        heading: '3. Renewals',
        body: [
          `Subscriptions renew automatically. If you forget to cancel, contact us within 14 days of the renewal charge and we will refund that charge and close your subscription.`,
        ],
      },
      {
        heading: '4. Free plan',
        body: [
          `The free plan costs nothing, so no refunds apply. You can stop using it at any time.`,
        ],
      },
    ],
  },
}

export default function Legal({ slug }: { slug: 'terms' | 'privacy' | 'refund' }) {
  const doc = DOCS[slug]
  return (
    <main className="elion-rise min-h-screen bg-[#08080A] font-sans text-[#E5E7EB]">
      <div className="mx-auto w-full max-w-[680px] px-5 py-10 sm:px-6 sm:py-14">
        <Link to="/" className={`inline-flex items-center gap-3 ${FOCUS}`}>
          <img src={logoUrl} alt={BRAND_NAME} className="h-5 w-auto" />
          <span className="text-[12px] font-medium text-[#9CA0A8] transition-colors hover:text-white">Back home</span>
        </Link>

        <h1 className="mt-10 font-display text-balance text-[30px] font-bold leading-tight tracking-[-0.02em] text-white">
          {doc.title}
        </h1>
        <p className="mt-2 text-[12.5px] text-[#8E8E93]">Last updated: {doc.updated}</p>

        <div className="mt-8">
          {doc.sections.map((section) => (
            <section key={section.heading} className="border-t border-[#1E2028] py-6 first:border-t-0 first:pt-0">
              <h2 className="font-display text-[16px] font-bold text-white">{section.heading}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="mt-3 max-w-[62ch] text-pretty text-[13.5px] leading-relaxed text-[#9CA0A8]">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
