<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div v-if="orderDetails != ''" class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/orderAll' }">所有订单</el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>订单详情</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="progress-wrap" v-if="orderDetails.order.orderStep != 0">
          <div class="progress-info progress-infoed">
            <div @click="getParcelList">买家下单</div>
            <div class="progress-info-time">{{ orderDetails.order.createTime | timesOther }}</div>
          </div>
          <div v-bind:class="{ 'progress-ing': orderDetails.order.orderStep == 1, 'progress-ed': orderDetails.order.orderStep != 1 }">
            <!--<div class="progress-ing" >-->
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
          <div class="progress-info" v-bind:class="{ 'progress-infoed': orderDetails.order.orderStep >= 2 }">
            <div>买家付款</div>
            <div class="progress-info-time" v-if="orderDetails.order.orderStep == '2' || orderDetails.order.orderStep == '3' || orderDetails.order.orderStep == '4' || orderDetails.order.orderStep == '7'">{{ orderDetails.order.payTime | timesOther }}</div>
          </div>
          <div v-bind:class="{ 'progress-ing': orderDetails.order.orderStep == 2, 'progress-no': orderDetails.order.orderStep == 1, 'progress-ed': orderDetails.order.orderStep != 1 && orderDetails.order.orderStep != 2 }">
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
          <div class="progress-info" v-bind:class="{ 'progress-infoed': orderDetails.order.orderStep >= 3 }">
            <div>商家发货</div>
            <div class="progress-info-time" v-if="orderDetails.order.orderStep == '3' || orderDetails.order.orderStep == '4' || orderDetails.order.orderStep == '7'">{{ orderDetails.order.deliverDate | timesOther }}</div>
          </div>
          <div v-bind:class="{ 'progress-ing': orderDetails.order.orderStep == 3, 'progress-no': orderDetails.order.orderStep < 3, 'progress-ed': orderDetails.order.orderStep > 3 }">
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
          <div class="progress-info" v-bind:class="{ 'progress-infoed': orderDetails.order.orderStep == 4 }">
            <div>交易成功</div>
            <div class="progress-info-time" v-if="orderDetails.order.orderStep == '4'">{{ orderDetails.order.updateTime | timesOther }}</div>
          </div>
        </div>
        <el-row>
          <el-col :span="6">
            <div class="left-wrap">
              <div class="left-header">
                订单信息
              </div>
              <div class="left-list-info">
                <div>
                  <span>订单编号</span>
                  <span>{{ orderDetails.order.orderNumber }}</span>
                  <el-popover width="260" trigger="hover">
                    <div class="popover-hover-wrap">
                      <div class="popover-hover"><span>支付编号</span>{{ orderDetails.order.payNumber }}</div>
                      <div class="popover-hover"><span>下单时间</span>{{ orderDetails.order.createTime | timesOther }}</div>
                      <div class="popover-hover">
                        <span>付款时间</span>
                        <p v-if="orderDetails.order.payTime" style="display:inline-block;">{{ getTime(orderDetails.order.payTime) }} {{ getSeconds(orderDetails.order.payTime) }}</p>
                        <span v-else>--</span>
                      </div>
                    </div>
                    <span type="text" slot="reference"><i class="iconfont icon-gengduo" style="font-size:12px;margin-left:5px;cursor: pointer"></i></span>
                  </el-popover>
                </div>
                <div>
                  <span>买家昵称</span>
                  <span>{{ orderDetails.memberDTO ? orderDetails.memberDTO.nickName : '' }}</span>
                </div>
                <div>
                  <span>收货信息</span>
                  <span>{{ orderDetails.order.buyerName }},{{ orderDetails.order.buyerPhone }},{{ orderDetails.area }} {{ orderDetails.order.addressInfo }}</span>
                </div>
                <div>
                  <span>买家卡号</span>
                  <span
                    ><a :href="windowUrl + '/member/#/wechatmemberDetail?memberId=' + orderDetails.order.memberId" target="_blank">{{ orderDetails.order.memberCardNum ? orderDetails.order.memberCardNum : '' }}</a></span
                  >
                </div>
                <div>
                  <span>买家留言</span>
                  <span>{{ orderDetails.order.remarks == '' ? '无' : orderDetails.order.remarks }}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="right-wrap">
              <div class="right-header" v-if="orderDetails.order.orderStep == 1">
                <p class="right-header-title">等待买家付款</p>
                <p class="right-header-instructions">订单已提交成功</p>
                <div class="right-header-btns">
                  <el-button type="primary" size="small" style="width:98px;" @click="freightOrder">修改运费</el-button>
                  <el-button style="color:#409EFF;border-color:#409EFF;width:98px;" size="small" @click="closeOrderShow">关闭订单</el-button>
                </div>
                <!--修改运费dialog-->
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
                    <el-button type="primary" @click="freightOrderDeal" :loading="actualFreightLoading">确定修改</el-button>
                  </div>
                </el-dialog>
                <!--关闭订单-->
                <el-dialog title="关闭订单" :visible.sync="closeOrderDialog" width="464px" @close="cancelCloseOrderDeal">
                  <div class="close-reason">关闭原因</div>
                  <div class="close-reason-info">
                    <el-input type="textarea" :rows="3" v-model="closeOrderForm.closeReason"></el-input>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelCloseOrderDeal">取 消</el-button>
                    <el-button type="primary" @click="closeOrderDeal" :loading="closeOrderLoading">确 定</el-button>
                  </div>
                </el-dialog>
              </div>
              <div class="right-header" v-else-if="orderDetails.order.orderStep == 2">
                <p class="right-header-title">等待商家发货</p>
                <p class="right-header-instructions">买家已付款到商家账户</p>
                <div class="right-header-btns">
                  <el-button type="primary" size="small" style="width:98px;" @click="showdeliveryOrder()">发货</el-button>
                </div>
              </div>
              <div class="right-header" v-else-if="orderDetails.order.orderStep == 7">
                <p class="right-header-title">商家已部分发货</p>
                <p class="right-header-instructions">商家已发出{{ deliverNum }}件商品，还有{{ mallSaleNum - deliverNum }}件商品等待发出</p>
                <div class="right-header-btns">
                  <el-button type="primary" size="small" style="width:98px;" @click="goSplitDeliveryOrder()">发货</el-button>
                </div>
              </div>
              <div class="right-header" v-else-if="orderDetails.order.orderStep == 3">
                <p class="right-header-title">等待买家确认收货</p>
                <p class="right-header-instructions">商家已发货，等待交易成功</p>
              </div>
              <div v-else-if="orderDetails.order.orderStep == 4">
                <div class="right-header" style="height:50px">
                  <p class="right-header-title" style="margin:10px 0">交易成功</p>
                  <p class="right-header-instructions">订单完成</p>
                </div>
                <div class="right-header" style="height:50px;border-bottom:none;margin-top:30px;cursor: pointer;">
                  <p class="right-header-title" style="margin:10px 0">订单评价</p>
                  <p class="right-header-instructions" v-if="orderDetails.order.evaluationStatus == 1" @click="showEvaluationDialog">
                    买家已评
                  </p>

                  <p class="right-header-instructions" v-else>买家未评</p>
                </div>
              </div>

              <div class="right-header" v-else-if="orderDetails.order.orderStep == 0">
                <p class="right-header-title error-color">交易关闭</p>
                <p class="right-header-instructions">{{ orderDetails.order.tradeCloseReason }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 退款中不能发货提示 -->
        <el-dialog title="发货失败" :visible.sync="errordialogVisible" width="464px">
          <span>当前有待处理的仅退款单据，请优先处理退款再进行发货操作。</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="errordialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <!--整单发货-->
        <!--<el-dialog title="整单发货" :visible.sync="deliveryOrderDialog" width="464px">-->
        <el-dialog :visible.sync="deliveryOrderDialog" width="464px" @close="cancelDeliveryOrderDeal">
          <div class="all-delivery" slot="title">
            整单发货
            <div class="go-split-delivery" v-if="orderDetails.order.splitDeliverGoodsOnOff != 0 && !orderItemOnlyOne" @click="goSplitDeliveryOrder()"><a href="javascript:;">去拆单发货</a></div>
          </div>
          <div class="dialog-content">
            <div class="close-reason">收货信息:</div>
            <div class="close-reason-info">{{ orderDetails.order.buyerName }},{{ orderDetails.order.buyerPhone }},{{ orderDetails.area }} {{ orderDetails.order.addressInfo }}</div>
          </div>
          <div class="dialog-content">
            <div class="close-reason">物流公司</div>
            <div class="close-reason-info">
              <el-select v-model="deliveryOrderForm.logisticsCompanyId" clearable placeholder="请选择" class="width-style" filterable @change="changeLogisticsCompanyName">
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
            <el-col :span="12"> 收货信息： {{ splitOrderInfo.buyerName }},{{ splitOrderInfo.buyerPhone }},{{ orderDetails.area }} {{ splitOrderInfo.addressInfo }} </el-col>
          </el-row>
          <el-row class="order-list-title">
            <el-col :span="8">
              <div class="grid-content">
                商品
              </div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content">
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
            <span>下单时间：{{ splitOrderInfo.createTime | timesOther }}</span>
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
                            <span v-for="(item2, index2) in JSON.parse(items.mallProSkuAttr)" :key="index2">{{ item2.propName }}：{{ item2.valueName }} &nbsp;&nbsp;</span>
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
                  <!--  <td>
                  <div class="grid-content-other" v-for="(itemss,indexs) in items.orderLogistics">
                    <div class="split-order-num">
                      <input
                        type="text"
                        v-model.number="itemss.orderItemNum"
                        @input="limitOrderNumDeal(index,indexs)"
                        :disabled="!itemss.isNew"
                        placeholder="请输入">

                    </div>
                    <p v-if="indexs == 0">
                      <el-button type="text" @click="splitOrder(index)">拆单</el-button>
                    </p>
                    <p v-else style="visibility: hidden;">
                      拆单
                    </p>
                  </div>
                </td> -->
                  <td>
                    <div class="split-logistics-other" v-for="itemss in items.orderLogistics" :key="itemss.logisticsCompanyId">
                      <p>
                        <el-select v-model="itemss.logisticsCompanyId" :disabled="!itemss.isNew" clearable placeholder="请选择" @change="value => changeLogisticsItem(value, itemss)">
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
                      <p v-if="indexs > 0 && itemss.isNew">
                        <el-button type="text" @click="deleteOrder(index, indexs)">删除</el-button>
                      </p>
                      <p v-else style="visibility: hidden;">
                        删除
                      </p>
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
            <el-button @click="splitDeliveryOrderDialog = false">取 消</el-button>
            <el-button type="primary" @click="splitDeliveryOrderDeal" :loading="splitLoading">确 定</el-button>
          </div>
        </el-dialog>
        <!--包裹列表-->
        <div v-if="orderDetails.order.orderStep >= 3 && parcelList.length > 0">
          <el-row class="order-list-title" id="parcel-list-title">
            <el-col :span="5">
              <div class="grid-content">
                包裹名称
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content">
                快递
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content">
                物流单号
              </div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content">
                发货时间
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                操作
              </div>
            </el-col>
          </el-row>
          <div class="parcel-list-content" v-for="(item, index) in parcelList" :key="index">
            <el-row class="order-list-title">
              <el-col :span="5">
                <div class="grid-content">包裹-{{ index + 1 }}</div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  {{ item.logisticsCompanyName ? item.logisticsCompanyName : ' 无 ' }}
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  <span>{{ item.courierNumber ? item.courierNumber : ' 无 ' }}</span
                  ><i class="el-icon-edit" @click="showLogistics(item)"></i>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">
                  {{ item.createTime | timesOther }}
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content" @click="showParcelLoginstics(index)">
                  <span class="operation-color" v-if="item.show">收起物流详情<i class="iconfont icon-arrowdown operation-color updown"></i></span>
                  <span class="operation-color" v-else>展开物流详情<i class="iconfont icon-arrowdown operation-color"></i></span>
                </div>
              </el-col>
            </el-row>
            <div class="parcel-detail" v-show="item.show">
              <div class="dotted-line-wrap">
                <div class="dotted-line" v-for="(itema, indexa) in item.orderItems" :key="indexa">
                  <div class="goods-info">
                    <div>
                      <a href="javascript:;">
                        <img class="imgs-style" :src="itema.mallProImageUrl" alt="" />
                      </a>
                    </div>
                    <div class="goods-text">
                      <div class="goods-text-name">{{ itema.mallProName }}</div>
                      <div class="goods-text-info">
                        <div>
                          <span v-for="(item2, indx2) in JSON.parse(itema.mallProSkuAttr)" :key="indx2">{{ item2.propName }}：{{ item2.valueName }} &nbsp;&nbsp;</span>
                        </div>
                        <div>SKU编码：{{ itema.mallProSkuCode }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="parcel-item-num" v-if="item.mallOrderDTO.deliveryType === 0">X{{ itema.mallProNumber }}</div>
                  <div class="parcel-item-num" v-if="item.mallOrderDTO.deliveryType === 1">X{{ itema.orderItemNumCount }}</div>
                </div>
              </div>
              <div>
                <div v-if="item.logisticsInformation">
                  <div v-for="(items, indexs) in JSON.parse(item.logisticsInformation).Traces" :key="indexs" class="parcel-detail-right">
                    <div class="dot-line">
                      <div class="line-line-new" v-if="indexs == 0"></div>
                      <div class="line-line" v-else></div>
                      <div class="dot-dot-new" v-if="indexs == 0"></div>
                      <div class="dot-dot" v-else></div>
                    </div>
                    <div class="parcel-detail-step">{{ items.AcceptTime }}</div>
                    <div class="parcel-detail-info">
                      {{ items.AcceptStation }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--优惠列表-->
        <div>
          <el-row class="order-list-title">
            <el-col :span="8">
              <div class="grid-content">
                商品
              </div>
            </el-col>
            <el-col :span="2">
              <div class="grid-content">
                单价
              </div>
            </el-col>
            <el-col :span="2">
              <div class="grid-content">
                数量
              </div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content">
                售后
              </div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content">
                优惠
              </div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content">
                小计
              </div>
            </el-col>
            <el-col :span="3">
              <div class="grid-content">
                状态
              </div>
            </el-col>
          </el-row>
          <div class="order-list-wrap" v-for="(item, index) in orderDetails.order.orderItemList" :key="index">
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
                          <div class="goods-text-name">
                            <span class="zeng-pin" v-if="item.isGift === 1">赠品</span><span>{{ item.mallProName }}</span>
                          </div>
                          <div class="goods-text-info">
                            <div>
                              <span v-for="(item2, inde2) in JSON.parse(item.mallProSkuAttr)" :key="inde2"> {{ item2.propName }}：{{ item2.valueName }} &nbsp;&nbsp;</span>
                            </div>
                            <div>SKU编码：{{ item.mallProSkuCode }}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="grid-content-other">
                        <span>￥{{ item.mallProPrice }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="grid-content-other">
                        <span>{{ item.mallProNumber }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="grid-content-other">
                        <span>{{ item.refundStatus | afterSales }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="grid-content-other">
                        <!-- <span>-￥{{item.dainfo.gradePrice + item.dainfo.discountActivityPrice + item.apinfo.cashCouponPrice+item.dainfo.tieredActivityPrice}}</span> -->
                        <span>-￥{{ item.discountTotal }}</span>
                        <el-popover width="200" trigger="hover">
                          <div class="popover-hove-wrap">
                            <div class="item-hover" v-for="(ite1, indx1) in item.discountInformation" :key="indx1">
                              <span>{{ ite1.itemName }}</span
                              >-￥{{ ite1.amountValue }}
                            </div>
                          </div>
                          <span type="text" slot="reference"><i class="iconfont icon-gengduo" style="font-size:12px;margin-left:5px;cursor: pointer"></i></span>
                        </el-popover>
                      </div>
                    </td>
                    <td>
                      <div class="grid-content-other">
                        <span v-if="item.isGift === 0">￥{{ item.mallProPrice * item.mallProNumber }}</span>
                        <span v-else>￥0</span>
                      </div>
                    </td>
                    <td>
                      <div class="grid-content-other">
                        <span>{{ item.orderItemStatus | orderStepName }}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="order-price-wrap">
          <div class="return-integral">返{{ orderDetails.order.getPoints }}积分</div>
          <div>
            <div class="return-items">
              <span class="return-items-span">商品总价</span><span>￥{{ orderDetails.order.mallProAllPrice }}</span>
            </div>
            <div class="return-items">
              <span class="return-items-span">优惠</span><span>-￥{{ favorablePrice }}</span>
              <el-popover width="200" trigger="hover">
                <div class="popover-hove-wrap">
                  <div class="item-hover" v-for="(itm1, inde1) in orderDetails.discountInformation" :key="inde1">
                    <span>{{ itm1.itemName }}</span
                    >-￥{{ itm1.amountValue }}
                  </div>
                </div>
                <span type="text" slot="reference"><i class="iconfont icon-gengduo" style="font-size:12px;margin-left:3px;cursor: pointer"></i></span>
              </el-popover>
            </div>
            <div class="return-items">
              <span class="return-items-span">运费</span><span>￥{{ orderDetails.order.actualFreight }}</span>
            </div>
            <div class="return-items">
              <span class="return-items-span">实付金额</span><span class="pay-style">￥{{ orderDetails.order.payAmountAll }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 订单评价弹框 -->
    <el-dialog title="订单评价" :visible.sync="dialogOrderEvaluation" width="800px">
      <div class="dialog-body">
        <div class="dialog-body-item">
          <h3>订单评价</h3>
          <div class="body-list">
            <div class="body-item">
              <span class="body-item-left">评价时间</span>
              <span class="body-item-right">{{ getTime(goodsEvalationTime) }} {{ getSeconds(goodsEvalationTime) }}</span>
            </div>
            <div class="body-item" v-for="(item, index) in orderEvalationList" :key="index">
              <div v-if="item.evaluateType === 0">
                <span class="body-item-left">服务态度</span>
                <span class="body-item-right">
                  <i class="el-icon-star-on" v-for="(i, m) in item.evaluateScore / 2" :key="m"></i>
                  <i class="el-icon-star-off" v-for="(j, n) in 5 - item.evaluateScore / 2" :key="n"></i>
                </span>
              </div>
              <div v-if="item.evaluateType === 1">
                <span class="body-item-left">快递服务</span>
                <span class="body-item-right">
                  <i class="el-icon-star-on" v-for="(i, m1) in item.evaluateScore / 2" :key="m1"></i>
                  <i class="el-icon-star-off" v-for="(j, n1) in 5 - item.evaluateScore / 2" :key="n1"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-body-item">
          <h3>商品评价</h3>
          <div class="body-list">
            <div class="body-item-goods" v-for="(item1, index1) in goodsEvalationList" :key="index1">
              <div class="eva-left">
                <div class="left-item">
                  <span class="body-item-left">评分</span>
                  <span class="body-item-left">
                    <i class="el-icon-star-on" v-for="(i, m) in item1.evaluateScore / 2" :key="m"></i>
                    <i class="el-icon-star-off" v-for="(j, n) in 5 - item1.evaluateScore / 2" :key="n"></i>
                  </span>
                </div>
                <div class="left-item">
                  <span class="body-item-left">商品评语</span>
                  <span>{{ item1.evaluateContent }}</span>
                </div>
                <div class="left-item">
                  <span class="body-item-left">分享图片</span>
                  <div v-if="item1.shareImageList" style="display:inline-block;vertical-align: top;">
                    <img v-for="(imgItem, imgIndex) in item1.shareImageList" :key="imgIndex" :src="imgItem.imageUrl" alt="" style="width:20px;height:20px;margin-right:6px" />
                  </div>
                  <span v-else>无</span>
                </div>
              </div>
              <div class="eva-right">
                <img :src="item1.mallProImageUrl" alt="" />
                <div class="img-text">
                  <p>{{ item1.mallProName }}</p>
                  <p class="sku-info">
                    <span v-for="(skuItem, skuIndx) in JSON.parse(item1.mallProSkuAttr)" :key="skuIndx">{{ skuItem.propName }} :{{ skuItem.valueName }}</span>
                  </p>
                  <p>{{ item1.mallProSkuCode }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 修改物流单号 -->
    <el-dialog title="修改物流单号" :visible.sync="logisticsVisible" width="420px" @close="cancelSubmitLogistics">
      <div style="margin-bottom:22px">
        <el-input v-model="logisticsEditNum" placeholder="请输入内容" @input="value => logisticsEditNumLimit(value)"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitLogistics" :loading="logisticsLoading">确 定</el-button>
        <el-button @click="cancelSubmitLogistics">取 消</el-button>
      </span>
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
      show3: true,
      order: {},
      orderDetails: '',
      length: 0,
      freightOrderDialog: false,
      freightOrderForm: {
        actualFreight: '',
        orderId: ''
      },
      closeOrderDialog: false,
      closeOrderForm: {
        closeReason: '',
        mallOrderId: ''
      },
      logistics: [],
      errordialogVisible: false,
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
      parcelList: [],
      dialogOrderEvaluation: false, //订单评价弹框
      orderEvalationAllList: [], //订单评价的数据
      orderEvalationList: [], //订单评价
      goodsEvalationList: [], //商品评价
      goodsEvalationTime: '', //订单时间
      mallSaleNum: 0, //购买总数量
      deliverNum: 0, //发货的数量
      windowUrl: window.location.origin,
      favorablePrice: 0, //总优惠数据
      logisticsVisible: false,
      logisticsEditNum: '', //物流单号
      logisticsEdiOldtNum: '',
      parcelId: '', //包裹id
      discountTotal: 0, //优惠总额
      //整单发
      otherLogistics: false,
      otherLogisticsName: '', //其他物流名字
      orderItemOnlyOne: false, //true ：只有一件商品
      deliveryLoading: false,
      splitLoading: false,
      logisticsLoading: false,
      closeOrderLoading: false,
      actualFreightLoading: false
    };
  },
  mounted() {
    // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
    window.onbeforeunload = function(e) {
      // var storage = window.localStorage;
      // storage.clear('orderObj');
      localStorage.removeItem('orderObj');
    };
    this.mallOrderId = this.$route.params.orderId;
    this.getOrderDetails(this.mallOrderId);
    this.getParcelList();
  },
  computed: {},
  filters: {
    timesOther: function(value) {
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
      if (value == 1 || value == 4 || value == 5 || value == 6) {
        return '退款中';
      }
      if (value == 2) {
        return '退款成功';
      }
      if (value == 3) {
        return '退款关闭';
      }
      return '--';
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
      if (value == 4) {
        return '部分发货';
      }
      return '';
    }
  },
  methods: {
    //限制物流单号长度
    logisticsEditNumLimit(value) {
      this.$nextTick(() => {
        this.logisticsEditNum = getInputVal.getInputValSin(value, 30);
      });
    },
    // 编辑物流单号弹框
    showLogistics(item) {
      this.logisticsEditNum = item.courierNumber;
      this.logisticsEdiOldtNum = item.courierNumber;
      this.parcelId = item.mallOrderLogisticsId;
      this.logisticsVisible = true;
    },
    // 确定物流信息修改
    submitLogistics() {
      if (this.logisticsEdiOldtNum === '') {
        this.$message.error('请填写物流单号');
        return false;
      }
      if (this.logisticsEdiOldtNum === this.logisticsEditNum) {
        this.$message.error('请修改物流单号');
        return false;
      }
      var reg = /^[0-9a-zA-Z]+$/;
      if (!reg.test(this.logisticsEditNum)) {
        this.$message.error('物流单号只能是数字或字母');
        return;
      }
      let params = {
        mallOrderLogisticsId: this.parcelId,
        courierNumber: this.logisticsEditNum
      };
      this.logisticsLoading = true;
      request.post('/api-mall/update-courier-number', qs.stringify(params)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message.success('修改成功');
          this.getParcelList(); //更新包裹信息
          this.logisticsVisible = false;
          this.logisticsLoading = false;
        } else {
          this.$message.error(res.data.message);
          this.logisticsLoading = false;
        }
      });
    },
    // 取消物流信息
    cancelSubmitLogistics() {
      this.logisticsEditNum = '';
      this.parcelId = '';
      this.logisticsVisible = false;
    },
    // 订单评价的
    getEvaluationList() {
      let params = {
        mallOrderId: this.mallOrderId
      };
      request.post('/api-mall/mall-order-evaluate', qs.stringify(params)).then(res => {
        if (res.data.errorCode == 0) {
          this.orderEvalationList = [];
          this.goodsEvalationList = [];

          for (let i in res.data.result) {
            if (res.data.result[i].evaluateType === 2) {
              this.goodsEvalationList.push(res.data.result[i]);
            } else {
              //订单评价
              this.orderEvalationList.push(res.data.result[i]);
            }
          }
          this.goodsEvalationTime = this.orderEvalationList[0].createTime;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getOrderDetails(Id) {
      let data = {
        orderId: Id,
        requestProject: 'mall'
      };
      request.get('/api-mall/get-mall-order-detail', { params: data }).then(res => {
        if (res.data.errorCode == 0) {
          this.orderDetails = res.data.result;
          this.logistics = res.data.result.logistiesList;
          let num = 0;
          for (let i in this.orderDetails.order.orderItemList) {
            num += this.orderDetails.order.orderItemList[i].mallProNumber;
          }
          this.mallSaleNum = num;
          //计算优惠的价格
          let priceTotal = 0;
          for (let item of this.orderDetails.discountInformation) {
            priceTotal += Number(item.amountValue);
          }
          this.favorablePrice = priceTotal.toFixed(2);
        } else {
          this.$message.error(res.data.message);
        }
        for (let item1 of this.orderDetails.order.orderItemList) {
          item1.discountTotal = 0;
          for (let item2 of item1.discountInformation) {
            item1.discountTotal += item2.amountValue;
          }
          item1.discountTotal = item1.discountTotal.toFixed(2);
        }
      });
    },
    freightOrder() {
      //显示修改运费
      this.freightOrderForm.orderId = this.mallOrderId;
      this.freightOrderDialog = true;
    },
    freightOrderDeal() {
      if (Number(this.freightOrderForm.actualFreight) < 0) {
        this.$message.error('快递运费不可为负');
        this.freightOrderForm.actualFreight = 0;
        return false;
      }
      let data = {
        actualFreight: this.freightOrderForm.actualFreight,
        orderId: this.freightOrderForm.orderId,
        requestProject: 'mall'
      };
      this.actualFreightLoading = true;
      request.post('/api-mall/modify-order-freight', qs.stringify(data)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.result,
            type: 'success'
          });
          this.$emit('listonupdate');
          this.freightOrderDialog = false;
          this.actualFreightLoading = false;
        } else {
          this.$message.error(res.data.message);
          this.actualFreightLoading = false;
        }
      });
    },
    cancelFreightOrderDeal() {
      this.freightOrderDialog = false;
      this.freightOrderForm.actualFreight = '';
    },
    closeOrderShow(orderId) {
      // 显示关闭订单
      this.closeOrderDialog = true;
      this.closeOrderForm.mallOrderId = this.mallOrderId;
    },
    closeOrderDeal() {
      if (this.closeOrderForm.closeReason == '') {
        this.$message.error('请填写关闭原因！');
        return;
      }
      let params = {
        closeReason: this.closeOrderForm.closeReason,
        mallOrderId: this.closeOrderForm.mallOrderId,
        requestProject: 'mall'
      };
      this.closeOrderLoading = true;
      request.post('/api-mall/close-mall-order', qs.stringify(params)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.result,
            type: 'success'
          });
          this.$emit('listonupdate');
          this.closeOrderDialog = false;
          this.closeOrderLoading = false;
        } else {
          this.$message.error(res.data.message);
          this.closeOrderLoading = false;
        }
      });
    },
    cancelCloseOrderDeal() {
      this.closeOrderDialog = false;
      this.closeOrderForm.closeReason = '';
    },
    showdeliveryOrder() {
      // 显示整单发货弹窗

      if (this.orderDetails.order.orderItemList) {
        if (this.orderDetails.order.orderItemList.length !== 1) {
          this.orderItemOnlyOne = false;
        } else {
          this.orderItemOnlyOne = true;
        }
        // if (this.orderDetails.order.orderItemList.length === 1 && this.orderDetails.order.orderItemList[0].mallProNumber === 1) {
        //   this.orderItemOnlyOne = true;
        // } else {
        //   this.orderItemOnlyOne = false;
        // }
      }

      // for(let i in this.orderDetails.order.orderItemList){
      //   if(this.orderDetails.order.orderItemList[i].refundStatus===1||this.orderDetails.order.orderItemList[i].refundStatus===6){//有退款中的订单项
      //     this.$alert('当前有待处理的仅退款单据，请优先处理退款在进行发货', '发货失败', {
      //       confirmButtonText: '确定',
      //     });
      //     return false
      //   }
      // }
      //let bol = false;
      //for (let i = 0; i < this.orderDetails.order.orderItemList.length; i++) {
      //if (this.orderDetails.order.orderItemList[i].refundStatus == 1) {
      // bol = true;
      //}
      //}
      // if(bol){
      //   this.errordialogVisible = true;
      //   return;
      // }
      this.deliveryOrderForm.mallOrderId = this.mallOrderId;
      this.deliveryOrderDialog = true;
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
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.result,
            type: 'success'
          });
          this.deliveryLoading = false;
          this.deliveryOrderDialog = false;
          this.getOrderDetails(this.mallOrderId);
          this.getParcelList();
        } else {
          this.deliveryLoading = false;
          this.$message.error(res.data.message);
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
    getParcelList() {
      // 获取包裹列表信息
      let data = {
        mallOrderId: this.mallOrderId,
        requestProject: 'mall'
      };
      request.get('/api-mall/order-logistics', { params: data }).then(res => {
        if (res.data.errorCode == 0) {
          let num = 0;
          for (let i = 0; i < res.data.result.length; i++) {
            res.data.result[i].show = false;
          }
          for (let j in res.data.result) {
            for (let k in res.data.result[j].orderItems) {
              num += res.data.result[j].orderItems[k].orderItemNumCount;
            }
          }
          this.parcelList = res.data.result;
          this.deliverNum = num; //获取发货的数量
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    showParcelLoginstics(index) {
      // 展开或者隐藏 包裹物流详情
      this.parcelList[index].show = !this.parcelList[index].show;
    },
    goSplitDeliveryOrder() {
      //let bol = false;
      //for (let i = 0; i < this.orderDetails.order.orderItemList.length; i++) {
      //if (this.orderDetails.order.orderItemList[i].refundStatus == 1) {
      // bol = true;
      //}
      //}
      // if(bol){
      //   this.errordialogVisible = true;
      //   return;
      // }
      let obj = this.orderDetails.order;
      this.deliveryOrderDialog = false;
      this.splitDeliveryOrder(obj);
    },
    splitDeliveryOrder(obj) {
      // 拆单dialog
      // for(let i in this.orderDetails.order.orderItemList){
      //   if(this.orderDetails.order.orderItemList[i].refundStatus===1||this.orderDetails.order.orderItemList[i].refundStatus===6){//有退款中的订单项
      //     this.$alert('当前有待处理的仅退款单据，请优先处理退款在进行发货', '发货失败', {
      //       confirmButtonText: '确定',
      //     });
      //     return false
      //   }
      // }

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
    //拆单发货提交
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
            let reg = /^[0-9a-zA-Z]+$/;
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
      // return false
      this.splitLoading = true;
      request.post('/api-mall/split-order-deliver', qs.stringify(data)).then(res => {
        // axios.post(this.testHost+'/split-order-deliver',qs.stringify(data)).then(res => {
        if (res.data.errorCode == 0) {
          this.$message({
            message: res.data.result,
            type: 'success'
          });
          this.splitLoading = false;
          this.$emit('listonupdate');
          this.splitDeliveryOrderDialog = false;
        } else {
          this.splitLoading = false;
          this.$message.error(res.data.message);
        }
      });
    },
    splitOrder(index) {
      // 拆单事件
      if (this.splitOrderInfo.orderItemList[index].orderLogistics.length + this.splitOrderInfo.orderItemList[index].refundCount >= this.splitOrderInfo.orderItemList[index].mallProNumber) {
        this.$message.error('拆单数量不得大于当前单量！');
        return;
      }
      this.splitOrderInfo.orderItemList[index].orderLogistics.push({
        ordernum: 0,
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
    // 买家评价弹框
    showEvaluationDialog() {
      this.getEvaluationList(); //引入
      this.dialogOrderEvaluation = true;
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
  width: 64px;
  font-size: 13px;
}
.progress-info-time {
  position: absolute;
  font-size: 13px;
  top: 24px;
  left: -56%;
  text-align: center;
  white-space: nowrap;
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
}
.left-header {
  height: 48px;
  line-height: 48px;
  color: #303133;
  font-size: 13px;
  padding-left: 15px;
  background-color: rgba(241, 243, 247, 1);
}

.left-list-info > div {
  margin-top: 11px;
  display: flex;
}
.left-list-info > div > span:nth-child(1) {
  display: inline-block;
  color: #909399;
  font-size: 13px;
  width: 60px;
  text-align: right;
  margin-right: 10px;
  flex-shrink: 0;
}
.left-list-info > div > span:nth-child(2) {
  font-size: 13px;
  line-height: 16px;
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
  color: #606266;
  margin: 36px 0px 12px 0px;
}
.right-header .error-color {
  color: #ff4040;
}
.right-header-instructions {
  font-size: 13px;

  color: #409eff;
}
.right-header-btns {
  margin-top: 40px;
}
.dialog-content {
  display: flex;
  align-items: center;
}
.close-reason {
  display: inline-block;
  vertical-align: top;
  width: 60px;
  text-align: right;
  font-size: 13px;
  color: #606266;
  margin-right: 5px;
}
.close-reason-info {
  display: inline-block;
  width: 310px;
  color: #909399;
}
/*订单列表start*/
.order-list-title {
  height: 48px;
  line-height: 48px;
  background-color: rgba(241, 243, 247, 1);
  margin-bottom: 21px;
  padding-left: 14px;
  font-size: 13px;
  color: #909399;
}
.grid-content {
  text-align: center;
}
.operation-color {
  color: #409eff;
  font-size: 13px;
}
.updown {
  display: inline-block;
  transform: rotateZ(180deg);
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
.order-detail {
  position: absolute;
  right: 20px;
}
.order-item-wrap {
  /*height:90px;*/
  padding-left: 14px;
  border-bottom: 1px solid rgba(241, 243, 247, 1);
}
.goods-info {
  /*height:100%;*/
  display: flex;
}
/*.goods-info > div{*/
/*margin: 14px 0px;*/
/*}*/
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
.goods-text-name {
  margin-bottom: 5px;
  line-height: 16px;
}
.goods-text-name .zeng-pin {
  background: #f5222d;
  color: #fff;
  font-size: 10px;
  line-height: 1;
  padding: 2px 4px;
  text-align: center;
  border-radius: 3px;
  display: inline-block;
  margin-right: 5px;
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
  font-size: 12px;
  display: flex;
  /*flex-direction: column;*/
  align-items: center;
  justify-content: center;
}
.split-logistics-other {
  padding: 14px 0px;
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
/*底部价格*/
.order-price-wrap {
  padding: 14px;
  display: flex;
  justify-content: space-between;
}
.return-integral {
  font-size: 12px;
  color: #606266;
}
/*伪类提示框*/
.popover-hove-wrap {
  font-size: 13px;
}
.popover-hover span {
  display: inline-block;
  width: 60px;
}
.item-hover span {
  display: inline-block;
  width: 100px;
}
.return-items {
  font-size: 12px;
  color: #303133;
  margin-bottom: 10px;
}
.return-items-span {
  display: inline-block;
  width: 80px;
  text-align: right;
  font-size: 12px;
  color: #606266;
  margin-right: 12px;
}
.return-items .pay-style {
  color: #409eff;
  font-size: 16px;
}
/*dialog*/
.dialog-content {
  margin-bottom: 12px;
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
/*包裹列表*/
#parcel-list-title {
  margin-bottom: 0px;
}
.parcel-list-content .order-list-title {
  background-color: #fff;
  margin-bottom: 0px;
  border-bottom: 1px solid rgba(241, 243, 247, 1);
  color: #303133;
  font-size: 13px;
}
.parcel-detail {
  border-bottom: 1px solid rgba(241, 243, 247, 1);
  padding: 14px;
  display: flex;
}
.dotted-line-wrap {
  width: 44%;
}
.dotted-line {
  display: flex;
  justify-content: space-around;
  border-right: 1px dashed #d0d7df;
  padding: 12px 10px 12px 0px;
}
.dotted-line .goods-info {
  width: 80%;
  height: 66px;
  margin-right: 10px;
}
.parcel-item-num {
  font-size: 13px;
  color: #303133;
}
.parcel-detail-right {
  display: flex;
  font-size: 13px;
}
.dot-line {
  width: 20px;
  margin-left: 20px;
  position: relative;
  flex-shrink: 0;
}
.dot-dot {
  width: 7px;
  height: 7px;
  background-color: #bbc2cb;
  border-radius: 50%;
  position: absolute;
  top: 15px;
  margin-top: -4px;
}
.dot-dot-new {
  width: 7px;
  height: 7px;
  background-color: #409eff;
  border-radius: 50%;
  position: absolute;
  top: 15px;
  margin-top: -3.5px;
}
.line-line-new {
  width: 1px;
  height: 50%;
  background-color: #bbc2cb;
  position: absolute;
  left: 3px;
  bottom: 0px;
}
.line-line {
  width: 1px;
  height: 100%;
  background-color: #bbc2cb;
  position: absolute;
  left: 3px;
}
.parcel-detail-step {
  line-height: 30px;
  flex-shrink: 0;
  width: 180px;
}
.parcel-detail-info {
  line-height: 20px;
  padding-top: 5px;
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
/*订单弹框*/
.dialog-body-item {
  margin-bottom: 30px;
}
.dialog-body-item h3 {
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}
.body-item {
  padding-top: 25px;
  font-size: 13px;
  margin-left: 15px;
}
.body-item-goods {
  padding: 25px 0 0 10px;
  background: #f2f6fc;
  margin-bottom: 15px;
}
.body-item-left {
  width: 80px;
  display: inline-block;
}
.el-icon-star-on {
  color: rgba(244, 149, 26, 1);
}
.left-item {
  margin-bottom: 20px;
}
.eva-left {
  display: inline-block;
  vertical-align: top;
  width: 300px;
}
.eva-right {
  display: inline-block;
  vertical-align: top;
  width: 440px;
}
.eva-right img {
  width: 60px;
  height: 60px;
}
.eva-right .img-text {
  display: inline-block;
  vertical-align: top;
  margin-left: 5px;
}
.eva-right .sku-info {
  width: 300px;
  margin: 5px 0;
}
.sku-info span {
  margin-right: 10px;
}
.left-list-info {
  padding-bottom: 11px;
}
/*修改物流单号*/
.grid-content .el-icon-edit {
  cursor: pointer;
  margin-left: 5px;
}
.other-name-warm {
  font-size: 12px;
  color: rgb(144, 147, 153);
  margin-top: 5px;
  display: inline-block;
}
</style>
