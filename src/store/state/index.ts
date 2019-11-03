import { IGatherList } from '../action/gatherList'
import { INotificationStyle } from '../action/notificationStyle'

export interface IInitState {
    gatherList: IGatherList[],
    notificationStyle: INotificationStyle
}