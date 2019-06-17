<template>
  <div class="set-content">
    <el-form :model="setForm" :rules="setRules" ref="setForm" label-width="120px" class="demo-ruleForm" label-position="right">
      <el-form-item label="自动关闭订单">
        <el-switch v-model="setForm.autoClose"></el-switch>
      </el-form-item>
      <el-form-item label="" v-if="setForm.autoClose">
        <el-select v-model="setForm.openTime" placeholder="请选择活动区域">
          <el-option label="12小时未付款自动关闭" :value="720"></el-option>
          <el-option label="24小时未付款自动关闭" :value="1440"></el-option>
          <el-option label="36小时未付款自动关闭" :value="2160"></el-option>
          <el-option label="48小时未付款自动关闭" :value="2880"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自动确认收货">
        <el-switch v-model="setForm.autoConfirm"></el-switch>
      </el-form-item>
      <el-form-item label="" v-if="setForm.autoConfirm">
        <span>发货</span>
        <el-select v-model="setForm.takeGoodsTime" placeholder="">
          <el-option label="7天后" :value="7"></el-option>
          <el-option label="15天后" :value="15"></el-option>
          <el-option label="30天后" :value="30"></el-option>
        </el-select>
        <span>自动确认</span>
      </el-form-item>
      <el-form-item label="订单提醒">
        <el-switch v-model="setForm.payReminder"></el-switch>
      </el-form-item>
      <el-form-item label="催付提醒" v-if="setForm.payReminder">
        <el-radio-group v-model="setForm.payReminderType" @change="changePayReminderType">
          <el-radio label="1">
            <span>下单</span>
            <el-select v-model="setForm.paymentTime" placeholder="请选择" style="width:220px">
              <el-option label="30分钟" :value="30"></el-option>
              <el-option label="1个小时" :value="60"></el-option>
              <el-option label="2个小时" :value="120"></el-option>
              <el-option label="3个小时" :value="180"></el-option>
              <el-option label="4个小时" :value="240"></el-option>
              <el-option label="5个小时" :value="300"></el-option>
              <el-option label="6个小时" :value="360"></el-option>
            </el-select>
            <span>未付款</span>
          </el-radio>
          <div style="height:22px"></div>
          <el-radio label="2">
            <span>每天</span>
            <el-time-select
              v-model="setForm.dayTime"
              :picker-options="{
                start: '00:15',
                step: '00:15',
                end: '24:00'
              }"
              placeholder="选择时间"
              style="width:220px"
            >
            </el-time-select>
            <span>未付款</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发货提醒">
        <el-switch v-model="setForm.deliverReminder"></el-switch>
      </el-form-item>
      <el-form-item label="自动同意退货">
        <el-switch v-model="setForm.autoRefundGoods"></el-switch>
        <p style="font-size: 12px;color: rgb(144, 147, 153);">开启自动同意退货后，买家若申请退货退款，则默认同意买家的退货申请并将默认的退货地址发送给买家</p>
      </el-form-item>
      <el-form-item label="售后申请时长">
        <el-select v-model="setForm.afterSaleTime" placeholder="请选择" style="width:220px">
          <el-option label="7天内" :value="7"></el-option>
          <el-option label="15天内" :value="15"></el-option>
          <el-option label="30天内" :value="30"></el-option>
        </el-select>
        <p style="font-size: 12px;color: rgb(144, 147, 153);">可设置自订单交易完成后，买家可申请售后的时间截止时长</p>
      </el-form-item>
      <el-form-item label="售后服务说明" style="margin-bottom:0px">
        <el-input type="textarea" v-model="setForm.afterSaleServiceText" rows="5" style="width:600px" @input="value => limitServiceText(value)"></el-input>
        <div style="font-size:12px;color:#909399;width:600px;margin-top:-5px">
          <span style="float:right;">{{ limitLen }}/2000</span>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('setForm')">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import qs from 'qs';
