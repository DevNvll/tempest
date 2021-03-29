import '@css/tailwind.css'
import '@css/main.css'

import { FC } from 'react'
import type { AppProps } from 'next/app'

import { GoogleFonts } from 'next-google-fonts'
import { DefaultSeo } from 'next-seo'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ModalHandler } from '@components/Modal/Handler'

import '../config/amplify'
import { ToastProvider } from '@components/UI/Toast/ToastHandler'

const Noop: FC = ({ children }) => <>{children}</>

const queryClient = new QueryClient()

function MyApp({ Component, pageProps, router }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  return (
    <>
      <DefaultSeo
        titleTemplate={
          router.route === '/' ? 'Exsign Studio' : '%s | Exsign Studio'
        }
      />
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;600;700;800;900&display=swap" />
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ModalHandler />
          <Layout pageProps={pageProps}>
            <Component {...pageProps} />
          </Layout>
        </ToastProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
