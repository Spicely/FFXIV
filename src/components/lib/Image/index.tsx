
import React, { Component, CSSProperties } from 'react'
import { PreLoad, browser } from 'muka'
import { getClassName } from '../utils'
import { Consumer } from '../ScrollView'

export interface IImageProps {
    className?: string
    src?: string | ArrayBuffer | null
    style?: CSSProperties
    offsetBottom?: number
    controller?: Element
    loadingIndicatorSource?: string
    onClick?: () => void
}

interface IState {
    uri?: string | ArrayBuffer | null
    animation: boolean
    show: boolean
}

const imgObj: { src: string } = {
    src: ''
}

export const setImageLoadingSource = (uri: string) => {
    imgObj.src = uri
}

export default class Image extends Component<IImageProps, IState> {

    public static defaultProps = {
        offsetBottom: 100
    }

    public state = {
        uri: '',
        animation: false,
        show: false
    }

    private imageNode: HTMLImageElement | null = null

    private controller: any

    private loading?: PreLoad

    public render(): JSX.Element {
        const { className, style, loadingIndicatorSource, onClick, controller } = this.props
        const { animation, uri, show } = this.state
        const opacity = uri || loadingIndicatorSource
        return (
            <Consumer>
                {
                    (val) => {
                        this.controller = controller || val.controller
                        return (
                            <img className={getClassName(`image${opacity ? '' : ' opacity'}${animation && !show ? ' an_fadeIn' : ''}${show ? ' show' : ''}`, className)} src={uri || loadingIndicatorSource || imgObj.src} onClick={onClick} ref={(e: HTMLImageElement) => { this.imageNode = e }} style={style} />
                        )
                    }
                }
            </Consumer>
        )
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IImageProps) {
        const { src } = this.props
        if (this.controller) {
            this.controller.removeEventListener('scroll', this.handleScroll)
            this.controller.addEventListener('scroll', this.handleScroll)
        }
        if (src !== nextProps.src) {
            if (this.loading) {
                this.loading.clearAsync()
            }
            this.loading = new PreLoad([nextProps.src])
            this.loading.completeLoad = this.completeURI.bind(this, nextProps.src)
            this.loading.success = this.handleSuccess.bind(this, nextProps.src, this.loading)
        } else {
            this.handleSuccess.bind(this, src)
            this.completeURI.bind(this, src)
        }
    }

    public componentDidMount() {
        this.controller = this.controller ? this.controller : window
        if (this.controller) {
            this.handleScroll()
            this.controller.addEventListener('scroll', this.handleScroll)
        }
    }

    public componentWillUnmount() {
        if (this.controller) {
            this.controller.removeEventListener('scroll', this.handleScroll)
        }
    }

    private completeURI(uri?: string | ArrayBuffer | null) {
        this.setState({
            uri,
            show: true
        })
    }

    private handleSuccess(url?: string | ArrayBuffer | null, loading?: PreLoad) {
        const { uri } = this.state
        if (uri && uri === url) {
            this.controller && this.controller.removeEventListener('scroll', this.handleScroll)
            return
        }
        this.setState({
            uri: url,
            animation: true
        })
        if (loading) {
            loading.clearAsync()
        }
        this.controller && this.controller.removeEventListener('scroll', this.handleScroll)
    }

    private handleScroll = () => {
        const { offsetBottom, src } = this.props
        const { animation } = this.state
        let top: number = 0
        if (this.controller) {
            top = (this.controller.scrollTop || 0) + browser.GL_SC_HEIGHT
        } else {
            top = (document.documentElement && document.documentElement.scrollTop || document.body.scrollTop) + browser.GL_SC_HEIGHT
        }
        if (!animation && this.imageNode && this.imageNode.offsetTop - (offsetBottom || 0) - top <= 0) {
            const loading = new PreLoad([src])
            loading.completeLoad = this.completeURI.bind(this, src)
            loading.success = this.handleSuccess.bind(this, src, loading)
        }
    }
}
