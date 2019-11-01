import React, { CSSProperties, createContext, Component } from 'react'
import { MenuGroup } from './MenuGroup'
import { MenuItem } from './MenuItem'
import { getClassName } from '../utils'
import { iconType } from '../Icon'
import { isFunction } from 'muka'
export * from './MenuGroup'
export * from './MenuItem'

export interface IMenuProps {
    className?: string
    width?: number | string
    style?: CSSProperties
    collapsed?: boolean
    arrowIcon?: iconType
    arrowIconPos?: 'right' | 'left'
    defaultSelected?: number | string
    onChange?: (index: number | string) => void
    fieldToUrl?: boolean
    arrowIconColor?: string
}

interface IState {
    field: number | string
}

export interface IProvider extends IState {
    onPress: (index: number | string) => void
    collapsed: boolean
    fieldToUrl: boolean
    arrowIcon?: iconType
    arrowIconColor?: string
    arrowIconPos?: 'right' | 'left'
}

const defaultValue: IProvider = {
    field: '',
    onPress: (index: number | string) => { return },
    collapsed: false,
    fieldToUrl: false,
}
export const { Consumer, Provider } = createContext(defaultValue)

export default class Menu extends Component<IMenuProps, IState> {

    public static Group = MenuGroup

    public static Item = MenuItem

    public state = {
        field: this.props.defaultSelected === undefined ? '' : this.props.defaultSelected
    }

    public render(): JSX.Element {
        const { className, children, style, width, collapsed, fieldToUrl, arrowIcon, arrowIconColor, arrowIconPos } = this.props
        const styles: React.CSSProperties = { ...style, width }
        return (
            <ul className={getClassName(`menu${collapsed ? ' fold' : ''}`, className)} style={styles}>
                <Provider
                    value={{ ...this.state, onPress: this.handlePress, collapsed: collapsed || false, fieldToUrl: fieldToUrl || false, arrowIcon: arrowIcon || 'md-arrow-down', arrowIconColor: arrowIconColor || '#333', arrowIconPos: arrowIconPos || 'right' }}
                >
                    {
                        React.Children.map(children, (item: any, index: number) => {
                            if (item.type === MenuItem || item.type === MenuGroup) {
                                const field = item.props.field
                                return React.cloneElement(item, { field: field ? field : index })
                            }
                            return item
                        })
                    }
                </Provider>
            </ul>
        )
    }

    private handlePress = (field: number | string) => {
        const { onChange } = this.props
        this.setState({ field }, () => { if (isFunction(onChange)) { onChange(field) } })
    }
}
