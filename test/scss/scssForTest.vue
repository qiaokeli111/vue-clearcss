<template>
    <div>
        <div class="uu"></div>
        <block v-for="(detail, index2) in rr" :key="index2">
            <view class="ff" v-if="xx"> </view>
            <view class="ww"> </view>
        </block>
        <div class="ui"></div>
    </div>
</template>

<script>
</script>
<style lang="scss">
    .uu ~ .ui {
        color: #000;
    }

    .uu ~ .ff {
        color: #000;
    }

    .uu + .ff {
        color: #000;
    }

    .uu ~ .ww {
        color: #000;
    }

    .uu + .ww {
        color: #000;
    }

    .ff {
        padding: 28rpx 32rpx;
        & ~ .ff {
            border-top: 1rpx solid rgba(0, 0, 0, 0.07);
        }
    }

    .ff {
        padding: 28rpx 32rpx;
        & ~ .ww {
            border-top: 1rpx solid rgba(0, 0, 0, 0.07);
        }
    }

    .ff {
        padding: 28rpx 32rpx;
        & + .ww {
            border-top: 1rpx solid rgba(0, 0, 0, 0.07);
        }
    }

    .ff {
        padding: 28rpx 32rpx;
        & ~ .ff {
            border-top: 1rpx solid rgba(0, 0, 0, 0.07);
        }
    }

    .ff {
        padding: 28rpx 32rpx;
        & ~ .ui {
            border-top: 1rpx solid rgba(0, 0, 0, 0.07);
        }
    }
    .ww {
        padding: 28rpx 32rpx;
        & ~ .ui {
            border-top: 1rpx solid rgba(0, 0, 0, 0.07);
        }
    }
    .ww {
        padding: 28rpx 32rpx;
        & + .ui {
            border-top: 1rpx solid rgba(0, 0, 0, 0.07);
        }
    }
</style>
