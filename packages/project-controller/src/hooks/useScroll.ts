import { useEffect, RefObject } from 'react'

type DocumentOrHTMLElement = Document | HTMLElement

const useScroll = (
    ref: RefObject<DocumentOrHTMLElement>,
    threshold: number,
    callbackAboveThreshold: () => void,
    callbackBelowThreshold: () => void
) => {
    useEffect(() => {
        const handleScroll = () => {
            const node = ref.current
            if (node) {
                const scrollTop = node instanceof Document ? node.documentElement.scrollTop || node.body.scrollTop : node.scrollTop
                if (scrollTop >= threshold) {
                    callbackAboveThreshold()
                } else {
                    callbackBelowThreshold()
                }
            }
        };

        const node = ref.current
        if (node) {
            node.addEventListener('scroll', handleScroll)
        }

        // 清理
        return () => {
            if (node) {
                node.removeEventListener('scroll', handleScroll)
            }
        }
    }, [ref, threshold, callbackAboveThreshold, callbackBelowThreshold])
}

export default useScroll
