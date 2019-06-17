<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title" style="border:none">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>促销活动</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/discountSale' }">折扣/减价</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'createActivity', query: { id: activeId } }">创建折扣/减价</el-breadcrumb-item>
          <el-breadcrumb-item>选择单件商品</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>选择单件商品</span>
        </h3>
      </div>
      <div class="mall-section">
        <div v-if="selecting">
          <el-tabs v-model="activeName" @tab-click="handleClick" class="bread-content">
            <div class="operate-top" v-if="activeName === 'first' || activeName === 'second'">
              <div class="fl">
                <div class="search-item">
                  <treeselect :options="options" placeholder="选择分类" v-model="proTagvalue" @input="getproTagId" class="tree-select" style="width:400px;" />
                </div>
                <div class="search-item">
                  <el-input placeholder="请输入商分名称/货号/商家编码" v-on:keyup.enter.native="getSearchGoodsList()" v-model.trim="search" clearable prefix-icon="el-icon-search" style="flex-shrink: 0;"></el-input>
                </div>
                <div class="search-item" style="line-height:32px">
                  <el-checkbox v-model="checked" @change="checkedSelected">隐藏已参加活动的商品</el-checkbox>
                </div>
              </div>
              <div class="fr">
                <!-- <el-button type="primary" @click="selectAllsaling">全选本页</el-button> -->
                <el-checkbox v-model="selectAllStatus" label="全选本页" @change="selectAllsaling" border></el-checkbox>
              </div>
            </div>
            <el-tab-pane label="出售中" name="first"> </el-tab-pane>
            <el-tab-pane label="仓库中" name="second"> </el-tab-pane>
            <el-tab-pane :label="'已选择' + '(' + selecttotal + ')'" name="fouth"> </el-tab-pane>
            <div class="goods-list-content" :class="activeName === 'fouth' ? 'select-third' : ''">
              <template>
                <el-table :data="tableData" style="width: 100%" @sort-change="sortChange" v-loading="tableLoading">
                  <el-table-column prop="goodsinfo" label="商品信息" width="500px">
                    <template slot-scope="scope">
                      <div class="goods-info">
                        <div>
                          <a href="javascript:;">
                            <img class="imgs-style" src="http://pic01-10001430.image.myqcloud.com/img-icon-pro.png" alt="" v-if="scope.row.mallProImageUrl === null" />
                            <img class="imgs-style" :src="scope.row.mallProImageUrl" alt="" v-else />
                          </a>
                        </div>
                        <div class="goods-text">
                          <div class="goods-text-name">{{ scope.row.proName }}</div>
                          <div class="goods-text-info">
                            <div>货号：{{ scope.row.proCode }}</div>
                            <div>￥{{ scope.row.mallProSpuPrice }}</div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建时间" sortable width="180">
                    <template slot-scope="scope">
                      <p class="line-18">{{ scope.row.createTime | getTime }}</p>
                      <p class="line-18">{{ scope.row.createTime | getSeconds }}</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="stock" label="库存" sortable> </el-table-column>
                  <el-table-column prop="saleNum" label="总销量" sortable> </el-table-column>
                  <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                      <div class="eltoop-box">
                        <el-tooltip class="item" effect="dark" :content="'已参加其他折扣减价活动：' + scope.row.discountNameList" placement="top" v-if="scope.row.discountNameList !== null" style="width:160px">
                          <el-checkbox v-model="scope.row.checked" label="已参加活动" border @change="value => selectSaleThis(value, scope.row)"> </el-checkbox>
                        </el-tooltip>
                        <el-checkbox v-model="scope.row.checked" label="选择商品" v-else border @change="value => selectSaleThis(value, scope.row)"></el-checkbox>
                      </div>
                      <span style="display:none">{{ selectAllbol }}</span>
                    </template>
                  </el-table-column>
                  <template slot="empty">
                    <div class="no-data-wrap">
                      <div class="no-data-icon">
                        <img src="../../../../static/img/no-data_icon.png" />
                      </div>
                      <p>暂无数据</p>
                    </div>
                  </template>
                </el-table>
              </template>
              <div class="pagination-conteiner" v-show="tableData.length">
                <div class="pagination">
                  <el-pagination background @size-change="salingSizeChange" @current-change="salingCurrentChange" :current-page="salingpageNum" :page-sizes="pageSizes" :page-size="salingpageSize" layout="total, sizes, prev, pager, next" :total="salingtotal"> </el-pagination>
                </div>
              </div>
            </div>
          </el-tabs>
          <div class="confirm-wrap" :style="{ width: fixWidth + 'px' }">
            <div class="" style="font-size:0">
              <el-button type="primary" size="small" @click="confirmSelect">确认选择</el-button>
              <el-button size="small" @click="goBack">返 回</el-button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="content-wrap-padding">
            <el-row :gutter="10" class="margin-bottom">
              <el-col :span="16">
                <div>
                  第一阶段
                  <span v-show="isImport" class="import-tip">本次共导入{{ successNum + falseNum }}个商品，其中成功{{ successNum }}个，失败{{ falseNum }}个</span>
                  <a href="javaScript:void(0)" v-show="falseNum > 0" style="margin-left:10px;font-size:14px" @click="showInfo">查看失败原因</a>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="fr">
                  <div class="block">
                    <el-select v-model="startStatus" clearable placeholder="请选择" @visible-change="showSelcted" class="width-style">
                      <el-option v-for="item in selectArr" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- 打折dialog -->
            <div v-if="startStatus == 1">
              <el-dialog title="批量打折" :visible.sync="discountFormVisible" class="discount-dialog">
                <el-form :model="discountform">
                  <el-form-item label="折扣率" :label-width="discountform.formLabelWidth">
                    <div style="width:200px;">
                      <el-input v-model="discountform.discount"></el-input>
                    </div>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="discountFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="setdiscountForm">确 定</el-button>
                </div>
              </el-dialog>
            </div>
            <!-- 减价dialog -->
            <div v-if="startStatus == 2">
              <el-dialog title="批量减价" :visible.sync="reduceFormVisible" class="discount-dialog">
                <el-form :model="reduceform">
                  <el-form-item label="减价" :label-width="reduceform.formLabelWidth">
                    <div style="width:200px;">
                      <el-input v-model="reduceform.reduce">
                        <template slot="append">
                          元
                        </template>
                      </el-input>
                    </div>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="reduceFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="setreduceform">确 定</el-button>
                </div>
              </el-dialog>
            </div>
            <!-- 实售价dialog -->
            <div v-if="startStatus == 3">
              <el-dialog title="批量设置实售价" :visible.sync="realFormVisible" class="discount-dialog">
                <el-form :model="realform">
                  <el-form-item label="实售价" :label-width="realform.formLabelWidth">
                    <div style="width:200px;">
                      <el-input v-model="realform.real">
                        <template slot="append">
                          元
                        </template>
                      </el-input>
                    </div>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="realFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="setrealForm">确 定</el-button>
                </div>
              </el-dialog>
            </div>
            <!-- 撤销抹角抹分dialog -->
            <div v-if="startStatus == 4">
              <el-dialog title="批量撤消抹角抹分" :visible.sync="cancalFormVisible" class="discount-dialog">
                <div>确认批量撤消抹角抹分?</div>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="cancalFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="setcancalForm">确 定</el-button>
                </div>
              </el-dialog>
            </div>
            <!-- 抹分dialog -->
            <div v-if="startStatus == 5">
              <el-dialog title="批量抹分" :visible.sync="wipePointsFormVisible" class="discount-dialog">
                <div>*单价&lt; 0.10的SKU无法抹分，&nbsp;&nbsp;确认批量抹分?</div>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="wipePointsFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="setwipePointsForm">确 定</el-button>
                </div>
              </el-dialog>
            </div>
            <!-- 抹角dialog -->
            <div v-if="startStatus == 6">
              <el-dialog title="批量抹角" :visible.sync="wipeAngleFormVisible" class="discount-dialog">
                <div class="">*单价&lt; 1.00的SKU无法抹角，&nbsp;&nbsp;确认批量抹角？</div>
                <!-- <div class="">*单价&lt; 1.00的SKU无法抹角</div> -->
                <div slot="footer" class="dialog-footer">
                  <el-button @click="wipeAngleFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="setwipeAngleForm">确 定</el-button>
                </div>
              </el-dialog>
            </div>
            <div v-loading="loading" class="cover-problem">
              <el-table :data="setTableData" style="width: 100%">
                <el-table-column prop="goodsinfo" label="商品信息">
                  <template slot-scope="scope">
                    <div class="goods-info" style="line-height:20px">
                      <div>
                        <a href="javascript:;">
                          <img class="imgs-style" src="http://pic01-10001430.image.myqcloud.com/img-icon-pro.png" alt="" v-if="scope.row.mallProImageUrl === null" />
                          <img class="imgs-style" :src="scope.row.mallProImageUrl" alt="" v-else />
                        </a>
                      </div>
                      <div class="goods-text goods-text-set">
                        <div class="goods-text-name">{{ scope.row.proName }}</div>
                        <div>货号：{{ scope.row.proCode }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="mallProSpuPrice" label="单价(元)" width="180">
                  <template slot-scope="scope">
                    ￥{{ scope.row.mallProSpuPrice }}
                  </template>
                </el-table-column>
                <el-table-column prop="mallProDiscount" label="打折(折)" width="120">
                  <template slot-scope="scope">
                    <!-- :class="scope.row.isReduce===1?'main-way':''" -->
                    <div :class="scope.row.isReduce === 1 ? 'main-way' : ''">
                      <el-input size="small" v-model="scope.row.mallProDiscount" @focus="discountFocus(scope.row)" @blur="changeOtherPrice(scope.$index, scope.row)" placeholder=""></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="mallProReducePrice" label="减价(元)" width="120">
                  <template slot-scope="scope">
                    <div :class="scope.row.isReduce === 0 ? 'main-way' : ''">
                      <el-input size="small" v-model="scope.row.mallProReducePrice" @focus="reduceFocus(scope.row)" @blur="changeReducPrice(scope.$index, scope.row)" placeholder=""></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="mallProRealPrice" label="实售价(元)" width="120">
                  <template slot-scope="scope">
                    <div>
                      <el-input size="small" v-model="scope.row.mallProRealPrice" @focus="reduceFocus(scope.row)" @blur="changeRealPrice(scope.$index, scope.row)" placeholder=""></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="160">
                  <template slot-scope="scope">
                    <div>
                      <el-button type="text" @click="seeSku(scope.row.mallProId, scope.$index, scope.row)">查看SKU单价</el-button>
                    </div>
                  </template>
                </el-table-column>
                <template slot="empty">
                  <div class="no-data-wrap">
                    <div class="no-data-icon">
                      <img src="../../../../static/img/no-data_icon.png" />
                    </div>
                    <p>暂无数据</p>
                  </div>
                </template>
              </el-table>
            </div>
          </div>
          <div class="confirm-wrap">
            <div class="" style="font-size:0">
              <el-button type="primary" size="small" @click="confirmGoodsSet">确认设置</el-button>
              <el-button type="primary" size="small" @click="goBackEdit">返 回</el-button>
            </div>
          </div>
          <!-- sku -->
          <el-dialog title="SKU单价" :visible.sync="dialogFormVisible">
            <el-table :data="skuData" style="width: 100%">
              <el-table-column prop="prop" label="规格" width="180"> </el-table-column>
              <el-table-column prop="price" label="单价(元)" width="100"> </el-table-column>
              <el-table-column prop="mallProDiscount" label="打折(折)" width="100"> </el-table-column>
              <el-table-column prop="mallProReducePrice" label="减价(元)" width="100"> </el-table-column>
              <el-table-column prop="mallProRealPrice" label="实售价(元)"> </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <importInfo :importInfo="importInfo"></importInfo>
  </div>
</template>

<script>
import qs from 'qs';
import storage from '../../../../static/js/storage.js';
import request from '../../../api/request.js';
import cateSelect from '../../common/cateSelect.vue';
import Treeselect from '@riophae/vue-treeselect';
import importInfo from '../../common/importInfo.vue';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      fixWidth: document.documentElement.clientWidth - 200,
      length: 0,
      selecting: true,
      activeName: 'first', //tab导航当前选中的
      goodsStatus: 2, //商品状态
      order: 'asc', //排序根据
      sortField: 'mallProSpuPrice', //排序方式
      pageSizes: [20, 40, 60, 80],
      salingpageNum: 1,
      salingpageSize: 20, // 在售的页数
      salingtotal: 0, // 在售总数据

      selectArr: [
        {
          value: 0,
          label: '批量操作'
        },
        {
          value: 1,
          label: '打折'
        },
        {
          value: 2,
          label: '减价'
        },
        {
          value: 3,
          label: '设置实售价'
        }
        // {
        //   value: 4,
        //   label: '撤消抹角抹分'
        // },
        // {
        //   value: 5,
        //   label: '抹分'
        // },
        // {
        //   value: 6,
        //   label: '抹角'
        // }
      ],
      startStatus: 0,
      discountFormVisible: false,
      discountform: {
        discount: 10,
        formLabelWidth: '100px'
      },
      reduceFormVisible: false,
      reduceform: {
        reduce: 0,
        formLabelWidth: '100px'
      },
      realFormVisible: false,
      realform: {
        real: 0,
        formLabelWidth: '100px'
      },
      cancalFormVisible: false,
      wipePointsFormVisible: false,
      wipeAngleFormVisible: false,
      checked: false,
      isHide: 0,
      checkedInventory: false,
      isHideInventory: 0,
      storeNum: 0,
      tableData: [],
      selectAllbol: false,
      search: '',
      proTagId: '',
      loading: true,
      formActivity: {
        activityId: ''
      },
      setTableData: [],
      dialogFormVisible: false,
      skuOld: {},
      skuData: [],
      proTagvalue: undefined,
      options: [],

      activeId: '', //活动的id
      selectAllArr: [],
      deleteSelectArr: [],
      addArr: [],
      removeArr: [],
      addProIdsArr: [],
      removeProIdArr: [],
      falseNum: 0,
      successNum: 0,
      isImport: false,
      isNew: true,
      selectAllStatus: false,
      selecttotal: 0,
      importInfo: {
        //失败原因列表
        dialogVisible: false,
        infoList: []
      },
      tableLoading: true
    };
  },
  mounted() {
    this.getListTags();
    let activityform = storage.getNewActivity();
    if (activityform.activityId) {
      //编辑页面进来的
      this.activeId = activityform.activityId;
    } else {
      this.activeId = '';
    }

    this.formActivity = activityform;
    if (activityform.activityId) {
      // this.getActivityGoods(activityform.activityId);
    }
    if (activityform.temActivityId) {
      this.activeId = activityform.temActivityId;
    }
    this.getGoodsList(this.activeId);
    // this.getGoodsInventoryList(this.activeId);

    this.isNew = this.$route.query.isNew;
    this.selecttotal = this.$route.query.selectNum;
    if (this.$route.query.import) {
      this.isImport = true;
      this.successNum = this.$route.query.successNum;
      this.falseNum = this.$route.query.falseNum;
      this.selecting = false;
      this.activeId = this.$route.query.activityId;
      this.addProIdsArr = this.$route.query.selectedProIds.split(',');
      let activityform = storage.getNewActivity();
      activityform.addProIdsArr = this.addProIdsArr;
      activityform.removeProIdsArr = this.removeProIdArr;
      storage.setNewActivity(activityform);
      this.getSelectGoods();
    }
    if (localStorage.getItem('importInfoObj')) {
      this.importInfo.infoList = JSON.parse(localStorage.getItem('importInfoObj'));
      localStorage.removeItem('importInfoObj'); //使用完就清除缓存
    }
    // else{
    //   this.importInfo = {
    //     importInfo:false,
    //     infoList:[]
    //   }
    // }

    // 保存缓存过来的新增和取消的数据

    if (storage.getNewActivity().addProIdsArr) {
      this.addProIdsArr = storage.getNewActivity().addProIdsArr;
      this.removeProIdArr = storage.getNewActivity().removeProIdsArr;
    }
  },
  filters: {},
  computed: {},
  watch: {},
  methods: {
    // tab切换
    handleClick(tab) {
      this.selectAllStatus = false;
      this.pageNum = 1;
      this.getGoodsList(this.activeId);
    },
    // 分页
    salingSizeChange(size) {
      //设置每页条数
      this.salingpageSize = size;
      this.getGoodsList(this.activeId);
    },
    salingCurrentChange(page) {
      //设置跳到第几页
      this.salingpageNum = page;
      this.getGoodsList(this.activeId);
    },

    getCateIds(item) {
      this.searchId = item.categoryIds;
    },
    getproTagId(searchQuery, instanceId) {
      if (searchQuery) {
        this.proTagId = searchQuery;
      } else {
        this.proTagId = '';
      }
      this.getGoodsList(this.activeId);
      // this.getGoodsInventoryList(this.activeId);
    },
    getListTags() {
      // 获取商品分类下拉列表
      request.get('/api-mall/list_mall_goods_tag_tree').then(res => {
        if (res.data.errorCode === 0) {
          this.options.push({
            childTagList: res.data.result.childTagList,
            mallProTagId: res.data.result.mallProTagId,
            tagName: res.data.result.tagName
          });
          this.getTree(this.options);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getTree(data) {
      for (let i in data) {
        data[i].label = data[i].tagName;
        data[i].id = data[i].mallProTagId;
        data[i].children = data[i].childTagList;
        if (data[i].children) {
          if (data[i].children.length) {
            this.getTree(data[i].children);
          } else {
            delete data[i].children;
          }
        } else {
          delete data[i].children;
        }
      }
    },
    checkedSelected() {
      this.salingpageNum = 1;
      if (this.checked) {
        //选中
        this.isHide = 1;
        this.getGoodsList(this.activeId);
      } else {
        //未选中
        this.isHide = 0;
        this.getGoodsList(this.activeId);
      }
    },

    getSearchGoodsList() {
      this.salingpageNum = 1;
      this.getGoodsList(this.activeId);
    },
    /*eslint-disable*/
    getGoodsList(id) {
      //获取在售商品
      this.tableLoading = true;
      let params;
      let requestUrl;
      if (this.activeName === 'first') {
        params = {
          activityId: id,
          pageNum: this.salingpageNum,
          pageSize: this.salingpageSize,
          sortKey: 'create_time',
          sortValue: '',
          isSaling: 2,
          type: 1,
          categoryId: '',
          proTagId: this.proTagId,
          isHide: this.isHide,
          search: this.search
        };
        requestUrl = '/api-mall/page-activity-goods';
      } else if (this.activeName === 'second') {
        params = {
          activityId: id,
          pageNum: this.salingpageNum,
          pageSize: this.salingpageSize,
          sortKey: 'create_time',
          sortValue: '',
          isSaling: 1,
          type: 1,
          categoryId: '',
          proTagId: this.proTagId,
          isHide: this.isHideInventory,
          search: this.search
        };
        requestUrl = '/api-mall/page-activity-goods';
      } else if (this.activeName === 'fouth') {
        params = {
          activityId: id,
          pageNum: this.salingpageNum,
          pageSize: this.salingpageSize,
          sortKey: 'create_time',
          sortValue: '',
          isSaling: 2,
          type: 1,
          search: ''
        };
        requestUrl = '/api-mall/page-selected-activity-goods';
      }
      request.post(requestUrl, qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.tableData = res.data.result.result;
            this.salingtotal = res.data.result.totalCount;
          } else {
            this.tableData = [];
            this.salingtotal = 0;
          }
          this.tableLoading = false;
          for (let item of this.tableData) {
            if (item.isSelStatus === 2) {
              item.checked = true;
              if (
                !this.selectAllArr.find(i => {
                  return i.mallProId === item.mallProId;
                })
              ) {
                if (this.deleteSelectArr.indexOf(item.mallProId) === -1) {
                  this.selectAllArr.push(item);
                } else {
                  item.checked = false;
                }
              }
            } else {
              item.checked = false;
            }
          }
          for (let item of this.tableData) {
            //处理分页的时候保留数据选中状态
            for (let item1 of this.selectAllArr) {
              if (item.mallProId === item1.mallProId) {
                if (this.deleteSelectArr.indexOf(item.mallProId) === -1) {
                  item.checked = true;
                } else {
                  item.checked = false;
                }
              }
            }
          }
          this.selectAllStatus = this.tableData.every(item => {
            return item.checked;
          });
          let addshow = []; //新增显示的
          let cancelArr = []; //取消的
          addshow = storage.getNewActivity().addProIdsArr;
          cancelArr = storage.getNewActivity().removeProIdsArr;
          //选择回显
          for (let itm of this.tableData) {
            if (
              addshow.find(selectArrId => {
                return selectArrId === itm.mallProId;
              })
            ) {
              itm.checked = true;
            }
          }
          // 取消的回显
          for (let itm1 of this.tableData) {
            if (
              cancelArr.find(selectArrId => {
                return selectArrId === itm1.mallProId;
              })
            ) {
              itm1.checked = false;
            }
          }
          this.selectAllStatus = this.tableData.every(item => {
            return item.checked;
          });

          //处理选过的商品
          for (let i of this.tableData) {
            if (i.discountNameList !== null) {
              i.discountNameList = i.discountNameList.join(';');
            }
          }

          // 有改变的数据存储
          for (let m of this.tableData) {
            if (m.isSelStatus === 2 && m.checked === false) {
              //取消了
              if (
                !this.removeArr.find(row => {
                  return row.mallProId === m.mallProId;
                })
              ) {
                this.removeArr.push(m);
              }
            } else if (m.isSelStatus !== 2 && m.checked) {
              //新增的
              if (
                !this.addArr.find(row => {
                  return row.mallProId === m.mallProId;
                })
              ) {
                if (
                  !this.removeArr.find(row => {
                    return row.mallProId === m.mallProId;
                  })
                ) {
                  this.addArr.push(m);
                }
              }
            }
          }
        } else {
          this.$message.error(res.data.message);
          this.tableLoading = false;
        }
      });
    },
    sortChange(value) {
      if (value.prop === 'createTime') {
        this.sortKey = 'create_time';
      } else {
        this.sortKey = value.prop;
      }

      if (value.order === 'ascending') {
        this.sortValue = 'asc';
      } else if (value.order == 'descending') {
        this.sortValue = 'desc';
      }

      this.getGoodsList(this.activeId);
    },
    /*eslint-disable*/
    selectAllsaling() {
      // 全选在售本页
      this.selectAllbol = !this.selectAllbol;
      if (!this.selectAllStatus) {
        for (let item of this.tableData) {
          //全选所有
          item.checked = false; //所有取消
          //处理已经选择过的
          for (let i in this.selectAllArr) {
            if (item.mallProId === this.selectAllArr[i].mallProId) {
              this.selectAllArr.splice(i, 1);
              if (
                !this.deleteSelectArr.find(row => {
                  row.mallProId === item.mallProId;
                })
              ) {
                this.deleteSelectArr.push(item.mallProId);
              }
            }
          }

          for (let i in this.addArr) {
            if (
              this.addArr.find(row => {
                return row.mallProId === item.mallProId;
              })
            ) {
              this.addArr.splice(i, 1);
            }
          }
          //新增还是删除选中数据处理
          if (item.isSelStatus === 2 && item.checked === false) {
            //取消了
            if (
              !this.removeArr.find(row => {
                return row.mallProId === item.mallProId;
              })
            ) {
              this.removeArr.push(item);
            }
          } else if (item.isSelStatus !== 2 && item.checked) {
            //新增的
            if (
              !this.addArr.find(row => {
                return row.mallProId === item.mallProId;
              })
            ) {
              if (
                !this.removeArr.find(row => {
                  return row.mallProId === item.mallProId;
                })
              ) {
                this.addArr.push(item);
              }
            }
          }
        }
      } else {
        for (let item of this.tableData) {
          //全选所有
          item.checked = true;
          if (
            !this.selectAllArr.find(i => {
              return i.mallProId === item.mallProId;
            })
          ) {
            this.selectAllArr.push(item);
          }
        }
        for (let i in this.deleteSelectArr) {
          if (this.deleteSelectArr.indexOf(i.mallProId) !== -1) {
            this.deleteSelectArr.splice(i, 1);
          }
        }
        for (let i = 0; i < this.tableData.length; i++) {
          //有改变的数据存储
          if (this.tableData[i].isSelStatus === 2 && this.tableData[i].checked === false) {
            //取消了
            if (
              !this.removeArr.find(row => {
                return row.mallProId === this.tableData[i].mallProId;
              })
            ) {
              this.removeArr.push(this.tableData[i]);
            }
          } else if (this.tableData[i].isSelStatus !== 2 && this.tableData[i].checked) {
            //新增的
            if (
              !this.addArr.find(row => {
                return row.mallProId === this.tableData[i].mallProId;
              })
            ) {
              if (
                !this.removeArr.find(row => {
                  return row.mallProId === this.tableData[i].mallProId;
                })
              ) {
                this.addArr.push(this.tableData[i]);
              }
            }
          }
        }
      }
    },
    selectSaleThis(val, item) {
      this.selectAllbol = !this.selectAllbol;

      if (!val) {
        //取消
        for (let i in this.selectAllArr) {
          if (item.mallProId === this.selectAllArr[i].mallProId) {
            this.deleteSelectArr.splice(i, 1);
            if (
              !this.deleteSelectArr.find(row => {
                row.mallProId === item.mallProId;
              })
            ) {
              this.deleteSelectArr.push(item.mallProId);
            }
          }
        }
        for (let i in this.addArr) {
          if (this.addArr[i].mallProId === item.mallProId) {
            this.addArr.splice(i, 1);
            i = 0;
          }
        }
      } else {
        this.selectAllArr.push(item);
        for (let i in this.deleteSelectArr) {
          if (this.deleteSelectArr.indexOf(item.mallProId) !== -1) {
            this.deleteSelectArr.splice(i, 1);
          }
        }
      }

      if (item.isSelStatus === 2 && item.checked === false) {
        //取消选中
        if (
          !this.removeArr.find(row => {
            return row.mallProId === item.mallProId;
          })
        ) {
          this.removeArr.push(item);
        }
      } else if (item.isSelStatus !== 2 && item.checked) {
        //新增加的
        if (
          !this.addArr.find(row => {
            return row.mallProId === item.mallProId;
          })
        ) {
          this.addArr.push(item);
        }
      }
      this.selectAllStatus = this.tableData.every(item => {
        return item.checked;
      });
    },
    confirmSelect() {
      // 确认选择

      let proNum = 0;
      if (storage.getNewActivity().proNum) {
        proNum = storage.getNewActivity().proNum;
      } else {
        proNum = 0;
      }

      if (proNum + this.addArr.length - this.removeArr.length <= 0) {
        this.$message.error('没有选择商品！！');
        return;
      }
      this.selecting = false;
      this.getSelectGoods();
    },
    getSelectGoods() {
      //获取已选要设置的商品
      for (let item of this.removeArr) {
        if (this.removeProIdArr.indexOf(item.mallProId) == -1) {
          this.removeProIdArr.push(item.mallProId);
        }
      }
      for (let item of this.addArr) {
        if (this.addProIdsArr.indexOf(item.mallProId) == -1) {
          this.addProIdsArr.push(item.mallProId);
        }
      }
      if (this.$route.query.selectedProIds) {
        this.addProIdsArr = this.$route.query.selectedProIds.split(',');
      }
      let params = {
        activityId: this.activeId,
        addProIdsStr: this.addProIdsArr.join(','),
        removeIdsStr: this.removeProIdArr.join(','),
        personGroupStatus: '',
        groupId: -1
      };
      // return false
      request.post('/api-mall/list-selected-activity-goods', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.list) {
            for (let i = 0; i < res.data.result.list.length; i++) {
              if (!res.data.result.list[i].mallProDiscount) {
                res.data.result.list[i].mallProDiscount = 10.0;
              }
              if (!res.data.result.list[i].mallProRealPrice) {
                res.data.result.list[i].mallProRealPrice = res.data.result.list[i].mallProSpuPrice;
              }
              if (!res.data.result.list[i].mallProReducePrice) {
                res.data.result.list[i].mallProReducePrice = 0.0;
              }
              //默认是打折
              if (!res.data.result.list[i].isReduce) {
                res.data.result.list[i].isReduce = 0;
              }
            }
            this.setTableData = res.data.result.list;
          }
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    showSelcted(value) {
      if (!value) {
        if (this.startStatus == 1) {
          this.discountFormVisible = true;
        }
        if (this.startStatus == 2) {
          this.reduceFormVisible = true;
        }
        if (this.startStatus == 3) {
          this.realFormVisible = true;
        }
        if (this.startStatus == 4) {
          this.cancalFormVisible = true;
        }
        if (this.startStatus == 5) {
          this.wipePointsFormVisible = true;
        }
        if (this.startStatus == 5) {
          this.wipeAngleFormVisible = true;
        }
      }
    },
    setdiscountForm() {
      // 批量打折
      for (let i = 0; i < this.setTableData.length; i++) {
        this.setTableData[i].mallProDiscount = this.discountform.discount;
        this.setTableData[i].mallProRealPrice = (this.setTableData[i].mallProSpuPrice * this.discountform.discount * 0.1).toFixed(2);
        this.setTableData[i].mallProReducePrice = (this.setTableData[i].mallProSpuPrice - this.setTableData[i].mallProRealPrice).toFixed(2);
        this.setTableData[i].isReduce = 0;
      }
      this.discountFormVisible = false;
    },
    setreduceform() {
      // 批量减价
      for (let i = 0; i < this.setTableData.length; i++) {
        this.setTableData[i].mallProReducePrice = parseFloat(this.reduceform.reduce).toFixed(2);
        this.setTableData[i].isReduce = 1;
        if (this.setTableData[i].mallProSpuPrice > this.setTableData[i].mallProReducePrice) {
          this.setTableData[i].mallProRealPrice = (this.setTableData[i].mallProSpuPrice - this.setTableData[i].mallProReducePrice).toFixed(2);
          this.setTableData[i].mallProDiscount = ((this.setTableData[i].mallProRealPrice / this.setTableData[i].mallProSpuPrice) * 10).toFixed(2);
        } else {
          this.setTableData[i].mallProReducePrice = this.setTableData[i].mallProSpuPrice;
          this.setTableData[i].mallProRealPrice = 0;
          this.setTableData[i].mallProDiscount = 0;
        }
      }
      this.reduceFormVisible = false;
    },
    setrealForm() {
      // 批量设置实售价
      for (let i = 0; i < this.setTableData.length; i++) {
        this.setTableData[i].mallProRealPrice = parseFloat(this.realform.real).toFixed(2);
        if (this.setTableData[i].mallProSpuPrice > this.setTableData[i].mallProRealPrice) {
          this.setTableData[i].mallProReducePrice = (this.setTableData[i].mallProSpuPrice - this.setTableData[i].mallProRealPrice).toFixed(2);
          this.setTableData[i].mallProDiscount = ((this.setTableData[i].mallProRealPrice / this.setTableData[i].mallProSpuPrice) * 10).toFixed(2);
        } else {
          this.setTableData[i].mallProRealPrice = this.setTableData[i].mallProSpuPrice;
          this.setTableData[i].mallProReducePrice = 0;
          this.setTableData[i].mallProDiscount = 10;
        }
      }
      this.realFormVisible = false;
    },
    setcancalForm() {
      // 撤消抹分抹角
      for (let i = 0; i < this.setTableData.length; i++) {
        this.setTableData[i].mallProRealPrice = (this.setTableData[i].mallProSpuPrice * this.setTableData[i].mallProDiscount * 0.1).toFixed(2);
        this.setTableData[i].mallProReducePrice = (this.setTableData[i].mallProSpuPrice - this.setTableData[i].mallProRealPrice).toFixed(2);
      }
      this.cancalFormVisible = false;
    },
    setwipePointsForm() {
      // 抹分
      for (let i = 0; i < this.setTableData.length; i++) {
        if (parseFloat(this.setTableData[i].mallProSpuPrice) > 0.1) {
          this.setTableData[i].mallProRealPrice = Math.floor(parseFloat(this.setTableData[i].mallProRealPrice) * 10) / 10 + '0';
        }
      }
      this.wipePointsFormVisible = false;
    },
    setwipeAngleForm() {
      // 抹角
      for (let i = 0; i < this.setTableData.length; i++) {
        if (parseFloat(this.setTableData[i].mallProSpuPrice) > 1) {
          this.setTableData[i].mallProRealPrice = Math.floor(parseFloat(this.setTableData[i].mallProRealPrice)) + '.00';
        }
      }
      this.wipeAngleFormVisible = false;
    },
    // 打折失去焦点
    changeOtherPrice(index, item) {
      //改变折扣同时改变其他价格
      if (item.mallProDiscount > 10) {
        item.mallProDiscount = 10;
      } else if (item.mallProDiscount < 0) {
        item.mallProDiscount = 0;
      }
      this.setTableData[index].mallProDiscount = parseFloat(this.setTableData[index].mallProDiscount).toFixed(2);
      this.setTableData[index].mallProRealPrice = parseFloat(this.setTableData[index].mallProSpuPrice * this.setTableData[index].mallProDiscount * 0.1).toFixed(2);
      this.setTableData[index].mallProReducePrice = parseFloat(this.setTableData[index].mallProSpuPrice - this.setTableData[index].mallProRealPrice).toFixed(2);

      // this.$forceUpdate()
    },
    //打折获取焦点
    discountFocus(item) {
      item.isReduce = 0;
    },
    //减价失去焦点
    changeReducPrice(index, item) {
      //改变减价同时改变其他价格
      if (item.mallProReducePrice < 0) {
        item.mallProReducePrice = 0;
      } else if (item.mallProReducePrice > item.mallMinProSkuPrice) {
        item.mallProReducePrice = item.mallMinProSkuPrice;
      }
      this.setTableData[index].mallProRealPrice = parseFloat(this.setTableData[index].mallProSpuPrice - this.setTableData[index].mallProReducePrice).toFixed(2);
      this.setTableData[index].mallProDiscount = parseFloat((this.setTableData[index].mallProRealPrice / this.setTableData[index].mallProSpuPrice) * 10).toFixed(2);
    },
    //减价获取焦点
    reduceFocus(item) {
      item.isReduce = 1;
    },
    changeRealPrice(index, item) {
      //改变实售价同时改变其他价格
      if (item.mallProRealPrice < 0) {
        item.mallProRealPrice = 0;
      } else if (item.mallProRealPrice > item.mallMinProSkuPrice) {
        item.mallProRealPrice = item.mallMinProSkuPrice;
      }
      this.setTableData[index].mallProReducePrice = parseFloat(this.setTableData[index].mallProSpuPrice - this.setTableData[index].mallProRealPrice).toFixed(2);
      this.setTableData[index].mallProDiscount = parseFloat((this.setTableData[index].mallProRealPrice / this.setTableData[index].mallProSpuPrice) * 10).toFixed(2);
    },
    seeSku(id, index, item) {
      this.dialogFormVisible = true;
      let itemIndex = index;
      let params = {
        mallproId: id,
        cutSmallChange: 0
      };
      request.get('/api-mall/get-activity-goods-sku', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.skuOld = res.data.result;
          let skuArr = [];
          let discount = parseFloat(this.setTableData[itemIndex].mallProDiscount);

          for (let key in this.skuOld) {
            let obj = this.skuOld[key];
            let mallProRealPrice; //实售
            let mallProReducePrice; //减价
            let mallProDiscount;
            if (item.isReduce === 0) {
              //折扣
              mallProRealPrice = (this.skuOld[key].price * discount * 0.1).toFixed(2); //实售
              mallProReducePrice = (this.skuOld[key].price - this.skuOld[key].price * discount * 0.1).toFixed(2);
              mallProDiscount = discount;
            } else if (item.isReduce === 1) {
              //减价
              mallProRealPrice = this.skuOld[key].price - item.mallProReducePrice; //实售
              mallProReducePrice = item.mallProReducePrice; //减价
              mallProDiscount = item.mallProDiscount; //折扣
            }

            // mallProReducePrice = item.mallProReducePrice
            // mallProDiscount = item.mallProDiscount
            obj.mallProDiscount = mallProDiscount;

            // mallProRealPrice =(this.skuOld[key].price * discount * 0.1).toFixed(2);
            // mallProReducePrice =(this.skuOld[key].price - this.skuOld[key].price * discount * 0.1).toFixed(2);
            // obj.mallProDiscount = discount;
            obj.mallProRealPrice = mallProRealPrice;
            obj.mallProReducePrice = mallProReducePrice;
            skuArr.push(obj);
          }
          this.skuData = skuArr;
        } else {
          this.$message.error('获取sku数据失败！！');
        }
      });
    },
    confirmGoodsSet() {
      // 确认设置
      // let activityform
      // activityform = storage.getNewActivity()
      // activityform.proNum = this.successNum
      // storage.setNewActivity(activityform)
      for (let item of this.setTableData) {
        if (item.isReduce === 1) {
          //减价
          if (item.mallProReducePrice > item.mallMinProSkuPrice) {
            //减价大于最小sku的价格
            this.$message.error(item.proCode + '实售价不得低于sku价格');
            return false;
          }
        }
      }

      let activityform = storage.getNewActivity();
      if (this.isImport) {
        activityform.proNum = this.successNum;
      }

      let goodsArr = [
        {
          sort: 1,
          cutSmallChange: '0', // 抹分抹角 0不处理 1抹分 2抹角
          groupId: '-1',
          priceArr: []
        }
      ];
      let proList = []
      for (let i = 0; i < this.setTableData.length; i++) {
        let obj = {
          mallProDiscount: this.setTableData[i].mallProDiscount, //折扣价
          mallProReducePrice: this.setTableData[i].mallProReducePrice, //减价多少
          mallProRealPrice: this.setTableData[i].mallProRealPrice, //实际价格
          activityProRelationId: this.setTableData[i].activityProRelationId,
          relationId: this.setTableData[i].mallProId, //商品id
          isReduce: this.setTableData[i].isReduce //以哪个活动为主
        };
        goodsArr[0].priceArr.push(obj);
        proList.push(obj);
      }

      activityform.groupProList = goodsArr;
      activityform.proList = proList
      activityform.addProIdsArr = this.addProIdsArr;
      activityform.removeProIdsArr = this.removeProIdArr;
      // return false
      storage.setNewActivity(activityform);

      this.$router.push({
        name: 'createActivity',
        query: {
          id: this.activeId,
          isNew: this.isNew
        }
      });
      // this.$router.back(-1);
    },
    //导入商品的返回
    goBackEdit() {
      this.$router.push({
        name: 'createActivity',
        query: {
          id: this.activeId,
          isNew: this.isNew
        }
      });
      // let activityform = storage.getNewActivity()
      // activityform.proNum = this.successNum
      // // activityform.addProIdsArr = this.addProIdsArr.split(',')
      // storage.setNewActivity(activityform);
    },
    goBack() {
      this.$router.back(-1);
    },
    //查看失败原因】
    showInfo() {
      this.importInfo.dialogVisible = true;

    }
  },
  components: {
    Treeselect,
    cateSelect,
    importInfo
  }
};
</script>
<style>
/*tip宽度*/
.eltoop-box .el-tooltip__popper.is-dark {
  max-width: 140px !important;
}
</style>
<style scoped>
.bread-container {
  background: #fff;
}
.mall-content-title h3 {
  padding: 24px 0 0 0;
}
.content-wrap-padding {
  margin: 24px;
  padding: 24px;
  background-color: #fff;
}
.margin-bottom {
  margin-bottom: 22px;
}
.order-selects {
  display: flex;
}
.blockproTag {
  width: 360px;
}
.order-selects .fl {
  margin-left: 10px;
  width: 260px;
  display: flex;
  align-items: center;
}

