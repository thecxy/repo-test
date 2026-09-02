declare module '*.css'
declare module '*.less'

type AnyType = any
declare module '*.svg' {
    export function ReactComponent (
        props: React.SVGProps<SVGSVGElement>,
    ): React.ReactElement

    const url: string
    export default url
}

// eslint-disable-next-line
interface Window {
    globalState: AnyType
    env: AnyType
    singleSpaNavigate: AnyType
}

type NumberOrNull = number | null
type StringOrNull = string | null
type BooleanOrNull = boolean | null
type StringOrNumber = string | number

declare type Validator = (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => Promise<void | AnyType> | void;
