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
    .section {
        position: absolute;
        border-style: solid;
        z-index: 1;
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
                }
            }
        },

        props: {
            setting: {
                type: Object,
                default () {
                    return {
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
                    x: this.rectX,
                    y: this.rectY,
                    width: this.dotData.oldWdt,
                    height: this.dotData.oldHgt
                }

                this.$emit('change', posInfo)
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
            }
        },

        mounted () {
            this.drag.x = this.setting.left
            this.drag.y = this.setting.top
            this.drag.width = this.setting.width
            this.drag.height = this.setting.height
        }
    }
</script>

