import React, { Component, CSSProperties } from 'react'
import { getClassName } from '../utils'
import { isEqual } from 'lodash'
import { iconType } from '../Icon'
import Radio from '../Radio'

interface ICheckBoxOptionsProps {
    label: string
    value: string | number | boolean
    className?: string
    icon?: iconType
    iconColor?: string
}

type typeItem = string | number | boolean

export interface ICheckBoxProps {
    className?: string
    style?: CSSProperties
    options: ICheckBoxOptionsProps[]
    icon?: iconType
    iconColor?: string
    value?: typeItem[]
}

interface IState {
    value: typeItem[]
}

const prefixClass = 'check_box'

export default class CheckBox extends Component<ICheckBoxProps, IState> {

    constructor(props: ICheckBoxProps) {
        super(props)
        this.state.value = props.value || []
    }

    public static defaultProps: ICheckBoxProps = {
        options: []
    }

    public static getDerivedStateFromProps(nextProps: ICheckBoxProps, prevState: IState) {
        if (nextProps.value && !isEqual(nextProps.value, prevState.value)) {
            return {
                value: nextProps.value
            }
        }
        return null
    }

    public state: IState = {
        value: []
    }

    public render(): JSX.Element {
        const { className, style, options, icon, iconColor } = this.props
        const { value } = this.state
        return (
            <div className={getClassName(`${prefixClass}`, className)} style={style}>
                {
                    options.map((item, index) => {
                        return (
                            <Radio
                                className={getClassName(`${prefixClass}__radio`, item.className)}
                                checked={value.includes(item.value) ? true : false}
                                type="square"
                                key={index}
                                icon={item.icon || icon}
                                iconColor={item.iconColor || iconColor}
                                onChange={this.handleChange.bind(this, item.value)}
                            >
                                {item.label}
                            </Radio>
                        )
                    })
                }
            </div>
        )
    }

    private handleChange = (val: string | number | boolean) => {
        const { value } = this.state
        if (value.includes(val) && val) {
            const index = value.indexOf(val)
            value.splice(index, 1)
            this.setState({
                value
            })
            return
        }
        if (!value.includes(val) && val) {
            value.push(val)
        }
        this.setState({
            value
        })
    }
}
