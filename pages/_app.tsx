import '../styles/globals.css'
import '@elastic/eui/dist/eui_theme_light.css';
import '@elastic/eui/dist/eui_theme_dark.css';
import type { AppProps } from 'next/app'
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { EuiEmptyPrompt, EuiPage, EuiPageBody, EuiPageContent, EuiPageHeader, EuiProvider } from '@elastic/eui';

const useTransitionDirection = () => {
    const router = useRouter()
    const [lastIdx, setLastIdx] = useState(0)
    const [reverse, setReverse] = useState(false)
    useEffect(() => {
        router.beforePopState((newState: any) => {
            setReverse(lastIdx > newState.idx)
            return true
        })
        const newRouteHandler = (...args: any) => {
            const currentIdx = window.history.state.idx
            setLastIdx(currentIdx)
            if (reverse) setTimeout(() => setReverse(false), 400)
        }
        router.events.on('routeChangeComplete', newRouteHandler)
        return () => {
            router.events.off('routeChangeComplete', newRouteHandler)
        }
    })
    return reverse
}

function MyApp({ Component, pageProps }: AppProps) {
    const rev = useTransitionDirection()
    const router = useRouter()
    return (
        <EuiProvider colorMode="dark">
            <EuiPage paddingSize="none" className="eui-fullHeight">
                <EuiPageBody className="eui-fullHeight">
                    <EuiPageHeader
                        restrictWidth
                        iconType="logoElastic"
                        pageTitle="Page title"
                        paddingSize="l"
                    />
                            <EuiPageContent className="eui-fullHeight"
                                hasShadow={false}
                                style={{ display: 'flex' }}
                            >
                                <EuiPageContent
                                    borderRadius="m"
                                    verticalPosition="center"
                                    horizontalPosition="center"
                                    paddingSize="none"
                                    color="plain"
                                    hasBorder={false}
                                    hasShadow={false}
                                >
                    <AnimatePresence exitBeforeEnter initial={false}>
                        <motion.div
                            initial={{ x: rev ? '-40vw' : '40vw', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: rev ? '40vw' : '-40vw', opacity: 0 }}
                            key={router.route}
                            transition={{ duration: 0.2 }}
                            className="Page eui-fullHeight"
                        >

                                    <EuiEmptyPrompt hasBorder={true} body={<Component {...pageProps} />} />
                        </motion.div>
                    </AnimatePresence>
                                </EuiPageContent>
                            </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </EuiProvider>
    );
}

export default MyApp
