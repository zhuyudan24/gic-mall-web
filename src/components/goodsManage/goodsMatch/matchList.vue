<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品搭配</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>商品搭配</span>
        </h3>
      </div>
      <div class="mall-section el-toop-section">
        <div class="operate-top">
          <div class="fl">
            <el-input v-model="searchValue" placeholder="请输入商品名称/货号" prefix-icon="el-icon-search" clearable @keyup.enter.native="handleSearch(searchValue)" @clear="handleSearch(searchValue)"> </el-input>
          </div>
          <div class="fr">
            <el-button type="primary" @click="createMatch">创建搭配</el-button>
            <el-button @click="betachUpload">批量导入</el-button>
          </div>
        </div>
        <el-table :data="tableList" style="width: 100%" v-loading="loading">
          <el-table-column label="主商品" min-width="200px">
            <!-- min-width="260px" -->
            <template slot-scope="scope">
              <div class="goods-info">
                <img :src="scope.row.mainImageUrl" />
                <div class="goods-text">
                  <p>{{ scope.row.mainProName }}</p>
                  <p class="goods-spu">spu：{{ scope.row.mainBody }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="搭配商品" prop="createTime" min-width="200px">
            <!-- min-width="260px" -->
            <template slot-scope="scope">
              <div style="height:52px" class="match-img-container">
                <div v-for="(item, indx) in scope.row.proCodeAndImage" :key="indx" class="match-img-box">
                  <el-tooltip placement="bottom">
                    <div slot="content">{{ item.proName }}<br />spu:{{ item.proCode }}</div>
                    <img :src="item.imageUrl" alt="" />
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
            <template slot-scope="scope">
              <p style="line-height:18px">{{ getTime(scope.row.createTime) }}</p>
              <p style="line-height:18px" class="gray-color">{{ getSeconds(scope.row.createTime) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="editMatch(scope.row)">编辑</el-button>
                <el-popover placement="top" width="160" v-model="scope.row.visible2" style="margin-left:8px">
                  <p style="line-height:1.5;padding: 10px 10px 20px;">确定删除该搭配吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible2 = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteList(scope.row, scope.$index)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="text">删除</el-button>
                </el-popover>
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
        <div class="pagination-conteiner" v-show="tableList.length > 0">
          <div class="pagination">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 导入商品搭配弹框 -->
    <el-dialog title="导入商品搭配" :visible.sync="dialogVisible" width="620px">
      <el-form :model="dialogForm" label-position="right" label-width="80px" v-loading="dialogLoading">
        <el-form-item label="选择文件" required>
          <div class="upload-btn">
            <el-upload class="upload-ele" :action="action" :headers="headersUpload" :before-upload="uploadFileBefore" :on-success="uploadFile" with-credentials :show-file-list="showList" :data="uploadData">
              <el-button size="small"><i class="el-icon-upload2" style="margin-right:5px"></i>点击上传</el-button>
            </el-upload>
          </div>
          <!-- <a href="javaScript:void(0)" @click="downloadFile">点击下载EXCEL模板</a> -->
          <el-button type="info" plain @click="downloadFile">下载EXCEL模板</el-button>
          <p class="import-info" v-show="importMess">
            本次共导入&nbsp;<span style="font-weight:600">{{ sum }}</span
            >&nbsp;个商品，其中成功&nbsp;<span style="font-weight:600">{{ successNum }}</span
            >&nbsp;个，失败&nbsp;<span style="color:#f5222d">{{ falseNum }}</span
            >&nbsp;个 <a href="javaScript:void(0)" v-show="falseNum > 0" style="margin-left:10px" @click="showInfo">查看失败原因</a>
          </p>
        </el-form-item>
        <el-form-item label="导入规则">
          <div class="line"></div>
          <div class="upload-rules">
            <p>1. 每个文件最多300个商品</p>
            <p>2. 只需要填写主商品和搭配商品的SPU（货号）</p>
            <p>3. 仅支持.xlsx .xls文件的导入（建议直接下载模板，在模板的基础上进行数据的填充）</p>
            <p>4. 导入后，请在当前页面等待，系统将很快为您反馈导入结果！！！</p>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 搭配商品弹框 -->
    <el-dialog :title="matchTitle" :visible.sync="dialogMatch" width="520px" @close="cancelMatch">
      <div class="match-content" v-if="stepText === 1">
        <div class="search-add">
          <el-input v-model="mainSearch" placeholder="请输入主商品货号" class="main-search"></el-input>
          <el-button class="add-btn" :disabled="addMainStatus" @click="addGoodsMain">添加</el-button>
        </div>
        <div class="add-list-content">
          <div class="add-list" v-if="goodsListMain.length > 0">
            <div class="add-item" v-for="(item, index) in goodsListMain" :key="index">
              <img :src="item.mallProImageUrl" />
              <div class="goods-text-dialog">
                <p class="pro-name">{{ item.proName }}</p>
                <p class="goods-spu">spu：{{ item.proCode }}</p>
              </div>
              <el-button type="text" class="delete-btn" @click="deleteGoodsMain(index)">删除</el-button>
            </div>
          </div>
          <div class="step-tip" v-else>
            <p>步骤一：先搜索主商品并添加</p>
            <p>（主商品只能添加一个）</p>
          </div>
        </div>
      </div>

      <div class="match-content" v-if="stepText === 2">
        <div class="search-add">
          <el-input v-model="matchSearch" placeholder="请输入搭配商品货号" class="main-search"></el-input>
          <el-button class="add-btn" :disabled="addMatchStatus" @click="addGoodsMatch">添加</el-button>
        </div>
        <div class="add-list-content">
          <div class="add-list" v-if="matchGoodsList.length > 0">
            <div class="add-item" v-for="(item, index) in matchGoodsList" :key="index">
              <img :src="item.mallProImageUrl" />
              <div class="goods-text-dialog">
                <p class="pro-name">{{ item.proName }}</p>
                <p class="goods-spu">spu：{{ item.proCode }}</p>
              </div>
              <el-button type="text" class="delete-btn" @click="deleteGoodsMatch(index, item)">删除</el-button>
            </div>
          </div>
          <div class="step-tip" v-else>
            <p>步骤二：再搜索搭配商品并添加</p>
            <p>（搭配商品最多可添加6个）</p>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelMatch">取 消</el-button>
        <el-button type="primary" v-if="stepText === 1" @click="selectMatchGoods()">下一步</el-button>
        <el-button type="primary" v-if="stepText === 2" @click="submitMatch">确 定</el-button>
      </div>
    </el-dialog>
    <importInfo :importInfo="importInfo"></importInfo>
  </div>
</template>

<script>
import qs from 'qs';
import common from '../../../../static/js/common.js';
import request from '../../../api/request.js';
import importInfo from '../../common/importInfo.vue';

export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      searchValue: '', //搜索字段
      getTime: common.getTime,
      getSeconds: common.getSeconds,
      tableList: [],
      loading: false,
      currentPage: 1,
      pageSizes: [20, 40, 60, 80],
      pageSize: 20,
      total: 0,
      dialogVisible: false,
      dialogForm: {},
      showList: false,
      uploadData: {}, //额外参数
      action: window.location.origin + '/api-mall/upload-collocationScheme-selected-goods?requestProject=mall',
      // action:'http://gicdev.demogic.com/api-mall/upload-collocationScheme-selected-goods?requestProject=mall',
      headersUpload: {
        sign: ''
      },
      dialogLoading: false,
      dialogMatch: false,
      matchTitle: '添加主商品',
      stepText: 1,

      addStatus: false,
      mainSearch: '', //主商品的搜索
      addMainStatus: false, //主商品按钮状态
      goodsListMain: [], //主商品
      matchGoodsList: [], //搭配商品
      addMatchStatus: false, //搭配商品按钮状态
      matchSearch: '',
      mainProCode: '', //主商品货号
      matchProCode: '', //搭配商品货号
      successNum: 0,
      sum: 0,
      falseNum: 0,
      importMess: false,
      schemeId: '', //商品搭配的id
      importInfo: {
        //失败原因列表
        dialogVisible: false,
        infoList: [
          {
            reason: '货号在该品牌下面没有对应的商品',
            data: ['ab', '234234324', '32423432', 'sfuiwerfufg']
          },
          {
            reason: '货号在该品牌下面没有对应的商品',
            data: ['ab']
          }
        ]
      },
      isNew: true
    };
  },
  created() {
    this.getList();
  },

  computed: {},
  methods: {
    //分页设置每页的数量
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getList();
    },
    // 分页设置跳转到第几页
    handleCurrentChange: function(page) {
      this.currentPage = page;
      this.getList();
    },
    //获取列表
    getList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        search: this.searchValue
      };
      request.get('/api-mall/page-collocationScheme-goods', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.tableList = res.data.result.result;
            this.total = res.data.result.totalCount;
            this.loading = false;
          } else {
            this.tableList = [];
            this.total = 0;
            this.loading = false;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 搜索筛选
    handleSearch(value) {
      this.currentPage = 1;
      this.pageSize = 20;
      this.searchValue = value;
      this.getList();
    },
    // 删除
    deleteList(item, index) {
      let params = {
        schemeId: item.schemeId
      };
      request.post('/api-mall/delete-collocationScheme-goods', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.tableList.splice(index, 1);
          if (this.tableList.length === 0) {
            if (this.currentPage > 1) {
              this.currentPage = this.currentPage - 1;
            }
          }
          this.$message.success('删除成功！');
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 编辑搭配商品
    editMatch(item) {
      this.isNew = false;
      this.addMainStatus = true;
      this.dialogMatch = true;
      this.schemeId = item.schemeId;
      this.mainProCode = item.mainBody; //主商品货号
      this.goodsListMain = []; //主商品
      this.goodsListMain.push({
        proName: item.mainProName,
        proCode: item.mainBody,
        mallProImageUrl: item.mainImageUrl
      });
      for (let item1 of item.proCodeAndImage) {
        //搭配商品
        if (this.matchProCode !== '') {
          this.matchProCode = this.matchProCode + ',' + item1.proCode;
        } else {
          this.matchProCode = item1.proCode;
        }

        this.matchGoodsList.push({
          proName: item1.proName,
          proCode: item1.proCode,
          mallProImageUrl: item1.imageUrl
        });
      }
    },
    // 新建
    createMatch() {
      this.dialogMatch = true;
      this.isNew = true;
    },

    // 添加商品搭配
    addGoodsMain() {
      if (this.mainSearch === '') {
        this.$message.error('请输入主商品货号');
        return false;
      }
      if (this.mainProCode !== '' || this.mainSearch.split(',').length > 1) {
        this.$message.error('主商品最多添加一个');
        return false;
      }

      // 校验商品主商品是否重复
      let params1 = {
        proCodes: this.mainSearch
      };
      request.post('/api-mall/check-mainProCode', qs.stringify(params1)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result === '1') {
            this.$message.error('主商品已存在，请勿重复添加');
            this.mainSearch = '';
            return false;
          } else {
            let params = {
              proCodes: this.mainSearch
            };
            request.post('/api-mall/get-proDetail', qs.stringify(params)).then(res => {
              if (res.data.errorCode === 0) {
                this.mainProCode = this.mainSearch;
                if (res.data.result) {
                  this.goodsListMain = res.data.result;
                  this.addMainStatus = true;
                  this.mainSearch = '';
                } else {
                  this.$message.error('该商品的货号不存在');
                  this.goodsListMain = [];
                  this.mainProCode = '';
                }
              } else {
                this.$message.error(res.data.message);
              }
            });
          }
        } else {
          this.$message.error(res.data.message);
          return false;
        }
      });
    },
    // 删除主商品
    deleteGoodsMain(index) {
      this.mainProCode = '';
      this.goodsListMain = [];
      this.addMainStatus = false;
    },
    // 删除搭配商品
    deleteGoodsMatch(index, item) {
      this.addMatchStatus = false;
      this.matchGoodsList.splice(index, 1);
      let proCodeArr = [];
      for (let itm of this.matchGoodsList) {
        proCodeArr.push(itm.proCode);
      }
      this.matchProCode = proCodeArr.join(',');
    },
    selectMatchGoods() {
      //下一步
      this.matchTitle = '添加搭配商品';
      if (this.mainProCode === '') {
        this.$message.error('请添加主商品');
        return false;
      }

      this.stepText = 2;
      if (this.matchProCode.split(',').length >= 6) {
        this.addMatchStatus = true;
      }
      // this.mainSearch = ''
      // this.matchGoodsList = []
    },
    isRepeat(arr) {
      let hash = {};
      for (let i in arr) {
        if (hash[arr[i]]) {
          return true;
        }
        hash[arr[i]] = true;
      }
      return false;
    },

    //添加搭配商品
    addGoodsMatch() {
      // 判断输入框是否有重复值
      let matchArr = this.matchSearch.split(',');
      let matchArrAll = this.matchSearch.split(',').concat(this.matchProCode.split(','));
      let isRepeat = this.isRepeat(matchArr);
      let isRepeatAll = this.isRepeat(matchArrAll);
      if (isRepeat || isRepeatAll) {
        this.$message.error('禁止添加重复商品货号');
        return false;
      }
      if (this.matchProCode.split(',').length + this.matchSearch.split(',').length > 6 || this.matchSearch.split(',').length > 6) {
        this.$message.error('搭配商品最多添加6个');
        return false;
      }
      let params = {
        proCodes: this.matchSearch
      };
      request.post('/api-mall/get-proDetail', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.matchGoodsList = this.matchGoodsList.concat(res.data.result);
            if (this.matchProCode !== '') {
              this.matchProCode = this.matchProCode + ',' + this.matchSearch;
              if (this.matchProCode.split(',').length >= 6) {
                this.addMatchStatus = true;
              }
            } else {
              this.matchProCode = this.matchSearch;
            }
            this.matchSearch = '';
          } else {
            this.$message.error('该商品的货号不存在');
            this.matchProCode = this.matchSearch;
            this.matchGoodsList = this.matchGoodsList;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 确定创建商品搭配
    submitMatch() {
      if (this.matchProCode === '') {
        this.$message.error('请添加搭配商品');
        return false;
      }
      let params = {};
      let url = '';
      if (!this.isNew) {
        //编辑
        url = '/api-mall/update-collocationScheme-goods';
        params = {
          mainBody: this.mainProCode,
          otherItems: this.matchProCode,
          schemeId: this.schemeId
        };
      } else {
        //新建
        url = '/api-mall/create-collocationScheme-goods';
        params = {
          mainBody: this.mainProCode,
          otherItems: this.matchProCode
        };
      }

      request.post(url, params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('创建成功');
          this.dialogMatch = false;
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 取消
    cancelMatch() {
      this.addMainStatus = false;
      this.addMatchStatus = false;
      this.stepText = 1;
      this.dialogMatch = false;
      this.goodsListMain = []; //主商品
      this.matchGoodsList = []; //搭配商品
      this.mainSearch = '';
      this.matchSearch = '';
      this.mainProCode = ''; //主商品货号
      this.matchProCode = ''; //搭配商品货号
      this.matchTitle = '添加主商品';
    },
    // 批量导入
    betachUpload() {
      this.dialogVisible = true;
      this.importMess = false;
    },

    //下载模板
    downloadFile() {
      let url = 'static/商品搭配导入模板.xlsx';
      window.open(url);
    },
    //上传之前
    uploadFileBefore(file) {
      const isXlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const isCsv = 'application/vnd.ms-excel';
      if (file.type !== isXlsx && file.type !== isCsv) {
        this.$message.error('文件格式错误，请导入.xlsx .csv格式的文件');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.$message.error('请上传小于5MB的文件');
        return false;
      }
      if (localStorage.getItem('sign')) {
        this.headersUpload.sign = localStorage.getItem('sign');
      } else {
        this.headersUpload.sign = '';
      }
      this.dialogLoading = true;
      this.fileName = file.name;
    },
    //上传文件
    uploadFile(file, fileList) {
      this.dialogLoading = true;
      if (file.errorCode === 0) {
        this.importMess = true;
        this.successNum = file.result.successNum;
        this.sum = file.result.sum;
        this.falseNum = file.result.falseNum;
        this.dialogLoading = false;
        this.searchValue = '';
        this.currentPage = 1;
        this.pageSize = 20;
        if (file.result.failDetail) {
          this.importInfo.infoList = file.result.failDetail;
        } else {
          this.importInfo.infoList = [];
        }
        this.getList();
      } else {
        this.dialogLoading = false;
        this.$message.error(file.message);
      }
    },
    //查看失败原因】
    showInfo() {
      this.importInfo.dialogVisible = true;
    }
  },
  components: {
    importInfo
  }
};
</script>
<style>
.match-img-container .el-tooltip__popper {
  width: 240px !important;
}
.upload-btn .el-upload {
  width: 250px !important;
}
</style>
<style scoped>
.mall-section {
  margin: 24px;
  background: #fff;
  padding: 24px;
}
.operate-top {
  height: 32px;
  margin-bottom: 22px;
}
.operate-top .fr {
  font-size: 0;
}
.goods-info {
  height: 52px;
}
.goods-info img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  border: 1px solid rgba(220, 223, 230, 1);
}
.goods-text {
  display: inline-block;
  line-height: 18px;
  vertical-align: top;
  width: 70%;
  margin-left: 7px;
}
.goods-text .goods-spu {
  color: #909399;
}
.pro-name {
  word-break: break-all;
}
.match-img-box {
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
}
.match-img-box img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  border: 1px solid rgba(220, 223, 230, 1);
}
/*上传文件*/
.upload-btn {
  height: 30px;
  border: 1px dashed rgba(192, 196, 204, 1);
  display: inline-block;
  font-size: 14px;
  color: #c0c4cc;
  cursor: pointer;
  margin-right: 10px;
  text-align: center;
  border-radius: 4px;
}
.import-info {
  color: #606266;
  margin-top: 10px;
}
.upload-ele .el-button {
  border: none;
  color: #c0c4cc;
}
.upload-ele .el-button--small {
  padding: 7px 15px;
}
.upload-btn .el-icon-upload2 {
  font-size: 16px;
  color: #c0c4cc;
}
/*.upload-btn:hover .el-button,.upload-btn .el-button:focus{
   color: #1890ff;
 }
 .upload-btn:hove .el-button span{
    color: #1890ff;
 }
 .upload-btn:hover .el-icon-upload2{
    color: #1890ff;
 }*/
