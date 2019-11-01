import React, { InputHTMLAttributes, CSSProperties, Component, MouseEvent } from 'react'
import { omit } from 'muka'
import Icon from '../Icon'
import { getClassName } from '../utils'

export interface ISearchProps extends InputHTMLAttributes<any> {
    className?: string
    style?: CSSProperties
    placeholder?: string
    onPress?: (e?: MouseEvent<HTMLDivElement>) => void
    iconPos?: 'left' | 'right'
}

const prefixClass = 'search'

export default class Search extends Component<ISearchProps, any> {

    public static defaultProps = {
        iconPos: 'right'
    }

    public render(): JSX.Element {
        const { className, style, onPress, iconPos } = this.props
        const otherProps = omit(this.props, ['className', 'style', 'onPress', 'iconPos'])
        return (
            <div
                className={getClassName(`${prefixClass} flex`, className)}
                style={style}
                onClick={onPress}
            >
                <input className={`flex_1 ${iconPos}`} {...otherProps} />
                <Icon icon="ios-search" />
            </div>
        )
    }
}
