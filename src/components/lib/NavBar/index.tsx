import React, { Component, CSSProperties } from 'react'
import Router from 'next/router'
import { isArray, isNumber, isNull, isFunction, isString } from 'muka'
import { getClassName, prefix } from '../utils'
import Icon, { iconType } from '../Icon'
import Image from '../Image'

export interface INavBarRightIcon {
    type: 'icon'
    url: iconType
    link?: string
    color?: string
    onClick?: () => void
}

export interface INavBarRightImage {
    type: 'image'
    url: string
    link?: string
    onClick?: () => void
}

export interface INavBarProps {
    className?: string
    leftClassName?: string
    titleClassName?: string
    rightClassName?: string
    titleCenter?: boolean
    style?: CSSProperties
    left?: string | JSX.Element | null
    title?: string | JSX.Element
    right?: string | JSX.Element | null | INavBarRightImage[] | INavBarRightIcon[]
    fixed?: boolean
    endVal?: number
    divider?: boolean
    animate?: boolean
    onBack?: () => void
    onRightClick?: () => void
}

const prefixClass = 'nav_bar'

export default class NavBar extends Component<INavBarProps, any> {

    public static defaultProps: INavBarProps = {
        divider: true
    }

    public render(): JSX.Element {
        const { className, left, divider, title, right, fixed, leftClassName, titleCenter, titleClassName, rightClassName, style, onRightClick, children } = this.props
        const c: any = right
        let rightValue: any = []
        if (isArray(c)) {
            rightValue = c.map((item: INavBarRightIcon | INavBarRightImage, index: number) => {
                if (item.type === 'icon') {
                    return (
                        <div className={getClassName(`${prefixClass}_right__item`)} key={index}>
                            <Icon
                                icon={item.url}
                                color={item.color}
                                onClick={this.handleClick.bind(this, item.link, item.onClick)}
                            />
                        </div>

                    )
                } else if (item.type === 'image') {
                    return (
                        <div className={getClassName(`${prefixClass}_right__item`)} key={index}>
                            <Image
                                className={getClassName(`${prefixClass}_right__img`)}
                                src={item.url}
                                onClick={this.handleClick.bind(this, item.link, item.onClick)}
                            />
                        </div>
                    )
                }
                return null
            })
        } else {
            rightValue = right
        }
        return (
            <div
                className={`${getClassName(`${prefixClass} ${divider ? prefix + 'divider' : ''} flex_justify ${fixed ? prefix + 'fixed' : ''}`, className)}`}
                style={style}
            >
                <div className="flex">
                    {
                        !isNull(left) && (
                            <div className={getClassName(`${prefixClass}_left flex_justify`, leftClassName)} onClick={this.handleBack}>
                                {left ? left : <Icon icon="ios-arrow-back" />}
                            </div>
                        )
                    }
                    <div className={getClassName(`${prefixClass}_title flex_1 ${titleCenter ? 'flex_center' : 'flex_justify'}`, titleClassName)}> {title || children}</div>
                    {
                        !isNull(rightValue) && (
                            <div className={getClassName(`${prefixClass}_right flex ${isString(rightValue) ? 'flex_justify' : ''}`, rightClassName)} onClick={onRightClick}> {rightValue} </div>
                        )
                    }
                </div>
            </div>
        )
    }

    public componentDidMount() {
        const { fixed, animate } = this.props
        if (fixed && animate) {
            window.addEventListener('scroll', this.handleScroll)
        }
    }

    private handleScroll = () => {
        const { endVal } = this.props
        const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
        if (isNumber(endVal)) {
            console.log(top)
        }
    }

    private handleClick = (link?: string, onClick?: () => boolean | void) => {
        let status = true
        if (isFunction(onClick)) {
            status = onClick() || false
        }
        if (status && link) {
            Router.push(link)
        }
    }

    private handleBack = () => {
        const { onBack } = this.props
        if (isFunction(onBack)) {
            onBack()
        } else {
            Router.back()
        }
    }
}
