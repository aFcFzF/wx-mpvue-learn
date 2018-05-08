<template>
    <div class="capture">
        <!-- <image mode="widthFix" src="src"></image> -->
        <div class="c-tool">
            <header class="capture-header">
                <span class="c-icon flash"></span>
                <span class="c-icon reverse"></span>
            </header>
            <camera class="capture-body" device-position="back" flash="off" binderror="error" ></camera>
            <footer class="capture-footer">
                <span class="back">取消</span>
                <span class="shoot-btn"></span>
            </footer>
        </div>
    </div>
</template>

<style lang="less">
    .capture {
        display: flex;
        flex-flow: column nowrap;
        height: 100%;
        position: relative;
        .c-tool {
            position: absolute;
            height: 100%;
            width: 100%;
            display: flex;
            flex-flow: column nowrap;
            .capture-header {
                display: flex;
                height: 45px;
                background: #000;
                justify-content: space-between;
                align-items: center;
                padding: 0 10px;
                .c-icon {
                    height: 24px;
                    width: 24px;
                    background-size: cover;
                    @flash-off: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTI1NTgxNzA4MjIxIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwMzc3IiBkYXRhLXNwbS1hbmNob3ItaWQ9ImEzMTN4Ljc3ODEwNjkuMC5pMiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNzI2LjAxNiA0MjUuOTg0bC02Ni4wMDUzMzMgMTE0LjAwNTMzMy0zNjEuOTg0LTM2MS45ODQgMC05MS45ODkzMzMgNDI3Ljk4OTMzMyAwLTE3MS45ODkzMzMgMzQwLjAxMDY2NyAxNzEuOTg5MzMzIDB6TTEzOS45ODkzMzMgMTI4bDY2OS45OTQ2NjcgNjcyLTU0LjAxNiA1NC4wMTYtMTc2LTE3OC4wMDUzMzMtMTUzLjk4NCAyNjIuMDE2IDAtMzg0LTEyOCAwIDAtMTU3Ljk5NDY2Ny0yMTIuMDEwNjY3LTIxNC4wMTZ6IiBwLWlkPSIxMDM3OCIgZmlsbD0iI2ZmZmZmZiI+PC9wYXRoPjwvc3ZnPg==';
                    @flash-on: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTI1NTgxNzI2ODIwIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwNTI1IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik0yOTguNjY2NjY3IDg1LjMzMzMzM3Y0NjkuMzMzMzM0aDEyOHYzODRsMjk4LjY2NjY2Ni01MTJoLTE3MC42NjY2NjZsMTcwLjY2NjY2Ni0zNDEuMzMzMzM0eiIgcC1pZD0iMTA1MjYiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L3N2Zz4=';
                    @reverse: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTI1NTgxNzYyMDE3IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwNzAzIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik02NDEuNzA4NjY2IDYzMC41MzU2OTdjNy42NjM1NC0xNy41MDM2NTMgMTEuODk0OTExLTM2Ljg0MzExNiAxMS44OTQ5MTEtNTcuMTU5ODM4IDAtNzkuMDEyNTQxLTY0LjA0NDY0Mi0xNDMuMDU3MTgzLTE0My4wNTgyMDctMTQzLjA1NzE4My0yNy4zMjIyNzUgMC01Mi44MjgxODIgNy42NTMzMDctNzQuNTQyNzQgMjAuOTM1ODIyTDM5MS43NzYzNiA0MDcuMDM3NDM3YzMzLjQ4OTc0Mi0yMy45NDAyNDkgNzQuNDgzMzg4LTM4LjAzMDE1MiAxMTguNzY5MDExLTM4LjAzMDE1MiAxMTIuODgxOTMgMCAyMDQuMzY4NTc0IDkxLjQ5Njg3NyAyMDQuMzY4NTc0IDIwNC4zNjc1NTEgMCA0NC4yODY2NDYtMTQuMDkwOTI2IDg1LjMwMDc1OC0zOC4wNDAzODUgMTE4Ljc1MDU5MWwtMC4wNzg3OTUtMC4wNzk4MThjLTEuNTE2NTQgMy42NzE2MjMtMy43NTI0NjQgNy4xNDI2NzctNi43ODY1NjcgMTAuMTM2ODcxLTExLjk3NDcyOSAxMS45NzU3NTItMzEuMjc0Mjg0IDEyLjA3NjAzNi00My4zMDgzNjUgMC4wMzk5MDlsLTQzLjQwNzYyNi00My4zODgxODNjLTExLjk1NTI4Ni0xMS45NzM3MDYtMTIuMDM1MTA0LTMxLjI5MjcwNCAwLjAyMDQ2Ni00My4zNDYyMjcgMTEuOTc0NzI5LTExLjk3NTc1MiAzMS4yOTM3MjctMTIuMDU1NTcgNDMuMzQ3MjUxLTAuMDIwNDY2TDY0MS43MDg2NjYgNjMwLjUzNTY5N3oiIHAtaWQ9IjEwNzA0IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PHBhdGggZD0iTTMyNy41NTI2MzkgNDgyLjI5ODUzOGMtMTMuNjkxODM3IDI3LjQyMTUzNi0yMS4zNzU4NDMgNTguMzQ2ODczLTIxLjM3NTg0MyA5MS4wNzYyOTggMCAxMTIuODgyOTUzIDkxLjUwNzExIDIwNC4zNjg1NzQgMjA0LjM2ODU3NCAyMDQuMzY4NTc0IDM4Ljk5NzE3NiAwIDc1LjQ0MTIwMy0xMC45MzcwOTcgMTA2LjQ1NDU0NC0yOS44OTU4OTFsLTQ1LjE4NDA4NS00NS4xNjU2NjZjLTE4LjU2MDcyOCA4LjgyMTkyMy0zOS4zMzU4OSAxMy43NTExODktNjEuMjcwNDU5IDEzLjc1MTE4OS03OS4wMTM1NjUgMC0xNDMuMDU4MjA3LTY0LjA0NDY0Mi0xNDMuMDU4MjA3LTE0My4wNTgyMDcgMC0xMC4wMTkxOTEgMS4wMTgxOS0xOS44MTgzNzEgMi45OTQxOTQtMjkuMjU4MzcxbDguOTIxMTgzIDguOTAxNzQxYzEyLjA1NDU0NyAxMi4wNTM1MjQgMzEuMzczNTQ1IDExLjk1NDI2MyA0My4zMjg4MzEgMCAxMi4wNTQ1NDctMTIuMDU1NTcgMTEuOTk1MTk1LTMxLjM4Mzc3OCAwLjAyMDQ2Ni00My4zNDkyOTdsLTQzLjM4ODE4My00My4zODcxNmMtMTIuMDUzNTI0LTEyLjA0NTMzNy0zMS4zNzM1NDUtMTEuOTU1Mjg2LTQzLjM0ODI3NCAwLjAyMDQ2NkMzMzEuNDYzNzE2IDQ3MC44NjIwNjggMzI4LjY0OTYyNCA0NzYuNDYwNTc2IDMyNy41NTI2MzkgNDgyLjI5ODUzOHoiIHAtaWQ9IjEwNzA1IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PHBhdGggZD0iTTkxOS4xODIyMzQgMjY2LjgyNDAyMSA3MTUuNTMyMDIxIDI2Ni44MjQwMjFsLTQzLjUyODM3Ni04Ni4xNTgyODljLTEwLjE3NzgwMy0yMC4xNzc1NTItMzYuNzYyMjc1LTM2LjQ2MjQ0Ni01OS4zOTM3MTUtMzYuNDYyNDQ2TDQwOC40ODE4MzMgMTQ0LjIwMzI4NmMtMjIuNjUyOTI5IDAtNDkuMTU2NTYgMTYuNDc1MjMtNTkuMjU0NTQ1IDM2Ljc5MTk1MWwtNDIuNjEwNDcgODUuODI4Nzg0TDEwMS45MDg1MDYgMjY2LjgyNDAyMWMtMjIuNTkxNTMxIDAtNDAuOTczMTggMTguMjIyMDEzLTQwLjk3MzE4IDQwLjcwMzAyN2wwIDUzMS42ODczODhjMCAyMi4zNTMxMDEgMTguMzQxNzQgNDAuNzE0Mjg0IDQwLjk3MzE4IDQwLjcxNDI4NGw4MTcuMjczNzI4IDBjMjIuNjExOTk3IDAgNDAuOTczMTgtMTguMjIyMDEzIDQwLjk3MzE4LTQwLjcxNDI4NEw5NjAuMTU1NDE1IDMwNy41MjcwNDlDOTYwLjE1NTQxNSAyODUuMTczOTQ4IDk0MS44MTM2NzQgMjY2LjgyNDAyMSA5MTkuMTgyMjM0IDI2Ni44MjQwMjF6TTg5OC44NDUwNDcgNzk4LjE3OTg1OGMwIDExLjI3NjgzNC05LjI2MDkyMSAyMC40Mzg0OTUtMjAuMzc3MDk2IDIwLjQzODQ5NUwxNDIuNjIyNzkgODE4LjYxODM1M2MtMTEuMjU2MzY4IDAtMjAuMzc3MDk2LTkuMTQyMjE4LTIwLjM3NzA5Ni0yMC40Mzg0OTVsMC00NDkuNTk5ODExYzAtMTEuMjg1MDIxIDkuMjYwOTIxLTIwLjQ0NTY1OCAyMC4zNzcwOTYtMjAuNDQ1NjU4bDIwNC40Mjc5MjYgMCAzMC40MzUxNzMtNjEuMzEwMzY4IDIxLjMxNDQ0NS00Mi45NTAyMDhjNS4wMjk1NS0xMC4xMzc4OTUgMTguMjIyMDEzLTE4LjM2MDE2IDI5LjU3NzY0Mi0xOC4zNjAxNmwxNjQuNjUyMDE0IDBjMTEuMzE2NzQzIDAgMjQuNTI4NjUgOC4wNDIxNjMgMjkuNTk3MDg1IDE4LjA5MjA1NGwyMS44MzQyODQgNDMuMjE4MzE0IDMwLjk3NTQ3OSA2MS4zMTAzNjggMjAzLjAzMDA5IDBjMTEuMjU2MzY4IDAgMjAuMzc3MDk2IDkuMTQxMTk0IDIwLjM3NzA5NiAyMC40NDU2NThMODk4Ljg0NDAyNCA3OTguMTc5ODU4eiIgcC1pZD0iMTA3MDYiIGZpbGw9IiNmZmZmZmYiPjwvcGF0aD48L3N2Zz4=';
                    &.flash {
                        background-image: url(@flash-off);
                        &.on {
                            background-image: url(@flash-on);
                        }
                    }
                    &.reverse {
                        background-image: url(@reverse);
                    }
                }
            }
            .capture-body {
                flex-grow: 1;
            }
            .capture-footer {
                display: flex;
                flex-direction: row nowrap;
                height: 90px;
                background: #000;
                justify-content: center;
                align-items: center;
                .back {
                    transform: translateX(-200%);
                    color: white;
                }
                .shoot-btn {
                    height: 50px;
                    width: 50px;
                    border-radius: 50%;
                    border: solid 6px #eee;
                    background: #fff;
                    font-size: 0;
                }
            }
        }
    }
</style>


<script>
import card from '@/components/card'

export default {
  data () {
    return {
      motto: 'Hello World'
    }
  },

  components: {
    card
  },

  created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  }
}
</script>
