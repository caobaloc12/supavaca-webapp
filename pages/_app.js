import '../styles/globals.css'
import { SessionProvider as AuthProvider } from 'next-auth/react'

import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <AuthProvider session={pageProps?.session}>
        <Component {...pageProps} />
      </AuthProvider>
      <Toaster />
    </>
  )
}

export default MyApp