.upload-btn:hover {
  border-color: #1890ff;
}
.line {
  border-top: 1px solid #e4e7ed;
  position: absolute;
  left: 0px;
  top: 15px;
  width: 100%;
}
.upload-rules {
  color: #909399;
  font-size: 13px;
  line-height: 18px;
  margin-top: 30px;
}
/*搭配商品弹框*/
.main-search {
  width: 380px;
}
.search-add {
  font-size: 0;
}
.add-btn {
  margin-left: 10px;
  vertical-align: top;
}
.add-list-content {
  min-height: 90px;
}
.add-list {
  margin-top: 22px;
}
.add-item {
  width: 420px;
  border-bottom: 1px solid #dcdfe6;
  padding: 15px 15px;
}
.add-item:last-child {
  border-bottom: none;
}
.add-item img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  border: 1px solid rgba(220, 223, 230, 1);
  vertical-align: middle;
}
.goods-text-dialog {
  display: inline-block;
  line-height: 18px;
  vertical-align: middle;
  width: 306px;
  margin-left: 7px;
}
.goods-text-dialog .goods-spu {
  color: #909399;
}
.delete-btn {
  vertical-align: middle;
  margin-left: 10px;
}
.step-tip {
  margin-top: 30px;
  color: #909399;
  text-align: center;
  line-height: 22px;
}
</style>
