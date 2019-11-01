import React, { Component, ChangeEvent } from 'react'
import Cropper from 'react-easy-crop'
import { isFunction, isString } from 'muka'
import CropImage from './cropImage'
import Icon, { iconType } from '../Icon'
import Dialog from '../Dialog'
import Image from '../Image'
import { getClassName } from '../utils'

export interface ICroppedArea {
    height: number
    width: number
    x: number
    y: number
}

interface IIconStyle {
    color?: string,
    fontSize?: string
}

interface ICropProps {
    cropShape?: 'rect' | 'round'
    cropSize?: {
        width?: number
        height?: number
    }
    showGrid?: boolean
    crossOrigin?: string
}

interface ICrop {
    x: number
    y: number
}

interface IFile {
    url: string | ArrayBuffer | null
    file?: File
}

export interface IImagePickerProps {
    className?: string
    disabled?: boolean
    icon?: iconType | JSX.Element
    iconStyle?: IIconStyle
    multiple?: boolean
    onChange?: (files: IFile[]) => void
    crop?: boolean
    cropProps?: ICropProps
    maxLength?: number
    value?: IFile[]
}

interface IState {
    files: IFile[]
    cropXY: ICrop,
    image: string
    aspect: number
    zoom: number
    visible: boolean
}

const prefixClass = 'image_picker'

export default class ImagePicker extends Component<IImagePickerProps, IState> {

    public static defaultProps: IImagePickerProps = {
        icon: 'md-add',
        iconStyle: {
            fontSize: '28px',
            color: '#bcbcbc'
        }
    }

    public state: IState = {
        files: [],
        cropXY: { x: 0, y: 0 },
        image: '',
        aspect: 4 / 3,
        zoom: 1,
        visible: false
    }

    private filesList: IFile[] = []

    private index: number = 0

    private fileName: string = ''

    private croppedAreaPixels: ICroppedArea = {
        height: 0,
        width: 0,
        x: 0,
        y: 0
    }

    private croppedArea: ICroppedArea = {
        height: 0,
        width: 0,
        x: 0,
        y: 0
    }

    public componentDidMount() {
        const { value } = this.props
        const { files } = this.state
        this.setValue(value, files)
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IImagePickerProps) {
        const { files } = this.state
        this.setValue(nextProps.value, files)
    }

    private fileNode: HTMLInputElement | null = null

    public render(): JSX.Element {
        const { className, multiple, crop, cropProps, disabled } = this.props
        const { files, image, cropXY, aspect, zoom, visible } = this.state
        return (
            <div className={getClassName(`${prefixClass}`, className)}>
                <input type="file" style={{ display: 'none' }} ref={(e) => this.fileNode = e} multiple={crop ? false : multiple} onChange={this.handleFileChange} />
                {
                    files.map((i: IFile, index: number) => {
                        return (
                            <div className={getClassName(`${prefixClass}__add`)} key={`$picker_${index}`}>
                                <div className={getClassName(`${prefixClass}__add_box flex_center picker_img`)}>
                                    <Image className={getClassName(`${prefixClass}__add_box_img`)} src={i.url} />
                                </div>
                                {
                                    !disabled && <Icon icon="md-close-circle" className={getClassName(`${prefixClass}__add_close`)} fontSize="16px" onClick={this.handleFileRemove.bind(this, index)} />
                                }
                            </div>
                        )
                    })
                }
                {this.getAddBox()}
                {(crop && !disabled) && <Dialog
                    visible={visible}
                    onClose={this.handleCropClose}
                    onOk={this.handleOk}
                >
                    <Cropper
                        {...cropProps}
                        image={image}
                        crop={cropXY}
                        aspect={aspect}
                        zoom={zoom}
                        classes={{
                            containerClassName: getClassName(`${prefixClass}_crop__container`)
                        }}
                        style={{
                            containerStyle: {
                                position: 'relative',
                                height: '500px'
                            }
                        }}
                        onCropComplete={this.onCropComplete}
                        onCropChange={this.onCropChange}
                        onZoomChange={this.onZoomChange}
                    />
                </Dialog>}
            </div>
        )
    }

