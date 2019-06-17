<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title" style="position:relative;border:none">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item class="bread-menu">商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>商品管理</span>
        </h3>
      </div>
      <span style="display:none">{{ refash }}</span>
      <div class="mall-section">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="bread-content">
          <div style="height:24px;background:#f0f2f5;"></div>
          <div>
            <div class="operate-top">
              <div class="fl">
                <div style="display: inline-block">
                  <el-input v-model="searchValue" placeholder="请输入商品名称或货号" prefix-icon="el-icon-search" clearable @keyup.enter.native="handleInputSearch(searchValue)" @clear="handleInputSearch(searchValue)"> </el-input>
                </div>
                <el-button type="text" @click="handleSeniorSearch" class="senior-search">高级搜索<i :class="showSearch ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"></i></el-button>
              </div>
              <div class="fr">
                <el-button type="primary" v-if="goodsStatus == '2' || goodsStatus == '1' || goodsStatus == '4'" @click="newGoods">发布商品</el-button>
                <el-button v-if="goodsStatus == '2' || goodsStatus == '1' || goodsStatus == '4'" @click="linkGoods">同步失败</el-button>

                <div style="vertical-align: top;display: inline-block;margin-left:8px;width:130px">
                  <el-select v-model="beatchOPerate" placeholder="批量操作" clearable @change="getBeatch">
                    <el-option label="修改分类" :value="0" v-if="goodsStatus == '2' || goodsStatus == '1' || goodsStatus == '4'"></el-option>
                    <el-option label="批量下架" :value="1" v-if="goodsStatus == '2' || goodsStatus == '4'"></el-option>
                    <el-option label="批量上架" :value="2" v-if="goodsStatus == '1'"></el-option>
                    <el-option label="批量删除" :value="3" v-if="goodsStatus == '2' || goodsStatus == '1' || goodsStatus == '4'"></el-option>
                    <el-option label="恢复到仓库" :value="4" v-if="goodsStatus == '3'"></el-option>
                    <el-option label="运费模板" :value="5" v-if="goodsStatus == '2' || goodsStatus == '1' || goodsStatus == '4'"></el-option>
                  </el-select>
                </div>

                <!--  <el-button v-if='goodsStatus=="2"||goodsStatus=="1"||goodsStatus=="4"' @click="handleGoodsClassify">修改分类</el-button>
                <el-button v-if='goodsStatus=="2"||goodsStatus=="4"' @click="handleSaleOut">批量下架</el-button>
                <el-button v-if='goodsStatus=="1"' @click="handlePutaway">批量上架</el-button>

                <el-button v-if='goodsStatus=="2"||goodsStatus=="1"||goodsStatus=="4"'  plain @click="handleDeleteGoodsList">
                批量删除</el-button> -->

                <!-- <el-button v-if='goodsStatus=="3"' @click='handlePutWarehouse'>恢复到仓库</el-button> -->
              </div>
            </div>
            <goodsSearch v-show="showSearch" @getSearch="getSearch" :goodsStatus="goodsStatus" :tableData="tableData"></goodsSearch>
          </div>
          <el-tab-pane :label="'出售中' + '(' + saleNum + ')'" name="first" class="goods-table-content" v-loading="loading">
            <saleList v-if="goodsStatus === 2" :tableData="tableData" @getList="getList" @getSelectList="getSelectList" @handleItem="handleItem" :searchObj="searchObj"></saleList>
          </el-tab-pane>
          <el-tab-pane :label="'已售罄' + '(' + saloOutNum + ')'" name="second" class="goods-table-content" v-loading="loading">
            <saleOut v-if="goodsStatus === 4" :tableData="tableData" @getList="getList" @getSelectList="getSelectList" @handleItem="handleItem" :searchObj="searchObj"></saleOut>
          </el-tab-pane>
          <el-tab-pane :label="'仓库中' + '(' + storeNum + ')'" name="third" class="goods-table-content" v-loading="loading">
            <storeList v-if="goodsStatus === 1" :tableData="tableData" @getList="getList" @getSelectList="getSelectList" @handleItem="handleItem" :searchObj="searchObj"></storeList>
          </el-tab-pane>
          <el-tab-pane :label="'回收站' + '(' + recycleNum + ')'" name="fouth" class="goods-table-content" v-loading="loading">
            <recycleList v-if="goodsStatus === 3" :tableData="tableData" @getList="getList" @getSelectList="getSelectList" @handleItem="handleItem" :searchObj="searchObj"></recycleList>
          </el-tab-pane>
          <div class="pagination-conteiner" style="background:#fff;margin-top:-50px;" v-show="tableData.length">
            <div class="pagination">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNum" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" v-if="total != 0"> </el-pagination>
            </div>
          </div>
        </el-tabs>
      </div>
    </div>
    <!-- 商品分类弹框 -->
    <el-dialog title="商品分类" :visible.sync="dialogVisible" width="600px" @close="cancelSetClassify">
      <el-form label-width="100px" label-position="right">
        <el-form-item label="修改方式" required>
          <template>
            <el-radio v-model="action" label="TYP_APPEND">添加<span class="radio-tip">（在原有的基础上添加）</span></el-radio>
            <el-radio v-model="action" label="TYP_REPLACE">替换<span class="radio-tip">（替换掉原有分类）</span></el-radio>
          </template>
        </el-form-item>
        <el-form-item label="商品分类" required>
          <div class="goods-classsify-content">
            <treeselect v-model="goodsClassifySelect" :multiple="true" :disable-branch-nodes="true" :options="goodsClassifyData" placeholder="所有分类" class="w-320" />
            <!-- goodsClassifyData -->
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSetClassify">取 消</el-button>
        <el-button type="primary" @click="setClassify">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 批量修改运费模板 -->
    <el-dialog title="批量修改运费模板" :visible.sync="betachDialogVisible" width="400px" @close="cancelSetFreight">
      <div>
        <el-select v-model="templateSelect" placeholder="请选择" style="width:360px">
          <el-option v-for="(item, index) in templateList" :key="index" :label="item.templateName" :value="item.freightTemplateId"> </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSetFreight">取 消</el-button>
        <el-button type="primary" @click="setFreight">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs';
