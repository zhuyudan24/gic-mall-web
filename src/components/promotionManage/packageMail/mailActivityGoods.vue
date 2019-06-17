<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title" style="border:none">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>促销活动</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/packageMail' }">包邮活动</el-breadcrumb-item>
          <el-breadcrumb-item>选择单件商品</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>选择单件商品</span>
        </h3>
      </div>
      <div class="mall-section">
        <div>
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
                <el-table :data="tableData" style="width: 100%" @sort-change="sortChange" v-loading="loading">
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
                          <el-checkbox v-model="scope.row.checked" label="已参加活动" border @change="selectSaleThis(scope.row)"> </el-checkbox>
                        </el-tooltip>
                        <el-checkbox v-model="scope.row.checked" label="选择商品" v-else border @change="selectSaleThis(scope.row)"></el-checkbox>
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
              <el-button type="primary" @click="confirmSelect" size="small">确认选择</el-button>
              <el-button @click="goBack" size="small">返 回</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import storage from '../../../../static/js/storage.js';
import request from '../../../api/request.js';
import cateSelect from '../../common/cateSelect.vue';
import Treeselect from '@riophae/vue-treeselect';
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
      librarypageNum: 1,
      librarypageSize: 20, // 仓库的页数
      librarytotal: 0, // 仓库总数据

      selectpageNum: 1,
      selectpageSize: 20, // 选择的页数
      checked: false,
      isHide: 0,
      checkedInventory: false,
      isHideInventory: 0,
      storeNum: 0,
      tableData: [],
      selectAllbol: false,
      startStatus: '',
      search: '',
      proTagId: '',
      loading: true,
      formActivity: {
        activityId: ''
      },
      tableInventoryData: [],
      selectAllInventorybol: false,
      tableSelectData: [],
      proTagvalue: undefined,
      options: [],
      activeId: '', //活动的id
      removeArr: [], //取消选中的
      addArr: [], //添加选中的
      deleteSelectArr: [],
      selectAllArr: [],
      selectAllStatus: false,
      selecttotal: 0
    };
  },
  mounted() {
    this.selecttotal = this.$route.query.selectNum;
    this.getListTags();
    let activityform = storage.getNewMailActivity();
    this.activeId = activityform.activityId;
    this.formActivity = activityform;
    if (activityform.activityId) {
      // this.getActivityGoods(activityform.activityId);
    }
    this.getGoodsList(activityform.activityId);
    // this.getGoodsInventoryList(activityform.activityId);
  },
  created() {
    // 保存缓存过来的新增和取消的数据

    if (storage.getNewMailActivity().addProIdsArr) {
      this.addProIdsArr = storage.getNewMailActivity().addProIdsArr;
      this.removeProIdsArr = storage.getNewMailActivity().removeProIdsArr;
    }
  },
  filters: {},
  computed: {},
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
      this.getGoodsInventoryList(this.activeId);
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
        this.isHide = 1;
        this.getGoodsList(this.activeId);
      } else {
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
      this.loading = true;

      let params;
      let requestUrl;
      if (this.activeName === 'first') {
        params = {
          activityId: id ? id : null,
          pageNum: this.salingpageNum,
          pageSize: this.salingpageSize,
          sortKey: 'create_time',
          sortValue: '',
          isSaling: 2,
          type: 3,
          categoryId: '',
          proTagId: this.proTagId,
          isHide: this.isHide,
          search: this.search
        };
        requestUrl = '/api-mall/page-activity-goods';
      } else if (this.activeName === 'second') {
        params = {
          activityId: id ? id : null,
          pageNum: this.salingpageNum,
          pageSize: this.salingpageSize,
          sortKey: 'create_time',
          sortValue: '',
          isSaling: 1,
          type: 3,
          categoryId: '',
          proTagId: this.proTagId,
          isHide: this.isHideInventory,
          search: this.search
        };
        requestUrl = '/api-mall/page-activity-goods';
      } else if (this.activeName === 'fouth') {
        params = {
          activityId: id ? id : null,
          pageNum: this.salingpageNum,
          pageSize: this.salingpageSize,
          sortKey: 'create_time',
          sortValue: '',
          isSaling: 2,
          type: 3,
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
          this.loading = false;
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

          let addshow = []; //新增显示的
          let cancelArr = []; //取消的
          addshow = storage.getNewMailActivity().addProIdsArr;
          cancelArr = storage.getNewMailActivity().removeProIdsArr;
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

          //有改变的数据存储
          for (let m of this.tableData) {
            if (m.isSelStatus === 2 && m.checked === false) {
              //取消选中
              if (
                !this.removeArr.find(row => {
                  return row.mallProId === m.mallProId;
                })
              ) {
                this.removeArr.push(m);
              }
            } else if (m.isSelStatus !== 2 && m.checked) {
              //新增加的
              if (
                !this.addArr.find(row => {
                  return row.mallProId === m.mallProId;
                })
              ) {
                this.addArr.push(m);
              }
            }
          }
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
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

      this.getGoodsList();
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

    selectSaleThis(item) {
      this.selectAllbol = !this.selectAllbol;
      if (!item.checked) {
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
      let proNum = storage.getNewMailActivity().proNum ? storage.getNewMailActivity().proNum : 0;
      if (proNum + this.addArr.length - this.removeArr.length <= 0) {
        this.$message.error('没有选择商品！！');
        return;
      }
      this.selecting = false;
      this.getSelectGoods();
    },
    getSelectGoods() {
      //获取已选要设置的商品
      let arr = [];
      for (let i = 0; i < this.tableSelectData.length; i++) {
        arr.push(this.tableSelectData[i].mallProId);
      }
      let activityform = storage.getNewMailActivity();
      for (let item of this.removeArr) {
        if (this.removeProIdsArr.indexOf(item.mallProId) == -1) {
          this.removeProIdsArr.push(item.mallProId);
        }
      }
      for (let item of this.addArr) {
        if (this.addProIdsArr.indexOf(item.mallProId) == -1) {
          this.addProIdsArr.push(item.mallProId);
        }
      }
      activityform.addProIdsArr = this.addProIdsArr;
      activityform.removeProIdsArr = this.removeProIdsArr;

      storage.setNewMailActivity(activityform);
      this.$router.push({
        name: 'packageMail',
        query: {
          id: '-1'
        }
      });
      // this.$router.back(-1);
    },
    goBack() {
      this.$router.back(-1);
    }
  },
  components: {
    Treeselect,
    cateSelect
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
  width: 250px;
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
}
.goods-text-name {
  /*margin-bottom:5px;*/
  line-height: 18px;
}
.goods-text-info div {
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
.el-table:before {
  height: 0px;
}
.line-18 {
  line-height: 18px;
}
</style>
