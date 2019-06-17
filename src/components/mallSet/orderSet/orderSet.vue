<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title" style="position:relative;border:none">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>商城设置</el-breadcrumb-item>
          <el-breadcrumb-item>订单设置</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>订单设置</span>
        </h3>
      </div>
      <div class="mall-section">
        <el-tabs v-model="activeName" class="bread-content">
          <el-tab-pane label="基础设置" name="first">
            <div style="height:25px;background:#f5f7fa;"></div>
            <div class="tab-content">
              <BasicSet></BasicSet>
            </div>
          </el-tab-pane>
          <el-tab-pane label="发货设置" name="second">
            <div style="height:25px;background:#f5f7fa;"></div>
            <TemplateSet></TemplateSet>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import BasicSet from './basisSet.vue';
import TemplateSet from './templateSet.vue';

export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      length: 0,
      activeName: 'first' //tab导航当前选中的
    };
  },
  mounted() {
    if (window.localStorage.getItem('tabName')) {
      this.activeName = window.localStorage.getItem('tabName');
    }
    window.localStorage.removeItem('tabName');
  },
  computed: {},
  methods: {},
  components: {
    BasicSet,
    TemplateSet
  }
};
</script>

<style scoped>
.bread-container {
  background: #fff;
}
.mall-content-title h3 {
  padding: 24px 0 0 0;
}
.tab-content {
  background: #fff;
  margin: 0 24px;
  padding: 24px 32px;
}
</style>
