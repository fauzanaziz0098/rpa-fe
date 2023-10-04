import { AppShell, Center, createStyles, Flex, Loader, LoadingOverlay, MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { hasCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

const useStyles = createStyles((theme) => ({
    main: {
        height: "100vh",
        display: 'flex',
        padding: theme.spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: theme.colorScheme == 'dark' ? 'black' : 'white',
        // backgroundImage: `url(${theme.colorScheme == 'dark' ? backgroundDark.src : backgroundLight.src})`,
        // backgroundAttachment: 'fixed',
        // backgroundSize: 'contain',
        // backgroundRepeat: 'no-repeat',
        // backgroundPositionY: 'bottom'
    },
}));
export default function Auth({ children }) {
    const router = useRouter()
    const { classes } = useStyles();
    useEffect(() => {
        if (hasCookie('auth')) {
            router.push('/home')
        }
    }, [])
    return (
        <main className={classes.main} style={{
            filter: hasCookie('auth') ? 'blur(100px)' : null,
        }}>
            {children}
        </main>
    )
}
