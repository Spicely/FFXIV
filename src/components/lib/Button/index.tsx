import React, { Component, ChangeEvent, CSSProperties } from 'react'
import { omit, isFunction } from 'muka'
import Icon from '../Icon'
import { getClassName } from '../utils'

export type buttonMold = 'circle' | 'error' | 'primary'

const prefixClass = 'btn'

interface IState {
    loading: boolean
}

export interface IButtonProps {
    tick?: boolean
    mold?: buttonMold
    className?: string
    fixed?: boolean
    disabled?: boolean
    async?: boolean
    onClick?: (e: ChangeEvent<HTMLElement>) => (Promise<void> | void)
    type?: any
    style?: CSSProperties
}

export default class Button extends Component<IButtonProps, IState> {

    public static defaultProps = {
        mold: 'default',
        tick: true
    }

    public state: IState = {
        loading: false
    }

    public render(): JSX.Element {
        const { children, className, fixed, mold, disabled } = this.props
        const { loading } = this.state
        const otherProps = omit(this.props, ['children', 'className', 'fixed', 'mold', 'tick', 'disabled', 'onClick', 'async'])
        return (
            <button
                {...otherProps}
                className={getClassName(`${prefixClass} ${prefixClass}_${mold}${fixed ? ' fixed' : ''}${disabled ? ' disabled' : ''}`, className)}
                disabled={loading || disabled}
                onClick={this.handelOk}
            >
                {loading ? <Icon icon="loading" className={getClassName(`${prefixClass}_loading`)} color="#fff" rotate /> : ''}{children}
            </button>
        )
    }

    private handelOk = (e: ChangeEvent<HTMLElement>) => {
        const { onClick, async } = this.props
        const { loading } = this.state
        if (loading) {
            return
        }
        if (isFunction(onClick)) {
            if (async) {
                this.setState({
                    loading: true
                }, () => {
                    const fn = onClick(e)
                    if (fn instanceof Promise) {
                        fn.then((data: any) => {
                            this.setState({
                                loading: false
                            })
                        }).catch(() => {
                            this.setState({
                                loading: false
                            })
                        })
                    } else {
                        this.setState({
                            loading: false
                        })
                    }
                })
            } else {
                onClick(e)
            }
        }
    }
}
