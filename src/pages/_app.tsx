import '@css/tailwind.css'
import '@css/main.css'

import { FC } from 'react'
import type { AppProps } from 'next/app'

import GoogleFonts from 'next-google-fonts'
import { DefaultSeo } from 'next-seo'

const Noop: FC = ({ children }) => <>{children}</>

function MyApp({ Component, pageProps, router }: AppProps) {
  const Layout = (Component as any).Layout || Noop

  return (
    <>
      <DefaultSeo
        titleTemplate={
          router.route === '/' ? 'Exsign Studio' : '%s | Exsign Studio'
        }
      />
      <GoogleFonts href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" />
      <Layout pageProps={pageProps}>
        <Component {...pageProps} /></Layout>
    </>
  )
}

export default MyApp
