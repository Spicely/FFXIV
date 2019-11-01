import React, { Component } from 'react'
import { getClassName } from '../utils'

export interface IProgressProps {
    className?: string
    percent: number
    successPercent?: number
    text?: string | JSX.Element
    percentColor?: string
    successPercentColor?: string
}

const prefixClass = 'progress'

interface IState {
    status: boolean
}

export default class Progress extends Component<IProgressProps, IState> {

    constructor(props: IProgressProps) {
        super(props)
        if (props.percent === 100) {
            this.state.status = true
        }
    }

    public static defaultProps: IProgressProps = {
        percent: 0,
        successPercentColor: '#52c41a'
    }

    public state: IState = {
        status: false
    }

    public render(): JSX.Element {
        const { className, percent, successPercent, text, successPercentColor, percentColor } = this.props
        const { status } = this.state
        const val = percent > 100 ? 100 : percent < 0 ? 0 : percent
        const succerss = (successPercent || 0) > 100 ? 100 : (successPercent || 0) < 0 ? 0 : (successPercent || 0)
        return (
            <div className={getClassName(`${prefixClass} flex`, className)}>
                <div className="flex_1 flex_justify">
                    <div className={getClassName(`${prefixClass}_inter`)}>
                        <div
                            className={getClassName(`${prefixClass}_inter__bg`)}
                            style={{ width: `${val}%`, background: status ? percentColor : successPercentColor }}
                            onTransitionEnd={this.handleTransitionEnd.bind(this, val)}
                        />
                        <div className={getClassName(`${prefixClass}_inter_success__bg`)} style={{ width: `${succerss}%`, background: successPercentColor }} />
                    </div>
                </div>
                {
                    text && (
                        <div className={getClassName(`${prefixClass}__text`)}>
                            {text}
                        </div>
                    )
                }
            </div>
        )
    }

    private handleTransitionEnd = (val: number) => {
        if (val === 100) {
            this.setState({
                status: true
            })
        }
    }
}
