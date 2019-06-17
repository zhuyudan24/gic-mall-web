<template>
  <div class="mall-section-container">
    <!--  <div class="img-left">
      <div class="img-lef-title">图片目录</div>
      <div class="img-tree-content">
        <el-tree
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
          node-key="id"
          default-expand-all
          :expand-on-click-node='clickNodeExpand'
          :highlight-current='highlightCurrent'></el-tree>
      </div>
    </div> -->
    <div class="img-right-content">
      <div class="img-right">
        <imgRececyleRight :parentId="parentId" ref="childEvent"></imgRececyleRight>
        <!-- 右侧页面部分 end-->
        <vue-gic-footer style="padding-bottom:80px"></vue-gic-footer>
      </div>
    </div>
  </div>
</template>

<script>
import imgRececyleRight from './imgRecycleRight.vue';

export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98 - 149,
      parentId: '', //点击的节点id
      highlightCurrent: true, //是否高亮
      clickNodeExpand: true,
      data: [],
      defaultProps: {
        children: 'chlidren',
        label: 'name'
      }
    };
  },

  computed: {},
  methods: {},
  components: {
    imgRececyleRight
  }
};
</script>
<style></style>
<style scoped>
/*左侧*/
.img-tree-content {
  width: 199px;
  box-sizing: border-box;
}
.img-left {
  width: 200px;
  background: #fff;
  border-right: 1px solid rgba(231, 231, 235, 1);
  box-sizing: border-box;
  height: 100%;
  position: fixed;
  z-index: 1;
  box-sizing: border-box;
}
.img-lef-title {
  background: rgba(242, 242, 247, 1);
  height: 44px;
  line-height: 44px;
  padding-left: 15px;
}
.mall-section-container {
  /*height:100%;*/
  display: flex;
}
/*树结构*/
.img-tree-content {
  margin-top: 20px;
  padding-left: 5px;
  height: 100%;
}
.img-right-content {
  height: 100%;
  flex: 1;
  min-width: 1200px;
  overflow-x: auto;
  /*margin-left:200px;*/
}
.img-right {
  overflow-x: auto;
  min-width: 1200px;
}
</style>
