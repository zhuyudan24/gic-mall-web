<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title" style="position:relative;border:none">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
          <el-breadcrumb-item>自定义页面</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>自定义页面</span>
        </h3>
        <!-- <div style="width:800px;position:absolute;left:50%;z-index:1;top:35px;transform: translateX(-50%);">
          <el-alert title="“辅助空白”组件已上线，小程序将不再默认添加空白，请按需求使用此组件设计主页（我们已做兼容处理，老页面仍可维持原样）" type="warning"> </el-alert>
        </div> -->
      </div>
      <div class="mall-section">
        <div class="operate-top">
          <div class="fl">
            <el-input v-model="searchValue" placeholder="请输入页面名称" prefix-icon="el-icon-search" @keyup.enter.native="handleSearch(searchValue)" clearable @clear="handleSearch(searchValue)"> </el-input>
          </div>
          <div class="fr">
            <el-button type="danger" plain @click="deleteBatch">批量删除</el-button>
            <el-button type="primary" @click="newPage">新建页面</el-button>
          </div>
        </div>
        <el-table ref="multipleTable" :data="tableList" style="width: 100%" @sort-change="sortChange" @selection-change="handleSelectionChange" v-loading="loading">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="pageName" label="页面名称" width="320px">
            <template slot-scope="scope">
              <p v-if="scope.row.editStatus" class="name-tr">
                <span>{{ scope.row.pageName }}</span>
                <i class="el-icon-edit" @click="editName(scope.row)"></i>
              </p>
              <div v-if="!scope.row.editStatus">
                <el-input v-model="scope.row.pageName" placeholder="" size="small" class="w-180" @input="value => pageLimit(value, scope.row)"></el-input>
                <span class="operate-span" @click="editNameSubmit(scope.row)">确定</span>
                <span class="operate-span" @click="editNameCancel(scope.row)">取消</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" sortable="custom" prop="createTime">
            <template slot-scope="scope">
              <p style="line-height:18px">{{ getTime(scope.row.createTime) }}</p>
              <p style="line-height:18px" class="gray-color">{{ getSeconds(scope.row.createTime) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="最后编辑时间" prop="updateTime" sortable="custom">
            <template slot-scope="scope">
              <p style="line-height:18px">{{ getTime(scope.row.updateTime) }}</p>
              <p style="line-height:18px" class="gray-color">{{ getSeconds(scope.row.updateTime) }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="isOpen" label="发布状态">
            <template slot-scope="scope">
              <el-switch @change="openStatus(scope.row)" v-model="scope.row.isOpen" :active-value="1" :inactive-value="0"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="editNewPage(scope.row.pageId)">编辑</el-button>
                <el-popover placement="top" width="160" v-model="scope.row.visible2" v-if="scope.row.isOpen == 0" style="margin-left:8px">
                  <p style="line-height:1.5;padding: 10px 10px 20px;">确定删除该页面吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible2 = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteList(scope.row.pageId, scope.$index)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="text">删除</el-button>
                </el-popover>
                <el-button type="text" v-if="scope.row.isOpen == 1" @click="wechartCode(scope.row)">页面链接</el-button>
                <!-- <span @click="editNewPage(scope.row.pageId)">编辑</span>
                <span v-if="scope.row.isOpen==0" @click="deleteList(scope.row.pageId)">删除</span>
                <span v-if="scope.row.isOpen==1" @click="wechartCode(scope.row)">页面链接</span> -->
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
    <!-- 新建弹框 -->
    <el-dialog title="新建页面" :visible.sync="dialogFormVisible" width="450px" @close="cancelNewPage('modalForm')">
      <el-form :model="modalForm" :rules="modalRules" ref="modalForm" style="width:450px">
        <el-form-item label="页面名称" label-width="80px" prop="newPageName">
          <el-input v-model="modalForm.newPageName" style="width:300px" @input="value => pageNameLimit(value)">
            <span slot="suffix" style="margin-right:5px;">{{ newPageNameLen }}/10</span>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNewPage('modalForm')">取 消</el-button>
        <el-button type="primary" @click="submitNewPage('modalForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 小程序二维码 -->
    <!-- 小程序二维码 -->
    <el-dialog title="页面链接" :visible.sync="dialogWechartCode" width="450px">
      <div class="dialog-body">
        <div class="wechat-url" style="margin-bottom:30px;">
          <p style="font-weight: 600;margin-bottom:15px">页面链接</p>
          <div style="display:flex;align-items: center">
            <el-input type="textarea" :rows="2" v-model="pageUrl" disabled> </el-input>
            <a href="javaScript:void(0)" style="width:40px;margin-left:20px" v-clipboard:copy="pageUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">
              复制
            </a>
          </div>
        </div>
        <div class="wechat-img-box" v-loading="loadingModal">
          <img :src="wechatImg" class="wechat-img" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs';
import getInputVal from '../../../../static/js/common.js';
import request from '../../../api/request.js';

export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      getTime: getInputVal.getTime,
      getSeconds: getInputVal.getSeconds,
      tableList: [],
      multipleSelection: [],
      currentPage: 1,
      pageSizes: [20, 40, 60, 80],
      pageSize: 20,
      total: 0,
      searchValue: '', //搜索字段
      sortField: 'updateTime', //排序字段
      sort: 'desc', //排序方式
      modalForm: {
        newPageName: '' //新建页面名
      },
      newPageNameLen: 0,
      modalRules: {
        newPageName: [{ required: true, message: '请输入页面名称', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogWechartCode: false,
      wechatImg: '',
      pageUrl: '',
      loading: true,
      loadingModal: true
    };
  },
  created() {
    this.getTableList();
  },

  computed: {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取列表
    getTableList() {
      let params = {
        isIndexPage: 0,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        search: this.searchValue.trim(),
        sortField: this.sortField,
        sort: this.sort
      };
      request.post('/api-mall/mall_page_list', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            for (let item of res.data.result.result) {
              item.editStatus = true;
            }
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
    //分页设置每页的数量
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getTableList();
    },
    // 分页设置跳转到第几页
    handleCurrentChange: function(page) {
      this.currentPage = page;
      this.getTableList();
    },

    // 批量删除
    deleteBatch() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请至少选择一个');
      } else {
        let arr = [];
        for (let i in this.multipleSelection) {
          if (this.multipleSelection[i].isOpen === 1) {
            this.$message.error('启用中的页面不可以删除');
            return false;
          } else {
            arr.push(this.multipleSelection[i].pageId);
          }
        }
        let params = {
          pageId: arr.join(',')
        };
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.post('/api-mall/delete_mall_page', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('删除成功');
              this.getTableList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        });
      }
    },
    // 单条删除
    deleteList(id, index) {
      let params = {
        pageId: id
      };
      request.post('/api-mall/delete_mall_page', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.tableList.splice(index, 1);
          if (this.tableList.length === 0) {
            if (this.currentPage > 1) {
              this.currentPage = this.currentPage - 1;
            }
          }
          this.$message.success('删除成功');
          this.getTableList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 小程序链接
    wechartCode(item) {
      let params = {
        type: 2,
        pageId: item.pageId,
        enterpriseId: item.enterpriseId
      };
      this.dialogWechartCode = true;
      this.loadingModal = true;
      request.post('/api-mall/mallpage-qrcode', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.wechatImg = res.data.result.url;
          this.pageUrl = res.data.result.page;
          this.loadingModal = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 编辑页面
    editNewPage(pageId) {
      this.$router.push({
        name: 'newPage',
        params: {
          pageId: pageId
        }
      });
    },
    //新建页面
    newPage() {
      this.dialogFormVisible = true;
    },
    // 确定新建
    submitNewPage(modalForm) {
      this.$refs[modalForm].validate(valid => {
        if (valid) {
          //校验通过
          let params = {
            pageName: this.modalForm.newPageName,
            isIndexPage: 0
          };
          request.post('/api-mall/add_mall_page', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('新建成功');
              this.dialogFormVisible = false;
              this.getTableList(); //拉取列表
              this.$refs[modalForm].resetFields();
              let pageId = res.data.result;
              this.$router.push({
                name: 'newPage',
                params: {
                  pageId: pageId
                }
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 取消新建
    cancelNewPage(modalForm) {
      this.dialogFormVisible = false;
      this.modalForm.newPageName = '';
      this.$refs[modalForm].resetFields();
    },
    // 编辑名字
    editName(item) {
      item.editStatus = false;
    },
    // 确定编辑名字
    editNameSubmit(item) {
      let params = {
        pageId: item.pageId,
        pageName: item.pageName,
        isOpen: item.isOpen,
        isIndexPage: 0
      };
      request.post('/api-mall/update_mall_page', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('更新成功');
          this.getTableList();
          item.editStatus = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 取消名字编辑
    editNameCancel(item) {
      item.editStatus = true;
      this.getTableList();
    },
    // 启用
    openStatus(item) {
      let params = {
        pageId: item.pageId,
        pageName: item.pageName,
        isIndexPage: 0
      };
      if (item.isOpen === 1) {
        //启用
        item.isOpen = 0;
        params.isOpen = 1;
      } else if (item.isOpen === 0) {
        item.isOpen = 1;
        params.isOpen = 0;
      }
      this.$confirm(item.isOpen == 1 ? '确认停用这个页面吗?' : '确认启用这个页面吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request.post('/api-mall/update_mall_page', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message({
                type: 'success',
                message: '更新成功!'
              });
              this.getTableList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          if (item.isOpen === 1) {
            //启用
            item.isOpen = 1;
          } else if (item.isOpen === 0) {
            item.isOpen = 0;
          }
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    //字符限制
    pageNameLimit(value) {
      this.$nextTick(() => {
        this.modalForm.newPageName = getInputVal.getInputVal(value, 10);
        this.newPageNameLen = getInputVal.getZhLen(this.modalForm.newPageName);
      });
    },
    // 页面限制
    pageLimit(value, item) {
      this.$nextTick(() => {
        item.pageName = getInputVal.getInputVal(value, 10);
      });
    },
    // 搜索筛选
    handleSearch(value) {
      this.currentPage = 1;
      this.searchValue = value;
      this.getTableList();
    },
    sortChange(value) {
      this.sortField = value.prop;
      if (value.order == 'ascending') {
        this.sort = 'asc';
      } else if (value.order == 'descending') {
        this.sort = 'desc';
      }
      if (value.order === null) {
        this.sortField = 'createTime';
      }
      this.getTableList();
    },
    // 时间戳转换成年月日
    // getTime: function(time) {
    //   if (!isNaN(time)) time = Number(time);
    //   var now = new Date(time);
    //   var year = now.getFullYear();
    //   var month = now.getMonth() + 1;
    //   month >= 10 ? (month = month) : (month = '0' + month); //判断小于10月份的情况
    //   var date = now.getDate();
    //   date >= 10 ? (date = date) : (date = '0' + date); //判断小于10日的情况
    //   return year + '-' + month + '-' + date;
    // },
    // 时间戳转换成时分秒
    // getSeconds: function(time) {
    //   if (!isNaN(time)) time = Number(time);
    //   var now = new Date(time);
    //   var hour = now.getHours();
    //   hour >= 10 ? (hour = hour) : (hour = '0' + hour); //判断小于10的时的情况
    //   var minute = now.getMinutes();
    //   minute >= 10 ? (minute = minute) : (minute = '0' + minute); //判断小于10的分的情况
    //   var second = now.getSeconds();
    //   second >= 10 ? (second = second) : (second = '0' + second); //判断小于10的秒的情况
    //   return hour + ':' + minute + ':' + second;
    // },
    onCopy(e) {
      this.$message.success('复制成功');
    },
    onError(e) {
      this.$message.error('复制失败');
    }
  },
  components: {}
};
</script>
<style>
.el-input__suffix {
  font-size: 13px;
  font-size: 13px;
  color: #909399;
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
.w-180 {
  width: 180px;
}
.el-icon-edit {
  display: none;
}
.name-tr:hover .el-icon-edit {
  display: inline-block;
  cursor: pointer;
}
.wechat-img-box {
  margin: 0 auto;
  text-align: center;
}
.wechat-img {
  width: 200px;
  height: 200px;
}
</style>
