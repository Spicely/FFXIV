import React, { CSSProperties, Component } from 'react'
import { isFunction, isBool, isUndefined } from 'muka'
import RadioGroup from './Group'
import { getClassName, prefix } from '../utils'
import Icon, { iconType } from '../Icon'

export type IRadioType = 'square' | 'button' | 'circular'

export interface IRadioProps {
    className?: string
    defaultChecked?: boolean
    checked?: boolean
    onChange?: (val: boolean) => void
    type?: IRadioType
    style?: CSSProperties
    icon?: iconType
    iconColor?: string
    children?: string | JSX.Element
}

interface IState {
    status: boolean
    checked: boolean
}

const prefixClass = 'radio'

export default class Radio extends Component<IRadioProps, IState> {

    constructor(props: IRadioProps) {
        super(props)
        this.state.status = props.checked || props.defaultChecked || false
        this.state.checked = props.checked || props.defaultChecked || false
    }

    public static defaultProps: IRadioProps = {
        type: 'circular'
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IRadioProps) {
        const { checked } = this.state
        if (isBool(nextProps.checked) && checked !== nextProps.checked) {
            this.setState({
                status: nextProps.checked,
                checked: nextProps.checked
            })
        }
    }

    public static Group = RadioGroup

    public state = {
        status: false,
        checked: false
    }

    public render(): JSX.Element {
        const { className, children, checked, type, style, icon, iconColor } = this.props
        const { status } = this.state
        return (
            <div
                className={getClassName(`${prefixClass} ${(isBool(checked) ? checked : status) ? prefix + 'active' : ''} ${type ? prefix + type : ''}`, className)}
                style={style}
                onClick={this.handleClick}
            >
                <div className="flex">
                    {type === 'square' ? (
                        <div className={getClassName(`${prefixClass}_btn flex_justify`)}>
                            {
                                (isBool(checked) ? checked : status) ?
                                    <Icon className={getClassName(`${prefixClass}__icon`)}
                                        icon={icon || 'md-checkmark'}
                                        fontSize="0.8rem"
                                        color={iconColor}
                                    />
                                    : null
                            }
                        </div>
                    ) : null}
                    {
                        type === 'circular' ? (
                            <div className={getClassName(`${prefixClass}_core`)}>
                                <div className="flex_center" style={{ width: '100%', height: '100%' }}>
                                    <div className={getClassName(`${prefixClass}_core_circle ${status ? prefix + prefixClass + '_show' : prefix + prefixClass + '_hide'}`)} />
                                </div>
                            </div>
                        ) : null
                    }
                    <span className={getClassName(`${prefixClass}_label`)}>
                        {children}
                    </span>
                </div>
            </div>
        )
    }

    private handleClick = () => {
        const { checked, onChange } = this.props
        if (isFunction(onChange)) {
            onChange(isBool(checked) ? checked ? true : false : true)
        }
        this.setState({
            status: isBool(checked) ? checked ? true : false : true
        })
    }
}
