<template>
    <div :class="{
                'edit-box': true,
                'editable': editable
            }"
        >
            <header class="edit-box-header">{{name}}</header>
            <article class="edit-box-content">
                <textarea class="area" v-model="words" auto-focus adjust-position auto-height/>
            </article>
            <footer class="edit-box-footer">
                <button class="btn cancel" plain @click="cancelHdl">取消</button>
                <button class="btn ensure" plain @click="ensureHdl">确认</button>
            </footer>
        </div>
</template>

<style lang="less">
    @import '~@/common/var.less';
    .edit-box {
        position: absolute;
        top: 30px;
        width: 90%;
        left: 50%;
        transform: translate(-50%, -120%);
        border-radius: 3;
        background: #fff;
        border-radius: 3px;
        z-index: 2;
        transition: transform .4s;
        overflow: hidden;

        &.editable {
            transform: translate(-50%, 0);
        }

        &-header {
            font-size: 16px;
            font-weight: bold;
            padding:10px;
            background: #f1f1f1;
        }

        &-content {
            padding: 10px;
            box-sizing: border-box;
            margin: 10px;
            border: solid 1px #eee;
            .area {
                width: 100%;
                font-size: 16px;
                line-height: 1.6;
            }
        }

        &-footer {
            display: flex;
            justify-content: space-around;
            padding: 10px;
            .btn {
                font-size: 14px;
                border: none;
                padding: 0 25px;
                &.cancel {
                    .color-plain-btn();
                }
                &.ensure {
                    .color-primary-btn();
                    color: white;
                }
            }
        }
    }
</style>

<script>
const noop = () => {}

export default {
    data () {
        return {
            editable: false,
            name: this.title,
            words: this.text
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },

        title: {
            type: String,
            default: ''
        },

        text: {
            type: String,
            default: ''
        },

        ensure: {
            type: Function,
            default: noop
        },

        cancel: {
            type: Function,
            default: noop
        }
    },
    mounted () {
        setTimeout(() => (this.editable = true), 100)
    },
    methods: {
        ensureHdl () {
            this.ensure(this.name, this.words)
        },

        cancelHdl () {
            this.editable = false
            this.cancel()
        }
    }
}
</script>


