import React, { Component, Fragment, MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { getClassName } from '../utils'

interface IProps {
    visible: boolean
    onClose: (status: boolean) => void
}

let globalNode: Element | null

const prefixClass = 'colors_mask'

export default class Mask extends Component<IProps, any> {

    constructor(props: IProps) {
        super(props)
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

    private node: Element | null = null

    private boxNode: Element | null = null

    public render(): JSX.Element {
        const { children, visible } = this.props
        if (this.node) {
            return createPortal(
                <div className={getClassName(`${prefixClass}`)} style={{ display: !visible ? 'none' : '' }} ref={(e) => this.boxNode = e} onClick={this.handleClick}>
                    {children}
                </div>
                , this.node
            )
        }
        return <Fragment />
    }

    private handleClick = (e: MouseEvent<HTMLDivElement>) => {
        const { onClose } = this.props
        if (e.target !== this.boxNode) {
            return
        }
        onClose(false)
    }
}
