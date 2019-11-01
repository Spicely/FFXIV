import React, { Component, CSSProperties } from 'react'
import { getClassName, prefix } from '../utils'
import { iconType } from '../Icon'

export interface IAlertProps {
    className?: string
    showIcon?: boolean
    icon?: iconType | JSX.Element
    type?: 'success' | 'info' | 'warning' | 'warning'
    title?: string | JSX.Element
    inheritColor?: boolean
    message: string | JSX.Element
    style?: CSSProperties
}

// tslint:disable-next-line: no-empty-interface
interface IState {

}

const prefixClass = 'alert'

export default class Alert extends Component<IAlertProps, IState> {

    public static defaultProps: IAlertProps = {
        showIcon: false,
        inheritColor: false,
        type: 'info',
        message: ''
    }

    public render(): JSX.Element {
        const { type, message, title, inheritColor, style, className } = this.props
        return (
            <div className={getClassName(`${prefixClass} ${prefix}${prefixClass}_${type}${inheritColor ? ' inherit_color' : ''}`, className)} style={style}>
                {
                    title ? (
                        <div className={getClassName(`${prefixClass}_title`)} style={{ marginBottom: message ? '' : 0 }}>
                            {title}
                        </div>
                    ) : null
                }
                <div className={getClassName(`${prefixClass}_msg`)}>
                    {message}
                </div>
            </div>
        )
    }
}
