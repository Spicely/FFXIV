import React, { Component } from 'react'
import { isNumber } from 'muka'
import { getClassName } from '../utils'
import Button from '../Button'
import Radio from '../Radio'

export interface IShopResultBarProps {
    className?: string
    radioLabel?: string
    defaultChecked?: boolean
    price: number
    priceClassName?: string
    coupon?: number
    couponClassName?: string
    couponLabel?: string
    btnLabel?: string
    btnNum?: number
    label?: string
    btnClassName?: string
    resultPos?: 'left' | 'right'
    radioChecked?: boolean
    radioChange?: (value: boolean) => void
    onBtnClick?: () => void
}

// tslint:disable-next-line: no-empty-interface
interface IState {

}

const prefixClass = 'shop_result_bar'

export default class ShopResultBar extends Component<IShopResultBarProps, IState> {

    public static defaultProps: IShopResultBarProps = {
        radioLabel: '全选',
        price: 0,
        label: '合计',
        couponLabel: '券',
        btnLabel: '去结算',
        resultPos: 'right'
    }

    public render(): JSX.Element {
        const { className, radioLabel, defaultChecked, price, coupon, couponLabel, btnLabel, btnClassName, btnNum, priceClassName, couponClassName, resultPos, radioChange, onBtnClick, label, radioChecked } = this.props
        return (
            <div className={getClassName(`${prefixClass} flex`, className)}>
                <div className="flex_justify">
                    <Radio defaultChecked={defaultChecked} checked={radioChecked} onChange={radioChange}>{radioLabel}</Radio>
                </div>
                <div className="flex_1 flex_justify">
                    <div className={getClassName(`${resultPos}`)}>{label}: <span className={getClassName(`${prefixClass}_price`, priceClassName)}>￥{price.toFixed(2)}</span> {coupon ? (<span className={getClassName(`${couponClassName}_coupon`, couponClassName)} >+ {coupon}{couponLabel}</span>) : undefined}</div>
                </div>
                <div className="flex_justify">
                    <Button mold="primary" className={getClassName(`${prefixClass}_btn`, btnClassName)} onClick={onBtnClick}>{btnLabel}{isNumber(btnNum) && `(${btnNum})`}</Button>
                </div>
            </div>
        )
    }
}
