import React, { Component, ChangeEvent, DragEvent, CSSProperties } from 'react'
import axios from 'axios'
import { isString, isArray, isNumber, isObject, isFunction } from 'muka'
import { getClassName, IValue } from '../utils'
import { Consumer } from '../ConfigProvider'
import Icon, { iconType } from '../Icon'
import Progress from '../Progress'

export interface IUploadFileListProps {
    file: File
    url?: string
    preUrl?: string
    xhr?: any
    info: {
        fileName?: string
        type?: string
        progress: number
        status: 'error' | 'done' | 'uploading'
    }
}

export interface IUploadProps {
    className?: string
    uploadViewClassName?: string
    icon?: iconType | JSX.Element
    iconColor?: string
    title?: string | JSX.Element
    label?: string | JSX.Element
    action?: string
    multiple: boolean
    fileTypes?: string[]
    baserUrl?: string
    maxFileSize?: number
    maxLength?: number
    style?: CSSProperties
    name?: string
    withCredentials?: boolean
    data?: IValue
    headers?: IValue
    fileList?: IUploadFileListProps[]
    renderItem?: (val: IUploadFileListProps) => JSX.Element[] | null[] | undefined[]
    onUploadSuccess?: (val: IUploadFileListProps, data: any, files: IUploadFileListProps[]) => void
    onUploadError?: (val: IUploadFileListProps, data: any, files: IUploadFileListProps[]) => void
    onFileTypeError?: () => void
    onUploadItemClear?: (delVal: IUploadFileListProps, data: IUploadFileListProps[]) => void
    onUploadStart?: () => boolean
    onMaxFileSizeError?: () => void
}

interface IState {
    fileList: IUploadFileListProps[]
}

const prefixClass = 'upload_dragger'

export default class Upload extends Component<IUploadProps, IState> {

    constructor(props: IUploadProps) {
        super(props)
        this.state.fileList = props.fileList || []
    }

    public static defaultProps: IUploadProps = {
        multiple: true,
        onUploadStart: () => true
    }

    private intNode: null | HTMLInputElement = null

    private types: string[] = ['image/png', 'image/jpeg', 'image/jpg']

    public state: IState = {
        fileList: []
    }

