<template>
    <div id="app" class="aw" :sf="er">
        <div>22</div>
        <div>
            <div>
                22
                <div>22

                    <a class="gg">3</a>
                </div>
            </div>
            <div>
                <div>我是唐老鸭。</div>
                <p class="ss">我住在 Duckburg。</p>
            </div>
            <div>22</div>
        </div>
        <div>22</div>
    </div>
</template>
<script>
export default {
    mounted() {},
    data() {
        return {
            isNewYearTheme: true,
            oo: ["main-container", isNewYearTheme ? "newYear-theme" : ""],
        }
    },
    methods: {},
}
</script>

<style lang="less">
::v-deep .ss{
    background-color: yellow;
}
</style>
<style lang="less">
.gg{
    background-color: yellow;
}
</style>
<style lang="less">
.aw .ss{
    background-color: yellow;
}
</style>

