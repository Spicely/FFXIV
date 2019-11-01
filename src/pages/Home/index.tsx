import React, { Component } from 'react'
import { NavBar, Icon, Button } from 'components'
import './index.less'

declare global {
    interface Window {
        // tslint:disable-next-line: no-any
        require: any
    }
}
// const electron = window.require('electron')

export default class Home extends Component {

    // private win = electron.remote.getCurrentWindow()

    public state = {
        maxWin: false
    }

    public render(): JSX.Element {
        const { maxWin } = this.state
        return (
            <div>
                <NavBar
                    className="win_browser"
                    divider={false}
                    left=" "
                    right={
                        <div className="flex">
                            <Button className="win_browser_btn" onClick={this.handleHide} >
                                <Icon icon="md-remove" color="#B8B8B9" />
                            </Button>
                            <Button className="win_browser_btn" onClick={this.handleMax}>
                                <Icon icon={maxWin ? 'md-contract' : 'md-expand'} color="#B8B8B9" />
                            </Button>
                            <Button className="win_browser_btn" onClick={this.handleClose}>
                                <Icon icon="md-close" color="#B8B8B9" />
                            </Button>
                        </div>
                    }
                />
            </div>
        )
    }

    public componentDidMount() {
        // this.win.addListener('maximize', this.handleSetIcon.bind(this, true))
        // this.win.addListener('unmaximize', this.handleSetIcon.bind(this, false))
    }

    public componentWillUnmount() {
        // this.win.removeAllListeners('maximize')
        // this.win.removeAllListeners('unmaximize')
    }

    private handleSetIcon = (value: boolean) => {
        this.setState({
            maxWin: value
        })
    }

    private handleHide = () => {
        // electron.ipcRenderer.send('min')
    }

    private handleMax = () => {
        // electron.ipcRenderer.send('max')
    }

    private handleClose = () => {
        // electron.ipcRenderer.send('close')
    }
}
