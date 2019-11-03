import React, { Component } from 'react'
import { ILFormFun, ILFormItem } from 'src/components/lib/LForm'
import { NavBar, Icon, Button, Dialog, LForm, Empty, Input } from 'components'
import { AllElectron } from 'electron'
import moment from 'moment'
import { ConvertToEorzeaTimeString } from '../../utils/ffxivTime'
import { isArray } from 'muka'
import { connect } from 'react-redux'
import { IInitState } from 'src/store/state'
import { bindActionCreators } from 'redux'
import { actions, INotificationStyle } from 'src/store/action/notificationStyle'
import { actions as gatherActions, IActionsListProps, IGatherList } from 'src/store/action/gatherList'

import './index.less'
import { message, Tooltip, notification } from 'antd'

declare global {
    interface Window {
        // tslint:disable-next-line: no-any
        require: any
    }
}
const { remote, ipcRenderer, }: AllElectron = window.require('electron')

interface IProps extends IActionsListProps {
    notificationStyle: INotificationStyle
    setNotificationStyle: (data: INotificationStyle) => {}
}
interface IState {
    visible: boolean
    maxWin: boolean
}

class Home extends Component<IProps, IState> {

    private win = remote.getCurrentWindow()

    public state = {
        maxWin: false,
        visible: false
    }

    private time?: NodeJS.Timeout

    private fn?: ILFormFun

