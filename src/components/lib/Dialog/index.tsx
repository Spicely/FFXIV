import React, { Component, Fragment, CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { isFunction, isNull, isUndefined } from 'muka'
import { getClassName, prefix } from '../utils'
import Button from '../Button'
import NavBar from '../NavBar'
import Icon from '../Icon'

export interface IDialogProps {
    className?: string
    title?: string | JSX.Element
    visible?: boolean
    style?: CSSProperties
    animateInClass?: string
    animateOutClass?: string
    footer?: JSX.Element | null
    onClose?: (val: boolean) => void
    onOk?: () => Promise<void> | void
    onFirstShow?: () => void
    pos?: 'center' | 'bottom'
    async?: boolean
}

interface IState {
    visible: boolean
    animate: boolean
}

const prefixClass = 'dialog'

let globalNode: Element | null

export default class Dialog extends Component<IDialogProps, IState> {

    public static defaultProps: IDialogProps = {
        animateInClass: 'slipUp',
        animateOutClass: 'slipBottom',
        pos: 'center'
    }

    constructor(props: IDialogProps) {
        super(props)
        if (props.visible) {
            this.state.animate = props.visible
            this.state.visible = props.visible
            this.status = true
            this.index++
        }

        if (typeof document !== 'undefined') {
            globalNode = document.querySelector(`.${getClassName('mask_box')}`)
            if (globalNode) {
                this.node = globalNode
            } else {
                const dom = document.createElement('div')
                dom.className = getClassName('mask_box')
                const body = document.querySelector('body')
                if (body) {
                    body.appendChild(dom)
                }
                this.node = dom
                globalNode = dom
            }
        }
    }

    private index: number = 0

    public state: IState = {
        visible: false,
        animate: false
    }

    private node: Element | null = null

    private animateNode: Element | null = null

    private timer: any

    private status: boolean = false

    public UNSAFE_componentWillReceiveProps(nextProps: IDialogProps) {
        const { visible } = this.state
        if (visible !== nextProps.visible) {
            const obj: any = {
                animate: nextProps.visible || false,
            }
            if (nextProps.visible) {
                this.index++
                obj.visible = nextProps.visible
                this.status = true
            }
            this.setState(obj)
        }
    }

    public componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }

    public render(): JSX.Element {
        const { className, title, children, footer, animateInClass, animateOutClass, style, pos, onOk, async } = this.props
        const { visible, animate } = this.state
        if (this.node && this.status) {
            return createPortal(
                <div className={getClassName(`${prefixClass} flex_${pos} ${animate ? 'fadeIn' : 'fadeOut'}`)} style={{ display: visible ? '' : 'none' }}>
                    <div
                        className={getClassName(`${prefixClass}_content flex_column ${animate ? animateInClass : animateOutClass}`, className)}
                        style={style}
                        onAnimationEnd={this.handelAnimate}
                    >
                        <NavBar
                            left={
                                <div className="navbar_label">{title}</div>
                            }
                            className={getClassName(`${prefixClass}_content__navbar`)}
                            right={<Icon icon="ios-close" style={{ cursor: 'pointer' }} onClick={this.handleClose} />}
                        />
                        <div className={getClassName(`${prefixClass}_content__box flex_1`)}>
                            {children}
                        </div>
                        <NavBar
                            className={getClassName(`${prefixClass}_content__navbar ${prefix}divider_top`)}
                            divider={false}
                            left=" "
                            right={
                                <div className="flex">
                                    {
                                        isNull(footer) ? null : isUndefined(footer) ?
                                            (
                                                <Fragment>
                                                    <Button onClick={this.handleClose} style={{ marginRight: '10px' }}>取消</Button>
                                                    <Button mold="primary" async={async} onClick={onOk}>确定</Button>
                                                </Fragment>
                                            ) : footer
                                    }
                                </div>
                            }
                        />
                    </div>
                </div>,
                this.node
            )
        }
        return <Fragment />
    }

    private handelAnimate = () => {
        const { onFirstShow } = this.props
        const { animate } = this.state
        if (!animate) {
            this.timer = setTimeout(() => {
                clearTimeout(this.timer)
                this.setState({
                    visible: false
                })
            }, 200)
        }
        if (animate && this.index === 1 && isFunction(onFirstShow)) {
            this.index++
            onFirstShow()
        }
    }

    private handleClose = () => {
        const { onClose } = this.props
        if (isFunction(onClose)) {
            onClose(false)
        } else {
            this.setState({
                animate: false
            })
        }
    }
}
