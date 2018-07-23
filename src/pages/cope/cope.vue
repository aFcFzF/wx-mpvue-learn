<template>
    <div class="cope-page">
        <div class="lice-box"
            :style="{
                width: option.width + 'px',
                height: option.height + 'px',
            }"
        >

            <!--这是四个遮罩-->
            <div class="lice-shade top"></div>
            <div class="lice-shade right"></div>
            <div class="lice-shade left"></div>
            <div class="lice-shade bottom" :class="expand &&　'has-expanded'">
                <scroll-view
                    data-name="info-section"
                    class="lice-info-layer"
                    v-if="expand"
                    scroll-y
                    scroll-with-animation
                >
                    <div class="info-item" data-name="info-item" v-for="(value, key) in checkresult" :key="key">{{value.name + ': ' + value.words}}</div>   
                </scroll-view>
                <div :class="{
                        'single-info-item': true,
                        'has-text': !!liceText
                    }"
                    v-else
                >{{liceText}}</div>
                <div class="edit-info" v-if="expand" @click="edtiHdl">识别有问题？去校正<i class="edit-btn"/></div>
                <div class="expande-switch-btn" @click.stop="expandSwitchHdl" :class="expand ? 'expanded' : ''"></div>
            </div>

            <div
            class="lice-cut"
            :style="{
                width: option.cut.suitWidth + 'px',
                height: option.cut.suitHeight + 'px',
                transform: transformer,
                '-webkit-transform': transformer,
                background: 'rgba(0, 0, 0, .8)',
                transformOrigin: 'left top'
            }"
            @touchstart.stop="ts"
            @touchmove.stop="tm"
            @touchend.stop="te"
            >
                <div
                class="selection-layer"
                :style="{
                    width: option.cut.suitWidth + 'px',
                    height: option.cut.suitHeight + 'px'
                }"
                >
                    <info-selector @dragEnd="dragEnd" v-for="(value, key) in checkresult" :setting="formatSetting(key, value, index)" :key="key"></info-selector>
                </div>

                <image class="img"
                :disable-scroll="true"
                :src="option.imgSrc"
                ></image>
            </div>

        </div>

        <div class="c-tool">
          <button @click.prevent="loadLice" class="icon-btn reload" plain >重拍</button>
          <button @click="submitHdl" plain class="icon-btn submit" >提交</button>
        </div>
        <ui-dialog v-if="showDlg" :infoList="{checkresult, callbackkey}" :ensure="dlgEnsureHdl"></ui-dialog>
    </div>
</template>

