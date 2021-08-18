<template>
    <div
        id="app"
        class="aw"
        :sf="er"
    >
        <div>
            <div>我是唐老鸭。</div>
            <p>我住在 Duckburg。</p>
        </div>
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
#app div~p
{
background-color:yellow;
}
</style>

