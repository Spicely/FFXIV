import React, { Component, ChangeEvent, CSSProperties } from 'react'
import Loadable from 'react-loadable'
import moment from 'moment'
import { omit, isFunction, isUndefined, hash, isBool, isNil, isArray } from 'muka'
import { getClassName } from '../utils'
import { IButtonProps } from '../Button'
import { RadioGroupProps } from 'antd/lib/radio'
import { TimePickerProps } from 'antd/lib/time-picker'
import { IInputProps } from '../Input'
import { ILUpload, ILUploadChangeParam } from '../LUpload'
import { ILDatePicker } from '../DatePicker'
import { IImagePickerProps } from '../ImagePicker'
import { IMapProps } from '../Map'
import { ITextareaProps } from '../Textarea'
import { IColorsProps, ColorResult } from '../Colors'
import { ICarouselProps } from '../Carousel'
import { ISelectProps } from '../Select'
import { ICheckBoxProps } from '../CheckBox'
import { IUploadProps } from '../Upload'
import { IEditorProps } from '../Editor'

interface ILFormUpload extends ILUpload {
    label?: string | JSX.Element
}

type component = 'Colors' | 'Input' | 'Button' | 'Radio' | 'DatePicker' | 'LUpload' | 'RangePicker' | 'NULL' | 'Label' | 'RadioGroup' | 'Select' | 'ImagePicker' | 'Map' | 'Textarea' | 'Carousel' | 'Slider' | 'CheckBox' | 'Editor' | 'TimePicker' | 'Upload'
type props = RadioGroupProps | IInputProps | IButtonProps | ILDatePicker | ILFormUpload | IImagePickerProps | IMapProps | ICarouselProps | ITextareaProps | IColorsProps | ISelectProps | ICheckBoxProps | IEditorProps | TimePickerProps | IUploadProps | undefined

export interface ILFormItem {
    component: component
    props?: props
    field?: string
    label?: string | JSX.Element
    additional?: string | JSX.Element
    className?: string
    render?: (val: any) => JSX.Element
    visible?: boolean
    extend?: string | JSX.Element
}

export interface ILFormProps {
    getItems: (exFun: ILFormFun) => ILFormItem[]
    showType?: 'column' | 'row'
    className?: string
    style?: CSSProperties
}

export interface ILFormFun {
    getFieldValue: (field?: string[]) => IValue
    cleanFieldValue: () => void
    setFieldValue: (params: IValue) => void
    showFieldElement: (params: string[]) => void
    hideFieldElement: (params: string[]) => void
    updateFieldProps: (parsms: IValue) => void
}

// tslint:disable-next-line: interface-name
interface IValue {
    [name: string]: any
}

interface ILFormChild {
    type: component
    field: string
    label?: string | JSX.Element
    className?: string
    props: IValue
    additional?: string | JSX.Element
    view: any
    render?: (val: any) => JSX.Element
    visible: boolean
    extend?: string | JSX.Element
}

// tslint:disable-next-line: only-arrow-functions tslint:disable-next-line: no-shadowed-variable
const loadableComponent = function (component: Promise<any>) {
    return Loadable({
        loader: () => component,
        loading() {
            return null
        },
        // tslint:disable-next-line: no-shadowed-variable
        render(loaded: any, props: any) {
            let View
            if (loaded.Group) {
                View = loaded.Group
            } else {
                View = loaded.default
            }
            if (View) {
                return <View {...props} />
            }
            return null
        }
    })
}

interface IState {
    childs: ILFormChild[]
    vals: IValue
}

const prefixClass = 'l_form'

export default class LForm extends Component<ILFormProps, IState> {

    public static defaultProps: ILFormProps = {
        // tslint:disable-next-line: object-literal-shorthand tslint:disable-next-line: only-arrow-functions
        getItems: function (exFun: ILFormFun) {
            return []
        },
        showType: 'column'
    }

    public state: any = {}

    private items: ILFormItem[] = []

