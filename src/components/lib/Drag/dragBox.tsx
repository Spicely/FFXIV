import React, { Component, DragEvent, CSSProperties } from 'react'
import { isFunction } from 'muka'
import { observer } from './index'
import { getClassName, prefix } from '../utils'

export interface IDragBoxProps {
    className?: string
    style?: CSSProperties
    onDragOver?: (e: DragEvent<HTMLDivElement>) => void
    onDragLeave?: (e: DragEvent<HTMLDivElement>) => void
    onDragEnter?: (e: DragEvent<HTMLDivElement>) => void
    onDragSuccess?: (data: any) => void
}

interface IState {
    boxLine: boolean
}

const prefixClass = 'drag_box'

export default class DragBox extends Component<IDragBoxProps, IState> {

    public state: IState = {
        boxLine: false
    }

    public render(): JSX.Element {
        const { children, className, style } = this.props
        const { boxLine } = this.state
        return (
            <div
                className={getClassName(`${prefixClass} flex_column`, className)}
                style={style}
            >
                <div
                    className={getClassName(`${prefixClass}_view flex_1 ${boxLine ? prefix + prefixClass + '_line' : ''}`)}
                    onDragOver={this.handleDragOver}
                    onDragLeave={this.handleDragLeave}
                    onDragEnter={this.handleDragEnter}
                >
                    {children}
                </div>
            </div>
        )
    }

    public componentWillUnmount() {
        observer.unsubscribe('dragEnd', this.handleDragEnd)
        observer.unsubscribe('dragShowLine', this.handleShowLine)
    }

    public componentDidMount() {
        observer.subscribe('dragEnd', this.handleDragEnd)
        observer.subscribe('dragShowLine', this.handleShowLine)
    }

    private handleShowLine = (status: boolean) => {
        this.setState({
            boxLine: status
        })
    }

    private handleDragEnd = (data: any) => {
        const { onDragSuccess } = this.props
        observer.publish('dragLeave', true)
        if (isFunction(onDragSuccess)) {
            onDragSuccess(data)
        }
    }

    private handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const { onDragEnter } = this.props
        observer.publish('dragLeave', true)
        if (isFunction(onDragEnter)) {
            onDragEnter(e)
        }
    }

    private handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const { onDragLeave } = this.props
        observer.publish('dragLeave', false)
        if (isFunction(onDragLeave)) {
            onDragLeave(e)
        }
    }

    private handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const { onDragOver } = this.props
        if (isFunction(onDragOver)) {
            onDragOver(e)
        }
    }
}
