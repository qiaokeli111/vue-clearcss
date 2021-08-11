
<template>
    <div v-loading="loading" class="app-container">
        <div class="top__nav">
            <div class="top__nav__title">编辑楼盘</div>
            <div class="">
                <!-- 静态使用projects 动态使用projectList -->
                <span class="top__tips">已选中{{ type == 1 ? projects.length : projectList.total }}条数据</span> <el-button type="primary" @click="back">完成编辑</el-button>
            </div>
        </div>
        <div v-if="type == 1" class="common-search white-bg">
            <el-input v-model="listParam.keyword" placeholder="直接输入楼盘关键词或楼盘ID进行搜索" class="input-with-select" @change="loadList">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <div class="filter">
            <div class="filter__top">
                <span>筛选信息(部分项可以多选)</span>
            </div>
            <div class="filter__main">
                <el-row class="filter__main_item">
                    <el-col :span="2">
                        <span class="filter__main__title">区域：</span>
                    </el-col>
                    <el-col :span="20">
                        <el-checkbox v-model="checkAreaAll" label="all" @change="handleCheckAreaAllChange">全部</el-checkbox>
                        <el-checkbox-group v-model="filterParam.district_id" @change="handleCheckedAreaChange">
                            <el-checkbox v-for="(item , index) in district_id" :key="index" :label="item.value">{{ item.text }}</el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-row>
                <el-row class="filter__main_item">
                    <el-col :span="2">
                        <span class="filter__main__title">商圈：</span>
                    </el-col>
                    <el-col :span="20">
                        <BizCircleSelector ref="biz_circle_id" :ids.sync="filterParam.biz_circle_id" :select-biz-list.sync="bizCircleList" @updateIds="handelUpdateIds('biz_circle_id')" />
                    </el-col>
                </el-row>
                <el-row class="filter__main_item">
                    <el-col :span="2">
                         <span class="filter__main__title">价格：</span>
                    </el-col>
                    <el-col :span="20">
                        <el-radio-group
                        v-model="param.priceType"
                        size="mini"
                        @change="switchPrice">
                            <el-radio label="1">单价</el-radio>
                            <el-radio label="2">总价</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <el-row v-if="param.priceType ==1" class="filter__main_item">
                    <el-col :span="2">
                         <span class="filter__main__title">单价区间：</span>
                    </el-col>
                    <el-col :span="20">
                       <el-radio-group v-model="filterParam.price" @change="handleCheckedPriceChange">
                            <el-radio v-for="(item , index) in price" :key="index" :label="item.value">{{ item.text }}</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>

                <el-row v-if="param.priceType ==1" class="filter__main_item">
                    <el-col :span="2">
                         <span class="filter__main__title">单价自定义：</span>
                    </el-col>
                    <el-col :span="6">
                        <div class="flex flex-between">
                            <el-input v-model="param.lowPrice" placeholder="自定义单价最低" size="small" @change="handelPriceChange">
                                <template slot="append">元</template>
                            </el-input>
                            <div class="w50 center"> - </div>
                            <el-input v-model="param.hightPrice" placeholder="自定义单价最高" size="small" @change="handelPriceChange">
                                <template slot="append">元</template>
                            </el-input>
                        </div>
                    </el-col>
                </el-row>

                <el-row class="filter__main_item">
                    <el-col :span="2">
                         <span class="filter__main__title">地铁线：</span>
                    </el-col>
                    <el-col :span="20">
                        <el-checkbox v-model="checkMetroAll" label="all" @change="handleCheckMetroAllChange">全部</el-checkbox>
                        <el-checkbox-group v-model="filterParam.metro_id" @change="handleCheckedMetroChange">
                            <el-checkbox v-for="(item , index) in metro_id" :key="index" :label="item.value">{{ item.text }}</el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-row>

                <el-row class="filter__main_item">
                    <el-col :span="2">
                         <span class="filter__main__title">特色功能：</span>
                    </el-col>
                    <el-col :span="20">
                        <el-checkbox v-model="checkSpecialAll" label="all" @change="handleCheckSpecialAllChange">全部</el-checkbox>
                        <el-checkbox-group v-model="filterParam.not_deficiency" @change="handleCheckedSpecialChange">
                            <el-checkbox v-for="(item , index) in not_deficiency" :key="index" :label="item.value">{{ item.text }}</el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-row>



                <el-row v-if="param.priceType ==2" class="filter__main_item">
                    <el-col :span="2">
                         <span class="filter__main__title">总价区间：</span>
                    </el-col>
                    <el-col :span="20">
                       <el-radio-group v-model="filterParam.total_price" @change="handleCheckedtotal_priceChange">
                            <el-radio v-for="(item , index) in total_price" :key="index" :label="item.value">{{ item.text }}</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>

                <el-row v-if="param.priceType ==2" class="filter__main_item">
                    <el-col :span="2">
                         <span class="filter__main__title">总价自定义：</span>
                    </el-col>
                    <el-col :span="6">
                        <div class="flex flex-between">
                            <el-input v-model="param.lowTotal_price" placeholder="自定义总价最低" size="small" @change="handelPriceChange">
                                <template slot="append">万元</template>
                            </el-input>
                            <div class="w50 center"> - </div>
                            <el-input v-model="param.hightTotal_price" placeholder="自定义总价最高" size="small" @change="handelPriceChange">
                                <template slot="append">万元</template>
                            </el-input>
                        </div>
                    </el-col>
                </el-row>

                <el-row class="filter__main_item">
                    <el-col :span="2">
                         <span class="filter__main__title">面积：</span>
                    </el-col>
                    <el-col :span="20">
                        <el-checkbox v-model="checkSquareAll" label="all" @change="handleCheckSquareAllChange">全部</el-checkbox>
                        <el-checkbox-group v-model="filterParam.square" @change="handleCheckedSquareChange">
                            <el-checkbox v-for="(item , index) in square" :key="index" :label="item.value">{{ item.text }}</el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-row>
                <el-row class="filter__main_item">
                    <el-col :span="2">
                         <span class="filter__main__title">装修：</span>
                    </el-col>
                    <el-col :span="20">
                      <el-radio-group v-model="filterParam.is_decorated" @change="handleCheckedDecorateChange">
                            <el-radio v-for="(item , index) in is_decorated" :key="index" :label="item.value">{{ item.text }}</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <el-row class="filter__main_item">
                    <el-col :span="2">
                         <span class="filter__main__title">物业：</span>
                    </el-col>
                    <el-col :span="20">
                      <el-checkbox v-model="checkPropertyAll" label="all" @change="handleCheckPropertyAllChange">全部</el-checkbox>
                      <el-checkbox-group v-model="filterParam.property_type" @change="handleCheckedPropertyChange">
                            <el-checkbox v-for="(item , index) in property_type" :key="index" :label="item.value">{{ item.text }}</el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-row>
                <el-row class="filter__main_item">
                    <el-col :span="2">
                         <span class="filter__main__title">销售状态：</span>
                    </el-col>
                    <el-col :span="20">
                      <el-radio-group v-model="filterParam.status" @change="handleCheckedStatusChange">
                            <el-radio v-for="(item , index) in status" :key="index" :label="item.value">{{ item.text }}</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
                 <el-row class="filter__main_item">
                    <el-col :span="2">
                        <span class="filter__main__title">选择品牌：</span>
                    </el-col>
                    <el-col :span="20">
                        <brandSelector ref="trademark_id" :ids.sync="filterParam.trademark_id" :trademark-list.sync="trademarkList" @updateIds="handelUpdateIds('trademark_id')" />
                    </el-col>
                </el-row>
                <el-row class="filter__main_item">
                    <el-col :span="2">
                        <span class="filter__main__title">物业公司：</span>
                    </el-col>
                    <el-col :span="20">
                        <PropertyConpanySelector ref="property_company" :ids.sync="filterParam.property_company" :select-company-list.sync="propertyCompanyList" @updateIds="handelUpdateIds('property_company')" />
                    </el-col>
                </el-row>
                <el-row class="filter__main_item">
                    <el-col :span="2">
                        <span class="filter__main__title">开发商：</span>
                    </el-col>
                    <el-col :span="20">
                        <DeveloperSeletor ref="developer" :ids.sync="filterParam.developer" :select-developer-list.sync="developerList" @updateIds="handelUpdateIds('developer')" />
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="check">
            <div class="check__info">共找到{{ projectList.total }}条数据</div>
            <div class="check__cont">
                <!--eslint-disable-next-line vue/no-use-v-if-with-v-for-->
                <template v-for="(item,index) in filterParam" v-if="item!=[] && item!=''">
                    <template v-if="typeof item == 'object'">
                        <div v-for="(per) in item" :key="per" class="check__cont__item">
                            <span> {{ per | filterParam(index) }}</span>
                            <i class="el-icon-error" @click="handleRemoveCondition(index,per.value || per)"></i>
                        </div>
                    </template>
                    <div v-else :key="index" class="check__cont__item">
                        <span> {{ item | filterParam(index) }}</span>
                        <i class="el-icon-error" @click="handleRemoveCondition(index,item)"></i>
                    </div>
                </template>
            </div>
        </div>
        <div class="common-table">
            <el-row v-if="type == 1" class="mb-20">
                <el-col :span="3" :offset="21">
                    <el-button type="primary" @click="selectCurrentPage">当页全选</el-button>
                </el-col>
            </el-row>
            <el-table
                ref="filterTable"
                :data="projectList.data"
                style="width: 100%">
                <el-table-column label="楼盘编号" prop="id"></el-table-column>
                <el-table-column label="楼盘名称" prop="name"></el-table-column>
                <el-table-column label="区域" prop="area">
                    <template slot-scope="scope">
                        {{ scope.row.area | district }}
                    </template>
                </el-table-column>
                <el-table-column label="销售状态" prop="status">
                    <template slot-scope="scope">
                        {{ scope.row.status | status }}
                    </template>
                </el-table-column>
                <el-table-column label="热度" prop="hot_num"></el-table-column>
                <el-table-column label="浏览量" prop="page_views"></el-table-column>
                <el-table-column label="添加时间" prop="created_at"></el-table-column>
                <el-table-column v-if="detail.type == 1" label="操作" width="200" fixed="right" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="!projects.includes(scope.row.id)" round @click="checkProjects(scope.row)">选择</el-button>
                        <el-button v-else type="primary" round @click="delProjects(scope.row)">已选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :current-page="listParam.page"
                :page-sizes="[8, 16, 32, 64]"
                :page-size="listParam.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="projectList.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <!-- 对话框 -->
        <div class="dialog">
            <!-- 对话框 -->
            <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
                <span>已选中{{ type == 1 ? projects.length : projectList.total }}条数据</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitBack">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import api from "@/api";
