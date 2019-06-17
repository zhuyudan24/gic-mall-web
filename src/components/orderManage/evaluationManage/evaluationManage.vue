<template>
  <div class="mall-section-container">
    <div class="mall-content-section">
      <div class="mall-content-title">
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
        <el-tabs v-model="activeName" class="bread-content">
          <el-tab-pane label="全部" name="first">
            <div class="order-wrap-padding">
              <el-row :gutter="10">
                <el-col :span="16">
                  <el-row type="flex" class="row-bg">
                    <el-col :span="7">
                      <div class="block">
                        <el-date-picker v-model="value7" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2"> </el-date-picker>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="fl">
                        <el-input placeholder="请输入内容" size="medium" prefix-icon="el-icon-search"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <div class="fr">
                    <el-button type="primary">批量发货</el-button>
                    <el-button type="primary">导出订单</el-button>
                  </div>
                </el-col>
              </el-row>
              <!--<orderList></orderList>-->
            </div>
          </el-tab-pane>
          <el-tab-pane label="待付款" name="second">待付款2</el-tab-pane>
          <el-tab-pane label="待发货" name="third">待发货3</el-tab-pane>
          <el-tab-pane label="部分发货" name="fourth">部分发货</el-tab-pane>
          <el-tab-pane label="已发货" name="fifth">已发货</el-tab-pane>
          <el-tab-pane label="交易成功" name="sixth">交易成功</el-tab-pane>
          <el-tab-pane label="交易关闭" name="seventh">交易关闭</el-tab-pane>
          <el-tab-pane label="退款中" name="eighth">退款中</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
// import orderList from './orderList.vue'
export default {
  data() {
    return {
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
      length: 0,
      activeName: 'first', //tab导航当前选中的
      value7: ''
    };
  },
  computed: {
    // dataLen() {
    //   return this.$refs['firstChilden']
    // }
  },
  methods: {
    dataLen(arr) {
      this.length = arr.length;
      return arr.length;
    }
  }
  // components:{
  //   orderList
  // }
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
  background-color: #fff;
}
</style>
