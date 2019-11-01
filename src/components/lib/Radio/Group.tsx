import React, { Component } from 'react'
import { isUndefined, isFunction } from 'muka'
import { getClassName, IValue } from '../utils'
import Radio, { IRadioType } from './index'

export interface IRadioGroupOptions {
    label: string
    value: string | number | boolean
    className?: string
}

export interface IRadioGroupProps {
    className?: string
    type?: IRadioType
    value?: string | number | boolean
    options: IRadioGroupOptions[]
    onChange?: (value: string | number | boolean, data: IValue) => void
}

interface IState {
    value: any
}

const prefixClass = 'radio_group'

export default class RadioGroup extends Component<IRadioGroupProps, IState> {

    constructor(props: IRadioGroupProps) {
        super(props)
        this.state.value = props.value
    }

    public static defaultProps: IRadioGroupProps = {
        options: []
    }

    public state: IState = {
        value: ''
    }

    public render(): JSX.Element {
        const { className, options, type } = this.props
        const { value } = this.state
        return (
            <div className={getClassName(`${prefixClass}`, className)}>
                {
                    options.map((i, index: number) => {
                        return (
                            <Radio
                                className={i.className}
                                key={index} type={type}
                                onChange={this.handleRadioChange.bind(this, i.value, i)}
                                checked={i.value === value}
                            >
                                {i.label}
                            </Radio>
                        )
                    })
                }
            </div>
        )
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IRadioGroupProps) {
        const { value } = this.props
        if (!isUndefined(nextProps.value) && nextProps.value !== value) {
            this.setState({
                value: nextProps.value
            })
        }
    }

    private handleRadioChange(value: string | number | boolean, data: IValue) {
        const { onChange } = this.props
        this.setState({ value })
        if (isFunction(onChange)) {
            onChange(value, data)
        }
    }
}
