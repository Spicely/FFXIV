import React, { Component, CSSProperties } from 'react'
import Router from 'next/router'
import { getClassName, prefix } from '../utils'
import Icon, { iconType } from '../Icon'
import Image from '../Image'

interface INoticeValueProps {
    title?: string | JSX.Element
    label: string | JSX.Element
    style?: CSSProperties
    link?: string
}

export interface INoticeProps {
    className?: string
    logo?: string
    style?: CSSProperties
    icon?: iconType
    iconColor?: string
    speed?: number
    labelColor?: string
    titleColor?: string
    loop?: boolean
    timingFunction?: string
    effect?: 'scrollx' | 'scrolly'
    mode?: 'roll' | 'switch'
    value: INoticeValueProps[]
}

// tslint:disable-next-line: no-empty-interface
interface IState {
    selectIndex: number
    animate: boolean
    valueIndex: number
    valueAnimate: boolean
}

const prefixClass = 'notice'

export default class Notice extends Component<INoticeProps, IState> {

    public static defaultProps: INoticeProps = {
        value: [],
        loop: true,
        mode: 'roll',
        effect: 'scrollx',
        speed: 2,
        timingFunction: 'linear'
    }

    public state: IState = {
        selectIndex: 0,
        valueIndex: 0,
        animate: true,
        valueAnimate: true
    }

    private viewInfo = {
        left: 0,
        top: 0
    }

    private status: boolean = false

    private timer: any

    private animateNode: Element | null = null

    private ev: boolean = false

    private itemNode: Element | null = null

    public render(): JSX.Element {
        const { className, logo, value, style, icon, iconColor, labelColor, effect, titleColor, loop, speed, timingFunction, mode } = this.props
        const { selectIndex, animate, valueAnimate, valueIndex } = this.state
        const itemStyle: CSSProperties = {}
        const loopStyle: CSSProperties = {}
        if (effect === 'scrollx' && mode === 'roll') {
            itemStyle.transform = `translate3d(${-valueIndex * this.viewInfo.left}px, 0, 0)`
            itemStyle.transition = `all ${valueAnimate ? speed : 0}s ${timingFunction}`
        } else if (effect === 'scrolly' && mode === 'roll') {
            itemStyle.transform = `translate3d(0, ${-valueIndex * this.viewInfo.top}px, 0)`
            itemStyle.transition = `all ${valueAnimate ? speed : 0}s ${timingFunction}`
        } else if (effect === 'scrollx' && mode === 'switch') {
            itemStyle.transform = `translate3d(${-valueIndex * this.viewInfo.left}px, 0, 0)`
            itemStyle.transition = `all ${valueAnimate ? '0.5' : 0}s ${timingFunction}`
        } else if (effect === 'scrolly' && mode === 'switch') {
            itemStyle.transform = `translate3d(0, ${-valueIndex * this.viewInfo.top}px, 0)`
            itemStyle.transition = `all ${valueAnimate ? '0.5' : 0}s ${timingFunction}`
        }
        if (effect === 'scrollx' && mode === 'roll') {
            loopStyle.transform = `translate3d(${-selectIndex * this.viewInfo.left}px, 0, 0)`
            loopStyle.transition = `all ${animate ? speed : 0}s ${timingFunction}`
        } else if (effect === 'scrolly' && mode === 'roll') {
            loopStyle.transform = `translate3d(0, ${-selectIndex * this.viewInfo.top}px, 0)`
            loopStyle.transition = `all ${animate ? speed : 0}s ${timingFunction}`
        } else if (effect === 'scrollx' && mode === 'switch') {
            loopStyle.transform = `translate3d(${-selectIndex * this.viewInfo.left}px, 0, 0)`
            loopStyle.transition = `all ${animate ? '0.5' : 0}s ${timingFunction}`
        } else if (effect === 'scrolly' && mode === 'switch') {
            loopStyle.transform = `translate3d(0, ${-selectIndex * this.viewInfo.top}px, 0)`
            loopStyle.transition = `all ${animate ? '0.5' : 0}s ${timingFunction}`
        }
        return (
            <div className={getClassName(`${prefixClass} flex`, className)} style={style}>
                {logo && (
                    <div className="flex_justify">
                        <div className={getClassName(`${prefixClass}_logo ${prefix}divider_right `)}>
                            <Image className={getClassName(`${prefixClass}_logo__img`)} src={logo} />
                        </div>
                    </div>
                )}
                {
                    icon && (
                        <div className="flex_justify" style={{ marginRight: '5px' }}>
                            <Icon icon={icon} fontSize="18px" color={iconColor} />
                        </div>
                    )
                }
                <div className={getClassName(`${prefixClass}_view flex_1`, effect === 'scrollx' ? 'flex' : '')} ref={(e) => this.animateNode = e}>
                    {
                        value.map((item, index: number) => (
                            <div
                                className={getClassName(`${prefixClass}_view__item`)}
                                key={index}
                                style={{
                                    ...itemStyle,
                                    visibility: (index === 0 && this.status && value.length !== 1) ? 'hidden' : 'initial'
                                }}
                                ref={(e) => this.itemNode = e}
                                onClick={this.handleToView.bind(this, item.link)}
                            >
                                {item.title && (
                                    <div className={getClassName(`${prefixClass}_view_title`)} style={{ color: titleColor }}>
                                        {item.title}
                                    </div>
                                )}
                                <div
                                    className={getClassName(`${prefixClass}_view_label  ${item.title ? prefix + 'text__hide' : ''} flex_justify`)}
                                    style={{
                                        color: labelColor,
                                        height: item.title ? '' : '100%',
                                        WebkitLineClamp: item.title ? 2 : 1,
                                        display: item.title ? '' : 'flex'
                                    }}
                                >
                                    {item.label}
                                </div>
                            </div>
                        ))
                    }
                    {
                        loop && value.length > 0 && (
                            <div
                                className={getClassName(`${prefixClass}_view__item`)}
                                key={'index'}
                                style={loopStyle}
                                onClick={this.handleToView.bind(this, value[0].link)}
                            >
                                {value[0].title && (
                                    <div className={getClassName(`${prefixClass}_view_title`)} style={{ color: titleColor }}>
                                        {value[0].title}
                                    </div>
                                )}
                                <div
                                    className={getClassName(`${prefixClass}_view_label  ${value[0].title ? prefix + 'text__hide' : ''} flex_justify`)}
                                    style={{
                                        color: labelColor,
                                        height: value[0].title ? '' : '100%',
                                        WebkitLineClamp: value[0].title ? 2 : 1,
                                        display: value[0].title ? '' : 'flex'
                                    }}
                                >
                                    {value[0].label}
                                </div>
                            </div>
                        )
                    }
                </div>

            </div>
        )
    }

