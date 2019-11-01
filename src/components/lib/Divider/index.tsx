import React, { Component } from 'react'
import { getClassName } from '../utils'

export interface IDividerProps {
    className?: string
    width?: string
    height?: string
    color?: string
    type?: 'horizontal' | 'vertical'
}

export default class Divider extends Component<IDividerProps, any> {

    public static defaultProps: IDividerProps = {
        color: '#e6e6e6',
        type: 'vertical'
    }

    public render(): JSX.Element {
        const { className, width, height, color, type } = this.props
        return (
            <div
                className={getClassName(`divider ${type}`, className)}
                style={{ width, height, backgroundColor: color }}
            />
        )
    }
}
