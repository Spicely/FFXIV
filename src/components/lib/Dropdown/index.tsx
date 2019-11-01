import React, { Component } from 'react'
import { getClassName } from '../utils'

export interface IDropdownProps {
    className?: string
    overlay: JSX.Element
    trigger?: Array<'click' | 'hover' | 'contextMenu'>
    animateClass?: string
}

interface IState {
    visible: boolean
    left: number
}

export default class Dropdown extends Component<IDropdownProps, IState> {

    public static defaultProps = {
        trigger: ['click'],
        animateClass: 'anima_fadeIn'
    }

    public state: IState = {
        visible: false,
        left: 0
    }

    private dorpdown: HTMLDivElement | null = null

    private dropdownOverlay: HTMLDivElement | null = null

    public render(): JSX.Element {
        const { children, className, overlay, animateClass } = this.props
        const { visible, left } = this.state
        return (
            <div className={getClassName('dropdown', className)} ref={(e: HTMLDivElement | null) => this.dorpdown = e}>
                {children}
                <div
                    className={getClassName(`dropdown_overlay ${visible ? animateClass || '' : ''}`, visible ? '' : 'hide')}
                    ref={(e: HTMLDivElement | null) => this.dropdownOverlay = e}
                    style={{ left }}
                >
                    {overlay}
                </div>
            </div>
        )
    }

    public componentDidMount() {
        const { trigger } = this.props
        if (trigger) {
            trigger.map((i: string) => {
                this.dorpdown && this.dorpdown.addEventListener(i, this.handelVisible)
            })
        }
    }

    private handelVisible = () => {
        const { visible } = this.state
        let left = 0
        if (this.dropdownOverlay && this.dorpdown) {
            const width = this.dropdownOverlay.offsetWidth
            const dropWidth = this.dorpdown.offsetWidth
            left = width / 2 - dropWidth / 2
        }

        this.setState({
            visible: !visible,
            left: -left
        })
    }
}
