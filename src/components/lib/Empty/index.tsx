import React, { Component } from 'react'
import { isUndefined, isNull, isString } from 'muka'
import { Consumer, RIGHTULR } from '../ConfigProvider'
import { getClassName } from '../utils'
import Image from '../Image'

export interface IEmptyProps {
    className?: string
    description?: string | JSX.Element
    descClassName?: string
    image?: string | JSX.Element | null
    imageClassName?: string
    center?: boolean
}

const prefixClass = 'empty'

export default class Empty extends Component<IEmptyProps, any> {

    public static IMAGE_RIGHT = RIGHTULR

    public render(): JSX.Element {
        const { center, className, description, descClassName, image, imageClassName } = this.props
        return (
            <Consumer>
                {
                    (value) => {
                        const emptyProps: any = value.emptyProps
                        return (
                            <div className={getClassName(`${prefixClass}${(center || emptyProps.center) ? ' flex_center' : ''}`, className || emptyProps.className)}>
                                <div >
                                    {isNull(image) ? null : isString(image || emptyProps.image) ? <Image className={getClassName(`${prefixClass}__img`, imageClassName || emptyProps.imageClassName)} src={image || emptyProps.image} /> : image}
                                    <div className={getClassName(`${prefixClass}__desc`, descClassName || emptyProps.descClassName)}>
                                        {isUndefined(description) ? emptyProps.description : description}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            </Consumer>
        )
    }
}
