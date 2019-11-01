import React, { Component } from 'react'
import { isFunction } from 'muka'
import Link from 'next/link'
import { getClassName, prefix } from '../utils'
import Image from '../Image'

export interface IGridDataProps {
    url: string
    label?: string
    link?: string
}

export interface IGridProps {
    className?: string
    data: IGridDataProps[]
    columnNum?: number
    mode?: 'square' | 'rect'
    border?: boolean
    onChange?: (data: IGridDataProps) => void
}

const prefixClass = 'grid'

export default class Grid extends Component<IGridProps, any> {

    public static defaultProps: IGridProps = {
        columnNum: 4,
        data: [],
        mode: 'square'
    }

    public render(): JSX.Element {
        const { className, data, columnNum, border } = this.props
        const lineNum = Math.ceil(data.length / (columnNum || 4))
        return (
            <div className={getClassName(`${prefixClass}`, className)}>
                {
                    Array.from({ length: lineNum }, (v, k) => {
                        return (
                            <div className={getClassName(`${prefixClass}_list flex ${border ? prefix + 'divider' : ''}`)} key={`grid_list_${k}`}>
                                {this.renderList(k)}
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    private renderList(k: number) {
        const { data, columnNum, border, mode } = this.props
        const val: JSX.Element[] = []
        for (let i = k * (columnNum || 4); i < (k + 1) * (columnNum || 4); i++) {
            val.push(
                <Link href={data[i].link || ''} key={`grid_list_ietm_${k}_${i}`}>
                    <div
                        className={getClassName(`${prefixClass}_list_item ${prefix}${mode} ${(border && (i + 1) / ((k + 1) * (columnNum || 4)) !== 1) ? prefix + 'Viewider_right' : ''}`)}
                        style={{ width: 100 / (columnNum || 4) + '%' }}
                        onClick={this.handleChange.bind(this, data[i])}
                    >
                        <Image className={getClassName(`${prefixClass}_list_item__img ${prefix}${mode}`)} src={data[i].url} />
                        {data[i].label && <div className={getClassName(`${prefixClass}_list_item__label`)}>{data[i].label}</div>}
                    </div>
                </Link>
            )
        }
        return val
    }

    private handleChange = (data: IGridDataProps) => {
        const { onChange } = this.props
        if (isFunction(onChange)) {
            onChange(data)
        }
    }
}
