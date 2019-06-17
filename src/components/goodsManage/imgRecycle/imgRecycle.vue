<template>
  <div class="container">
    <vue-gic-header :projectName="projectName" :collapseFlag="collapseFlag" @collapseTag="collapseTag" @toRouterView="toRouterView"></vue-gic-header>
    <div class="mall-content-container">
      <div class="goods-manege-content">
        <!-- 右侧页面部分 start-->
        <router-view> </router-view>
        <!-- 右侧页面部分 end-->
        <!-- <vue-gic-footer></vue-gic-footer> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collapseFlag: false, // 折叠参数
      menuRouter: [], // 路由菜单
      leftMenuRouter: [],
      leftModulesName: '微商城',
      projectName: 'mall'
    };
  },
  computed: {},
  methods: {
    // 处理路由跳转
    toRouterView(val) {
      var that = this;
      that.$router.push({
        path: val.path
      });
    },
    // 折叠事件
    collapseTag(val) {
      var that = this;
      that.collapseFlag = val;
      if (that.collapseFlag) {
        that.widthData = '64px';
      } else {
        that.widthData = '200px';
      }
    }
  },
  components: {}
};
</script>

<style scoped>
.container {
  height: 100%;
}
.mall-section {
  margin: 24px;
  background: #fff;
  padding: 24px;
}
.mall-content-container {
  padding-top: 64px;
  height: 100%;
  overflow-y: auto;
}
.goods-manege-content {
  height: 100%;
}
</style>
