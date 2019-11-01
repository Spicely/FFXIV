import React, { Component } from 'react'
import Item from './Item'
import Input from './Input'
import { getClassName } from '../utils'

export interface IGirdProps {
    className?: string
    style?: React.CSSProperties
}

const prefixClass = 'gird'

export default class Gird extends Component<IGirdProps, any> {

    public static Item = Item

    public static Input = Input

    public render(): JSX.Element {
        const { className, style } = this.props
        const { children } = this.props
        return (
            <div className={`${getClassName(`${prefixClass}`, className)}`} style={style}>
                {children}
            </div>
        )
    }
}
