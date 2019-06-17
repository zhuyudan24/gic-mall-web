<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title" style="position:relative;border:none">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>所有订单</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>所有订单</span>
        </h3>
      </div>
      <div class="mall-section">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs-wrap" style="background:#fff;padding-left:25px">
          <el-tab-pane label="全部" name="-1"></el-tab-pane>
          <el-tab-pane label="待付款" name="1"></el-tab-pane>
          <el-tab-pane label="待发货" name="2"></el-tab-pane>
          <el-tab-pane label="部分发货" name="7"></el-tab-pane>
          <el-tab-pane label="已发货" name="3"></el-tab-pane>
          <el-tab-pane label="交易成功" name="4"></el-tab-pane>
          <el-tab-pane label="交易关闭" name="0"></el-tab-pane>
          <el-tab-pane label="退款中" name="11"></el-tab-pane>
        </el-tabs>
        <div class="order-wrap-padding" v-loading="loading">
          <el-row :gutter="10">
            <el-col :span="16">
              <div class="order-selects">
                <div class="block">
                  <el-date-picker v-model="dateValue" @change="changeTime" type="datetimerange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2"> </el-date-picker>
                </div>
                <div class="fl">
                  <el-input placeholder="请输入会员/商品/订单信息" v-on:keyup.enter.native="getSearchOrderList()" v-model.trim="searchparams" clearable prefix-icon="el-icon-search"></el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="fr">
                <el-button type="primary" @click="batchDeliveryView">批量发货</el-button><el-button plain @click="exportOrderList()"><i class="iconfont icon-icon_yunxiazai" style="margin-right:5px"></i>导出订单</el-button>
              </div>
            </el-col>
          </el-row>

          <div style="margin-top:24px;">
            <layoutTable v-on:listonupdate="getOrderList" v-bind:orderList="orderList" :orderObj="orderObj"></layoutTable>
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
// import orderList from './orderList.vue'
// import defineTable from './defineTable.vue'
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
      // dateValue: '',
      dateValue: [new Date() - 90 * 24 * 60 * 60 * 1000, new Date().valueOf()],
      startDate: '',
      endDate: '',
      saleStatus: -1,
      orderStatus: -1,
      searchparams: '',
      evaluateStatus: -1,
      orderList: [],
      loading: true,
      pageSize: 20,
      pageNum: 1,
      currentPage4: 1,
      total: 0,
      orderObj: {
        pageNum: 1,
        pageSize: 20,
        searchparams: '',
        activeName: '-1',
        startDate: '', //开始时间
        endDate: '' //结束时间
      },
      // 导出数据控件
      projectName: 'mall', // 当前项目名
      dialogVisible: false,
      excelUrl: '/api-mall/order-list-excel', // 下载数据的地址
      params: {}, // 传递的参数
      tableData: [] // 是否有导出数据
    };
  },
  mounted() {
    if (localStorage.getItem('orderObj')) {
      this.orderObj = JSON.parse(localStorage.getItem('orderObj'));
      this.pageNum = this.orderObj.pageNum;
      this.pageSize = this.orderObj.pageSize;
      this.searchparams = this.orderObj.searchparams;
      this.activeName = this.orderObj.activeName;
      this.startDate = this.orderObj.startDate;
      this.endDate = this.orderObj.endDate;

      if (this.orderObj.startDate) {
        this.dateValue = [];
        this.dateValue[0] = this.orderObj.startDate;
        this.dateValue[1] = this.orderObj.endDate;
      } else {
        this.dateValue = '';
      }

      this.orderStatus = this.orderObj.activeName;
      localStorage.removeItem('orderObj'); //使用完就清除缓存
    }
    this.getOrderList();
  },
  computed: {},
  methods: {
    // getThreeMonth(){
    //   let currMonth = new Date().getMonth()+1;
    //   let currDate = new Date().getDate();
    //   let currDayNum = new Date( new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
    //   let hms = new Date().getHours() + ':' +new Date().getMinutes() + ':' +new Date().getSeconds();
    //   let needyear = new Date().getFullYear();
    //   let needMonth = currMonth;
    //   let needDate = currDate;
    //   let needDayNum = currDayNum;
    //   if( currMonth - 3 <= 0 ) {
    //     needyear = (new Date().getFullYear()) - 1;
    //   }
    //   if( currMonth <= 3 ) {
    //     needMonth = currMonth + 9
    //   }else {
    //     needMonth = currMonth - 3;
    //   }
    //   needDayNum = new Date( needyear, needMonth, 0).getDate();
    //   if( currDate === currDayNum ) {
    //     needDate = needDayNum;
    //   }else {
    //     if( needDayNum < currDayNum ) {
    //       needDate = needDayNum;
    //     }

    //   }
    // },
    handleSizeChange(val) {
      this.pageSize = val;
      this.orderObj.pageSize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.orderObj.pageNum = val;
      this.getOrderList();
    },
    handleClick(tab, event) {
      this.pageNum = 1;
      this.orderObj.activeName = tab.name;
      if (tab.name == '11') {
        this.saleStatus = 1;
        this.orderStatus = -1;
      } else {
        this.saleStatus = -1;
        this.orderStatus = tab.name;
      }
      this.getOrderList();
    },
    batchDeliveryView() {
      // 批量发货
      if (this.orderStatus != 2) {
        this.$message.error('批量发货只能是待发货的订单！！');
        return;
      }
      if (this.dateValue) {
        this.startDate = this.dateValue[0];
        this.endDate = this.dateValue[1];
      } else {
        this.startDate = '';
        this.endDate = '';
      }
      let data = {
        orderIds: '',
        startDate: this.startDate,
        endDate: this.endDate,
        searchInput: this.searchparams,
        requestProject: 'mall'
      };

      for (let i = 0; i < this.orderList.length; i++) {
        if (this.orderList[i].checked) {
          data.orderIds += this.orderList[i].orderId + ',';
        }
      }
      if (data.orderIds === '') {
        this.$message.error('请选择批量发货的订单');
        return false;
      }
      this.$router.push({
        name: 'batchDelivery',
        params: { searchObj: data }
      });
    },
    changeTime() {
      if (this.dateValue) {
        this.orderObj.startDate = this.dateValue[0];
        this.orderObj.endDate = this.dateValue[1];
      } else {
        this.orderObj.startDate = '';
        this.orderObj.endDate = '';
      }
      this.pageNum = 1;
      this.getOrderList();
    },
    getSearchOrderList() {
      this.pageNum = 1;
      this.orderObj.searchparams = this.searchparams;
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
        evaluateStatus: this.evaluateStatus,
        saleStatus: this.saleStatus,
        orderStatus: this.orderStatus,
        startDate: this.startDate,
        endDate: this.endDate,
        searchparams: this.searchparams,
        isSearchLogistics: 1,
        requestProject: 'mall'
      };

      request.post('/api-mall/page-mall-order', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.orderList = res.data.result.result;
            this.total = res.data.result.totalCount;
            this.loading = false;
          } else {
            this.orderList = [];
            this.total = 0;
            this.loading = false;
          }
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
        evaluateStatus: this.evaluateStatus,
        saleStatus: this.saleStatus,
        orderStatus: this.orderStatus,
        startDate: this.startDate,
        endDate: this.endDate,
        searchparams: this.searchparams,
        requestProject: 'mall'
      };
      // var urls = this.testHost + '/api-mall/order-list-excel?orderStatus='+this.orderStatus
      //   + '&startDate='+this.startDate+'&endDate='+this.endDate+'&searchparams='+this.searchparams + '&evaluateStatus='+ this.evaluateStatus + '&saleStatus=' + this.saleStatus +'&requestProject=mall';
      // window.location = urls;
    }
  },
  components: {
    // orderList,
    // defineTable,
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
.tabs-wrap {
  margin-bottom: 5px;
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
  width: 250px;
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