    private lref: ILFormFun = {
        getFieldValue: this.getFieldValue.bind(this),
        cleanFieldValue: this.cleanFieldValue.bind(this),
        setFieldValue: this.setFieldValue.bind(this),
        showFieldElement: this.setFieldElement.bind(this, true),
        hideFieldElement: this.setFieldElement.bind(this, false),
        updateFieldProps: this.updateFieldProps.bind(this)
    }

    // tslint:disable-next-line: no-shadowed-variable
    public constructor(props: ILFormProps) {
        super(props)
        const { getItems } = this.props
        const vals: any = {}
        const childs: ILFormChild[] = []
        this.items = getItems(this.lref)
        this.items.map((item: ILFormItem, index: number) => {
            const field = item.field || `${item.component}_${index}`
            const _porps: any = item.props || {}
            switch (item.component) {
                case 'Radio': {
                    vals[field] = _porps.value
                    // tslint:disable-next-line: align
                } break
                case 'Slider': {
                    vals[field] = _porps.value || _porps.defaultValue || 0
                    // tslint:disable-next-line: align
                } break
                case 'Colors': {
                    vals[field] = _porps.initColor || ''
                    // tslint:disable-next-line: align
                } break
                case 'CheckBox': {
                    vals[field] = _porps.value || []
                    // tslint:disable-next-line: align
                } break
                case 'LUpload': {
                    vals[field] = _porps.fileList || (_porps.maxLength > 1 ? [] : '')
                    // tslint:disable-next-line: align
                } break
                case 'RadioGroup': {
                    vals[field] = isUndefined(_porps.value) ? '' : _porps.value
                    // tslint:disable-next-line: align
                } break
                case 'ImagePicker': {
                    vals[field] = _porps.value || []
                    // tslint:disable-next-line: align
                } break
                case 'Map': {
                    vals[field] = _porps.value || {}
                    // tslint:disable-next-line: align
                } break
                default: {
                    vals[field] = _porps.value || ''
                }
            }

            childs.push({
                type: item.component,
                view: null,
                field,
                additional: item.additional,
                label: item.label,
                props: item.props || {},
                className: item.className,
                visible: isUndefined(item.visible) ? true : item.visible,
                render: item.render,
                extend: item.extend
            })
        })
        this.state = {
            vals,
            childs
        }
    }

    public UNSAFE_componentWillReceiveProps(nextProps: ILFormProps) {
        const { getItems } = nextProps
        const { childs, vals } = this.state
        const items = getItems(this.lref)
        this.items = items
        const newChild: ILFormChild[] = [...childs]
        items.forEach((item: ILFormItem, index: number) => {
            // 如果组件不存在 则创建
            if (!newChild[index]) {
                const field = item.field || `${item.component}_${index}`
                const _porps: IValue = item.props || {}
                newChild[index] = {
                    type: item.component,
                    view: null,
                    field,
                    label: item.label,
                    props: _porps,
                    additional: item.additional,
                    className: item.className,
                    render: item.render,
                    visible: isBool(item.visible) ? item.visible : true,
                    extend: item.extend
                }
                switch (item.component) {
                    case 'Radio': {
                        vals[field] = _porps.value
                        // tslint:disable-next-line: align
                    } break
                    case 'Slider': {
                        vals[field] = _porps.value || _porps.defaultValue || 0
                        // tslint:disable-next-line: align
                    } break
                    case 'Colors': {
                        vals[field] = _porps.initColor || ''
                        // tslint:disable-next-line: align
                    } break

                    case 'LUpload': {
                        vals[field] = _porps.fileList || (_porps.maxLength > 1 ? [] : '')
                        // tslint:disable-next-line: align
                    } break
                    case 'ImagePicker': {
                        vals[field] = _porps.value || []
                        // tslint:disable-next-line: align
                    } break
                    case 'CheckBox': {
                        vals[field] = _porps.value || []
                        // tslint:disable-next-line: align
                    } break
                    case 'RangePicker': {
                        vals[field] = _porps.value || []
                        // tslint:disable-next-line: align
                    } break
                    case 'Map': {
                        vals[field] = _porps.value || {}
                        // tslint:disable-next-line: align
                    } break
                    default: {
                        vals[field] = _porps.value || ''
                    }
                }
                return
            }
            if (item.field === newChild[index].field) {
                const newProps = omit(item.props || {}, ['value'])
                newChild[index].props = {
                    ...newChild[index].props,
                    ...newProps
                }
                newChild[index].additional = item.additional
                newChild[index].visible = isBool(item.visible) ? item.visible : true
                newChild[index].extend = item.extend
            }
        })
        this.setState({
            childs: newChild,
            vals: { ...vals }
            // tslint:disable-next-line: align
        }, () => {
            this.getTypeChild()
        })
    }

