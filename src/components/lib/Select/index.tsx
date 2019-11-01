import React, { Component } from 'react'
import ReactSelect from 'react-select'
import { isFunction, isNil, isUndefined, isString } from 'muka'
import { getClassName } from '../utils'
import Empty from '../Empty'
import Icon from '../Icon'

interface ISelectOptionsProps {
    value: string | number
    label: string
    isDisabled?: boolean
    color?: string
}

export interface ISelectProps {
    className?: string
    options: ISelectOptionsProps[]
    onChange?: (value: string | number) => void
    value?: string | number
    placeholder?: string
    isSearchable?: boolean
    isMulti?: boolean
    isDisabled?: boolean
    noOptionsMessage?: string | JSX.Element
}

const prefixClass = 'select'

interface IState {
    value: any
}

export default class Select extends Component<ISelectProps, IState> {
    constructor(props: ISelectProps) {
        super(props)
        this.state.value = isNil(props.value) ? undefined : props.options.find((i) => i.value === props.value)
    }

    public static defaultProps: ISelectProps = {
        options: [],
        placeholder: '请选择数据',
        isSearchable: false,
        isMulti: false,
        isDisabled: false
    }

    public state: IState = {
        value: undefined
    }

    public render(): JSX.Element {
        const { className, options, placeholder, isSearchable, isMulti, isDisabled } = this.props
        const { value } = this.state
        return (
            <ReactSelect
                value={value}
                className={getClassName(`${prefixClass}`, className)}
                classNamePrefix={getClassName(`${prefixClass}`)}
                options={options}
                onChange={this.handleChange}
                isSearchable={isSearchable}
                placeholder={placeholder}
                isMulti={isMulti}
                isDisabled={isDisabled}
                components={{
                    IndicatorsContainer: () => <div className={getClassName(`${prefixClass}_icon flex_center`)} ><Icon icon="ios-arrow-down" fontSize="14px" /></div>,
                    NoOptionsMessage: this.handleMessage
                }}
            />
        )
    }

    public UNSAFE_componentWillReceiveProps(nextProps: ISelectProps) {
        const { value } = this.state
        const { options } = this.props
        if (nextProps.value !== value) {
            const data = options.find((i) => i.value === nextProps.value)
            this.setState({
                value: data || null
            })
        }
    }

    private handleChange = (data: any) => {
        const { onChange } = this.props
        this.setState({
            value: data
        })
        if (isFunction(onChange)) {
            onChange(data.value)
        }
    }
    private handleMessage = () => {
        const { noOptionsMessage } = this.props
        return (isUndefined(noOptionsMessage) || isString(noOptionsMessage)) ?
            <Empty description={noOptionsMessage} descClassName={getClassName(`${prefixClass}__desc`)} image={null} /> :
            noOptionsMessage
    }
}
