import React, { Component } from 'react'
import { isFunction } from 'muka'
import { getClassName, prefix } from '../utils'
import Button from '../Button'
import Icon from '../Icon'

export interface IPaginationProps {
    className?: string
    current: number
    total: number
    defaultCurrent?: number
    pageSizeOptions?: number[]
    pageSize?: number
    disabled?: boolean
    onChange?: (current: number) => void
}

interface IState {
    pageSize: number
}

const prefixClass = 'pagination'

export default class Pagination extends Component<IPaginationProps, IState> {

    constructor(props: IPaginationProps) {
        super(props)
        this.state.pageSize = props.pageSize || 10
    }

    public static defaultProps: IPaginationProps = {
        pageSizeOptions: [10, 20, 30],
        current: 1,
        total: 10
    }

    public state: IState = {
        pageSize: 10
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IPaginationProps) {
        const { pageSize } = this.state
        if (nextProps.pageSize && nextProps.pageSize !== pageSize) {
            this.setState({
                pageSize: nextProps.pageSize
            })
        }
    }

    public render(): JSX.Element {
        const { className, current, total, disabled } = this.props
        const { pageSize } = this.state
        const num = Math.ceil(total / pageSize)
        return (
            <div className={getClassName(`${prefixClass}`, className)}>
                <Button
                    className={getClassName(`${prefixClass}_btn`)}
                    disabled={(current === 1 || disabled) ? true : false}
                    onClick={this.handleChange.bind(this, current - 1)}
                >
                    <Icon icon="ios-arrow-back" fontSize="18px" color={current === 1 ? '#d9d9d9' : 'rgba(0, 0, 0, 0.65)'} />
                </Button>
                {
                    Array.from(new Array(num)).map((i: any, index: number) => {
                        if (num > 7) {
                            if (index + 1 === 1) {
                                return (
                                    <Button
                                        className={getClassName(`${prefixClass}_btn`, current === index + 1 ? prefix + 'select' : '')}
                                        key={index}
                                        disabled={disabled}
                                        onClick={this.handleChange.bind(this, index + 1)}
                                    >
                                        {index + 1}
                                    </Button>
                                )
                            } else if (index + 1 === num) {
                                return (
                                    <Button
                                        className={getClassName(`${prefixClass}_btn`, current === index + 1 ? prefix + 'select' : '')}
                                        key={index}
                                        disabled={disabled}
                                        onClick={this.handleChange.bind(this, index + 1)}
                                    >
                                        {index + 1}
                                    </Button>
                                )
                            } else if (current === 1) {
                                if (index + 1 < current + 5) {
                                    return (
                                        <Button
                                            className={getClassName(`${prefixClass}_btn`, current === index + 1 ? prefix + 'select' : '')}
                                            key={index}
                                            disabled={disabled}
                                            onClick={this.handleChange.bind(this, index + 1)}
                                        >
                                            {index + 1}
                                        </Button>
                                    )
                                } else if (index + 1 === current + 6) {
                                    return (
                                        <Button
                                            className={getClassName(`${prefixClass}_btn ${prefix}notline`, current === index + 1 ? prefix + 'select' : '')}
                                            disabled={disabled}
                                            key={index}
                                        >
                                            <Icon icon="ios-more" fontSize="18px" color="rgba(0, 0, 0, 0.65)" />
                                        </Button>
                                    )
                                }
                            } else if (current === num) {
                                if (index + 1 >= num - 4) {
                                    return (
                                        <Button
                                            className={getClassName(`${prefixClass}_btn`, current === index + 1 ? prefix + 'select' : '')}
                                            key={index}
                                            disabled={disabled}
                                            onClick={this.handleChange.bind(this, index + 1)}
                                        >
                                            {index + 1}
                                        </Button>
                                    )
                                } else if (index + 1 === current - 6) {
                                    return (
                                        <Button
                                            className={getClassName(`${prefixClass}_btn ${prefix}notline`, current === index + 1 ? prefix + 'select' : '')}
                                            disabled={disabled}
                                            key={index}
                                        >
                                            <Icon icon="ios-more" fontSize="18px" color="rgba(0, 0, 0, 0.65)" />
                                        </Button>
                                    )
                                }
                            } else {
                                if (current === 2 || current === num - 1) {
                                    if (Math.abs(current - (index + 1)) === 4) {
                                        return (
                                            <Button
                                                className={getClassName(`${prefixClass}_btn ${prefix}notline`, current === index + 1 ? prefix + 'select' : '')}
                                                disabled={disabled}
                                                key={index}
                                            >
                                                <Icon icon="ios-more" fontSize="18px" color="rgba(0, 0, 0, 0.65)" />
                                            </Button>
                                        )
                                    }
                                }
                                if (current <= 3 && index + 1 <= 5) {
                                    return (
                                        <Button
                                            className={getClassName(`${prefixClass}_btn`, current === index + 1 ? prefix + 'select' : '')}
                                            key={index}
                                            disabled={disabled}
                                            onClick={this.handleChange.bind(this, index + 1)}
                                        >
                                            {index + 1}
                                        </Button>
                                    )
                                }
                                if (current >= num - 2 && index + 1 >= num - 4) {
                                    return (
                                        <Button
                                            className={getClassName(`${prefixClass}_btn`, current === index + 1 ? prefix + 'select' : '')}
                                            key={index}
                                            disabled={disabled}
                                            onClick={this.handleChange.bind(this, index + 1)}
                                        >
                                            {index + 1}
                                        </Button>
                                    )
                                }
                                if (Math.abs(current - (index + 1)) === 3) {
                                    return (
                                        <Button
                                            className={getClassName(`${prefixClass}_btn ${prefix}notline`, current === index + 1 ? prefix + 'select' : '')}
                                            disabled={disabled}
                                            key={index}
                                        >
                                            <Icon icon="ios-more" fontSize="18px" color="rgba(0, 0, 0, 0.65)" />
                                        </Button>
                                    )
                                }
                                if (Math.abs(current - (index + 1)) <= 2) {
                                    return (
                                        <Button
                                            className={getClassName(`${prefixClass}_btn`, current === index + 1 ? prefix + 'select' : '')}
                                            key={index}
                                            disabled={disabled}
                                            onClick={this.handleChange.bind(this, index + 1)}
                                        >
                                            {index + 1}
                                        </Button>
                                    )
                                }
                            }
                        } else {
                            return (
                                <Button
                                    className={getClassName(`${prefixClass}_btn`, current === index + 1 ? prefix + 'select' : '')}
                                    key={index}
                                    disabled={disabled}
                                    onClick={this.handleChange.bind(this, index + 1)}
                                >
                                    {index + 1}
                                </Button>
                            )
                        }
                        return undefined
                    })
                }
                <Button
                    className={getClassName(`${prefixClass}_btn`)}
                    disabled={(current === num || disabled) ? true : false}
                    onClick={this.handleChange.bind(this, current + 1)}
                >
                    <Icon icon="ios-arrow-forward" fontSize="18px" color={(current === num || disabled) ? '#d9d9d9' : 'rgba(0, 0, 0, 0.65)'} />
                </Button>
            </div>
        )
    }

    private handleChange = (index: number) => {
        const { onChange, current } = this.props
        if (index === current) {
            return undefined
        }
        if (isFunction(onChange)) {
            onChange(index)
        }
    }
}
