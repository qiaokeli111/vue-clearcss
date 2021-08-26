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
.aw{
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
// 父选择符： &
#app {
  color: black;
  >.yyyu {
    font-weight: bold;
  }
}
// 变量
$width: 5em;
#app {
  width: $width;
}
// 函数
a {
  color: hsl($hue: 0, $saturation: 100%, $lightness: 50%);
}
// 继承
.dde {
  border: 1px #f00;
  background-color: #fdd;
}
#app {
  @extend .dde;
  border-width: 3px;
}
// 混合
@mixin large-text {
  font: {
    family: Arial;
    size: 20px;
    weight: bold;
  }
  color: #ff0000;
}
#app {
  @include  large-text;
  border-width: 3px;
}

// ~ + 选择器
div~a{
    color: #000;
}
div+p{
    color: #000;
}

@media screen and (max-width: 300px) {
    .yyyu {
        background-color:lightblue;
    }
}

</style>

