import * as React from 'react'
import { isFunction } from 'muka'
import { getClassName } from '../utils'

export interface IFlatListProps {
    className?: string
    style?: React.CSSProperties
    data: any[]
    EmptyShowHeader?: boolean
    renderItem: (data?: any, index?: number) => JSX.Element
    ListEmptyComponent?: JSX.Element
    ListHeaderComponent?: JSX.Element
    height?: number | string
}

export default class FlatList extends React.Component<IFlatListProps, any> {

    public static defaultProps = {
        data: [],
        EmptyShowHeader: true
    }

    public state = {
        status: false
    }

    // private view: JSX.Element = <div/>

    // private controller: JSX.Element | null = null

    public render() {
        const { className, style, height } = this.props
        const styles: React.CSSProperties = {}
        if (style) {
            style.height = height
        } else {
            styles.height = height
        }
        return (
            <div
                className={getClassName('flat_list', className)}
                style={style || styles}
            >
                <div
                    className={getClassName('flat_list_controller')}
                >
                    {this.getHeader()}
                </div>
                {this.getChildren()}
            </div>
        )
    }

    public UNSAFE_componentWillReceiveProps() {
        this.setState({
            status: true
        })
    }

    public componentDidMount() {
        // this.view.addEventListener('scroll', this.monitorCall)
    }

    // private monitorCall = () => {
    //     // console.log(this.view.clientHeight)
    //     // console.log(this.view.scrollTop, this.controller.scrollHeight)
    // }

    private getHeader(): JSX.Element | undefined {
        const { data, EmptyShowHeader, ListHeaderComponent } = this.props
        if (data.length) {
            return ListHeaderComponent
        }
        if (EmptyShowHeader) {
            return ListHeaderComponent
        }
        return undefined
    }

    private getChildren(): JSX.Element[] | JSX.Element | undefined {
        const { data, renderItem, ListEmptyComponent } = this.props
        const { status } = this.state
        if (data.length) {
            return data.map((item: any, index: number) => {
                if (isFunction(renderItem)) {
                    return renderItem(item, index)
                }
                return <div key={index} />
            })
        }
        if (status) {
            return ListEmptyComponent
        }
        return undefined
    }
}
