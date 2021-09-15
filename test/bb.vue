<template>
    <view>
        <view class="page">
            <view
                class="project-top"
            >
                <view
                    class="image-box"
                >
                    <image
                        :src="cover"
                        class="project-image"
                    />
                </view>
                <customNavHeader>
                    <template>
                        <view class="name-box fz-17">
                            房小团-一房一价
                        </view>
                    </template>
                </customNavHeader>
                <view class="top-info">
                    <navigator
                        :url="'/pages/lotteryDetail?id='+lotteryId+'&project_id='+projectId"
                        data-name="楼盘详情"
                        data-type="link"
                        class="project-name"
                        hover-class="none"
                        @click="emptyFunction"
                    >
                        <tex class="text">
                            {{ title }}
                        </tex>
                        一房一价
                    </navigator>
                    <view class="project-info">
                        <navigator
                            class="btn house-price-btn"
                            :url="'/subPackages/project/pages/sourceList?project_id='+projectId+'&lottery_id='+lotteryId+'&name='+title+'&batch_id='+batchId"
                            hover-class="none"
                            data-name="一房一价图"
                            data-type="link"
                            data-content="查看图"
                            @click="emptyFunction"
                        >
                            <text class="text">
                                {{ toHouseOrigin }}
                            </text>
                            <text class="iconnew new-tongyong-gengduo" />
                        </navigator>
                        <navigator
                            v-if="isShowProjectPlan"
                            class="btn"
                            data-name="总平图"
                            data-type="link"
                            data-content="查看图"
                            :url="`/subPackages/project/pages/projectPlanar/index?projectId=${projectId}&projectName=${title}`"
                            hover-class="none"
                            @click="emptyFunction"
                        >
                            <text class="text">
                                总平图
                            </text>
                            <text class="iconnew new-tongyong-gengduo" />
                        </navigator>
                    </view>
                    <view class="call-phone-item">
                        <text class="left-text">
                            装修价格或其他问题，可致电售楼部咨询
                        </text>
                        <BaseCallPhone
                            @onSuccess="callPhone"
                        >
                            <view
                                class="phone-circle"
                                data-name="售楼部电话"
                                data-type="button"
                                data-content="电话咨询"
                                @click="hiddenFilterHandle"
                            >
                                <text class="text">
                                    小团将对您
                                    的电话保密
                                </text>
                                <text class="phone-icon" />
                            </view>
                        </BaseCallPhone>
                    </view>
                </view>
                <view class="top-container">
                    <!--内容的头部上的选项-->
                    <view
                        class="container-top-content"
                        :class="{'active': tabBarLength > 3}"
                    >
                        <block
                            v-for="(item, index) in tabbarList"
                            :key="index"
                        >
                            <view
                                v-if="item.isShow"
                                :class="'filter '+(item.isSelected || tabbarListIndex === index ? 'active' : '')"
                                @click="tabBarHandle(index)"
                            >
                                <text class="text">
                                    {{ item.text }}
                                </text>
                                <text
                                    :class="{'active': tabbarListIndex === index}"
                                    class="iconnew new-zhankai fz-11"
                                />
                            </view>
                        </block>
                    </view>
                </view>
            </view>
            <view
                class="project-top-bg"
                :style="'height:' + sysHeight+ 'px' "
            />

            <!-- 列表 -->
            <view
                class="house-price-container"
            >
                <block v-if=" houseList.length > 0 && !loading ">
                    <!--列表-->
                    <view class="house-price-list">
                        <block
                            v-for="(itemData, index) in houseList"
                            :key="index"
                        >
                            <HousePriceItem
                                :item="itemData"
                                :projectId="projectId"
                                :showSaleStatus="showSaleStatus"
                            />
                        </block>
                        <block v-if=" !more ">
                            <view
                                class="layout-center"
                                style="padding: 20rpx"
                            >
                                <text style="font-size: 28rpx;color: #999999">
                                    我也是有底线的哦~ (๑•́ ₃ •̀๑)
                                </text>
                            </view>
                        </block>
                        <block v-else>
                            <view class="loading-runing">
                                <view class="loading-icon">
                                    <text class="iconnew new-jiazai" />
                                </view>
                                <view class="left-font">
                                    <text>加载中</text>
                                </view>
                            </view>
                        </block>
                    </view>
                </block>
                <block v-else>
                    <view
                        v-if=" loading "
                        class="full-screen"
                    >
                        <view
                            id="spinner"
                            style="margin-top:-200rpx"
                        />
                    </view>
                    <view
                        v-else
                        class="nothing gray-block"
                    >
                        <image
                            src="https://imgcdn.huanjutang.com/assets/img/20190917/5d80af20810ac.png"
                            class="article-nothing"
                            mode="aspectFill"
                        />
                        <view class="fz-13 content">
                            暂无数据～
                        </view>
                    </view>
                </block>
            </view>

            <view
                class="filter-content"
                :style="'top:' + sysHeight + 'px'"
            >
                <HousePriceFilter
                    :tabbarListIndex.sync="tabbarListIndex"
                    :batchId="batchId"
                    @reset="resetHandle"
                    @submit="onFilterSubmit"
                />
            </view>
            <view
                v-if="tabbarListIndex !== -1"
                :class="{
                    'filters__bg': true,
                    'filters__bg-active': tabbarListIndex !== -1
                }"

                :style="'top:' + sysHeight+ 'px' "
                @click.stop="hiddenFilterHandle"
                @touchmove.stop.prevent="stopHandle"
            />
        </view>

        <!-- 分享 -->
        <button
            open-type="share"
            data-type="button"
            data-name="浮窗分享"
            data-content="底部浮窗"
            class="share"
            @click="emptyFunction"
        />
        <!-- 列表/小黄楼切换按钮 -->
        <view
            v-if="!loading"
            data-name="浮窗楼栋"
            data-content="底部浮窗"
            data-type="button"
            class="toggle-list"
            @tap="switchMode"
        />
        <!-- 新手引导 -->
        <view
            v-if="showGuide"
            class="guide-box"
        >
            <view class="text fz-14">
                点击这里切换回楼栋模式
            </view>
        </view>
    </view>
</template>

<style lang="scss">
    .area__right-town,
        .area__right-train {
            display: flex;
            height: 100%;
            overflow: hidden;
        }
</style>