    public render(): JSX.Element {
        const { className, showType, style } = this.props
        const { childs } = this.state
        return (
            <div className={getClassName(`l_form ${showType}`, className)} style={style}>
                {childs.map((item: ILFormChild, index: number) => {
                    if (item.view && item.visible) {
                        return this.setTypeCom(this.items[index].component, item.view, item.props, item.field, index, item.className, item.label, item.additional, item.render, item.extend)
                    }
                    return undefined
                })}
            </div>
        )
    }

    public componentDidMount() {
        this.getTypeChild()
    }

    private getTypeChild() {
        const { childs } = this.state
        const newChilds = childs.map((item: ILFormChild, index: number) => {
            if (item.view) {
                if (item.type !== this.items[index].component) {
                    const Com = this.typeChild(this.items[index].component)
                    if (Com) {
                        item.view = Com
                    }
                }
            } else {
                const Com = this.typeChild(this.items[index].component)
                const field = item.field || `${item.type}_${index}`
                if (Com) {
                    item = {
                        ...item,
                        view: Com,
                        type: item.type,
                        field,
                        label: item.label,
                        props: item.props || {},
                        visible: isUndefined(item.visible) ? true : item.visible,
                        render: item.render
                    }
                }
            }
            return item
        })
        this.setState({
            childs: newChilds
        })
    }

    // tslint:disable-next-line: no-shadowed-variable
    private typeChild(component: component) {
        switch (component) {
            case 'Editor': return loadableComponent(import('../Editor'))
            case 'Input': return loadableComponent(import('../Input'))
            case 'Button': return loadableComponent(import('../Button'))
            case 'Radio': return loadableComponent(import('../Radio/Group'))
            case 'DatePicker': return loadableComponent(import('../DatePicker'))
            case 'LUpload': return loadableComponent(import('../LUpload'))
            case 'Upload': return loadableComponent(import('../Upload/dragger'))
            case 'Label': return loadableComponent(import('../Label'))
            case 'RadioGroup': return loadableComponent(import('../Radio/Group'))
            case 'Select': return loadableComponent(import('../Select'))
            case 'ImagePicker': return loadableComponent(import('../ImagePicker'))
            case 'Map': return loadableComponent(import('../Map'))
            case 'Textarea': return loadableComponent(import('../Textarea'))
            case 'Colors': return loadableComponent(import('../Colors'))
            case 'Carousel': return loadableComponent(import('../Carousel'))
            case 'RangePicker': return loadableComponent(import('../RangePicker'))
            case 'CheckBox': return loadableComponent(import('../CheckBox'))
            case 'Slider': return loadableComponent(import('antd/lib/slider'))
            case 'TimePicker': return loadableComponent(import('antd/lib/time-picker'))
            default: return null
        }
    }

