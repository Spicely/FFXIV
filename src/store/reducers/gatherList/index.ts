import { SET_GATHERLIST_DATA, IGatherList } from '../../action/gatherList'
import { AnyAction } from 'redux'

const initData: IGatherList[] = []

export default function gatherList(state: IGatherList[] = initData, action: AnyAction) {
    switch (action.type) {
        case SET_GATHERLIST_DATA:
            return action.data
        default:
            return state
    }
}