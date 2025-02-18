import type { GetServerSideProps, InferGetStaticPropsType } from 'next'

import DashboardPage from '@/components/admin/pages/dashboard-page'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'



type Props = {
  // Add custom props here
}

const Homepage = (
  _props: InferGetStaticPropsType<typeof getServerSideProps>
) => {

  return (
    <>
      <Head>
        <title>Hackitech.co</title>
      </Head>
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        <div className="relative z-10">
          <DashboardPage />
        </div>
      </div>
    </>
  )
}

// or getServerSideProps: GetServerSideProps<Props> = async ({ locale })
export const getServerSideProps: GetServerSideProps<Props> = async ({
  locale,
}) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', [
      'common',
    ])),
  },
})

export default Homepage
