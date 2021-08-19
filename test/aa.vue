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

<style lang="scss">
#app div ~ p {
    background-color: yellow;
}
#app p {
    background: red;
}

#app a {
    background: red;
}
#app .ss {
    background: red;
}

#app .gg {
    background: red;
}
</style>
