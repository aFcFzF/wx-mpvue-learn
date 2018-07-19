/**
 * @file: reco.js 选择页的交互
 * @author: afcfzf
 */
/*eslint-disable*/
const TOUCH_STATE = ['touchstarted', 'touchmoved', 'touchended']

export default class {

    /**
     * 构造函数
     * @param option 放了参数
    */
    constructor (option) {

        this.option = option
        this.oldScale = 1
        this.rectX = 0
        this.rectY = 0
        this.touchX0 = 0
        this.touchY0 = 0
        this.imgLeft = 0
        this.imgTop = 0
        this.zoom = 0

        this.baseWidth = 0 // cut的屏宽
        this.baseHeight = 0

        this.scaleWidth = 0
        this.scaleHeight = 0
        this.newScale = 1

        Object.assign(this, option)

        this.baseWidth = option.cut.width
        this.baseHeight = option.cut.height
    }

    /**
     * 设置触控标志位，如果两只手指有一个离开了，则会停止计算
    */
    setTouchState (instance, ...arg) {
        TOUCH_STATE.forEach((key, i) => {
            if (arg[i] !== undefined) {
                instance[key] = arg[i]
            }
        })
    }

    /**
     * 判断是否是函数
    */
    isFunction (obj) {
        return typeof obj === 'function'
    }

    /**
     * 检测是否移动到边界
     * @param imgLeft 图片左上角横坐标值
     * @param imgTop 图片左上角纵坐标值
     * @inner
    */
    outsideBound (imgLeft, imgTop) {
        const {x, y, width, height, suitWidth, suitHeight} = this.option.cut
        const {newScale} = this

        const boundTop = Math.round(y / newScale)
        const boundLeft = Math.round(x / newScale)
        const boundRight = Math.round((x + width - suitWidth * newScale) / newScale) // cut区域宽度 - 图片宽度
        const boundBottom = Math.round((y + height - suitHeight * newScale) / newScale)

        this.imgLeft = imgLeft >= boundLeft ? boundLeft : imgLeft >= boundRight ? imgLeft : boundRight
        this.imgTop = imgTop >= boundTop ? boundTop : imgTop >= boundBottom ? imgTop : boundBottom
    }

    /**
     * 看起来是获取新的放大缩小倍数
    */
    getNewScale (oldScale, oldDistance, zoom, touch0, touch1) {
        let xMove, yMove, newDistance
        // 计算二指最新距离
        xMove = Math.round(touch1.clientX - touch0.clientX)
        yMove = Math.round(touch1.clientY - touch0.clientY)
        newDistance = Math.round(Math.sqrt(xMove * xMove + yMove * yMove))

        return oldScale + 0.001 * zoom * (newDistance - oldDistance)
    }

    // 图片手势初始监测
    touchStart (e) {
        const [touch0, touch1] = e.touches

        this.setTouchState(this, true, null, null)

        // 计算第一个触摸点的位置，并参照改点进行缩放
        this._oneTouchStart(touch0)

        // 两指手势触发
        if (e.touches.length >= 2) {
            this._twoTouchStart(touch0, touch1)
        }
    }

    // 图片手势动态缩放
    touchMove (e) {
        const [touch0, touch1] = e.touches
        this.setTouchState(this, null, true)
        // 单指手势时触发
        if (e.touches.length === 1) {
            this._oneTouchMove(touch0)
        }
        // 两指手势触发
        if (e.touches.length >= 2) {
            this._twoTouchMove(touch0, touch1)
        }
    }

    touchEnd (e) {
        this.setTouchState(this, false, false, true)
        this._xtouchEnd()
    }

    _oneTouchStart (touch) {
        this.touchX0 = Math.round(touch.clientX)
        this.touchY0 = Math.round(touch.clientY)
    }

    _oneTouchMove (touch) {
        let xMove, yMove
        // 计算单指移动的距离
        if (this.touchended) {
            return this.updateGraph()
        }
        xMove = Math.round(touch.clientX - this.touchX0)
        yMove = Math.round(touch.clientY - this.touchY0)

        const imgLeft = Math.round(this.rectX + xMove)
        const imgTop = Math.round(this.rectY + yMove)

        this.outsideBound(imgLeft, imgTop)
        this.updateGraph()
    }

    _twoTouchStart (touch0, touch1) {
        let xMove, yMove, oldDistance

        this.touchX1 = Math.round(this.rectX + this.scaleWidth / 2)
        this.touchY1 = Math.round(this.rectY + this.scaleHeight / 2)

        // 计算两指距离
        xMove = Math.round(touch1.clientX - touch0.clientX)
        yMove = Math.round(touch1.clientY - touch0.clientY)
        oldDistance = Math.round(Math.sqrt(xMove * xMove + yMove * yMove))

        this.oldDistance = oldDistance
    }

    _twoTouchMove (touch0, touch1) {

        const { oldScale, oldDistance, scale, zoom } = this

        this.newScale = this.getNewScale(oldScale, oldDistance, zoom, touch0, touch1)

        //  设定缩放范围
        this.newScale <= 1 && (this.newScale = 1)
        this.newScale >= scale && (this.newScale = scale)

        this.scaleWidth = Math.round(this.newScale * this.baseWidth)
        this.scaleHeight = Math.round(this.newScale * this.baseHeight)
        const imgLeft = Math.round(this.touchX1 - this.scaleWidth / 2)
        const imgTop = Math.round(this.touchY1 - this.scaleHeight / 2)

        this.outsideBound(imgLeft, imgTop)

        this.updateGraph()
    }

    _xtouchEnd () {
        this.oldScale = this.newScale
        this.rectX = this.imgLeft
        this.rectY = this.imgTop
    }

    updateGraph () {
        // console.log('缩放大小： ', this.newScale)
        this.option.imgLeft = this.imgLeft
        this.option.imgTop = this.imgTop
        this.option.newScale = this.newScale
        // this.ondrag(this.imgLeft, this.imgTop, this.newScale)
        // console.log('我是目标', this.imgLeft, this.imgTop, this.scaleWidth, this.scaleHeight)
    }

    setImgSrc (src) {
        const self = this
        this.imgSrc = src

        let suitWidth = 0
        let suitHeight = 0
        let imgLeft = 0
        let imgTop = 0

        const {x, y, width, height} = self.cut

        this.isFunction(this.onBeforeImageLoad) && this.onBeforeImageLoad(this.ctx, this)

        wx.getImageInfo({
            src,
            success (res) {
                // console.log('图像信息： ', res)
                let innerAspectRadio = res.width / res.height
                self.option.imgSrc = res.path
                // 原始图像高宽比率，如果高大于宽，则宽是宽，高乘以比率
                if (innerAspectRadio < width / height) {
                    imgLeft = x
                    suitWidth = width
                    suitHeight = width / innerAspectRadio
                    imgTop = y - Math.abs((height - suitHeight) / 2)
                } else {
                    imgTop = y
                    suitWidth = height * innerAspectRadio
                    suitHeight = height
                    imgLeft = x - Math.abs((width - suitWidth) / 2)
                }

                self.rectX = self.imgLeft = imgLeft
                self.rectY = self.imgTop = imgTop

                self.option.cut.suitWidth = suitWidth
                self.option.cut.suitHeight = suitHeight

                self.option.cut.scaleRatio = res.width / suitWidth

                self.updateGraph()

                self.isFunction(self.onImageLoad) && self.onImageLoad(self.ctx, self)

            }
        })
    }
}