.border-wrap {
  display: flex;
  border: 1px solid red;
}
.border-wrap1 {
  display: flex;
  border: 1px solid green;
  width: 100%;
}
.border-all-1 {
  margin-right: 22px;
}
.border-all-2 {
  width: 100%;
  margin-right: 22px;
}
.border-all-3 {
  /*border:1px solid blue;*/
  width: 80px;
  margin-right: 22px;
}

.goods-info {
  height: 80px;
  display: flex;
}
.goods-info .goods-text {
  margin-left: 18px;
  font-size: 14px;
  color: #303133;
  line-height: 18px;
}
.goods-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-text-set {
  justify-content: flex-start;
}
.goods-text-info {
  color: #909399;
  font-size: 14px;
  line-height: 18px;
}
.goods-text-name {
  /*margin-bottom:5px;*/
  line-height: 18px;
}
.imgs-style {
  width: 80px;
  height: 80px;
  border: 1px solid rgba(241, 243, 247, 1);
  border-radius: 5px;
}

/*确认选择*/
.confirm-wrap {
  position: fixed;
  z-index: 3;
  bottom: 0px;
  width: 100%;
  height: 56px;
  border-top: 1px solid #e4e7ed;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.operate-top {
  height: 32px;
  margin: 22px 24px 0 24px;
  background: #fff;
  padding: 24px 32px 0 32px;
}
.search-item {
  display: inline-block;
  vertical-align: top;
  margin-right: 10px;
}
.goods-list-content {
  background: #fff;
  margin: 0px 24px 24px 24px;
  padding: 24px 32px 24px 32px;
}
.select-third {
  margin-top: 24px;
}
</style>
<style>
.cover-problem .el-table__fixed-right {
  z-index: 0;
}
.blockproTag .el-form-item__label {
  line-height: 22px;
}
.blockproTag .vue-treeselect__control {
  height: 32px;
  font-size: 13px;
}
.tree-select-discount .vue-treeselect__multi-value-item {
  line-height: 22px;
}
.tree-select-discount .vue-treeselect--has-value .vue-treeselect__multi-value {
  margin-bottom: 0px;
}
.tree-select-discount .vue-treeselect__multi-value-item-container {
  line-height: 26px;
}

.discount-dialog .el-dialog {
  width: 460px;
}
/*  .discount-dialog .el-input__inner{
    width: 200px;
  }*/
.el-table:before {
  height: 0px;
}
.line-18 {
  line-height: 18px;
}

.main-way {
  color: #ccc;
}
.main-way input {
  background: #ccc;
  border: 1px solid #ccc;
}

/*导商品*/
.import-tip {
  margin-left: 30px;
  font-size: 13px;
  color: #e6a23c;
}
</style>
