export const SET_GATHERLIST_DATA = 'SET_GATHERLIST_DATA'

export interface IGatherList {
    id: string
    name: string
    grade: number
    pos: string
    posX: string
    posY: string
    number: number
    startTime: string
    endTime: string
    tip: boolean
    vocation: string
}

export interface IActionsListProps {
    gatherList: IGatherList[]
    setGatherList: (data: IGatherList[]) => void
}

export const actions = {
    setGatherList: (data: IGatherList[]) => {
        return {
            type: SET_GATHERLIST_DATA,
            data
        }
    }
}