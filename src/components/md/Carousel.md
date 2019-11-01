#### 组件 Carousel

参数 | 类型 |  必须  | 默认值 | 说明
-|-|-|-|-
className | `string` | 否 | | 最外层样式
dotPosition | `top`  `bottom`  `left`  `right` | 否 | `bottom` | 指示器位置
dotClassName | `string` | 否 | | 指示器样式
dotType | `rectangle` `circular`| 否 | | 指示器显示样式
dots | `boolean` | 否 | `true`| 显示指示器
dotColor | `string` | 否 | | 指示器颜色
autoPlay | `boolean` | 否 | `false`|自动播放 
defaultSelected | `number`| 否| | 默认显示
style | `CSSProperties` | 否 | |css样式
time | `number`| 否 | `2000` | 自动播放等待时间
onChnage | `(selected: number) => void` | 否| | 选中触发事件
effect | `scrollx` `scrolly` `fade` | 否 | `scrollx`| 滚动方式

**轮播组件宽度默认是100% 匹配手机端的 如果要限制宽度需要自行样式覆盖**

###### 示列
```javascript
    import { Carousel } from 'muka-react'

    const handleChange = (selected) => {
        console.log(selected)
    }

    <Carousel
        className="demo"
        dotPosition="top"
        dotClassName="demoDot"
        dots
        autoplay
        defaultSelected={2}
        style={{height: 200}}
        time={3000}
        onChnage={handleChange}
        effect="scrolly"
    >
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
    </Carousel>
```
