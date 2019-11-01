import React, { Component, Fragment } from 'react'
import { isString } from 'muka'
import { Tooltip } from 'antd'
import { MenuItem } from './MenuItem'
import { Consumer, IProvider } from './index'
import { getClassName } from '../utils'
import Icon, { iconType } from '../Icon'

export interface IMenuGroup {
    className?: string
    icon?: JSX.Element | iconType
    title?: string | JSX.Element
    field?: string | number
    iconHighlight?: string
    iconInitColor?: string
}

export class MenuGroup extends Component<IMenuGroup, any> {
    public static defaultProps = {
        iconHighlight: '#FFFFFF',
        iconInitColor: '#A8AdAF'
    }

    public state = {
        visible: false
    }

    private selected: boolean = false

    private status: boolean = true

    public render(): JSX.Element {
        const { children, className, title, icon, field, iconHighlight, iconInitColor } = this.props
        const { visible } = this.state
        return (
            <Consumer>
                {
                    (val: IProvider) => {
                        const node = React.Children.map(children, (item: any, index: number) => {
                            if (item.type === MenuItem) {
                                const fieldProps = item.props.field
                                if (fieldProps === val.field && this.status) {
                                    this.selected = true
                                }
                                return React.cloneElement(item, { field: fieldProps ? fieldProps : `${field}-${index}` })
                            }
                            return item
                        })
                        const nodeView = (child: JSX.Element) => {
                            if (val.collapsed) {
                                return (
                                    <Tooltip title={title} placement="right">
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
                            <li className={getClassName('menu_group', className)}>
                                <ul className={getClassName('menu_group_title', className)}>
                                    <li className={getClassName('menu_group_box flex')} onClick={this.handleShowBox}>
                                        <div className={getClassName('menu_group_title__icon flex_justify')}>
                                            {
                                                (!val.collapsed && React.Children.count(children) && val.arrowIconPos === 'left') ?
                                                    (
                                                        <div className="flex_justify" style={{ transform: (this.selected || visible) ? 'rotate(0deg)' : 'rotate(-90deg)', transition: '0.5s all' }}>
                                                            <Icon icon={val.arrowIcon} color={val.arrowIconColor} fontSize="0.8rem" />
                                                        </div>
                                                    ) : null
                                            }
                                            {(isString(icon) && val.arrowIconPos === 'right') ? <Icon icon={icon} color={val.field === field ? iconHighlight : iconInitColor} /> : icon}
                                        </div>
                                        {!val.collapsed ? <div className={getClassName('menu_group_title__label flex_1')}>{title}</div> : null}
                                        {
                                            (!val.collapsed && React.Children.count(children) && val.arrowIconPos === 'right') ?
                                                (
                                                    <div className="flex_justify" style={{ transform: (this.selected || visible) ? 'rotate(0deg)' : 'rotate(-90deg)', transition: '0.5s all' }}>
                                                        <Icon icon={val.arrowIcon} color={val.arrowIconColor} fontSize="0.8rem" />
                                                    </div>
                                                ) : null
                                        }
                                    </li>
                                    {
                                        !val.collapsed ? (
                                            <li className={getClassName('menu_group_content flex_1', (this.selected || visible) ? 'active' : '')}>
                                                <ul>
                                                    {node}
                                                </ul>
                                            </li>
                                        ) : null
                                    }

                                </ul>
                            </li>
                        )
                        return nodeView(jsxNode)
                    }
                }
            </Consumer>
        )
    }

    private handleShowBox = () => {
        this.selected = !this.selected
        this.status = false
        this.setState({
            visible: this.selected
        })
    }
}
