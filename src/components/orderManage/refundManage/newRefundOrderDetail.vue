<template>
  <div class="mall-section-container">
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
        <div class="progress-wrap" v-if="orderDetails.refundDTO.refundStatus != 3">
          <div class="progress-info progress-infoed">
            <div>买家申请退款</div>
            <div class="progress-info-time" >{{orderDetails.refundDTO.createTime | changeTimes}}</div>
          </div>
          <!--<div class="progress-ing">-->
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
            <div class="progress-info-time progress-info-time-left" v-if="orderDetails.refundDTO.refundStatus==2||orderDetails.refundDTO.refundStatus==3">{{orderDetails.refundDTO.updateTime | changeTimes}}</div>
          </div>
          <!--<div class="progress-no">-->
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
            <div class="progress-info-time progress-info-time-left-b" v-if="orderDetails.refundDTO.refundStatus==2">{{orderDetails.refundDTO.updateTime | changeTimes}}</div>
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
                    <img class="imgs-style" :src="orderDetails.orderItem.mallProImageUrl" alt="">
                  </a>
                </div>
                <div class="goods-text">
                  <div>{{orderDetails.orderItem.mallProName}}</div>
                  <div class="goods-text-info">
                    <div>
                      <span v-for="(item2,mindw2) in JSON.parse(orderDetails.orderItem.mallProSkuAttr)" :key="mindw2">{{item2.propName}}：{{item2.valueName}} &nbsp;&nbsp;</span>
                    </div>
                    <div>SKU编码：{{orderDetails.orderItem.mallProSkuCode}}</div>
                  </div>
                </div>
              </div>
              <div class="left-list-info">
                <div>
                  <span>退款编号</span>
                  <span>{{orderDetails.refundDTO.orderRefundNumber}}</span>
                </div>
                <div>
                  <span>退款方式</span>
                  <span>{{orderDetails.refundDTO.refundType | refundTypeName}}</span>
                </div>
                <div>
                  <span>申请金额</span>
                  <span>{{orderDetails.refundDTO.applyRefundPrice}}</span>
                </div>
                <div>
                  <span>申请件数</span>
                  <span>{{orderDetails.orderItem.mallProNumber}}</span>
                </div>
                <div class="refund-reason">
                  <span>退款原因</span>
                  <span>{{orderDetails.refundDTO.refundReason}}</span>
                </div>
                <div>
                  <span>订单编号</span>
                  <span class="a-link" @click="goOrderDetail(orderDetails.order.orderId)">{{orderDetails.order.orderNumber}}</span>
                </div>
                <div>
                  <span>付款时间</span>
                  <span>{{orderDetails.order.payTime | changeTimes}}</span>
                </div>
                <div>
                  <span>会员昵称</span>
                  <span>{{orderDetails.nickName}}</span>
                </div>
                <div>
                  <span>会员卡号</span>
                  <span><a :href="pageUrl" target="_blank">{{orderDetails.cardNo}}</a></span>
                </div>
                <!-- <div>
                  <span>物流信息</span>
                  <span>{{orderDetails.order.logisticsName}} {{orderDetails.order.logisticsNumber}}</span>
                </div> -->
                <div>
                  <span>合计优惠</span>
                  <span>-￥{{orderDetails.order.discountSum}}</span>
                </div>
                <div>
                  <span>运费</span>
                  <span>￥{{orderDetails.order.mallOrderFreight}}</span>
                </div>
                <div>
                  <span>实收金额</span>
                  <span>￥{{orderDetails.order.payAmountAll}}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="right-wrap">
              <div class="right-header" v-if="orderDetails.refundDTO.refundStatus == 1">
                <p class="right-header-title">等待商家处理退款申请</p>
                <p class="right-header-instructions">买家发起退款申请，等待商家处理</p>
                <div class="right-header-btns">
                  <el-button type="primary" size="small" style="width:98px;" @click="agreedRefundDialog = true">同意</el-button>
                  <el-button style="color:#409EFF;border-color:#409EFF;width:98px;" size="small" @click="closeRefundDialog = true">关闭</el-button>
                </div>
                <!--同意dialog-->
                <el-dialog title="同意退款" :visible.sync="agreedRefundDialog" width="464px">
                  <div class="dialog-content">
                    <div class="close-reason">申请金额</div>
                    <div class="close-reason-info">
                      ￥{{orderDetails.refundDTO.applyRefundPrice}}（实付金额￥{{orderDetails.orderItem.payAmount}}，积分{{orderDetails.orderItem.usePoints}}分）
                    </div>
                  </div>
                  <div class="dialog-content">
                    <div class="close-reason">邮费</div>
                    <div class="close-reason-info">
                      ￥{{orderDetails.orderItem.orderItemFreight}}
                    </div>
                  </div>
                  <div class="dialog-content">
                    <div class="close-reason">数量</div>
                    <div class="close-reason-info">
                      <el-select v-model="agreedRefundForm.orderItemNum" clearable placeholder="请选择" class="width-style">
                        <el-option
                          v-for="item in (orderDetails.orderItem.mallProNumber+1)"
                          :key="item-1"
                          :label="item-1"
                          :value="item-1">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="dialog-content">
                    <div class="close-reason">退款总额</div>
                    <div class="close-reason-info">
                      <el-input type="text" v-model.number="agreedRefundForm.refundTotal"  :placeholder="refundTotalMax" @input="refundTotalMaxDeal"></el-input>
                    </div>
                  </div>
                  <div class="dialog-content">
                    <div class="close-reason">退款金额</div>
                    <div class="close-reason-info">
                      <el-input type="text" v-model="agreedRefundForm.refundPrice" :placeholder="refundPriceMax" :disabled="true"></el-input>
                      <span style="margin-top:8px;color:#909399;display: inline-block"
                        v-show="agreedRefundForm.showMoney">
                        剩余￥{{agreedRefundForm.moreMoney}}折和{{agreedRefundForm.morePoint}}积分进行返还
                    </span>
                    </div>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="agreedRefundDialog = false">取 消</el-button>
                    <!-- <el-button type="primary" @click="agreedRefundDeal">确 定</el-button> -->
                    <el-button :disabled="confirmStatus" type="primary" @click="agreedRefundDeal">确 定</el-button>
                  </div>
                </el-dialog>
                <!--关闭dialog-->
                <el-dialog title="关闭退款" :visible.sync="closeRefundDialog" width="464px">
                  <div class="close-reason">关闭原因</div>
                  <div class="close-reason-info">
                    <el-input type="textarea" :rows="3" v-model="closeRefundForm.refundFailReason"></el-input>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="closeRefundDialog = false">取 消</el-button>
                    <el-button type="primary" @click="closeRefundDeal">确 定</el-button>
                  </div>
                </el-dialog>
              </div>
              <div class="right-header" v-else-if="orderDetails.refundDTO.refundStatus == 2">
                <p class="right-header-title">退款成功</p>
                <p class="right-header-instructions">商家退款成功，退回金额：￥{{orderDetails.refundDTO.refundPrice}}</p>
              </div>
              <div class="right-header" v-else-if="orderDetails.refundDTO.refundStatus == 3">
                <p class="right-header-title error-color">退款关闭</p>
                <!-- <p class="right-header-instructions">买家撤消退款申请</p> -->
              </div>

              <div class="right-body">
                <div class="right-title">
                  协商记录
                </div>
                <div v-for="(item,index) in consultationRecords" :key="index">
                  <div class="right-body-wrap" v-if="item.role === 1">
                    <div class="buyers-sell-title">
                      <span style="font-weight:600">买家</span>
                      <span>{{item.createTime | changeTimes}}</span>
                    </div>
                    <div>
                      <p>买家发起退款申请，等待商家处理</p>
                    </div>
                    <div>
                      <span class="prompt-info">退款原因</span>
                      <span style="margin-right:20px">{{item.refundReason}}</span>
                      <span class="prompt-info prompt-info-a">退款方式</span>
                      <span style="margin-right:20px">{{item.refundType | refundTypeName}}</span>
                      <span class="prompt-info prompt-info-a">退款金额</span>
                      <span>￥{{item.refundPrice}}</span>
                    </div>
                    <div class="">
                      <div class="prompt-info" style="width:60px">退款说明</div>
                      <p>{{item.description}}</p>

                    </div>
                    <div>
                      <img :src="itm" v-for="(itm,index) in (item.imgUrl?item.imgUrl.split(','):[])" :key="index" alt="" style="width:40px;height:40px;margin:0 8px 8px 0">
                    </div>
                  </div>
                  <div class="right-body-wrap" v-else>
                    <div class="buyers-sell-title">
                      <span style="font-weight:600">商家</span>
                      <span>{{item.createTime | changeTimes}}</span>
                    </div>
                    <div>
                      <p>{{item.msg}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import qs from 'qs';
  import getInputVal from '../../../../static/js/common.js';
  import request  from '../../../api/request.js'
  import copy  from '../../../../static/js/clone.js'
  import axios from 'axios'
  export default {
    data() {
      return {
        updateDom:false,
        order:{},
        orderRefundId:'',
        orderDetails:{},
        agreedRefundDialog:false,
        refundTotalMax:99999,
        refundTotalMaxLength:9,
        refundPriceMax:99999,
        agreedRefundForm:{
          refundPrice:'',
          refundPoints:'',
          refundFailReason:'',
          refundTotal:'',//退款金额
          orderItemNum:0,
          moreMoney:0,//剩余钱
          morePoint:0,//积分
          showMoney:false,
        },
        closeRefundDialog:false,
        pageUrl:'',//微信会员详情地址
        closeRefundForm:{
          refundFailReason:''
        },
        consultationRecords:[], // 协商记录

        confirmStatus:false,//退款确认按钮状态
      }
    },
    mounted() {

      this.consultationRecord();

    },
    created(){
       this.orderRefundId = this.$route.params.orderRefundId;
      this.getOrderDetails(this.orderRefundId);

    },

    computed: {

    },
    watch:{
      orderDetails:function(value){ // 监听orderDetails从接口拿到值后显示页面，不然会报错mallProImageUrl 找不到
        if(value !== {}){
          this.updateDom = true
        }
      }
    },
    methods: {
      getOrderDetails(orderId){
        let data = {
          orderRefundId: orderId,
          requestProject:'mall'
        }
        request.get('/api-mall/get-mall-order-refund-detail',{params:data}).then(res => {
          if(res.data.errorCode === 0){
            this.orderDetails = res.data.result;
            this.agreedRefundForm.refundPrice = this.orderDetails.orderItem.payAmount + this.orderDetails.refundDTO.orderItemFreight;
            this.refundTotalMax = '最多可退￥' + this.orderDetails.refundDTO.maxRefundPrice;
            this.refundTotalMaxLength = ('' + this.orderDetails.refundDTO.maxRefundPrice).length;
            this.refundPriceMax = '最多可退￥' + (this.orderDetails.refundDTO.payAmount + this.orderDetails.refundDTO.orderItemFreight);

            this.pageUrl = window.location.origin+'/member/#/wechatmemberDetail?memberId='+this.orderDetails.refundDTO.memberId
          }else{
            this.$message.error(res.data.message);
          }
        })
      },
      //物流信息

      // 限制最大退款金额
      refundTotalMaxDeal(value){
        var reg = /[1-9]\d*.\d*|0.\d*[1-9]\d*/;
        // if(!reg.test(Number(this.agreedRefundForm.refundTotal))&&){
        //   this.$message.error("请输入数字")
        //   return false
        // }else{
          //this.agreedRefundForm.refundTotal退款总额
          if(this.agreedRefundForm.refundTotal>= this.orderDetails.refundDTO.maxRefundPrice){
            this.$nextTick(()=>{
              this.agreedRefundForm.refundTotal = this.orderDetails.refundDTO.maxRefundPrice;
              if(this.agreedRefundForm.refundTotal>=(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)){
                this.agreedRefundForm.showMoney=true
                this.agreedRefundForm.refundPrice=(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)
                this.agreedRefundForm.moreMoney=(this.agreedRefundForm.refundTotal-(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)).toFixed(2)
                if(this.agreedRefundForm.moreMoney==0){
                  this.agreedRefundForm.showMoney=false
                  this.agreedRefundForm.morePoint=0
                }else{
                  // 积分=最大积分*[(退款总额-实际付款金额)/(最大可退金额-实际付款金额])
                    //退款总额-实际付款金额
                   let money1=this.agreedRefundForm.refundTotal-(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)
                   //最大可退金额-实际付款金额
                    let money2=this.orderDetails.refundDTO.maxRefundPrice-(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)
                    this.agreedRefundForm.morePoint=parseInt(this.orderDetails.orderItem.usePoints*(money1/money2))
                }



              }else{
                this.agreedRefundForm.showMoney=false
                this.agreedRefundForm.refundPrice=this.agreedRefundForm.refundTotal

              }

            })

          }else{//小于的情况下
            if(this.agreedRefundForm.refundTotal>=(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)){
                this.agreedRefundForm.showMoney=true
                this.agreedRefundForm.refundPrice=(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)
                this.agreedRefundForm.moreMoney=(this.agreedRefundForm.refundTotal-(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)).toFixed(2)

             // 积分=最大积分*[(退款总额-实际付款金额)/(最大可退金额-实际付款金额])
                //退款总额-实际付款金额
                 let money1=this.agreedRefundForm.refundTotal-(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)
                 //最大可退金额-实际付款金额
                  let money2=this.orderDetails.refundDTO.maxRefundPrice-(this.orderDetails.orderItem.payAmount+this.orderDetails.orderItem.orderItemFreight)
                  this.agreedRefundForm.morePoint=parseInt(this.orderDetails.orderItem.usePoints*(money1/money2))

              }else{
                this.agreedRefundForm.showMoney=false
                this.agreedRefundForm.refundPrice=this.agreedRefundForm.refundTotal

              }
          }


        // }




      },

      // 同意退款确认
      agreedRefundDeal(){
        this.confirmStatus=true//确认按钮状态
        let data = {
          orderRefundId: this.orderRefundId,
          refundStatus:2,
          orderItemNum:this.agreedRefundForm.orderItemNum,
          refundPrice:this.agreedRefundForm.refundPrice,
          refundPoints:this.agreedRefundForm.morePoint,
          refundFailReason:this.agreedRefundForm.refundFailReason,
          requestProject:'mall',
          token:this.orderDetails.token
        };
        request.post('/api-mall/do-mall-order-refund',qs.stringify(data)).then(res => {
          if(res.data.errorCode == 0){
            this.$message({
              message: res.data.message,
              type: 'success'
            });
            this.agreedRefundDialog = false;
            this.confirmStatus=false//确认按钮状态
            // 更新页面
            this.getOrderDetails(this.orderDetails.refundDTO.orderRefundId);
            this.consultationRecord();
          }else{
            this.$message.error(res.data.message)
          }
        })

      },
      // 关闭退款确认
      closeRefundDeal(){
        if(this.closeRefundForm.refundFailReason == ''){
          this.$message.error('请填写关闭原因！');
          return;
        }
        let data = {
          orderRefundId: this.orderRefundId,
          refundStatus:3,
          orderItemNum:0,
          refundPrice:0,
          refundPoints:0,
          refundFailReason:this.closeRefundForm.refundFailReason,
          requestProject:'mall',
          token:this.orderDetails.token
        };
        request.post('/api-mall/do-mall-order-refund',qs.stringify(data)).then(res => {
          if(res.data.errorCode == 0){
            this.$message({
              message: res.data.message,
              type: 'success'
            });
            this.closeRefundDialog = false;
            // 更新页面
            this.getOrderDetails(this.orderDetails.refundDTO.orderRefundId);
            this.consultationRecord();
          }else{
            this.$message.error(res.data.message);
          }
        })
      },
      // 协商记录列表
      consultationRecord(){
        let data = {
          orderRefundId: this.orderRefundId,
          requestProject:'mall'
        };
        request.get('/api-mall/find_refund_consult_record',{params:data}).then(res => {
          if(res.data.errorCode == 0){
            this.consultationRecords = res.data.result;
          }else{
            this.$message.error(res.data.message);
          }
        })
      },
      // 跳转到订单详情
      goOrderDetail(orderId){
        this.$router.push({
          name: 'orderDetails',
          params: { orderId: orderId }
        })
      }
    },
    filters:{
      changeTimes: function (value){ //时间戳转化为 yyyy-yy-yy 00:00:00格式
        var date = new Date(value);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
        return Y+M+D+h+m+s;
      },
      refundTypeName:function(value){
        let typename = '';
        if(value == 1){
          typename = '仅退款'
        }else if(value == 2){
          typename = '退货退款'
        }
        return typename;
      }
    },
    components:{

    }
  }
</script>

<style scoped>
  .bread-container{
    background: #fff;
  }
  .mall-content-title h3{
    padding:24px 0 0 0;
  }
  .mall-section{
    margin:24px;
    background-color:#fff;
    padding-top:14px;
  }
  /*头部进度start*/
  .progress-wrap{
    height:116px;
    margin:0px 10px 0px 15px;
    border-bottom:1px solid #EBEEF5;
    margin-bottom:14px;
    display:flex;
    justify-content:center;
    align-items:center;
  }
  .progress-info{
    text-align:center;
    position:relative;
    margin-right:12px;
    margin-left:12px;
    color:#BBC2CB;
  }
  .progress-wrap .progress-infoed{
    color:#303133;
  }
  .progress-info>div:nth-child(1){
    /*width:64px;*/
    font-size:13px;
  }
  .progress-info-time{
    position:absolute;
    font-size:13px;
    top:24px;
    left: -36%;
    text-align:center;
    white-space: nowrap;
  }
  .progress-info .progress-info-time-left{
    left: -12%;
  }
  .progress-info .progress-info-time-left-b{
    left: -65%;
  }
  .progress-no{
    display: flex;
    align-items: center;
  }
  .progress-no div{
    width:8px;
    height:8px;
    background-color:#BBC2CB;
    border-radius:50%;
    margin-right:6px;
    transform: scale(0.5);
    /*因为直接设置4px的圆点看着有点方，所以用了缩放*/
  }
  .progress-ing{
    display: flex;
    align-items: center;
  }
  .progress-ing div{
    width:8px;
    height:8px;
    background-color:#BBC2CB;
    border-radius:50%;
    margin-right:6px;
    transform: scale(0.5);
  }
  .progress-ing div:nth-child(-n+7){
    background-color:#67C23A;
  }
  .progress-ed{
    display: flex;
    align-items: center;
  }
  .progress-ed div{
    width:8px;
    height:8px;
    background-color:#BBC2CB;
    border-radius:50%;
    margin-right:6px;
    transform: scale(0.5);
  }
  .progress-ed div:nth-child(n){
    background-color:#67C23A;
  }
  i{
    color:#BBC2CB;
  }
  .progress-ed i{
    color:#67C23A;
  }
  /*订单详情左下 start*/
  .left-wrap{
    border-right:1px solid #EBEEF5;
    padding-left:10px;
    padding-bottom:10px;
  }
  .left-header{
    height:48px;
    line-height:48px;
    color:#303133;
    font-size:13px;
    padding-left:15px;
    background-color:rgba(241,243,247,1);
  }
  .goods-info{
    height:100%;
    display:flex;
    border-bottom:1px solid #EBEEF5;
    margin-right:14px;
  }
  .goods-info > div{
    margin: 14px 0px;
  }
  .goods-info .goods-text{
    margin-left:18px;
    font-size:13px;
    color:#303133;
  }
  .goods-text{
    display:flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .goods-text-info{
    color:#909399;
    font-size:12px;
  }
  .goods-text-info div:first-child{
    margin-bottom:4px;
  }
  .imgs-style{
    width:62px;
    height:62px;
    border: 1px solid rgba(241,243,247,1);
    border-radius: 5px;
  }
  .left-list-info>div{
    margin-top:11px;
  }
  .left-list-info>div>span:nth-child(1){
    display:inline-block;
    color:#909399;
    font-size:13px;
    width:60px;
    text-align:right;
    margin-right:20px;
  }
  .left-list-info>div>span:nth-child(2){
    font-size:13px;
  }
  .refund-reason{
    padding-bottom:11px;
    margin-right:14px;
    border-bottom:1px solid #EBEEF5;
  }
  /*详情右下角 start*/
  .right-wrap{
    padding:14px;
  }
  .right-header{
    height:200px;
    border-bottom:1px solid #EBEEF5;
    padding-left:90px;
  }
  .right-header-title{
    font-size:18px;
    color:#409EFF;
    margin:36px 0px 12px 0px;
  }
  .right-header .error-color{
    color:#FF4040;
  }
  .right-header-instructions{
    font-size:13px;
    color:#606266;
  }
  .right-header-btns{
    margin-top:40px;
  }
  .dialog-content{
    margin-bottom:12px;
    display: flex;
    align-items: center;
  }
  .close-reason{
    display:inline-block;
    vertical-align: top;
    width:60px;
    text-align:right;
    font-size:13px;
    color:#606266;
    margin-right:12px;
  }
  .close-reason-info{
    display:inline-block;
    width:338px;
  }
  .width-style{
    width:100%;
  }
  /*右下角body start*/
  .right-body{
    padding:24px 0px 12px 20px;
  }
  .right-body .right-title{
    border-left:3px solid #409EFF;
    padding-left:5px;
    font-size:14px;
  }
  .right-body > div{
    font-size:13px;
  }
  .right-body-wrap > div{
    margin-top:14px;
  }
  .buyers-sell-title{
    position:relative;
  }
  .buyers-sell-title span:nth-child(1){
    color:#333;
  }
  .buyers-sell-title span:nth-child(2){
   /* position:absolute;
    right:12px;*/
    color:#BBC2CB;
    margin-left:30px;
  }
  .prompt-info{
    display:inline-block;
    margin-right:10px;
    color:#BBC2CB;
  }
  .prompt-info-a {
    margin-left:14px;
  }
  .refund-info{
    display:flex;
  }
  .a-link{
    color:#5092e1;
    cursor: pointer;
  }
  .a-link:hover{
    color:#1e6cd5;
  }
</style>
