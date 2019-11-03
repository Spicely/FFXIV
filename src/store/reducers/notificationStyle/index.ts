import { SET_NOTIFICATIONSTYLE_DATA, INotificationStyle } from '../../action/notificationStyle'
import { AnyAction } from 'redux'

const initData: INotificationStyle = {
    color: 'rgba(255,255,255,1)',
    background: 'rgba(0,0,0,0.5)',
    top: 24,
    bottom: 24,
    time: 2,
    placement: 'topRight'
}

export default function notificationStyle(state: INotificationStyle = initData, action: AnyAction) {
    switch (action.type) {
        case SET_NOTIFICATIONSTYLE_DATA:
            return action.data
        default:
            return state
    }
}