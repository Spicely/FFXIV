
import React, { Component } from 'react'
import { DatePicker } from 'antd'
import { omit } from 'muka'
import { getClassName } from '../utils'
import { Moment } from 'moment'

export interface ILDatePicker {
    className?: string
    defaultValue?: Moment
    defaultPickerValue?: Moment
    disabledTime?: (time: any) => void
    format?: string | string[]
    renderExtraFooter?: (mode: any) => React.ReactNode
    [value: string]: any
}

export default class LDatePicker extends Component<ILDatePicker, any> {
    public render(): JSX.Element {
        const { className } = this.props
        const props = omit(this.props, ['className'])
        return (
            <DatePicker
                className={getClassName('date_picker', className)}
                {...props}
            />
        )
    }
}
