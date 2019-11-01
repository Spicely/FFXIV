import React, { Component, Fragment } from 'react'
import { createPortal } from 'react-dom'
interface IProps {
    id: string
}

interface IState {
    viewDom: Element | null
}

export default class ReaderDom extends Component<IProps, IState> {

    public state: IState = {
        viewDom: null
    }

    public render(): JSX.Element {
        const { children } = this.props
        const { viewDom } = this.state
        if (viewDom) {
            return createPortal(children, viewDom)
        }
        return <Fragment />
    }

    public componentDidMount() {
        this.getIdView()
    }

    private getIdView() {
        const { id } = this.props
        const dom = document.querySelector(`#${id}`)
        if (dom) {
            this.setState({
                viewDom: dom
            })
        }
    }
}
