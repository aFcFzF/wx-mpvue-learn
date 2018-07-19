<template>
    <div class="masker">
        <div class="dialog" :class="editable ?　'editable' : ''">
            <div class="dialog-inner-mask" :class="editable ?　'editable' : ''"></div>
            <header class="header">手动更正<i class="close"/></header>
            <scroll-view class="lists" scroll-y :scroll-with-animation="true">
                <section class="list-item" v-for="(value, key) in infoList" :key="key">
                    <label class="list-item-wrap">
                        <span class="item-name">{{value.name}}</span>
                        <div type="text" class="item-value" >{{value.words}}</div>
                    </label>
                    <button class="edit-item" plain @click="editHdl(key, value.name, value.words)"/>
                </section>
                <section class="sir"></section>
            </scroll-view>
            <footer class="footer">
                <button class="btn ensure" plain @click="ensure">完成编辑</button>
                <div class="gradient"></div>
            </footer>
        </div>
        <ui-edit-box v-if="editable" :title="editName" :text="editWords" :ensure="ensureHdl" :cancel="cancelHdl"></ui-edit-box>
    </div>
</template>

<style lang="less">
    @import '~@/common/var.less';
    .masker {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 9;
        background: rgba(0, 0, 0, .7);
        display: flex;
        justify-content: center;
        align-items: center;
        .dialog {
            height: 90%;
            width: 90%;
            border-radius: 3px;
            font-size: 14px;
            color: #333;
            background: #fff;
            padding: 10px;
            box-sizing: border-box;
            &.editable {
                .dialog-inner-mask {
                    display: block;
                }
            }
            .dialog-inner-mask {
                position: absolute;
                top: 0;
                left: 0;
                background: rgba(0, 0, 0, .7);
                height: 100%;
                width: 100%;
                z-index: 1;
                display: none;
                line-height: 1.6;
                font-size: 14px;
            }
            .header {
                text-align: center;
                font-weight: bold;
                margin-bottom: 10px;
                font-size: 16px;
            }
            .lists {
                height: 85%;
                box-sizing: border-box;
                .list-item {
                    padding: 10px;
                    border-bottom: solid 1px #eee;
                    display: flex;
                    &:nth-last-child(2) {
                        border-bottom: none;
                    }
                    .list-item-wrap {
                        flex-grow: 1;
                        .item-name {
                            font-weight: bold;
                        }
                        .item-value {
                            width: auto;
                            margin-top: 10px;
                            color: #000;
                        }
                    }
                    
                    .edit-item {
                         @edit: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMxOTA4NDAxMTI1IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwNDMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTA3LjQyODU3MSA2NzYuNTcxNDI5bDY2LjI4NTcxNC02Ni4yODU3MTQtODYuODU3MTQzLTg2Ljg1NzE0My02Ni4yODU3MTQgNjYuMjg1NzE0IDAgMzIgNTQuODU3MTQzIDAgMCA1NC44NTcxNDMgMzIgMHptMjUxLjQyODU3MS00MTEuNDI4NTcxcS05LjE0Mjg1Ny05LjE0Mjg1Ny0xOC44NTcxNDMgMC41NzE0MjlsLTIwMCAyMDBxLTkuNzE0Mjg2IDkuNzE0Mjg2LTAuNTcxNDI5IDE4Ljg1NzE0M3QxOC44NTcxNDMtMC41NzE0MjlsMjAwLTIwMHE5LjcxNDI4Ni05LjcxNDI4NiAwLjU3MTQyOS0xOC44NTcxNDN6bTQ1LjcxNDI4NiAzMzkuNDI4NTcxbDAgMTA4LjU3MTQyOXEwIDY4LTQ4LjI4NTcxNCAxMTYuMjg1NzE0dC0xMTYuMjg1NzE0IDQ4LjI4NTcxNGwtNDc1LjQyODU3MSAwcS02OCAwLTExNi4yODU3MTQtNDguMjg1NzE0dC00OC4yODU3MTQtMTE2LjI4NTcxNGwwLTQ3NS40Mjg1NzFxMC02OCA0OC4yODU3MTQtMTE2LjI4NTcxNHQxMTYuMjg1NzE0LTQ4LjI4NTcxNGw0NzUuNDI4NTcxIDBxMzYgMCA2Ni44NTcxNDMgMTQuMjg1NzE0IDguNTcxNDI5IDQgMTAuMjg1NzE0IDEzLjE0Mjg1NyAxLjcxNDI4NiA5LjcxNDI4Ni01LjE0Mjg1NyAxNi41NzE0MjlsLTI4IDI4cS04IDgtMTguMjg1NzE0IDQuNTcxNDI5LTEzLjE0Mjg1Ny0zLjQyODU3MS0yNS43MTQyODYtMy40Mjg1NzFsLTQ3NS40Mjg1NzEgMHEtMzcuNzE0Mjg2IDAtNjQuNTcxNDI5IDI2Ljg1NzE0M3QtMjYuODU3MTQzIDY0LjU3MTQyOWwwIDQ3NS40Mjg1NzFxMCAzNy43MTQyODYgMjYuODU3MTQzIDY0LjU3MTQyOXQ2NC41NzE0MjkgMjYuODU3MTQzbDQ3NS40Mjg1NzEgMHEzNy43MTQyODYgMCA2NC41NzE0MjktMjYuODU3MTQzdDI2Ljg1NzE0My02NC41NzE0MjlsMC03MnEwLTcuNDI4NTcxIDUuMTQyODU3LTEyLjU3MTQyOWwzNi41NzE0MjktMzYuNTcxNDI5cTguNTcxNDI5LTguNTcxNDI5IDIwLTR0MTEuNDI4NTcxIDE2LjU3MTQyOXptLTU0Ljg1NzE0My00MjEuNzE0Mjg2bDE2NC41NzE0MjkgMTY0LjU3MTQyOS0zODQgMzg0LTE2NC41NzE0MjkgMCAwLTE2NC41NzE0Mjl6bTI1My43MTQyODYgNzUuNDI4NTcxbC01Mi41NzE0MjkgNTIuNTcxNDI5LTE2NC41NzE0MjktMTY0LjU3MTQyOSA1Mi41NzE0MjktNTIuNTcxNDI5cTE2LTE2IDM4Ljg1NzE0My0xNnQzOC44NTcxNDMgMTZsODYuODU3MTQzIDg2Ljg1NzE0M3ExNiAxNiAxNiAzOC44NTcxNDN0LTE2IDM4Ljg1NzE0M3oiIHAtaWQ9IjEwNDQiIGZpbGw9IiMwMDAwMDAiPjwvcGF0aD48L3N2Zz4=';
                         background: no-repeat center;
                         background-image: url(@edit);
                         background-size: contain;
                         width: 20px;
                         margin-left: 8px;
                         flex-shrink: 0;
                         border: none;
                         opacity: .8;
                         &.button-hover {
                             background-color: #eee;
                         }
                    }
                }
                .sir {
                    height: 30px;
                }
            }
            .footer {
                position: relative;
                display: flex;
                justify-content: center;
                padding: 10px;
                .gradient {
                    position: absolute;
                    top: -28px;
                    height:　30px;
                    width: 100%;
                    background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,0) 1%,rgba(255,255,255,1) 35%,rgba(255,255,255,1) 99%)
                }
                .btn {
                    font-size: 15px;
                    border: none;
                    padding: 0 25px;
                    &.cancel {
                        border: solid 1px #ccc;
                    }
                    &.ensure {
                        .color-primary-btn();
                        color: white;
                    }
                }
            }
        }   
    }
</style>
    
<script>

import EditBox from './editBox'

const noop = () => {}

export default {
    data () {
        return {
            editable: false,
            editKey: '',
            editName: '',
            editWords: ''
        }
    },

    methods: {
        editHdl (key, name, words) {
            const editable = this.editable
            this.editable = !editable
            this.editKey = key
            this.editName = name
            this.editWords = words
        },

        ensureHdl (name, words) {
            console.log('改成了： ', this.editKey, name, words)
            this.infoList[this.editKey].words = words
            console.log('列表信息： ', this.infoList)
            this.editable = false
        },

        cancelHdl () {
            this.editable = false
        }
    },

    components: {
        'ui-edit-box': EditBox
    },

    props: {
        infoList: {
            type: Object,
            default: {}
        },

        ensure: {
            type: Function,
            default: noop
        },

        cancel: {
            type: Function,
            default: noop
        }
    }
}
</script>


