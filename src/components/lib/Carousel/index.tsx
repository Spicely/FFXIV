import React, { Component, CSSProperties } from 'react'
import { isNumber, isFunction } from 'muka'
import hexRgb from 'hex-rgb'
import Image from '../Image'
import { getClassName, prefix } from '../utils'

export interface ICarouselValueProps {
    url: string
    link?: string
}

export interface ICarouselProps {
    className?: string
    dotPosition?: 'top' | 'bottom' | 'left' | 'right' | 'bottomRight' | 'bottomLeft'
    dotType?: 'rectangle' | 'circular'
    dotColor?: string
    dotClassName?: string
    value: ICarouselValueProps[]
    dots?: boolean
    autoplay?: boolean
    defaultSelected?: number
    style?: CSSProperties
    time?: number
    onChnage?: (selected: number) => void
    effect?: 'scrollx' | 'scrolly' | 'fade'
    baseUrl?: string
    selected?: number
}

interface IState {
    selectIndex: number
    left: number
    top: number
    animate: boolean
}

const prefixClass = 'carousel'

export default class Carousel extends Component<ICarouselProps, IState> {

    constructor(props: ICarouselProps) {
        super(props)
        if (isNumber(props.defaultSelected)) {
            this.state.selectIndex = props.selected || props.defaultSelected
        }
    }

    public static defaultProps: ICarouselProps = {
        dotPosition: 'bottom',
        dotType: 'rectangle',
        dots: true,
        time: 2000,
        value: [],
        autoplay: false,
        effect: 'scrollx',
        baseUrl: ''
    }

    public state: IState = {
        selectIndex: 0,
        top: 0,
        left: 0,
        animate: true
    }

    private carouselNode: Element | null = null

    private timer?: any

    private animateNode: Element | null = null

    public render(): JSX.Element {
        const { className, dotPosition, dotClassName, dots, effect, style, autoplay, value, dotType, dotColor, baseUrl } = this.props
        const { selectIndex, left, top, animate } = this.state
        const cssStyle: CSSProperties = {}
        const dotStyle: CSSProperties = {}
        if (dotColor) {
            const color = hexRgb(dotColor)
            dotStyle.background = `rgba(${color.red}, ${color.green}, ${color.blue}, 0.6)`
        }
        if (effect === 'scrollx') {
            cssStyle.transform = `translate3d(-${selectIndex * left}px, 0, 0)`
            cssStyle.transition = animate ? '' : 'none'
        } else if (effect === 'scrolly') {
            cssStyle.transform = `translate3d(0, -${selectIndex * top}px, 0)`
            cssStyle.transition = animate ? '' : 'none'
        }
        return (
            <div
                className={getClassName(`${prefixClass}${effect === 'scrollx' ? ' flex' : ''}`, className)}
                style={style}
                ref={(e) => this.carouselNode = e}
            >
                {
                    value.map((child, index) => {
                        return (
                            <div
                                className={getClassName(`${prefixClass}__item flex_center ${effect === 'fade' ? prefix + 'fade' : ''}`)}
                                style={{
                                    ...cssStyle,
                                    opacity: effect === 'fade' ? index === selectIndex ? 1 : 0 : 1

                                }}
                                ref={this.domAddEvent.bind(this, index)}
                                key={index}
                            >
                                {
                                    <Image className={getClassName(`${prefixClass}__item_image`)} src={baseUrl + child.url} />
                                }
                            </div>
                        )
                    })
                }
                {autoplay && effect !== 'fade' && value.map((child, index) => {
                    if (index === 0) {
                        return (
                            <div
                                className={getClassName(`${prefixClass}__item flex_center`)}
                                style={cssStyle}
                                key={`extend_${index}`}
                                ref={(e) => this.animateNode = e}
                            >
                                {
                                    <Image className={getClassName(`${prefixClass}__item_image`)} src={baseUrl + child.url} />
                                }
                            </div>
                        )
                    }
                    return undefined
                })
                }
                {
                    dots && (
                        <div className={getClassName(`${prefixClass}_dot ${prefix}${dotPosition}  flex_justify`)}>
                            <div className="flex_center">
                                <span className={(dotPosition === 'bottom' || dotPosition === 'top' || dotPosition === 'bottomRight' || dotPosition === 'bottomLeft') ? 'flex' : ''}>
                                    {
                                        value.map((child, index) => {
                                            return (
                                                <div
                                                    className={getClassName(`${prefixClass}_dot__item ${prefix}${dotType} ${selectIndex % value.length === index ? prefix + 'active' : ''}`, dotClassName)} key={index}
                                                    onClick={this.handleTabIndex.bind(this, index)}
                                                    style={selectIndex % value.length === index ? { background: dotColor } : dotStyle}
                                                />
                                            )
                                        })
                                    }
                                </span>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }

    public componentDidMount() {
        const { autoplay } = this.props
        if (this.carouselNode) {
            const obj = this.carouselNode.getBoundingClientRect()
            this.setState({
                top: obj.height,
                left: obj.width
            })
        }
        if (this.animateNode) {
            this.animateNode.addEventListener('transitionend', this.handleAnimate)
        }
        this.interval(autoplay || false)
    }

    private domAddEvent = (index: number, animateNode: HTMLDivElement) => {
        if (index === 0 && animateNode) {
            animateNode.removeEventListener('transitionend', this.handleAnimate)
            animateNode.addEventListener('transitionend', this.handleAnimate)
        }
    }

    public UNSAFE_componentWillReceiveProps(nextProps: ICarouselProps) {
        const { autoplay, selected, time } = this.props
        if (autoplay !== nextProps.autoplay) {
            if (nextProps.autoplay && !this.timer) {
                this.interval(true)
            } else {
                clearInterval(this.timer)
                this.timer = undefined
            }
        }
        if (nextProps.autoplay && time !== nextProps.time) {
            clearInterval(this.timer)
            this.interval(true)
        }
        if (isNumber(nextProps.selected) && selected !== nextProps.selected) {
            clearInterval(this.timer)
            this.setState({
                selectIndex: nextProps.selected || 0
            }, () => {
                this.interval(nextProps.autoplay || false)
            })
        }
    }

    public componentWillUnmount() {
        clearInterval(this.timer)
        if (this.animateNode) {
            this.animateNode.removeEventListener('transitionend', this.handleAnimate)
        }
        this.timer = undefined
    }

    private interval(autoPlay: boolean) {
        const { time, effect } = this.props
        if (autoPlay) {
            this.timer = setInterval(() => {
                const { value } = this.props
                const { selectIndex } = this.state
                const length = value.length
                const status = effect !== 'fade' ? selectIndex === length : selectIndex === length - 1
                this.handleTabIndex(status ? 0 : selectIndex + 1)
            }, time)
        }
    }

    private handleAnimate = () => {
        const { effect, value } = this.props
        const { selectIndex } = this.state
        if (selectIndex === value.length && effect !== 'fade') {
            this.setState({
                selectIndex: 0,
                animate: false
            }, () => {
                setTimeout(() => {
                    this.setState({
                        animate: true
                    })
                }, 20)
            })
        }
    }

    private handleTabIndex(index: number) {
        const { onChnage, value } = this.props
        this.setState({
            selectIndex: index
        })
        if (isFunction(onChnage)) {
            onChnage(index % value.length)
        }
    }
}
