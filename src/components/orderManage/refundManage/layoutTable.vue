<template>
  <div>
    <el-row class="order-list-title">
      <el-col :span="8">
        <div class="grid-content">
          商品
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content">
          退款方式
        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content">
          订单金额
        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content">
          申请金额
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content">
          申请时间
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content">
          退货物流
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content">
          售后状态
        </div>
      </el-col>
    </el-row>
    <div v-if="list.length > 0">
      <div class="order-list-wrap" v-for="(item, index) in list" :key="index">
        <div class="order-item-title">
          <span>退款编号：{{ item.orderRefundNumber }}</span>
          <span>订单编号：{{ item.orderNumber }}</span>
          <span class="order-detail" @click="goToDetail(item.orderRefundId)">
            退款详情
            <i class="el-icon-arrow-right"></i>
          </span>
        </div>
        <div class="order-item-wrap">
          <table>
            <tbody>
              <tr>
                <td>
                  <div class="goods-info">
                    <div>
                      <a href="javascript:;">
                        <img class="imgs-style" :src="item.mallProImageUrl" alt="" />
                      </a>
                    </div>
                    <div class="goods-text">
                      <div class="goods-name">{{ item.mallProName }}</div>
                      <div class="goods-text-info">
                        <div>
                          <span v-for="(item2, inds2) in JSON.parse(item.mallProSkuAttr)" :key="inds2">{{ item2.propName }}：{{ item2.valueName }} &nbsp;&nbsp;</span>
                        </div>
                        <div>SKU编码：{{ item.mallProSkuCode }}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="grid-content-other">
                    <span>{{ item.refundType | typeName }}</span>
                  </div>
                </td>
                <td>
                  <div class="grid-content-other">
                    <span>￥{{ item.maxRefundPrice }}</span>
                  </div>
                </td>
                <td>
                  <div class="grid-content-other">
                    <span>￥{{ item.applyRefundPrice }}</span>
                  </div>
                </td>
                <td>
                  <div class="grid-content-other">
                    <span>{{ item.createTime | times }}</span>
                  </div>
                </td>
                <td>
                  <div class="grid-content-other">
                    <span>{{ item.logisticsName }}</span>
                    <br />
                    <span>{{ item.logisticsNumber }}</span>
                  </div>
                </td>
                <td>
                  <div class="grid-content-other">
                    <span>{{ item.refundStatus | refundStatusName }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="no-data-wrap">
        <div class="no-data-icon">
          <img src="../../../../static/img/no-data_icon.png" />
        </div>
        <p>暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderList: {
      type: Array,
      default() {
        return [];
      }
    },
    refundObj: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      list: []
    };
  },
  filters: {
    times: function(value) {
      //时间戳转化为 yyyy-yy-yy 00:00:00格式
      var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    typeName: function(value) {
      // 退款方式名称
      let typename = '';
      if (value == 1) {
        typename = '仅退款';
      } else if (value == 2) {
        typename = '退货退款';
      }
      return typename;
    },
    refundStatusName: function(value) {
      // 退款状态名称
      let statusName = '';
      if (value == 1) {
        statusName = '退款待处理';
      } else if (value == 2) {
        statusName = '退款成功';
      } else if (value == 3) {
        statusName = '退款关闭';
      } else if (value == 4) {
        statusName = '待买家退货';
      } else if (value == 5) {
        statusName = '待商家收货';
      } else if (value == 6) {
        statusName = '拒绝退款';
      }
      return statusName;
    }
  },
  watch: {
    orderList: function(value) {
      this.list = value;
    }
  },
  methods: {
    goToDetail(orderRefundId) {
      window.localStorage.setItem('refundObj', JSON.stringify(this.refundObj));
      this.$router.push({
        name: 'refundOrderDetails',
        params: {
          orderRefundId: orderRefundId
        }
      });
    }
  }
};
</script>

<style scoped>
.order-list-title {
  height: 48px;
  line-height: 48px;
  background-color: rgba(241, 243, 247, 1);
  margin-bottom: 21px;
  padding-left: 14px;
  font-size: 13px;
  color: #303133;
  font-weight: 500;
}
.grid-content {
  text-align: left;
}
.order-list-title .order-checkbox {
  /*不起作用？*/
  /*font-size:13px !important;*/
  color: #909399;
}
.order-item-title {
  height: 48px;
  line-height: 48px;
  background-color: rgba(241, 243, 247, 1);
  margin-top: 10px;
  padding-left: 14px;
  font-size: 13px;
  color: #909399;
  position: relative;
}
.order-item-title span:nth-child(1) {
  margin-right: 43px;
}
.order-detail {
  position: absolute;
  right: 20px;
  color: #1890ff;
  cursor: pointer;
}
.order-detail:hover {
  color: #46a6ff;
}
.order-item-wrap {
  padding-left: 14px;
  border-bottom: 1px solid rgba(241, 243, 247, 1);
}
.goods-name {
  line-height: 16px;
}
.goods-info {
  height: 100%;
  display: flex;
}
.goods-info > div {
  margin: 14px 0px;
}
.goods-info .goods-text {
  margin-left: 18px;
  font-size: 13px;
  color: #303133;
}
.goods-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-text-info {
  color: #909399;
  font-size: 12px;
}
.goods-text-info div:first-child {
  margin-bottom: 4px;
}
.imgs-style {
  width: 62px;
  height: 62px;
  border: 1px solid rgba(241, 243, 247, 1);
  border-radius: 5px;
}
.grid-content-other {
  height: 90px;
  color: #303133;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  /*align-items: center;*/
  justify-content: center;
}
.grid-content-other div:first-child {
  margin-bottom: 10px;
}
table {
  width: 100%;
}
td {
  width: 12.5%;
  vertical-align: middle;
}
table tr td:nth-child(1) {
  width: 33.3333%;
}
table tr td:nth-child(3) {
  width: 8.3333%;
}
table tr td:nth-child(4) {
  width: 8.3333%;
}
table tr:nth-child(n + 2) td:nth-child(1) {
  border-top: 1px solid #ebeef5;
}
table tr:nth-child(n + 2) td:nth-child(2) {
  border-top: 1px solid #ebeef5;
}
table tr:nth-child(n + 2) td:nth-child(3) {
  border-top: 1px solid #ebeef5;
}
table tr:nth-child(n + 2) td:nth-child(4) {
  border-top: 1px solid #ebeef5;
}
.border-left {
  border-left: 1px solid #ebeef5;
}
.no-data-wrap {
  text-align: center;
}
.no-data-wrap p {
  font-size: 14px;
  color: #909399;
}
</style>
