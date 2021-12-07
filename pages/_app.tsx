import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import LoadingSpinner from './components/ui/LoadingSpinner';
import StoreContextProvider from '../src/context/StoreContext';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeComplete", () => setTimeout(() => setLoading(false), 250));
  }, [router.events])
  
  return <StoreContextProvider>
    {
      loading
        ? <LoadingSpinner />
        : <Component {...pageProps} />
    }
    </StoreContextProvider>
}
export default MyApp
