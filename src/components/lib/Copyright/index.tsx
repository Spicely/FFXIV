import React, { Component, CSSProperties } from 'react'
import { getClassName, prefix } from '../utils'

export interface ICopyrightProps {
    className?: string
    logo?: string
    style?: CSSProperties
    type?: 'horizontal' | 'vertical'
    label?: string
    onClick?: () => void
}

const prefixClass = 'copyright'

export default class Copyright extends Component<ICopyrightProps, any> {

    public static defaultProps: ICopyrightProps = {
        type: 'horizontal'
    }

    public render(): JSX.Element {
        const { className, style, type, logo, onClick, label } = this.props
        return (
            <div
                className={getClassName(`${prefixClass} ${prefix}${type} ${type === 'horizontal' ? ' flex flex_center' : ''}`, className)}
                style={style}
                onClick={onClick}
            >
                <div className={type === 'vertical' ? 'flex_center' : !logo ? prefix + 'n_logo' : ''}>
                    {
                        logo ? <img className={getClassName(`${prefixClass}__logo`)} src={logo} /> : null
                    }
                    <span className={getClassName(`${prefixClass}__label`)}>{label}</span>
                </div>
            </div>
        )
    }
}
