import React, { Component, TextareaHTMLAttributes, ChangeEvent } from 'react'
import { isFunction, omit } from 'muka'
import { getClassName } from '../utils'

export interface ITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string
    showMaxLength?: boolean
}

interface IState {
    val: string
}

export default class Textarea extends Component<ITextareaProps, IState> {

    public state: IState = {
        val: ''
    }

    public render(): JSX.Element {
        const { className, maxLength, showMaxLength } = this.props
        const { val } = this.state
        const props = omit(this.props, ['className', 'onChange', 'showMaxLength'])
        return (
            <div className={getClassName(`textarea`, className)} >
                <textarea {...props} onChange={this.handleChange}>
                </textarea>
                {(showMaxLength && maxLength) ? <div className={getClassName('textarea_max_length flex_justify')}>{val.length}/{maxLength}</div> : null}
            </div>
        )
    }

    private handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { onChange } = this.props
        this.setState({
            val: e.target.value
        })
        if (isFunction(onChange)) {
            onChange(e)
        }
    }
}
