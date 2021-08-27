<template>
    <view class="right">
        <view v-if="item.is_completed == 1" class="rr"> </view>
        <view v-else-if="item.is_completed == 2" class="rr3"> </view>
        <view v-else class="project"> 33 </view>
        <view class="ff">
         
        </view>
    </view>
</template>

<script></script>
<style lang="scss">
.rr + .ff{
    padding-top: 15rpx;
    line-height: 1;
    font-size: 24rpx;
}
</style>