import getInputVal from '../../../../static/js/common.js';
import request from '../../../api/request.js';
export default {
  data() {
    return {
      setForm: {
        autoClose: true,
        openTime: '',
        autoConfirm: true,
        takeGoodsTime: '',
        afterSaleServiceText: '',
        payReminder: true,
        payReminderType: '1',
        afterSaleTime: 15,
        paymentTime: '',
        dayTime: '',
        deliverReminder: true,
        autoRefundGoods: false
      },
      limitLen: 0,
      setRules: {}
    };
  },

  mounted() {
    this.getMessage();
  },

  methods: {
    // 字符限制
    limitServiceText: function(value) {
      this.$nextTick(() => {
        this.setForm.afterSaleServiceText = getInputVal.getInputVal(value, 2000);
        this.limitLen = getInputVal.getZhLen(this.setForm.afterSaleServiceText.trim());
      });
    },
    getMessage() {
      request.post('/api-mall/get_order_setting').then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.autoClose) {
            if (res.data.result.autoClose === 0) {
              //自动关闭订单
              this.setForm.autoClose = false;
              this.setForm.openTime = 720;
            } else {
              this.setForm.autoClose = true;
              this.setForm.openTime = res.data.result.autoClose;
            }
          } else {
            this.setForm.autoClose = false; //自动关闭订单
            this.setForm.openTime = 720; //自动关闭订单
          }

          if (res.data.result.autoConfirm) {
            //自动确认收货
            if (res.data.result.autoConfirm === 0) {
              //自动确认收货
              this.setForm.autoConfirm = false;
              this.setForm.takeGoodsTime = 7;
            } else {
              this.setForm.autoConfirm = true;
              this.setForm.takeGoodsTime = res.data.result.autoConfirm;
            }
          } else {
            this.setForm.autoConfirm = false;
            this.setForm.takeGoodsTime = 7;
          }

          if (res.data.result.afterSaleServiceText) {
            this.setForm.afterSaleServiceText = res.data.result.afterSaleServiceText; //售后服务说明、
            this.limitLen = getInputVal.getZhLen(this.setForm.afterSaleServiceText.trim());
          } else {
            this.setForm.afterSaleServiceText = '';
          }

          if (res.data.result.payReminderType) {
            this.setForm.payReminderType = String(res.data.result.payReminderType);
          }
          if (res.data.result.payReminder) {
            if (res.data.result.payReminder === 0) {
              //订单提醒
              this.setForm.payReminder = false;
              if (res.data.result.payReminderType === 1) {
                //下单
                this.setForm.paymentTime = 30;
                this.setForm.dayTime = '';
              } else {
                this.setForm.paymentTime = '';
                this.setForm.dayTime = '00:15';
              }
            } else {
              this.setForm.payReminder = true;
              if (res.data.result.payReminderType === 1) {
                this.setForm.paymentTime = res.data.result.payReminderDelay;
                this.setForm.dayTime = '';
              } else {
                // this.setForm.payReminderDelay=this.setForm.dayTime
                this.setForm.dayTime = res.data.result.payReminderTime;
                this.setForm.paymentTime = '';
              }
            }
          } else {
            this.setForm.payReminder = false;
            this.setForm.paymentTime = 30;
          }

          if (res.data.result.deliverReminder === 0) {
            if (res.data.result.deliverReminder === 0) {
              this.setForm.deliverReminder = false;
            } else {
              this.setForm.deliverReminder = true;
            }
          }
          if (res.data.result.autoRefundGoods === 0) {
            this.setForm.autoRefundGoods = false;
          } else if (res.data.result.autoRefundGoods === 1) {
            this.setForm.autoRefundGoods = true;
          }
          this.setForm.afterSaleTime = res.data.result.afterSaleTime;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 催付提醒
    changePayReminderType(val) {
      if (val == 1) {
        this.setForm.paymentTime = 30;
        this.setForm.dayTime = '';
      } else if (val == 2) {
        this.setForm.dayTime = '00:15';
        this.setForm.paymentTime = '';
      }
    },
    // 保存更新
    onSubmit() {
      let params = {
        autoClose: this.setForm.autoClose ? this.setForm.openTime : '0', //关闭订单//关闭订单启用时间
        autoConfirm: this.setForm.autoConfirm ? this.setForm.takeGoodsTime : '0', //自动确认收货时间
        afterSaleServiceText: this.setForm.afterSaleServiceText, //售后服务说明
        payReminder: this.setForm.payReminder ? '1' : '0',
        payReminderType: this.setForm.payReminderType, //订单提醒的状态
        payReminderDelay: this.setForm.payReminderType === '1' ? this.setForm.paymentTime : '', //催付下单提醒的时间
        payReminderTime: this.setForm.payReminderType === '2' ? this.setForm.dayTime : '', //催付下单每天的时间
        deliverReminder: this.setForm.deliverReminder ? '1' : '0', //发货提醒
        autoRefundGoods: this.setForm.autoRefundGoods ? 1 : 0,
        afterSaleTime: this.setForm.afterSaleTime
      };
      request.post('/api-mall/update_order_setting', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('保存成功');
          this.getMessage();
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>
<style scoped></style>
