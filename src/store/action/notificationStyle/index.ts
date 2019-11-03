export const SET_NOTIFICATIONSTYLE_DATA = 'SET_NOTIFICATIONSTYLE_DATA'

export interface INotificationStyle {
    color: string
    background: string
    top: number
    bottom: number
    time: number
    placement: 'topRight' | 'bottomRight'
}

export interface INotificationStyleProps {
    notificationStyle: INotificationStyle
    setNotificationStyle: (data: INotificationStyle) => void
}

export const actions = {
    setNotificationStyle: (data: INotificationStyle) => {
        return {
            type: SET_NOTIFICATIONSTYLE_DATA,
            data
        }
    }
}