import useSwitch from '@react-hook/switch'

export const useTestLink = () => {
    const [nextButtonDisabled, toggleNext] = useSwitch(false)
    const [testLinkButtonDisabled, toggleTestLink] = useSwitch(false)
    return {
        nextButtonDisabled,
        toggleNext,
        testLinkButtonDisabled,
        toggleTestLink
    }
}
