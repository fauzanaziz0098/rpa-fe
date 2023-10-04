
import Auth from "@/components/common/Layout/Auth";
import { LoadingOverlay } from "@mantine/core";
import { hasCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function HomePage() {
    const router = useRouter()
    useEffect(() => {
        router.push('/sign-in')
    }, [])
    return <LoadingOverlay visible={true} />;
}

HomePage.getLayout = (page) => {
    return <Auth>{page}</Auth>;
};


export function getServerSideProps({ req, res }) {
    if (hasCookie('auth', { req, res })) {
        return {
            redirect: {
                permanent: true,
                destination: '/home',
            },
        }
    } else {
        return {
            props: {}
        }
    }
}