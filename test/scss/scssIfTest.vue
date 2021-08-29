<template>
    <div class="right">
        <div class="ii"></div>
        <div v-if="item.is_completed == 1" class="aa1"> </div>
        <div v-else-if="item.is_completed == 2" class="aa2" id="aaa2"> </div>
        <div v-if="item.is_completed == 1" class="bb1" id="bbb1"> </div>
        <div v-else-if="item.is_completed == 2" class="bb2" id="bbb2"> </div>
        <div v-else class="bb3">  </div>

        <div class="yy"></div>
        <div v-if="item.is_completed == 1" class="cc1"> </div>
        <div v-else-if="item.is_completed == 2" class="cc2"> </div>
        <div v-else class="cc3"> 33 </div>
        <div class="ff" id='oo'> </div>
        <div class="tt" id='gg'> </div>

         <div class="pp"></div>
        <div v-if="item.is_completed == 1" class="dd1"> </div>
        <div v-else-if="item.is_completed == 2" class="dd2" id="ddd2"> </div>
        <div class="ko" id="fr"></div>
        <div class="fr"></div>
    </div>
</template>
<style lang="scss">
    .ii ~ .tt{
        color: #000;
    }
    .ii ~ .dd2{
        color: #000;
    }
    .ii ~ #ddd2{
        color: #000;
    }
    .aa2 ~ .bb1{
        color: #000;
    }
    .aa2 ~ #bbb1{
        color: #000;
    }
</style>
<style lang="scss">
    .aa1 + .bb1{
        color: aqua;
    }
    .aa1 + .bb2{
        color: #000;
    }
    .pp + .ko{
        color: #000;
    }
    .pp + #fr{
        color: #000;
    }
</style>
<style lang="scss">
    .ii + #aaa2{
        color: #000;
    }
    .ii + #bbb2{
        color: #000;
    }
    .ii + .bb3{
        color: #000;
    }
    .ii + .aa2{
        color: #000;
    }
      
</style>
<style lang="scss">
.aa1 + .bb2{
    color: #000;
}

.aa2 + .bb3{
    color: #000;
}

.aa2 + #bbb2 {
    color: #000;
}

.ii + .aa2 {
    color: #000;
}
.ff + .tt{
    padding-top: 15rpx;
}
.ff + #gg {
    color: #000;
}
.cc1 + .ff {
    padding-top: 15rpx;
}
.cc3 + .ff {
    padding-top: 15rpx;
}
.cc3 + #oo {
    padding-top: 15rpx;
}
</style>
