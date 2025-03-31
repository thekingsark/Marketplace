import { Metadata } from 'next'
import { SEO } from '@/constants'
import { useTranslation } from '../../i18n/index'
import { PageWrapper } from '@/components/page-wrapper'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)

  const title = t('pageSEO.terms_title')
  const description = t('pageSEO.terms_description')

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

export default async function RecommendationsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang)

  return (
    <>
      <PageWrapper>
        <div className="max-width d-flex flex-column align-items-start w-100 gap-3 mt-30 mt-sm-5 mb-50">
          <h1 className="mt-30">{t('terms_conditions.titles.terms_and_conditions')}</h1>
          <div>
            <h2 className="terms-h2 mb-10">
              {t('terms_conditions.terms_and_conditions.acceptance_of_terms.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_and_conditions.acceptance_of_terms.content')}
            </p>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.terms_and_conditions.user_responsibilities.title')}
            </h2>
            <p className="m-0">
              {t(
                'terms_conditions.terms_and_conditions.user_responsibilities.sections.responsible_use'
              )}
            </p>
            <p className="m-0">
              {t(
                'terms_conditions.terms_and_conditions.user_responsibilities.sections.prohibited_content'
              )}
            </p>
            <p className="m-0">
              {t(
                'terms_conditions.terms_and_conditions.user_responsibilities.sections.account_security'
              )}
            </p>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.terms_and_conditions.sharing_of_information.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_and_conditions.sharing_of_information.content')}
            </p>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.terms_and_conditions.liability.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_and_conditions.liability.sections.not_responsible')}
            </p>
            <p className="m-0">
              {t('terms_conditions.terms_and_conditions.liability.sections.indemnification')}
            </p>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.terms_and_conditions.account_removal.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_and_conditions.account_removal.sections.user_right')}
            </p>
            <p className="m-0">
              {t('terms_conditions.terms_and_conditions.account_removal.sections.admin_right')}
            </p>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.terms_and_conditions.modifications.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.terms_and_conditions.modifications.content')}
            </p>
          </div>

          <h1 className="mt-30">{t('terms_conditions.titles.cookie_policy')}</h1>
          <div>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.cookie_policy.use_of_cookies.title')}
            </h2>
            <p className="m-0">{t('terms_conditions.cookie_policy.use_of_cookies.content')}</p>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.cookie_policy.types_of_cookies.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.cookie_policy.types_of_cookies.sections.essential_cookies')}
            </p>
            <p className="m-0">
              {t('terms_conditions.cookie_policy.types_of_cookies.sections.performance_cookies')}
            </p>
            <p className="m-0">
              {t('terms_conditions.cookie_policy.types_of_cookies.sections.functionality_cookies')}
            </p>
            <p className="m-0">
              {t('terms_conditions.cookie_policy.types_of_cookies.sections.third_party_cookies')}
            </p>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.cookie_policy.user_consent.title')}
            </h2>
            <p className="m-0">{t('terms_conditions.cookie_policy.user_consent.content')}</p>
          </div>

          <h1 className="mt-30">{t('terms_conditions.titles.security_policy')}</h1>
          <div>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.security_policy.data_protection.title')}
            </h2>
            <p className="m-0">{t('terms_conditions.security_policy.data_protection.content')}</p>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.security_policy.user_responsibility.title')}
            </h2>
            <p className="m-0">
              {t('terms_conditions.security_policy.user_responsibility.content')}
            </p>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.security_policy.data_sharing.title')}
            </h2>
            <p className="m-0">{t('terms_conditions.security_policy.data_sharing.content')}</p>
          </div>

          <h1 className="mt-30">{t('terms_conditions.titles.prohibited_activities')}</h1>
          <div>
            <p className="m-0">
              {t('terms_conditions.prohibited_activities.sections.prohibited_content')}
            </p>
            <p className="m-0">
              {t('terms_conditions.prohibited_activities.sections.misuse_of_app')}
            </p>
            <p className="m-0">
              {t('terms_conditions.prohibited_activities.sections.consequences')}
            </p>
            <h1 className="mt-30">{t('terms_conditions.titles.user_rights')}</h1>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.user_rights.account_deletion.title')}
            </h2>
            <p className="m-0">{t('terms_conditions.user_rights.account_deletion.content')}</p>
            <h2 className="terms-h2 mt-10 mb-10">
              {t('terms_conditions.user_rights.complaints.title')}
            </h2>
            <p className="m-0">{t('terms_conditions.user_rights.complaints.content')}</p>
          </div>

          <h1 className="mt-30">{t('terms_conditions.titles.other_information')}</h1>
          <div>
            <p className="m-0">{t('terms_conditions.other_information.sections.no_guarantee')}</p>
            <p className="m-0">
              {t('terms_conditions.other_information.sections.legal_compliance')}
            </p>
            <p className="m-0">{t('terms_conditions.other_information.sections.admin_rights')}</p>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
