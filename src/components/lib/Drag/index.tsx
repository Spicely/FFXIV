import React, { Component, DragEvent } from 'react'
import { isFunction, Observer } from 'muka'
import DragBox from './dragBox'
import { getClassName } from '../utils'
export const observer = new Observer()

export interface IDragProps {
    data?: any
    onDragStart?: (data: any, e: DragEvent<HTMLDivElement>) => void
    onDragEnd?: (data: any, e: DragEvent<HTMLDivElement>) => void
    boxLine?: boolean
}

const prefixClass = 'drag'

export default class Drag extends Component<IDragProps, any> {

    public static Box = DragBox

    private status: boolean = false

    public render(): JSX.Element {
        const { children } = this.props
        if (React.Children.count(children) > 1 || React.Children.count(children) === 0) {
            throw new Error('children length It can only be equal to 1')
        }
        return (
            <div
                draggable
                className={getClassName(`${prefixClass}`)}
                onDragStart={this.handleDragStart}
                onDragEnd={this.handleDragEnd}
            >
                {
                    React.Children.map(children, (item: any) => {
                        return React.cloneElement(item, {})
                    })
                }
            </div>
        )
    }

    public componentDidMount() {
        observer.subscribe('dragLeave', this.handleDragLeave)
    }

    public componentWillMount() {
        observer.unsubscribe('dragLeave', this.handleDragLeave)
        this.setState = () => {
            return
        }
    }

    private handleDragStart = (e: DragEvent<HTMLDivElement>) => {
        const { data, onDragStart } = this.props
        observer.publish('dragShowLine', true)
        if (isFunction(onDragStart)) {
            onDragStart(data, e)
        }
    }

    private handleDragLeave = (status: boolean) => {
        this.status = status
    }

    private handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const { data, onDragEnd } = this.props
        if (isFunction(onDragEnd)) {
            onDragEnd(data, e)
        }
        observer.publish('dragShowLine', false)
        if (this.status) {
            this.status = false
            observer.publish('dragEnd', data)
        }
    }
}