import brandSelector from './brandDataSelector'; // 选择品牌
import PropertyConpanySelector from './PropertyConpanySelector.vue'; // 物业公司
import DeveloperSeletor from './DeveloperSeletor.vue'; // 开发商
import BizCircleSelector from './BizCircleSelector.vue';

let that = null;
export default {
    name: "ProjectEdit",
    components: {
        brandSelector,
        PropertyConpanySelector,
        DeveloperSeletor,
        BizCircleSelector
    },
    filters:{
        typeFilter(val){
            return {'1':'静态','2':'动态','3':'API'}[val];
        },
        status(val){
            return  {0:'待售',10:'即将预售',20:'在售',30:'售罄'}[val];
        },
        filterParam(val,filed){
            const item = that[filed].find((item)=>{
                return item.value == val;
            });

            return item ? item.text:'';
        },
        district(val){
            return 44;
        }
    },
    data() {
        return {
            loading: true,
            type: 1, // 1 静态 2 动态
            id:'',
            detail:{},
            projects:[],
            filterParam:{
                district_id:[],
                price:'',
                total_price:'',
                square:[],
                is_decorated:'',
                property_type:[],
                status:'',
                trademark_id: [],
                metro_id:[], // 地铁
                not_deficiency:[], // 特色功能
                property_company:[], // 物业公司
                developer:[], // 开发商
                biz_circle_id:[], // 商圈
            },
            param: {
                type: '',
                lowPrice:'',
                hightPrice:'',
                lowTotal_price:'',
                hightTotal_price:'',
                priceType:'1',
            },
            listParam:{
                page:1,
                size:8,
                keyword:''
            },
            conditions:[],
            checkAreaAll:false,
            checkSquareAll:false,
            checkMetroAll:false,
            checkPropertyAll:false,
            checkSpecialAll:false,
            priceOrigin:[],
            total_priceOrigin:[],
            price:[],
            total_price:[],
            square:[],
            metro_id:[],
            property_company:[],
            not_deficiency:[],
            district_id:[],
            biz_circle_id:[],
            is_decorated:[],
            status:[],
            developer:[],
            property_type:[],
            filteState:{},
            projectList: [],
            dialogVisible: false,
            originPrice: '',
            originTotalPrice: '',
            // 品牌的选择列表
            trademarkList: [],
            propertyCompanyList:[],
            developerList:[],
            bizCircleList:[]
        };
    },
    watch:{
        'filterParam.district_id'(next,prev){
            if (Array.isArray(next) && Array.isArray(prev)) {
                // 这里如果next为空数组也要调用接口，用来清空商圈列表
                // 第二个参数用来判断如果是取消勾选某个区域，联动取消区域下商圈
                this.$refs.biz_circle_id.getBizList(next,next.length<prev.length);
            }

        }
    },
    beforeCreate(){
        that = this;
    },
    async mounted() {
        this.id = this.$route.query.id || '';
        this.loadFilters();
        this.price = [
            {text:'价格不限',value:'0,99999999'},
            {text:'7000以下',value:'0,7000'},
            {text:'7000-10000元㎡',value:'7000,10000'},
            {text:'10000-15000元㎡',value:'10000,15000'},
            {text:'15000-20000元㎡',value:'15000,20000'},
            {text:'20000元㎡以上',value:'20000,99999999'}
        ];
        this.priceOrigin = [...this.price];

        this.total_price = [
            {text:'价格不限',value:'0,99999'},
            {text:'50万元以下',value:'0,500000'},
            {text:'50-100万元',value:'50,100'},
            {text:'100-150万元',value:'100,150'},
            {text:'150-200万元',value:'150,200'},
            {text:'200-250万元以上',value:'200,99999'},
        ];
        this.total_priceOrigin = [...this.total_price];

        this.square = [
            {text:'50㎡以下',value:'0,50'},
            {text:'50㎡-70㎡',value:'50,70'},
            {text:'70㎡-90㎡',value:'70,90'},
            {text:'90㎡-110㎡',value:'90,110'},
            {text:'110㎡-130㎡',value:'110,130'},
            {text:'130㎡-150㎡',value:'130,150'},
            {text:'150㎡以上',value:'150,999999'},
        ];

        this.trademark_id = [];
        this.getMetro();
        this.getUserFilter();
    },
    methods: {
        // 获取地铁线路
        async getMetro(){
            let metroData = await api.project.metroLine({page: 1,page_size: 200});
            if (metroData && metroData.data) {
                this.metro_id = metroData.data.data.map(e=>({
                    text:e.name,
                    value:e.id
                }));
            }


        },
        // 获取特色功能
        getUserFilter() {
            let filterField = ['not_deficiency','is_decorated'];
            api.newProject.microProjectGetfilter({type: ''}).then( ({data}) => {
                if (data) {
                    data.forEach((item => {
                        if (filterField.includes(item.field_name)) {
                            this[item.field_name] = item.field_value.map(e=>({
                                text:e.label,
                                value:e.value
                            }));
                        }
                    }));
                }

            });
        },
        // 当页全选按钮
        async selectCurrentPage() {
            const param = this.projectList.data.map(_ => {
                return {
                    id: _.id,
                    sort: 0
                };
            });
            const { data } = await api.content.collectionsProjects(this.id, {projects: param});
            this.projects = data.projects.map(item=>item.pivot.project_id);
            this.$message({
                showClose: true,
                message: "当页全选成功",
                type: "success"
            });
            this.loadList();
        },
        goAdd(){
            this.$router.push(`projectCollEdit`);
        },
        reset(){
            this.param = {
                keyword: "",
                type:'',
                status:'',
                page: 1,
                size: 8
            };
        },
        checkProjects(row){
            const param = {
                projects:[{
                    id:row.id,
                    sort:0
                }]
            };
            api.content.collectionsProjects(this.id, param).then(({data})=>{
                this.projects = data.projects.map(item=>item.pivot.project_id);
                this.loadList();
            });
        },
        delProjects(row){
            const param = {
                projects:[{
                    id:row.id
                }]
            };
            api.content.collectionsProjectsDelete(this.id,param).then(({data})=>{
                this.projects = data.projects.map(item=>item.pivot.project_id);
                this.loadList();
            });
        },
        loadList(){
            this.loading = true;

            api.content.collectionsDetailList(this.id,this.listParam)
                .then(({ data }) => {
                    this.projectList = data;
                    this.loading = false;
                });
        },
        loadFilters(){
            api.project.filterProject().then(({data})=>{
                for (let key in data.area_id.mapping) {
                    if(key > 0) {
                        this.district_id.push({ text: data.area_id.mapping[key], value: key });
                    }
                }

                // const mapProperty = {'住宅':1,'商业':2,'别墅':3};
                for(const key in data.property_class.mapping) {
                    this.property_type.push({ text: data.property_class.mapping[key], value: key });
                }

                // const map = {'未知':0,'在售':1,'待售':2,'已清盘':3};
                for(const key in data.status.mapping) {
                    this.status.push({ text: data.status.mapping[key], value: key });
                }

                this.loadNext();
            });
        },
        loadNext() {
            this.loading = true;
            // 合集详情
            api.content.collectionsDetail(this.id)
                .then(({ data }) => {
                    this.detail = data;
                    // 获取楼盘合集是静态还是动态
                    this.type = data.type;
                    this.projects = data.projects.map(item=>item.pivot.project_id);
                    data.conditions.forEach((item)=>{
                        this.filteState[item.field] = item.id;
                        if(Object.prototype.toString.call(this.filterParam[item.field]) != '[object String]' ){
                            this.filterParam[item.field] = item.value.map(per=>per.value);
                            // 组装数据 trademark_id
                            item.name === '选择品牌' && (this.trademark_id = item.value);
                            if (item.name === '物业公司') {
                                this.propertyCompanyList = item.value;
                                this.property_company = item.value;
                            }
                            if (item.name === '开发商') {
                                this.developerList = item.value;
                                this.developer = item.value;
                            }
                            if (item.name === '商圈') {
                                this.bizCircleList = item.value;
                                this.biz_circle_id = item.value;
                            }
                        } else {
                            if(!item.value[0]){
                                return;
                            }
                            // 处理价格 万元
                            if(item.field === 'total_price'){
                                const tp = item.value[0].value.split(',').map(item=>item/10000).join(',');
                                if(!this.total_priceOrigin.find(item=>item.value == tp) ){
                                    this.total_price.push({
                                        text:`自定义总价${tp.replace(/,/i,'-')}万元`,
                                        value:tp
                                    });
                                    this.param.lowTotal_price = tp.split(',')[0];
                                    this.param.hightTotal_price = tp.split(',')[1];
                                    this.filterParam[item.field] = tp;
                                }else {
                                    this.filterParam[item.field] = tp;
                                }
                            } else if(item.field === 'price'  ){
                                let tp =  item.value[0].value;
                                if(!this.priceOrigin.find(item=>item.value == tp) ){
                                    this.price.push({
                                        text:`自定义单价${tp.replace(/,/i,'-')}元㎡`,
                                        value:tp
                                    });
                                    this.param.lowPrice = tp.split(',')[0];
                                    this.param.hightPrice = tp.split(',')[1];
                                    this.filterParam[item.field] = tp;
                                }else {
                                    this.filterParam[item.field] = tp;
                                }
                            }
                            else {
                                this.filterParam[item.field] = item.value[0].value;
                            }
                        }
                    });
                    this.loading = false;
                });
            this.loadList();
        },
        deleteCol(id) {
            this.$confirm("是否确定停用?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                api.content
                    .cubeStop({ id: id })
                    .then(() => {
                        this.$message({
                            showClose: true,
                            message: "停用成功",
                            type: "success"
                        });
                        this.loadNext();
                    })
                    .catch(() => {
                        this.$message({
                            showClose: true,
                            message: "停用失败",
                            type: "error"
                        });
                    });
            });
        },
        startCol(id){
            this.$confirm("是否确定启用?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                api.content
                    .cubeStart({ id: id })
                    .then(() => {
                        this.$message({
                            showClose: true,
                            message: "启用成功",
                            type: "success"
                        });
                        this.loadNext();
                    })
                    .catch(() => {
                        this.$message({
                            showClose: true,
                            message: "启用失败",
                            type: "error"
                        });
                    });
            });
        },
        switchPrice(val) {
            if(parseInt(val) === 1) {
                if(this.filterParam.total_price) {
                    this.originTotalPrice = this.filterParam.total_price;
                }
                this.filterParam.total_price = '';
                this.filterParam.price = this.originPrice;
                if( this.filterParam.price) {
                    this.deleteData('total_price').then(() => {
                        this.saveCollect('price');
                    });
                }
            } else {
                if(this.filterParam.price) {
                    this.originPrice = this.filterParam.price;
                }
                this.filterParam.price = '';
                this.filterParam.total_price = this.originTotalPrice;
                if( this.filterParam.total_price) {
                    this.deleteData('price').then(() => {
                        this.saveCollect('total_price');
                    });
                }
            }
        },
        // 操作下拉的选择
        handelUpdateIds(type) {
            this.saveCollect(type);
        },
        handelPriceChange(){
            // 自动补齐的功能
            if(this.param.lowPrice.trim() == '' && this.param.hightPrice.trim()!='') {
                this.param.lowPrice = '0';
            }
            if(this.param.priceType == 1) {
                if(this.param.lowPrice.trim()!='' && this.param.hightPrice.trim()!=''){
                    this.price = [...this.priceOrigin];
                    this.price.push({
                        text:`自定义单价${this.param.lowPrice}-${this.param.hightPrice}元㎡`,
                        value:`${this.param.lowPrice},${this.param.hightPrice}`
                    });
                    this.filterParam.price = `${this.param.lowPrice},${this.param.hightPrice}`;
                    this.deleteData('total_price').then(() => {
                        this.saveCollect('price');
                    });
                }else{
                    this.filterParam.price = '';
                    this.price = [...this.priceOrigin];
                }
            }else {
                if(this.param.lowTotal_price.trim()!='' && this.param.hightTotal_price.trim()!=''){
                    this.total_price = [...this.total_priceOrigin];
                    this.total_price.push({
                        text:`自定义总价${this.param.lowTotal_price}-${this.param.hightTotal_price}万元`,
                        value:`${this.param.lowTotal_price},${this.param.hightTotal_price}`
                    });
                    this.filterParam.total_price = `${this.param.lowTotal_price},${this.param.hightTotal_price}`;
                    this.deleteData('price').then(() => {
                        this.saveCollect('total_price');
                    });
                }else{
                    this.filterParam.total_price = '';
                    this.total_price = [...this.total_priceOrigin];
                }
            }
        },
        handleRemoveCondition(filed,value){
            if(typeof this.filterParam[filed] == 'object'){
                this.filterParam[filed].splice(this.filterParam[filed].findIndex((item)=>item.value == value),1);
                filed === 'developer' && this.$refs.developer.handlerChange();
                filed === 'property_company' && this.$refs.property_company.handlerChange();
                filed === 'trademark_id' && this.$refs.trademark_id.handlerChange();
                filed === 'biz_circle_id' && this.$refs.biz_circle_id.handlerChange();
            }else {
                this.filterParam[filed] = '';
            }

            this.saveCollect(filed);
        },
        handleCheckAreaAllChange() {
            if(this.checkAreaAll){
                this.filterParam.district_id = this.district_id.map(item=>item.value);
            }else{
                this.filterParam.district_id = [];
            }

            this.saveCollect('district_id');
        },
        handleCheckedAreaChange(value) {
            let checkedCount = value.length;
            this.checkAreaAll = checkedCount === this.district_id.length;
            this.saveCollect('district_id');
        },
        handleCheckedPriceChange(){
            this.deleteData('total_price').then(() => {
                this.saveCollect('price');
            });
        },
        handleCheckSpecialAllChange(){
            if(this.checkSpecialAll){
                this.filterParam.not_deficiency = this.not_deficiency.map(item=>item.value);
            }else {
                this.filterParam.not_deficiency = [];
            }
            this.saveCollect('not_deficiency');
        },
        handleCheckMetroAllChange(){
            if(this.checkMetroAll){
                this.filterParam.metro_id = this.square.map(item=>item.value);
            }else {
                this.filterParam.metro_id = [];
            }
            this.saveCollect('metro_id');
        },
        handleCheckedtotal_priceChange(){
            this.deleteData('price').then(() => {
                this.saveCollect('total_price');
            });
        },
        handleCheckSquareAllChange() {
            if(this.checkSquareAll){
                this.filterParam.square = this.square.map(item=>item.value);
            }else {
                this.filterParam.square = [];
            }
            this.saveCollect('square');

        },
        handleCheckedSpecialChange(value){
            let checkedCount = value.length;
            this.checkSpecialAll = checkedCount === this.not_deficiency.length;
            this.saveCollect('not_deficiency');
        },
        handleCheckedMetroChange(value){
            let checkedCount = value.length;
            this.checkMetroAll = checkedCount === this.square.length;
            this.saveCollect('metro_id');
        },
        handleCheckedSquareChange(value) {
            let checkedCount = value.length;
            this.checkSquareAll = checkedCount === this.square.length;
            this.saveCollect('square');
        },
        handleCheckedDecorateChange() {
            this.saveCollect('is_decorated');
        },
        handleCheckPropertyAllChange() {
            if(this.checkPropertyAll){
                this.filterParam.property_type = this.property_type.map(item=>item.value);
            }else {
                this.filterParam.property_type = [];
            }
            this.saveCollect('property_type');

        },
        handleCheckedPropertyChange(value) {
            let checkedCount = value.length;
            this.checkPropertyAll = checkedCount === this.property_type.length;
            this.saveCollect('property_type');
        },
        handleCheckedStatusChange() {

            this.saveCollect('status');
        },
        async deleteData(type) {
            this.filteState[type] && api.content.collectionConditionValuesDelte(this.filteState[type]).then(() => {
                this.filteState[type] = '';
            });
        },
        saveCollect(type){
            // 增加is_all属性
            const param = {
                collection_id:this.id,
                field:type,
                is_customize: false,
                is_multi: false,
                is_all: false,
                nameEn: '',
                value:[]
            };

            switch(type){
            case 'district_id':{
                param.name = '区域';
                param.value = this.district_id.filter((item)=>this.filterParam.district_id.includes(item.value));
                break;
            }
            case 'price':{
                param.name = '单价';
                param.nameEn = 'price';
                if(this.filterParam.price){
                    param.value = [{text:'单价',value:this.filterParam.price}];
                }else {
                    param.value = [];
                }
                break;
            }
            case 'total_price':{
                param.name = '总价';
                param.nameEn = 'total_price';
                if(this.filterParam.total_price){
                    param.value = [{text:'总价',value:this.filterParam.total_price.split(',').map(item=>parseInt(item)*10000).join(',')}];
                }else {
                    param.value = [];
                }
                break;
            }
            case 'square':{
                param.name = '面积';
                param.nameEn = 'square';
                param.id = 4;
                param.value = this.square.filter((item)=>this.filterParam.square.includes(item.value));
                break;
            }
            case 'metro_id':{
                param.name = '地铁';
                param.nameEn = 'metro_id';
                param.value = this.metro_id.filter((item)=>this.filterParam.metro_id.includes(item.value));
                break;
            }
            case 'not_deficiency':{
                param.name = '特色功能';
                param.nameEn = 'not_deficiency';
                param.value = this.not_deficiency.filter((item)=>this.filterParam.not_deficiency.includes(item.value));
                break;
            }
            case 'is_decorated':{
                param.name = '装修';
                param.nameEn = 'is_decorated';
                param.value = this.is_decorated.filter((item)=>this.filterParam.is_decorated == item.value);
                break;
            }

            case 'property_type':{
                param.name = '物业';
                param.nameEn = 'property_type';
                param.value = this.property_type.filter((item)=>this.filterParam.property_type.includes(item.value));
                break;
            }
            case 'status':{
                param.name = '销售状态';
                param.nameEn = 'status';
                param.value = this.status.filter((item)=>this.filterParam.status == item.value);
                break;
            }
            case 'trademark_id': {
                param.name = '选择品牌';
                param.nameEn = 'trademark_id';
                param.value = this.trademarkList;
                // 选择品牌的时候实现标签的添加
                this.trademark_id = this.trademarkList;
                break;
            }
            case 'property_company': {
                param.name = '物业公司';
                param.nameEn = 'property_company';
                param.value = this.propertyCompanyList;
                this.property_company = this.propertyCompanyList;
                break;
            }
            case 'developer': {
                param.name = '开发商';
                param.nameEn = 'developer';
                param.value = this.developerList;
                this.developer = this.developerList;
                break;
            }
            case 'biz_circle_id': {
                param.name = '商圈';
                param.nameEn = 'biz_circle_id';
                param.value = this.bizCircleList;
                this.biz_circle_id = this.bizCircleList;
                break;
            }
            }
            let isAll = true;
            for (let key in this.filterParam) {
                if (Object.prototype.toString.call(this.filterParam[key]) === '[object String]') {
                    !this.filterParam[key] && (isAll = false);
                }
                if (Object.prototype.toString.call(this.filterParam[key]) === '[object Array]') {
                    !this.filterParam[key].length && (isAll = false);
                }
            }
            param.is_all = isAll;
            // 保存筛选条件
            if(this.filteState[type]){
                // 编辑
                api.content.collectionConditionValuesEdit(this.filteState[type],param).then(()=>{
                    this.loadList();
                    this.conditions.forEach(item=>{
                        if(item.field == param.field){
                            item.value = param.value;
                        }
                    });
                });
            }else {
                // 新增
                api.content.collectionConditionValuesAdd(param).then(({data})=>{
                    this.filteState[type] = data.id;
                    this.conditions.push(param);
                    this.loadList();
                });
            }

        },
        back(){
            // 静态点击完成编辑直接返回至合集列表，无弹窗
            if (this.type == 1) {
                this.$router.push({
                    path:'/content/projectCollList/'
                });
            } else {
                // 动态弹窗
                this.dialogVisible = true;
            }
        },
        submitBack() {
            this.$router.push({
                path:'/content/projectCollList/'
            });
        },
        //分页
        handleSizeChange(val) {
            this.listParam.size = val;
            this.loadList();
        },
        async handleCurrentChange(val) {
            this.listParam.page = val;
            this.loadNext();
        }
    }
};
</script>

