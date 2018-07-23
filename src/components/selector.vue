<template>
    <div
        class="section"
        :style="{
            'border-style' : hovering ? 'dashed' : 'solid',
            'background-color': hovering ? 'none' : 'rgba(45,120,244, .3)',
            left: drag.x + 'px',
            top: drag.y + 'px',
            width: drag.width + 'px',
            height: drag.height + 'px',
            'border-color': color,
        }"
        @touchstart.stop="ts"
        @touchmove.stop="tm"
        @touchend.stop="te"
    >
    <div class="drag-loading" :class="loadingClass" />
    <span
        class="drag-dot"
        @touchstart.stop="_dotts"
        @touchmove.stop="_dottm"
        @touchend.stop="_dotte"
        :style="{
            'background-color': color,
        }"
    ></span>
    </div>
</template>
<style scoped lang="less">
    @import '~@/common/var.less';
    .section {
        position: absolute;
        border-style: solid;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        .drag-loading {
            position: absolute;
            height: 100%;
            left: 0;
            width: 0;
            background: rgba(255, 255, 255, .5);
            transition: width .3s;
            &.state-1 {
                left: 0;
                right: unset;
                width: 100%;
            }
            &.state-2 {
                left: unset;
                right: 0;
            }
            &.state-3 {
                left: unset;
                right: 0;
                width: 0;
            }
        }
        .drag-dot {
            position: absolute;
            bottom: -6px;
            right: -6px;
            width: 12px;
            height: 12px;
            z-index: 1;
        }
    }
</style>
<script>
    import config from '@/utils/config'
    import {fetch} from '@/utils/index'

    export default {

        name: 'Selection',

        data () {
            return {
                startX: 0,
                startY: 0,
                rectX: 0,
                rectY: 0,
                hovering: false,
                drag: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                },
                dotData: {
                    startX: 0,
                    startY: 0,
                    oldWdt: 0,
                    oldHgt: 0
                },
                loadingClass: '',
                play: true
            }
        },

        props: {
            setting: {
                type: Object,
                default () {
                    return {
                        callbackkey: '没传来callbackkey',
                        itemkey: '默认id',
                        width: 20,
                        height: 20,
                        left: 0,
                        top: 0
                    }
                }
            },
            color: {
                type: String,
                default: '#2d78f4'
            }
        },

        methods: {
            updatePos () {
                const posInfo = {
                    itemkey: this.setting.itemkey,
                    left: this.rectX,
                    top: this.rectY,
                    width: this.dotData.oldWdt,
                    height: this.dotData.oldHgt
                }
                this.aniLoading()
                wx.showLoading({
                    title: '识别中...',
                    mask: true
                })
                const {callbackkey, itemkey, scaleRatio} = this.setting
                const r = scaleRatio
                const {left, top, width, height} = posInfo
                const url = config.domain.getDomain() + '/dragModifyAjax'
                const pos = JSON.stringify({
                    top: Math.round(r < 0 ? top / r : top * r),
                    left: Math.round(r < 0 ? left / r : left * r),
                    width: Math.round(r < 0 ? width / r : width * r),
                    height: Math.round(r < 0 ? height / r : height * r)
                })
                fetch(url, {callbackkey, itemkey, itemlocation: pos})
                .then(data => {
                    if (!data) return null
                    data.itemkey = itemkey
                    this.$emit('dragEnd', data)
                })
                .then(() => {
                    wx.hideLoading()
                    this.play = false
                })
            },
            ts (e) {
                if (e.touches.length > 1) return
                this.startX = Math.round(e.clientX)
                this.startY = Math.round(e.clientY)
                this.hovering = true
            },
            tm (e) {
                const drag = this.drag
                const {rectX, rectY} = this

                const xMove = Math.round(e.clientX - this.startX)
                const yMove = Math.round(e.clientY - this.startY)

                drag.x = Math.round(rectX + xMove)
                drag.y = Math.round(rectY + yMove)
            },
            te (e) {
                this.rectX = this.drag.x
                this.rectY = this.drag.y
                this.hovering = false
                this.updatePos()
            },

            // dot时间处理
            _dotts (e) {
                if (e.touches.length > 1) return
                const dotData = this.dotData
                const {width, height} = this.drag
                dotData.startX = Math.round(e.clientX)
                dotData.startY = Math.round(e.clientY)

                dotData.oldWdt = width
                dotData.oldHgt = height

                this.hovering = true
            },
            _dottm (e) {
                const {drag, dotData} = this
                const xMove = Math.round(e.clientX - dotData.startX)
                const yMove = Math.round(e.clientY - dotData.startY)

                drag.width = Math.round(dotData.oldWdt + xMove)
                drag.height = Math.round(dotData.oldHgt + yMove)
            },
            _dotte () {
                const {drag, dotData} = this
                dotData.oldWdt = drag.width
                dotData.oldHgt = drag.height
                this.hovering = false
                this.updatePos()
            },
            aniLoading () {
                const setAni = (ms, className) =>
                    Reflect.construct(Promise, [(res, rej) => {
                        this.loadingClass = className
                        setTimeout(res, ms)
                    }])
                const self = this
                async function run () {
                    await setAni(300, 'state-1')
                    await setAni(0, 'state-2')
                    await setAni(300, 'state-3')
                }
                self.play = true
                const runLoop = () => {
                    if (!self.play) return false
                    run().then(runLoop)
                }
                runLoop()
            }
        },
        watch: {
            setting (n, o) {
                n.left !== o.left && (this.rectX = this.drag.x = n.left)
                n.top !== o.top && (this.rectY = this.drag.y = n.top)
                n.width !== o.width && (this.drag.width = this.dotData.oldWdt = n.width)
                n.height !== o.height && (this.drag.height = this.dotData.oldHgt = n.height)
            }
        },
        mounted () {
            this.rectX = this.drag.x = this.setting.left
            this.rectY = this.drag.y = this.setting.top
            this.drag.width = this.dotData.oldWdt = this.setting.width
            this.drag.height = this.dotData.oldHgt = this.setting.height
        }
    }
</script>

