<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title" style="position:relative;border:none">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>退款管理</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>退款管理</span>
        </h3>
      </div>
      <div class="mall-section">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="background:#fff;padding-left:25px">
          <el-tab-pane label="全部" name="-1"> </el-tab-pane>
          <!-- <el-tab-pane label="退款中" name="1"></el-tab-pane> -->
          <el-tab-pane label="待商家处理" name="4"></el-tab-pane>
          <el-tab-pane label="待买家处理" name="5"></el-tab-pane>
          <el-tab-pane label="退款成功" name="2"></el-tab-pane>
          <el-tab-pane label="退款关闭" name="3"></el-tab-pane>
        </el-tabs>
        <div class="order-wrap-padding" v-loading="loading">
          <el-row :gutter="10">
            <el-col :span="16">
              <div class="order-selects">
                <div class="block">
                  <el-date-picker v-model="dateValue" @change="changeTime" type="datetimerange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2"> </el-date-picker>
                </div>
                <div class="fl">
                  <el-input placeholder="请输入商品/订单信息" v-on:keyup.enter.native="getSearchOrderList()" v-model.trim="searchparams" prefix-icon="el-icon-search" clearable></el-input>
                </div>
                <div class="fl">
                  <el-select v-model="refundType" placeholder="请选择退款方式" clearable @change="getRefundOrderList">
                    <el-option label="仅退款" :value="1"></el-option>
                    <el-option label="退货退款" :value="2"></el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="fr">
                <el-button type="primary" @click="exportOrderList()"><i class="iconfont icon-icon_yunxiazai" style="margin-right:5px"></i>导出订单</el-button>
              </div>
            </el-col>
          </el-row>
          <div style="margin-top:24px;">
            <layoutTable v-bind:orderList="orderList" :refundObj="refundObj"></layoutTable>
          </div>

          <div class="block-page-wrap" v-show="orderList.length > 0">
            <div class="block-page">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[20, 40, 60, 80]" :page-size="20" layout="total, sizes, prev, pager, next" :total="total" v-if="total != 0"> </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-export-excel :dataArr="orderList" :dialogVisible.sync="dialogVisible" :type="2" :excelUrl="excelUrl" :params="params" :projectName="projectName"></vue-gic-export-excel>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../../api/request.js';
