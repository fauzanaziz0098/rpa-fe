import Layout from '@/components/Layout/App/index'; // Import your layout component here
import { hasCookie } from 'cookies-next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const pathExcept = router.pathname.match(/[^/]+$/)?.[0] || ''; // Extract the last segment
  let path = router.pathname.slice(1)
  if (pathExcept == "[id]") {
    path = path.replace('[id]', "edit")
  }

  if (pathExcept == 'pageOne' || pathExcept == 'sign-in' || pathExcept == 'home') {
    return (
      <>
       <Head>
        <title>RPA - Monitoring Machine</title>
      </Head>
      <Component {...pageProps}/>
      </>
    )
  }
  return (
    <>
    <Head>
        <title>RPA - Master Data</title>
      </Head>
    <Layout path={path}>
      <Component {...pageProps} />
    </Layout>
    </>
  );
}

export default MyApp;