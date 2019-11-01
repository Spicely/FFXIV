import React, { Component } from 'react'
import { getClassName } from '../utils'

export interface ILabelHeaderProps {
    className?: string
    title?: string | JSX.Element
    right?: string | JSX.Element
    line?: 'horizontal' | 'vertical'
}

export default class LabelHeader extends Component<ILabelHeaderProps, any> {

    public render(): JSX.Element {
        const { title, line, className, right } = this.props
        return (
            <div className={getClassName(`label-header flex`, className)}>
                <div className="flex_justify">
                    <div className={getClassName(`label-header__title ${line || ''}`)}>{title}</div>
                </div>
                <div className="flex_1"></div>
                <div className="flex_justify">
                    <div className={getClassName(`label-header__right`)}>{right}</div>
                </div>
            </div>
        )
    }
}
