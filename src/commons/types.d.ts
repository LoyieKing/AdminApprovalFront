import { ReactNode } from "react";

type TableDataSource<T, TIndex extends keyof T = unknown> = {
    title: string
    dataIndex: TIndex
    key: string
    width: number
    render?: (value: T[TIndex], record: T) => ReactNode
}[]