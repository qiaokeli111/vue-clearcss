<template>
    <div
        id="app"
        class="aw"
        :sf="er"
    >
    {{oo}}
        <div
            id="nav"
            :class="['main-container',isNewYearTheme?'newYear-theme':'dde']"
        >
            <router-link to="/">Home</router-link> |
            <router-link to="/about/ee">About</router-link>
            <div :class="{
                'newYear-theme':true
                }">
                <p>ss</p>
                <a class="router-link-exact-active aw__ee">
                    <div>
                        <div id="ee"></div>
                    </div>
                </a>
                
            </div>
        </div>
        <router-view />
    </div>
</template>
<script>
export default {
  mounted() {},
  data() {
    return {
      isNewYearTheme: true,
      oo: ["main-container", isNewYearTheme ? "newYear-theme" : ""],
    };
  },
  methods: {},
};
</script>

<style lang="scss">
// + 选择器
#nav p~a{
    color: aqua;
}
</style>

