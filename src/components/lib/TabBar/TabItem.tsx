import React, { Component, MouseEvent, Fragment, CSSProperties } from 'react'
import { Tooltip } from 'antd'
import { TooltipPlacement } from 'antd/lib/tooltip'
import { omit, isFunction, browser } from 'muka'
import { Consumer } from './index'
import RenderDom from './renderDom'
import { getClassName, prefix } from '../utils'

interface IProps {
    className?: string
    label?: string | JSX.Element | JSX.ElementClass
    icon?: JSX.Element
    selectedIcon?: JSX.Element
    field?: number
    tooltipTitle?: string | JSX.Element
    placement?: TooltipPlacement
}

// tslint:disable-next-line: no-empty-interface
interface IState { }

const prefixClass = 'tab_bar_item'

export default class TabItem extends Component<IProps, IState> {

    public static defaultProps = {
        selected: false
    }

    public state: IState = {}

    private nodeId: string = ''

    private height: number = 0

    private width: number = 0

    private timer?: any

    private setSelected: any

    private rootDom: any

    private selectIndex: number = 0

    private setFn: ((fn: () => void) => void) | null = null

    public render(): JSX.Element {
        const { className, label, children, icon, field, tooltipTitle, placement } = this.props
        const props = omit(this.props, ['icon', 'className', 'label', 'children', 'selected', 'field', 'tooltipTitle', 'placement'])
        return (
            <Consumer>
                {
                    (val) => {
                        this.nodeId = val.viewId
                        this.setSelected = val.setSelected
                        this.selectIndex = val.selectIndex
                        this.setFn = val.setFn
                        let style: CSSProperties = {}
                        if (browser.isMobile) {
                            style = { transform: val.type === 'horizontal' ? `translate3d(-${val.width * val.selectIndex}px, 0 , 0)` : `translate3d(0, -${val.height * val.selectIndex}px, 0)` }
                        } else {
                            if (field === 0) {
                                style = val.type === 'horizontal' ? { marginLeft: `-${val.width * val.selectIndex}px`, } : { marginTop: `-${val.height * val.selectIndex}px` }
                            }
                        }
                        const viewDom = (
                            <RenderDom id={val.viewId}>
                                <div
                                    className={getClassName(`${prefixClass}_view ${prefix}${val.type}`)}
                                    style={style}
                                >
                                    {children}
                                </div>
                            </RenderDom>
                        )
                        // tslint:disable-next-line: only-arrow-functions
                        const renderDom = function (child: JSX.Element) {
                            if (tooltipTitle) {
                                return (
                                    <Fragment>
                                        <Tooltip title={tooltipTitle} placement={placement}>{child}</Tooltip>
                                        {viewDom}
                                    </Fragment>
                                )
                            } else {
                                return (
                                    <Fragment>
                                        {child}
                                        {viewDom}
                                    </Fragment>
                                )
                            }
                        }
                        return renderDom(
                            <div
                                {...props}
                                className={getClassName(`${prefixClass} ${val.mold === 'menu' ? ' flex_1' : ''} ${field === val.selectIndex ? prefix + 'selected' : ''}${val.tabItemClassName ? ' ' + val.tabItemClassName : ''}`, className)}
                                onClick={this.handleSelected.bind(this, val.setSelected, val.onChange)}
                            >
                                <div
                                    className={`flex flex_center flex_1 ${(label && icon) ? '' : 'all_height'}`}

                                >
                                    {
                                        icon && (
                                            <div className={getClassName(`${prefixClass}_icon flex_center `)} style={{ color: field === val.selectIndex ? val.selectedColor : '' }}>
                                                {this.getSelectNode(val.selectIndex)}
                                            </div>
                                        )
                                    }
                                    {
                                        label && (
                                            <div className={getClassName(`${prefixClass}_label flex_center`)} style={{ color: field === val.selectIndex ? val.selectedColor : '' }}>{label}</div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                }
            </Consumer>
        )
    }

    public componentDidMount() {
        if (isFunction(this.setFn)) {
            this.setFn(this.getActiveNode)
        }
        this.getNodeVal()
    }

    public componentWillUnmount() {
        clearTimeout(this.timer)
    }

    public UNSAFE_componentWillReceiveProps(nextPorps: any) {
        const { label } = this.props
        if (nextPorps.label !== label) {
            this.timer = setTimeout(() => {
                clearTimeout(this.timer)
                this.getActiveNode()
            }, 1)
        }
    }

    private getNodeVal = () => {
        if (this.nodeId) {
            const dom = document.querySelector(`#${this.nodeId}`)
            if (dom) {
                this.rootDom = dom.parentElement
                const obj = dom.getBoundingClientRect()
                this.height = obj.height
                this.width = obj.width
            }
        }
        this.getActiveNode()
    }

    private getActiveNode = () => {
        const { field } = this.props
        if (this.selectIndex === field && this.rootDom) {
            const activeDom = this.rootDom.querySelector(`.${getClassName(`${prefixClass}`)}.${prefix}selected`)
            if (activeDom) {
                const root = this.rootDom.getBoundingClientRect()
                const obj = activeDom.getBoundingClientRect()
                if (isFunction(this.setSelected)) {
                    this.setSelected(this.selectIndex, this.width, this.height, obj.width, obj.height, obj.left - root.left, obj.top - root.top)
                }
            }
        }
    }

    private getSelectNode(selectIndex: number): string | JSX.Element | JSX.ElementClass | undefined {
        const { icon, selectedIcon, field } = this.props
        if (!selectedIcon) {
            return icon
        }
        return selectIndex === field ? selectedIcon : icon
    }

    private handleSelected(setSelected: (index: any, width: number, height: number, activeWidth: number, activeHeght: number, left: number, top: number, cb?: () => void) => void, onChange: (field?: string | number) => void, e: MouseEvent<HTMLDivElement>) {
        const { field } = this.props
        setSelected(field, this.width, this.height, 0, 0, 0, 0, this.getNodeVal)
        onChange(field)
    }
}