    private getAddBox(): JSX.Element | undefined {
        const { icon, iconStyle, maxLength } = this.props
        const { files } = this.state
        if (!maxLength || maxLength > files.length) {
            return (
                <div className={getClassName(`${prefixClass}__add `)} onClick={this.handleClick}>
                    <div className={getClassName(`${prefixClass}__add_box flex_center`)}>
                        {isString(icon) ? <Icon icon={icon} fontSize={iconStyle && iconStyle.fontSize} color={iconStyle && iconStyle.color} /> : icon}
                    </div>
                </div>
            )
        }
        return undefined
    }

    private setValue(value: IFile[] | undefined, files: IFile[]) {
        if (value) {
            let status: boolean = false
            this.filesList = [...value]
            if (value.length && value.length === files.length) {
                status = value.every((i, index: number) => {
                    if (!files[index]) {
                        return false
                    }
                    return i.url === files[index].url
                })
            }
            if (!status) {
                this.setState({
                    files: value
                })
            }
        }
    }

    private handleClick = () => {
        if (this.fileNode) {
            this.fileNode.click()
        }
    }

    private onCropChange = (crop: ICrop) => {
        this.setState({ cropXY: crop })
    }

    private onCropComplete = (croppedArea: ICroppedArea, croppedAreaPixels: ICroppedArea) => {
        this.croppedArea = croppedArea
        this.croppedAreaPixels = croppedAreaPixels
    }

    private onZoomChange = (zoom: number) => {
        this.setState({ zoom })
    }

    private handleCropClose = (val: boolean) => {
        this.setState({
            visible: val
        })
    }

    private handleFileRemove(index: number) {
        const { onChange } = this.props
        const { files } = this.state
        files.splice(index, 1)
        this.filesList.splice(index, 1)
        if (isFunction(onChange)) {
            onChange(files)
        }
        this.setState({
            files: [...files],
        })
    }

    private dataURLtoFile(dataurl: string, filename: string) {
        const arr = dataurl.split(',')
        const mime = ((arr[0] || '').match(/:(.*?);/) || [])[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        const blob: any = new Blob([u8arr], { type: mime })
        if (/Edge/.test(navigator.userAgent)) {
            blob.lastModifiedDate = new Date()
            blob.name = filename
            blob.filename = filename
            return blob
        } else {
            const file = new File([blob], filename)
            return file
        }
    }

    private handleOk = async () => {
        const { onChange } = this.props
        const { image } = this.state
        const croppedImage: any = await CropImage(image, this.croppedAreaPixels)
        this.filesList.push({
            file: this.dataURLtoFile(croppedImage, this.fileName),
            url: croppedImage
        })
        this.setState({
            visible: false,
            files: [...this.filesList]
        }, () => {
            if (isFunction(onChange)) {
                onChange(this.filesList)
            }
        })
    }

    private readFile(file: File, index: number) {
        const { files } = this.state
        if (files[index] && file === files[index].file) {
            return undefined
        }
        const reader = new FileReader()
        reader.readAsDataURL(file)
        return new Promise((resolve) => {
            reader.onload = () => {
                const { crop } = this.props
                if (!crop) {
                    this.filesList[index].url = reader.result
                    this.setState({
                        files: [...this.filesList]
                    })
                } else {
                    let image: any = ''
                    let visible: boolean = false
                    if (reader.result) {
                        image = reader.result
                        visible = true
                    }
                    this.setState({
                        image,
                        visible
                    })
                }
                resolve()
            }
        })
    }

    private handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const { onChange } = this.props
        if (e.currentTarget.files) {
            const { crop } = this.props
            const { files } = this.state
            const length = files.length
            const fileList = e.currentTarget.files
            if (crop) {
                this.index = length
                const _file = fileList.item(0)
                if (_file) {
                    this.fileName = _file.name
                    await this.readFile(_file, length)
                }
            } else {
                const { maxLength } = this.props
                const fileLength = maxLength ? maxLength - length : fileList.length
                if (fileLength <= 0) {
                    return
                }
                for (let i = 0; i < fileLength; i++) {
                    const _file = fileList.item(i)
                    if (_file) {
                        this.filesList.push({
                            file: _file,
                            url: ''
                        })
                        await this.readFile(_file, length + i)
                    }
                }
            }
            if (isFunction(onChange)) {
                onChange(this.filesList)
            }
            // e.target.value = ''
        }
    }
}
