<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/orderAll' }">订单列表</el-breadcrumb-item>
          <el-breadcrumb-item>批量发货</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <!-- <span @click="back"><i class="el-icon-arrow-left"></i></span> -->
          <span>批量发货</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="order-wrap-padding">
          <el-row :gutter="10">
            <el-col :span="15">
              <div class="order-selects">
                <div class="block" style="height:32px;">
                  <el-select v-model="logisticsCompanyId" clearable placeholder="设置快递公司" @change="setAllItemLoginstics" style="display:inline-block;">
                    <el-option v-for="item in logistics" :key="item.logisticsCompanyId" :label="item.logisticsCompanyName" :value="item.logisticsCompanyId"></el-option>
                  </el-select>
                  <div v-show="beatchSetOther" style="display:inline-block;margin-left:5px;vertical-align: top;">
                    <el-input v-model="otherLoginsticsName" @input="value => logisticsNameLimit(value)" @blur="setLogisticsName" placeholder="请输入快递公司" style="width:160px"></el-input>
                    <span class="other-name-warm">若设置为其他快递公司，则系统不提供物流信息查询</span>
                    <span style="display:none">{{ refash }}</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="fr">
                <el-button type="primary" @click="downloadTemplate"
                  >下载模板
                  <i class="iconfont icon-icon_yunxiazai"></i>
                </el-button>
                <el-button type="primary" @click="exportTemplate"
                  >导出发货单
                  <i class="iconfont icon-icon_yunxiazai"></i>
                </el-button>
                <!--<el-button type="primary" @click="importTemplate">导入运单</el-button>-->
                <el-upload class="upload-demo" :show-file-list="showFileList" :with-credentials="cookieCredentials" :data="requestProject" :name="uploadExcelFile" :action="importUrl" :on-success="uploadSuccess" :limit="1">
                  <el-button type="primary"
                    >导入运单
                    <i class="el-icon-upload el-icon--right"></i>
                  </el-button>
                </el-upload>
              </div>
            </el-col>
          </el-row>
          <div style="margin-top:24px;" v-loading="loading">
            <div class="order-list-wrap" v-for="(item, index) in list" :key="index">
              <div class="order-item-title">
                <span style="margin-right:30px">订单编号：{{ item.orderNumber }}</span>
                <span style="margin-right:30px">会员卡号：{{ item.memberCardNum }}</span>
                <span>付款时间：{{ item.payTime | times }}</span>
              </div>
              <div class="order-item-wrap">
                <table>
                  <tbody>
                    <tr v-for="(items, index) in item.orderItemList" :key="index">
                      <td>
                        <div class="goods-info">
                          <div>
                            <a href="javascript:;">
                              <img class="imgs-style" :src="items.mallProImageUrl" alt />
                            </a>
                          </div>
                          <div class="goods-text">
                            <div class="goods-text-name">{{ items.mallProName }}</div>
                            <div class="goods-text-info">
                              <div>
                                <span v-for="(item2, index2) in JSON.parse(items.mallProSkuAttr)" :key="index2">{{ item2.propName }}：{{ item2.valueName }} &nbsp;&nbsp;</span>
                              </div>
                              <div>SKU编码：{{ items.mallProSkuCode }}</div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="grid-content-other">
                          <span>￥{{ items.mallProPrice }}</span>
                        </div>
                      </td>
                      <td>
                        <div class="grid-content-other">
                          <span>{{ items.mallProNumber }}</span>
                        </div>
                      </td>
                      <td v-if="index == 0 && item.orderItemList.length > 1" class="border-left" :rowspan="item.orderItemList.length">
                        <div class="grid-content-other">
                          <p class="payer-info">
                            <span class="payer-title">收件人：</span>
                            <span class="payer-content">{{ item.buyerName }}</span>
                          </p>
                          <p class="payer-info">
                            <span class="payer-title">联系方式：</span>
                            <span class="payer-content">{{ item.buyerPhone }}</span>
                          </p>
                          <p class="payer-info">
                            <span class="payer-title">收货地址：</span>
                            <span class="payer-content">{{ item.areaName }} {{ item.addressInfo }}</span>
                          </p>
                          <p class="payer-info">
                            <span class="payer-title">买家留言：</span>
                            <span class="payer-content">{{ item.remarks }}</span>
                          </p>
                        </div>
                      </td>
                      <td v-else-if="index == 0" :rowspan="item.orderItemList.length">
                        <div class="grid-content-other">
                          <p class="payer-info">
                            <span class="payer-title">收件人：</span>
                            <span class="payer-content">{{ item.buyerName }}</span>
                          </p>
                          <p class="payer-info">
                            <span class="payer-title">联系方式：</span>
                            <span class="payer-content">{{ item.buyerPhone }}</span>
                          </p>
                          <p class="payer-info">
                            <span class="payer-title">收货地址：</span>
                            <span class="payer-content">{{ item.areaName }} {{ item.addressInfo }}</span>
                          </p>
                          <p class="payer-info">
                            <span class="payer-title">买家留言：</span>
                            <span class="payer-content">{{ item.remarks }}</span>
                          </p>
                        </div>
                      </td>
                      <td v-if="index == 0" :rowspan="item.orderItemList.length">
                        <div class="grid-content-other">
                          <el-select v-model="item.logisticsCompanyId" clearable placeholder="设置快递公司" size="small" @change="value => changeLogisticsCompany(value, item)">
                            <el-option v-for="item in logistics" :key="item.logisticsCompanyId" :label="item.logisticsCompanyName" :value="item.logisticsCompanyId"></el-option>
                          </el-select>
                          <el-input size="small" v-model="item.otherLoginsticsName" v-show="item.beatchSetOther" style @input="value => logisticsItemNameLimit(value, item)" placeholder="请输入快递公司"></el-input>
                          <span class="other-name-warm" v-show="item.beatchSetOther" style="margin:5px 0 12px 0px">若设置为其他快递公司，则系统不提供物流信息查询</span>
                          <el-input size="small" placeholder="请输入快递单号" v-model="item.logisticsNum"></el-input>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="send-delivery-btn">
              <el-button type="primary" @click="sendBatchDelivery">批量发货</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-export-excel :dataArr="list" :dialogVisible.sync="dialogVisible" :type="2" :excelUrl="excelUrl" :params="params" :projectName="projectName"></vue-gic-export-excel>
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
      logistics: [],
      logisticsCompanyId: '',
      dateValue: '',
      startDate: '',
      endDate: '',
      importUrl: '', //导入运单接口地址
      requestProject: { requestProject: 'mall' }, // 导入运单接口额外参数
      uploadExcelFile: 'uploadExcelFile',
      cookieCredentials: true,
      showFileList: false,
      orderList: [],
      list: [],
      beatchSetOther: false, //是否是其他快递
      otherLoginsticsName: '', //其他快递名称
      refash: false,
      loading: false,

      // 导出数据控件
      projectName: 'mall', // 当前项目名
      dialogVisible: false,
      excelUrl: '/api-mall/export_order_deliver', // 下载数据的地址
      params: {}, // 传递的参数
      tableData: [] // 是否有导出数据
    };
  },
  mounted() {
    this.importUrl = this.testHost + '/api-mall/upload_yundan';
    // this.importUrl = this.testHost + '/upload_yundan';
    this.searchData = this.$route.params.searchObj;
    this.getDeliveryList();
  },
  computed: {},
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
    }
  },
  methods: {
    //其他快递名称限制
    logisticsNameLimit(value) {
      this.$nextTick(() => {
        this.otherLoginsticsName = getInputVal.getInputVal(value, 8);
      });
    },
    logisticsItemNameLimit(value, item) {
      this.$nextTick(() => {
        item.otherLoginsticsName = getInputVal.getInputVal(value, 8);
      });
    },
    setAllItemLoginstics(value) {
      // 批量设置物流公司
      if (value) {
        let code = this.logistics.find(item => {
          return item.logisticsCompanyId === value;
        }).logisticsCompanyCode;

        if (code === 'QITA') {
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].logisticsCompanyId = this.logisticsCompanyId;
            this.list[i].beatchSetOther = true;
            this.list[i].otherLoginsticsName = this.otherLoginsticsName;
          }
        } else {
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].logisticsCompanyId = this.logisticsCompanyId;
            this.list[i].beatchSetOther = false;
          }
        }

        if (code === 'QITA') {
          this.beatchSetOther = true;
        } else {
          this.beatchSetOther = false;
        }
      } else {
        this.beatchSetOther = false;
        this.otherLoginsticsName = '';
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].beatchSetOther = false;
          this.list[i].otherLoginsticsName = '';
          this.list[i].logisticsCompanyId = '';
        }
      }
    },
    //批量其他快递名称
    setLogisticsName() {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].otherLoginsticsName = this.otherLoginsticsName;
      }
      this.refash = !this.refash;
    },
    changeLogisticsCompany(value, item) {
      if (value) {
        let code = this.logistics.find(item => {
          return item.logisticsCompanyId === value;
        }).logisticsCompanyCode;
        if (code === 'QITA') {
          item.beatchSetOther = true;
        } else {
          item.beatchSetOther = false;
        }
      } else {
        item.beatchSetOther = false;
      }
    },
    sendBatchDelivery() {
      // 确定批量发货

      let data = {
        logisticsInfo: {
          deliverData: []
        },
        type: '1',
        requestProject: 'mall'
      };
      let itemObj;

      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].beatchSetOther) {
          //其他的快递
          this.list[i].logisticsCompanyName = this.list[i].otherLoginsticsName;
        }
        if (this.list[i].logisticsCompanyId && this.list[i].logisticsNum) {
          //信息完善的包括物流公司和单号
          itemObj = {
            mallOrderId: this.list[i].orderId,
            orderNumber: this.list[i].orderNumber,
            logisticsCompanyId: this.list[i].logisticsCompanyId,
            logisticsCompanyName: '',
            logisticsCompanyCode: '',
            courierNumber: this.list[i].logisticsNum
          };
          for (let j = 0; j < this.logistics.length; j++) {
            if (this.list[i].logisticsCompanyId == this.logistics[j].logisticsCompanyId) {
              itemObj.logisticsCompanyName = this.logistics[j].logisticsCompanyCode === 'QITA' ? this.list[i].otherLoginsticsName : this.logistics[j].logisticsCompanyName;
              itemObj.logisticsCompanyCode = this.logistics[j].logisticsCompanyCode;
            }
          }
          data.logisticsInfo.deliverData.push(itemObj);
        }
      }
      if (!itemObj) {
        this.$message.error('请至少完善一条数据才能提交');
        return false;
      }
      data.logisticsInfo = JSON.stringify(data.logisticsInfo);
      request.post('/api-mall/batch_order_deliver', qs.stringify(data)).then(res => {
        // axios.post(this.testHost+'/batch_order_deliver',qs.stringify(data)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.result,
            type: 'success'
          });
          this.getDeliveryList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getDeliveryList() {
      // 获取批量发货订单列表
      this.loading = true;
      let params = this.searchData;
      request.post('/api-mall/load_order_batch_deliver_list', qs.stringify(params)).then(res => {
        // axios.post(this.testHost+'/load_order_batch_deliver_list',qs.stringify(params)).then(res => {
        if (res.data.errorCode == 0) {
          if (res.data.result.orderPage.result) {
            this.list = res.data.result.orderPage.result;
          } else {
            this.list = [];
          }
          for (let item of this.list) {
            item.beatchSetOther = false;
            item.otherLoginsticsName = '';
          }

          this.logistics = res.data.result.company;
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    downloadTemplate() {
      // 下载运单
      var urls = this.testHost + '/api-mall/download-yundan-template?requestProject=mall';
      // var urls = this.testHost + '/download-yundan-template?requestProject=mall';
      window.location = urls;
    },
    exportTemplate() {
      // 导出运货单

      this.params = {
        orderIds: this.searchData.orderIds,
        beginTime: this.searchData.startDate,
        endTime: this.searchData.endDate,
        searchParam: this.searchData.searchInput,
        requestProject: 'mall'
      };
      this.dialogVisible = true;
      // var urls = this.testHost + '/api-mall/export_order_deliver?requestProject=mall&orderIds=' + this.searchData.orderIds +'&beginTime='
      // + this.searchData.startDate +'&endTime=' + this.searchData.endDate +'&searchParam=' + this.searchData.searchInput;
      // window.location = urls;
    },
    uploadSuccess(res, file, fileList) {
      // 导入运货单成功回调
      if (res.errorCode == 0) {
        this.$message.success('文件上传成功!');
        let data = {
          batchId: res.result.response.returnMap.batchId,
          type: '0',
          requestProject: 'mall'
        };
        request.post('/api-mall/batch_order_deliver', qs.stringify(data)).then(res => {
          // axios.post(this.testHost+'/batch_order_deliver',qs.stringify(data)).then(res => {
          if (res.data.errorCode == 0) {
            this.$message({
              message: res.data.result,
              type: 'success'
            });
            this.getDeliveryList();
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    }
    // back(){
    //   this.$router.go(-1);//返回上一层
    // },
  },
  components: {}
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
  margin-left: 6px;
}
.upload-demo {
  display: inline-block;
  margin-left: 5px;
}
/*发货表格*/
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
.order-item-wrap {
  /*height:90px;*/
  padding-left: 14px;
  border-bottom: 1px solid rgba(241, 243, 247, 1);
  padding: 10px 0;
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
.goods-text-name {
  margin-bottom: 5px;
  line-height: 16px;
}
.goods-text-info div:first-child {
  margin-bottom: 5px;
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
.payer-info {
  margin-bottom: 6px;
}
.payer-info .payer-title {
  /* display: inline-block; */
  width: 80px;
  text-align: right;
  float: left;
}
.payer-info .payer-content {
  width: 200px;
  float: left;
}
.grid-content-other > div:first-child {
  margin-bottom: 10px;
}
table {
  width: 100%;
}
td {
  width: 12.5%;
  vertical-align: middle;
  padding: 10px 0;
}
table tr td:nth-child(1) {
  width: 33.33%;
}
table tr td:nth-child(2) {
  width: 6.33%;
}
table tr td:nth-child(3) {
  width: 4.167%;
}
table tr td:nth-child(4) {
  width: 18.667%;
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
.send-delivery-btn {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.icon-icon_yunxiazai {
  font-size: 14px;
}
.other-name-warm {
  font-size: 12px;
  color: rgb(144, 147, 153);
  margin-top: 5px;
  display: inline-block;
}
</style>
