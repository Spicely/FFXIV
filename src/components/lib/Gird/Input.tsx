import * as React from 'react'
import { omit } from 'muka'
import Item from '../Item'
import Input, { IInputProps } from '../Input'
import { getClassName } from '../utils'

export interface IGirdInput extends IInputProps {
    title?: string
}

const prefixClass = 'gird_input'

export default class GirdInput extends React.Component<IGirdInput, any> {

    public render(): JSX.Element {
        const { className, title } = this.props
        const otherProps = omit(this.props, ['className', 'title'])
        return (
            <Item className={getClassName(`${prefixClass}`, className)} title={title || ''} value={<Input {...otherProps} />} />
        )
    }
}
