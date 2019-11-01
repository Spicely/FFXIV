import React, { Component, Fragment } from 'react'
import { isString } from 'muka'
import { Tooltip } from 'antd'
import Link from 'next/link'
import { Consumer, IProvider } from './index'
import { getClassName } from '../utils'
import Icon, { iconType } from '../Icon'

export interface IMenuItem {
    className?: string
    icon?: iconType | JSX.Element
    field?: string | number
    iconHighlight?: string
    iconInitColor?: string
}

export class MenuItem extends Component<IMenuItem, any> {
    public static defaultProps = {
        iconHighlight: '#FFFFFF',
        iconInitColor: '#A8AdAF'
    }
    public render(): JSX.Element {
        const { children, className, icon, field, iconHighlight, iconInitColor } = this.props
        return (
            <Consumer>
                {
                    (val: IProvider) => {
                        const url = field ? field.toString() : ''
                        const nodeView = (child: JSX.Element) => {
                            if (val.collapsed) {
                                return (
                                    <Tooltip title={children} placement="right">
                                        {child}
                                    </Tooltip>
                                )
                            } else {
                                return (
                                    <Fragment>
                                        {child}
                                    </Fragment>
                                )
                            }
                        }
                        const jsxNode = (
                            <li className={getClassName(`menu_item${val.field === field ? ' active' : ''}`, className)} onClick={() => { val.onPress(field === undefined ? '' : field) }}>
                                <Link href={val.fieldToUrl ? url : '#'}>
                                    <div className={getClassName(`menu_item__label flex${!icon ? ' single' : ''}`)}>
                                        {
                                            icon && (
                                                <div className={getClassName('menu_item__label_icon flex_justify')}>
                                                    {isString(icon) ? <Icon icon={icon} color={val.field === field ? iconHighlight : iconInitColor} /> : icon}
                                                </div>
                                            )
                                        }
                                        {!val.collapsed && <div className={getClassName('menu_item__label_title flex_1')}>{children}</div>}
                                    </div>
                                </Link>
                            </li>
                        )
                        return nodeView(jsxNode)
                    }
                }
            </Consumer>
        )
    }
}
