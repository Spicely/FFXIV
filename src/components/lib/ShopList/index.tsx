import React, { Component } from 'react'
import { cloneDeep } from 'lodash'
import { isFunction } from 'muka'
import { getClassName, prefix } from '../utils'
import Image from '../Image'
import InputNumber from '../InputNumber'
import Radio from '../Radio'

export interface IShopListResult {
    price: number
    coupon: number
    selectAll: boolean
    selectNum: number
    selectAllNum: number
}

export interface IShopListDataProps {
    url: string
    title: string
    tags: string[]
    selected: boolean
    tagClassName?: string
    number: number
    price: number
    priceClassName?: string
    coupon?: number
    couponClassName?: string
    className?: string
    radioClassName?: string
}

export interface IShopListFn {
    selectAllList: () => void
    removeSelectAllList: () => void
}

export interface IShopListProps {
    className?: string
    dataList: IShopListDataProps[]
    getFun?: (fn: IShopListFn) => void
    tagClassName?: string
    radioClassName?: string
    dataListClassName?: string
    onChange?: (value: IShopListDataProps[], result: IShopListResult, updateValue?: IShopListDataProps, updateNum?: number) => void
    couponLabel?: string
}

// tslint:disable-next-line: no-empty-interface
interface IState {

}

const prefixClass = 'shop_list'

export default class ShopList extends Component<IShopListProps, IState> {

    public static defaultProps: IShopListProps = {
        dataList: [],
        couponLabel: '券'
    }

    public render(): JSX.Element {
        const { className, dataList, dataListClassName, radioClassName, couponLabel, getFun } = this.props
        if (isFunction(getFun)) {
            getFun({
                selectAllList: this.selectAllList,
                removeSelectAllList: this.removeSelectAllList
            })
        }
        return (
            <div className={getClassName(`${prefixClass}`, className)}>
                {
                    dataList.map((item, index: number) => {
                        return (
                            <div className={getClassName(`${prefixClass}_list flex ${dataListClassName || ''}`, item.className)} key={index}>
                                <div className="flex_justify">
                                    <Radio className={`${radioClassName || ''} ${item.radioClassName || ''}`} checked={item.selected} onChange={this.handleRadioChange.bind(this, index)} />
                                </div>
                                <div className={getClassName(`${prefixClass}_list__img`)}>
                                    <Image src={item.url} className={`${prefix}_img`} />
                                </div>
                                <div className={getClassName(`${prefixClass}_list__right flex_1`)}>
                                    <div className={getClassName(`${prefixClass}_list__right_title`)}>{item.title}</div>
                                    <div className={getClassName(`${prefixClass}_list__right_tags`)}>
                                        {
                                            item.tags.map((i, k: number) => {
                                                return (
                                                    <div className={getClassName(`${prefixClass}_list__right_tags__item`)} key={k}>{i}</div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className={getClassName(`${prefixClass}_info  flex`)}>
                                        <div className="flex_1 flex_justify">
                                            <div className="flex">
                                                <div className={getClassName(`${prefixClass}_info_price `)}>￥{item.price.toFixed(2)}</div>
                                                {item.coupon && <div className={getClassName(`${prefixClass}_info_price`)}>+{item.coupon}{couponLabel}</div>}
                                            </div>
                                        </div>
                                        <div>
                                            <InputNumber min={1} value={item.number} onChange={this.handelChange.bind(this, index)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IShopListProps) {
        const { dataList } = this.props
        if (dataList.length !== nextProps.dataList.length) {
            const result = this.getResultData(nextProps.dataList)
            if (isFunction(nextProps.onChange)) {
                nextProps.onChange(nextProps.dataList, result)
            }
        }
    }

    private handelChange(index: number, value: number) {
        const { dataList, onChange } = this.props
        const data = cloneDeep(dataList)
        data[index].selected = true
        const updateVal = value - data[index].number
        data[index].number = value
        const result = this.getResultData(data)
        if (isFunction(onChange)) {
            onChange(data, result, data[index], updateVal)
        }
    }

    private selectAllList = () => {
        const { dataList, onChange } = this.props
        const data = dataList.map((i) => {
            i.selected = true
            return i
        })
        const result = this.getResultData(data)
        if (isFunction(onChange)) {
            onChange(data, result)
        }
    }

    private removeSelectAllList = () => {
        const { dataList, onChange } = this.props
        const data = dataList.map((i) => {
            i.selected = false
            return i
        })
        const result = this.getResultData(data)
        if (isFunction(onChange)) {
            onChange(data, result)
        }
    }

    private handleRadioChange(index: number, value: boolean) {
        const { dataList, onChange } = this.props
        const data = cloneDeep(dataList)
        data[index].selected = value
        const result = this.getResultData(data)
        if (isFunction(onChange)) {
            onChange(data, result, data[index], 0)
        }
    }

    private getResultData(data: IShopListDataProps[]): IShopListResult {
        let price: number = 0
        let coupon: number = 0
        let selectAllNum: number = 0
        let selectNum: number = 0
        const selectAll = data.map((i) => {
            if (i.selected) {
                selectAllNum += i.number
                price += i.price * i.number
                selectNum += 1
                coupon += (i.coupon || 0) * i.number
            }
            return i
        }).every(i => i.selected)

        return {
            price,
            coupon,
            selectAll,
            selectNum,
            selectAllNum
        }
    }
}
