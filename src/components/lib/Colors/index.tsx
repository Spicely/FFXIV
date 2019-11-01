import React, { Component, ChangeEvent, MouseEvent, CSSProperties } from 'react'
import { SketchPicker, ChromePicker, BlockPicker, GithubPicker, TwitterPicker, HuePicker, AlphaPicker, CirclePicker, SliderPicker, CompactPicker, MaterialPicker, SwatchesPicker, ColorResult } from 'react-color'
import { isFunction } from 'muka'
import Mask from './mask'
import { getClassName } from '../utils'
export { ColorResult } from 'react-color'

export type colorsType = 'sketch' | 'chrome' | 'block' | 'github' | 'twitter' | 'hue' | 'alpha' | 'circle' | 'slider' | 'compact' | 'material' | 'swatches'

export interface IColorsProps {
    className?: string
    type?: colorsType
    initColor?: string
    style?: CSSProperties
    onChange?: (color: ColorResult, event: ChangeEvent) => void
    [name: string]: any
}

interface IState {
    color: string
    visible: boolean
    top: number,
    left: number
}

const prefixClass = 'colors'

export default class Colors extends Component<IColorsProps, IState> {

    constructor(props: IColorsProps) {
        super(props)
        if (props.initColor) {
            this.state.color = props.initColor
        }
    }

    public static defaultProps: IColorsProps = {
        type: 'chrome'
    }

    public state: IState = {
        color: '#0693e3',
        visible: false,
        left: 0,
        top: 0
    }

    private colorNode: Element | null = null

    public render(): JSX.Element {
        const { className, style } = this.props
        const { color, visible, left, top } = this.state
        return (
            <div className={getClassName(`${prefixClass} flex_justify`, className)} style={style}>
                <div className="flex">
                    <div className={getClassName(`${prefixClass}_color`)} ref={(e) => this.colorNode = e} onClick={this.handleClick}>
                        <div className={getClassName(`${prefixClass}_color_box`)} style={{ background: color }}></div>
                    </div>
                    <div className={getClassName(`${prefixClass}_label flex_justify`)}>{color}</div>
                </div>
                <Mask visible={visible} onClose={this.handleClose}>
                    <div className={getClassName(`${prefixClass}_select`)} style={{ left, top }}>
                        {this.getColorNode()}
                    </div>
                </Mask>
            </div>
        )

    }

    private handleClick = (e: MouseEvent<HTMLDivElement>) => {
        let left = 0
        let top = 0
        if (this.colorNode) {
            const obj = this.colorNode.getBoundingClientRect()
            left = obj.left
            top = obj.top + obj.height + 10
        }

        this.setState({
            visible: true,
            left,
            top
        })
    }

    private handleClose = (status: boolean) => {
        this.setState({
            visible: status
        })
    }

    private getColorNode() {
        const { width, height, type } = this.props
        const { color } = this.state
        const props: any = {
            className: getClassName(`${prefixClass}_${type}`),
            width,
            height,
            onChange: this.handleChange,
            color
        }

        // tslint:disable-next-line: switch-default
        switch (type) {
            case 'github': {
                if (!width) {
                    props.width = 212
                }
                // tslint:disable-next-line: align
            } break
            case 'twitter': {
                if (!height) {
                    props.width = 212
                }
                // tslint:disable-next-line: align
            } break
        }
        switch (type) {
            case 'swatches': return <SwatchesPicker {...props} />
            case 'material': return <MaterialPicker {...props} />
            case 'compact': return <CompactPicker {...props} />
            case 'slider': return <SliderPicker {...props} />
            case 'circle': return <CirclePicker {...props} />
            case 'alpha': return <AlphaPicker {...props} />
            case 'hue': return <HuePicker {...props} />
            case 'twitter': return <TwitterPicker {...props} />
            case 'github': return <GithubPicker {...props} />
            case 'block': return <BlockPicker {...props} />
            case 'chrome': return <ChromePicker {...props} />
            default: return <SketchPicker {...props} />
        }
    }

    private handleChange = (color: ColorResult, event: ChangeEvent) => {
        const { onChange } = this.props
        this.setState({
            color: color.hex
        })
        if (isFunction(onChange)) {
            onChange(color, event)
        }
    }
}
