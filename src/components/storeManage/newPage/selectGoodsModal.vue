<template>
  <div>
    <el-dialog title="选择商品" :visible="selectGoodsModal" width="1000px" @close="cancelSelectGoods">
      <div class="modal-tab">
        <el-tabs v-model="activeName">
          <div class="search-top">
            <div class="fl">
              <el-button style="height:36px" @click="selectCate" v-if="!mallCategoryId">
                选择商品品类
              </el-button>
              <el-button style="height:36px" @click="selectCate" v-else>
                {{ mallCategoryName }}
              </el-button>

              <treeselect v-model="mallProTagId" :multiple="false" :options="mallProTag" placeholder="所有分类" class="w-260" @input="searchMallTagId" style="display:inline-block;vertical-align: top;" />
            </div>
            <div class="fr">
              <el-input placeholder="请输入内容" prefix-icon="el-icon-search" clearable style="display:inline-block;" class="w-260" size="medium" v-model="searchValue" @keyup.enter.native="handleInputSearch(searchValue)"> </el-input>
              <el-button type="primary" size="medium" @click="selectAll">全选本页</el-button>
            </div>
          </div>
          <el-tab-pane label="出售中的商品" name="first">
            <template>
              <el-table :data="goodsList" style="width: 100%" @sort-change="sortChange" height="400">
                <el-table-column label="商品信息" width="450px">
                  <template slot-scope="scope">
                    <div class="img-text">
                      <img :src="scope.row.mallProImageUrl" />
                      <div class="text">
                        <p class="goods-descript">{{ scope.row.proName }}</p>
                        <p class="goods-code">货号:{{ scope.row.proCode }}</p>
                        <p style="color:red">￥{{ scope.row.mallProSpuPrice }}</p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180px">
                  <template slot-scope="scope">
                    <p>{{ getTime(scope.row.createTime) }}</p>
                    <p class="gray-color">{{ getSeconds(scope.row.createTime) }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="stock" label="库存" sortable="custom" width="160px"> </el-table-column>
                <el-table-column label="操作" width="140px">
                  <template slot-scope="scope">
                    <el-button @click="selectItem(scope.row)" v-if="scope.row.selectStatus">已选择</el-button>
                    <el-button @click="selectItem(scope.row)" v-else>请选择</el-button>
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
            <div class="fr" style="margin:15px 0">
              <el-pagination :page-size="10" :pager-count="5" @current-change="handleCurrentChange" layout="prev, pager, next" :current-page="currentPage" :total="total"> </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="'已选择(' + selectGoodsList.length + ')'" name="second">
            <template>
              <el-table :data="selectGoodsList" style="width: 100%" @sort-change="sortChange" height="400">
                <el-table-column label="商品信息" width="450px">
                  <template slot-scope="scope">
                    <div class="img-text">
                      <img :src="scope.row.mallProImageUrl" />
                      <div class="text">
                        <p class="goods-descript">{{ scope.row.proName }}</p>
                        <p class="goods-code">货号:{{ scope.row.proCode }}</p>
                        <p style="color:red">￥{{ scope.row.mallProSpuPrice }}</p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180px">
                  <template slot-scope="scope">
                    <p>{{ getTime(scope.row.createTime) }}</p>
                    <p class="gray-color">{{ getSeconds(scope.row.createTime) }}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="stock" label="库存" sortable="custom" width="160px"> </el-table-column>
                <el-table-column label="操作" width="140px">
                  <template slot-scope="scope">
                    <el-button @click="removeItem(scope.row, scope.$index)">移除</el-button>
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
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSelectGoods">取 消</el-button>
        <el-button type="primary" @click="selectGoods">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 商品品类 -->
    <cateModal @getCateMess="getCateMess" :cateModal="cateModal" @cancelCateModal="cancelCateModal"> </cateModal>
  </div>
</template>

<script>
import request from '../../../api/request.js';
import common from '../../../../static/js/common.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import cateModal from './cateModal.vue';
export default {
  props: {
    selectGoodsModal: {
      type: Boolean
    },
    goodsNum: {
      type: Number
    }
  },
  data() {
    return {
      getTime: common.getTime,
      getSeconds: common.getSeconds,

      activeName: 'first', //tab默认选中的
      mallProTag: [], //商品分类
      mallProTagId: null, //商品分类id
      mallCategoryId: '', //商品分类id
      mallCategoryName: '',
      searchValue: '', //搜索关键字
      sortType: 'asc',
      sortColumn: 'createTime',
      goodsList: [],
      selectGoodsList: [],
      total: 0,
      currentPage: 1,
      cateModal: false //商品品类弹框
    };
  },
  created() {
    this.getGoodsCate(); //商品分类
    this.getGoodsList(); //商品列表
  },
  methods: {
    // 获取的商品分类
    getGoodsCate() {
      request.get('/api-mall/list_mall_goods_tag_tree').then(res => {
        if (res.data.errorCode === 0) {
          this.mallProTag.push({
            childTagList: res.data.result.childTagList,
            mallProTagId: res.data.result.mallProTagId,
            tagName: res.data.result.tagName
          });
          this.getTree(this.mallProTag);
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
    // 搜索关键字
    handleInputSearch(val) {
      this.searchValue = val;
      this.getGoodsList();
    },
    // 品类搜索
    searchMallTagId() {
      this.getGoodsList();
    },
    // 排序
    sortChange(value) {
      this.sortColumn = value.prop;
      if (value.order == 'ascending') {
        this.sortType = 'asc';
      } else if (value.order == 'descending') {
        this.sortType = 'desc';
      }
      this.getGoodsList();
    },
    // 设置当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoodsList();
    },
    //获取商品列表
    getGoodsList() {
      let params = {
        goodsStatus: 2,
        pageNum: this.currentPage,
        pageSize: 10,
        order: this.sortType,
        sortField: this.sortColumn,
        mallCategoryId: this.mallCategoryId,
        tagId: this.mallProTagId,
        search: this.searchValue
      };
      request.get('/api-mall/page-simple-mall-goods', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            for (let i in res.data.result.result) {
              res.data.result.result[i].selectStatus = false;
              for (let j in this.selectGoodsList) {
                if (this.selectGoodsList[j].mallProId === res.data.result.result[i].mallProId) {
                  res.data.result.result[i].selectStatus = true;
                }
              }
            }

            this.goodsList = res.data.result.result;
            this.total = res.data.result.totalCount;
          } else {
            this.goodsList = [];
            this.total = 0;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 全选本页
    selectAll() {
      if (this.goodsNum <= this.selectGoodsList.length) {
        this.$message.error('商品数量已达上限');
        return false;
      } else if (this.goodsNum - this.selectGoodsList.length > 0) {
        // this.$message.error("商品数量已达上限2")
        for (let i in this.goodsList) {
          if (!this.goodsList[i].selectStatus) {
            if (this.selectGoodsList.length < this.goodsNum) {
              this.goodsList[i].selectStatus = true;
              this.selectGoodsList.push(this.goodsList[i]);
            } else {
              this.$message.error('商品数量已达上限');
              return false;
            }
          }
          // else{
          //   if(this.selectGoodsList.length<this.goodsNum){
          //     this.goodsList[i].selectStatus=true
          //     this.selectGoodsList.push(this.goodsList[i])
          //   }
          // }
        }
      }
    },
    // 单选
    selectItem(item) {
      if (item.selectStatus) {
        //变成未选
        item.selectStatus = false;
        for (let i in this.selectGoodsList) {
          if (this.selectGoodsList[i].mallProId === item.mallProId) {
            this.selectGoodsList.splice(i, 1);
          }
        }
      } else {
        if (this.goodsNum <= this.selectGoodsList.length) {
          this.$message.error('商品数量已达上限');
          return false;
        }
        item.selectStatus = true;
        this.selectGoodsList.push(item);
      }
    },
    // 移除
    removeItem(item, index) {
      this.selectGoodsList.splice(index, 1);
    },
    selectCate() {
      this.cateModal = true;
    },
    // 获取品类品系
    getCateMess(item) {
      this.mallCategoryId = item.categoryId;
      this.mallCategoryName = item.categoryName;
      this.getGoodsList();
    },
    cancelCateModal() {
      this.cateModal = false;
    },
    cancelSelectGoods() {
      this.$emit('cancelSelectGoodsModal');
    },
    // 确定选择的商品
    selectGoods() {
      this.$emit('getSelectGoods', this.selectGoodsList);
      this.cancelSelectGoods();
      // this.selectGoodsList = []

      // this.selectGoodsList = []
      // this.getGoodsList()
    },
    //保存之后处理数据
    handleDate() {
      for (let item of this.goodsList) {
        item.selectStatus = false;
      }
      this.selectGoodsList = [];
    }
  },
  components: {
    Treeselect,
    cateModal
  }
};
</script>
<style>
.w-260 {
  width: 260px;
}
.search-top {
  height: 40px;
  margin: 15px 0;
}
.el-table::before {
  height: 0px;
}
.img-text img {
  width: 80px;
  height: 80px;
}
.img-text .text {
  display: inline-block;
  vertical-align: top;
  width: 70%;
  margin-left: 3px;
  font-size: 13px;
  line-height: 14px;
}
.goods-descript {
  height: 36px;
}
.goods-code {
  margin-bottom: 6px;
}
</style>
