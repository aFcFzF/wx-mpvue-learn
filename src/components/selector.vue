<template>
    <div
        class="section"
        :style="{
            left: setting.left + 'px',
            top: setting.top + 'px',
            width: setting.width + 'px',
            height: setting.height + 'px',
            'border-color': color,
        }"
        @touchstart.stop="ts"
        @touchmove.stop="tm"
        @touchend.stop="te"
    >
    <span
        class="drag-dot"
        @touchstart.stop="_dotts"
        @touchmove.stop="_dottm"
        @touchend.capture.stop="_dotte"
        :style="{
            'background-color': color,
        }"
    ></span>
    </div>
</template>
<style scoped lang="less">
    .section {
        position: absolute;
        border-style: solid;
        .drag-dot {
            position: absolute;
            bottom: -5px;
            right: -5px;
            width: 10px;
            height: 10px;
            z-index: 1;
        }
    }
</style>
<script>
    export default {

        name: 'Selection',

        data () {
            return {
                startX: 0,
                startY: 0,
                rectX: 0,
                rectY: 0
            }
        },

        props: {
            setting: {
                type: Object,
                default: {
                    width: 20,
                    height: 20,
                    left: 0,
                    top: 0
                }
            },
            color: {
                type: String,
                default: '#2d78f4'
            }
        },

        methods: {
            ts (e) {
                if (e.touches.length > 1) return
                this.startX = Math.round(e.clientX)
                this.startY = Math.round(e.clientY)
            },
            tm (e) {
                const setting = this.setting
                const {rectX, rectY} = this

                const xMove = Math.round(e.clientX - this.startX)
                const yMove = Math.round(e.clientY - this.startY)

                setting.left = Math.round(rectX + xMove)
                setting.top = Math.round(rectY + yMove)
            },
            te (e) {
                this.rectX = this.setting.left
                this.rectY = this.setting.top
            },

            // dot时间处理
            _dotts (e) {
                wx.showToast({
                    title: '我今尚在'
                })
            },
            _dottm () {

            },
            _dotte () {

            }
        }
    }
</script>

