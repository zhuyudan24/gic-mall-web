<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/goodsList' }">微商城</el-breadcrumb-item>
          <el-breadcrumb-item class="bread-menu" :to="{ path: '/goodsList' }">商品管理</el-breadcrumb-item>
          <el-breadcrumb-item class="bread-menu" :to="{ path: '/goodsList' }">商品列表</el-breadcrumb-item>
          <el-breadcrumb-item class="bread-menu">同步失败商品</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>同步失败商品</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="operate-top">
          <div class="fl">
            <el-input v-model="searchValue" placeholder="请输入商品货号或名称" prefix-icon="el-icon-search" @keyup.enter.native="handleSearch(searchValue)"></el-input>
          </div>
          <div class="fr">
            <el-button type="primary" @click="batchSync">重新同步</el-button>
          </div>
        </div>
        <template>
          <el-table :data="goodsList" style="width: 100%" ref="multipleTable" @sort-change="sortChange">
            <el-table-column prop="proNo" label="商品货号"> </el-table-column>
            <el-table-column prop="proName" label="商品名称"> </el-table-column>
            <el-table-column prop="createTime" label="同步时间" sortable="custom">
              <template slot-scope="scope">
                <p style="line-height:18px">{{ getTime(scope.row.createTime) }}</p>
                <p style="line-height:18px" class="gray-color">{{ getSeconds(scope.row.createTime) }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="errorMessage" label="失败原因">
              <template slot-scope="scope">
                <el-popover placement="top-start" width="200" trigger="hover" :content="scope.row.errorMessage">
                  <p slot="reference" class="error-mess">{{ scope.row.errorMessage }}</p>
                </el-popover>
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
        <div class="pagination-conteiner" v-show="goodsList.length">
          <div class="pagination">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="" :visible.sync="dialogVisible" width="400px" class="center-item">
      <h3 style="margin-bottom:10px;text-align: center;margin-bottom:20px"><i class="el-icon-success" style="color:#67c23a;font-size:24px;margin-right:10px"></i>同步任务已提交</h3>
      <p style="margin-bottom:10px;color: rgb(144, 147, 153);margin-left:15px;text-align: center">请耐心等待1分钟，同步成功后，</p>
      <p style="margin-bottom:10px;color: rgb(144, 147, 153);margin-left:15px;text-align: center">可去仓库中完善这些商品的主图等信息后，上架商品</p>

      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" size="small" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '../../../api/request.js';
import common from '../../../../static/js/common.js';

export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      searchValue: '', //搜索关键字
      currentPage: 1,
      pageSizes: [20, 40, 60, 80],
      pageSize: 20,
      total: 0,
      sortColumn: 'asc', //排序依据的字段
      sortType: 0, //排序方式
      multipleSelection: [],
      getTime: common.getTime,
      getSeconds: common.getSeconds,
      dialogVisible: false,
      goodsList: []
    };
  },
  created() {
    this.getList(); //获取列表
  },

  computed: {},
  methods: {
    // 获取列表
    getList() {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        keyWord: this.searchValue.trim(),
        timeOrder: this.sortType
      };
      request.get('/api-mall/page-sync-error-log-goods', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
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
    // 搜索
    handleSearch(value) {
      this.currentPage = 1;
      this.searchValue = value;
      this.getList();
    },

    // 排序
    sortChange(value) {
      this.sortColumn = value.prop;
      if (value.order == 'ascending') {
        this.sortType = 1;
      } else if (value.order == 'descending') {
        this.sortType = 2;
      }
      this.getList();
    },
    // 批量同步
    batchSync() {
      request.get('/api-mall/resync-goods').then(res => {
        if (res.data.errorCode === 0) {
          this.dialogVisible = true;
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },

  components: {}
};
</script>
<style>
.el-table::before {
  height: 0px;
}
.no-data-wrap {
  margin: 70px 0;
}
.no-data-icon {
  margin-bottom: 20px;
}
.center-item .el-dialog__footer {
  text-align: center;
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
.error-mess {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-center .el-dialog__footer {
  text-align: center;
}
</style>
