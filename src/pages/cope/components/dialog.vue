<template>
    <div class="masker">
        <div class="dialog" :class="editable ?　'editable' : ''">
            <div class="dialog-inner-mask" :class="editable ?　'editable' : ''"></div>
            <header class="header">手动更正<i class="close"/></header>
                <ui-list :scrollable="true" :list="infoList.checkresult" :editHdl="editHdl" editable="true"/>
            <footer class="footer">
                <button class="btn ensure" plain @click="finishedHdl">完成编辑</button>
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
import List from '@/components/list'
import {fetch} from '@/utils/index'
import config from '@/utils/config'

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
            this.infoList.checkresult[this.editKey].words = words
            this.editable = false
        },

        cancelHdl () {
            this.editable = false
        },

        finishedHdl () {
            wx.showLoading({
                title: '保存编辑...',
                mask: true
            })
            const url = config.domain.getDomain() + '/finishEditAjax'
            const callbackkey = this.infoList.callbackkey
            const checkresult = this.infoList.checkresult
            fetch(url, {callbackkey, checkresult: JSON.stringify(checkresult)}).then(data => {
                if (!data) return wx.hideLoading()
                wx.hideLoading()
                this.ensure()
            })
        }
    },
    components: {
        'ui-edit-box': EditBox,
        'ui-list': List
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


