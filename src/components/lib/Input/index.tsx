import React, { InputHTMLAttributes, Component, ChangeEvent, FocusEvent, CSSProperties } from 'react'
import { omit, isFunction, isEmpty, isNil } from 'muka'
import InputSearch from './search'
import { getClassName, prefix } from '../utils'
import Icon from '../Icon'
export * from './search'

export interface IInputProps extends InputHTMLAttributes<any> {
    className?: string
    placeholder?: string
    placeAnimate?: boolean
    onClose?: (val: string) => void
    closeIconShow?: boolean
    disabled?: boolean
    type?: string
    preIcon?: JSX.Element
    label?: string | JSX.Element
    labelStyle?: CSSProperties
    labelClassName?: string
    showMaxLength?: boolean
    extend?: string | JSX.Element
    extendClassName?: string
    extendStyle?: CSSProperties
}

interface IState {
    moveToTop: boolean
    val: string,
    focus: boolean
}

const prefixClass = 'input'

export default class Input extends Component<IInputProps, IState> {

    public static defaultProps = {
        closeIconShow: true,
        showMaxLength: false
    }

    public static Search = InputSearch

    public state = {
        moveToTop: false,
        val: '',
        focus: false
    }

    public render(): JSX.Element {
        const { className, placeholder, placeAnimate, value, closeIconShow, disabled, label, labelClassName, labelStyle, showMaxLength, maxLength, extend, extendClassName, extendStyle, preIcon, style } = this.props
        const { moveToTop, val, focus } = this.state
        const otherProps = omit(this.props, ['className', 'placeholder', 'placeAnimate', 'onFocus', 'onBlur', 'preIcon', 'onClose', 'value', 'closeIconShow', 'labelStyle', 'label', 'labelClassName', 'showMaxLength', 'extend', 'extendStyle', 'extendClassName', 'style'])
        return (
            <div className={getClassName(`input flex${placeAnimate ? ' active' : ''}`, className)} style={style}>
                {label ? <div className={getClassName(`${prefixClass}__label flex_justify ${labelClassName}`)} style={labelStyle}>{label}</div> : null}
                {placeAnimate && <div className={getClassName(`${prefixClass}_text flex_justify`, moveToTop ? 'active' : '')}>{placeholder}</div>}
                <div className={getClassName(`${prefixClass}_box flex flex_1 ${focus ? prefix + 'focus' : ''}`, disabled ? prefix + 'disabled' : '')}>
                    {
                        preIcon ? (
                            <div className={getClassName(`${prefixClass}_box_pre_icon flex_center`)}>
                                {preIcon}
                            </div>
                        ) : null
                    }
                    <input
                        className={getClassName(`${prefixClass}_value flex_1`)}
                        placeholder={placeAnimate ? '' : placeholder}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        value={isNil(value) ? val : value}
                        onChange={this.handleChange}
                        {...otherProps}
                        style={{
                            paddingRight: (closeIconShow && showMaxLength) ? 63 : (closeIconShow || showMaxLength) ? 24 : '',
                            paddingLeft: preIcon ? 0 : ''
                        }}
                    />
                    {(showMaxLength && maxLength) ? <div className={getClassName(`${prefixClass}_max_length flex_justify`)} style={{
                        right: closeIconShow  ? 26 : 5
                    }}>{val.length || (value || '').toString().length}/{maxLength}</div> : null}
                    {(isNil(value) ? val : true) && closeIconShow && !disabled && <Icon className={getClassName(`${prefixClass}_close_icon`)} onClick={this.handleClose} icon="ios-close" fontSize="12px" style={{ right: 5 }} />}
                </div>
                {extend && <div className={getClassName(`${prefixClass}_extend flex_justify`, extendClassName)} style={{ ...extendStyle, margin: 0 }}>{extend}</div>}
            </div>
        )
    }

    private handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        const { placeAnimate, onFocus } = this.props
        if (placeAnimate) {
            this.setState({
                moveToTop: true
            })
        }
        this.setState({
            focus: true
        })
        if (isFunction(onFocus)) {
            onFocus(event)
        }
    }

    private handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        const { placeAnimate, onBlur, value } = this.props
        if (placeAnimate && isEmpty(value || this.state.val)) {
            this.setState({
                moveToTop: false
            })
        }
        this.setState({
            focus: false
        })
        if (isFunction(onBlur)) {
            onBlur(event)
        }
    }

    private handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { onChange, value } = this.props
        const val = event.target.value
        if (isFunction(onChange) && value) {
            onChange(event)
        } else {
            this.setState({
                val
            })
        }
    }

    private handleClose = () => {
        const { onClose, value } = this.props
        if (value !== undefined) {
            if (isFunction(onClose)) {
                onClose('')
            }
        } else {
            this.setState({
                val: ''
            })
        }
    }
}
