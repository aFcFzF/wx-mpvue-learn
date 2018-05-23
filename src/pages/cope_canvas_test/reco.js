/**
 * @file: touch.js
 * @author: afcfzf
 */

const TOUCH_STATE = ['touchstarted', 'touchmoved', 'touchended']

function firstLetterUpper (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export default class {

    /**
     * 构造函数
     * @param options 放了参数
    */
    constructor (options) {
        this.oldScale = 1
        this.rectX = 0
        this.rectY = 0
        this.touchX0 = 0
        this.touchY0 = 0
        this.imgLeft = 0
        this.imgTop = 0
        this.scaleWidth = 0
        this.scaleHeight = 0

        // this.ctx = wx.createCanvasContext(options.id)

        Object.assign(this, options)
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
     * 看起来是获取新的放大缩小倍数
    */
    getNewScale (oldScale, oldDistance, zoom, touch0, touch1) {
        let xMove, yMove, newDistance
        // 计算二指最新距离
        xMove = Math.round(touch1.clientX - touch0.x)
        yMove = Math.round(touch1.y - touch0.y)
        newDistance = Math.round(Math.sqrt(xMove * xMove + yMove * yMove))

        return oldScale + 0.001 * zoom * (newDistance - oldDistance)
    }

    // 图片手势初始监测
    touchStart (e) {
        console.log(e)
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
        // this.outsideBound(imgLeft, imgTop)
        this.updateGraph()
    }

    _twoTouchStart (touch0, touch1) {
        let xMove, yMove, oldDistance

        this.touchX1 = Math.round(this.rectX + this.scaleWidth / 2)
        this.touchY1 = Math.round(this.rectY + this.scaleHeight / 2)

        // 计算两指距离
        xMove = Math.round(touch1.x - touch0.x)
        yMove = Math.round(touch1.y - touch0.y)
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

        // this.outsideBound(imgLeft, imgTop)

        this.updateGraph()
    }

    _xtouchEnd () {
        this.oldScale = this.newScale
        this.rectX = this.imgLeft
        this.rectY = this.imgTop
    }

    updateGraph () {
        console.log('我是目标', this.imgLeft, this.imgTop, this.scaleWidth, this.scaleHeight)
    }

    setImgSrc (src) {
        const self = this
        this.imgSrc = src

        const {x, y, width, height} = self.cut
        this.isFunction(this.onBeforeImageLoad) && this.onBeforeImageLoad(this.ctx, this)

        wx.getImageInfo({
            src,
            success (res) {
                let innerAspectRadio = res.width / res.height
                self.target = res.path

                if (innerAspectRadio < width / height) {
                    self.rectX = x
                    self.baseWidth = width
                    self.baseHeight = width / innerAspectRadio
                    self.rectY = y - Math.abs((height - self.baseHeight) / 2)
                } else {
                    self.rectY = y
                    self.baseWidth = height * innerAspectRadio
                    self.baseHeight = height
                    self.rectX = x - Math.abs((width - self.baseWidth) / 2)
                }

                self.imgLeft = self.rectX
                self.imgTop = self.rectY
                self.scaleWidth = self.baseWidth
                self.scaleHeight = self.baseHeight

                self.updateGraph()

                self.isFunction(self.onImageLoad) && self.onImageLoad(self.ctx, self)

            }
        })
    }

}
