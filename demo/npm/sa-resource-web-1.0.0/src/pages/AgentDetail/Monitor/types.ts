import { ReactNode } from "react"

export type Item = {
    index: number,
    title: ReactNode,
    key: string,
    isLeaf?: boolean,
    children: Item[]
}
