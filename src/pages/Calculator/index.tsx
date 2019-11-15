import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IInitState } from 'src/store/state'
import { bindActionCreators } from 'redux'
import { actions, INotificationStyleProps } from 'src/store/action/notificationStyle'
import data from './user.json'

interface IProps extends INotificationStyleProps { }

class NotificationMsg extends Component<IProps, any> {

    public render(): JSX.Element {
        return (
            <div className="win_view" />
        )
    }

    public componentDidMount() {
        const initProperty = {
            precision: 0,
            machine: 0,
            cp: 0
        }
        data[0].items.map((i) => {
            initProperty.cp += i.cp
            initProperty.machine += i.machine
            initProperty.precision += i.precision
        })
        console.log(initProperty)
    }
}

export default connect(
    ({ notificationStyle }: IInitState) => ({
        notificationStyle,
    }),
    (dispatch: any) => bindActionCreators(actions, dispatch)
)(NotificationMsg as any)
