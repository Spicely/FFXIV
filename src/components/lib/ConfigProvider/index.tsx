import React, { createContext, Component } from 'react'
import { defaultUrl, rightUrl } from './base64'
import { IEmptyProps } from '../Empty'
import { iconType } from '../Icon'

export interface IConfigProviderProps {
    emptyProps?: IEmptyProps
    uploadDraggerProps?: {
        icon?: iconType | JSX.Element
        iconColor?: string
        title?: string | JSX.Element
        label?: string | JSX.Element
    }
}

export const RIGHTULR = rightUrl

const defaultValue: IConfigProviderProps = {
    emptyProps: {
        description: '暂无数据',
        image: defaultUrl,
        center: true,
    },
    uploadDraggerProps: {
        icon: 'file_box',
        iconColor: '#0693e3',
        title: '单击或拖动文件到此区域进行上传',
        label: '支持单个或批量上传'
    }
}

export const { Consumer, Provider } = createContext(defaultValue)

export default class ConfigProviderProps extends Component<IConfigProviderProps, any> {
    public render(): JSX.Element {
        const { children, emptyProps } = this.props
        return (
            <Provider
                value={{
                    emptyProps: {
                        ...defaultValue.emptyProps,
                        ...emptyProps
                    }
                }}
            >
                {children}
            </Provider>
        )
    }
}