    public render(): JSX.Element {
        const { maxWin, visible } = this.state
        const { gatherList } = this.props
        return (
            <div className="win_view bg">
                <NavBar
                    className="win_browser"
                    divider={false}
                    left={null}
                    onBack={() => { }}
                    right={
                        <div className="flex">
                            <Button className="win_browser_btn" onClick={this.handleVisibleOpen} >
                                <Icon icon="ios-settings" className="icon_btn" />
                            </Button>
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

                <div className="app_view">
                    {
                        gatherList.length ? this.getGatherList() : <Empty descClassName="color_white" />
                    }
                    {/* {gatherData.map((i: any) => {

                    })} */}
                </div>
                <Dialog
                    title="功能设置"
                    visible={visible}
                    onClose={this.handleVisibleClose}
                    onOk={this.handleReSetting}
                >
                    <LForm getItems={this.getItems} />
                </Dialog>
            </div>
        )
    }

    public componentDidMount() {
        this.time = setInterval(() => {
            const { gatherList, notificationStyle } = this.props
            const val = ConvertToEorzeaTimeString(moment())
            gatherList.map((i) => {
                const year = moment().format('YYYY-MM-DD')
                if (ConvertToEorzeaTimeString(moment().add(Number(notificationStyle.time) || 2, 'm')) === i.startTime) {
                    ipcRenderer.send('notificationTime', {
                        key: i.id + 'vvv',
                        msg: `即将出现${i.name}, 位置：${i.pos}(X:${i.posX},Y:${i.posY})`,
                        des: {
                            grade: i.grade,
                            number: i.number,
                            vocation: i.vocation
                        }
                    })
                }
                if (moment(`${year} ${val}`).isAfter(moment(`${year} ${i.startTime}`))
                    && moment(`${year} ${val}`).isBefore(moment(`${year} ${i.endTime}`))
                    && i.tip) {
                    ipcRenderer.send('notificationMainClose', i.id + 'vvv')
                    ipcRenderer.send('notificationMain', {
                        key: i.id,
                        msg: `当前可挖${i.name}, 位置：${i.pos}(X:${i.posX},Y:${i.posY})`,
                        des: {
                            grade: i.grade,
                            number: i.number,
                            vocation: i.vocation
                        }
                    })
                } else {
                    ipcRenderer.send('notificationMainClose', i.id)
                }
            })
        }, 1000)

        this.win.addListener('maximize', this.handleSetIcon.bind(this, true))
        this.win.addListener('unmaximize', this.handleSetIcon.bind(this, false))
    }

    private getGatherList = () => {
        const { gatherList } = this.props
        const lists: JSX.Element[] = []
        gatherList.map((i, index) => {
            lists.push(
                <div className="gather_list" key={i.id}>
                    <div className="flex gather_list_info">
                        <div className="flex_1 gather_list_v flex_center">{i.name}</div>
                        <div className="flex_1 gather_list_v">
                            <div>{i.pos}</div>
                            <div className="gather_list_l">X:{i.posX},Y:{i.posY}</div>
                        </div>
                        <div className="flex_1 gather_list_v">
                            <div>等级 {i.grade}</div>
                            <div className="gather_list_l">{i.vocation}</div>
                        </div>
                        <div className="flex_1 gather_list_v flex_center">
                            <div>时间 {i.startTime} ~ {i.endTime}</div>
                        </div>
                    </div>
                    <div className="flex gather_list_alarm">
                        <div className="flex_1" />
                        <div style={{ cursor: 'pointer' }}>
                            <Tooltip title={`提示:${i.tip ? '开' : '关'}`}>
                                <Icon icon="ios-alarm" color={i.tip ? '#ffd600' : 'currentColor'} onClick={this.setTip.bind(this, !i.tip, index)} />
                            </Tooltip>
                        </div>
                    </div>
                </div>
            )
        })
        return lists
    }

    private handleVisibleOpen = () => { this.setState({ visible: true }) }

    private setTip = (status: boolean, index: number) => {
        const { gatherList, setGatherList } = this.props
        gatherList[index].tip = status
        setGatherList([...gatherList])
    }

    private handleVisibleClose = () => { this.setState({ visible: false }) }

    private handleFile = () => {
        const fs = window.require('fs')
        remote.dialog.showOpenDialog({
            title: '选择数据文件',
            properties: ['openFile', 'multiSelections', 'showHiddenFiles']
        }, (files: string[]) => {
            files.map((i) => {
                try {
                    const val = fs.readFileSync(i, 'utf-8')
                    // tslint:disable-next-line: no-eval
                    const data: IGatherList[] = eval(val)
                    if (isArray(data)) {
                        const { gatherList, setGatherList } = this.props
                        // tslint:disable-next-line: no-shadowed-variable
                        data.map((i) => {
                            const newVal = gatherList.find((v) => v.id === i.id)
                            // 存在数据更新
                            if (newVal) {
                                const index = gatherList.findIndex((v) => v.id === i.id)
                                gatherList[index] = {
                                    ...gatherList[index],
                                    ...i
                                }
                            } else {
                                gatherList.unshift(i)
                            }
                        })
                        setGatherList([...gatherList])
                    }
                } catch (e) { }
            })
            message.success('数据导入完成')
        })
    }

    private getItems = (fn: ILFormFun) => {
        const { notificationStyle } = this.props
        this.fn = fn
        const items: ILFormItem[] = [{
            component: 'Label',
            label: '数据：',
            render: () => {
                return (
                    <div className="flex">
                        <Button mold="primary" style={{ marginRight: '1rem' }} onClick={this.handleFile}>导入数据</Button>
                        <Button mold="error" onClick={this.handleCleanGather}>清除数据</Button>
                    </div>
                )
            }
        }, {
            component: 'Input',
            label: '提前通知：',
            props: {
                type: 'number',
                value: 2
            },
            field: 'time'
        }, {
            component: 'Colors',
            label: '提示背景颜色：',
            props: {
                initColor: notificationStyle.background
            },
            field: 'background'
        }, {
            component: 'Colors',
            label: '提示字体颜色：',
            props: {
                initColor: notificationStyle.color
            },
            field: 'color'
        }, {
            component: 'Slider',
            label: '提示顶部距离：',
            props: {
                value: notificationStyle.top,
                min: 24,
                max: 200
            },
            field: 'top'
        }, {
            component: 'Slider',
            label: '提示底部距离：',
            props: {
                value: notificationStyle.bottom,
                min: 24,
                max: 200
            },
            field: 'bottom'
        }, {
            component: 'Select',
            label: '提示位置：',
            props: {
                value: notificationStyle.placement,
                options: [{
                    label: '顶部',
                    value: 'topRight'
                }, {
                    label: '底部',
                    value: 'bottomRight'
                }]
            },
            field: 'placement'
        }]
        return items
    }

    private handleCleanGather = () => {
        const { setGatherList } = this.props
        setGatherList([])
        message.success('数据已清除')
    }

    public componentWillUnmount() {
        if (this.time) {
            clearInterval(this.time)
        }
        this.win.removeAllListeners('maximize')
        this.win.removeAllListeners('unmaximize')
    }

    private handleReSetting = () => {
        if (this.fn) {
            const { setNotificationStyle } = this.props
            const data = this.fn.getFieldValue()
            const val: INotificationStyle = {
                top: data.top,
                bottom: data.bootom,
                placement: data.placement,
                color: data.color,
                time: data.time,
                background: data.background
            }
            setNotificationStyle(val)
            remote.webContents.fromId(2).reload()
        }
    }

    private handleSetIcon = (value: boolean) => {
        this.setState({
            maxWin: value
        })
    }

    private handleHide = () => {
        ipcRenderer.send('min')
    }

    private handleMax = () => {
        ipcRenderer.send('max')
    }

    private handleClose = () => {
        ipcRenderer.send('close')
    }
}

export default connect(
    ({ notificationStyle, gatherList }: IInitState) => ({
        notificationStyle,
        gatherList
    }),
    (dispatch: any) => bindActionCreators({
        ...gatherActions,
        ...actions
    }, dispatch)
)(Home as any)