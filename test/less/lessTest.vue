<template>
  <div id="app" class="aw" :sf="er">
    <div>22</div>
    <div>
      <div>
        22
        <div>
          22

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
  mounted () {},
  data () {
    return {
      isNewYearTheme: true,
      oo: ['main-container', isNewYearTheme ? 'newYear-theme' : '']
    }
  },
  methods: {}
}
</script>

<style lang="less">
// 测试兼容
@width: 5cm + 10mm;
@height: @width + 10px;

#app {
  width: @width;
  height: @height;
}

// 混合
.gg {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
#app .gg {
  color: #111;
  .gg();
}
//  嵌套
#app {
  color: black;
  .gg {
    font-size: 12px;
  }
  .ss {
    width: 300px;
  }
}
// 转义
@min768: ~'(min-width: 768px)';
.gg {
  @media @min768 {
    font-size: 1.2rem;
  }
}

// 函数
@base: #f04615;
@width: 0.5;

.gg {
  width: percentage(@width); // returns `50%`
  color: saturate(@base, 5%);
  background-color: spin(lighten(@base, 25%), 8);
}

.aw2() {
  .ss {
    display: block;
    border: 1px solid black;
    background-color: grey;
    &:hover {
      background-color: white;
    }
  }
}
#app a {
  color: orange;
  .aw2.ss(); // 还可以书写为 #bundle > .button 形式
}
// 映射（Maps）
#app2() {
  primary: blue;
  secondary: green;
}

.gg {
  color: #app2[primary];
  border: 1px solid #app2[secondary];
}
// 作用域（Scope）
@var: red;
#app {
  @var: white;
  .gg {
    color: @var; // white
  }
}
@media screen and (max-width: 300px) {
    .gg {
        background-color:lightblue;
    }
}
</style>
