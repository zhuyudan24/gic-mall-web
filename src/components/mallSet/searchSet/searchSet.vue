<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>商城设置</el-breadcrumb-item>
          <el-breadcrumb-item>搜索设置</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>搜索设置</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="common-content">
          <el-form :model="mallForm" :rules="mallRules" ref="mallForm" label-width="120px">
            <el-form-item label="搜索框默认值" prop="defaultKeyword">
              <el-input v-model="mallForm.defaultKeyword" style="width:600px" @input="value => defaultWordLimit(value)">
                <span slot="suffix" style="margin-left:5px">{{ mallFormLen.defaultWordLen }}/20</span>
              </el-input>
            </el-form-item>
            <el-form-item label="热门搜索词" prop="hotKeyword" style="width:720px">
              <span style="font-size: 12px;color: rgb(144, 147, 153);">多个搜索词之间以“#”隔开，默认第一个不能是“#”</span>
              <el-input type="textarea" v-model="mallForm.hotKeyword" rows="5" style="width:600px" @input="value => hotWordLimit(value)"> </el-input>
              <div style="font-size:12px;color:#c0c4cc;position:absolute;right:0px;bottom:-30px">
                <span style="float:right;">{{ mallFormLen.hotWordLen }}/200</span>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('mallForm')">保 存</el-button>
            </el-form-item>
          </el-form>
        </div>
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
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      mallForm: {
        defaultKeyword: '',
        hotKeyword: ''
      },
      mallFormLen: {
        defaultWordLen: 0,
        hotWordLen: 0
      },
      mallRules: {
        defaultKeyword: [{ required: true, message: '请输入搜索框默认值', trigger: 'blur' }],
        hotKeyword: [{ required: true, message: '热门搜索词', trigger: 'blur' }]
      }
    };
  },
  mounted() {
    this.getMessage();
  },
  computed: {},
  methods: {
    defaultWordLimit(value) {
      this.$nextTick(() => {
        this.mallForm.defaultKeyword = getInputVal.getInputVal(value, 20);
        this.mallFormLen.defaultWordLen = getInputVal.getZhLen(this.mallForm.defaultKeyword);
      });
    },
    hotWordLimit(value) {
      this.$nextTick(() => {
        this.mallForm.hotKeyword = getInputVal.getInputVal(value, 200);
        this.mallFormLen.hotWordLen = getInputVal.getZhLen(this.mallForm.hotKeyword);
      });
    },
    //查询高级设置
    getMessage() {
      request.post('/api-mall/get_hot_word').then(res => {
        if (res.data.errorCode === 0) {
          this.mallForm = res.data.result;
          if (res.data.result) {
            this.mallFormLen.defaultWordLen = getInputVal.getZhLen(this.mallForm.defaultKeyword);
            this.mallFormLen.hotWordLen = getInputVal.getZhLen(this.mallForm.hotKeyword);
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    onSubmit(mallForm) {
      if (this.mallForm.hotKeyword.substr(0, 1) === '#') {
        this.mallForm.hotKeyword = this.mallForm.hotKeyword.substr(1);
      }
      this.$refs[mallForm].validate(valid => {
        if (valid) {
          let params = {
            defaultKeyword: this.mallForm.defaultKeyword,
            hotKeyword: this.mallForm.hotKeyword
          };
          request.post('/api-mall/update_hot_word', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('设置成功');
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  components: {}
};
</script>

<style scoped>
.mall-section {
  margin: 24px;
}
.common-content {
  background: #fff;
  padding: 24px 32px;
}
</style>
