import Layout from '@/components/Layout/App/index'; // Import your layout component here
import { NotificationsProvider } from '@mantine/notifications';
import { hasCookie } from 'cookies-next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const pathExcept = router.pathname.match(/[^/]+$/)?.[0] || ''; // Extract the last segment
  let path = router.pathname.slice(1)
  let {id} = router.query
  if (pathExcept == "[id]") {
    path = path.replace('[id]', id)
  }

  if (pathExcept == 'monitor-machine' || pathExcept == 'sign-in' || pathExcept == 'home' || pathExcept == '_error') {
    return (
      <>
       <Head>
        <title>RPA - Monitoring Machine</title>
      </Head>
      <NotificationsProvider>
        <Component {...pageProps}/>
      </NotificationsProvider>
      </>
    )
  }
  return (
    <>
    <Head>
        <title>RPA - Master Data</title>
      </Head>
    <Layout path={path}>
      <NotificationsProvider>
        <Component {...pageProps} />
      </NotificationsProvider>
    </Layout>
    </>
  );
}

export default MyApp;