<template>
    <div>
        <!-- <div class="uu"></div>
        <block v-for="(detail, index2) in rr" :key="index2">
            <view class="ff" v-if="xx"> </view>
            <view class="ww" id='ww'> </view>
        </block>
        <div class="ui"></div>
        <div v-for="(detail, index2) in rr" :key="index2" class="fq">
            <div v-for="(detail, index2) in rr" :key="index2" class="fe">
            </div>
        </div>
        <div class="ug"></div>
        <view class="ff" v-if="xx"> </view>
        <view class="ww" id='ww'> </view> -->
        <div class="tt"></div>
        <block v-if="ww">
            <view class="ff1" v-if="gt"> </view>
            <view class="ww1" id='ww1'> </view>
        </block>
        <block v-else>
            <view class="ff2"> </view>
            <view class="ww2" id='ww2'> </view>
        </block>
         <!-- <block v-else>
            <view class="ff2" > </view>
            <view class="ww2" id='ww2'> </view>
        </block> -->
        <!-- <div class="lo"></div> -->
        <!-- <block v-for="(detail, index2) in rr" :key="index2">
            <view class="ff" v-if="xx"> </view>
            <view class="ww" id='ww'> </view>
        </block> -->
    </div>
</template>

<script></script>
<style lang="scss">
.ff1 + .ww1{
    color: #000;
}
// .tt + .ff1 {
//     color: #000;
// }
// .ug + .ff{
//     color: #000;
// }
// .ug + .ww{
//     color: #000;
// }
// .uu + .ww {
//     color: #000;
// }
// .uu + #ww {
//     color: #000;
// }
// .fe + .fe{
//     color: red;
// }
// .fq .fe{
//     color: #000;
// }
</style>
