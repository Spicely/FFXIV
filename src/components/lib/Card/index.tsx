import React, { Component } from 'react'
import { getClassName } from '../utils'
import Image from '../Image'

export interface ICardProps {
    className?: string
    source?: string
}

const prefixClass = 'card'

export default class Card extends Component<ICardProps, any> {
    public render(): JSX.Element {
        const { className, source, children } = this.props
        return (
            <div className={getClassName(`${prefixClass}`, className)}>
                {source && <Image className={getClassName(`${prefixClass}_img`)} src={source} />}
                <div className={getClassName(`${prefixClass}_info`)}>
                    {children}
                </div>
            </ div>
        )
    }
}
