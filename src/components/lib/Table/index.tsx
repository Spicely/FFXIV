import React, { Component } from 'react'
import { TableProps } from 'antd/lib/table'
import { Table as RCTable } from 'antd'
import { getClassName } from '../utils'
import { omit } from 'muka'

export interface ITableColumns {
    title?: string
    dataIndex?: string
    key?: string
    width?: string | number
    render?: (value?: any, row?: any, index?: any) => (JSX.Element | JSX.Element[] | string)
}

export interface ITableProps extends TableProps<any> {
    className?: string
    dataSource: IValue[]
}
export interface IValue {
    [name: string]: any
}
export default class Table extends Component<ITableProps, any> {

    public static defaultProps = {
        columns: [],
        dataSource: []
    }

    public render(): JSX.Element {
        const { className } = this.props
        const props = omit(this.props, ['className'])
        return (
            <RCTable
                {...props}
                className={getClassName('table', className)}
            />
        )
    }
}
