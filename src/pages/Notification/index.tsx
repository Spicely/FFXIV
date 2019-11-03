import React, { Component } from 'react'
import { notification } from 'antd'
import { AllElectron } from 'electron'
import { connect } from 'react-redux'
import { IInitState } from 'src/store/state'
import { bindActionCreators } from 'redux'
import { actions, INotificationStyleProps } from 'src/store/action/notificationStyle'
import './index.less'
const { ipcRenderer }: AllElectron = window.require('electron')

interface IProps extends INotificationStyleProps { }

class NotificationMsg extends Component<IProps, any> {

    public render(): JSX.Element {
        return (
            <div className="win_view" />
        )
    }

    public componentDidMount() {
        ipcRenderer.on('notification', this.handleNotification)
        ipcRenderer.on('notificationClose', this.handleNotificationClose)
        ipcRenderer.on('notificationTime', this.handleNotificationTime)
    }

    private handleNotificationClose = (event: any, message: string) => {
        notification.close(message)
    }

    private handleNotification = (event: any, message: any) => {
        const { notificationStyle } = this.props
        notification.open({
            key: message.key,
            message: <div style={{ color: notificationStyle.color }}>{message.msg}</div>,
            duration: 0,
            top: notificationStyle.top,
            bottom: notificationStyle.bottom,
            placement: notificationStyle.placement,
            btn: <div />,
            style: { background: notificationStyle.background },
            description: (
                <div style={{ color: notificationStyle.color }}>
                    <p>采集详情</p>
                    <p>职业: {message.des.vocation}</p>
                    <p>等级：{message.des.grade}</p>
                    <p>位置: 第{message.des.number}格</p>
                </div>
            )
        })
    }

    private handleNotificationTime = (event: any, message: any) => {
        const { notificationStyle } = this.props
        notification.open({
            key: message.key,
            message: <div style={{ color: notificationStyle.color }}>{message.msg}</div>,
            duration: 0,
            top: notificationStyle.top,
            bottom: notificationStyle.bottom,
            placement: notificationStyle.placement,
            btn: <div />,
            style: { background: notificationStyle.background },
        })
    }
}

export default connect(
    ({ notificationStyle }: IInitState) => ({
        notificationStyle,
    }),
    (dispatch: any) => bindActionCreators(actions, dispatch)
)(NotificationMsg as any)