    public componentDidMount() {
        const { value, mode, speed, loop } = this.props
        if (mode === 'roll' && (value.length > 1 || loop)) {
            this.setSelectIndex(1, value)
            this.itemNodeFun((speed || 2) * 1000)
        } else {
            this.animateSwitch((speed || 2) * 1000)
        }
    }

    public UNSAFE_componentWillReceiveProps(nextProps: INoticeProps) {
        const { value, effect, mode, loop } = this.props
        if (value.length !== nextProps.value.length) {
            clearInterval(this.timer)
            this.timer = undefined
            if (nextProps.value.length === 1) {
                this.status = false
            } else {
                this.status = true
            }
            if (nextProps.mode === 'switch') {
                this.animateSwitch((nextProps.speed || 2) * 1000)
            } else {
                const { valueIndex } = this.state
                this.setSelectIndex(valueIndex + 1, nextProps.value)
                this.itemNodeFun((nextProps.speed || 2) * 1000)
            }
        }
        if (loop !== nextProps.loop) {
            if (nextProps.loop && !this.timer) {
                if (nextProps.mode === 'roll') {
                    const { valueIndex } = this.state
                    this.setSelectIndex(valueIndex + 1, nextProps.value)
                    this.itemNodeFun((nextProps.speed || 2) * 1000)
                } else {
                    this.animateSwitch((nextProps.speed || 2) * 1000)
                }
            }
        }
        if (nextProps.value.length === 0) {
            this.setSelectIndex(0, nextProps.value)
        }
        if (effect !== nextProps.effect && nextProps.mode !== 'switch') {
            this.setState({
                animate: false,
                valueAnimate: false,
            }, () => {
                setTimeout(() => {
                    this.itemNodeFun((nextProps.speed || 2) * 1000)
                }, 1)
            })
        }
        if (nextProps.mode !== mode) {
            clearInterval(this.timer)
            this.timer = undefined
            if (nextProps.value.length === 1) {
                this.status = false
            } else {
                this.status = true
            }
            if (nextProps.mode === 'switch') {
                this.animateSwitch((nextProps.speed || 2) * 1000)
            } else {
                const { valueIndex } = this.state
                this.setSelectIndex(valueIndex + 1, nextProps.value)
                this.itemNodeFun((nextProps.speed || 2) * 1000)
            }
        }
    }

    public componentWillUnmount() {
        clearInterval(this.timer)
        this.timer = undefined
    }

