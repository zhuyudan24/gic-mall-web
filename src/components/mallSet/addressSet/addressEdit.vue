<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>商城设置</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/addressList' }">地址库</el-breadcrumb-item>
          <el-breadcrumb-item>{{ titleName }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>{{ titleName }}</span>
        </h3>
      </div>
      <div class="mall-section">
        <el-form :model="addressForm" :rules="addressRules" ref="addressForm" label-width="90px" class="demo-ruleForm" label-position="right">
          <el-form-item label="地址类型">
            <template>
              <el-radio v-model="addressForm.addressType" :label="2">退货地址</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="是否默认">
            <template>
              <el-switch v-model="addressForm.ifDefault" :disabled="defaultAddress"></el-switch>
            </template>
          </el-form-item>
          <el-form-item label="联系人" prop="contactName">
            <el-input v-model="addressForm.contactName" type="text" class="w-492" @input="value => contactNameLimit(value)">
              <span slot="suffix">{{ contactNameLen }}/20</span>
            </el-input>
          </el-form-item>
          <el-form-item label="座机">
            <el-col class="inline-item">
              <el-form-item prop="areaNumber">
                <el-input type="number" v-model="addressForm.areaNumber" placeholder="请填写区号" @input="value => areaNumberLimit(value)"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" style="width:20px;text-align:center">-</el-col>
            <el-col class="inline-item">
              <el-form-item prop="seatMachine">
                <el-input type="number" v-model="addressForm.seatMachine" placeholder="请填写座机号" @input="value => seatMachineLimit(value)"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" style="width:20px;text-align:center">-</el-col>
            <el-col class="inline-item">
              <el-form-item prop="extension">
                <el-input type="number" v-model="addressForm.extension" placeholder="请填写分机号" @input="value => extensionLimit(value)"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="手机" prop="contactPhone">
            <el-input v-model="addressForm.contactPhone" type="number" class="w-492"></el-input>
          </el-form-item>
          <el-form-item label="所在地区" required :class="{ 'is-error': addressError }">
            <vue-area-ab :areaOptions="areaOptions" @selected="selected"></vue-area-ab>
            <p class="address-error" v-show="addressError">请选择所在地区</p>
          </el-form-item>

          <el-form-item label="详细地址" prop="allAddress" style="position:relative;margin-bottom:32px">
            <el-input v-model="addressForm.allAddress" type="textarea" :rows="4" class="w-492" placeholder="请不要重复输入省市区" @input="value => allAddressLimit(value)"></el-input>
            <p class="num-textarea">{{ allAddressLen }}/50</p>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('addressForm')">保 存</el-button>
            <el-button @click="resetForm('addressForm')">返 回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import getInputVal from '../../../../static/js/common.js';
import request from '../../../api/request.js';
export default {
  data() {
    let contactPhoneValidator = (rule, value, callback) => {
      let reg = /^1[34578]\d{9}$/;
      if (value !== '') {
        if (!reg.test(value)) {
          callback(new Error('手机号码不符合规则'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let seatMachineValidator = (rule, value, callback) => {
      let regNum = /^[0-9]*$/;
      if (value !== '') {
        if (!regNum.test(value)) {
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let areaNumberValidator = (rule, value, callback) => {
      let regNum = /^[0-9]*$/;
      if (value !== '') {
        if (!regNum.test(value)) {
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let extensionValidator = (rule, value, callback) => {
      let regNum = /^[0-9]*$/;
      if (value !== '') {
        if (!regNum.test(value)) {
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      getTime: getInputVal.getTime,
      getSeconds: getInputVal.getSeconds,
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      addressForm: {
        addressType: 2, //地址类型
        contactName: '', //联系人
        contactPhone: '', //手机
        allAddress: '', //详细地址
        ifDefault: false, //是否默认
        areaNumber: '', //区号
        seatMachine: '', //座机号
        extension: '' //分机号
      },
      areaOptions: {
        provinceName: '',
        provinceId: '',
        cityName: '',
        cityId: '',
        countryName: '',
        countyId: ''
      },
      areaOptionsNew: {},
      contactNameLen: 0,
      allAddressLen: 0,
      addressRules: {
        contactName: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        contactPhone: [{ validator: contactPhoneValidator, trigger: 'blur' }],
        allAddress: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
        seatMachine: [{ validator: seatMachineValidator, trigger: 'blur' }],
        areaNumber: [{ validator: areaNumberValidator, trigger: 'blur' }],
        extension: [{ validator: extensionValidator, trigger: 'blur' }]
      },
      addressError: false,
      sellerAddressId: '', //地址id
      titleName: '',
      addressItem: {},
      defaultAddress: false
    };
  },
  created() {
    this.sellerAddressId = this.$route.params.sellerAddressId;
    if (this.sellerAddressId !== '-1') {
      this.titleName = '编辑地址';
      this.getMess();
    } else {
      this.titleName = '新建地址';
    }
  },

  computed: {},
  methods: {
    //获取地址库信息
    getMess() {
      // let params = {
      //   sellerAddressId: this.sellerAddressId
      // };
      // request.post('/api-mall/seller/address',qs.stringify(params)).then(res => {
      request.get('/api-mall/seller/address/' + this.sellerAddressId).then(res => {
        if (res.data.errorCode === 0) {
          let editData = res.data.result;
          this.addressForm.contactName = editData.contactName;
          this.contactNameLen = getInputVal.getZhLen(this.addressForm.contactName);
          this.addressForm.contactPhone = editData.contactPhone;
          this.addressForm.addressType = editData.addressType;
          this.areaOptionsNew.provinceName = editData.provinceName;
          this.areaOptionsNew.provinceId = editData.provinceId;
          this.areaOptionsNew.cityId = editData.cityId;
          this.areaOptionsNew.cityName = editData.cityName;
          this.areaOptionsNew.countyId = editData.areaId;
          this.areaOptionsNew.countryName = editData.areaName;
          this.addressItem = this.areaOptionsNew;
          this.areaOptions = this.areaOptionsNew;
          if (editData.ifDefault === 1) {
            this.addressForm.ifDefault = true;
            this.defaultAddress = true;
          } else {
            this.addressForm.ifDefault = false;
            this.defaultAddress = false;
          }

          this.addressForm.areaNumber = editData.areaNumber;
          this.addressForm.seatMachine = editData.seatMachine;
          this.addressForm.extension = editData.extension;

          this.addressForm.allAddress = editData.addressDetail;
          this.allAddressLen = getInputVal.getZhLen(this.addressForm.allAddress);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //联系人字数限制
    contactNameLimit(value) {
      this.$nextTick(() => {
        this.addressForm.contactName = getInputVal.getInputVal(value, 20);
        this.contactNameLen = getInputVal.getZhLen(this.addressForm.contactName);
      });
    },
    // 详细地址字数限制
    allAddressLimit(value) {
      this.$nextTick(() => {
        this.addressForm.allAddress = getInputVal.getInputVal(value, 50);
        this.allAddressLen = getInputVal.getZhLen(this.addressForm.allAddress);
      });
    },
    // 区号字数限制
    areaNumberLimit(value) {
      this.$nextTick(() => {
        this.addressForm.areaNumber = getInputVal.getInputVal(value, 5);
      });
    },
    // 座机号字数限制
    seatMachineLimit(value) {
      this.$nextTick(() => {
        this.addressForm.seatMachine = getInputVal.getInputVal(value, 5);
      });
    },
    //分机号字数限制
    extensionLimit(value) {
      this.$nextTick(() => {
        this.addressForm.extension = getInputVal.getInputVal(value, 5);
      });
    },
    // 省市区选择后返回的参数,目前可传进去字段一致
    selected(val) {
      this.addressItem.provinceName = val.provinceName;
      this.addressItem.provinceId = val.provience;
      this.addressItem.cityId = val.city;
      this.addressItem.cityName = val.cityName;
      this.addressItem.countyId = val.country;
      this.addressItem.countryName = val.countryName;
      if (this.addressItem.provienceName !== '' && this.addressItem.cityName !== '' && this.addressItem.countryName !== '') {
        this.addressError = false;
      }
    },
    submitForm(addressForm) {
      this.$refs[addressForm].validate(valid => {
        if (this.addressItem.countyId !== '' && this.addressItem.countyId) {
          this.addressError = false;
        } else {
          this.addressError = true;
          return false;
        }
        if (valid) {
          let params = {
            operatorType: this.operatorType,
            contactName: this.addressForm.contactName.trim(),
            contactPhone: this.addressForm.contactPhone,
            addressType: this.addressForm.addressType,
            ifDefault: this.addressForm.ifDefault ? 1 : 0,
            areaNumber: this.addressForm.areaNumber,
            seatMachine: this.addressForm.seatMachine,
            extension: this.addressForm.extension,

            provinceId: this.addressItem.provinceId,
            provinceName: this.addressItem.provinceName,
            cityId: this.addressItem.cityId,
            cityName: this.addressItem.cityName,
            areaId: this.addressItem.countyId,
            areaName: this.addressItem.countryName,
            addressDetail: this.addressForm.allAddress.trim()
          };
          if (this.sellerAddressId !== '-1') {
            //编辑保存
            params.operatorType = 2;
            params.sellerAddressId = this.sellerAddressId;
          } else {
            //新建保存
            params.operatorType = 1;
          }
          request.post('/api-mall/seller/save_update', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('保存成功!');
              this.$router.push({ name: 'addressList' });
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(addressForm) {
      this.$refs[addressForm].resetFields();
      this.$router.push({ name: 'addressList' });
    }
  },
  components: {}
};
</script>
<style scoped>
.operate-top {
  height: 40px;
}
.mall-section {
  margin: 24px;
  padding: 24px 32px;
  background: #fff;
}
.w-492 {
  width: 492px;
}
.inline-item {
  display: inline-block;
  width: 151px;
}
.num-textarea {
  position: absolute;
  left: 463px;
  bottom: -20px;
  line-height: 14px;
  color: #c0c4cc;
  font-size: 14px;
}
.address-error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
}
</style>
