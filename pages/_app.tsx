import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'
import { trpc } from '@/utils/trpc'
import { Loader2 } from 'lucide-react'
import type { AppType } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const App: AppType = ({ Component, pageProps }) => {

  const [progressActive, setProgressActive] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = (url: string) => (url !== router.asPath) && setProgressActive(true);
    const handleComplete = (url: string) => (url === router.asPath) && setProgressActive(false);

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })

  return (
    <>
      <div className={`p-2 inset-x-4 fixed top-4 z-30 transition-all ${progressActive ? 'translate-y-0' : '-translate-y-[200%]'} bg-secondary text-foreground border-2 rounded-md flex items-center gap-3`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <p>Tar dulu bentar..</p>
      </div>
      <Component {...pageProps} />
      <Toaster/>
    </>
  )
}

export default trpc.withTRPC(App)
