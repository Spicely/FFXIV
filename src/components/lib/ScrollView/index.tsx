import React, { Component, CSSProperties, createContext } from 'react'
import { getClassName } from '../utils'

export interface IScrollViewProps {
    className?: string
    style?: CSSProperties
    scrollY?: boolean
    scrollX?: boolean
}

const prefixClass = 'scroll_view'

export const { Consumer, Provider } = createContext({
    controller: null
})

export default class ScrollView extends Component<IScrollViewProps, any> {

    private controller: HTMLDivElement | null = null

    public state = {
        controller: null
    }

    public render(): JSX.Element {
        const { children, className, style, scrollY, scrollX } = this.props
        return (
            <Provider value={{
                ...this.state
            }}>
                <div
                    ref={(e) => this.controller = e}
                    className={getClassName(`${prefixClass}`, className)}
                    style={{
                        ...style,
                        overflowY: scrollY ? 'auto' : 'hidden',
                        overflowX: scrollX ? 'auto' : 'hidden'
                    }}
                >
                    {children}
                </div>
            </Provider>
        )
    }
    public componentDidMount() {
        this.setState({
            controller: this.controller
        })
    }
}
