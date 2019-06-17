<template>
  <div>
    <el-dialog title="链接小工具" :visible="linkModal" width="1000px" @close="cancelSelectLink">
      <div class="modal-tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="商品链接" name="first">
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
                <el-input placeholder="请输入商品名称或货号" prefix-icon="el-icon-search" clearable style="display:inline-block;" class="w-260" size="medium" v-model="searchValue" @keyup.enter.native="handleInputSearch(searchValue)"> </el-input>
              </div>
            </div>
            <div class="goods-list-content">
              <ul class="goods-list" v-if="goodsList.length">
                <li class="goods-list-item" v-for="(item, index) in goodsList" @click="selectLink1(item, index)" :class="classIndex === index ? 'goods-list-item-active' : ''" :key="index">
                  <img :src="item.mallProImageUrl" />
                  <div class="img-text">
                    <p class="pro-name">{{ item.proName }}</p>
                    <p class="pro-code">货号:{{ item.proCode }}</p>
                    <p class="pro-price">￥{{ item.mallProSpuPrice }}</p>
                  </div>
                </li>
              </ul>
              <div class="no-data-wrap" style="text-align: center;" v-else>
                <div class="no-data-icon">
                  <img src="../../../../static/img/no-data_icon.png" />
                </div>
                <p>暂无数据</p>
              </div>
            </div>
            <div class="fr" style="margin:15px 0" v-if="goodsList.length">
              <el-pagination :page-size="9" @current-change="handleCurrentChange" layout="prev, pager, next" :current-page="currentPage" :total="total" :page-count="pageCount"> </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品分类链接" name="second">
            <div style="margin-top:15px;height:385px">
              <treeselect v-model="selectMallProTagId" :multiple="false" :options="selectMallProTag" :lable="selectMallProTagName" placeholder="所有分类" class="w-260" @input="selectLink2" style="display:inline-block;vertical-align: top;" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="主功能页面链接" name="third">
            <div style="height:385px;overflow-y: auto;" class="main-page">
              <el-tree :data="pageList" :props="defaultProps" @node-click="selectLink3" :disable-branch-nodes="true"> </el-tree>
            </div>
          </el-tab-pane>
          <el-tab-pane label="自定义页面链接" name="fourth">
            <div style="height:385px;overflow-y:auto;margin-top:15px">
              <div class="page-list" v-for="(item, index) in goodsPageList" :class="classIndex1 === index ? 'page-list-active' : ''" @click="selectLink4(item, index)" :key="index">{{ item.pageName }}</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="h5页面链接" name="fifth">
            <div style="height:385px;margin-top:20px">
              <el-form :model="pageLinkForm" style="margin-top:22px" :rules="pageLinkRules" label-width="90px">
                <el-form-item label="名称" prop="displayName">
                  <el-input v-model="pageLinkForm.displayName" placeholder="请输入页面名称" style="width:500px"></el-input>
                </el-form-item>
                <el-form-item label="网址" prop="url">
                  <el-input v-model="pageLinkForm.url" placeholder="请输入网址" style="width:500px"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="第三方小程序" name="sixth">
            <div style="height:385px;margin-top:30px">
              <el-select v-model="appLink.appid" placeholder="请选择" @change="changeApp">
                <el-option v-for="item in appList" :key="item.appId" :label="item.appName" :value="item.appId"> </el-option>
              </el-select>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSelectLink">取 消</el-button>
        <el-button type="primary" @click="confirmSelectLink">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 商品品类 -->
    <cateModal @getCateMess="getCateMess" :cateModal="cateModal" @cancelCateModal="cancelCateModal"> </cateModal>
  </div>
</template>