    // tslint:disable-next-line: no-shadowed-variable
    private setTypeCom(component: component, View: any, props: props, field: string | undefined, key: number | string, className?: string, label?: string | JSX.Element, additional?: string | JSX.Element, render?: (val: any) => JSX.Element, extend?: string | JSX.Element): JSX.Element | null {
        const { vals } = this.state
        /// 得到field
        field = field ? field : `${component}_${key}`
        props = props || {}
        switch (component) {
            case 'Input': {
                const _porps: any = props
                const vProps = omit(props, ['value', 'onChange', 'onClose'])
                // tslint:disable-next-line: only-arrow-functions
                // tslint:disable-next-line: no-empty
                const onChange: any = _porps.onChange || function (e: ChangeEvent<HTMLButtonElement>) { }
                // tslint:disable-next-line: only-arrow-functions
                const onClose: any = _porps.onClose || function (val: string) { }
                return (
                    <div className={getClassName(`${prefixClass}__list`, className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName(`${prefixClass}__list_label flex_justify`)}>{label}</div>}
                            <div className="flex_1 flex_justify">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    onChange={this.setVal.bind(this, field, onChange)}
                                    onClose={this.cleanInputVal.bind(this, field, onClose)}
                                    key={field}
                                />
                            </div>
                            <div className="flex_center">{extend}</div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'Textarea': {
                const _porps: any = props
                const vProps = omit(props, ['value', 'onChange'])
                // tslint:disable-next-line: only-arrow-functions
                // tslint:disable-next-line: no-empty
                const onChange: any = _porps.onChange || function (e: ChangeEvent<HTMLButtonElement>) { }
                return (
                    <div className={getClassName(`${prefixClass}__list`, className)} key={field}>
                        <div className="flex" >
                            {label && <div className={getClassName(`${prefixClass}__list_label`)}>{label}</div>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    onChange={this.setVal.bind(this, field, onChange)}
                                    key={field}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'Colors': {
                const _porps: any = props
                const vProps: any = omit(props, ['onChange'])
                // tslint:disable-next-line: only-arrow-functions
                // tslint:disable-next-line: no-empty
                const onChange: any = _porps.onChange || function (e: ChangeEvent<HTMLButtonElement>) { }
                return (
                    <div className={getClassName(`${prefixClass}__list  flex`, className)} key={field}>
                        {label && <div className={getClassName(`${prefixClass}__list_label flex_justify`)}>{label}</div>}
                        <div className="flex_1 flex_justify">
                            <View
                                {...vProps}
                                initColor={vals[field]}
                                onChange={this.setColors.bind(this, field, onChange)}
                                key={field}
                            />
                        </div>
                    </div>
                )
            }
            case 'Carousel': {
                const vProps = omit(props, ['onChange'])
                return (
                    <div className={getClassName(`${prefixClass}__list`, className)} key={field}>
                        <div className="flex" >
                            {label && <div className={getClassName(`${prefixClass}__list_label`)}>{label}</div>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    key={field}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'Slider': {
                const vProps = omit(props, ['onChange', 'value'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <div className={getClassName(`${prefixClass}__list flex_justify`, className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName(`${prefixClass}__list_label flex_justify`)}>{label}</div>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    key={field}
                                    value={vals[field]}
                                    onChange={this.setRVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
            case 'Button': {
                const vProps = omit(props, ['className'])
                const _porps: any = props
                return (
                    <div className={getClassName(`${prefixClass}__list flex_justify`, className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName(`${prefixClass}__list_label`)} style={{ paddingTop: '5px' }}>{label}</div>}
                            <div className="flex_1">
                                <View {...vProps} key={field} className={getClassName(`${prefixClass}_btn`, _porps.className)} />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'Editor': {
                const vProps = omit(props, ['onChange', 'value'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <div className={getClassName(`${prefixClass}__list flex_justify`, className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName(`${prefixClass}__list_label`)} style={{ paddingTop: '5px' }}>{label}</div>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    key={field}
                                    value={vals[field]}
                                    onChange={this.setRVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'CheckBox': {
                const vProps = omit(props, ['onChange', 'value'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <div className={getClassName(`${prefixClass}__list flex_justify`, className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName(`${prefixClass}__list_label`)}>{label}</div>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    key={field}
                                    value={vals[field]}
                                    onChange={this.setRVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'Radio': {
                const vProps = omit(props, ['onChange'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <div className={getClassName(`${prefixClass}__list flex_justify`, className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName(`${prefixClass}__list_label`)} style={{ paddingTop: '5px' }}>{label}</div>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    onChange={this.setRVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'Map': {
                const vProps = omit(props, ['onLocationAddr'])
                const _porps: any = props
                return (
                    <div className={getClassName(`${prefixClass}__list  flex`, className)} key={field}>
                        {label && <div className={getClassName(`${prefixClass}__list_label`)}>{label}</div>}
                        <div className="flex_1">
                            <View
                                onLocationAddr={this.steArrVal.bind(this, field, _porps.onLocationAddr)}
                                {...vProps}
                            />
                        </div>
                    </div>
                )
            }
            case 'DatePicker': {
                const vProps = omit(props, ['onChange', 'className'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <div className={getClassName(`${prefixClass}__list flex_justify`, className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName(`${prefixClass}__list_label`)} style={{ paddingTop: '5px' }}>{label}</div>}
                            <div className="flex_1 flex">
                                <View
                                    {...vProps}
                                    key={field}
                                    className={`flex_1 ${_porps.className || ''}`}
                                    value={vals[field] ? moment(vals[field]) : null}
                                    onChange={this.setDatePickerVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'TimePicker': {
                const vProps = omit(props, ['onChange', 'className'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <div className={getClassName(`${prefixClass}__list flex_justify`, className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName(`${prefixClass}__list_label`)} style={{ paddingTop: '5px' }}>{label}</div>}
                            <div className="flex_1 flex">
                                <View
                                    {...vProps}
                                    key={field}
                                    className={`flex_1 ${_porps.className || ''}`}
                                    value={vals[field] ? moment(vals[field], _porps.format || 'HH:mm:ss') : null}
                                    onChange={this.setTimePickerVal.bind(this, field, onChange)}
                                />
                            </div>
                            <div className="flex_center">{extend}</div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'RangePicker': {
                const vProps = omit(props, ['onChange', 'className'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <div className={getClassName(`${prefixClass}__list flex_justify`, className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName(`${prefixClass}__list_label`)} style={{ paddingTop: '5px' }}>{label}</div>}
                            <div className="flex_1 flex">
                                <View
                                    {...vProps}
                                    key={field}
                                    className={`flex_1 ${_porps.className || ''}`}
                                    value={vals[field] ? vals[field].map((i: string) => moment(i)) : null}
                                    onChange={this.setDatePickerVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'ImagePicker': {
                const vProps = omit(props, ['value', 'onChange'])
                const _porps: any = props
                return (
                    <div className={getClassName(`${prefixClass}__list  flex`, className)} key={field}>
                        {label && <div className={getClassName(`${prefixClass}__list_label`)}>{label}</div>}
                        <div className="flex_1">
                            <View
                                value={vals[field]}
                                onChange={this.steArrVal.bind(this, field, _porps.onChange)}
                                {...vProps}
                            />
                        </div>
                    </div>
                )
            }
            case 'LUpload': {
                const vProps = omit(props, ['fileList', 'onChange'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <div className="flex" key={field}>
                        {label && <div className={getClassName(`${prefixClass}__list_label`)}>{label}</div>}
                        <div className="flex_1">
                            {isFunction(render) ? render(vals[field]) : (
                                <View
                                    {...vProps}
                                    fileList={vals[field]}
                                    onChange={this.setUploadVal.bind(this, field, onChange)}
                                />
                            )}
                        </div>
                    </div>
                )
            }
            case 'RadioGroup': {
                const vProps = omit(props, ['value', 'onChange'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <div className={getClassName('l_form_radio_group', className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName('l_form_radio_group_label flex_justify')}>{label}</div>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    onChange={this.setRadioGroupVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'Select': {
                const vProps = omit(props, ['value', 'onChange'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <div className={getClassName(`${prefixClass}__list flex_justify`, className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName(`${prefixClass}__list_label`)} style={{ paddingTop: '5px' }}>{label}</div>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    className={`flex_1 ${_porps.className || ''}`}
                                    onChange={this.setRVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'Upload': {
                const vProps = omit(props, ['value'])
                const _porps: any = props
                // const onChange: any = _porps.onChange
                return (
                    <div className={getClassName(`${prefixClass}__list flex_justify`, className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName(`${prefixClass}__list_label`)} style={{ paddingTop: '5px' }}>{label}</div>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    className={`flex_1 ${_porps.className || ''}`}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'Label': {
                const vProps = omit(props, ['value', 'onChange', 'className'])
                const _porps: any = props
                return (
                    <div className={getClassName(`${prefixClass}__list flex_justify`, className)} key={field}>
                        <div className="flex">
                            {label && <div className={getClassName(`${prefixClass}__list_label`)} style={{ paddingTop: '5px' }}>{label}</div>}
                            <div className="flex_1">
                                {
                                    isFunction(render) ? render(vals[field]) : (
                                        <View
                                            {...vProps}
                                            style={{ paddingTop: '0', paddingBottom: '0' }}
                                            key={field}
                                        >
                                            {_porps.value}
                                        </View>
                                    )
                                }

                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            default: return null
        }
    }

    private setUploadVal(field: string, cb: (file: ILUploadChangeParam) => void, file: ILUploadChangeParam) {
        const { vals } = this.state
        vals[field] = file.fileList
        if (isFunction(cb)) {
            cb(file)
        }
        this.setState({
            vals
        })
    }

    private steArrVal(field: string, cb: () => void, val: any) {
        const { vals } = this.state
        vals[field] = val
        if (isFunction(cb)) {
            cb(val)
        }
        this.setState({
            vals
        })
    }

    private setColors(field: string, cb: (color: ColorResult, e: ChangeEvent<HTMLButtonElement>) => {}, color: ColorResult, e: ChangeEvent<HTMLButtonElement>) {
        const { vals } = this.state
        vals[field] = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
        if (isFunction(cb)) {
            cb(color, e)
        }
        this.setState({
            vals
        })
    }

    private setVal(field: string, cb: (e: ChangeEvent<HTMLButtonElement>) => {}, e: ChangeEvent<HTMLButtonElement>) {
        const { vals } = this.state
        vals[field] = e.target.value
        if (isFunction(cb)) {
            cb(e)
        }
        this.setState({
            vals
        })
    }

    private setDatePickerVal(field: string, cb: (date: any, dateString: string) => void, val: any, dateString: string) {
        const { vals } = this.state
        if (isArray(dateString)) {
            let newVal: any = []
            dateString.map((i: any) => {
                // tslint:disable-next-line: no-unused-expression
                i && newVal.push(i)
            })
            vals[field] = newVal
        } else {
            vals[field] = dateString
        }
        if (isFunction(cb)) {
            cb(val, dateString)
        }
        this.setState({
            vals
        })
    }

    private setTimePickerVal(field: string, cb: (date: any, dateString: string) => void, val: any, dateString: string) {
        const { vals } = this.state
        vals[field] = dateString
        if (isFunction(cb)) {
            cb(val, dateString)
        }
        this.setState({
            vals
        })
    }
    private setRVal(field: string, cb: (val?: any) => void, val: any) {
        const { vals } = this.state
        vals[field] = val
        if (isFunction(cb)) {
            cb(val)
        }
        this.setState({
            vals
        })
    }
    private setRadioGroupVal(field: string, cb: (val?: any) => void, val: any) {
        const { vals } = this.state
        vals[field] = val
        if (isFunction(cb)) {
            cb(val)
        }
        this.setState({
            vals
        })
    }

    private cleanInputVal(field: string, cb: (val: string) => {}) {
        const { vals } = this.state
        vals[field] = ''
        if (isFunction(cb)) {
            cb('')
        }
        this.setState({
            vals
        })
    }

    private getComVal(item: ILFormChild, field: string) {
        const { vals } = this.state
        switch (item.type) {
            case 'LUpload': {
                const _props: any = item.props || {}
                const baseUrl: string = _props.baseUrl || ''
                if (_props.maxLength === 1) {
                    // tslint:disable-next-line: no-string-literal
                    const url: string = (vals[field][0] && (vals[field][0]['url'] || vals[field][0]['response']['data'])) || ''
                    if (baseUrl && hash(url, baseUrl)) {
                        return url.substring(baseUrl.length)
                    } else {
                        return url
                    }
                } else {
                    return vals[field].map((i: any) => {
                        // tslint:disable-next-line: no-string-literal
                        const url = i['url'] || i['response']['data']
                        if (baseUrl && hash(url, baseUrl)) {
                            return url.substring(baseUrl.length)
                        } else {
                            return url
                        }
                    })
                }
            }
            default: return vals[field]
        }
    }

    private getFieldValue(params?: string[]): IValue {
        const { childs } = this.state
        const val: IValue = {}
        childs.map((item: ILFormChild, index: number) => {
            if (params) {
                params.map((i: string) => {
                    if (item.field === i) {
                        val[i] = this.getComVal(item, i)
                    }
                })
            } else {
                val[item.field] = this.getComVal(item, item.field)
            }
        })
        return val
    }

    private cleanFieldValue() {
        const { vals } = this.state
        this.items.map((item: ILFormItem, index: number) => {
            const field = item.field || `${item.component}_${index}`
            // tslint:disable-next-line: no-shadowed-variable
            const props: any = item.props || {}
            switch (item.component) {
                case 'Radio': {
                    vals[field] = props.value
                    // tslint:disable-next-line: align
                } break
                case 'LUpload': {
                    vals[field] = []
                    // tslint:disable-next-line: align
                } break
                case 'CheckBox': {
                    vals[field] = []
                    // tslint:disable-next-line: align
                } break
                case 'RangePicker': {
                    vals[field] = []
                    // tslint:disable-next-line: align
                } break
                case 'ImagePicker': {
                    vals[field] = props.value ? props.value : []
                    // tslint:disable-next-line: align
                } break
                default: {
                    vals[field] = props.value ? props.value : ''
                }
            }
        })
        this.setState({
            vals
        })
    }

    private setFieldValue(params: IValue) {
        const { vals } = this.state
        this.items.map((item: ILFormItem, index: number) => {
            const field = item.field || `${item.component}_${index}`
            if (!isNil(params[field])) {
                switch (item.component) {
                    case 'LUpload': {
                        const _props: any = item.props || {}
                        const baseUrl = _props.baseUrl || ''
                        if (_props.maxLength === 1) {
                            vals[field] = [{
                                uid: '-1',
                                name: 'xxx.png',
                                status: 'done',
                                url: baseUrl + params[field],
                            }]
                        } else {
                            // tslint:disable-next-line: no-shadowed-variable
                            vals[field] = params[field].map((i: string, index: number) => {
                                return {
                                    uid: `${index}`,
                                    name: `reload_${index}.png`,
                                    status: 'done',
                                    url: baseUrl + i,
                                }
                            })
                        }
                        // tslint:disable-next-line: align
                    } break
                    default: {
                        vals[field] = params[field]
                    }
                }
            }
        })
        this.setState({
            vals
        })
    }

    private updateFieldProps(params: IValue = {}) {
        const { childs, vals } = this.state
        const newChilds = childs.map((i: ILFormChild) => {
            if (hash(params, i.field)) {
                if (i.type === 'Select' && params[i.field].value) {
                    vals[i.field] = params[i.field].value
                }
                i.props = {
                    ...i.props,
                    ...params[i.field]
                }
            }
            return i
        })
        this.setState({
            childs: newChilds,
            vals: { ...vals }
        })
    }

    private setFieldElement(status: boolean, params: string[]) {
        const { childs } = this.state
        const newChilds = childs.map((i: ILFormChild) => {
            if (hash(params, i.field)) {
                i.visible = status
            }
            return i
        })
        this.setState({
            childs: newChilds
        })
    }
}
