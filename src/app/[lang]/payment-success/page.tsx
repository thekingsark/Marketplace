import { Metadata } from 'next'
import { SEO } from '@/constants'
import { useTranslation } from '../../i18n/index'
import { PageWrapper } from '@/components/page-wrapper'
import { PaypalPaymentSuccess } from '@/components/paypal-payment-success'
import { Suspense } from 'react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)

  const title = t('pageSEO.payment_success_title')
  const description = t('pageSEO.payment_success_description')

  return {
    title,
    openGraph: {
      title,
      description,
      images: [
        {
          url: SEO.IMAGE_URL,
          width: 300,
          height: 300,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [
        {
          url: SEO.TWITTER_IMAGE_URL,
          width: 300,
          height: 300,
          alt: title,
        },
      ],
    },
  }
}

export default async function PaymentSuccessfulPage() {
  return (
    <PageWrapper>
      <Suspense fallback={null}>
        <PaypalPaymentSuccess />
      </Suspense>
    </PageWrapper>
  )
}
