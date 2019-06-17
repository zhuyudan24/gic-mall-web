<template>
  <div>
    <el-row class="order-list-title">
      <el-col :span="3">
        <div>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="order-checkbox">全选</el-checkbox>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content">
          商品
        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content" style="text-align:center;">
          单价
        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content" style="text-align:center;">
          数量
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content" style="text-align:center;">
          售后
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content" style="text-align:center;">
          买家
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content" style="text-align:center;">
          交易状态
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content" style="text-align:center;">
          实付金额
        </div>
      </el-col>
    </el-row>
    <div v-if="list.length > 0">
      <div class="order-list-wrap" v-for="(item, index) in list" :key="index">
        <div class="order-item-title">
          <el-checkbox :label="item.id" v-model="item.checked" @change="handleCheckedCitiesChange"></el-checkbox>
          <span style="margin-right:43px">订单编号：{{ item.orderNumber }}</span>
          <span>下单时间：{{ item.createTime | times }}</span>
          <span class="order-detail" @click="goToDetail(item.orderId)">
            订单详情
            <i class="el-icon-arrow-right"></i>
          </span>
        </div>
        <div class="order-item-wrap">
          <table>
            <tbody>
              <tr v-for="(items, index) in item.orderItemList" :key="index">
                <td>
                  <div class="goods-info">
                    <div>
                      <a href="javascript:;">
                        <img class="imgs-style" :src="items.mallProImageUrl" alt="" />
                      </a>
                    </div>
                    <div class="goods-text">
                      <div class="goods-text-name">
                        <span class="zeng-pin" v-if="items.isGift === 1">赠品</span><span>{{ items.mallProName }}</span>
                      </div>
                      <div class="goods-text-info">
                        <div>
                          <span v-for="(item2, inx) in JSON.parse(items.mallProSkuAttr)" :key="inx">{{ item2.propName }}：{{ item2.valueName }} &nbsp;&nbsp;</span>
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
                <td>
                  <div class="grid-content-other">
                    <span>{{ items.refundStatus | afterSales }}</span>
                  </div>
                </td>
                <td v-if="index == 0 && item.orderItemList.length > 1" class="border-left" :rowspan="item.orderItemList.length">
                  <div class="grid-content-other">
                    <div>{{ item.memberName }}</div>
                    <div>
                      <a :href="windowUrl + '/member/#/wechatmemberDetail?memberId=' + item.memberId" target="_blank">{{ item.memberCardNum }}</a>
                    </div>
                  </div>
                </td>
                <td v-else-if="index == 0" :rowspan="item.orderItemList.length">
                  <div class="grid-content-other">
                    <div>{{ item.memberName }}</div>
                    <div>
                      <a :href="windowUrl + '/member/#/wechatmemberDetail?memberId=' + item.memberId" target="_blank">{{ item.memberCardNum }}</a>
                    </div>
                  </div>
                </td>
                <td v-if="index == 0" :rowspan="item.orderItemList.length">
                  <div class="grid-content-other">
                    <div>{{ item.orderStep | orderStepName }}</div>
                    <div v-if="item.orderStep == 1" @click="closeOrderShow(item.orderId)"><a href="javascript:;">关闭订单</a></div>
                    <div v-if="item.orderStep === 2" @click="showdeliveryOrder(item, items.refundStatus)"><a href="javascript:;">发货</a></div>
                    <!-- 拆单发货 -->
                    <div v-if="item.orderStep === 7" @click="splitDeliveryOrder(item)"><a href="javascript:;">发货</a></div>
                    <!-- <div v-if="item.orderStep === 2 " @click="showdeliveryOrder(item,items.refundStatus)"><a href="javascript:;">发货</a></div>
                    <div v-if="item.orderStep ===7 && item.splitDeliverGoodsOnOff != 0&&item.refundStatus!==0 " @click="splitDeliveryOrder(item)"><a href="javascript:;">拆单发货</a></div> -->
                    <!-- <div v-if="item.orderStep === 2&&item.refundStatus===0" @click="showdeliveryOrder(item,items.refundStatus)"><a href="javascript:;">发货1</a></div>
                    <div v-else @click="splitDeliveryOrder(item)"><a href="javascript:;">发货3</a></div> -->
                    <!-- <div v-else @click="splitDeliveryOrder(item)"><a href="javascript:;">发货3</a></div> -->

                    <!-- <div v-if="item.orderStep == 7 && item.splitDeliverGoodsOnOff != 0||item.refundStatus!==0" @click="splitDeliveryOrder(item)"><a href="javascript:;">发货2</a></div> -->
                    <!--<div @click="splitDeliveryOrder(item)"><a href="javascript:;">拆单发货</a></div>-->
                  </div>
                </td>
                <td v-if="index == 0" :rowspan="item.orderItemList.length">
                  <div class="grid-content-other">
                    <div>￥{{ (item.payAmount + item.actualFreight).toFixed(2) }} (含运费：￥{{ item.actualFreight }})</div>
                    <div v-if="item.orderStep == 1" @click="freightOrder(item.orderId)"><a href="javascript:;">修改运费</a></div>
                    <!--  -->
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
    <!--关闭订单-->
    <el-dialog title="关闭订单" :visible.sync="closeOrderDialog" width="464px" @close="canceclCloseOrderDeal">
      <div class="close-reason">关闭原因</div>
      <div class="close-reason-info">
        <el-input type="textarea" :rows="3" v-model="closeOrderForm.closeReason"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canceclCloseOrderDeal">取 消</el-button>
        <el-button type="primary" @click="closeOrderDeal" :loading="closeLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--整单发货-->
    <el-dialog :visible.sync="deliveryOrderDialog" width="464px" @close="cancelDeliveryOrderDeal">
      <div class="all-delivery" slot="title">
        整单发货
        <div class="go-split-delivery" v-if="deliveryOrder.splitDeliverGoodsOnOff != 0 && !orderItemOnlyOne" @click="goSplitDeliveryOrder()"><a href="javascript:;">去拆单发货</a></div>
      </div>
      <div class="dialog-content">
        <div class="close-reason">收货信息:</div>
        <div class="close-reason-info">{{ deliveryOrder.buyerName }},{{ deliveryOrder.buyerPhone }},{{ deliveryOrder.areaName }} {{ deliveryOrder.addressInfo }}</div>
      </div>
      <div class="dialog-content">
        <div class="close-reason">物流公司</div>
        <div class="close-reason-info">
          <el-select v-model="deliveryOrderForm.logisticsCompanyId" clearable filterable placeholder="请选择" class="width-style" @change="changeLogisticsCompanyName">
            <el-option v-for="item in logistics" :key="item.logisticsCompanyId" :label="item.logisticsCompanyName" :value="item.logisticsCompanyId"> </el-option>
          </el-select>
        </div>
      </div>
      <div style="margin-left: 75px;width:340px;margin-bottom:22px" v-show="otherLogistics">
        <el-input v-model="otherLogisticsName" placeholder="请输入快递公司" @input="value => logisticsNameLimit(value)"></el-input>
        <span class="other-name-warm">若设置为其他快递公司，则系统不提供物流信息查询</span>
      </div>
      <div class="dialog-content">
        <div class="close-reason">物流单号</div>
        <div class="close-reason-info">
          <el-input type="text" v-model="deliveryOrderForm.courierNumber" @input="value => courierNumberLimit(value)"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDeliveryOrderDeal">取 消</el-button>
        <el-button type="primary" @click="deliveryOrderDeal" :loading="deliveryLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--拆单发货-->
    <el-dialog title="拆单发货" :visible.sync="splitDeliveryOrderDialog" width="88%">
      <el-row class="split-title">
        <el-col :span="12"> 当前收货信息共有可发货 {{ canDeliveryNum }}个订单 </el-col>
        <el-col :span="12"> 收货信息： {{ splitOrderInfo.buyerName }},{{ splitOrderInfo.buyerPhone }},{{ splitOrderInfo.areaName }} {{ splitOrderInfo.addressInfo }} </el-col>
      </el-row>
      <el-row class="order-list-title">
        <el-col :span="8">
          <div class="grid-content">
            商品
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content grid-center">
            购买数量
          </div>
        </el-col>
        <!-- <el-col :span="3">
          <div class="grid-content">
            发货数量
          </div>
        </el-col> -->
        <el-col :span="4">
          <div class="grid-content">
            物流公司
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content">
            物流单号
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
            交易状态
          </div>
        </el-col>
      </el-row>
      <div class="order-item-title">
        <span>订单编号：{{ splitOrderInfo.orderNumber }}</span>
        <span>下单时间：{{ splitOrderInfo.createTime | times }}</span>
      </div>
      <div class="order-item-wrap">
        <table class="split-table">
          <tbody>
            <tr v-for="(items, index) in splitOrderInfo.orderItemList" :key="index">
              <td>
                <div class="goods-info">
                  <div>
                    <a href="javascript:;">
                      <img class="imgs-style" :src="items.mallProImageUrl" alt="" />
                    </a>
                  </div>
                  <div class="goods-text">
                    <div class="goods-text-name">
                      <span class="zeng-pin" v-if="items.isGift === 1">赠品</span><span>{{ items.mallProName }}</span>
                    </div>
                    <div class="goods-text-info">
                      <div>
                        <span v-for="(item2, indx2) in JSON.parse(items.mallProSkuAttr)" :key="indx2">{{ item2.propName }}：{{ item2.valueName }} &nbsp;&nbsp;</span>
                      </div>
                      <div>SKU编码：{{ items.mallProSkuCode }}</div>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div class="grid-content-other">
                  <span>{{ items.mallProNumber }} </span>
                  <span v-if="items.refundCount > 0">(已退{{ items.refundCount }}) </span>
                </div>
              </td>
              <td>
                <div class="split-logistics-other" v-for="(itemss, indexss) in items.orderLogistics" :key="indexss">
                  <p>
                    <el-select v-model="itemss.logisticsCompanyId" :disabled="!itemss.isNew" clearable filterable placeholder="请选择" @change="value => changeLogisticsItem(value, itemss)">
                      <el-option v-for="item in logistics" :key="item.logisticsCompanyId" :label="item.logisticsCompanyName" :value="item.logisticsCompanyId"> </el-option>
                    </el-select>
                  </p>
                  <div style="margin-top:14px" v-show="itemss.otherLogistics">
                    <el-input v-model="itemss.otherLogisticsName" @input="value => logisticsItemNameLimit(value, itemss)" placeholder="请输入快递公司"></el-input>
                    <span class="other-name-warm">若设置为其他快递公司，则系统不提供物流信息查询</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="split-content-other" v-for="(itemss, indexs) in items.orderLogistics" :key="indexs">
                  <p class="split-order-wuliunum">
                    <el-input v-model="itemss.courierNumber" :disabled="!itemss.isNew" placeholder="请输入内容" @input="value => courierNumberItemLimit(value, itemss)"></el-input>
                  </p>
                  <p v-if="indexs > 0 && itemss.isNew"><el-button type="text" @click="deleteOrder(index, indexs)">删除</el-button></p>
                  <p v-else style="visibility: hidden;">删除</p>
                </div>
              </td>
              <td>
                <div class="grid-content-other">
                  <span>{{ items.orderItemStatus | orderStepName }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSplitDeliveryOrderDeal">取 消</el-button>
        <el-button type="primary" @click="splitDeliveryOrderDeal" :loading="splitLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改运费-->
    <el-dialog title="修改运费" :visible.sync="freightOrderDialog" width="464px" @close="cancelFreightOrderDeal">
      <div class="dialog-content">
        <div class="close-reason">快递运费</div>
        <div class="close-reason-info">
          <el-input type="number" v-model="freightOrderForm.actualFreight">
            <template slot="append">
              元
            </template>
          </el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFreightOrderDeal">取 消</el-button>
        <el-button type="primary" @click="freightOrderDeal" :loading="freightOrderLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs';
import getInputVal from '../../../../static/js/common.js';
import request from '../../../api/request.js';
export default {
  props: {
    orderList: {
      type: Array,
      default() {
        return [];
      }
    },
    orderObj: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      closeOrderDialog: false,
      closeOrderForm: {
        closeReason: '',
        mallOrderId: ''
      },
      logistics: [],
      deliveryOrder: {},
      deliveryOrderDialog: false,
      deliveryOrderForm: {
        logisticsCompanyId: '',
        courierNumber: '',
        mallOrderId: ''
      },
      splitOrderInfo: {},
      canDeliveryNum: 0,
      splitDeliveryOrderDialog: false,
      splitDeliveryOrderForm: {
        logisticsCompanyId: '',
        courierNumber: '',
        mallOrderId: '',
        itemDelivery: ''
      },
      freightOrderDialog: false,
      freightOrderForm: {
        actualFreight: '',
        orderId: ''
      },
      list: [],
      windowUrl: window.location.origin,
      //整单发
      otherLogistics: false,
      otherLogisticsName: '', //其他物流名字
      orderItemOnlyOne: false,
      deliveryLoading: false,
      splitLoading: false,
      closeLoading: false,
      freightOrderLoading: false
    };
  },
  mounted() {
    for (let i = 0; i < this.list.length; i++) {
      // this.list[i].checked = false;
      this.$set(this.list[i], 'checked', false);
    }
    this.getLogistics();
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
    afterSales: function(value) {
      //售后显示
      if (value == 1) {
        return '退款中';
      }
      if (value == 2) {
        return '退款成功';
      }
      if (value == 3) {
        return '退款关闭';
      }
      return '';
    },
    orderStepName: function(value) {
      //交易状态显示
      if (value == 0) {
        return '交易关闭';
      }
      if (value == 1) {
        return '待付款';
      }
      if (value == 2) {
        return '买家已付款';
      }
      if (value == 3) {
        return '已发货';
      }
      if (value == 4) {
        return '交易完成';
      }
      if (value == 7) {
        return '部分发货';
      }
      return '';
    }
  },
  methods: {
    // 订单列表的全反选
    handleCheckAllChange(val) {
      if (val) {
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].checked = true;
        }
      } else {
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].checked = false;
        }
      }
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedOrdersLength = 0;
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].checked) {
          checkedOrdersLength += 1;
        }
      }
      this.checkAll = checkedOrdersLength === this.list.length;
      this.isIndeterminate = checkedOrdersLength > 0 && checkedOrdersLength < this.list.length;
    },
    closeOrderShow(orderId) {
      // 显示关闭订单
      this.closeOrderDialog = true;
      this.closeOrderForm.mallOrderId = orderId;
    },
    closeOrderDeal() {
      //确定订单关闭
      if (this.closeOrderForm.closeReason == '') {
        this.$message.error('请填写关闭原因！');
        return;
      }
      let params = {
        closeReason: this.closeOrderForm.closeReason,
        mallOrderId: this.closeOrderForm.mallOrderId,
        requestProject: 'mall'
      };
      this.closeLoading = true;
      request.post('/api-mall/close-mall-order', qs.stringify(params)).then(res => {
        // axios.post(this.testHost+'/close-mall-order',qs.stringify(params)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.result,
            type: 'success'
          });
          this.$emit('listonupdate');
          this.closeOrderDialog = false;
          this.closeLoading = false;
        } else {
          this.$message.error(res.data.message);
          this.closeLoading = false;
        }
      });
    },
    canceclCloseOrderDeal() {
      //取消订单关闭
      this.closeOrderDialog = false;
      this.closeOrderForm.closeReason = '';
    },
    getLogistics() {
      // 获取物流公司列表
      let data = {
        requestProject: 'mall'
      };
      request.get('/api-mall/logisties-list', { params: data }).then(res => {
        // axios.get(this.testHost+'/logisties-list',{params:data}).then(res => {
        if (res.data.errorCode == 0) {
          this.logistics = res.data.result.logistiesList;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    showdeliveryOrder(obj, refundStatus) {
      // 显示整单发货弹窗
      if (obj.orderItemList) {
        if (obj.orderItemList.length !== 1) {
          this.orderItemOnlyOne = false;
        } else {
          this.orderItemOnlyOne = true;
        }
        // if (obj.orderItemList.length === 1 && obj.orderItemList[0].mallProNumber === 1) {
        //   this.orderItemOnlyOne = true;
        // } else {
        //   this.orderItemOnlyOne = false;
        // }
      }

      // for(let i in obj.orderItemList){
      //   if(obj.orderItemList[i].refundStatus===1||obj.orderItemList[i].refundStatus===6){
      //     this.$alert('当前有待处理的仅退款单据，请优先处理退款在进行发货', '发货失败', {
      //     confirmButtonText: '确定',
      //   });
      //   return false
      //   }
      // }
      this.deliveryOrder = obj;
      this.deliveryOrderForm.mallOrderId = obj.orderId;
      this.deliveryOrderDialog = true;
      // this.getLogistics();
    },
    //整单其他
    changeLogisticsCompanyName(value) {
      if (value) {
        //通过id找到code
        let code = this.logistics.find(item => {
          return item.logisticsCompanyId === value;
        }).logisticsCompanyCode;
        if (code === 'QITA') {
          this.otherLogistics = true;
        } else {
          this.otherLogistics = false;
          this.otherLogisticsName = '';
        }
      } else {
        this.otherLogistics = false;
        this.otherLogisticsName = '';
      }
    },
    //限制物流公司的名称
    logisticsNameLimit(value) {
      this.$nextTick(() => {
        this.otherLogisticsName = getInputVal.getInputVal(value, 8);
      });
    },
    // 物流单号长度限制
    courierNumberLimit(value) {
      this.$nextTick(() => {
        this.deliveryOrderForm.courierNumber = getInputVal.getInputVal(value, 15);
      });
    },
    // 提交发货
    deliveryOrderDeal() {
      if (!this.deliveryOrderForm.logisticsCompanyId) {
        this.$message.error('请选择物流公司！！');
        return;
      }
      if (!this.deliveryOrderForm.courierNumber) {
        this.$message.error('请填写物流单号！！');
        return;
      }
      var reg = /^[0-9a-zA-Z]+$/;
      if (!reg.test(this.deliveryOrderForm.courierNumber)) {
        this.$message.error('物流单号只能是数字或字母');
        return;
      }
      let companyName = '';
      let companyCode = '';
      for (let i = 0; i < this.logistics.length; i++) {
        if (this.logistics[i].logisticsCompanyId == this.deliveryOrderForm.logisticsCompanyId) {
          companyName = this.logistics[i].logisticsCompanyName;
          companyCode = this.logistics[i].logisticsCompanyCode;
          break;
        }
      }
      if (companyCode === 'QITA') {
        if (this.otherLogisticsName === '') {
          this.$message.error('请填写物流名称');
          return;
        }
      }
      let data = {
        paramsJson: JSON.stringify({
          deliverData: [
            {
              logisticsCompanyId: this.deliveryOrderForm.logisticsCompanyId,
              courierNumber: this.deliveryOrderForm.courierNumber,
              mallOrderId: this.deliveryOrderForm.mallOrderId,
              logisticsCompanyName: companyCode === 'QITA' ? this.otherLogisticsName : companyName,
              logisticsCompanyCode: companyCode
            }
          ]
        }),
        type: 0,
        requestProject: 'mall'
      };
      this.deliveryLoading = true;
      request.post('/api-mall/do-order-deliver', qs.stringify(data)).then(res => {
        // axios.post(this.testHost+'/do-order-deliver',qs.stringify(data)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.result,
            type: 'success'
          });
          this.$emit('listonupdate');
          this.deliveryOrderDialog = false;
          this.deliveryLoading = false;
        } else {
          this.$message.error(res.data.message);
          this.deliveryLoading = false;
        }
      });
    },
    cancelDeliveryOrderDeal() {
      //取消整单发货
      this.deliveryOrderDialog = false;
      this.deliveryOrderForm.logisticsCompanyId = '';
      this.deliveryOrderForm.courierNumber = '';
      this.otherLogisticsName = ''; //其他物流
      this.otherLogistics = false;
    },
    freightOrder(orderId) {
      //显示修改运费
      this.freightOrderForm.orderId = orderId;
      this.freightOrderDialog = true;
    },
    freightOrderDeal() {
      //确定修改运费
      if (Number(this.freightOrderForm.actualFreight) < 0) {
        this.$message.error('快递运费不可为负');
        return false;
      }
      let data = {
        actualFreight: this.freightOrderForm.actualFreight,
        orderId: this.freightOrderForm.orderId,
        requestProject: 'mall'
      };
      this.freightOrderLoading = true;
      request.post('/api-mall/modify-order-freight', qs.stringify(data)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.result,
            type: 'success'
          });
          this.$emit('listonupdate');
          this.freightOrderDialog = false;
          this.freightOrderLoading = false;
        } else {
          this.$message.error(res.data.message);
          this.freightOrderLoading = false;
        }
      });
    },
    //取消修改运费
    cancelFreightOrderDeal() {
      this.freightOrderDialog = false;
      this.freightOrderForm.actualFreight = '';
    },
    goSplitDeliveryOrder() {
      let obj = this.deliveryOrder;
      this.deliveryOrderDialog = false;
      this.splitDeliveryOrder(obj);
    },
    splitDeliveryOrder(obj) {
      // 拆单dialog
      let canDeliveryNum = 0;
      for (let i = 0; i < obj.orderItemList.length; i++) {
        let itemsNum = 0;
        if (obj.orderItemList[i].orderLogistics == null) {
          obj.orderItemList[i].orderLogistics = [
            {
              courierNumber: '', // 物流单号
              logisticsCompanyId: '',
              orderItemNum: '', // 当前拆分数量
              isNew: true,
              logisticsCompanyCode: '',
              otherLogistics: false, //是否选择其他物流
              otherLogisticsName: '' //其他物流名称
            }
          ];
          itemsNum += obj.orderItemList[i].refundCount ? parseInt(obj.orderItemList[i].refundCount) : 0;
        } else {
          for (let j = 0; j < obj.orderItemList[i].orderLogistics.length; j++) {
            itemsNum += obj.orderItemList[i].orderLogistics[j].orderItemNum ? parseInt(obj.orderItemList[i].orderLogistics[j].orderItemNum) : 0;
          }
        }
        if (itemsNum < obj.orderItemList[i].mallProNumber) {
          canDeliveryNum += 1;
        }
      }
      this.canDeliveryNum = canDeliveryNum;
      this.splitOrderInfo = obj;
      this.splitDeliveryOrderDialog = true;
    },
    //拆单的下拉change事件
    changeLogisticsItem(value, item) {
      if (value) {
        let code = this.logistics.find(item => {
          return item.logisticsCompanyId === value;
        }).logisticsCompanyCode;
        if (code === 'QITA') {
          item.otherLogistics = true;
        } else {
          item.otherLogistics = false;
          item.otherLogisticsName = '';
        }
      } else {
        item.otherLogistics = false;
        item.otherLogisticsName = '';
      }
    },
    // 限制拆单物流名称字数
    logisticsItemNameLimit(value, item) {
      this.$nextTick(() => {
        item.otherLogisticsName = getInputVal.getInputVal(value, 8);
      });
    },
    courierNumberItemLimit(value, item) {
      this.$nextTick(() => {
        item.courierNumber = getInputVal.getInputVal(value, 15);
      });
    },
    //拆单发货确定
    /*eslint-disable*/
    splitDeliveryOrderDeal() {
      let deliverDatalist = [];
      let errorStr = '';

      for (let i = 0; i < this.splitOrderInfo.orderItemList.length; i++) {
        for (let j = 0; j < this.splitOrderInfo.orderItemList[i].orderLogistics.length; j++) {
          if (this.splitOrderInfo.orderItemList[i].orderLogistics[j].isNew) {
            if (this.splitOrderInfo.orderItemList[i].orderLogistics[j].orderItemNum !== '' && Number(this.splitOrderInfo.orderItemList[i].orderLogistics[j].orderItemNum) === 0) {
              errorStr = '拆单数量不能为0！！';
              break;
            }
            if (!this.splitOrderInfo.orderItemList[i].orderLogistics[j].logisticsCompanyId && this.splitOrderInfo.orderItemList[i].orderLogistics[j].courierNumber) {
              errorStr = '请选择物流公司！！';
              break;
            }
            if (!this.splitOrderInfo.orderItemList[i].orderLogistics[j].courierNumber && this.splitOrderInfo.orderItemList[i].orderLogistics[j].logisticsCompanyId) {
              errorStr = '请填写物流单号！！';
              break;
            }
            // if((!this.splitOrderInfo.orderItemList[i].orderLogistics[j].orderItemNum&&this.splitOrderInfo.orderItemList[i].orderLogistics[j].logisticsCompanyId)||(!this.splitOrderInfo.orderItemList[i].orderLogistics[j].orderItemNum&&this.splitOrderInfo.orderItemList[i].orderLogistics[j].courierNumber)){
            //   errorStr = '拆单数量不能为空';
            //   break;
            // }
            // 校验物流单号courierNumber
            var reg = /^[0-9a-zA-Z]+$/;
            if ((!reg.test(this.splitOrderInfo.orderItemList[i].orderLogistics[j].courierNumber) && this.splitOrderInfo.orderItemList[i].orderLogistics[j].logisticsCompanyId) || (!reg.test(this.splitOrderInfo.orderItemList[i].orderLogistics[j].courierNumber) && this.splitOrderInfo.orderItemList[i].orderLogistics[j].logisticsCompanyId)) {
              errorStr = '物流单号只能是数字或字母';
              break;
            }

            let objData = {
              mallOrderId: this.splitOrderInfo.orderItemList[i].orderId,
              // orderItemNum:this.splitOrderInfo.orderItemList[i].orderLogistics[j].orderItemNum,
              orderItemNum: this.splitOrderInfo.orderItemList[i].mallProNumber,
              logisticsCompanyId: this.splitOrderInfo.orderItemList[i].orderLogistics[j].logisticsCompanyId,
              logisticsCompanyName: '',
              logisticsCompanyCode: '',
              courierNumber: this.splitOrderInfo.orderItemList[i].orderLogistics[j].courierNumber,
              orderItemId: this.splitOrderInfo.orderItemList[i].orderItemId,
              orderItemSunNum: this.splitOrderInfo.orderItemList[i].mallProNumber, //订单项总量
              otherLogisticsName: this.splitOrderInfo.orderItemList[i].orderLogistics[j].otherLogistics ? this.splitOrderInfo.orderItemList[i].orderLogistics[j].otherLogisticsName : ''
            };
            for (let m = 0; m < this.logistics.length; m++) {
              if (this.logistics[m].logisticsCompanyId == this.splitOrderInfo.orderItemList[i].orderLogistics[j].logisticsCompanyId) {
                objData.logisticsCompanyName = this.logistics[m].logisticsCompanyName;
                objData.logisticsCompanyCode = this.logistics[m].logisticsCompanyCode;
                if (this.logistics[m].logisticsCompanyCode === 'QITA') {
                  objData.logisticsCompanyName = objData.otherLogisticsName;
                }
                break;
              }
            }

            deliverDatalist.push(objData);
          }
        }
      }

      for (let item of deliverDatalist) {
        if (item.logisticsCompanyCode === 'QITA') {
          if (item.logisticsCompanyName === '') {
            this.$message.error('请填写物流公司名称');
            return false;
          }
        }
      }
      //过滤数据
      for (let k = 0; k < deliverDatalist.length; k++) {
        if (!deliverDatalist[k].logisticsCompanyCode && !deliverDatalist[k].logisticsCompanyId) {
          deliverDatalist.splice(k, 1);
          k = -1;
        }
      }
      if (errorStr) {
        this.$message.error(errorStr);
        return;
      }
      if (deliverDatalist.length === 0) {
        this.$message.error('发货信息不能为空');
        return false;
      }

      let data = {
        paramsJson: JSON.stringify({
          deliverData: deliverDatalist
        }),
        type: 0,
        requestProject: 'mall'
      };
      this.splitLoading = true;
      request.post('/api-mall/split-order-deliver', qs.stringify(data)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.result,
            type: 'success'
          });
          this.$emit('listonupdate');
          this.splitDeliveryOrderDialog = false;
          this.splitLoading = false;
        } else {
          this.$message.error(res.data.message);
          this.splitLoading = false;
        }
      });
    },
    cancelSplitDeliveryOrderDeal() {
      //取消拆单发货
      this.splitDeliveryOrderDialog = false;
    },
    splitOrder(index) {
      // 拆单事件
      let totalOrder = 0;
      if (this.splitOrderInfo.orderItemList[index].orderLogistics.length + this.splitOrderInfo.orderItemList[index].refundCount >= this.splitOrderInfo.orderItemList[index].mallProNumber) {
        this.$message.error('拆单数量不得大于当前单量！');
        return;
      }
      this.splitOrderInfo.orderItemList[index].orderLogistics.push({
        ordernum: '',
        wuliuName: '',
        wuliuNum: '',
        isNew: true
      });
    },
    deleteOrder(index, indexs) {
      // 删除拆单项
      this.splitOrderInfo.orderItemList[index].orderLogistics.splice(indexs, 1);
    },
    limitOrderNumDeal(index, indexs) {
      // 拆单输入限制
      let orderNumAll = 0;
      for (let i = 0; i < this.splitOrderInfo.orderItemList[index].orderLogistics.length; i++) {
        let num = this.splitOrderInfo.orderItemList[index].orderLogistics[i].orderItemNum ? parseInt(this.splitOrderInfo.orderItemList[index].orderLogistics[i].orderItemNum) : 0;
        orderNumAll += num;
      }
      if (orderNumAll < 0) {
        this.$message.error('输入正确的拆单数量！');
        this.splitOrderInfo.orderItemList[index].orderLogistics[indexs].orderItemNum = '';
        return false;
      }
      if (orderNumAll + this.splitOrderInfo.orderItemList[index].refundCount > this.splitOrderInfo.orderItemList[index].mallProNumber) {
        this.$message.error('输入数量之和不得大于当前单量！');
        this.splitOrderInfo.orderItemList[index].orderLogistics[indexs].orderItemNum = '';
        return;
      }
    },
    goToDetail(orderId) {
      window.localStorage.setItem('orderObj', JSON.stringify(this.orderObj));
      this.$router.push({
        name: 'orderDetails',
        params: { orderId: orderId }
      });
    }
  },
  watch: {
    orderList: function(value) {
      this.list = value;
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
  text-align: center;
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
  margin-right: 45px;
}
.order-item-title span {
  display: inline-block;
  vertical-align: middle;
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
  /*height:90px;*/
  padding-left: 14px;
  border-bottom: 1px solid rgba(241, 243, 247, 1);
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
.goods-text-name .zeng-pin {
  background: #f5222d;
  color: #fff;
  font-size: 10px;
  line-height:1;
  padding: 2px 4px;
  text-align: center;
  border-radius: 3px;
  display: inline-block;
  margin-right:5px;
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
  align-items: center;
  justify-content: center;
}
.grid-content-other > div:nth-child(n + 2) {
  margin-top: 10px;
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
table tr td:nth-child(2) {
  width: 8.3333%;
}
table tr td:nth-child(3) {
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
/*dialog*/
.dialog-content {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}
.close-reason {
  display: inline-block;
  vertical-align: top;
  width: 70px;
  text-align: right;
  font-size: 13px;
  color: #606266;
  margin-right: 5px;
}
.close-reason-info {
  display: inline-block;
  width: 340px;
  color: #909399;
}
.width-style {
  width: 100%;
}
/*整单发货*/
.all-delivery {
  position: relative;
}
.go-split-delivery {
  position: absolute;
  top: 0px;
  right: 40px;
}
/*拆单发货dialog*/
.split-title {
  margin-bottom: 5px;
}
.split-table tr:nth-child(n + 2) {
  border-top: 1px solid #ebeef5;
}
.split-table tr td:nth-child(1) {
  width: 33.3%;
}
.split-table tr td:nth-child(2) {
  width: 12.5%;
}
.split-table tr td:nth-child(3) {
  width: 16.7%;
}
.split-table tr td:nth-child(4) {
  width: 20.8%;
}
.split-table tr td:nth-child(5) {
  width: 16.7%;
}
/*.split-table tr td:nth-child(6){
    width:16.7%;
  }*/
.input-wrap {
  line-height: 64px;
}
.goods-info .input-wrap {
  margin-right: 14px;
}
.split-content-other {
  padding: 14px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.split-logistics-other {
  padding: 14px 0px;
}
.split-order-num {
  width: 80px;
  margin-right: 6px;
}
.split-order-num input {
  text-align: center;
  display: block;
  width: 100%;
  height: 30px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.split-order-num input:focus {
  border-color: #409eff;
  outline: 0;
}
input::-webkit-input-placeholder {
  color: #dcdfe6;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #dcdfe6;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #dcdfe6;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #dcdfe6;
}
.split-order-wuliunum {
  width: 150px;
  margin-right: 6px;
}
.no-data-wrap {
  text-align: center;
}
.no-data-wrap p {
  font-size: 14px;
  color: #909399;
}
.other-name-warm {
  font-size: 12px;
  color: rgb(144, 147, 153);
  margin-top: 5px;
  display: inline-block;
}
.order-list-title /deep/ .grid-content {
  text-align: left;
}
.order-list-title /deep/ .grid-center {
  text-align: center;
}
</style>
