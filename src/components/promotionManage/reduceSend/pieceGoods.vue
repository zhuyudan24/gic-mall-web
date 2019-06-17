<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      {{ $route.meta.keepAlive }}
      <div class="mall-content-title" style="position:relative;border:none">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>促销活动</el-breadcrumb-item>
          <!--  <el-breadcrumb-item :to="{ path: '/priceList' }">阶梯价</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/newPrice' }">创建阶梯价</el-breadcrumb-item> -->
          <el-breadcrumb-item>选择单件商品</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>选择单件商品</span>
        </h3>
      </div>
      <div class="mall-section">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="bread-content">
          <div class="operate-top" v-if="activeName === 'first' || activeName === 'second'">
            <div class="fl">
              <div class="search-item">
                <treeselect :options="goodsClassifyList" placeholder="选择分类" v-model="goodsClassify" class="tree-select" style="width:400px;" @input="getSearchList" />
              </div>
              <div class="search-item">
                <el-input v-model="search" placeholder="请输入商品名称或货号" prefix-icon="el-icon-search" @keyup.enter.native="getSearchList" clearable> </el-input>
              </div>
              <div class="search-item" style="line-height:32px">
                <el-checkbox v-model="checked" @change="checkedSelected">隐藏已参加活动的商品</el-checkbox>
              </div>
            </div>
            <div class="fr">
              <!-- <el-button type="primary" @click="selectAll">全选本页</el-button> -->
              <el-checkbox v-model="selectAllStatus" label="全选本页" @change="selectAll" border></el-checkbox>
            </div>
          </div>
          <el-tab-pane label="出售中" name="first"> </el-tab-pane>
          <el-tab-pane label="仓库中" name="second"> </el-tab-pane>
          <el-tab-pane :label="'已选择' + '(' + selectNum + ')'" name="third"> </el-tab-pane>
          <div class="goods-list-content" :class="activeName === 'third' ? 'select-third' : ''">
            <template>
              <el-table :data="soldList" style="width: 100%" @sort-change="sortChange" v-loading="loading">
                <el-table-column label="商品信息" width="400px">
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
                <el-table-column label="创建时间" sortable="custom" prop="createTime">
                  <template slot-scope="scope">
                    <p class="line-18">{{ getTime(scope.row.createTime) }}</p>
                    <p class="line-18">{{ getSeconds(scope.row.createTime) }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="库存" sortable="custom" prop="stock"> </el-table-column>
                <el-table-column prop="saleNum" label="总销量" sortable="custom"> </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <div class="tip-cont">
                      <el-tooltip class="item" effect="dark" :content="'已参加其他阶梯价活动：' + scope.row.tieredNameList" placement="top" v-if="scope.row.tieredNameList !== null" style="width:160px">
                        <el-checkbox v-model="scope.row.selectedStatus" label="已参加活动" border @change="value => checkedEverySelected(value, scope.row, scope.$index)"> </el-checkbox>
                      </el-tooltip>
                      <el-checkbox v-model="scope.row.selectedStatus" label="选择商品" v-else border @change="value => checkedEverySelected(value, scope.row, scope.$index)"></el-checkbox>
                      <span style="display:none">{{ refash }}</span>
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
            </template>
            <div class="pagination-conteiner" v-show="soldList.length">
              <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
              </div>
            </div>
          </div>
        </el-tabs>
        <div class="confim-btn" :style="{ width: fixedWidth + 'px' }">
          <div class="fix-btn">
            <el-button type="primary" size="small" @click="submitGoodsId">保 存</el-button>
            <el-button size="small" @click="$router.go(-1)">返 回</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import common from '../../../../static/js/common.js';
import request from '../../../api/request.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'pieceGoods',
  data() {
    return {
      getTime: common.getTime,
      getSeconds: common.getSeconds,
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      fixedWidth: document.documentElement.clientWidth - 200,
      goodsClassifyList: [], //商品分类列表
      goodsClassify: null, //商品分类id
      search: '', //搜索关键字
      checked: false,
      activeName: 'first',
      soldList: [], //出售中的商品
      activityId: '', //活动的id
      pageNum: 1,
      pageSize: 20,
      pageSizes: [20, 40, 60, 80],
      total: 0,
      sortKey: 'create_time',
      sortValue: 'asc',
      categoryId: '', //品类
      refash: false,
      selectGoodsList: [], //保存已经选择的商品
      selectNum: 0,
      deleteGoodsList: [],
      addProIdsArr: [], //新增的arr
      removeProIdsArr: [], //取消的arr
      selectAllStatus: false,
      loading: true
    };
  },
  created() {
    // this.updated()
    this.activityId = this.$route.params.activityId;
    this.selectNum = this.$route.params.selectNum;

    this.getClassifyList();
    this.getGoodsList();

    //获取缓存数据赋值新增的和删除的

    if (localStorage.getItem('priceObj')) {
      this.addProIdsArr = JSON.parse(localStorage.getItem('priceObj')).addProIdsArr;
      this.removeProIdsArr = JSON.parse(localStorage.getItem('priceObj')).removeProIdsArr;
    }
  },

  computed: {},

  methods: {
    // 获取商品分类
    getClassifyList() {
      request.get('/api-mall/list_mall_goods_tag_tree').then(res => {
        if (res.data.errorCode === 0) {
          this.goodsClassifyList.push({
            childTagList: res.data.result.childTagList,
            mallProTagId: res.data.result.mallProTagId,
            tagName: res.data.result.tagName
          });
          this.getTree(this.goodsClassifyList);
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
          this.getTree(data[i].children);
        } else {
          delete data[i].children;
        }
      }
    },

    //获取出售中和仓库中和已选择的商品
    /*eslint-disable*/
    getGoodsList() {
      let params;
      let requestUrl;
      if (this.activeName === 'first') {
        params = {
          activityId: this.activityId,
          pageNum: this.pageNum, //当前页
          pageSize: this.pageSize, //条数
          sortKey: this.sortKey, //排序字段
          sortValue: this.sortValue, //排序
          type: 5, //阶梯价
          isSaling: 2, //在售2仓库1
          categoryId: this.categoryId, //品类
          proTagId: this.goodsClassify, //商品分类id
          search: this.search.trim(), //搜索关键字
          isHide: this.checked ? 1 : 0 //隐藏已选择的
        };
        requestUrl = '/api-mall/page-activity-goods';
      } else if (this.activeName === 'second') {
        params = {
          activityId: this.activityId,
          pageNum: this.pageNum, //当前页
          pageSize: this.pageSize, //条数
          sortKey: this.sortKey, //排序字段
          sortValue: this.sortValue, //排序
          type: 5, //阶梯价
          isSaling: 1, //在售2仓库1
          proTagId: this.goodsClassify, //商品分类id
          categoryId: this.categoryId, //品类
          search: this.search.trim(), //搜索关键字
          isHide: this.checked ? 1 : 0 //隐藏已选择的
        };
        requestUrl = '/api-mall/page-activity-goods';
      } else if (this.activeName === 'third') {
        params = {
          activityId: this.activityId,
          pageNum: this.pageNum, //当前页
          pageSize: this.pageSize, //条数
          sortKey: this.sortKey, //排序字段
          sortValue: this.sortValue, //排序
          type: 5, //阶梯价
          search: this.search.trim() //搜索关键字
        };
        requestUrl = '/api-mall/page-selected-activity-goods';
      }
      this.loading = true;
      request.post(requestUrl, qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.soldList = res.data.result.result;
            this.total = res.data.result.totalCount;
          } else {
            this.soldList = [];
            this.total = 0;
          }
          for (let item of this.soldList) {
            if (item.isSelStatus === 2) {
              item.selectedStatus = true;
              if (
                !this.selectGoodsList.find(i => {
                  return i.mallProId === item.mallProId;
                })
              ) {
                if (this.deleteGoodsList.indexOf(item.mallProId) === -1) {
                  this.selectGoodsList.push(item);
                } else {
                  item.selectedStatus = false;
                }
              }
            } else {
              item.selectedStatus = false;
            }
          }

          for (let item of this.soldList) {
            //处理分页的时候保留数据选中状态
            for (let item1 of this.selectGoodsList) {
              if (item.mallProId === item1.mallProId) {
                if (this.deleteGoodsList.indexOf(item.mallProId) === -1) {
                  item.selectedStatus = true;
                } else {
                  item.selectedStatus = false;
                }
              }
            }
          }
          let addshow = []; //新增显示的
          let cancelArr = []; //取消的
          addshow = JSON.parse(localStorage.getItem('priceObj')).addProIdsArr;
          cancelArr = JSON.parse(localStorage.getItem('priceObj')).removeProIdsArr;
          //选择回显
          for (let itm of this.soldList) {
            if (
              addshow.find(selectArrId => {
                return selectArrId.mallProId === itm.mallProId;
              })
            ) {
              itm.selectedStatus = true;
            }
          }
          // 取消的回显
          for (let itm1 of this.soldList) {
            if (
              cancelArr.find(selectArrId => {
                return selectArrId.mallProId === itm1.mallProId;
              })
            ) {
              itm1.selectedStatus = false;
            }
          }
          this.selectAllStatus = this.soldList.every(item => {
            return item.selectedStatus;
          });
          //处理选过的商品
          for (let i of this.soldList) {
            if (i.tieredNameList !== null) {
              i.tieredNameList = i.tieredNameList.join(';');
            }
          }
          this.loading = false;

          //有改变的数据存储
          for (let m of this.soldList) {
            if (m.isSelStatus === 2 && m.selectedStatus === false) {
              if (
                !this.removeProIdsArr.find(row => {
                  return row.mallProId === m.mallProId;
                })
              ) {
                this.removeProIdsArr.push(m);
              }
            } else if (m.isSelStatus !== 2 && m.selectedStatus) {
              //新增的
              if (
                !this.addProIdsArr.find(row => {
                  return row.mallProId === m.mallProId;
                })
              ) {
                this.addProIdsArr.push(m);
              }
            }
          }
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    // 分页
    handleSizeChange(size) {
      //设置每页条数
      this.pageSize = size;

      this.getGoodsList();
    },
    handleCurrentChange(page) {
      //设置跳到第几页
      this.refash = !this.refash;
      this.pageNum = page;
      this.selectAllStatus = false;
      this.getGoodsList();
    },
    // tab切换
    handleClick(tab) {
      this.selectAllStatus = false;
      this.pageNum = 1;
      this.getGoodsList();
    },
    // 搜索关键字
    getSearchList() {
      this.pageNum = 1;
      this.getGoodsList();
    },
    // 隐藏已参加活动的商品
    checkedSelected() {
      this.pageNum = 1;
      this.getGoodsList();
    },
    // 排序
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
    //单独选中
    checkedEverySelected(val, item, index) {
      this.refash = !this.refash;
      if (val) {
        //选中
        this.selectGoodsList.push(item);
        for (let i in this.deleteGoodsList) {
          if (this.deleteGoodsList.indexOf(item.mallProId) !== -1) {
            this.deleteGoodsList.splice(i, 1);
          }
        }
      } else {
        //取消选中
        for (let i in this.selectGoodsList) {
          if (item.mallProId === this.selectGoodsList[i].mallProId) {
            this.selectGoodsList.splice(i, 1);
            if (
              !this.deleteGoodsList.find(row => {
                row.mallProId === item.mallProId;
              })
            ) {
              this.deleteGoodsList.push(item.mallProId);
            }
          }
        }
        for (let i in this.addProIdsArr) {
          if (this.addProIdsArr[i].mallProId === item.mallProId) {
            this.addProIdsArr.splice(i, 1);
            i = 0;
          }
        }
      }
      //有改变的数据存储
      if (item.isSelStatus === 2 && item.selectedStatus === false) {
        //取消了

        if (
          !this.removeProIdsArr.find(row => {
            return row.mallProId === item.mallProId;
          })
        ) {
          this.removeProIdsArr.push(item);
        }
      } else if (item.isSelStatus !== 2 && item.selectedStatus) {
        //新增的
        if (
          !this.addProIdsArr.find(row => {
            return row.mallProId === item.mallProId;
          })
        ) {
          this.addProIdsArr.push(item);
        }
      }

      this.selectAllStatus = this.soldList.every(item => {
        return item.selectedStatus;
      });
    },
    //全选本页
    selectAll() {
      this.refash = !this.refash;
      if (!this.selectAllStatus) {
        //取消
        // this.selectAllStatus = false

        for (let item of this.soldList) {
          //全选所有
          item.selectedStatus = false; //所有取消
          //处理已经选择过的
          for (let i in this.selectGoodsList) {
            if (item.mallProId === this.selectGoodsList[i].mallProId) {
              this.selectGoodsList.splice(i, 1);
              if (
                !this.deleteGoodsList.find(row => {
                  row.mallProId === item.mallProId;
                })
              ) {
                this.deleteGoodsList.push(item.mallProId);
              }
            }
          }
          for (let i in this.addProIdsArr) {
            if (
              this.addProIdsArr.find(row => {
                return row.mallProId === item.mallProId;
              })
            ) {
              this.addProIdsArr.splice(i, 1);
            }
          }
          //新增还是删除选中数据处理
          if (item.isSelStatus === 2 && item.selectedStatus === false) {
            //取消了
            if (
              !this.removeProIdsArr.find(row => {
                return row.mallProId === item.mallProId;
              })
            ) {
              this.removeProIdsArr.push(item);
            }
          } else if (item.isSelStatus !== 2 && item.selectedStatus) {
            //新增的
            if (
              !this.addProIdsArr.find(row => {
                return row.mallProId === item.mallProId;
              })
            ) {
              if (
                !this.removeProIdsArr.find(row => {
                  return row.mallProId === item.mallProId;
                })
              ) {
                this.addProIdsArr.push(item);
              }
            }
          }
        }
      } else {
        //选中
        // this.selectAllStatus = true
        for (let item of this.soldList) {
          //全选所有
          item.selectedStatus = true;
          this.selectGoodsList.push(item);

          //有改变的数据存储
          //有改变的数据存储
          if (item.isSelStatus === 2 && item.selectedStatus === false) {
            //取消了
            if (
              !this.removeProIdsArr.find(row => {
                return row.mallProId === item.mallProId;
              })
            ) {
              this.removeProIdsArr.push(item);
            }
          } else if (item.isSelStatus !== 2 && item.selectedStatus) {
            //新增的
            if (
              !this.addProIdsArr.find(row => {
                return row.mallProId === item.mallProId;
              })
            ) {
              if (
                !this.removeProIdsArr.find(row => {
                  return row.mallProId === item.mallProId;
                })
              ) {
                this.addProIdsArr.push(item);
              }
            }
          }
        }
      }
    },
    //保存
    submitGoodsId() {
      let goodIds = [];
      let selectGoods = '';
      for (let item of this.selectGoodsList) {
        if (this.deleteGoodsList.indexOf(item.mallProId) === -1) {
          goodIds.push(item.mallProId);
        }
      }
      if (goodIds === []) {
        selectGoods = '';
      } else {
        selectGoods = goodIds.join(',');
      }
      // if(goodIds.length===0){
      //   this.$message.error('请选择商品')
      //   return false
      // }
      let priceObj = JSON.parse(localStorage.getItem('priceObj'));
      let selectNum = 0;
      if (priceObj.proNum) {
        selectNum = priceObj.proNum;
      } else {
        selectNum = 0;
      }
      if (selectNum + this.addProIdsArr.length - this.removeProIdsArr.length <= 0) {
        this.$message.error('请选择商品');
        return false;
      }
      priceObj.removeProIdsArr = this.removeProIdsArr;
      priceObj.addProIdsArr = this.addProIdsArr;
      // return false
      window.localStorage.setItem('priceObj', JSON.stringify(priceObj));
      this.$router.push({
        name: 'newReduceDiscount',
        params: {
          activityId: this.activityId
        }
      });
    }
  },
  components: {
    Treeselect
  }
};
</script>
<style>
/*修改商品分类样式*/
.tree-select .vue-treeselect__multi-value-item {
  line-height: 26px;
}
.tree-select .vue-treeselect--has-value .vue-treeselect__multi-value {
  margin-bottom: 0px;
}

.tree-select .vue-treeselect__multi-value-item-container {
  line-height: 26px;
}
.tree-select .vue-treeselect__placeholder,
.vue-treeselect__single-value {
  font-size: 14px;
  line-height: 32px;
}
.tree-select .vue-treeselect__placeholder {
  line-height: 32px;
}
.tree-select .vue-treeselect__multi-value-item-container {
  line-height: 24px;
}
.tree-select .vue-treeselect--has-value .vue-treeselect__multi-value {
  margin-bottom: 0px;
}
.tree-select .vue-treeselect__multi-value-item-container {
  padding-top: 5px;
}
.tree-select .vue-treeselect div {
  height: 32px;
}
.tree-select .vue-treeselect__control {
  height: 32px;
}
.tree-select .vue-treeselect__menu-container {
  font-size: 14px;
}
/*tip宽度*/
.tip-cont .el-tooltip__popper.is-dark {
  max-width: 140px !important;
}
</style>
<style scoped>
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
.select-box {
  border: 1px solid #dcdfe6;
}
.goods-info img {
  width: 80px;
  height: 80px;
  border-radius: 4px;
}
.goods-info {
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
.goods-text-info div {
  line-height: 18px;
}
/*定位的确定按钮*/
.confim-btn {
  height: 32px;
  padding: 12px 0;
  position: fixed;
  bottom: 0px;
  left: 200px;
  background: #fff;
  z-index: 3;
  text-align: center;
  border-top: 1px solid #dcdfe6;
}
.fix-btn {
  margin-left: -100px;
}
.line-18 {
  line-height: 18px;
}
</style>
