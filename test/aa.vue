<template>
    <ShareTimelineLayout>
        <view
            :style="{
                '--status-bar-h': statusBarHeight + 'rpx',
                '--nav-header-h': marginTop + 'rpx',
            }"
            :class="{
                'main-container': true,
                'newYear-theme': isNewYearTheme,
                'year-100-party': is100YearsParty,
            }"
        >
            <BusiNavHeader
                ref="busiNavHeader"
                :style="{ '--opacity-top': opacityTop }"
                isTabbarPage
            />

            <view class="top-shadow-scroll" />

            <!-- 添加我的小程序 -->
            <BaseAddMiniApp @onAdd="addMyProgramHandle" />

            <!-- 添加到桌面/浮窗 -->
            <view v-if="showedAddMyprogram">
                <AddDesktop :show.sync="showAddDesktop" />
            </view>

            <!--头部搜索模块-->
            <view
                class="home__search"
                :style="{ '--opacity-top': opacityTop, top: marginTop + 'rpx' }"
            >
                <busi-search
                    to-url="/subPackages/search/pages/index?from=home"
                    class="index-top-search"
                    suspendIcon="https://imgcdn.huanjutang.com/assets/img/20214271149528081.png"
                    mode="tabbar"
                    :input-value="inputPlace"
                    :analysis="{
                        dataName: '首页-搜索框',
                    }"
                    :right-custom-url="customUrl"
                    :left-custom-url="leftcustomUrl"
                >
                    <template
                        slot="searchIcon"
                        style="display: flex"
                    >
                        <image
                            :src="
                                isNewYearTheme
                                    ? 'https://imgcdn.huanjutang.com/file/2021/01/27/fb0dbae5c4886aca2839cd8b9efcb1b3.png'
                                    : 'https://imgcdn.huanjutang.com/image/2020/05/18/9bef8839ce3044147520cbc134096918.png'
                            "
                            class="nav-search__icon"
                        />
                    </template>
                    <BusiSearchSwiper
                        style="flex: 1"
                        :config="hotSearchList.config"
                        :list="hotSearchList.list"
                    />
                    <view
                        slot="suspendIcon"
                        class="nav-search-suspend-wrap"
                        @click.stop="emptyFunction"
                    >
                        <view class="nav-search-suspend-border" />
                        <navigator
                            hover-class="none"
                            :url="customUrl"
                            data-name="地图找房"
                            class="nav-search-suspend"
                            @click="emptyFunction"
                        >
                            <img
                                src="https://imgcdn.huanjutang.com/assets/img/20214271149528081.png"
                                class="nav-search-suspend-icon"
                                alt=""
                                srcset=""
                            >
                        </navigator>
                    </view>
                </busi-search>
            </view>

            <!-- 页面 -->
            <view class="page">
                <!-- banner模块 -->
                <view class="bannerModule">
                    <img
                        :src="is100YearsParty ? 'https://imgcdn.huanjutang.com/assets/img/20216301322487887.png' : 'https://imgcdn.huanjutang.com/assets/img/20214211952298081.png'"
                        class="top-shadow"
                    >
                    <BaseBanner
                        source="home"
                        :dataApi="banners.list"
                        :config="banners.config"
                        @swiperNavHandle="swiperNavHandle"
                    />
                </view>

                <!--活动-->
                <view
                    v-if="activity"
                    :class="{activityModule: activity.middleBanner.list.length>0}"
                    class="activity__container"
                >
                    <BusiActivity
                        :dataApi="activity"
                        @close="closeHandle"
                    />
                </view>

                <!-- 九宫格导航 -->
                <view class="grid-middle">
                    <BusiGrid
                        :dataApi="grids"
                        :topApi="top"
                    />
                </view>

                <!-- 头条新闻部分 -->
                <view
                    v-if="listData.length > 0"
                    class="news"
                >
                    <BusiNews :dataApi="listData" />
                </view>

                <!--魔方模块-->
                <view
                    v-if="cube.code && cube.detail.length > 0"
                    class="cube"
                >
                    <BusiCube :dataApi="cube" />
                </view>

                <!-- 热门推荐 -->
                <view
                    v-if="hasShowHotRecommend"
                    class="project-hot-new"
                    :style="{
                        'margin-bottom': recommendBanners.list.length === 0 ? '32rpx' : 0
                    }"
                >
                    <view class="select-title select-title--sb">
                        <text class="fz-20 font-bold">
                            热门推荐
                        </text>
                        <view
                            v-if="recommendList.length > 3"
                            id="hotRecommendMore"
                            data-name="更多热门推荐"
                            data-content="热门推荐"
                            data-type="link"
                            @tap="
                                jumpUrlHandle(
                                    '/subPackages/project/pages/hotRecommend?type=hotRecommend&title=热门推荐',
                                    '热门推荐-更多'
                                )
                            "
                        >
                            <text class="fz-12 gray-96">
                                查看更多
                            </text><text class="iconnew new-tongyong-gengduo fz-10 gray-96" />
                        </view>
                    </view>
                    <view class="hot_recommend__list">
                        <ProjectItem
                            adSource="hotRecommend"
                            adType="order"
                            sourcePosition="home"
                            content="index_hot_top"
                            :items="tabContentNew"
                            titleData="热门推荐"
                        />
                    </view>
                    <HomeProjectItem
                        v-if="tabContent.length > 0"
                        content="index_hot_bottom"
                        :itemsData="tabContent"
                        titleData="热门推荐"
                    />
                </view>
                <!--广告图片-->
                <view
                    v-if="recommendBanners.list.length > 0"
                    class="recommendBanner"
                >
                    <BaseBanner
                        source="home"
                        :height="136"
                        :dataApi="recommendBanners.list"
                        :config="recommendBanners.config"
                        :swiperDots="false"
                        @swiperNavHandle="swiperNavHandle"
                    />
                </view>

                <!-- 一些列表的预览 -->
                <ListPreview
                    :topApi="top"
                    :sliceRange="[0,1]"
                    :showTopborder="recommendBanners.list.length <= 0"
                />

                <!--优秀置业顾问-->
                <view
                    v-if="sales_man_data.length > 0"
                    class="sales_man block-bottom-bg"
                >
                    <block v-if=" recommend_rule && is_sales_man_id > 0">
                        <navigator
                            :url="recommend_rule"
                            hover-class="none"
                            class="select-title sales-man-title"
                        >
                            <text class="fz-20 font-bold">
                                优秀顾问推荐
                            </text>
                            <text class="iconnew new-wenhaocopy fz-18 gray-9-color" />
                        </navigator>
                    </block>
                    <block v-else>
                        <view class="select-title sales-man-title">
                            <text class="fz-20 font-bold">
                                优秀顾问推荐
                            </text>
                        </view>
                    </block>

                    <view class="sales_man_cont">
                        <MiniSalesCard
                            :showIcon="false"
                            :list="sales_man_data"
                            style="width: 100%"
                        />
                    </view>
                </view>
                <!-- 一些列表的预览 -->
                <ListPreview
                    :topApi="top"
                    :sliceRange="[1,3]"
                />

                <!--栏目管理模块-->
                <view
                    v-if="sectionsUpdate && sections.length > 0"
                    class="columnModule"
                >
                    <BusiColumn
                        ref="column"
                        :margin-top="114 + marginTop + 'rpx'"
                        :dataApi.sync="sections"
                        :titleData="'首页-' + latestOpeningObj.titleStr"
                    />
                </view>
                <!--弹框广告-->
                <view
                    v-if="isShow"
                    class="advertise-hide"
                    catchtouchmove="ture"
                    @click.stop="closeHideHandle"
                >
                    <view
                        class="adertise-wrap"
                        :style="
                            'height:' +
                                adWrapHeight +
                                'px; top:' +
                                (marginTop - 12) +
                                'rpx'
                        "
                    >
                        <view class="adertise-box">
                            <view class="white-color">
                                广告
                            </view>
                            <view
                                class="advertise_close-button"
                                @click.stop="closeHideHandle"
                            >
                                跳过 {{ second }}
                            </view>
                            <view
                                class="advertise"
                                data-custom-event-name="AD_click"
                                data-custom-prop-ad_medium="小程序"
                                data-custom-prop-ad_type="mask"
                                data-custom-prop-ad_source="home"
                                :data-custom-prop-ad_code="
                                    advertisingBanner.ad_code
                                "
                                :data-custom-prop-ad_nike_name="
                                    advertisingBanner.ad_nike_name
                                "
                                :data-custom-prop-ad_number="
                                    advertisingBanner.ad_number
                                "
                                :data-custom-prop-ad_keyword="
                                    advertisingBanner.project_name
                                "
                                @click.stop="
                                    goToUrlHandle(advertisingBanner.url)
                                "
                            >
                                <image
                                    :src="advertisingBanner.image"
                                    mode="widthFix"
                                />
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 广告浮窗 -->
                <AdFloatWindow
                    v-if="isAdOpen"
                    class="skeletons-rect"
                    :bottom="AdFloatWindowBottom"
                    :adFloatWindowImg="adFloatWindowImg"
                    :adFloatWindowUrl="adFloatWindowUrl"
                />
            </view>
            <!--新手指引-->
            <view
                v-if="guideImg.length > 0"
                class="guide"
                catchtouchmove="stopMove"
            >
                <image
                    lazy-load="true"
                    :src="guideImg[guideImgIndex]"
                    mode="widthFix"
                    class="backImg gray-bg"
                    :style="'z-index:' + (100 - guideImgIndex) + ';'"
                    @click.stop="nextGuideImage"
                />
            </view>
        </view>
    </ShareTimelineLayout>
