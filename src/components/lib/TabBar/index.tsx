import React, { Component, createContext } from 'react'
import { isNil, isFunction } from 'muka'
import { getClassName, prefix } from '../utils'
import TabItem from './TabItem'

interface IDefaultValue {
    selectIndex: number
    setSelected: (index: any, width: number, height: number, activeWidth: number, activeHeght: number, activeLeft: number, activeTop: number, cb?: () => void) => void
    onChange: (field?: string | number) => void
    viewId: string
    tabItemClassName?: string
    mold: 'tab' | 'menu'
    type: 'horizontal' | 'vertical'
    width: number
    height: number
    selectedColor?: string
    setFn: (fn: () => void) => void
    activeWidth: number
    activeHeight: number
    activeLeft: number
    activeTop: number
}

const defaultValue: IDefaultValue = {
    selectIndex: 0,
    setSelected: (index: any, width: number, height: number, activeWidth: number, activeHeght: number, activeLeft: number, activeTop: number, cb?: () => void) => { return },
    onChange: (field?: string | number) => { return },
    viewId: '',
    mold: 'tab',
    type: 'horizontal',
    width: 0,
    height: 0,
    setFn: (val: () => void) => { return },
    activeWidth: 0,
    activeHeight: 0,
    activeLeft: 0,
    activeTop: 0,
}

export const { Consumer, Provider } = createContext(defaultValue)

export interface ITabBarProps {
    className?: string
    defaultSelect?: number
    selected?: number
    tabItemClassName?: string
    tabBarClassName?: string
    showLine?: boolean
    style?: React.CSSProperties
    selectedColor?: string
    type?: 'horizontal' | 'vertical'
    mold?: 'tab' | 'menu'
    onChange?: (field?: string | number) => void
}

interface IState {
    selectIndex: number
    width: number
    height: number
    activeWidth: number
    activeHeight: number
    activeLeft: number
    activeTop: number
}

const prefixClass = 'tab_bar'

export default class TabBar extends Component<ITabBarProps, IState> {

    public static defaultProps: ITabBarProps = {
        type: 'horizontal',
        mold: 'tab',
        showLine: true
    }

    constructor(props: ITabBarProps) {
        super(props)
        this.state.selectIndex = props.defaultSelect || props.selected || 0
    }

    public static Item = TabItem

    public state: IState = {
        selectIndex: 0,
        width: 0,
        height: 0,
        activeWidth: 0,
        activeHeight: 0,
        activeLeft: 0,
        activeTop: 0
    }

    private fn: (() => void) | null = null

    private id = Date.now().toString()

    public render(): JSX.Element {
        const { className, children, style, onChange, mold, tabItemClassName, tabBarClassName, selectedColor, showLine, selected } = this.props
        const { activeHeight, activeWidth, activeLeft, activeTop } = this.state
        let { type } = this.props
        if (mold === 'menu') {
            type = 'horizontal'
        }
        const tabView = (
            <div className={`flex ${prefix}${prefixClass}_${type}${tabBarClassName ? ' ' + tabBarClassName : ''}`}>
                <Provider
                    value={{
                        ...this.state,
                        setSelected: this.handleSelected,
                        viewId: `tab_bar_${this.id}`,
                        onChange: onChange ? onChange : (field?: string | number) => { return },
                        mold: mold || 'tab',
                        type: type || 'horizontal',
                        tabItemClassName,
                        selectedColor,
                        setFn: this.setFn
                    }}
                >
                    {
                        React.Children.map(children, (item: any, index: number) => {
                            const field = item.props.field
                            return React.cloneElement(item, { field: field ? field : index, onChange, selected })
                        })
                    }
                </Provider>
                {showLine && <div
                    className={getClassName(`${prefixClass}_active_bar`)}
                    style={{ transform: type === 'horizontal' ? `translate3d(${activeLeft}px, 0 , 0)` : `translate3d(0, ${activeTop}px, 0)`, height: type === 'horizontal' ? 2 : activeHeight, width: type === 'horizontal' ? activeWidth : 2, background: selectedColor }}
                />}
            </div>
        )
        return (
            <div className={getClassName(`${prefixClass} ${type === 'vertical' ? 'flex' : 'flex_column'} ${prefix}${mold}`, className)} style={style}>
                {mold !== 'menu' && tabView}
                <div className={getClassName(`${prefixClass}_view ${prefix}${type}${type === 'horizontal' ? ' flex' : ''}`)} id={`tab_bar_${this.id}`} />
                {mold === 'menu' && tabView}
            </div>
        )
    }

    public UNSAFE_componentWillReceiveProps(nextProps: ITabBarProps) {
        const { selectIndex } = this.state
        if (!isNil(nextProps.selected) && nextProps.selected !== selectIndex) {
            this.setState({
                selectIndex: nextProps.selected || 0
            }, () => {
                const timer = setTimeout(() => {
                    clearTimeout(timer)
                    if (isFunction(this.fn)) {
                        this.fn()
                    }
                }, 1)

            })
        }
    }

    private setFn = (fn: () => void) => {
        this.fn = fn
    }

    private handleSelected = (index: number, width: number, height: number, activeWidth: number, activeHeight: number, activeLeft: number, activeTop: number, cb?: () => void) => {
        const obj: any = {
            selectIndex: index,
            width,
            height,
            activeLeft,
            activeTop
        }
        if (activeWidth || activeHeight) {
            // tslint:disable-next-line: no-string-literal
            obj['activeHeight'] = activeHeight
            // tslint:disable-next-line: no-string-literal
            obj['activeWidth'] = activeWidth
        }
        this.setState(obj, cb)
    }
}