<style lang="less" scoped>
    @import '~@/common/var.less';
    .cope-page {
        display: flex;
        flex-flow: column nowrap;
        height: 100%;
        justify-content: center;
        background: #f2f2f2;
        .lice-box {
            justify-content: center;
            align-items: center;
            overflow: hidden;
            margin: 10px;
            margin-bottom: 30px;
            position: relative;
            box-sizing: border-box;
            border-radius: 3px;
            overflow: hidden;
            border: solid 1px #000;
            box-shadow: 0 0 10px rgba(87, 87, 87, 0.842);

            .selection-layer {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 9;
            }

            .lice-shade {
                position: absolute;
                background-color:rgba(0, 0, 0, .75);
                z-index: 8;
                &.top {
                    top: 0;
                    left: 15px;
                    height: 15px;
                    right: 15px; /*微信bug，就少那么0.5像素*/
                }
                &.left {
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 15px;
                }
                &.right {
                    right: 0;
                    top: 0;
                    height: 100%;
                    width: 15px;
                }
                &.bottom {
                    bottom: 0;
                    left: 15px;
                    right: 15px; /*微信bug，就少那么0.5像素*/
                    padding: 26px 20px;
                    padding-bottom: 0;
                    &.has-expanded {
                        padding-bottom: 35px;
                    }
                }
            }

            .lice-cut {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1;
                font-size: 0;
                width: 100%;
                height: 100%;
                .img {
                    height: 100%;
                    width: 100%;
                }
            }

            .lice-info-layer {
                height: 100px;
                line-height: 1.6;
                z-index: 99;
                width: 100%;
                color: #fff;
                font-size:12px;
                .most-item {
                    height: 100px;
                    line-height: 1.6;
                }
            }

            .edit-info {
                position: absolute;
                right: 10px;
                bottom: 5px;
                font-size: 12px;
                color: white;
                .edit-btn {
                    display: inline-block;
                    vertical-align: middle;
                    @edit: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMxODM1OTE0OTQ1IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExMDkzIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTc3MC4yMDQgNzIwLjExNGMwIDc5LjU0NC02NC41MzUgMTQ0LjA3OS0xNDQuMDc5IDE0NC4wNzlMMjA5Ljg5NiA4NjQuMTkzYy03OS41NDMgMC0xNDQuMDc5LTY0LjUzNS0xNDQuMDc5LTE0NC4wNzlMNjUuODE3IDMwMy44ODZjMC03OS41NDQgNjQuNTM2LTE0NC4wNzkgMTQ0LjA3OS0xNDQuMDc5bDQxNi4yMjkgMGMyMC4wMTEgMCA0MC4wMjIgNC4wMDIgNTguNTMyIDEyLjUwNyA0LjUwMiAyLjAwMSA4LjAwNCA2LjUwMyA5LjAwNSAxMS41MDYgMS4wMDEgNS41MDMtMC41IDEwLjUwNi00LjUwMyAxNC41MDhsLTI0LjUxMyAyNC41MTRjLTQuNTAzIDQuNTAyLTEwLjUwNiA2LjAwMy0xNi4wMDkgNC4wMDItNy41MDUtMi4wMDEtMTUuMDA5LTMuMDAxLTIyLjUxMy0zLjAwMUwyMDkuODk2IDIyMy44NDNjLTQ0LjAyNCAwLTgwLjA0NCAzNi4wMi04MC4wNDQgODAuMDQ0bDAgNDE2LjIyOWMwIDQ0LjAyNCAzNi4wMiA4MC4wNDQgODAuMDQ0IDgwLjA0NGw0MTYuMjI5IDBjNDQuMDI0IDAgODAuMDQ0LTM2LjAyIDgwLjA0NC04MC4wNDRMNzA2LjE2OSA2NTcuMDhjMC00LjAwMyAxLjUwMS04LjAwNSA0LjUwMi0xMS4wMDdsMzIuMDE4LTMyLjAxOGM1LjAwMy01LjAwMiAxMS41MDctNi4wMDMgMTcuNTEtMy41MDIgNi4wMDQgMi41MDIgMTAuMDA2IDguMDA1IDEwLjAwNiAxNC41MDlMNzcwLjIwNSA3MjAuMTE0ek04NjYuMjU3IDM5OS45MzggNTMwLjA3MiA3MzYuMTIzIDM4NS45OTMgNzM2LjEyMyAzODUuOTkzIDU5Mi4wNDRsMzM2LjE4NS0zMzYuMTg1TDg2Ni4yNTcgMzk5LjkzOHpNNTY4LjA5MyA2MzAuMDY0bC03Ni4wNDEtNzYuMDQxLTU4LjAzMiA1OC4wMzEgMCAyOC4wMTYgNDguMDI2IDAgMCA0OC4wMjYgMjguMDE2IDBMNTY4LjA5MyA2MzAuMDY0ek03MTMuNjczIDMyOC4zOTkgNTM4LjU3NyA1MDMuNDk1Yy00LjUwMyA0LjUwMy01LjAwMyAxMi4wMDctMC41IDE2LjUwOSA0LjUwMiA0LjUwMyAxMi4wMDYgNC4wMDMgMTYuNTA5LTAuNWwxNzUuMDk2LTE3NS4wOTZjNC41MDMtNC41MDMgNS4wMDMtMTIuMDA3IDAuNTAxLTE2LjUwOUM3MjUuNjggMzIzLjM5NiA3MTguMTc2IDMyMy44OTYgNzEzLjY3MyAzMjguMzk5ek04OTguMjc0IDM2Ny45MjEgNzU0LjE5NSAyMjMuODQybDQ2LjAyNS00Ni4wMjVjMTguNTEtMTguNTEgNDkuNTI3LTE4LjUxIDY4LjAzNyAwbDc2LjA0MiA3Ni4wNDJjMTguNTEgMTguNTEgMTguNTEgNDkuNTI3IDAgNjguMDM3TDg5OC4yNzQgMzY3LjkyMXoiIHAtaWQ9IjExMDk0IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+';
                    width: 24px;
                    height: 24px;
                    background: center np-repeat;
                    background-image: url(@edit);
                    background-size: contain;
                    margin-right: 4px;
                }
            }

            .single-info-item {
                font-size: 12px;
                color: white;
                &.has-text {
                    padding-bottom: 15px;
                }
            }

            .expande-switch-btn {
                position: absolute;
                left: 50%;
                top: 0;
                transform: translateX(-50%);
                background-image: url(@arrow-up-white);
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
                height: 20px;
                width: 40px;
                &.expanded {
                    transform: translateX(-50%) rotateZ(180deg);
                    transition: transform .3s;
                }
            }
        }

        .c-tool {
            height: 60px;
            display: flex;
            flex-grow: 1;
            flex-shrink: 0;
            justify-content: space-around;
            align-items: center;
            background: #fff;
            box-shadow: 0 0 10px #ccc;
            .icon-btn {
                border-radius: 5px;
                .color-primary-btn();
                color: #fff;
                font-size: 14px;
                padding: 0 30px;
                &.reload {
                    .color-plain-btn();
                }
                &.submit {
                    .color-primary-btn();
                    padding: 0 50px;
                }
            }
        }
    }
</style>