</template>

<script>
    import URI from 'urijs';
    import BaseBanner from '@/components/BaseBanner';
    import ProjectItem from '@/components/ProjectItem/ProjectItem';
    import RiskManagement from '@/plugin/riskManagement';
    import BusiNavHeader from '@/components/UILayout/BusiNavHeader';
    import BusiSearchSwiper from '@/pages/components/BusiSearchSwiper.vue';
    import ListPreview from '@/pages/components/ListPreview.vue';
    import BusiSearch from '../components/UILayout/BusiSearch.vue';
    import api from '../api/api';
    import { share } from '../utils/utilsKit/index';
    import { transformDeviceUnit, pageJump } from '../utils/util';
    import MiniSalesCard from '../components/MiniSalesmanCard.vue';
    import BaseAddMiniApp from '../components/BaseAddMiniApp.vue';
    import AddDesktop from './components/AddDesktop.vue';
    import AdFloatWindow from '../components/AdFloatWindow.vue';

    import BusiCube from './components/BusiCube.vue';
    import BusiColumn from './components/BusiColumn.vue';
    import BusiGrid from './components/BusiGrid.vue';
    import BusiNews from './components/BusiNews.vue';
    import HomeProjectItem from '../components/HomeProjectItem.vue';
    import BusiActivity from './components/BusiActivity.vue';
    import ShareTimelineLayout from '../components/ShareTimelineLayout.vue';
    // import ThirdArticleVue from '../subPackages/discovery/component/ThirdArticle.vue';

    const globalModel = require('../models/GlobalModel');

    const titleStr = {
        chengdu: '最新取证',
        hangzhou: '正在公示',
        nanjing: '最新销许',
        wuhan: '交资料中'
    };

    export default {
        components: {
            BusiNavHeader,
            MiniSalesCard,
            BaseAddMiniApp,
            AddDesktop,
            AdFloatWindow,
            BusiGrid,
            BaseBanner,
            BusiCube,
            BusiColumn,
            BusiNews,
            ProjectItem,
            BusiActivity,
            HomeProjectItem,
            BusiSearch,
            BusiSearchSwiper,
            ShareTimelineLayout,
            ListPreview
        },

        data() {
            const grids = uni.getStorageSync('index_grid_cache');
            const top = uni.getStorageSync('index_top_cache');
            const themeType = uni.getStorageSync('index_theme_type');

            // 获取statusBarHeight
            const info = uni.getSystemInfoSync();
            const navHeight = info.statusBarHeight + 44;
            const { statusBarHeight } = info;
            // 6 = (44:titlebar 的高 - 32胶囊的高) / 2
            const height = info.windowHeight - navHeight + 6;
            const cube = uni.getStorageSync('index_cube_cache');

            return {
                customUrl: '/subPackages/project/pages/mapLookHouse',
                leftcustomUrl: '/subPackages/news/pages/morningPaper',
                hotSearchList: {
                    list: [],
                    config: {}
                },
                scrollPage: false,
                upDataCotent: '',
                showUpdataView: false,
                inputShowed: false,
                midInputPlace: '',

                type: 1,
                banners: {
                    list: [{}],
                    config: {}
                },
                // 首页banner
                top: top || new Array(5).fill({ skeleton: true }),
                // 宫格
                grids: grids || new Array(10).fill({ skeleton: true }),
                // 统计数部分
                // 导航图标
                isAdOpen: false,
                AdFloatWindowBottom: '24rpx',
                adFloatWindowImg: '',
                // 广告浮窗图片
                adFloatWindowUrl: '',
                // 头条新闻
                listData: [{ skeleton: true }],
                sales_man_data: [],
                recommend_rule: '',
                recommendBanners: {
                    list: [{ skeleton: true }],
                    config: {}
                },
                // 楼盘、优质推荐切换
                tabIndex: 1,
                recommendList: [],
                tabContent: [],
                tabContentNew: [],
                isShow: false,
                second: '', // 广告默认展示3秒
                timer: null,
                advertisingBanner: {},
                // 添加我的小程序弹窗
                hideTip: true,
                // 新手指引
                guideImg: [],
                guideImgIndex: 0,
                guideShow: false,
                is_sales_man_id: '',
                upDataVersion: '',
                controlModle: [],
                showAddDesktop: false,
                // 显示是否添加到桌面/浮窗
                showAddMyProgram: false,
                // 显示添加到我的小程序弹窗;
                showedAddMyprogram: false,
                // 今天是否显示过了‘添加到我的小程序’了
                latestOpeningObj: {
                    // eslint-disable-next-line dot-notation
                    titleStr: titleStr['__CITY_NAME__'],
                    // eslint-disable-next-line dot-notation
                    url: `/pages/latestOpeningMore/index?type=10&title=${titleStr['__CITY_NAME__']}`,
                    // eslint-disable-next-line dot-notation
                    param: `${titleStr['__CITY_NAME__']}-更多`
                },
                // 栏目
                sections: [],
                sectionsUpdate: true,
                // 魔方（默认占位图）
                cube: cube || {
                    code: 'skeletons',
                    style_name: 'penta_cube',
                    detail: new Array(5).fill({ skeleton: true })
                },
                // 活动
                activity: null,
                isShowActivity: false,
                // 点击底部首页bar 触发回到顶部
                isLeave: false,
                isShareShow: true,
                shareHide: null,
                shareShow: null,
                marginTop: transformDeviceUnit(navHeight - 2),
                adWrapHeight: height,
                shareTimelineParam: {},
                opacityTop: 0,
                statusBarHeight: `${transformDeviceUnit(statusBarHeight)}`,
                themeType: themeType || 'default'
            };
        },

        computed: {
            inputPlace() {
                return this.midInputPlace;
            },

            isNewYearTheme() {
                return this.themeType === 'new_year';
            },

            is100YearsParty() {
                return this.themeType === '100_year_party';
            },

            hasShowHotRecommend() {
                return (
                    this.controlModle[1]
                    && this.controlModle[1].module === 'hot_recommend'
                    && Math.floor(this.controlModle[1].is_show) === 1
                    && this.recommendList.length > 0
                );
            }
        },

        watch: {
            '$store.state.system.searchPlaceholder': {
                handler() {
                    this.midInputPlace = this.$store.state.system.searchPlaceholder;
                },
                immediate: true
            }
        },

        onShareAppMessage() {
            return share.share('我在这里查摇号结果，好方便哦', '/pages/index');
        },

        onHide() {
            this.isLeave = true;
        },

        onShow() {
            // 更新红点逻辑
            this.$store.dispatch('chat/getUnReadMessage');
            this.$store.dispatch('chat/getUnReadCustomerMessage');
        },

        onPullDownRefresh() {
            this.reload();
            uni.stopPullDownRefresh();
        },

        onReachBottom() {
            if (this.$refs.column) {
                this.$refs.column.reachBottom();
            }
        },

        onPageScroll(e) {
            const { scrollTop } = e;
            if (this.isNewYearTheme && this.$refs.busiNavHeader) {
                this.setNavHeader(scrollTop);
            }
            if (this.$refs.column) {
                this.$refs.column.scrollTop = scrollTop;
            }

            if (this.$refs.share) {
                this.$refs.share.pageScroll(e);
            }

            // 滚动修改navheader样式
            if (e.scrollTop > 12) {
                this.scrollPage = true;
            } else {
                this.scrollPage = false;
            }
        },

        onShareTimeline() {
            return share.shareTimeline(
                this.shareTimelineParam.title,
                {
                    shareTimeline: this.shareTimelineParam.content_image
                },
                this.shareTimelineParam.share_image
            );
        },

        onTabItemTap() {
            this.hideTip = globalModel.isAddMyProgram();
            if (this.isLeave) {
                this.isLeave = false;
            } else {
                uni.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                });
                this.reload();
            }
        },
        mounted() {
            this.themeInit();
        },

        async onLoad(options) {
            if (options.hid) {
                const res = await api.getDecodeHashParams(options.hid);
                if (res && res.data) {
                    options = res
                        ? URI(`?${decodeURIComponent(res.data.path)}`).search(true)
                        : options;
                }
            }

            // 如果有跳转链接就直接跳转
            if (options.redirect) {
                // 在风控类内部进行重定向
                const riskInstance = new RiskManagement(options);
                riskInstance.check();
            }

            // 控制添加我的小程序
            this.hideTip = globalModel.isAddMyProgram();

            this.firstPageLoad()
                .then(() => this.secondPageLoad())
                .then(() => this.threePageLoad())
                .then(() => this.lastPageLoad())
                .then(() => this.$nextTick(() => {
                    this.loadIsSalesMan();
                    this.loadUIActivity();
                    this.loadGuide();
                    this.showAD();

                    api.getShareTimelineParam('index').then(res => {
                        if (res.data) {
                            this.shareTimelineParam = res.data;
                        }
                    });
                }));
        },

        methods: {
            setNavHeader(scrollTop) {
                if (this.isNewYearTheme) {
                    this.opacityTop = scrollTop / 44 >= 1 ? 1 : (scrollTop / 44).toFixed(1);
                }
            },
            emptyFunction() {},

            themeInit() {
                // if (this.isNewYearTheme && this.$refs.busiNavHeader) {
                //     this.$refs.busiNavHeader.setTransparentMode();
                // } else {
                //     this.$refs.busiNavHeader.setWhiteMode();
                // }
                if (this.$refs.busiNavHeader) {
                    this.$refs.busiNavHeader.setTransparentMode();
                }
            },

            closeHandle() {
                // 关闭弹窗，显示分享按钮
                this.isShowActivity = false;
            },

            addMyProgramHandle() {
                setTimeout(() => {
                    this.showedAddMyprogram = true;
                }, 1500);
            },

            jumpUrlHandle(url) {
                uni.showLoading({
                    title: '',
                    mask: true
                });

                const self = this;
                uni.navigateTo({
                    url,
                    complete() {
                        self.hideLoading();
                    }
                });
            },

            closeUpdateHandle() {
                this.showUpdataView = false;
            },

            nextGuideImage() {
                const next = this.guideImgIndex + 1;
                if (!this.guideImg[next]) {
                    this.closeDirectHandle();
                    return;
                }
                this.guideImgIndex += 1;
            },

            closeDirectHandle() {
                this.guideImg = [];
            },

            // 500ms 解决微信7.0.10bug
            hideLoading() {
                setTimeout(() => {
                    uni.hideLoading();
                }, 500);
            },

            goToUrlHandle(url) {
                this.isShow = false;
                pageJump(url);
            },

            closeHideHandle() {
                this.isShow = false;
            },

            swiperNavHandle(url) {
                pageJump(url);
            },

            /**
             * 首屏加载逻辑
             * 1. 加载首页banner、金刚区按钮、魔方
             * 2. 渲染金刚区 + 魔方
             * 3. 等第2步渲染完，再渲染banner
             * 4. 加载滚动条词
             */
            firstPageLoad() {
                return new Promise(resolve => {
                    Promise.all([
                        api.getBanner('home-top-banner'), // 首页 banner
                        api.indexPage.topGrids(), // 金刚区按钮
                        api.cubeDetail({ location: 'home' }) // 魔方
                    ])
                        .then(results => {
                            const [
                                homeTopBannerRes,
                                topGridsRes,
                                cubeRes
                            ] = results;

                            if (topGridsRes && topGridsRes.data) {
                                this.top = topGridsRes.data.top;
                                this.grids = topGridsRes.data.grids;

                                // 将top和grids做一个缓存
                                uni.setStorage({
                                    key: 'index_grid_cache',
                                    data: this.grids
                                });
                                uni.setStorage({
                                    key: 'index_top_cache',
                                    data: this.top
                                });
                            }

                            if (cubeRes.data) {
                                this.cube = cubeRes.data;
                                uni.setStorage({
                                    key: 'index_cube_cache',
                                    data: this.cube
                                });
                            }

                            this.$nextTick(() => {
                                this.banners = homeTopBannerRes.data;

                                // 请求滚动词的新接口
                                api.getBanner('search--search').then(searchRes => {
                                    if (searchRes && searchRes.data) {
                                        this.hotSearchList = searchRes.data;
                                    }
                                });
                            });

                            resolve();
                        })
                        .catch(resolve);
                });
            },

            /**
             * 第二屏加载逻辑
             * 1. 加载热门推荐、头条、推荐置业顾问、规则等
             */
            secondPageLoad() {
                return new Promise(resolve => {
                    Promise.all([
                        api.getBannerProjectList({ page: 1, size: 4 }), // 热门推荐
                        api.indexPage.indexConfig() // 头条、推荐置业顾问数据、推荐规则
                    ])
                        .then(results => {
                            const [recommendProjectRes, indexConfigRes] = results;
                            //  把小团头条的列表和销许预告的列表合并在一起，且优先展示销许的
                            this.listData = [
                                ...(indexConfigRes?.data?.sale_advances || []).map(e => ({
                                    ...e,
                                    titleType: 'sale_advances',
                                    iconUrl: indexConfigRes?.data?.icon?.sale_advance || 'https://imgcdn.huanjutang.com/assets/img/2021891049538081.png'
                                })),
                                ...(indexConfigRes?.data?.announcement || []).map(e => ({
                                    ...e,
                                    titleType: 'announcement',
                                    iconUrl: indexConfigRes?.data?.icon?.announcement || 'https://imgcdn.huanjutang.com/assets/img/2021891049308081.png'
                                })),
                            ];

                            if (recommendProjectRes.data) {
                                const recommendProjects = recommendProjectRes.data
                                    .list
                                    ? recommendProjectRes.data.list
                                    : []; // 热门推荐
                                this.recommendList = recommendProjects;
                                this.tabContentNew = recommendProjects.slice(0, 1);
                                this.tabContent = recommendProjects.slice(1);
                            }

                            // 等待热门推荐加载完再加载推荐置业顾问
                            this.$nextTick(() => {
                                resolve();
                                this.sales_man_data = indexConfigRes.data.sales_man_data || [];
                                this.recommend_rule = indexConfigRes.data.recommend_rule;
                            });
                        })
                        .catch(resolve);
                });
            },

            threePageLoad() {
                return new Promise(resolve => {
                    Promise.all([
                        api.getBanner('home-tinny-banner'), // 推荐banner
                        api.section.section() // 栏目
                    ])
                        .then(results => {
                            const [smallBannerRes, sectionsRes] = results;

                            this.sectionsUpdate = false;
                            this.sections = sectionsRes.data;

                            this.$nextTick(() => {
                                resolve();
                                this.recommendBanners = smallBannerRes.data;
                                this.sectionsUpdate = true;
                            });
                        })
                        .catch(resolve);
                });
            },

            lastPageLoad() {
                Promise.all([
                    api.getlotActivity(), // 加载活动
                    api.mapSetting(), // 加载主题
                    api.indexBoxIsShow() // 加载页面控制开关
                ]).then(results => {
                    const [activityRes, settingsRes, controlRes] = results;

                    // 缓存主题
                    if (settingsRes.data && settingsRes.data.theme_type) {
                        this.themeType = settingsRes.data.theme_type;
                        uni.setStorage({
                            key: 'index_theme_type',
                            data: this.themeType
                        });
                        this.themeInit();
                    }

                    // 活动浮窗
                    if (activityRes.data && activityRes.data.suspend_bottom) {
                        this.isAdOpen = !Array.isArray(activityRes.data);
                        this.adFloatWindowImg = activityRes.data.suspend_bottom.img[0] || '';
                        this.adFloatWindowUrl = activityRes.data.suspend_bottom.url;
                    }

                    if (controlRes && controlRes.data) {
                        this.controlModle = controlRes.data || [];
                    }
                });
            },

            async reload() {
                uni.showLoading({
                    title: '加载中...'
                });

                this.firstPageLoad()
                    .then(() => this.secondPageLoad())
                    .then(() => this.threePageLoad())
                    .then(() => this.lastPageLoad());

                uni.hideLoading();
            },

            loadGuide() {
                api.getGuideImage('app_index').then(guideImages => {
                    this.guideImg = guideImages.data; // 引导
                });
            },

            loadIsSalesMan() {
                api.isSaleMan().then(isSaleMan => {
                    this.is_sales_man_id = isSaleMan.sales_man_id || '';
                });
            },

            async loadUIActivity() {
                const [middle, hover] = await Promise.all([
                    api.getBanner('home-middle-banner'),
                    api.getBanner('home--hover')
                ]);
                const middleBanner = middle.data || { list: [], config: {} };
                let hoverBanner = null;

                if (
                    hover.data
                    && Array.isArray(hover.data.list)
                    && hover.data.list.length > 0
                ) {
                    [hoverBanner] = hover.data.list;
                }
                this.activity = {
                    middleBanner,
                    hoverBanner
                };
                if (this.activity.hoverBanner) {
                    this.isShowActivity = true;
                }
            },

            showAD() {
                api.getBanner('home--mask').then(res => {
                    const self = this;
                    if (
                        res.data
                        && Array.isArray(res.data.list)
                        && res.data.list.length > 0
                    ) {
                        const advertisingBanner = res.data.list[0];
                        uni.downloadFile({
                            url: advertisingBanner.image,
                            success(downloadRes) {
                                self.advertisingBanner = {
                                    ...advertisingBanner,
                                    image: downloadRes.tempFilePath
                                };
                                self.isShow = true;
                                if (
                                    res.data.config
                                    && res.data.config.stay_duration
                                ) {
                                    // 倒计时
                                    self.second = Math.round(
                                        res.data.config.stay_duration
                                    );
                                    self.timer = setInterval(() => {
                                        if (self.second === 0) {
                                            clearInterval(self.timer);
                                            self.timer = null;
                                            self.isShow = false;
                                        }
                                        self.second -= 1;
                                    }, 1000);

                                    self.$once('hook:beforeDestory', () => {
                                        self.timer = null;
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    };
</script>

<style lang="scss">

.page {
    margin-top: 122rpx;
    background: #fff;

    >.activity__container {
        position: relative;
        z-index: 100;
    }

    >.grid-middle {
        position: relative;
        z-index: 2;
    }
}
.main-container {
    background: #115CEB;
}
.adertise-wrap {
    width: auto;
    height: auto;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.home__search {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
}

.bannerModule {
    position: relative;
    padding: 0rpx 32rpx 0;
    z-index: 1;
}

.activityModule {
    margin: 32rpx 32rpx 0;
}

.recommendBanner {
    padding: 0 32rpx;
    margin-top: 32rpx;
}

.recommendBanner__swiper {
    height: 136rpx;
}

.recommendBanner__swiper__img {
    width: 100%;
    height: 136rpx;
    border-radius: 8rpx;
}

.recommendBanner__swiper__avr {
    font-size: 18rpx;
    line-height: 26rpx;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    width: 50rpx;
    height: 26rpx;
    position: absolute;
    right: 20rpx;
    bottom: 15rpx;
    z-index: 222;
    border-radius: 1rpx;
    opacity: 0.4;
}
.hot_recommend__list {
    margin: 0 32rpx;
}
.columnModule {
    border-top: 16rpx solid rgba(0, 0, 0, 0.03);
    swiper-item {
        box-sizing: border-box;
        padding: 0 32rpx;
    }
}
.cube {
    margin: 32rpx 32rpx 0;
}
.news {
    // margin: 12rpx 32rpx 0;
    border-bottom: 16rpx solid rgba(0, 0, 0, 0.03);
}
</style>
<style lang="scss">
@import "../static/style/strangerGuide.scss";
::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
}
.relative {
    position: relative;
}

/* 添加到我的小程序 */
.tip-bg {
    position: fixed;
    left: 0;
    top: 0;
}

/* 热门推荐样式 */
.project-hot-new {
    width: 100%;
    overflow: hidden;
}
.project-hot-new .select-tab {
    line-height: 1;
    overflow: hidden;
}
.project-hot-new .select-tab .list {
    display: flex;
    flex-direction: column;
    align-items: center;
    float: left;
    padding: 50rpx 0 24rpx;
    width: 50%;
    overflow: hidden;
}
.project-hot-new .select-tab .list .text {
    padding-bottom: 15rpx;
    color: #999 !important;
}
.project-hot-new .select-tab .list .line {
    width: 60rpx;
    height: 4rpx;
    background-color: transparent;
}
.project-hot-new .select-tab .list.active .text {
    color: #333 !important;
}
.project-hot-new .select-tab .list.active .line {
    background-color: #3772cc;
}

/* 弹框广告 */
.advertise-hide {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.65);
    z-index: 10000;
}
.adertise-box {
    width: 650rpx;
    position: relative;
    border-radius: 12rpx;
    top: 0;
}
.adertise-box > .white-color {
    font-size: 18rpx;
    line-height: 1;
    background: rgba(48, 50, 55, 0.4);
    padding: 4rpx 8rpx;
    position: absolute;
    right: 24rpx;
    bottom: 15rpx;
    z-index: 999;
    border-radius: 4rpx;
}

.advertise-hide .advertise {
    width: 100%;
    height: 100%;
}
.advertise_close-button {
    position: absolute;
    width: 120rpx;
    height: 60rpx;
    background: rgba(48, 50, 55, 0.4);
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.9);
    font-size: 28rpx;
    z-index: 999;
    top: 24rpx;
    right: 24rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.2);
}
.advertise {
    border-radius: 20rpx;
    position: relative;
    z-index: 223;
    overflow: hidden;
}
.advertise image {
    width: 100%;
    height: 100%;
    display: block;
}
.select-title {
    padding: 32rpx;
    display: -webkit-box;
    align-items: center;
    display: flex;
    justify-content: flex-start;
    line-height: 1;
    color: rgba(0, 0, 0, 0.85);
    line-height: 52rpx;
}
.select-title--sb {
    justify-content: space-between;
}
.select-title .new-tongyong-gengduo {
    margin-left: 4rpx;
    vertical-align: middle;
}
.select-title .new-wenhaocopy {
    margin-left: 16rpx;
    font-weight: 400rpx;
}
.select-title navigator > text {
    vertical-align: middle;
}
/* 置业顾问样式 */
.sales_man {
    padding: 0 32rpx;
    margin-bottom: 30rpx;
    overflow: hidden;
    border-top: 16rpx solid rgba(0, 0, 0, 0.03);
}
.sales_man .sales_man_cont {
    width: 100%;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
}
.sales-man-title {
    position: relative;
    padding-left: 0;
}

/* 更新提示框 */
.upDataBox {
    display: -webkit-box;
    /*-webkit-box-orient:horizontal;*/
    -webkit-box-pack: center;
    -webkit-box-align: center;
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 222;
}
.showUpdata-bg {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    top: 0;
    z-index: 223;
}
.showUpdata {
    width: 600rpx;
    position: relative;
    text-align: center;
}
.showUpdata image {
    width: 100%;
    border-radius: 8rpx;
    left: 0;
    top: 0;
    position: relative;
    z-index: 225;
}
.showUpdata .showUpdata-num {
    padding-top: 140rpx;
}
.showUpdata-cont {
    margin-top: 45rpx;
}
.showUpdata-btn {
    margin-top: 105rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 80rpx;
    border: 1rpx solid #f7776a;
    display: inline-block;
    color: #f7776a;
    padding: 0 140rpx;
    margin-bottom: 52rpx;
}
.showUpdata .upData-cont-box {
    width: 600rpx;
    background: #fff;
    z-index: 224;
    position: relative;
    text-align: relative;
    border-bottom-left-radius: 8rpx;
    border-bottom-right-radius: 8rpx;
    padding: 0rpx 70rpx 0;
    box-sizing: border-box;
    top: -60rpx;
}
.close-btn {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -40rpx;
    z-index: 225;
    border: 1rpx solid #fff;
    height: 64rpx;
    line-height: 64rpx;
    width: 64rpx;
    text-align: center;
    border-radius: 64rpx;
}
.page__bd {
    margin-bottom: 0;
    position: relative;
    z-index: 220;
}

.nav-search__input {
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.45);
    margin-left: 12rpx;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: 500;
    max-width: 404rpx;
}

.nav-search__icon {
    width: 32rpx;
    height: 32rpx;
    margin-left: 28rpx;
}

.nav-search__map {
    font-size: 32rpx;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-left: 6rpx;
    line-height: 36rpx;
}

.nav-search__icon--map {
    color: rgba(0, 0, 0, 0.85);
    font-size: 40rpx;
    font-weight: 500;
    margin-left: 32rpx;
}

.nav-search-suspend-wrap{
    position: absolute;
    right: 0rpx;
    margin: 14rpx 0;
    height: 48rpx;
    width: 88rpx;
    top: 0;
    display: flex;
    align-items: center;
}
.nav-search-suspend-border{
        height: 30rpx;
        width: 2rpx;
        background: #F2F2F2;
    }
.nav-search-suspend{
    height: 48rpx;
    width: 88rpx;
    .nav-search-suspend-icon{
        height: 48rpx;
        width: 48rpx;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
}
.top-shadow {
    height: 206rpx;
    position: absolute;
    top: -60rpx;
    left: 0;
    width: 100%;
}
.top-shadow-scroll {
    height: calc(114rpx + var(--nav-header-h));
    background: url('https://imgcdn.huanjutang.com/assets/img/20214211952328081.png');
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 200;
    background-size: 100% 100%;
}

.year-100-party {
    background: #BA1110 !important;
    .search-bar__form {
        &.search-bar__form--tabbar {
            box-shadow: 0px 0px 20rpx 0px #E11D18 !important;
        }
    }
    .top-shadow-scroll {
        background: url('https://imgcdn.huanjutang.com/assets/img/20216301322488081.png');
        background-size: 100% 100%;
    }
}

</style>
