import 'semantic-ui-css/components/reset.min.css'
import 'semantic-ui-css/components/icon.min.css'
import 'semantic-ui-css/components/label.min.css'
import 'semantic-ui-css/components/button.min.css'
import 'semantic-ui-css/components/header.min.css'
import 'semantic-ui-css/components/segment.min.css'
import 'semantic-ui-css/components/container.min.css'
import 'semantic-ui-css/components/site.min.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AnimatePresence, motion } from 'framer-motion';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon'
import Label from 'semantic-ui-react/dist/commonjs/elements/Label'
import Button from 'semantic-ui-react/dist/commonjs/elements/Button'
import Header from 'semantic-ui-react/dist/commonjs/elements/Header'
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment'
import Container from 'semantic-ui-react/dist/commonjs/elements/Container'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

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

const Heading = () => (
    <Container className="Heading">
        <Segment basic>
            <Header textAlign='center' size="huge">
                <Link href="/" passHref>
                    <Label size="massive" color="blue" basic>
                        THE ALIAS GAME
                    </Label>
                </Link>
            </Header>
        </Segment>
    </Container>
)

function MyApp({ Component, pageProps }: AppProps) {
    const rev = useTransitionDirection()
    const router = useRouter()
    return (
        <div className="App">
        <Heading />
        <AnimatePresence exitBeforeEnter initial={false}>
            <motion.div
                initial={{ x: rev ? '-80vw' : '80vw', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: rev ? '80vw' : '-80vw', opacity: 0 }}
                key={router.route}
                transition={{ duration: 0.25 }}
                className="Page"
            >
                <Container>
                    <Segment basic>
                        <Component {...pageProps} />
                    </Segment>
                </Container>
            </motion.div>
        </AnimatePresence>
        </div>
    );
}

export default MyApp
