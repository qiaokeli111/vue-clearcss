<template>
    <div
        id="app"
        class="aw"
        :sf="er"
    >
        <div
            id="nav"
            :class="['main-container',fwe?'yyyu':'dde']"
        >
            <router-link to="/">Home</router-link> |
            <router-link to="/about/ee">About</router-link>
            <div :class="{
                'yyyu':true
                }">
                <div>22</div>
                <a class="router-link-exact-active aw__ee">
                    <div>
                        <div id="ee"></div>
                    </div>
                </a>
                <p>aa</p>
            </div>
            <div class="aa" ff='22r'></div>
        </div>
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
    };
  },
  methods: {},
};
</script>

<style lang="scss">
// 验证动态class 拼接classname
.aw2{
    &__ee{
        color: #000;
    }
    .main-container{
        color: aqua;
    }
    .yyyu{
        color: aqua;
    }
}
</style>

