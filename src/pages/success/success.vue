<template>
    <div class="success-page">
        <div class="success">
            <div class="success-icon" />
            <div class="success-text">资质信息已成功提交</div>
            <div class="success-btn-group">
                <button class="btn return" @click="toIndex">返回首页</button>
             </div>
             <button class="more" plain @click="moreHdl"><span class="more-btn">{{expand ? '收起' : '查看明细' }}</span><i class="more-icon" :class="expand ? 'expand' : '' "/></button>
             <ui-list :list="list" v-if="expand"></ui-list>
        </div>
    </div>
</template>

<style lang="less">
    @import '~@/common/var.less';
    page {
        overflow: scroll;
    }
    .success-page {
        background: #eee;
        height: 100%;
        height: 100%;
        overflow: scroll;
        .success {
            text-align: center;
            background: #fff;
            margin: 10px;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 0 20px rgba(0, 0, 0, .2);
            &-icon {
                @successIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyMTc2OTE4MTI3IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MzciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyIDM5LjM4NDYxNUMyNTAuMDkyMzA4IDM5LjM4NDYxNSAzOS4zODQ2MTUgMjUwLjA5MjMwOCAzOS4zODQ2MTUgNTEyczIxMC43MDc2OTIgNDcyLjYxNTM4NSA0NzIuNjE1Mzg1IDQ3Mi42MTUzODUgNDcyLjYxNTM4NS0yMTAuNzA3NjkyIDQ3Mi42MTUzODUtNDcyLjYxNTM4NVM3NzMuOTA3NjkyIDM5LjM4NDYxNSA1MTIgMzkuMzg0NjE1eiBtMjYzLjg3NjkyMyAzNTQuNDYxNTM5TDQ3NC41ODQ2MTUgNjk5LjA3NjkyM2MtMTEuODE1Mzg1IDExLjgxNTM4NS0zMS41MDc2OTIgMTEuODE1Mzg1LTQzLjMyMzA3NyAwTDI2NS44NDYxNTQgNTMxLjY5MjMwOGMtMTEuODE1Mzg1LTExLjgxNTM4NS0xMS44MTUzODUtMzEuNTA3NjkyIDAtNDMuMzIzMDc3bDQzLjMyMzA3Ny00My4zMjMwNzdjMTEuODE1Mzg1LTExLjgxNTM4NSAzMS41MDc2OTItMTEuODE1Mzg1IDQzLjMyMzA3NyAwbDg2LjY0NjE1NCA4OC42MTUzODRjNy44NzY5MjMgNy44NzY5MjMgMjEuNjYxNTM4IDcuODc2OTIzIDI5LjUzODQ2MSAwTDY4OS4yMzA3NjkgMzA1LjIzMDc2OWMxMS44MTUzODUtMTEuODE1Mzg1IDMxLjUwNzY5Mi0xMS44MTUzODUgNDMuMzIzMDc3IDBsNDMuMzIzMDc3IDQzLjMyMzA3N2MxMy43ODQ2MTUgMTEuODE1Mzg1IDEzLjc4NDYxNSAzMS41MDc2OTIgMCA0NS4yOTIzMDh6IiBwLWlkPSIyNzM4IiBmaWxsPSIjMTJhZTViIj48L3BhdGg+PC9zdmc+';
                @successIcon1: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyMTc4OTA1NzUzIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMwOTciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyIDBDMjI5LjY5MTA3NyAwIDAgMjI5LjY3MTM4NSAwIDUxMnMyMjkuNjkxMDc3IDUxMiA1MTIgNTEyIDUxMi0yMjkuNjcxMzg1IDUxMi01MTJTNzk0LjMwODkyMyAwIDUxMiAweiBtMCA5ODQuNjE1Mzg1QzI1MS40MTE2OTIgOTg0LjYxNTM4NSAzOS4zODQ2MTUgNzcyLjU4ODMwOCAzOS4zODQ2MTUgNTEyUzI1MS40MTE2OTIgMzkuMzg0NjE1IDUxMiAzOS4zODQ2MTVzNDcyLjYxNTM4NSAyMTIuMDI3MDc3IDQ3Mi42MTUzODUgNDcyLjYxNTM4NS0yMTIuMDI3MDc3IDQ3Mi42MTUzODUtNDcyLjYxNTM4NSA0NzIuNjE1Mzg1eiIgZmlsbD0iIzEyYWU1YiIgcC1pZD0iMzA5OCI+PC9wYXRoPjxwYXRoIGQ9Ik03NTMuMjcwMTU0IDMwMi4wMDEyMzFsLTMwMi42NTEwNzcgMzQwLjQ4LTE4Mi4zMzEwNzctMTQ1Ljg2MDkyM2ExOS42OTIzMDggMTkuNjkyMzA4IDAgMCAwLTI0LjU5NTY5MiAzMC43NTkzODRsMTk2LjkyMzA3NyAxNTcuNTM4NDYyYTE5LjY3MjYxNSAxOS42NzI2MTUgMCAwIDAgMjcuMDM3NTM4LTIuMzA0bDMxNS4wNzY5MjMtMzU0LjQ2MTUzOWExOS42OTIzMDggMTkuNjkyMzA4IDAgMSAwLTI5LjQ1OTY5Mi0yNi4xNTEzODR6IiBmaWxsPSIjMTJhZTViIiBwLWlkPSIzMDk5Ij48L3BhdGg+PC9zdmc+';
                width: 64px;
                height: 64px;
                background: url(@successIcon1) no-repeat center;
                background-size: contain;
                margin-top: 30px;
                display: inline-block;
            }
            &-text {
                margin-top: 30px;
                font-size: 20px;
            }
            &-btn-group {
                display: flex;
                padding: 20px 10px;
                padding-top: 30px;
                justify-content: center;
                align-self:stretch;
                .btn {
                    border-radius: 5px;
                    .color-primary-btn();
                    color: #fff;
                    font-size: 14px;
                    padding: 0 30px;
                    margin: 0;
                    &.close {
                        .color-plain-btn();
                    }
                    &.return {
                        .color-primary-btn();
                        padding: 0 30px;
                    }
                }
            }

            .more {
                padding: 0px;
                display: flex;
                justify-content: center;
                font-size: 12px;
                border: none;
                align-items: center;
                padding: 5px 30px;
                margin-top: 20px;
                &-icon {
                    width: 16px;
                    height: 16px;
                    background-image: url(@arrow-down-black);
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;
                    opacity: .5;
                    margin-left: 6px;
                    transform: rotate(0deg);
                    transition: transform .3s;
                    &.expand {
                        transform: rotate(180deg);
                    }
                }
                &.button-hover {
                    .more-icon {
                        opacity: .3;
                    }
                }
            }

            .lists {
                height: auto;
                margin-top: 20px;
                align-self:stretch;
                text-align: left;
            }
        }
    }
</style>

<script>
import List from '@/components/list'

export default {
    components: {
        'ui-list': List
    },

    data () {
        return {
            list: {},
            expand: false
        }
    },

    methods: {
        moreHdl () {
            const expand = this.expand
            this.expand = !expand
        },

        toIndex () {
            wx.reLaunch({
                url: '/pages/index/main'
            })
        }
    },

    mounted () {
        const list = JSON.parse(this.$root.$mp.query.list)
        this.list = list
    }

}
</script>

