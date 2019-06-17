<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>商城设置</el-breadcrumb-item>
          <el-breadcrumb-item>数据精度</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>数据精度</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="set-content">
          <el-form :model="setForm" ref="setForm" label-width="80px" class="demo-ruleForm" label-position="right">
            <div class="title-tip">
              <i class="el-icon-info"></i>
              <span>若数据精度设置为整数，则订单中金额相关的数据精度都是四舍五入为整数。请谨慎设置或修改！</span>
            </div>
            <el-form-item label="数据精度">
              <template>
                <el-radio-group v-model="setForm.mallScale">
                  <el-radio :label="0">2位小数</el-radio>
                  <el-radio :label="1">整数</el-radio>
                  <!--  <el-tooltip
                    class="item-tooltip"
                    effect="dark"
                    content="若数据精度为整数，则订单中金额相关的数据精度都是整数。请谨慎设置或修改！"
                    placement="top-start">
                    <i class="iconfont icon-xinxixianshi"></i>
                  </el-tooltip> -->
                </el-radio-group>
                <span style="display:none">{{ refash }}</span>
              </template>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('setForm')">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../../api/request.js';

export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      setForm: {
        mallScale: 0
      },
      refash: false
    };
  },
  created() {
    this.getMess();
  },

  computed: {},
  methods: {
    getMess() {
      request.post('/api-mall/mall_advanced_setting').then(res => {
        if (res.data.errorCode === 0) {
          this.setForm.mallScale = res.data.result.mallScale;
          this.refash = !this.refash;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    onSubmit(setForm) {
      let params = {
        scaleType: this.setForm.mallScale
      };
      this.$refs[setForm].validate(valid => {
        if (valid) {
          request.post('/api-mall/update-order-scale', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('保存成功');
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
.set-content {
  background: #fff;
  padding: 24px 32px;
}
.icon-xinxixianshi {
  font-size: 14px;
  color: #909399;
  cursor: pointer;
  vertical-align: middle;
  margin-left: 5px;
}
/*提示*/
.title-tip {
  width: 100%;
  height: 34px;
  line-height: 34px;
  border: 1px solid rgba(145, 213, 255, 1);
  background: #e6f7ff;
  border-radius: 4px;
  margin-bottom: 22px;
}
.title-tip .el-icon-info {
  color: #1890ff;
  margin-left: 17px;
}
.title-tip span {
  color: #606266;
  font-size: 14px;
}
.tip-text {
  color: #606266;
  font-size: 14px;
}
</style>
