import React, { Component } from 'react'
import { getClassName } from '../utils'

export interface IBoxLineProps {
    className?: string
}

export default class BoxLine extends Component<IBoxLineProps, any> {
    public render(): JSX.Element {
        const { children, className } = this.props
        return (
            <div className={getClassName('box_line', className)}>
                {children}
            </div>
        )
    }
}
