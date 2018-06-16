<template>
    <div>
        <!--这是四个限制限制轴-->
        <span class="axis axis-1 left top"
            :style="{
                top,
                left,
            }"
        />
        <span class="axis axis-2 right top"
            :style="{
                top,
                right,
            }"
        />
        <span class="axis axis-3 right bottom"
            :style="{
                bottom,
                right,
            }"
        />
        <span class="axis axis-4 left bottom"
            :style="{
                bottom,
                left,
            }"
        />
    </div>
</template>

<style lang="less">
    .axis {
        position: absolute;
        width: 10px;
        height: 10px;
        border:solid 3px;
        z-index: 9;
        &-1 {
            border-color: #fff transparent transparent #fff;
        }
        &-2 {
            border-color: #fff #fff transparent transparent;
        }
        &-3 {
            border-color: transparent #fff #fff transparent;
        }
        &-4 {
            border-color: transparent transparent #fff #fff;
        }
    }
</style>

<script>
    /**
     * 裁剪坐标
    */
    export default {
        data () {
            return {
                top: this.toRpx(this.option.top),
                left: this.toRpx(this.option.left),
                right: this.toRpx(this.option.right),
                bottom: this.toRpx(this.option.bottom),
                styAxis1: {
                    top: this.toRpx(this.option.top),
                    left: this.toRpx(this.option.left)
                }
            }
        },
        props: {
            option: {
                type: Object,
                default: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    rpxRate: 0,
                    offsetPx: 3
                }
            }
        },

        methods: {
            toRpx (px) {
                return this.option.rpxRate * (px - this.option.offsetPx) + 'rpx'
            }
        }
    }
</script>
