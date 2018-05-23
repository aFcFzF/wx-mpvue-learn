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
    >
    <span
        class="drag-dot"
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
        }
    }
</style>
<script>
    export default {

        name: 'Selection',

        data () {
            return {

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
        }
    }
</script>

