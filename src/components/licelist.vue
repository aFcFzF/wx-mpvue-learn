<template>
    <ul class="lice-list" :class="{expend}">
        <li class="list"><slot></slot></li>
    </ul>
</template>

<style lang="less">
    .list-info-layer {
        height: 50px;
        overflow-y: scroll;
        .list {
            height: 300px;
        }
    }
</style>

<script>
    export default {
        data () {
            return {
                expand: false
            }
        }
    }
</script>
