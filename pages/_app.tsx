import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import LoadingSpinner from './components/ui/loadingSpinner';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeComplete", () => setTimeout(() => setLoading(false), 250));
  }, [router.events])
  
  return <>{
    loading
      ? <LoadingSpinner />
      : <Component {...pageProps} />
    }</>
}
export default MyApp
