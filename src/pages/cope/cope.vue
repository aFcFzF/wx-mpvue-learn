<template>
    <div class="cope-page">
        <div class="lice-box"
            :style="{
                width: option.width + 'px',
                height: option.height + 'px',
            }"
        >
            <axis :option="{
                top: option.cut.y,
                left: option.cut.x,
                right: option.cut.x,
                bottom: option.cut.borderBottomWidth,
                rpxRate: rpxRate,
                offsetPx: 3
            }"/>

            <!--这是四个遮罩-->
            <div class="lice-shade top"></div>
            <div class="lice-shade right"></div>
            <div class="lice-shade left"></div>
            <div class="lice-shade bottom"
                :style="{
                    'min-height': option.cut.borderBottomWidth + 'px'
                }"
            >
                <scroll-view
                    data-name="info-section"
                    class="lice-info-layer"
                    v-if="expand"
                    scroll-y
                    scroll-with-animation
                >
                    <div class="info-item" data-name="info-item" v-for="(value, key) in checkresult" :key="key">{{value.name + ': ' + value.words}}</div>
                </scroll-view>
                <div class="info-item" v-else>{{liceText}}</div>
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
                    <info-selector @change="change" v-for="(value, key) in checkresult" :setting="formatSetting(key, value, index)" :key="key"></info-selector>
                </div>

                <image class="img"
                :disable-scroll="true"
                :src="option.imgSrc"
                ></image>
            </div>

        </div>

        <div class="c-tool">
          <button @click.prevent="loadLice" class="icon-btn" plain hover-class="btn-hover">
            <i class="icon reload " />重拍
          </button>
          <button @click="finish" plain class="icon-btn" hover-class="btn-hover">
            <i class="icon finish" />
            识别
          </button>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .cope-page {
        display: flex;
        flex-flow: column nowrap;
        height: 100%;
        justify-content: center;
        .lice-box {
            justify-content: center;
            align-items: center;
            overflow: hidden;
            margin: 10px;
            position: relative;
            box-sizing: border-box;
            border-radius: 3px;

            .selection-layer {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 9;
            }

            .lice-shade {
                position: absolute;
                background-color:rgba(0, 0, 0, .6);
                z-index: 8;
                &.top {
                    top: 0;
                    left: 15px;
                    height: 15px;
                    right: 15px;
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
                    right: 15px;
                    padding: 20px;
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
                &.expend {
                    // background-color: rgba(0, 0, 0, 0.6);
                }
                .most-item {
                    height: 100px;
                    line-height: 1.6;
                }
            }
        }
        .c-tool {
            height: 60px;
            padding: 0 60px;
            padding-bottom: 10px;
            display: flex;
            flex-grow: 1;
            flex-shrink: 0;
            justify-content: space-between;
            align-items: center;
            @re: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTI1NTkzNTc2NjQ2IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyNjkwIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik05NTIuNTI5NDU1IDQ1OS43NTI3MjdhMzQuOTA5MDkxIDM0LjkwOTA5MSAwIDAgMC00OS4zNjE0NTUgMGwtMjEuMDg1MDkxIDIxLjA4NTA5MUM4NjAuNjI1NDU1IDI3Ni4zMTcwOTEgNjg3LjIyMDM2NCAxMTYuMzYzNjM2IDQ3Ny4wOTA5MDkgMTE2LjM2MzYzNmE0MDAuNTcwMTgyIDQwMC41NzAxODIgMCAwIDAtNDguNjg2NTQ1IDMuMjExNjM3Yy03Ljg0MjkwOSAwLjkzMDkwOS0xNS42MTYgMi4xNjQzNjQtMjMuMzQyNTQ2IDMuNTYwNzI3LTQuNzAxMDkxIDAuODM3ODE4LTkuNDAyMTgyIDEuNTgyNTQ1LTE0LjAxMDE4MiAyLjU2LTkuODQ0MzY0IDIuMTY0MzY0LTE5LjU3MjM2NCA0LjY1NDU0NS0yOS4xNjA3MjcgNy41NDAzNjQtNi44NjU0NTUgMi4wMjQ3MjctMTMuNTIxNDU1IDQuMzk4NTQ1LTIwLjI0NzI3MyA2Ljc0OTA5MS0zLjUzNzQ1NSAxLjI4LTcuMTIxNDU1IDIuNTYtMTAuNjM1NjM2IDMuOTMzMDktNy4yMzc4MTggMi43OTI3MjctMTQuMzM2IDUuNzAxODE4LTIxLjM2NDM2NCA4Ljg5MDE4Mi0xLjQ4OTQ1NSAwLjY3NDkwOS0yLjk3ODkwOSAxLjQ0MjkwOS00LjQ2ODM2MyAyLjE0MTA5MS0xNS41OTI3MjcgNy4zMzA5MDktMzAuNjUwMTgyIDE1LjQ5OTYzNi00NS4wNzkyNzMgMjQuNjQ1ODE4bC0xLjkzMTYzNiAxLjE2MzYzN2EzOTQuMzA5ODE4IDM5NC4zMDk4MTggMCAwIDAtMjYuNjI0IDE4LjczNDU0NSA0MTEuMzIyMTgyIDQxMS4zMjIxODIgMCAwIDAtNTQuNTUxMjczIDQ5Ljc4MDM2NGMtMi40NDM2MzYgMi42NTMwOTEtNC44ODcyNzMgNS4yNTk2MzYtNy4yNjEwOTEgNy45ODI1NDVBMzc1LjA0IDM3NS4wNCAwIDAgMCAxNDguOTQ1NDU1IDI4My40NjE4MThhNDA3LjMxOTI3MyA0MDcuMzE5MjczIDAgMCAwLTM3Ljc3MTYzNyA2Mi41NTcwOTFjLTEuMDAwNzI3IDIuMDcxMjczLTIuMTQxMDkxIDQuMDI2MTgyLTMuMTE4NTQ1IDYuMDk3NDU1LTAuMjMyNzI3IDAuNDE4OTA5LTAuMjc5MjczIDAuODYxMDkxLTAuNDY1NDU1IDEuMjhBNDA0LjM0MDM2NCA0MDQuMzQwMzY0IDAgMCAwIDY5LjgxODE4MiA1MjMuNjM2MzY0QzY5LjgxODE4MiA3NDguMjE4MTgyIDI1Mi41MDkwOTEgOTMwLjkwOTA5MSA0NzcuMDkwOTA5IDkzMC45MDkwOTFjMTQzLjQ3NjM2NCAwIDI3My42ODcyNzMtNzMuMzA5MDkxIDM0OC4yOTk2MzYtMTk2LjA0OTQ1NWEzNC45MDkwOTEgMzQuOTA5MDkxIDAgMCAwLTU5LjY3MTI3Mi0zNi4yNTg5MDlDNzAzLjg4MzYzNiA4MDAuMzQ5MDkxIDU5NS45OTEyNzMgODYxLjA5MDkwOSA0NzcuMDkwOTA5IDg2MS4wOTA5MDkgMjkxLjAyNTQ1NSA4NjEuMDkwOTA5IDEzOS42MzYzNjQgNzA5LjcwMTgxOCAxMzkuNjM2MzY0IDUyMy42MzYzNjRhMzM1LjEyNzI3MyAzMzUuMTI3MjczIDAgMCAxIDMyLjkwNzYzNi0xNDQuMzg0QTMzNS43NTU2MzYgMzM1Ljc1NTYzNiAwIDAgMSAyMTAuMzg1NDU1IDMxNy42NzI3MjdjNC4xMTkyNzMtNS4zNTI3MjcgOC4zNzgxODItMTAuNTY1ODE4IDEyLjgtMTUuNjE2bDMuMzk3ODE4LTMuNzQ2OTA5YTM0MS4yMjQ3MjcgMzQxLjIyNDcyNyAwIDAgMSA0OC4xNTEyNzItNDQuMTAxODE4bDMuMjU4MTgyLTIuNDQzNjM2YTM0MC42MTk2MzYgMzQwLjYxOTYzNiAwIDAgMSA1OC4xMTItMzQuMzI3MjczbDEuOTA4MzY0LTAuOTMwOTA5YTMxMy4zMjA3MjcgMzEzLjMyMDcyNyAwIDAgMSAyNi4zOTEyNzMtMTAuNTY1ODE4YzUuNzcxNjM2LTIuMDk0NTQ1IDExLjUyLTQuMDk2IDE3LjQwOC01Ljg0MTQ1NSA3Ljg0MjkwOS0yLjMyNzI3MyAxNS44MDIxODItNC40MjE4MTggMjMuOTAxMDkxLTYuMTY3MjczIDMuOTA5ODE4LTAuODYxMDkxIDcuOTEyNzI3LTEuNDY2MTgyIDExLjg0NTgxOC0yLjE4NzYzNmEzNzEuNDc5MjczIDM3MS40NzkyNzMgMCAwIDEgMjkuNDE2NzI3LTQuMDQ5NDU1YzkuOTM3NDU1LTAuOTMwOTA5IDE5Ljk2OC0xLjUzNiAzMC4xMTQ5MDktMS41MzYgMTY5LjM3ODkwOSAwIDMwOS41OTcwOTEgMTI1LjU1NjM2NCAzMzMuNDc0OTA5IDI4OC4zOTU2MzdsLTE0LjgwMTQ1NC0xNC44MjQ3MjdhMzQuOTA5MDkxIDM0LjkwOTA5MSAwIDEgMC00OS4zNjE0NTUgNDkuMzM4MTgxbDc4LjM4MjU0NiA3OC40MjkwOTFhMzQuOTMyMzY0IDM0LjkzMjM2NCAwIDAgMCA0OS4zMzgxODEgMGw3OC40MDU4MTktNzguNDI5MDkxYTM0LjkwOTA5MSAzNC45MDkwOTEgMCAwIDAgMC00OS4zMzgxODEiIGZpbGw9IiM5QkEyQjUiIHAtaWQ9IjEyNjkxIj48L3BhdGg+PC9zdmc+';
            @fin: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTI1NTkzNTYwMjcxIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyNDIwIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik01MTIuNTQyNzIgNzIuNTQwMTZjLTI0Mi4wNzM2IDAtNDM4LjMwMjcyIDE5Ni44OTk4NC00MzguMzAyNzIgNDM5Ljc5Nzc2czE5Ni4yMjkxMiA0MzkuNzk3NzYgNDM4LjMwMjcyIDQzOS43OTc3NmMyNDIuMDYzMzYgMCA0MzguMzAyNzItMTk2Ljg5OTg0IDQzOC4zMDI3Mi00MzkuNzk3NzZTNzU0LjYxMTIgNzIuNTQwMTYgNTEyLjU0MjcyIDcyLjU0MDE2ek03MDYuNjUyMTYgNDMzLjQyMzM2bC0yMDguNjE5NTIgMjA5Ljg1MzQ0IDAtMC4wMjA0OGMtNi4zMDc4NCA2LjM0ODgtMTQuOTg2MjQgMTAuMjUwMjQtMjQuNjI3MiAxMC4yNTAyNC05LjYgMC0xOC4zMTQyNC0zLjk0MjQtMjQuNjA2NzItMTAuMjUwMjRMMzEwLjE5NTIgNTAzLjY2OTc2Yy02LjI4NzM2LTYuMjk3Ni0xMC4xNjgzMi0xNS4wMDE2LTEwLjE2ODMyLTI0LjYyMjA4IDAtMTkuMzAyNCAxNS41OTA0LTM0LjkxMzI4IDM0Ljc2OTkyLTM0LjkxMzI4IDkuNjIwNDggMCAxOC4zMTkzNiAzLjkyMTkyIDI0LjYyNzIgMTAuMjUwMjRsMTEzLjk4MTQ0IDExNC44MTA4OCAxODQuMDE3OTItMTg1LjA4OGM2LjI5MjQ4LTYuMzIzMiAxNS4wMjcyLTEwLjIxOTUyIDI0LjYyMjA4LTEwLjIxOTUyIDE5LjE4NDY0IDAgMzQuNzU0NTYgMTUuNjE2IDM0Ljc1NDU2IDM0Ljg3MjMyQzcxNi44IDQxOC4zOTYxNiA3MTIuOTE5MDQgNDI3LjExNTUyIDcwNi42NTIxNiA0MzMuNDIzMzZ6IiBwLWlkPSIxMjQyMSIgZmlsbD0iIzlCQTJCNSI+PC9wYXRoPjwvc3ZnPg==';
            @re_hover: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTI1NzA4MzEwNjcyIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY2MCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTUyLjUzIDQ1OS43NTNhMzQuOTEgMzQuOTEgMCAwIDAtNDkuMzYyIDBsLTIxLjA4NSAyMS4wODVDODYwLjYyNSAyNzYuMzE4IDY4Ny4yMiAxMTYuMzY0IDQ3Ny4wOSAxMTYuMzY0YTQwMC41NyA0MDAuNTcgMCAwIDAtNDguNjg3IDMuMjExYy03Ljg0MyAwLjkzMS0xNS42MTYgMi4xNjUtMjMuMzQyIDMuNTYxLTQuNzAxIDAuODM4LTkuNDAyIDEuNTgzLTE0LjAxIDIuNTYtOS44NDUgMi4xNjQtMTkuNTczIDQuNjU1LTI5LjE2MSA3LjU0LTYuODY2IDIuMDI1LTEzLjUyMiA0LjM5OS0yMC4yNDcgNi43NS0zLjUzOCAxLjI4LTcuMTIyIDIuNTYtMTAuNjM2IDMuOTMzLTcuMjM4IDIuNzkyLTE0LjMzNiA1LjcwMS0yMS4zNjQgOC44OS0xLjQ5IDAuNjc1LTIuOTggMS40NDMtNC40NjkgMi4xNC0xNS41OTIgNy4zMzItMzAuNjUgMTUuNS00NS4wNzkgMjQuNjQ3bC0xLjkzMiAxLjE2M2EzOTQuMzEgMzk0LjMxIDAgMCAwLTI2LjYyNCAxOC43MzUgNDExLjMyMiA0MTEuMzIyIDAgMCAwLTU0LjU1IDQ5Ljc4Yy0yLjQ0NSAyLjY1My00Ljg4OCA1LjI2LTcuMjYyIDcuOTgzYTM3NS4wNCAzNzUuMDQgMCAwIDAtMjAuNzgzIDI2LjIwNSA0MDcuMzIgNDA3LjMyIDAgMCAwLTM3Ljc3MSA2Mi41NTdjLTEgMi4wNzEtMi4xNDEgNC4wMjYtMy4xMTkgNi4wOTctMC4yMzIgMC40Mi0wLjI3OSAwLjg2MS0wLjQ2NSAxLjI4YTQwNC4zNCA0MDQuMzQgMCAwIDAtMzcuNzcyIDE3MC4yNGMwIDIyNC41ODIgMTgyLjY5MSA0MDcuMjczIDQwNy4yNzMgNDA3LjI3MyAxNDMuNDc2IDAgMjczLjY4Ny03My4zMDkgMzQ4LjMtMTk2LjA1YTM0LjkxIDM0LjkxIDAgMCAwLTU5LjY3Mi0zNi4yNThjLTYxLjgzNSAxMDEuNzQ4LTE2OS43MjggMTYyLjQ5LTI4OC42MjggMTYyLjQ5LTE4Ni4wNjYgMC0zMzcuNDU1LTE1MS4zOS0zMzcuNDU1LTMzNy40NTVhMzM1LjEyNyAzMzUuMTI3IDAgMCAxIDMyLjkwOC0xNDQuMzg0IDMzNS43NTYgMzM1Ljc1NiAwIDAgMSAzNy44NDEtNjEuNTggMzE5LjI2IDMxOS4yNiAwIDAgMSAxMi44LTE1LjYxNWwzLjM5OC0zLjc0N2EzNDEuMjI1IDM0MS4yMjUgMCAwIDEgNDguMTUyLTQ0LjEwMmwzLjI1OC0yLjQ0NGEzNDAuNjIgMzQwLjYyIDAgMCAxIDU4LjExMi0zNC4zMjdsMS45MDgtMC45M2EzMTMuMzIgMzEzLjMyIDAgMCAxIDI2LjM5MS0xMC41NjdjNS43NzItMi4wOTQgMTEuNTItNC4wOTYgMTcuNDA4LTUuODQxIDcuODQzLTIuMzI3IDE1LjgwMy00LjQyMiAyMy45MDEtNi4xNjcgMy45MS0wLjg2MSA3LjkxMy0xLjQ2NyAxMS44NDYtMi4xODhhMzcxLjQ4IDM3MS40OCAwIDAgMSAyOS40MTctNC4wNWM5LjkzNy0wLjkzIDE5Ljk2OC0xLjUzNSAzMC4xMTUtMS41MzUgMTY5LjM3OSAwIDMwOS41OTcgMTI1LjU1NiAzMzMuNDc1IDI4OC4zOTVsLTE0LjgwMi0xNC44MjVhMzQuOTEgMzQuOTEgMCAxIDAtNDkuMzYxIDQ5LjMzOWw3OC4zODIgNzguNDI5YTM0LjkzMiAzNC45MzIgMCAwIDAgNDkuMzM5IDBsNzguNDA1LTc4LjQzYTM0LjkxIDM0LjkxIDAgMCAwIDAtNDkuMzM4IiBwLWlkPSI2NjEiIGZpbGw9IiMyNzQ1REIiPjwvcGF0aD48L3N2Zz4=';
            @fin_hover: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTI1NzA4Mzk2NzEyIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjkwMiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyLjU0MyA3Mi41NGMtMjQyLjA3NCAwLTQzOC4zMDMgMTk2LjktNDM4LjMwMyA0MzkuNzk4czE5Ni4yMyA0MzkuNzk4IDQzOC4zMDMgNDM5Ljc5OGMyNDIuMDYzIDAgNDM4LjMwMi0xOTYuOSA0MzguMzAyLTQzOS43OThTNzU0LjYxMSA3Mi41NCA1MTIuNTQzIDcyLjU0eiBtMTk0LjExIDM2MC44ODNsLTIwOC42MiAyMDkuODU0di0wLjAyYy02LjMwOCA2LjM0OC0xNC45ODcgMTAuMjUtMjQuNjI4IDEwLjI1LTkuNiAwLTE4LjMxNC0zLjk0My0yNC42MDYtMTAuMjVMMzEwLjE5NSA1MDMuNjdhMzQuNzI5IDM0LjcyOSAwIDAgMS0xMC4xNjgtMjQuNjIyYzAtMTkuMzAzIDE1LjU5LTM0LjkxNCAzNC43Ny0zNC45MTQgOS42MiAwIDE4LjMyIDMuOTIyIDI0LjYyNyAxMC4yNWwxMTMuOTgxIDExNC44MTIgMTg0LjAxOC0xODUuMDg4YTM0LjY2IDM0LjY2IDAgMCAxIDI0LjYyMi0xMC4yMmMxOS4xODUgMCAzNC43NTUgMTUuNjE2IDM0Ljc1NSAzNC44NzJhMzQuODg1IDM0Ljg4NSAwIDAgMS0xMC4xNDggMjQuNjYzeiIgcC1pZD0iOTAzIiBmaWxsPSIjMjc0NURCIj48L3BhdGg+PC9zdmc+';
            .icon-btn {
              display: flex;
              flex-flow: column nowrap;
              align-items: center;
              justify-content: center;
              color: #9BA2B5;
              font-size:14px;
              border:none;
              padding:0;
              margin:0;
              .icon {
                height: 32px;
                width: 32px;
                background-size: contain;
                &.reload {
                  background-image: url(@re);
                }
                &.finish {
                  background-image: url(@fin);
                }
              }
              &.btn-hover {
                // background-color: rgb(39, 69, 219);
                color: #2745DB;
                & .reload {
                  background-image: url(@re_hover);
                }
                & .finish {
                  background-image: url(@fin_hover);
                }
              }
            }
        }
    }
</style>

<script>
    import Reco from './reco'
    import Selector from '@/components/selector'
    import LiceList from '@/components/licelist'
    import Axis from './components/axis'
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
                expand: true,
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
                        height: height - 55, // 裁剪框高度
                        borderBottomWidth: 40, // 该值 + cut.y = cut.height 减去的数
                        suitWidth: 0, // 缩放至cut宽度
                        sutiHeight: 0, // 缩放至cut高度
                        scaleRatio: 1 // 原始图片和在cut框的比率
                    }
                },
                rpxRate
            }
        },

        components: {
            'axis': Axis,
            'info-selector': Selector,
            'lice-list': LiceList
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
                this.liceText = 'aabbcc'
                // const self = this
                // wx.chooseImage({
                //     count: 1,
                //     success (fileObj) {
                //         console.log('又拍一张：', fileObj.tempFilePaths[0])
                //     },
                //     fail (a, b) {
                //         console.log('取消载入图片了')
                //     }
                // })
            },

            ondrag (imgLeft, imgTop, newScale) {
                imgLeft && (this.option.imgLeft = imgLeft)
                imgTop && (this.option.imgTop = imgTop)
                newScale && (this.option.newScale = newScale)
            },

            change (posInfo) {
                console.log('获取到了值: ', this, posInfo, this.checkresult)
                const itemkey = posInfo.itemkey
                const {name, words} = this.checkresult[itemkey]
                this.liceText = name + ': ' + words
            },

            formatSetting (key, value, index) {
                const r = this.option.cut.scaleRatio
                const {top, left, width, height} = value.location
                const calc = {
                    scaleRatio: r,
                    itemkey: key,
                    top: Math.round(r > 0 ? top / r : top * r),
                    left: Math.round(r > 0 ? left / r : left * r),
                    width: Math.round(r > 0 ? width / r : width * r),
                    height: Math.round(r > 0 ? height / r : height * r)
                }
                // console.log('比率', r, '原始数据： ', value.location, '新数据: ', calc)
                return calc
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
            this.option.ondrag = this.ondrag
            const reco = this.reco = new Reco(this.option)
            const query = this.$root.$mp.query
            let {file, recoInfo} = query
            // 只有setImg之后，才会计算比率，所以要回调
            reco.onImageLoad = () => {
                this.checkresult = JSON.parse(recoInfo).checkresult
            }
            reco.setImgSrc(file)
        }
    }
</script>