    public render(): JSX.Element {
        const { className, children, icon, title, label, iconColor, multiple, uploadViewClassName, renderItem, style, fileTypes } = this.props
        const { fileList } = this.state
        return (
            <Consumer>
                {
                    (value) => {
                        const iconProps = icon || (value.uploadDraggerProps && value.uploadDraggerProps.icon)
                        const iconColorProps = iconColor || (value.uploadDraggerProps && value.uploadDraggerProps.iconColor)
                        const titleProps = title || (value.uploadDraggerProps && value.uploadDraggerProps.title)
                        const labelProps = label || (value.uploadDraggerProps && value.uploadDraggerProps.label)
                        return (
                            <div className={getClassName(`${prefixClass}`)} style={style}>
                                <div className={getClassName(`${prefixClass}__box`, className)} onClick={this.handleClick} onDragOver={this.handleDropOver} onDrop={this.handleFileDrop}>
                                    {
                                        children ? children : (
                                            <div className={getClassName(`${prefixClass}__box_default`)}>
                                                <div className={getClassName(`${prefixClass}__box_default__icon`)}>
                                                    {isString(iconProps) ? <Icon icon={iconProps || undefined} fontSize="40px" color={iconColorProps} /> : iconProps}
                                                </div>
                                                <div className={getClassName(`${prefixClass}__box_default__title`)}>
                                                    {titleProps}
                                                </div>
                                                <div className={getClassName(`${prefixClass}__box_default__label`)}>
                                                    {labelProps}
                                                </div>
                                            </div>
                                        )
                                    }
                                    <input style={{ display: 'none' }} type="file" multiple={multiple} ref={(e) => this.intNode = e} onChange={this.handleFileChange} accept={(fileTypes || []).join(',')} />
                                </div>
                                <div className={getClassName(`${prefixClass}_upload__view`, uploadViewClassName)}>
                                    {
                                        fileList.map((i, index: number) => {
                                            if (isFunction(renderItem)) {
                                                return renderItem(i)
                                            } else {
                                                if (!i.info.fileName && !i.info.type) {
                                                    return undefined
                                                }
                                                return (
                                                    <div className={getClassName(`${prefixClass}_upload__view__item flex`)} key={index}>
                                                        <div className={getClassName(`${prefixClass}_upload__view__item__icon flex_center`)}>
                                                            {
                                                                this.getTypeView(i.info.type || '', i.preUrl)
                                                            }
                                                        </div>
                                                        <div className={getClassName(`${prefixClass}_upload__view__item__progress flex_1`)}>
                                                            <div>{i.info.fileName}</div>
                                                            <Progress percent={i.info.progress} text={`${i.info.progress}%`} />
                                                        </div>
                                                        <div className={getClassName(`${prefixClass}_upload__view__item__close`)}>
                                                            <Icon icon="ios-close" color="#fff" fontSize="16px" onClick={this.handleItemClose.bind(this, index)} />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        )
                    }
                }
            </Consumer>
        )
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IUploadProps) {
        const { fileList } = this.state
        if (nextProps.fileList && fileList.length !== nextProps.fileList.length) {
            this.setState({
                fileList: nextProps.fileList
            })
        }
    }

    private handleClick = () => {
        if (this.intNode) {
            this.intNode.click()
        }
    }

    private getTypeView = (type: string, url?: string) => {
        if (type.includes('jpeg') || type.includes('png') || type.includes('jpg')) {
            return (
                <div
                    style={{
                        width: '100%', height: '100%', backgroundImage: `url(${url})`, backgroundSize: '100% auto',
                        backgroundPosition: 'center'
                    }}
                />
            )
        } else {
            return <Icon icon="md-document" color="rgba(0, 0, 0, 0.45)" />
        }
    }

    private handleDropOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    private handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        if (files) {
            this.updLoadFiles(files)
        }
    }

    private handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (files) {
            this.updLoadFiles(files)
        }
        e.currentTarget.value = ''
    }

    private updLoadFiles = (files: FileList) => {
        const { fileTypes, maxLength, action, name, data, withCredentials, baserUrl, onUploadSuccess, onUploadError, onFileTypeError, headers, onUploadStart, maxFileSize, onMaxFileSizeError } = this.props
        let { fileList } = this.state
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i)
            if (file && (isNumber(maxLength) ? fileList.length < maxLength : true)) {
                if (isArray(fileTypes)) {
                    // tslint:disable-next-line: no-shadowed-variable
                    if (fileTypes.includes(file.type) || fileTypes.some((i) => file.name.includes(i))) {
                        if (maxFileSize && file.size >= maxFileSize) {
                            if (isFunction(onMaxFileSizeError)) {
                                onMaxFileSizeError()
                            }
                        } else {
                            fileList.push({
                                file,
                                preUrl: this.types.includes(file.type) ? window.URL.createObjectURL(file) : '',
                                info: {
                                    fileName: file.name,
                                    type: file.type,
                                    progress: 0,
                                    status: 'uploading'
                                }
                            })
                        }
                    } else {
                        if (isFunction(onFileTypeError)) {
                            onFileTypeError()
                        }
                    }
                } else {
                    if (maxFileSize && file.size >= maxFileSize) {
                        if (isFunction(onMaxFileSizeError)) {
                            onMaxFileSizeError()
                        }
                    } else {
                        fileList.push({
                            file,
                            preUrl: this.types.includes(file.type) ? window.URL.createObjectURL(file) : '',
                            info: {
                                fileName: file.name,
                                type: file.type,
                                progress: 0,
                                status: 'uploading'
                            }
                        })
                    }
                }
            }
        }
        fileList = fileList.map((i, index) => {
            if (i.url) {
                i.info = {
                    progress: 100,
                    status: 'done'
                }
                return i
            }
            const formData = new FormData()
            formData.append(name || 'avatar', i.file)
            let url = action
            if (isObject(data)) {
                let params = ''
                // tslint:disable-next-line: no-shadowed-variable
                Object.keys(data).map((i: any) => {
                    params = i + '=' + data[i] + '&'
                })
                url = url + '?' + params
            }
            if (!i.xhr && isFunction(onUploadStart) && onUploadStart()) {
                i.xhr = axios({
                    baseURL: baserUrl,
                    method: 'POST',
                    headers,
                    url,
                    data: formData,
                    withCredentials,
                    onUploadProgress: (progressEvent) => {
                        const complete = (progressEvent.loaded / progressEvent.total * 100) || 0
                        // tslint:disable-next-line: no-shadowed-variable
                        const { fileList } = this.state
                        if (fileList[index]) {
                            fileList[index].info = {
                                ...fileList[index].info,
                                progress: complete,
                                status: complete === 100 ? 'done' : 'uploading'
                            }
                            this.setState({
                                fileList: [...fileList]
                            })
                        }
                    }
                }).then((response) => {
                    // tslint:disable-next-line: no-shadowed-variable
                    const { fileList } = this.state
                    if (response.status === 200) {
                        if (isFunction(onUploadSuccess)) {
                            onUploadSuccess(i, response.data, fileList)
                        }
                    } else {
                        if (isFunction(onUploadError)) {
                            onUploadError(i, response.data, fileList)
                        }
                    }
                })
            }
            return i
        })
    }

    private handleItemClose = (index: number) => {
        const { onUploadItemClear } = this.props
        const { fileList } = this.state
        const data = fileList[index]
        fileList.splice(index, 1)
        if (isFunction(onUploadItemClear)) {
            onUploadItemClear(data, fileList)
        } else {
            this.setState({
                fileList: [...fileList]
            })
        }
    }
}