<style scoped lang="scss">
.flex {
    display: flex;
    align-items: center;
}
.flex-between {
    justify-content: space-between;
}
.w50 {
    width:50px;
}
.center {
    text-align: center;
}
.app-container {
    .common-search {
        margin:0 10px;
        padding: 0 0px 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #e9e9e9;
        .line {
            width: 30px;
            display: inline-block;
            text-align: center;
        }
    }
    .el-pagination {
        margin-top: 30px;
    }
}

.top__nav {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f5f5f5;
    margin: 0px 8px 30px;
    padding:20px 8px
}
.top__tips{
    font-size:14px;
    margin-right: 20px;
}
.top__nav__title {
    font-size: 28px;
    font-weight: bold;
}
.filter {
    margin:10px;
}
.filter__top {

    font-size: 16px;
    font-weight: bold;
    margin: 20px 0;
}
.filter__main__title {
    display: block;
    text-align: right;
    font-size: 14px;
    font-weight: bold;
}
.filter__main_item {
    padding:10px 0;
}
.check {
    padding:25px;
    border-bottom: 1px solid #e9e9e9;
    border-top: 1px solid #e9e9e9;
}
.check__info {
    font-size:12px;
    color:#999;
}
.check__cont {
    display:flex;
    margin-top:10px;
    flex-wrap:wrap;
}
.check__cont__item {
    margin:10px 20px 0 0;
    padding: 4px 5px 4px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
}
.dialog-footer {
    width: 100%;
    height: 100%;
    text-align: center;
    display: block;
}
.mb-20 {
    margin-top: 20px;
}
</style>
