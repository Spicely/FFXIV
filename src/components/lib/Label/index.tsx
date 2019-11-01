import React, { Component, CSSProperties, MouseEvent } from 'react'
import { getClassName } from '../utils'
import { omit } from 'muka'

export interface ILabelProps {
    onClick?: (event: MouseEvent<HTMLSpanElement>) => void
    className?: string
    color?: string
    style?: CSSProperties
}

export default class Label extends Component<ILabelProps, any> {

    public static defaultProps = {
        color: '#4395FF'
    }

    public render(): JSX.Element {
        const { className, children, style, color } = this.props
        const cssStyle: CSSProperties = { ...style }
        if (!cssStyle.color) {
            cssStyle.color = color
        }
        const props = omit(this.props, ['style', 'color', 'className'])
        return (
            <span
                {...props}
                style={cssStyle}
                className={getClassName('label', className)}
            >
                {children}
            </span>
        )
    }
}