<script>
    import Reco from './reco'
    import Selector from '@/components/selector'
    import LiceList from '@/components/licelist'
    import Dialog from './components/dialog'
    import config from '@/utils/config'
    import {fetch, selectAndUpload} from '@/utils/index'

    // 获取一些屏幕参数
    const device = wx.getSystemInfoSync() // 获取设备信息
    const width = device.windowWidth - 20 // 示例为一个与屏幕等宽的正方形裁剪框
    const height = device.windowHeight - 100
    const rpxRate = +(1 / (device.windowWidth / 750)).toFixed(2)
    console.log('比率: ', device.windowWidth, rpxRate)

    export default {
        data () {
            return {
                callbackkey: '',
                checkresult: {},
                liceText: '',
                expand: false,
                showDlg: false,
                option: {
                    imgSrc: '',
                    width,  // 画布宽度
                    height, // 画布高度
                    scale: 2, // 最大缩放倍数
                    zoom: 4, // 缩放系数
                    newScale: 1,
                    imgLeft: 0,
                    imgTop: 0,
                    cut: {
                        x: 15, // 裁剪框x轴起点
                        y: 15, // 裁剪框y轴期起点
                        width: width - 15 * 2, // 裁剪框宽度
                        height: height - 35, // 裁剪框高度
                        borderBottomWidth: 20, // 该值 + cut.y = cut.height 减去的数
                        suitWidth: 0, // 缩放至cut宽度
                        sutiHeight: 0, // 缩放至cut高度
                        scaleRatio: 1 // 原始图片和在cut框的比率
                    }
                },
                rpxRate
            }
        },

        components: {
            'info-selector': Selector,
            'lice-list': LiceList,
            'ui-dialog': Dialog
        },

        methods: {
            ts (e) {
                this.reco.touchStart(e)
            },
            tm (e) {
                this.reco.touchMove(e)
            },
            te (e) {
                this.reco.touchEnd(e)
            },
            /**
             * 载入资质
            */
            loadLice () {
                selectAndUpload(config.domain.getDomain() + '/sendToAuthAjax', {callbackkey: this.callbackkey})
                .then(data => {
                    if (data === false) return null
                    const {licePic, checkresult, callbackkey} = data
                    Object.assign(this, {
                        checkresult, callbackkey
                    })
                    this.reco.setImgSrc(licePic)
                    this.liceText = ''
                })
            },

            dragStart (imgLeft, imgTop, newScale) {
                imgLeft && (this.option.imgLeft = imgLeft)
                imgTop && (this.option.imgTop = imgTop)
                newScale && (this.option.newScale = newScale)
            },

            dragEnd (posInfo) {
                const itemkey = posInfo.itemkey
                const {name, words, location} = posInfo[itemkey]
                const dragedValue = Object.assign(this.checkresult[itemkey], {
                    name,
                    words,
                    location
                })
                this.$set(this.checkresult, itemkey, dragedValue)
                this.liceText = name + ': ' + words
            },

            formatSetting (key, value, index) {
                const r = this.option.cut.scaleRatio
                const {top, left, width, height} = value.location
                const calc = {
                    scaleRatio: r,
                    callbackkey: this.callbackkey,
                    itemkey: key,
                    top: Math.round(r > 0 ? top / r : top * r),
                    left: Math.round(r > 0 ? left / r : left * r),
                    width: Math.round(r > 0 ? width / r : width * r),
                    height: Math.round(r > 0 ? height / r : height * r)
                }
                return calc
            },
            expandSwitchHdl () {
                this.expand = !this.expand
            },

            edtiHdl () {
                this.showDlg = true
            },

            dlgEnsureHdl () {
                this.showDlg = false
            },

            submitHdl () {
                const self = this
                wx.showModal({
                    title: '确认提交',
                    content: '确认当前资质信息无误并提交?',
                    confirmColor: '#4C8EFF',
                    mask: true,
                    success ({confirm, cancel}) {
                        if (cancel) return null
                        const url = config.domain.getDomain() + '/sendToAuditAjax'
                        const {callbackkey, checkresult} = self
                        confirm && wx.showLoading({
                            title: '正在提交...',
                            mask: true
                        })
                        confirm && fetch(url, {callbackkey, checkresult: JSON.stringify(checkresult)})
                        .then(data => {
                            wx.hideLoading()
                            if (!data) return null
                            wx.navigateTo({
                                url: '/pages/success/main?list=' + JSON.stringify(checkresult)
                            })
                        })
                    },
                    fail () {

                    }
                })
            }
        },

        computed: {
            transformer () {
                const {newScale, imgLeft, imgTop} = this.option
                return 'scale3d(' + newScale + ',' + newScale + ',' + newScale + ') translate3d(' + imgLeft + 'px,' + imgTop + 'px, 0)'
            }
        },

        created () {

        },

        mounted () {
            this.option.dragStart = this.dragStart
            const reco = this.reco = new Reco(this.option)
            const query = this.$root.$mp.query
            let {file, recoInfo} = query
            // 只有setImg之后，才会计算比率，所以要回调
            reco.onImageLoad = () => {
                const {checkresult, callbackkey} = JSON.parse(recoInfo)
                this.checkresult = checkresult
                this.callbackkey = callbackkey
            }
            reco.setImgSrc(file)
        }
    }
</script>