import layoutTable from './layoutTable.vue';
import getInputVal from '../../../../static/js/common.js';
export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      getTimeAll: getInputVal.formatDate,
      length: 0,
      activeName: '-1', //tab导航当前选中的
      dateValue: [new Date() - 90 * 24 * 60 * 60 * 1000, new Date().valueOf()],
      startDate: '',
      endDate: '',
      orderStatus: -1,
      searchparams: '',
      refundType: '', //退款方式
      loading: true,
      orderList: [],
      pageSize: 20,
      pageNum: 1,
      currentPage4: 1,
      total: 0,
      refundObj: {
        pageNum: 1,
        pageSize: 20,
        searchparams: '', //搜索条件
        activeName: '-1', //tab切换
        startDate: '', //开始时间
        endDate: '', //结束时间
        refundType: ''
      },
      // 导出数据控件
      projectName: 'mall', // 当前项目名
      dialogVisible: false,
      excelUrl: '/api-mall/export-order-refund-list-excel', // 下载数据的地址
      params: {}, // 传递的参数
      tableData: [] // 是否有导出数据
    };
  },
  mounted() {
    if (localStorage.getItem('refundObj')) {
      this.refundObj = JSON.parse(localStorage.getItem('refundObj'));
      this.pageNum = this.refundObj.pageNum;
      this.pageSize = this.refundObj.pageSize;
      this.searchparams = this.refundObj.searchparams;
      this.refundType = this.refundObj.refundType;
      this.activeName = this.refundObj.activeName;
      this.startDate = this.refundObj.startDate;
      this.endDate = this.refundObj.endDate;
      if (this.refundObj.startDate) {
        this.dateValue = [];
        this.dateValue[0] = this.refundObj.startDate;
        this.dateValue[1] = this.refundObj.endDate;
        this.orderStatus = this.refundObj.activeName;
      } else {
        this.dateValue = '';
      }
      localStorage.removeItem('refundObj'); //使用完就清除缓存
    }

    this.getOrderList();
  },
  computed: {},
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.refundObj.pageSize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.refundObj.pageNum = val;
      this.getOrderList();
    },
    handleClick(tab, event) {
      this.refundObj.activeName = tab.name;
      this.orderStatus = tab.name;
      this.getOrderList();
    },
    changeTime() {
      if (this.dateValue) {
        this.refundObj.startDate = this.dateValue[0];
        this.refundObj.endDate = this.dateValue[1];
      } else {
        this.refundObj.startDate = '';
        this.refundObj.endDate = '';
      }
      this.pageNum = 1;
      this.getOrderList();
    },
    getSearchOrderList() {
      this.pageNum = 1;
      this.refundObj.searchparams = this.searchparams;
      this.refundObj.pageNum = this.pageNum;
      this.getOrderList();
    },
    getRefundOrderList() {
      this.pageNum = 1;
      this.refundObj.refundType = this.refundType;
      this.refundObj.pageNum = this.pageNum;
      this.getOrderList();
    },
    getOrderList() {
      this.loading = true;
      if (this.dateValue) {
        this.startDate = this.getTimeAll(this.dateValue[0]);
        this.endDate = this.getTimeAll(this.dateValue[1]);
      } else {
        this.startDate = '';
        this.endDate = '';
      }
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderStatus: this.orderStatus,
        startDate: this.startDate,
        endDate: this.endDate,
        searchparams: this.searchparams,
        requestProject: 'mall'
      };
      if (this.refundType !== '') {
        params.refundType = this.refundType;
      }
      request.post('/api-mall/page-mall-order-refund', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.orderList = res.data.result.result;
            this.total = res.data.result.totalCount;
          } else {
            this.orderList = [];
            this.total = 0;
          }

          this.loading = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 格式化时间 timestamp ---> yyyy-mm-dd h-m-s
    formatDig(num) {
      return num > 9 ? '' + num : '0' + num;
    },
    formatDate(time) {
      let now = new Date(time);
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      let hour = now.getHours();
      let minute = now.getMinutes();
      let second = now.getSeconds();
      let data = year + '-' + this.formatDig(month) + '-' + this.formatDig(date) + ' ' + this.formatDig(hour) + ':' + this.formatDig(minute) + ':' + this.formatDig(second);
      return data;
    },
    exportOrderList() {
      if (this.dateValue) {
        this.startDate = this.formatDate(this.dateValue[0]);
        this.endDate = this.formatDate(this.dateValue[1]);
      } else {
        this.startDate = '';
        this.endDate = '';
        this.$message.error('导出订单必须选择时间段！！');
        return;
      }
      this.dialogVisible = true;
      this.params = {
        orderStatus: this.orderStatus,
        startDate: this.startDate,
        endDate: this.endDate,
        searchparams: this.searchparams,
        requestProject: 'mall'
      };

      // var urls = this.testHost + '/api-mall/export-order-refund-list-excel?orderStatus='+this.orderStatus
      //             + '&startDate='+this.startDate+'&endDate='+this.endDate+'&searchparams='+this.searchparams+'&requestProject=mall';
      // window.location = urls;
    }
  },
  components: {
    layoutTable
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
.operate-top {
  margin: 0 25px;
  height: 40px;
  background: #fff;
  padding: 24px 25px 0px 25px;
}
.order-wrap-padding {
  margin: 24px;
  padding: 24px;
  background-color: #fff;
}
.order-selects {
  display: flex;
}
.order-selects .fl {
  margin-left: 10px;
}
/*分页*/
.block-page-wrap {
  overflow: hidden;
}
.block-page {
  float: right;
  padding-top: 30px;
  margin-bottom: 10px;
}
.icon-icon_yunxiazai {
  font-size: 14px;
}
</style>