<script>
import request from '../../../api/request.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import cateModal from './cateModal.vue';
export default {
  props: {
    linkModal: {
      type: Boolean
    }
  },
  data() {
    let urlValidate = (rule, value, callback) => {
      var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (value) {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的网址'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      activeName: 'first',
      searchValue: '',
      goodsList: [], //商品列表
      mallProTag: [],
      mallProTagId: null, //分类id
      mallCategoryId: '', //商品分类id
      mallCategoryName: '',
      currentPage: 1,
      total: 0,
      pageCount: 0,
      sortType: 'asc',
      sortColumn: 'createTime',
      selectMallProTagId: null, //商品分类链接的id
      selectMallProTagName: null,
      selectMallProTag: [], //商品分类链接的列表
      //主功能页面链接
      pageList: [
        {
          id: 1,
          label: '商城首页',
          children: [
            {
              id: 'A2',
              label: '分类页'
            },
            {
              id: 'A3',
              label: '搜索页'
            },
            {
              id: 'A4',
              label: '所有商品'
            }
          ]
        },
        {
          id: 2,
          label: '购物车',
          children: [
            {
              id: 'B1',
              label: '购物车'
            }
          ]
        },
        {
          id: 3,
          label: '我的',
          children: [
            {
              id: 'E2',
              label: '商城订单'
            },
            {
              id: 'E3',
              label: '购物小票'
            }
          ]
        },
        {
          id: 4,
          label: '积分服务',
          children: [
            {
              id: 'B5',
              label: '卡券兑换列表'
            },
            {
              id: 'B6',
              label: '礼品兑换列表'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      goodsPageList: [], //商品自定义页面列表
      cateModal: false, //品类弹框
      hrefUrl: {},
      classIndex: -1,
      classIndex1: -1,
      pageLinkForm: {
        displayName: '',
        url: '',
        type: 5
      },
      appLink: {
        type: 6,
        appid: '',
        displayName: ''
      },
      appList: [],
      pageLinkRules: {
        displayName: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入网址', trigger: 'blur' }, { validator: urlValidate, trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getGoodsList(); //商品列表
    this.getGoodsCate(); //商品分类
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name;
      if (this.activeName === 'first') {
        // this.appLink.appId=''
        // this.pageLinkForm.displayName=''
        // this.pageLinkForm.url=''
        this.getGoodsList(); //商品列表
      } else if (this.activeName === 'second') {
        // this.appLink.appId=''
        // this.pageLinkForm.displayName=''
        // this.pageLinkForm.url=''
        this.getGoodsCate(); //商品分类
      } else if (this.activeName === 'third') {
        // this.appLink.appId=''
        // this.pageLinkForm.displayName=''
        // this.pageLinkForm.url=''
      } else if (this.activeName === 'fourth') {
        // this.appLink.appId=''
        // this.pageLinkForm.displayName=''
        // this.pageLinkForm.url=''
        this.getPageList(); //自定义页面
      } else if (this.activeName === 'fifth') {
        // this.appLink.appId=''
      } else if (this.activeName === 'sixth') {
        // this.pageLinkForm.displayName=''
        // this.pageLinkForm.url=''
        this.getApp();
      }
    },
    //搜索
    handleInputSearch(val) {
      this.searchValue = val;
      this.getGoodsList();
    },
    // 品类搜索
    searchMallTagId() {
      this.getGoodsList();
    },
    // 获取的商品分类
    getGoodsCate() {
      request.get('/api-mall/list_mall_goods_tag_tree').then(res => {
        if (res.data.errorCode === 0) {
          if (this.activeName === 'first') {
            this.mallProTag.push({
              childTagList: res.data.result.childTagList,
              mallProTagId: res.data.result.mallProTagId,
              tagName: res.data.result.tagName
            });
            this.getTree(this.mallProTag);
          }
          if (this.activeName === 'second') {
            this.selectMallProTag = [];
            this.selectMallProTag.push({
              childTagList: res.data.result.childTagList,
              mallProTagId: res.data.result.mallProTagId,
              tagName: res.data.result.tagName
            });

            this.getTree(this.selectMallProTag);
          }
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
    //获取商品列表
    getGoodsList() {
      let params = {
        goodsStatus: 2,
        pageNum: this.currentPage,
        pageSize: 9,
        mallCategoryId: this.mallCategoryId,
        tagId: this.mallProTagId,
        search: this.searchValue,
        order: this.sortType,
        sortField: this.sortColumn
      };
      request.get('/api-mall/page-simple-mall-goods', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.goodsList = res.data.result.result;
            this.total = res.data.result.totalCount;
            this.pageCount = res.data.result.totalPage;
          } else {
            this.goodsList = [];
            this.total = 0;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 设置当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoodsList();
    },
    //获取自定义页面列表
    getPageList() {
      let params = {
        currentPage: 1,
        pageSize: 100,
        isIndexPage: 0,
        sort: 'asc',
        sortField: 'createTime'
      };
      request.get('/api-mall/mall_page_list', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.goodsPageList = res.data.result.result;
          } else {
            this.goodsList = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    cancelSelectLink() {
      this.$emit('cancelLinkModal');
    },
    // 获取第三方小程序列表
    getApp() {
      request.get('/api-plug/applet-app-search').then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.appList = res.data.result;
          } else {
            this.appList = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    changeApp() {
      this.appLink.displayName = this.appList.find(item => {
        return item.appId === this.appLink.appid;
      }).appName;
      this.hrefUrl = this.appLink;
    },
    confirmSelectLink() {
      var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (this.activeName === 'fifth') {
        //h5页面链接
        this.hrefUrl = this.pageLinkForm;
        if (this.pageLinkForm.displayName === '') {
          this.$message.error('请输入页面名称');
        } else if (this.pageLinkForm.url === '') {
          this.$message.error('请输入网址');
        } else if (!reg.test(this.pageLinkForm.url)) {
          this.$message.error('请输入正确的网址');
        } else {
          this.hrefUrl = this.pageLinkForm;
          this.$emit('getLinkMess', this.hrefUrl);
        }
      } else {
        if (JSON.stringify(this.hrefUrl) == '{}') {
          this.$message.error('请选择链接');
        } else {
          this.$emit('getLinkMess', this.hrefUrl);
        }
      }
      this.cancelSelectLink();
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
    // 取消品类弹框
    cancelCateModal() {
      this.cateModal = false;
    },
    // 选中商品链接
    selectLink1(item, index) {
      this.hrefUrl = {
        type: 1,
        displayName: item.proName,
        mallProId: item.mallProId
      };
      this.classIndex = index;
    },
    // 选中商品分类链接
    selectLink2() {
      if (!this.selectMallProTagId) {
        this.hrefUrl = {};
        return false;
      }
      this.hrefUrl = {
        type: 2,
        mallProTagId: this.selectMallProTagId,
        displayName: ''
      };
      if (this.selectMallProTagId === '0') {
        this.hrefUrl.displayName = '所有分类';
      }
      for (let i in this.selectMallProTag[0].children) {
        if (this.selectMallProTag[0].children[i].id === this.selectMallProTagId) {
          this.hrefUrl.displayName = this.selectMallProTag[0].children[i].label;
        }
        for (let j in this.selectMallProTag[0].children[i].children) {
          if (this.selectMallProTag[0].children[i].children[j].id === this.selectMallProTagId) {
            this.hrefUrl.displayName = this.selectMallProTag[0].children[i].children[j].label;
          }
        }
      }
    },
    selectLink3(data) {
      if (data.id === 1 || data.id === 2 || data.id === 3 || data.id === 4) {
        this.hrefUrl = {};
        return false;
      }
      this.hrefUrl = {
        type: 3,
        displayName: data.label,
        funcPageCode: data.id
      };
    },
    selectLink4(item, index) {
      this.classIndex1 = index;
      this.hrefUrl = {
        type: 4,
        displayName: item.pageName,
        pageId: item.pageId
      };
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
.goods-list-item {
  border: 1px solid #e4e7ed;
  border-radius: 2px;
  width: 310px;
  padding: 10px;
  display: inline-block;
  box-sizing: border-box;
  margin: 0 10px 10px 0;
  vertical-align: top;
  cursor: pointer;
}
.goods-list-item-active {
  border-color: #409eff;
}
.goods-list-item img {
  width: 80px;
  height: 80px;
  display: inline-block;
}
.goods-list-item .img-text {
  display: inline-block;
  margin-left: 3px;
  vertical-align: top;
  width: 65%;
}
.pro-name {
  height: 45px;
  white-space: normal;
  word-break: break-all;
}
.pro-code {
  color: #909399;
  font-size: 13px;
  margin-bottom: 8px;
}
.pro-price {
  color: #f56c6c;
}
.main-page .el-tree-node__content {
  height: 44px;
}
.page-list {
  height: 45px;
  line-height: 45px;
  padding-left: 15px;
  cursor: pointer;
}
.page-list-active {
  background: #f5f7fa;
}
.page-list:hover {
  background: #f5f7fa;
}
</style>
