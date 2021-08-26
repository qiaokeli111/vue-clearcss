<template>
    <div id="app" class="aw" :sf="er">
        <div
            id="nav"
            :class="{
                icon: true,
                all: detail.rank.area_type === 1,
            }"
        ></div>
        <router-view />
    </div>
</template>
<script>
export default {
    mounted() {},
    data() {
        return {
            fwe: true,
            oo: ["main-container", fwe ? "yyyu" : ""],
        }
    },
    methods: {},
}
</script>

<style>
@import url('./testCommon.css');
.aw{
    color: red;
}
</style>