import common from '../../../../static/js/common.js';
import request from '../../../api/request.js';
import saleList from './saleList.vue';
import storeList from './storeList.vue';
import saleOut from './saleOut.vue';
import recycleList from './recycleList.vue';
import goodsSearch from './goodsSearch.vue';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  data() {
    return {
      getTimeAll: common.formatDate,
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      length: 0,
      activeName: 'first', //tab导航当前选中的
      tableData: [],
      // 商品列表条件
      goodsStatus: 2, //商品状态
      order: 'desc', //排序根据
      sortField: 'createTime', //排序方式
      searchValue: '', //搜索
      pageNum: 1,
      pageSize: 20,
      pageSizes: [20, 40, 60, 80],
      total: 0,
      // 商品数量
      saleNum: 0,
      saloOutNum: 0,
      storeNum: 0,
      recycleNum: 0,
      deleteList: [], //删除数组的id
      selectList: [], //选中的数组
      showSearch: false,
      dialogVisible: false, //商品分类
      goodsClassifySelect: null,
      action: 'TYP_APPEND', //商品分类的修改方式
      goodsClassifyData: [], //商品分类
      loading: true,
      // 高级搜索的字段
      createTimeMin: '',
      createTimeMax: '',
      productPriceMin: '',
      productPriceMax: '',
      productStockMin: '',
      productStockMax: '',
      productSaleNumMin: '',
      productSaleNumMax: '',
      productType: '',
      mallCategoryId: '',
      tagId: null, //分类id
      complete: '', //完善状态
      beatchOPerate: '', //批量操作
      betachDialogVisible: false,
      templateSelect: '', //运费模板
      templateList: [], //运费模板列表
      refash: false,
      searchObj: {
        //缓存数据
        pageNum: 1, //页码
        pageSize: 20, //分页数据
        activeName: 'first', //tab
        searchValue: '', //搜索
        createTimeMin: '', //创建开始时间
        createTimeMax: '', //创建结束时间
        productPriceMin: -1, //商品单价
        productPriceMax: -1,
        productStockMin: -1, //商品库存
        productStockMax: -1,
        productSaleNumMin: -1, //总销量
        productSaleNumMax: -1,
        productType: -1, //商品类型
        mallCategoryId: '', //商品品类
        tagId: '', //商品分类
        complete: '',
        sortField: 'createTime',
        order: 'desc'
      }
    };
  },
  created() {
    this.getGoodsNum(); //获取商品数量
    if (localStorage.getItem('goodsSearch')) {
      this.searchObj = JSON.parse(localStorage.getItem('goodsSearch'));
      // this.total = this.searchObj.total
      this.pageSize = this.searchObj.pageSize;
      this.pageNum = this.searchObj.pageNum;
      this.activeName = this.searchObj.activeName;
      this.searchValue = this.searchObj.searchValue;
      this.createTimeMin = this.searchObj.createTimeMin;
      this.createTimeMax = this.searchObj.createTimeMax;
      this.productPriceMin = this.searchObj.productPriceMin;
      this.productPriceMax = this.searchObj.productPriceMax;
      this.productStockMin = this.searchObj.productStockMin;
      this.productStockMax = this.searchObj.productStockMax;
      this.productSaleNumMin = this.searchObj.productSaleNumMin;
      this.productSaleNumMax = this.searchObj.productSaleNumMax;
      this.productType = this.searchObj.productType;
      this.mallCategoryId = this.searchObj.mallCategoryId;
      this.tagId = this.searchObj.tagId;
      this.complete = this.searchObj.complete;
      this.sortField = this.searchObj.sortField;
      this.order = this.searchObj.order;
      this.$nextTick(() => {
        this.pageNum = this.searchObj.pageNum;
        this.pageSize = this.searchObj.pageSize;
      });

      this.refash = !this.refash;
    }
    if (this.activeName === 'first') {
      this.goodsStatus = 2;
    } else if (this.activeName === 'second') {
      this.goodsStatus = 4;
    } else if (this.activeName === 'third') {
      this.goodsStatus = 1;
    }

    this.getList(); //商品列表

    this.refash = !this.refash;
    localStorage.removeItem('goodsSearch'); //使用完就清除缓存
  },

  computed: {},
  methods: {
    // 高级搜索的条件
    getSearch(obj) {
      this.tagId = obj.tagId;
      this.mallCategoryId = obj.mallCategoryId;
      this.createTimeMin = obj.createTime.length === 2 ? this.getTimeAll(obj.createTime[0]) : '';
      this.createTimeMax = obj.createTime.length === 2 ? this.getTimeAll(obj.createTime[1]) : '';
      this.productPriceMin = obj.productPriceMin ? obj.productPriceMin : -1;
      this.productPriceMax = obj.productPriceMax ? obj.productPriceMax : -1;
      this.productStockMin = obj.productStockMin ? obj.productStockMin : -1;
      this.productStockMax = obj.productStockMax ? obj.productStockMax : -1;
      this.productSaleNumMin = obj.productSaleNumMin ? obj.productSaleNumMin : -1;
      this.productSaleNumMax = obj.productSaleNumMax ? obj.productSaleNumMax : -1;
      this.productType = obj.productType ? obj.productType : -1;
      this.complete = obj.complete;
      this.pageNum = 1;
      this.getList();

      //存缓存的数据
      this.searchObj.tagId = obj.tagId;
      this.searchObj.mallCategoryId = obj.mallCategoryId;
      this.searchObj.createTimeMin = obj.createTime.length === 2 ? this.getTimeAll(obj.createTime[0]) : '';
      this.searchObj.createTimeMax = obj.createTime.length === 2 ? this.getTimeAll(obj.createTime[1]) : '';
      this.searchObj.productPriceMin = obj.productPriceMin ? obj.productPriceMin : -1;
      this.searchObj.productPriceMax = obj.productPriceMax ? obj.productPriceMax : -1;
      this.searchObj.productStockMin = obj.productStockMin ? obj.productStockMin : -1;
      this.searchObj.productStockMax = obj.productStockMax ? obj.productStockMax : -1;
      this.searchObj.productSaleNumMin = obj.productSaleNumMin ? obj.productSaleNumMin : -1;
      this.searchObj.productSaleNumMax = obj.productSaleNumMax ? obj.productSaleNumMax : -1;
      this.searchObj.productType = obj.productType ? obj.productType : -1;
      this.searchObj.complete = obj.complete;
    },
    //获取列表
    getList(order, sortField, obj) {
      if (order) {
        this.order = order;
        this.searchObj.order = order;
      }
      if (sortField) {
        this.sortField = sortField;
        this.searchObj.sortField = sortField;
      }
      this.searchObj.sortField = this.sortField;
      this.searchObj.order = this.order;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.searchValue.trim(),
        order: this.order,
        sortField: this.sortField,
        goodsStatus: this.goodsStatus, //出售中商品
        tagId: this.tagId,
        mallCategoryId: this.mallCategoryId,
        createTimeMin: this.createTimeMin,
        createTimeMax: this.createTimeMax,
        productPriceMin: this.productPriceMin,
        productPriceMax: this.productPriceMax,
        productStockMin: this.productStockMin,
        productStockMax: this.productStockMax,
        productSaleNumMin: this.productSaleNumMin,
        productSaleNumMax: this.productSaleNumMax,
        productType: this.productType,
        complete: this.complete
      };

      request.get('/api-mall/page-simple-mall-goods', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.tableData = res.data.result.result;
            // for( let item of this.tableData ) {
            //   item.soldOutVisible = false;
            // }
            this.total = res.data.result.totalCount;
          } else {
            this.tableData = [];
            this.total = 0;
          }
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 发布商品
    newGoods() {
      this.$router.push({
        name: 'goodsEdit',
        params: {
          mallProId: '-1',
          createSource: 1,
          activeName: 'first'
        }
      });
    },
    // 同步商品
    linkGoods() {
      this.$router.push({
        name: 'goodsSynList'
      });
    },
    // 输入搜索
    handleInputSearch(value) {
      this.searchValue = value;
      this.searchObj.searchValue = value;
      this.pageNum = 1;
      this.getList();
    },
    // 高级搜索显示
    handleSeniorSearch() {
      this.showSearch = !this.showSearch;
    },
    // 获取各个状态商品数量
    getGoodsNum() {
      request.get('/api-mall/count-product-all-state').then(res => {
        if (res.data.errorCode === 0) {
          this.saleNum = res.data.result.onShelf;
          this.saloOutNum = res.data.result.sellOut;
          this.storeNum = res.data.result.offShelf;
          this.recycleNum = res.data.result.recycled;
        } else {
          this.$message.error(res.data.errorCode);
        }
      });
    },
    // tab切换
    handleClick(tab) {
      this.searchObj.activeName = tab.name;
      this.beatchOPerate = '';
      this.pageNum = 1; //设置默认页码
      this.pageSize = 20; //设置默认页数
      this.searchValue = ''; //清空搜索条件
      if (tab.index === '0') {
        this.goodsStatus = 2;
      } else if (tab.index === '1') {
        this.goodsStatus = 4;
      } else if (tab.index === '2') {
        this.goodsStatus = 1;
      } else if (tab.index === '3') {
        this.goodsStatus = 3;
      }
      this.getList();
    },
    // 选中
    getSelectList(val) {
      if (val) {
        this.selectList = val;
      } else {
        this.selectList = [];
      }
      this.deleteList = [];
      for (let i in val) {
        this.deleteList.push(val[i].mallProId);
      }
    },
    // 批量操作
    getBeatch() {
      if (this.beatchOPerate === 0) {
        //修改分类
        this.handleGoodsClassify();
      } else if (this.beatchOPerate === 1) {
        //批量下架
        this.handleSaleOut();
      } else if (this.beatchOPerate === 2) {
        //批量上架
        this.handlePutaway();
      } else if (this.beatchOPerate === 3) {
        //批量删除
        this.handleDeleteGoodsList();
      } else if (this.beatchOPerate === 4) {
        //恢复到仓库
        this.handlePutWarehouse();
      } else if (this.beatchOPerate === 5) {
        //批量修改运费模板
        this.handleModifyFreight();
      }
    },

    //获取运费列表
    getTemplateList() {
      request.get('/api-mall/list-mall-goods-freight').then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.templateList = res.data.result;
          } else {
            this.templateList = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //批量修改运费模板
    handleModifyFreight() {
      if (this.deleteList.length === 0) {
        this.$message.warning('请至少选择一件商品');
        this.beatchOPerate = '';
        return false;
      } else {
        this.getTemplateList(); //运费模板列表
        this.betachDialogVisible = true;
      }
    },
    // 确定设置运费模板
    setFreight() {
      let params = {
        proNos: this.deleteList.join(','),
        freightTemplateId: this.templateSelect
      };
      request.post('/api-mall/update_freight_template', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('设置成功');
          this.betachDialogVisible = false;
          this.beatchOPerate = '';
        } else {
          this.$message.error(res.data.errorCode);
        }
      });
    },
    //取消设置模板
    cancelSetFreight() {
      this.betachDialogVisible = false;
      this.beatchOPerate = '';
      this.templateSelect = '';
    },
    //批量删除
    handleDeleteGoodsList() {
      if (this.deleteList.length === 0) {
        this.$message.warning('请至少选择一件商品');
        this.beatchOPerate = '';
      } else {
        let params = {
          mallProIds: this.deleteList.join(','),
          status: 3
        };
        this.$confirm('确认要删除这' + this.deleteList.length + '件商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.get('/api-mall/modify-mall-goods-status', { params }).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('删除成功!');
              this.getList(); //更新列表
              this.getGoodsNum(); //更新统计数量
              this.beatchOPerate = '';
            } else {
              this.$message.error(res.data.message);
            }
          });
        });
      }
    },

    // 批量下架
    handleSaleOut() {
      if (this.deleteList.length === 0) {
        this.$message.warning('请至少选择一件商品');
        this.beatchOPerate = '';
      } else {
        let params = {
          mallProIds: this.deleteList.join(','),
          status: 1
        };
        this.$confirm('确认要下架这' + this.deleteList.length + '件商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.get('/api-mall/modify-mall-goods-status', { params }).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('下架成功!');
              this.getList();
              this.getGoodsNum(); //更新统计数量
              this.beatchOPerate = '';
            } else {
              this.$message.error(res.data.message);
            }
          });
        });
      }
    },
    // 批量上架
    handlePutaway() {
      if (this.deleteList.length === 0) {
        this.$message.warning('请至少选择一件商品');
        this.beatchOPerate = '';
      } else {
        for (let item of this.selectList) {
          if (item.complete === 0) {
            this.$message.error('未完善的商品不允许上架');
            return false;
          }
        }
        let params = {
          mallProIds: this.deleteList.join(','),
          status: 2
        };
        this.$confirm('确认要上架' + this.deleteList.length + '件商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.get('/api-mall/modify-mall-goods-status', { params }).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('上架成功!');
              this.getList();
              this.getGoodsNum(); //更新统计数量
              this.beatchOPerate = '';
            } else {
              this.$message.error(res.data.message);
            }
          });
        });
      }
    },
    // 批量设置商品分类
    handleGoodsClassify() {
      if (this.deleteList.length === 0) {
        this.$message.warning('请至少选择一件商品');
        this.beatchOPerate = '';
        return false;
      } else {
        this.getClassifyList(); //商品分类列表
        this.dialogVisible = true;
      }
    },
    // 确定设置分类
    setClassify() {
      if (!this.goodsClassifySelect) {
        this.$message.error('请先择分类');
        return false;
      }
      let params = {
        productIds: this.deleteList.join(','),
        tagIds: this.goodsClassifySelect.join(','),
        action: this.action
      };
      request.post('/api-mall/batch-update-goods-tags', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('修改成功');
          this.dialogVisible = false;
          this.beatchOPerate = '';
        } else {
          this.$message.error(res.data.errorCode);
        }
      });
    },
    //取消分类设置
    cancelSetClassify() {
      this.dialogVisible = false;
      this.beatchOPerate = '';
    },
    //获取商品分类
    getClassifyList() {
      request.get('/api-mall/list_mall_goods_tag_tree').then(res => {
        this.goodsClassifyData = [];
        if (res.data.errorCode === 0) {
          this.goodsClassifyData.push({
            childTagList: res.data.result.childTagList,
            mallProTagId: res.data.result.mallProTagId,
            tagName: res.data.result.tagName
          });
          this.getTree(this.goodsClassifyData);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 商品分类数据处理
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
    // 批量恢复到仓库
    handlePutWarehouse() {
      if (this.deleteList.length === 0) {
        this.$message.warning('请至少选择一件商品');
        this.beatchOPerate = '';
      } else {
        let params = {
          mallProIds: this.deleteList.join(','),
          status: 1
        };
        this.$confirm('确认这' + this.deleteList.length + '件商品要恢复到仓库吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.get('/api-mall/modify-mall-goods-status', { params }).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('修改成功!');
              this.getList();
              this.getGoodsNum(); //更新统计数量
              this.beatchOPerate = '';
            } else {
              this.$message.error(res.data.message);
            }
          });
        });
      }
    },
    // 单个操作
    handleItem(mallProId, status, bol) {
      // var text = '';
      var successText = '';
      if (status === 3) {
        // text = '确认要删除这件商品吗?';
        successText = '删除成功';
      } else if (status === 2) {
        // text = '确认要上架这件商品吗?';
        successText = '上架成功';
      } else if (status === 1 && !bol) {
        // text = '确认这件商品恢复到仓库吗?';
        successText = '更新成功';
      } else if (status === 1 && bol) {
        //bol下架
        // text = '确认要下架这件商品吗?';
        successText = '下架成功';
      }
      let params = {
        mallProIds: mallProId,
        status: status
      };

      request.get('/api-mall/modify-mall-goods-status', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(successText);
          this.getList();
          this.getGoodsNum(); //更新统计数量
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    // 分页
    handleSizeChange(size) {
      //设置每页条数
      this.pageSize = size;
      this.searchObj.pageSize = size;
      this.getList();
    },
    handleCurrentChange(page) {
      //设置跳到第几页
      this.pageNum = page;
      this.searchObj.pageNum = page;
      this.getList();
    }
  },
  components: {
    saleList,
    storeList,
    saleOut,
    recycleList,
    goodsSearch,
    Treeselect
  }
};
</script>

