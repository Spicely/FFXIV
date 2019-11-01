import React, { Component, CSSProperties } from 'react'
import { isFunction } from 'muka'
import Link from 'next/link'
import { getClassName, prefix } from '../utils'
import Image from '../Image'

export interface IModularList {
    title: string | JSX.Element
    label: string | JSX.Element
    url: string
    titleColor?: string
    labelColor?: string
    link?: string
}

export interface IModularProps {
    className?: string
    style?: CSSProperties
    value: [IModularList, IModularList, IModularList, IModularList]
    onChange?: (data: IModularList) => void
}

// tslint:disable-next-line: no-empty-interface
interface IState {

}

const prefixClass = 'modular'

export default class Modular extends Component<IModularProps, IState> {

    public render(): JSX.Element {
        const { className, style, value } = this.props
        return (
            <div className={getClassName(`${prefixClass} flex`, className)} style={style}>
                <Link href={value[0].link || ''}>
                    <div className={getClassName(`${prefixClass}_left flex_column`)} onClick={this.handleChange.bind(this, value[0])}>
                        <div className={getClassName(`${prefixClass}__title`)} style={{ color: value[0].titleColor || '#FF6969' }}>
                            {value[0].title}
                        </div>
                        <div className={getClassName(`${prefixClass}__label`)} style={{ color: value[0].labelColor || '#CECECE' }}>
                            {value[0].label}
                        </div>
                        <div className={getClassName(`${prefixClass}__img flex_1 flex_justify`)}>
                            <Image className={`${prefix}_img`} src={value[0].url} />
                        </div>
                    </div>
                </Link>
                <div className="flex_1 flex_column">
                    <Link href={value[1].link || ''}>
                        <div className="flex flex_1" style={{ paddingBottom: '10px' }} onClick={this.handleChange.bind(this, value[1])}>
                            <div className={getClassName(`${prefixClass}_right_top`)}>
                                <div className={getClassName(`${prefixClass}__title`)} style={{ color: value[1].titleColor || '#9598FF' }}>
                                    {value[1].title}
                                </div>
                                <div className={getClassName(`${prefixClass}__label`)} style={{ color: value[1].labelColor || '#CECECE' }}>
                                    {value[1].label}
                                </div>
                            </div>
                            <div className={getClassName(`${prefixClass}_two__img flex_1`)}>
                                <Image className={`${prefix}_img`} src={value[1].url} />
                            </div>
                        </div>
                    </Link>
                    <div className="flex flex_1">
                        <Link href={value[2].link || ''}>
                            <div className="flex_1 flex_column" onClick={this.handleChange.bind(this, value[2])}>
                                <div className={getClassName(`${prefixClass}__title`)} style={{ color: value[2].titleColor || '#FFBE69' }}>
                                    {value[2].title}
                                </div>
                                <div className={getClassName(`${prefixClass}__label`)} style={{ color: value[2].labelColor || '#CECECE' }}>
                                    {value[2].label}
                                </div>
                                <div className={getClassName(`${prefixClass}__img flex_1 flex_justify`)}>
                                    <Image className={`${prefix}_img_list`} src={value[2].url} />
                                </div>
                            </div>
                        </Link>
                        <Link href={value[3].link || ''}>
                            <div className="flex_1 flex_column" onClick={this.handleChange.bind(this, value[3])}>
                                <div className={getClassName(`${prefixClass}__title`)} style={{ color: value[3].titleColor || '#48F3F9' }}>
                                    {value[3].title}
                                </div>
                                <div className={getClassName(`${prefixClass}__label`)} style={{ color: value[3].labelColor || '#CECECE' }}>
                                    {value[3].label}
                                </div>
                                <div className={getClassName(`${prefixClass}__img flex_1 flex_justify`)}>
                                    <Image className={`${prefix}_img_list`} src={value[3].url} />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    private handleChange = (data: IModularList) => {
        const { onChange } = this.props
        if (isFunction(onChange)) {
            onChange(data)
        }
    }
}
