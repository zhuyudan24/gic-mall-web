<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>报表中心</el-breadcrumb-item>
          <el-breadcrumb-item>下载日志</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>下载日志</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="operate-top">
          <div class="search-item">
            <el-date-picker @change="getTimeDate" class="date-picker" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dateValue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div>
          <div class="search-item">
            <el-select v-model="reportDataType" placeholder="所有类型" class="w-120" clearable @change="getListCurr">
              <el-option label="脱敏数据" :value="1"></el-option>
              <el-option label="完整数据" :value="2"></el-option>
            </el-select>
          </div>
          <div class="search-item">
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" class="search-input" @keyup.native.enter="getListCurr" v-model="searchValue">
              <el-select v-model="searchColumn" slot="prepend" placeholder="请选择" class="search-select">
                <el-option label="报告ID" value="report_id"></el-option>
                <el-option label="下载人员" value="download_person_name"></el-option>
                <el-option label="文件名称" value="report_name"></el-option>
                <el-option label="数据内容" value="report_content"></el-option>
              </el-select>
            </el-input>
          </div>
        </div>
        <div class="list-content">
          <el-table :data="tableData" v-loading="loading">
            <el-table-column label="报告ID">
              <template slot-scope="scope">
                <p>{{ scope.row.reportId ? scope.row.reportId : '--' }}</p>
              </template>
            </el-table-column>
            <el-table-column label="下载时间">
              <template slot-scope="scope">
                <p class="time-lh">{{ scope.row.downloadTime ? getTime(scope.row.downloadTime) : '--' }}</p>
                <p class="time-lh">{{ scope.row.downloadTime ? getSeconds(scope.row.downloadTime) : '--' }}</p>
              </template>
            </el-table-column>
            <el-table-column label="下载人员" prop="downloadPersonName"> </el-table-column>
            <el-table-column label="文件名称" prop="reportName"> </el-table-column>
            <el-table-column label="时间范围">
              <template slot-scope="scope">
                <div v-if="scope.row.reportStartTime && scope.row.reportEndTime">
                  <p class="time-lh">{{ scope.row.reportStartTime ? getTime(scope.row.reportStartTime) : '' }}至</p>
                  <p class="time-lh">{{ scope.row.reportEndTime ? getTime(scope.row.reportEndTime) : '' }}</p>
                </div>
                <div v-else>历史累计数据</div>
              </template>
            </el-table-column>
            <el-table-column label="报告类型">
              <template slot-scope="scope">
                <p>{{ scope.row.reportDataType === 1 ? '脱敏数据' : '完整数据' }}</p>
              </template>
            </el-table-column>
            <el-table-column label="数据总量" prop="reportCount"> </el-table-column>
            <el-table-column label="数据内容" prop="reportContent"> </el-table-column>

            <template slot="empty">
              <div class="no-data-wrap">
                <div class="no-data-icon">
                  <img src="../../../../static/img/no-data_icon.png" />
                </div>
                <p>暂无数据</p>
              </div>
            </template>
          </el-table>
          <div class="pagination-conteiner" v-show="tableData.length">
            <div class="pagination">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../../api/request.js';
import common from '../../../../static/js/common.js';
export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      getTime: common.getTime,
      getSeconds: common.getSeconds,
      tableData: [],
      dateValue: [],
      downloadStartTime: '',
      downloadEndTime: '',
      searchValue: '',
      searchColumn: 'report_id',
      reportDataType: '',
      applyStatus: '',
      currentPage: 1,
      pageSize: 20,
      pageSizes: [20, 40, 60, 80],
      total: 0,
      loading: false
    };
  },
  created() {
    // var reportId = this.$route.query.reportId;
    if (this.$route.query.reportId) {
      this.searchValue = this.$route.query.reportId;
    }
    this.getList();
  },

  computed: {},
  methods: {
    getList() {
      let params = {
        downloadStartTime: this.downloadStartTime,
        downloadEndTime: this.downloadEndTime,
        searchValue: this.searchValue,
        searchColumn: this.searchColumn,
        reportDataType: this.reportDataType,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        projectCode: 'mall'
      };
      request.post('/api-admin/page-download-log', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.tableData = res.data.result.result;
            this.total = res.data.result.totalCount;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getListCurr() {
      this.currentPage = 1;
      this.getList();
    },
    getTimeDate(val) {
      if (val) {
        this.downloadStartTime = val[0];
        this.downloadEndTime = val[1];
        this.currentPage = 1;
      } else {
        this.downloadStartTime = '';
        this.downloadEndTime = '';
        this.currentPage = 1;
      }

      this.getList();
    },
    // 分页
    handleSizeChange(size) {
      //设置每页条数
      this.pageSize = size;
      this.getList();
    },
    handleCurrentChange(page) {
      //设置跳到第几页
      this.currentPage = page;
      this.getList();
    }
  },
  components: {}
};
</script>
<style>
/* .input-with-select.el-input {
    width: 100px;
  }*/
</style>
<style scoped>
.operate-top {
  height: 32px;
  font-size: 0;
}
.mall-section {
  margin: 24px;
  padding: 24px;
  background: #fff;
}
.list-content {
  margin-top: 22px;
}
.search-input {
  width: 300px;
}

.search-item {
  margin-right: 8px;
  display: inline-block;
}
.w-120 {
  width: 120px;
}
.search-select {
  width: 100px;
}
.search-select /deep/ .el-input__inner {
  padding-left: 12px;
  padding-right: 0px;
}
</style>
