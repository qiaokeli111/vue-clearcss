<template>
    <view class="area-filter">
        <view class="area-filter__container">
            <scroll-view
                scroll-y="true"
                class="area-filter__left"
            >
                <left-list
                    :list-data="areaListData"
                    :list-index.sync="areaListIndexData"
                />
            </scroll-view>
            <view class="area-filter__right">
                <!-- 城区筛选 -->
                <view
                    v-if="areaListIndexData === 0"
                    class="area__right-town"
                >
                    <block v-if="areaStyle === 3">
                        <scroll-view
                            scroll-y="true"
                            class="right-town__first"
                        >
                            <view style="padding-bottom: 40rpx;">
                                <ButtonList
                                    :list-data="townListData"
                                    @onChange="onChange"
                                />
                            </view>
                        </scroll-view>
                    </block>
                    <!-- 地图找房筛选 -->
                    <block v-else>
                        <!-- 武汉商圈筛选 -->
                        <scroll-view
                            scroll-y="true"
                            class="right-town__first"
                            :style="{width:townListIndexData === 0?'100%':'240rpx'}"
                        >
                            <radio-list
                                :list-data="townListData"
                                :list-index.sync="townListIndexData"
                                :width="townListIndexData === 0 ? '240rpx' : '100%'"
                                has-children
                            />
                        </scroll-view>
                        <scroll-view
                            v-if="townListData[townListIndexData] && townListData[townListIndexData].value !== ''"
                            scroll-y="true"
                            class="right-town__second"
                        >
                            <checkbox-list
                                :list-data="bizCircleListData"
                                @onChange="changeBizCircle"
                            />
                        </scroll-view>
                    </block>
                </view>
                <!-- 板块筛选 -->
                <view
                    v-if="areaListIndexData === 1"
                    class="area__right-plate"
                >
                    <scroll-view
                        scroll-y="true"
                        class="right-plate__first"
                    >
                        <view style="padding-bottom: 40rpx;">
                            <ButtonGroupList
                                :listData="plateListData"
                                styleMode="flex"
                                placeholder="更多热门板块，持续更新中…"
                                @onChange="changePlate"
                            />
                        </view>
                    </scroll-view>
                </view>
                <!-- 地铁筛选 -->
                <view
                    v-if="areaListIndexData === 2"
                    class="area__right-train"
                >
                    <scroll-view
                        v-if="trainLineListIndexData !== 0"
                        scroll-y="true"
                        class="right-train__second"
                    >
                        <checkbox-list
                            :list-data="trainTubeListData"
                            @onChange="changeTrainTube"
                        />
                    </scroll-view>
                </view>
                <!-- 附近筛选 -->
                <scroll-view
                    v-if="areaListIndexData === 3"
                    scroll-y="true"
                    class="area__right-nearby"
                >
                    <radio-list
                        :list-data="nearbyListData"
                        :list-index.sync="nearbyListIndexData"
                    />
                </scroll-view>
            </view>
        </view>
        <view class="area-filter__footer">
            <footer-button
                :isNative="isNative"
                :button-list="buttonList"
                @onReset="resetHandle"
                @onSubmit="submitHandle"
                @remove="removeHandle"
            />
        </view>
    </view>
</template>
<style lang="scss">
    .area-filter__right {
        .area__right-town,
        .area__right-train {

            .right-town__second,
            .right-train__second {
                flex: 1;
                background: #fff;
                height: 650rpx;
            }
        }
    }

</style>
