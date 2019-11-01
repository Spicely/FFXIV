
import React, { Component } from 'react'
import { DatePicker } from 'antd'
import { omit } from 'muka'
import { getClassName } from '../utils'
import { Moment } from 'moment'

const { RangePicker } = DatePicker

export interface IRangePicker {
    className?: string
    defaultValue?: Moment
    defaultPickerValue?: Moment
    disabledTime?: (time: any) => void
    format?: string | string[]
    renderExtraFooter?: (mode: any) => React.ReactNode
    [value: string]: any
}

const prefixClass = 'range_picker'

export default class LRangePicker extends Component<IRangePicker, any> {
    public render(): JSX.Element {
        const { className } = this.props
        const props = omit(this.props, ['className'])
        return (
            <RangePicker
                className={getClassName(prefixClass, className)}
                {...props}
            />
        )
    }
}