<style scoped>
.bread-container {
  background: #fff;
}
.mall-content-title h3 {
  padding: 24px 0 0 0;
}
.pagination-conteiner {
  margin: -25px 25px 0 25px;
  width: auto;
}
.pagination-conteiner {
  padding-bottom: 34px;
}
/*搜索*/
.operate-top {
  background: #fff;
  height: 32px;
  background: #fff;
  margin: 0 25px;
  padding: 25px 25px 0 25px;
}
.operate-top .fr {
  font-size: 0;
}
.senior-search {
  margin-left: 10px;
  font-size: 14px;
}
.senior-search .el-icon-d-arrow-right {
  display: inline-block;
  transform: rotate(90deg);
  margin-left: 5px;
}
.senior-search .el-icon-d-arrow-left {
  display: inline-block;
  transform: rotate(90deg);
  margin-left: 5px;
}
.goods-classsify-content {
  height: 340px;
  display: inline-block;
}

.wechat-img-box {
  margin: 0 auto;
  text-align: center;
}
.wechat-img {
  width: 200px;
  height: 200px;
}
.goods-table-content .el-table__fixed-right {
  z-index: 0;
}
.w-320 {
  width: 320px;
}
.radio-tip {
  font-size: 12px;
  color: #909399;
}
</style>
