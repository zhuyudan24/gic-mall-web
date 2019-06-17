<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div v-if="updateDom" class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/refundManage' }">退款管理</el-breadcrumb-item>
          <el-breadcrumb-item>退款详情</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>退款详情</span>
        </h3>
      </div>
      <div class="mall-section">
        <!-- 老数据处理退款的进度 -->
        <div class="progress-wrap" v-if="orderDetails.refundDTO.refundStatus != 3 && orderDetails.order.orderVersion === null">
          <div class="progress-info progress-infoed">
            <div>买家申请退款</div>
            <div class="progress-info-time">{{ orderDetails.refundDTO.createTime | changeTimes }}</div>
          </div>

          <div v-bind:class="{ 'progress-ing': orderDetails.refundDTO.refundStatus == 1, 'progress-ed': orderDetails.refundDTO.refundStatus == 2 }">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="progress-info" v-bind:class="{ 'progress-infoed': orderDetails.refundDTO.refundStatus == 2 }">
            <div>商家处理退款申请</div>
            <div class="progress-info-time progress-info-time-left" v-if="orderDetails.refundDTO.refundStatus == 2 || orderDetails.refundDTO.refundStatus == 3">{{ orderDetails.refundDTO.updateTime | changeTimes }}</div>
          </div>

          <div v-bind:class="{ 'progress-no': orderDetails.refundDTO.refundStatus == 1, 'progress-ed': orderDetails.refundDTO.refundStatus == 2 }">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="progress-info" v-bind:class="{ 'progress-infoed': orderDetails.refundDTO.refundStatus == 2 }">
            <div>退款成功</div>
            <div class="progress-info-time progress-info-time-left-b" v-if="orderDetails.refundDTO.refundStatus == 2">{{ orderDetails.refundDTO.updateTime | changeTimes }}</div>
          </div>
        </div>
        <!-- 新数据 -->
        <div class="progress-wrap" v-if="orderDetails.refundDTO.refundStatus != 3 && orderDetails.order.orderVersion !== null">
          <div class="progress-info progress-infoed">
            <div>买家申请退款</div>
            <div class="progress-info-time">{{ getTimeAll(orderDetails.refundDTO.createTime) }}</div>
          </div>
          <div v-bind:class="{ 'progress-ing': orderDetails.refundDTO.refundStatus == 1, 'progress-ed': orderDetails.refundDTO.refundStatus == 2 || orderDetails.refundDTO.refundStatus == 6 || orderDetails.refundDTO.refundStatus == 5 || orderDetails.refundDTO.refundStatus == 4 }">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="progress-info" v-bind:class="{ 'progress-infoed': orderDetails.refundDTO.refundStatus == 2 || orderDetails.refundDTO.refundStatus == 6 || orderDetails.refundDTO.refundStatus == 5 }">
            <div>商家处理退款申请</div>
            <div class="progress-info-time progress-info-time-left" v-if="orderDetails.refundDTO.refundStatus == 2 || orderDetails.refundDTO.refundStatus == 3 || orderDetails.refundDTO.refundStatus == 6 || orderDetails.refundDTO.refundStatus == 5">{{ getTimeAll(orderDetails.refundDTO.refundProcessTime) }}</div>
          </div>
          <div v-bind:class="{ 'progress-no': orderDetails.refundDTO.refundStatus == 1, 'progress-ed': orderDetails.refundDTO.refundStatus == 2 || orderDetails.refundDTO.refundStatus == 3 || orderDetails.refundDTO.refundStatus == 6 || orderDetails.refundDTO.refundStatus == 5 || orderDetails.refundDTO.refundStatus == 4 }">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <!-- <div > -->
          <div v-if="orderDetails.refundDTO.refundType === 2" class="progress-info" v-bind:class="{ 'progress-infoed': orderDetails.refundDTO.refundStatus == 2 || orderDetails.refundDTO.refundStatus == 5 }">
            <div>买家退货给商家</div>
            <div class="progress-info-time progress-info-time-left" v-if="orderDetails.refundDTO.refundStatus == 2 || orderDetails.refundDTO.refundStatus == 5">{{ getTimeAll(orderDetails.refundDTO.refundGoodsTime) }}</div>
          </div>
          <div v-if="orderDetails.refundDTO.refundType === 2" v-bind:class="{ 'progress-no': orderDetails.refundDTO.refundStatus == 1 || orderDetails.refundDTO.refundType === 2, 'progress-ed': orderDetails.refundDTO.refundStatus == 2, 'progress-ing': orderDetails.refundDTO.refundStatus == 5 }">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <!-- </div> -->

          <div class="progress-info" v-bind:class="{ 'progress-infoed': orderDetails.refundDTO.refundStatus == 2 }">
            <div>退款完成</div>
            <div class="progress-info-time progress-info-time-left" v-if="orderDetails.refundDTO.refundStatus == 2">{{ getTimeAll(orderDetails.refundDTO.updateTime) }}</div>
          </div>
        </div>
        <el-row>
          <el-col :span="6">
            <div class="left-wrap">
              <div class="left-header">
                退款信息
              </div>
              <div class="goods-info">
                <div>
                  <a href="javascript:;">
                    <img class="imgs-style" :src="orderDetails.orderItem.mallProImageUrl" alt="" />
                  </a>
                </div>
                <div class="goods-text">
                  <div>{{ orderDetails.orderItem.mallProName }}</div>
                  <div class="goods-text-info">
                    <div>
                      <span v-for="(item2, ind2) in JSON.parse(orderDetails.orderItem.mallProSkuAttr)" :key="ind2">{{ item2.propName }}：{{ item2.valueName }} &nbsp;&nbsp;</span>
                    </div>
                    <div>SKU编码：{{ orderDetails.orderItem.mallProSkuCode }}</div>
                  </div>
                </div>
              </div>
              <div class="left-list-info">
                <div>
                  <span>退款编号</span>
                  <span>{{ orderDetails.refundDTO.orderRefundNumber }}</span>
                </div>
                <div>
                  <span>退款方式</span>
                  <span>{{ orderDetails.refundDTO.refundType | refundTypeName }}</span>
                </div>
                <div>
                  <span>申请金额</span>
                  <span>{{ orderDetails.refundDTO.applyRefundPrice }}</span>
                </div>
                <div>
                  <span>申请件数</span>
                  <span>{{ orderDetails.orderItem.mallProNumber }}</span>
                </div>
                <div class="refund-reason">
                  <span>退款原因</span>
                  <span>{{ orderDetails.refundDTO.refundReason }}</span>
                </div>
                <div>
                  <span>订单编号</span>
                  <span class="a-link" @click="goOrderDetail(orderDetails.order.orderId)">{{ orderDetails.order.orderNumber }}</span>
                </div>
                <div>
                  <span>付款时间</span>
                  <span>{{ orderDetails.order.payTime | changeTimes }}</span>
                </div>
                <div>
                  <span>会员昵称</span>
                  <span>{{ orderDetails.nickName }}</span>
                </div>
                <div>
                  <span>会员卡号</span>
                  <span
                    ><a :href="pageUrl" target="_blank">{{ orderDetails.order.memberCardNum }}</a></span
                  >
                </div>
                <!-- <div>
                  <span>物流信息</span>
                  <span>{{orderDetails.order.logisticsName}} {{orderDetails.order.logisticsNumber}}</span>
                </div> -->
                <div>
                  <span>合计优惠</span>
                  <span>-￥{{ orderDetails.order.discountSum }}</span>
                </div>
                <div>
                  <span>运费</span>
                  <span>￥{{ orderDetails.order.mallOrderFreight }}</span>
                </div>
                <div>
                  <span>实收金额</span>
                  <span>￥{{ orderDetails.order.payAmountAll }}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="right-wrap">
              <!-- 老数据处理的逻辑 -->
              <div v-if="orderDetails.order.orderVersion === '' || orderDetails.order.orderVersion === null">
                <!-- 等待商家处理退款申请 -->
                <div class="right-header" v-if="orderDetails.refundDTO.refundStatus == 1">
                  <p class="right-header-title">等待商家处理退款申请</p>
                  <p class="right-header-instructions">买家发起退款申请，等待商家处理</p>
                  <div class="right-header-btns">
                    <el-button type="primary" size="small" style="width:98px;" @click="agreedRefundDialog = true">同意</el-button>
                    <el-button style="color:#409EFF;border-color:#409EFF;width:98px;" size="small" @click="closeRefundDialog = true">拒绝</el-button>
                  </div>
                  <!--同意dialog-->
                  <el-dialog title="同意退款" :visible.sync="agreedRefundDialog" width="464px">
                    <div class="dialog-content">
                      <div class="close-reason">申请金额：</div>
                      <div class="close-reason-info">￥{{ orderDetails.refundDTO.applyRefundPrice }}（实付金额￥{{ orderDetails.orderItem.payAmount }}，积分{{ orderDetails.orderItem.usePoints }}分）</div>
                    </div>
                    <div class="dialog-content">
                      <div class="close-reason">邮费：</div>
                      <div class="close-reason-info">￥{{ orderDetails.orderItem.orderItemFreight }}</div>
                    </div>
                    <div class="dialog-content">
                      <div class="close-reason">数量：</div>
                      <div class="close-reason-info">
                        <el-select v-model="agreedRefundForm.orderItemNum" clearable placeholder="请选择" class="width-style">
                          <el-option v-for="item in orderDetails.orderItem.mallProNumber + 1" :key="item - 1" :label="item - 1" :value="item - 1"> </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="dialog-content">
                      <div class="close-reason">退款总额：</div>
                      <div class="close-reason-info">
                        <el-input type="number" v-model.number="agreedRefundForm.refundTotal" :placeholder="refundTotalMax" @input="refundTotalMaxDeal"></el-input>
                      </div>
                    </div>
                    <div class="dialog-content">
                      <div class="close-reason">退款金额：</div>
                      <div class="close-reason-info">
                        <el-input type="text" v-model="agreedRefundForm.refundPrice" :placeholder="refundPriceMax" :disabled="true"></el-input>
                        <span style="margin-top:8px;color:#909399;display: inline-block" v-show="agreedRefundForm.showMoney"> 剩余￥{{ agreedRefundForm.moreMoney }}折和{{ agreedRefundForm.morePoint }}积分进行返还 </span>
                      </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                      <el-button @click="agreedRefundDialog = false">取 消</el-button>
                      <el-button :disabled="confirmStatus" type="primary" @click="agreedRefundDeal">确 定</el-button>
                    </div>
                  </el-dialog>
                </div>
                <!-- 退款成功 -->
                <div class="right-header" v-else-if="orderDetails.refundDTO.refundStatus == 2">
                  <p class="right-header-title">退款成功</p>
                  <p class="right-header-instructions">商家退款成功，退回金额：￥{{ orderDetails.refundDTO.refundPrice }}； 退回积分：{{ orderDetails.refundDTO.refundPoints }}分；退款数量：{{ orderDetails.refundDTO.refundNumber }}</p>
                </div>
                <!-- 退款关闭 -->
                <div class="right-header" v-else-if="orderDetails.refundDTO.refundStatus == 3">
                  <p class="right-header-title error-color">退款关闭</p>
                  <!-- <p class="right-header-instructions">买家撤消退款申请</p> -->
                </div>
              </div>
              <!-- 新数据处理的逻辑 -->
              <div v-if="orderDetails.order.orderVersion !== '' && orderDetails.order.orderVersion !== null">
                <!-- 仅退款 -->
                <div v-if="orderDetails.refundDTO.refundType === 1">
                  <!-- 退款待处理 -->
                  <div class="right-header" v-if="orderDetails.refundDTO.refundStatus === 1">
                    <p class="right-header-title">等待商家处理退款申请</p>
                    <p class="right-header-instructions">买家发起退款申请，等待商家处理</p>
                    <div class="right-header-btns">
                      <el-button type="primary" size="small" style="width:98px;" @click="agreedRefundNew">同意</el-button>
                      <el-button style="color:#409EFF;border-color:#409EFF;width:98px;" size="small" @click="closeRefundDialog = true">拒绝</el-button>
                    </div>
                  </div>
                  <!-- 商家拒绝退款 -->
                  <div class="right-header" v-else-if="orderDetails.refundDTO.refundStatus === 6">
                    <p class="right-header-instructions">商家拒绝退款，等待买家修改退款申请</p>
                  </div>
                  <!-- 退款成功 -->
                  <div class="right-header" v-else-if="orderDetails.refundDTO.refundStatus === 2">
                    <p class="right-header-instructions">商家退款成功，退回金额：￥{{ orderDetails.refundDTO.refundPrice }}； 退回积分：{{ orderDetails.refundDTO.refundPoints }}分；退款数量：{{ orderDetails.refundDTO.refundNumber }}</p>
                  </div>
                  <!-- 退款关闭  -->
                  <div class="right-header" v-else-if="orderDetails.refundDTO.refundStatus === 3">
                    <p class="right-header-instructions">买家撤销退款申请，退款关闭</p>
                  </div>
                </div>
                <!-- 退货退款 -->
                <div v-if="orderDetails.refundDTO.refundType === 2">
                  <!-- 退款待处理 -->
                  <div class="right-header" v-if="orderDetails.refundDTO.refundStatus === 1">
                    <p class="right-header-title">等待商家处理退款申请</p>
                    <p class="right-header-instructions">买家发起退货退款申请，等待商家处理</p>
                    <div class="right-header-btns">
                      <el-button type="primary" size="small" @click="sendRefundAddress">同意退货，发送退货地址</el-button>
                      <el-button style="color:#409EFF;border-color:#409EFF;" size="small" @click="closeRefundDialog = true">拒绝退货</el-button>
                    </div>
                  </div>
                  <!-- 退款成功 -->
                  <div class="right-header" v-else-if="orderDetails.refundDTO.refundStatus === 2">
                    <p class="right-header-title">退款成功</p>
                    <p class="right-header-instructions">商家收到退货，同意退款</p>
                  </div>
                  <!-- 退款关闭 -->
                  <div class="right-header" v-else-if="orderDetails.refundDTO.refundStatus === 3">
                    <p class="right-header-title">退款关闭</p>
                    <p class="right-header-instructions">买家在7天内未退货，退款申请关闭</p>
                  </div>
                  <!-- 待买家退货 -->
                  <div class="right-header" v-else-if="orderDetails.refundDTO.refundStatus === 4">
                    <p class="right-header-title">商家已同意退款，等待买家将货退回</p>
                    <p class="right-header-instructions">你已同意退货，请等待买家将货寄回</p>
                  </div>
                  <!-- 待商家收货  -->
                  <div class="right-header" v-else-if="orderDetails.refundDTO.refundStatus === 5">
                    <p class="right-header-title">买家已退货，等待商家确认收货</p>
                    <div></div>
                    <p class="right-header-instructions" v-if="orderDetails.refundDTO.mallOrderRefundLogisticsDTO">买家已退货，物流公司：{{ orderDetails.refundDTO.mallOrderRefundLogisticsDTO.logisticsCompanyName }}；物流单号：{{ orderDetails.refundDTO.mallOrderRefundLogisticsDTO.courierNumber }}</p>
                    <div class="right-header-btns">
                      <!-- agreedNewRefundDialog = true -->
                      <el-button type="primary" size="small" @click="takeGoodsRefund">确认收货并退款</el-button>
                      <el-button style="color:#409EFF;border-color:#409EFF;width:98px;" size="small" @click="closeRefundDialog = true">拒绝收货</el-button>
                    </div>
                  </div>
                  <!-- 拒绝退款  -->
                  <div class="right-header" v-else-if="orderDetails.refundDTO.refundStatus === 6">
                    <p class="right-header-title">商家不同意退款申请</p>
                    <p class="right-header-instructions">你已拒绝本次退款申请，买家修改退货申请后，需要你重新处理</p>
                  </div>
                </div>
              </div>
              <div class="right-body">
                <div class="right-title">
                  协商记录
                </div>
                <div v-for="(item, conIndex) in consultationRecords" :key="conIndex">
                  <div class="right-body-wrap" v-if="item.role === 1">
                    <div class="buyers-sell-title">
                      <span style="font-weight:600">买家</span>
                      <span>{{ item.createTime | changeTimes }}</span>
                    </div>
                    <div>
                      <p>{{ item.msg === '' ? '买家发起退款申请，等待商家处理' : item.msg }}</p>
                    </div>
                    <div>
                      <div style="display:inline-block;margin-right:40px">
                        <span class="prompt-info">退款原因</span>
                        <span style="margin-right:20px">{{ item.refundReason }}</span>
                      </div>
                      <div style="display:inline-block;margin-right:40px">
                        <span class="prompt-info prompt-info-a">退款方式</span>
                        <span style="margin-right:20px">{{ item.refundType | refundTypeName }}</span>
                      </div>
                      <div style="display:inline-block;margin-right:40px">
                        <span class="prompt-info prompt-info-a" v-if="item.refundDeliverType !== 0">发货状态</span>
                        <span v-if="item.refundDeliverType === 1">未发货</span>
                        <span v-if="item.refundDeliverType === 2">已发货</span>
                      </div>
                      <div style="display:inline-block;">
                        <span class="prompt-info">退款金额</span>
                        <span style="margin-right:20px">￥{{ item.refundPrice }}</span>
                      </div>
                    </div>
                    <div></div>
                    <div class="refund-info">
                      <div class="prompt-info">退款说明</div>
                      <p style="width:700px">{{ item.description }}</p>
                    </div>
                    <div style="margin-left:65px">
                      <div v-for="(itm, index) in item.imgUrl ? item.imgUrl.split(',') : []" :key="index" class="img-box">
                        <img :src="itm" alt="" style="width:40px;height:40px;" />
                        <i class="el-icon-zoom-in" @click="enlargeDialogImageUrl(itm, index)"></i>
                        <div class="dialog-img"></div>
                      </div>
                      <el-dialog :visible.sync="dialogVisibleImg">
                        <img width="100%" :src="dialogEnlargeImageUrl" alt="" />
                      </el-dialog>
                    </div>
                  </div>
                  <div class="right-body-wrap" v-else>
                    <div class="buyers-sell-title">
                      <span style="font-weight:600">商家</span>
                      <span>{{ item.createTime | changeTimes }}</span>
                    </div>
                    <div>
                      <p>{{ item.msg }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!--关闭dialog-->
    <el-dialog :title="refundDialogTitle" :visible.sync="closeRefundDialog" width="464px" @close="cancelRefund">
      <div class="close-reason">拒绝原因</div>
      <div class="close-reason-info">
        <el-input type="textarea" :rows="3" v-model="closeRefundForm.refundFailReason" @input="value => refundFailReasonLimit(value)"></el-input>
        <span class="remark-num">{{ refundFailReasonLen }}/200</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRefund">取 消</el-button>
        <el-button type="primary" @click="closeRefundDeal" :loading="disagreeRefundStatus">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 退货地址弹框 -->
    <el-dialog title="发送退货地址" :visible.sync="sendAddressDialog" width="500px">
      <div class="dialog-content-box">
        <div class="dialog-content">
          <div class="close-reason">退款方式：</div>
          <div class="close-reason-info">退货退款</div>
        </div>
        <div class="dialog-content-new">
          <div class="close-reason">退款金额：</div>
          <div class="close-reason-info">￥{{ refundAddressList.applyRefundPrice }}</div>
        </div>
        <div class="dialog-content-new">
          <div class="close-reason">退货地址：</div>
          <div class="close-reason-info reason-radio-align" v-if="refundAddressList.addressList.length > 0">
            <el-radio v-model="defaultAddress" :label="index" v-for="(item, index) in refundAddressList.addressList" class="radio-block" @change="radioChange(item, index)" :key="index">
              {{ item.provinceName }}{{ item.cityName }}{{ item.areaName }}{{ item.addressDetail }}
              <span v-show="item.ifDefault" class="default-remark">默认</span>
            </el-radio>
          </div>
          <!-- <div v-else><span class="a-link" @click="goAddressList">添加退货地址</span></div> -->
          <div v-else>
            <span><a :href="pageUrlAddress" target="_blank">添加退货地址</a></span>
          </div>
        </div>
        <div class="dialog-content-new">
          <div class="close-reason">备注：</div>
          <div class="close-reason-info">
            <el-input type="textarea" :rows="3" v-model="refundSellerDesc" @input="value => remarkLimit(value)"> </el-input>
            <span class="remark-num">{{ refundSellerDescLen }}/150</span>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="sendAddressDialog = false">取 消</el-button>
        <el-button type="primary" @click="sendMessageConfirm" :loading="sendLoading">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新版同意退款的dialog -->
    <el-dialog title="同意退款" :visible.sync="agreedNewRefundDialog" width="464px">
      <div class="dialog-content">
        <div class="close-reason">申请金额：</div>
        <div class="close-reason-info">￥{{ orderDetails.refundDTO.applyRefundPrice }}（实付金额￥{{ orderDetails.orderItem.payAmount }}，积分{{ orderDetails.orderItem.usePoints }}分）</div>
      </div>
      <div class="dialog-content">
        <div class="close-reason">邮费：</div>
        <div class="close-reason-info">￥{{ orderDetails.orderItem.orderItemFreight }}</div>
      </div>
      <div class="dialog-content">
        <div class="close-reason">数量：</div>
        <div class="close-reason-info">
          <!-- :disabled="orderDetails.refundDTO.refundDeliverType===1||orderDetails.orderItem.orderItemStatus===2" -->
          <!-- :disabled="orderDetails.refundDTO.refundType===1&&orderDetails.orderItem.refund_deliver_type===2||orderDetails.refundDTO.refundType===1&&orderDetails.orderItem.orderItemStatus===2" -->
          <el-select v-model="agreedRefundForm.orderItemNum" clearable placeholder="请选择" class="width-style" :disabled="editNum">
            <el-option :key="0" :label="0" :value="0"> </el-option>
            <el-option v-for="item in orderDetails.orderItem.mallProNumber" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
        </div>
      </div>
      <div class="dialog-content" v-show="orderDetails.orderItem.usePoints > 0">
        <div class="close-reason">退回积分：</div>
        <div class="close-reason-info">
          <el-input type="text" v-model.number="agreedRefundForm.realRefundPoint" :placeholder="maxRefundPointText" @input="refundPointMaxDeal"></el-input>

          <span style="margin-top:8px;color:#909399;display: inline-block" v-show="agreedRefundForm.realRefundPoint"> {{ pointRuleComputed }}积分抵{{ moneyRuleComputed }}元 </span>
        </div>
      </div>
      <div class="dialog-content">
        <div class="close-reason">退款金额：</div>
        <div class="close-reason-info">
          <el-input type="text" v-model="agreedRefundForm.refundPriceNew" :placeholder="refundPriceMax" :disabled="true"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="agreedNewRefundDialog = false">取 消</el-button>
        <el-button type="primary" @click="agreedRefundDealNew" :loading="refundLoading">确 定</el-button>
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
      getTimeAll: getInputVal.formatDate,
      updateDom: false,
      order: {},
      orderRefundId: '',
      orderDetails: {
        refundDTO: {},
        orderItem: {},
        order: {}
      },
      agreedRefundDialog: false, //老版本退款同意

      agreedNewRefundDialog: false, //新版本退款同意
      refundTotalMax: 99999,
      refundTotalMaxLength: 9,
      refundPriceMax: 99999,
      agreedRefundForm: {
        refundPrice: '', //老的的退款金额
        refundPriceNew: '', //新的退款金额
        refundPoints: '',
        refundFailReason: '',
        refundTotal: '', //退款金额
        orderItemNum: 0,
        moreMoney: 0, //剩余钱
        morePoint: 0, //积分
        showMoney: false,

        realRefundPoint: '' //可退积分
      },
      maxRefundPointText: '', //新版数据
      closeRefundDialog: false, //关闭退款弹

      pointRule: 0, //积分规则
      moneyRule: 1, //

      pointRuleComputed: 0,
      moneyRuleComputed: 0,

      pageUrl: '', //微信会员详情地址
      pageUrlAddress: '', //新建地址
      closeRefundForm: {
        refundFailReason: ''
      },
      refundFailReasonLen: 0, //退款原因字数长度
      consultationRecords: [], // 协商记录

      confirmStatus: false, //退款确认按钮状态

      sendAddressDialog: false, //退货地址弹框

      refundAddressList: {
        addressList: []
      }, //退货地址信息
      refundSellerDesc: '', //备注
      refundSellerAddressId: '', //卖家默认地址id
      refundSellerAddress: '', //卖家默认地址
      refundSellerDescLen: 0, //备注字数限制
      defaultAddress: 0,

      refundDialogTitle: '拒绝退款',
      editNum: false, //数量可编辑
      dialogVisibleImg: false,
      dialogEnlargeImageUrl: '', //放大图片地址
      sendLoading: false,
      refundLoading: false, //同意
      disagreeRefundStatus: false //拒绝
    };
  },
  mounted() {
    // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
    window.onbeforeunload = function(e) {
      // var storage = window.localStorage;
      // storage.clear();
      localStorage.removeItem('refundObj');
    };
    this.consultationRecord();
  },
  created() {
    this.orderRefundId = this.$route.params.orderRefundId;
    this.getOrderDetails(this.orderRefundId);
  },

  computed: {},
  watch: {
    orderDetails: function(value) {
      // 监听orderDetails从接口拿到值后显示页面，不然会报错mallProImageUrl 找不到
      if (value !== {}) {
        this.updateDom = true;
      }
    }
  },
  methods: {
    getOrderDetails(orderId) {
      let data = {
        orderRefundId: orderId,
        requestProject: 'mall'
      };
      request.get('/api-mall/get-mall-order-refund-detail', { params: data }).then(res => {
        if (res.data.errorCode === 0) {
          this.orderDetails = res.data.result;
          // this.agreedRefundForm.refundPrice = this.orderDetails.orderItem.payAmount + this.orderDetails.refundDTO.orderItemFreight;//注释掉老数据的退款金额
          this.agreedRefundForm.refundPrice = this.orderDetails.refundDTO.refundPriceNew;
          /*************注释掉的新数据的退款总额 start*************/
          // if(this.orderDetails.refundDTO.refundDeliverType===2||(this.orderDetails.refundDTO.refundDeliverType===0&&this.orderDetails.orderItem.orderItemStatus===3)){//orderItemStatus===3整单未发refundDeliverType===0代表整单
          //   //已发货 小程序的退款金额<(订单实付+运费)/购买数量*发货），====小程序的退款金额
          //   //已发货 小程序的退款金额>(订单实付+运费)/购买数量*发货）====订单实付+运费)/购买数量*发货）
          //   if(this.orderDetails.refundDTO.applyRefundPrice<(this.orderDetails.orderItem.payAmount + this.orderDetails.refundDTO.orderItemFreight)/this.orderDetails.orderItem.mallProNumber*this.orderDetails.orderItem.deliveredCount){
          //     this.agreedRefundForm.refundPriceNew=this.orderDetails.refundDTO.applyRefundPrice
          //   }else{//未发货的取（低昂单项支付金额+运费）/购买数量*未发
          //     this.agreedRefundForm.refundPriceNew=((this.orderDetails.orderItem.payAmount + this.orderDetails.refundDTO.orderItemFreight)/this.orderDetails.orderItem.mallProNumber*this.orderDetails.orderItem.deliveredCount).toFixed(2)
          //   }
          // }else{//未发货
          //   this.agreedRefundForm.refundPriceNew=((this.orderDetails.orderItem.payAmount + this.orderDetails.refundDTO.orderItemFreight)/this.orderDetails.orderItem.mallProNumber*this.orderDetails.orderItem.noDelivereCount).toFixed(2)

          // }
          /*************注释掉的新数据的退款总额 end*************/

          this.agreedRefundForm.refundPriceNew = this.orderDetails.refundDTO.refundPriceNew; //新数据改后的
          this.refundTotalMax = '最多可退￥' + this.orderDetails.refundDTO.maxRefundPrice;
          this.refundTotalMaxLength = ('' + this.orderDetails.refundDTO.maxRefundPrice).length;
          // this.refundPriceMax = '最多可退￥' + (this.orderDetails.refundDTO.payAmount + this.orderDetails.refundDTO.orderItemFreight);
          this.refundPriceMax = '最多可退￥' + this.orderDetails.refundDTO.refundPriceNew;

          this.maxRefundPointText = '最大可退积分' + this.orderDetails.orderItem.usePoints;

          // 计算积分规则  （最大可退金额-实付金额-邮费）/积分(最大可退金额的字段取值10.12确定取得是orderItem)
          this.pointRule = ((this.orderDetails.orderItem.maxRefundPrice - this.orderDetails.orderItem.payAmount - this.orderDetails.orderItem.orderItemFreight) / this.orderDetails.orderItem.usePoints).toFixed(2);
          this.pointRuleComputed = this.pointRule;
          this.moneyRuleComputed = this.moneyRule;

          this.pageUrl = window.location.origin + '/member/#/wechatmemberDetail?memberId=' + this.orderDetails.refundDTO.memberId;
          this.pageUrlAddress = window.location.origin + '/mall/#/addressEdit/-1';
          if (this.orderDetails.refundDTO.refundStatus === 1 && this.orderDetails.refundDTO.refundType === 2) {
            //退货退款下的退款待处理
            this.refundDialogTitle = '拒绝退货';
          } else if (this.orderDetails.refundDTO.refundStatus === 5 && this.orderDetails.refundDTO.refundType === 2) {
            //退货退款下待商家收货
            this.refundDialogTitle = '拒绝收货';
          } else {
            this.refundDialogTitle = '拒绝退款';
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //物流信息

    // 限制最大退款金额
    refundTotalMaxDeal(value) {
      // var reg = /[1-9]\d*.\d*|0.\d*[1-9]\d*/;
      // if(!reg.test(Number(this.agreedRefundForm.refundTotal))&&){
      //   this.$message.error("请输入数字")
      //   return false
      // }else{

      if (this.agreedRefundForm.refundTotal >= this.orderDetails.refundDTO.maxRefundPrice) {
        this.$nextTick(() => {
          //refundTotal退款总额，  usePoints最大可退积分
          /***************调整前逻辑 start****************/
          // this.agreedRefundForm.refundTotal = this.orderDetails.refundDTO.maxRefundPrice;
          // if(this.agreedRefundForm.refundTotal>=(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)){
          //   this.agreedRefundForm.showMoney=true
          //   this.agreedRefundForm.refundPrice=(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)
          //   this.agreedRefundForm.moreMoney=(this.agreedRefundForm.refundTotal-(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)).toFixed(2)

          //   if(this.agreedRefundForm.moreMoney==0){

          //     this.agreedRefundForm.showMoney=false
          //     this.agreedRefundForm.morePoint=0
          //   }else{
          //     // 积分=最大积分*[(退款总额-实际付款金额)/(最大可退金额-实际付款金额])
          //       //退款总额-实际付款金额
          //      let money1=this.agreedRefundForm.refundTotal-(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)
          //      //最大可退金额-实际付款金额
          //       let money2=this.orderDetails.refundDTO.maxRefundPrice-(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)
          //       this.agreedRefundForm.morePoint=parseInt(this.orderDetails.orderItem.usePoints*(money1/money2))
          //   }
          //  })

          // }else{//小于的情况下
          //   if(this.agreedRefundForm.refundTotal>=(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)){
          //       this.agreedRefundForm.showMoney=true
          //       this.agreedRefundForm.refundPrice=(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)
          //       this.agreedRefundForm.moreMoney=(this.agreedRefundForm.refundTotal-(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)).toFixed(2)

          //    // 积分=最大积分*[(退款总额-实际付款金额)/(最大可退金额-实际付款金额])
          //       //退款总额-实际付款金额
          //        let money1=this.agreedRefundForm.refundTotal-(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)
          //        //最大可退金额-实际付款金额
          //         let money2=this.orderDetails.refundDTO.maxRefundPrice-(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)
          //         this.agreedRefundForm.morePoint=parseInt(this.orderDetails.orderItem.usePoints*(money1/money2))

          //     }else{
          //       this.agreedRefundForm.showMoney=false
          //       this.agreedRefundForm.refundPrice=this.agreedRefundForm.refundTotal

          //     }
          // }
          /***************调整前逻辑 start****************/
          this.agreedRefundForm.refundTotal = this.orderDetails.refundDTO.maxRefundPrice;
          if (this.agreedRefundForm.refundTotal >= this.orderDetails.refundDTO.refundPriceNew) {
            this.agreedRefundForm.showMoney = true;
            this.agreedRefundForm.refundPrice = this.orderDetails.refundDTO.refundPriceNew;
            this.agreedRefundForm.moreMoney = (this.agreedRefundForm.refundTotal - this.orderDetails.refundDTO.refundPriceNew).toFixed(2);
            if (this.agreedRefundForm.moreMoney == 0) {
              this.agreedRefundForm.showMoney = false;
              this.agreedRefundForm.morePoint = 0;
            } else {
              // 积分=最大积分*[(退款总额-实际付款金额)/(最大可退金额-实际付款金额])
              //退款总额-实际付款金额
              let money1 = this.agreedRefundForm.refundTotal - this.orderDetails.refundDTO.refundPriceNew;
              //最大可退金额-实际付款金额
              let money2 = this.orderDetails.refundDTO.maxRefundPrice - this.orderDetails.refundDTO.refundPriceNew;
              this.agreedRefundForm.morePoint = parseInt(this.orderDetails.orderItem.usePoints * (money1 / money2));
            }
          } else {
            this.agreedRefundForm.showMoney = false;
            this.agreedRefundForm.refundPrice = this.agreedRefundForm.refundTotal;
          }
        });
      } else {
        //小于的情况下
        if (this.agreedRefundForm.refundTotal >= this.orderDetails.refundDTO.refundPriceNew) {
          this.agreedRefundForm.showMoney = true;
          this.agreedRefundForm.refundPrice = this.orderDetails.refundDTO.refundPriceNew;
          this.agreedRefundForm.moreMoney = (this.agreedRefundForm.refundTotal - this.orderDetails.refundDTO.refundPriceNew).toFixed(2);

          // 积分=最大积分*[(退款总额-实际付款金额)/(最大可退金额-实际付款金额])
          //退款总额-实际付款金额
          let money1 = this.agreedRefundForm.refundTotal - this.orderDetails.refundDTO.refundPriceNew;
          //最大可退金额-实际付款金额
          let money2 = this.orderDetails.refundDTO.maxRefundPrice - this.orderDetails.refundDTO.refundPriceNew;
          this.agreedRefundForm.morePoint = parseInt(this.orderDetails.orderItem.usePoints * (money1 / money2));
        } else {
          this.agreedRefundForm.showMoney = false;
          this.agreedRefundForm.refundPrice = this.agreedRefundForm.refundTotal;
        }
      }

      // }
    },
    //限制最大可退积分
    refundPointMaxDeal(value) {
      var reg = /^([1-9]\d*|[0]{1,1})$/; //含0正整数
      if (!reg.test(value)) {
        this.$nextTick(() => {
          this.$message.error('请输入数字');
          this.agreedRefundForm.realRefundPoint = '';
        });
      }
      // if(value!==0){
      //   if(!Number(value)){
      //     this.$nextTick(() => {
      //       this.$message.error("请输入数字")
      //       this.agreedRefundForm.realRefundPoint=''

      //     })

      //   }
      // }
      if (Number(this.agreedRefundForm.realRefundPoint) > Number(this.orderDetails.orderItem.usePoints)) {
        this.$nextTick(() => {
          this.agreedRefundForm.realRefundPoint = this.orderDetails.orderItem.usePoints;
          this.$message.error('不可超过最大可退积分');
          // 计算积分规则  （最大可退金额-实付金额-邮费）/积分

          this.pointRuleComputed = this.agreedRefundForm.realRefundPoint;
          this.moneyRuleComputed = (this.agreedRefundForm.realRefundPoint * this.pointRule).toFixed(2);
        });
      }
      this.pointRuleComputed = this.agreedRefundForm.realRefundPoint;
      this.moneyRuleComputed = (this.agreedRefundForm.realRefundPoint * this.pointRule).toFixed(2);
    },

    // 同意退款确认（老数据）
    agreedRefundDeal() {
      this.confirmStatus = true; //确认按钮状态
      let data = {
        orderRefundId: this.orderRefundId,
        refundStatus: 2,
        orderItemNum: this.agreedRefundForm.orderItemNum,
        refundPrice: this.agreedRefundForm.refundPrice,
        refundPoints: this.agreedRefundForm.morePoint,
        refundFailReason: this.agreedRefundForm.refundFailReason,
        requestProject: 'mall',
        token: this.orderDetails.token
      };
      request.post('/api-mall/do-mall-order-refund', qs.stringify(data)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.agreedRefundDialog = false;
          this.confirmStatus = false; //确认按钮状态
          // 更新页面
          this.getOrderDetails(this.orderDetails.refundDTO.orderRefundId);
          this.consultationRecord();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //新版仅退款弹框
    agreedRefundNew() {
      // orderDetails.refundDTO.refundType===1&&orderDetails.orderItem.refund_deliver_type===2||orderDetails.refundDTO.refundType===1&&orderDetails.orderItem.orderItemStatus===2

      //判断数量是否可编辑
      if (this.orderDetails.refundDTO.refundDeliverType === 0) {
        //整单（包括已发和未发）
        if (this.orderDetails.orderItem.orderItemStatus === 2 && this.orderDetails.refundDTO.refundType === 1) {
          //整单未发并且仅退款
          this.editNum = true;
        }
      } else if (this.orderDetails.refundDTO.refundDeliverType === 1) {
        //1拆单未发货,2拆单已发货
        if (this.orderDetails.refundDTO.refundType === 1) {
          this.editNum = true;
        }
      }

      this.agreedNewRefundDialog = true; //退款弹框
      if (this.orderDetails.refundDTO.refundType === 1) {
        //仅退款的
        this.agreedRefundForm.orderItemNum = this.orderDetails.refundDTO.refundNumber;
      } else if (this.orderDetails.refundDTO.refundType === 2) {
        //退货退款
        this.agreedRefundForm.orderItemNum = 0;
      }
    },
    // 新数据同意退款确认
    agreedRefundDealNew() {
      if (this.orderDetails.orderItem.usePoints > 0) {
        if (this.agreedRefundForm.realRefundPoint !== 0) {
          if (!this.agreedRefundForm.realRefundPoint) {
            this.$message.error('请输入退回积分');
            return false;
          }
        }
      }

      let data = {
        orderRefundId: this.orderRefundId,
        refundStatus: 2,
        orderItemNum: this.agreedRefundForm.orderItemNum,
        refundPrice: this.agreedRefundForm.refundPriceNew,
        refundPoints: this.agreedRefundForm.realRefundPoint ? this.agreedRefundForm.realRefundPoint : 0,
        requestProject: 'mall',
        token: this.orderDetails.token,
        refundFailReason: ''
      };
      this.refundLoading = true;
      request.post('/api-mall/do-mall-order-refund', qs.stringify(data)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.agreedRefundDialog = false;
          this.agreedNewRefundDialog = false;
          this.confirmStatus = false; //确认按钮状态
          // 更新页面
          this.getOrderDetails(this.orderDetails.refundDTO.orderRefundId);
          this.consultationRecord();
          this.refundLoading = false;
        } else {
          this.$message.error(res.data.message);
          this.refundLoading = false;
        }
      });
    },
    // 关闭退款确认
    closeRefundDeal() {
      if (this.closeRefundForm.refundFailReason == '') {
        this.$message.error('请填写关闭原因！');
        return;
      }
      let data = {
        orderRefundId: this.orderRefundId,
        refundStatus: 3,
        orderItemNum: 0,
        refundPrice: 0,
        refundPoints: 0,
        refundFailReason: this.closeRefundForm.refundFailReason,
        requestProject: 'mall',
        token: this.orderDetails.token
      };
      if (this.orderDetails.order.orderVersion !== null) {
        //新版本数据拒绝退款
        data.refundStatus = 6;
      } else {
        data.refundStatus = 3;
      }
      this.disagreeRefundStatus = true;
      request.post('/api-mall/do-mall-order-refund', qs.stringify(data)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.closeRefundDialog = false;
          // 更新页面
          this.getOrderDetails(this.orderDetails.refundDTO.orderRefundId);
          this.consultationRecord();
          this.disagreeRefundStatus = false;
        } else {
          this.$message.error(res.data.message);
          this.disagreeRefundStatus = false;
        }
      });
    },
    // 取消拒绝退款
    cancelRefund() {
      this.closeRefundDialog = false;
      this.refundFailReasonLen = 0;
      this.closeRefundForm.refundFailReason = '';
    },

    //发送退货地址
    sendRefundAddress() {
      this.sendAddressDialog = true;
      let data = {
        orderRefundId: this.orderRefundId
      };
      request.get('/api-mall/refund_address', { params: data }).then(res => {
        if (res.data.errorCode == 0) {
          if (res.data.result) {
            this.refundAddressList = res.data.result;
            for (let i = 0; i < this.refundAddressList.addressList.length; i++) {
              if (this.refundAddressList.addressList[i].ifDefault === 1) {
                this.defaultAddress = i;
                this.refundSellerAddressId = this.refundAddressList.addressList[i].sellerAddressId;
                this.refundSellerAddress = this.refundAddressList.addressList[i].provinceName + this.refundAddressList.addressList[i].cityName + this.refundAddressList.addressList[i].areaName + this.refundAddressList.addressList[i].addressDetail;
              }
            }
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 确认收货并退款
    takeGoodsRefund() {
      this.agreedNewRefundDialog = true;
      if (this.orderDetails.orderItem.orderItemStatus === 3) {
        //订单项已发货
        if (this.orderDetails.refundDTO.refundDeliverType !== 0) {
          //部分发货
          if (this.orderDetails.refundDTO.refundType === 1) {
            //仅退款
            this.agreedRefundForm.realRefundPoint = this.orderDetails.noDeliverUsePrice;
          } else if (this.orderDetails.refundDTO.refundType === 2) {
            //退货退款
            this.agreedRefundForm.realRefundPoint = this.orderDetails.deliverUsePrice;
          }
        } else {
          //整单发货
          this.agreedRefundForm.realRefundPoint;
        }
      }
    },
    // 退货地址确定弹出框
    sendMessageConfirm() {
      if (this.refundAddressList.addressList.length === 0) {
        this.$message.error('请去地址库添加退货地址');
        return false;
      }
      this.sendAddressDialog = false;
      let data = {
        orderRefundId: this.orderRefundId,
        refundStatus: 4,
        refundSellerAddressId: this.refundSellerAddressId, //卖家地址id
        refundSellerAddress: this.refundSellerAddress, //卖家地址
        refundSellerDesc: this.refundSellerDesc, //买家备注
        token: this.orderDetails.token
      };
      this.sendLoading = true;
      request.post('/api-mall/do-mall-order-refund', qs.stringify(data)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.agreedRefundDialog = false;
          this.agreedNewRefundDialog = false;
          this.confirmStatus = false; //确认按钮状态
          // 更新页面
          this.getOrderDetails(this.orderDetails.refundDTO.orderRefundId);
          this.consultationRecord();
          this.sendLoading = false;
        } else {
          this.$message.error(res.data.message);
          this.sendLoading = false;
        }
      });
    },
    // 备注字数限制
    remarkLimit(value) {
      this.$nextTick(() => {
        this.refundSellerDesc = getInputVal.getInputVal(value, 150);
        this.refundSellerDescLen = getInputVal.getZhLen(this.refundSellerDesc);
      });
    },
    //退款原因字数限制
    refundFailReasonLimit(value) {
      this.$nextTick(() => {
        this.closeRefundForm.refundFailReason = getInputVal.getInputVal(value, 200);
        this.refundFailReasonLen = getInputVal.getZhLen(this.closeRefundForm.refundFailReason);
      });
    },
    // 选择默认地址
    radioChange(item, index) {
      for (let i = 0; i < this.refundAddressList.addressList.length; i++) {
        this.refundAddressList.addressList[i].ifDefault = 0;
      }
      this.refundAddressList.addressList[index].ifDefault = 1;
      this.refundSellerAddressId = this.refundAddressList.addressList[index].sellerAddressId;
      this.refundSellerAddress = this.refundAddressList.addressList[index].provinceName + this.refundAddressList.addressList[index].cityName + this.refundAddressList.addressList[index].areaName + this.refundAddressList.addressList[index].addressDetail;
    },
    // 协商记录列表
    consultationRecord() {
      let data = {
        orderRefundId: this.orderRefundId,
        requestProject: 'mall'
      };
      request.get('/api-mall/find_refund_consult_record', { params: data }).then(res => {
        if (res.data.errorCode == 0) {
          this.consultationRecords = res.data.result;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 放大查看图片
    enlargeDialogImageUrl(item, index) {
      this.dialogVisibleImg = true;
      this.dialogEnlargeImageUrl = item;
    },
    // 跳转到订单详情
    goOrderDetail(orderId) {
      this.$router.push({
        name: 'orderDetails',
        params: { orderId: orderId }
      });
    },
    // 跳转到退货地址
    goAddressList() {
      this.$router.push({
        name: 'addressEdit',
        params: {
          sellerAddressId: '-1'
        }
      });
    }
  },

  filters: {
    changeTimes: function(value) {
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
    refundTypeName: function(value) {
      let typename = '';
      if (value == 1) {
        typename = '仅退款';
      } else if (value == 2) {
        typename = '退货退款';
      }
      return typename;
    }
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
.mall-section {
  margin: 24px;
  background-color: #fff;
  padding-top: 14px;
}
/*头部进度start*/
.progress-wrap {
  height: 116px;
  margin: 0px 10px 0px 15px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.progress-info {
  text-align: center;
  position: relative;
  margin-right: 12px;
  margin-left: 12px;
  color: #bbc2cb;
}
.progress-wrap .progress-infoed {
  color: #303133;
}
.progress-info > div:nth-child(1) {
  /*width:64px;*/
  font-size: 14px;
}
.progress-info-time {
  position: absolute;
  font-size: 13px;
  top: 24px;
  left: -36%;
  text-align: center;
  white-space: nowrap;
}
.progress-info .progress-info-time-left {
  left: -12%;
}
.progress-info .progress-info-time-left-b {
  left: -65%;
}
.progress-no {
  display: flex;
  align-items: center;
}
.progress-no div {
  width: 8px;
  height: 8px;
  background-color: #bbc2cb;
  border-radius: 50%;
  margin-right: 6px;
  transform: scale(0.5);
  /*因为直接设置4px的圆点看着有点方，所以用了缩放*/
}
.progress-ing {
  display: flex;
  align-items: center;
}
.progress-ing div {
  width: 8px;
  height: 8px;
  background-color: #bbc2cb;
  border-radius: 50%;
  margin-right: 6px;
  transform: scale(0.5);
}
.progress-ing div:nth-child(-n + 7) {
  background-color: #67c23a;
}
.progress-ed {
  display: flex;
  align-items: center;
}
.progress-ed div {
  width: 8px;
  height: 8px;
  background-color: #bbc2cb;
  border-radius: 50%;
  margin-right: 6px;
  transform: scale(0.5);
}
.progress-ed div:nth-child(n) {
  background-color: #67c23a;
}
i {
  color: #bbc2cb;
}
.progress-ed i {
  color: #67c23a;
}
/*订单详情左下 start*/
.left-wrap {
  border-right: 1px solid #ebeef5;
  padding-left: 10px;
  padding-bottom: 10px;
}
.left-header {
  height: 48px;
  line-height: 48px;
  color: #303133;
  font-size: 13px;
  padding-left: 15px;
  background-color: rgba(241, 243, 247, 1);
}
.goods-info {
  height: 100%;
  display: flex;
  border-bottom: 1px solid #ebeef5;
  margin-right: 14px;
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
.left-list-info > div {
  margin-top: 11px;
}
.left-list-info > div > span:nth-child(1) {
  display: inline-block;
  color: #909399;
  font-size: 13px;
  width: 60px;
  text-align: right;
  margin-right: 20px;
}
.left-list-info > div > span:nth-child(2) {
  font-size: 13px;
}
.refund-reason {
  padding-bottom: 11px;
  margin-right: 14px;
  border-bottom: 1px solid #ebeef5;
}
/*详情右下角 start*/
.right-wrap {
  padding: 14px;
}
.right-header {
  height: 200px;
  border-bottom: 1px solid #ebeef5;
  padding-left: 90px;
}
.right-header-title {
  font-size: 18px;
  color: #409eff;
  margin: 36px 0px 12px 0px;
}
.right-header .error-color {
  color: #ff4040;
}
.right-header-instructions {
  font-size: 13px;
  color: #606266;
}
.right-header-btns {
  margin-top: 40px;
}
.dialog-content {
  margin-bottom: 22px;
  display: flex;
  align-items: center;
}
.dialog-content-new {
  margin-bottom: 22px;
  display: flex;
}
.close-reason {
  display: inline-block;
  vertical-align: top;
  width: 70px;
  text-align: right;
  font-size: 13px;
  color: #303133;
  margin-right: 12px;
}
.close-reason-info {
  display: inline-block;
  width: 338px;
}
.width-style {
  width: 100%;
}
/*右下角body start*/
.right-body {
  padding: 24px 0px 12px 20px;
}
.right-body .right-title {
  border-left: 3px solid #409eff;
  padding-left: 5px;
  font-size: 14px;
}
.right-body > div {
  font-size: 13px;
}
.right-body-wrap > div {
  margin-top: 14px;
}
.buyers-sell-title {
  position: relative;
}
.buyers-sell-title span:nth-child(1) {
  color: #333;
}
.buyers-sell-title span:nth-child(2) {
  /* position:absolute;
    right:12px;*/
  color: #bbc2cb;
  margin-left: 30px;
}
.prompt-info {
  display: inline-block;
  margin-right: 10px;
  color: #bbc2cb;
}
.prompt-info-a {
  margin-left: 14px;
}
.refund-info {
  display: flex;
}
.a-link {
  color: #5092e1;
  cursor: pointer;
}
.a-link:hover {
  color: #1e6cd5;
}
.remark-num {
  font-size: 12px;
  color: rgb(144, 147, 153);
  margin-left: 306px;
  margin-top: 5px;
  display: inline-block;
}
.radio-block {
  display: block;
  margin-bottom: 22px;
}
.radio-block:last-child {
  margin-bottom: 0px;
}
.radio-block + .el-radio {
  margin-left: 0px;
}
.reason-radio-align {
  vertical-align: top;
}
.default-remark {
  color: #fff;
  font-size: 12px;
  border-radius: 2px;
  background: #409eff;
  display: inline-block;
  padding: 2px 4px;
  text-align: center;
}
.dialog-content-box {
  height: 305px;
  overflow-y: auto;
}

/*放大协商的图片*/
.img-box {
  position: relative;
  margin: 0 8px 8px 0;
  display: inline-block;
}
.img-box .el-icon-zoom-in {
  position: absolute;
  left: 50%;
  top: 12px;
  transform: translateX(-50%);
  font-size: 20px;
  color: #fff;
  z-index: 2;
  display: none;
}
.img-box:hover .el-icon-zoom-in {
  display: block;
  cursor: pointer;
}
.dialog-img {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  cursor: pointer;
  border-radius: 4px;
}
.img-box:hover .dialog-img {
  display: block;
  cursor: pointer;
}
</style>