    private animateSwitch = (time: number) => {
        this.timer = setInterval(() => {
            const { value, loop } = this.props
            if (this.animateNode) {
                const ref = this.animateNode.getBoundingClientRect()
                this.viewInfo = {
                    left: ref.width,
                    top: ref.height
                }
            }
            const { valueIndex, selectIndex } = this.state
            const index = valueIndex + 1
            const sIndex = selectIndex + 1
            if (loop) {
                this.setState({
                    valueIndex: index > value.length ? 0 : index,
                    animate: true,
                    selectIndex: sIndex > value.length + 1 ? 0 : sIndex,
                    valueAnimate: true
                }, () => {
                    // tslint:disable-next-line: no-shadowed-variable
                    const { valueIndex, selectIndex } = this.state
                    if (valueIndex === value.length) {
                        setTimeout(() => {
                            this.status = true
                            this.setState({
                                valueIndex: value.length > 1 ? 0 : -1,
                                valueAnimate: false,
                            })
                        }, 500)
                    }
                    if (selectIndex === value.length + 1) {
                        setTimeout(() => {
                            this.setState({
                                selectIndex: index > value.length ? 0 : index,
                                animate: false,
                            })
                        }, 500)
                    }
                })
            } else {
                if (index === value.length) {
                    clearInterval(this.timer)
                    this.timer = undefined
                    return
                }
                this.setState({
                    valueIndex: index > value.length ? 0 : index,
                    animate: true,
                    selectIndex: sIndex > value.length ? 0 : sIndex,
                    valueAnimate: true
                })
            }
        }, time)
    }

    private itemNodeFun = (time: number) => {
        this.timer = setInterval(() => {
            const { loop, value } = this.props
            if (this.animateNode) {
                const ref = this.animateNode.getBoundingClientRect()
                this.viewInfo = {
                    left: ref.width,
                    top: ref.height
                }
            }
            const { valueIndex, selectIndex } = this.state
            const index = valueIndex + 1
            const sIndex = selectIndex + 1
            if (loop) {
                if (this.status) {
                    this.setState({
                        valueIndex: value.length + 1 === index ? 0 : index,
                        valueAnimate: value.length + 1 === index ? false : true,
                        selectIndex: value.length > 2 ? index : sIndex,
                        animate: sIndex === value.length + 2 ? false : true
                    }, () => {
                        // tslint:disable-next-line: no-shadowed-variable
                        const { selectIndex } = this.state
                        if (selectIndex === value.length + 2) {
                            this.ev = true
                            this.setState({
                                selectIndex: value.length - 1,
                                animate: false
                            }, () => {
                                setTimeout(() => {
                                    this.setState({
                                        selectIndex: value.length,
                                        animate: true
                                    })
                                }, 10)
                            })
                        }
                        if (value.length + 1 === index) {
                            setTimeout(() => {
                                this.setState({
                                    valueIndex: 1,
                                    valueAnimate: true
                                })
                            }, 10)
                        }
                    })
                } else {
                    if (value.length === 1) {
                        this.setState({
                            valueIndex: value.length + 1 <= index ? -1 : index,
                            valueAnimate: value.length + 1 <= index ? false : true,
                            selectIndex: sIndex >= 3 ? 0 : sIndex,
                            animate: sIndex >= 3 ? false : true,
                        }, () => {
                            // tslint:disable-next-line: no-shadowed-variable
                            const { valueIndex } = this.state

                            if (valueIndex === -1) {
                                setTimeout(() => {
                                    this.setState({
                                        valueIndex: 0,
                                        valueAnimate: true
                                    })
                                }, 10)
                            }
                            if (sIndex >= 3) {
                                setTimeout(() => {
                                    this.setState({
                                        selectIndex: 1,
                                        animate: true
                                    })
                                }, 10)
                            }
                        })
                        return
                    }
                    this.setState({
                        valueIndex: index,
                        animate: true,
                        selectIndex: sIndex,
                        valueAnimate: true
                    })
                    if (index - value.length === 1) {
                        this.status = true
                        this.setState({
                            valueIndex: 0,
                            valueAnimate: false
                        }, () => {
                            setTimeout(() => {
                                this.setState({
                                    valueIndex: 1,
                                    valueAnimate: true
                                })
                            }, 10)
                        })
                    }
                }

            } else {
                if (index === value.length) {
                    clearInterval(this.timer)
                    this.timer = undefined
                    return
                }
                this.setState({
                    valueIndex: index > value.length ? 0 : index,
                    animate: true,
                    selectIndex: sIndex > value.length ? 0 : sIndex,
                    valueAnimate: true
                })
            }
        }, time)
    }

    private setSelectIndex(index: number, value: any[]) {
        if (this.animateNode) {
            const ref = this.animateNode.getBoundingClientRect()
            this.viewInfo = {
                left: ref.width,
                top: ref.height
            }
            this.setState({
                valueAnimate: true,
                animate: true,
                selectIndex: index,
                valueIndex: index
            })
        }
    }

    private handleToView(url?: string) {
        if (url) {
            Router.push(url)
        }
    }
}
