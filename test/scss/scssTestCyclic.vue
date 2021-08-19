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
         <div>22</div>
    </div>
</template>
<script>
export default {
  mounted() {},
  data() {
    return {
      isNewYearTheme: true,
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

