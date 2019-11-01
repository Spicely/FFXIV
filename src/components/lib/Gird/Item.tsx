import React, { Component } from 'react'
import { omit } from 'muka'
import Item, { IItemProps } from '../Item'
import { getClassName } from '../utils'

const prefixClass = 'gird_item'

export default class GirdItem extends Component<IItemProps, any> {

    public render(): JSX.Element {
        const { className } = this.props
        const otherProps: any = omit(this.props, ['className'])
        return (
            <Item className={getClassName(`${prefixClass}`, className)} {...otherProps} />
        )
    }
}
