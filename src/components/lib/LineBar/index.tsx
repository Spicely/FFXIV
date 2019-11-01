import React, { Component, CSSProperties } from 'react'
import { getClassName } from '../utils'

export interface ILineBarProps {
    className?: string
    style?: CSSProperties
    label?: string
    bgUrl?: string
    color?: string
}

// tslint:disable-next-line: no-empty-interface
interface IState {

}

const prefixClass = 'line_bar'

export default class LineBar extends Component<ILineBarProps, IState> {

    public render(): JSX.Element {
        const { className, style, label, bgUrl, color } = this.props
        const viewStyle: CSSProperties = {}
        if (bgUrl) {
            viewStyle.backgroundImage = `url(${bgUrl})`
        }
        if (color) {
            viewStyle.color = color
        }
        return (
            <div className={getClassName(`${prefixClass}`, className)} style={style}>
                <div className={getClassName(`${prefixClass}_view flex_center`, className)} style={viewStyle}>{label}</div>
            </div>
        )
    }
}
