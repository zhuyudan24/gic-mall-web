<template>
  <div class="page-content">
    <div class="mall-content-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>微商城</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>图片空间</el-breadcrumb-item>
      </el-breadcrumb>
      <h3>
        <span>图片空间</span>
      </h3>
    </div>
    <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
      <div class="img-left-content" :style="{ height: mallHeight + 'px' }">
        <div class="img-left">
          <div class="img-lef-title">图片目录</div>
          <div class="img-tree-content">
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" node-key="id" :expand-on-click-node="clickNodeExpand" :setCurrentKey="parentId"></el-tree>
          </div>
        </div>
      </div>

      <div class="img-right-content">
        <div class="img-right">
          <imgSpaceRight :parentId="parentId" ref="childEvent" @getFileData="getFileData" @getTree="getTree"></imgSpaceRight>
          <!-- 右侧页面部分 end-->
        </div>
      </div>
    </div>
    <vue-gic-footer style="padding-bottom:80px"></vue-gic-footer>
  </div>
</template>

<script>
import request from '../../../api/request.js';
import imgSpaceRight from './imgSpaceRight.vue';

export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98 - 149,
      parentId: '', //点击的节点id
      highlightCurrent: true, //是否高亮
      data: [],
      defaultProps: {
        children: 'chlidren',
        label: 'name'
      },
      clickNodeExpand: false //点击节点不收缩起节点
    };
  },
  created() {
    this.getFileDataFirst(); //左侧文件下拉树数据
  },
  computed: {},
  methods: {
    // 点击节点事件
    handleNodeClick(data) {
      this.parentId = data.id;
      //点击父组件的
      this.$refs.childEvent.getParentId(data.id);
      this.$refs.childEvent.cancelCheckAll();
    },
    // 首次获取左侧下拉文件夹数据
    getFileDataFirst() {
      request.get('/api-mall/gic-cloud-image-group-list').then(res => {
        if (res.data.errorCode === 0) {
          this.data = res.data.result;
          this.parentId = res.data.result[0].id;
          this.$refs.childEvent.getParentId(this.parentId);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //非首次
    getFileData() {
      request.get('/api-mall/gic-cloud-image-group-list').then(res => {
        if (res.data.errorCode === 0) {
          this.data = res.data.result;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getTree() {
      this.getFileData();
    }
  },
  components: {
    imgSpaceRight
  }
};
</script>
<style>
.img-tree-content .el-tree-node__label {
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.img-tree-content .el-tree-node__content {
  height: 32px;
}
/* .img-tree-content .el-tree{
    padding-bottom:15px;
  }*/
/*.img-tree-content .el-tree-node > .el-tree-node__children{
    overflow: visible!important;
  }
  .img-tree-content .el-tree-node > .el-tree-node__children{
    overflow: visible!important;
    box-sizing: border-box;
  }*/
/*.img-tree-content .el-tree-node__content{
    width:100%;
  }*/
/*.img-tree-content .el-tree-node__content:hover{
    background:rgba(24, 144, 255, 0.10);
  }*/
.img-tree-content .el-tree-node.is-current > .el-tree-node__content {
  color: rgb(24, 144, 255);
}
</style>
<style scoped>
.page-content {
  min-width: 1400px;
  overflow-x: auto;
}
/*左侧*/
.img-tree-content {
  width: 200px;
  box-sizing: border-box;
}
.img-left-content {
  width: 200px;
  border-right: 1px solid rgba(231, 231, 235, 1);
  overflow-y: auto;
  overflow-x: hidden;
}
.img-left {
  width: 200px;
  background: #fff;
  height: 100%;
  width: 100%;
}
.img-lef-title {
  height: 44px;
  line-height: 44px;
  padding-left: 15px;
  border-bottom: 1px solid rgba(231, 231, 235, 1);
}
.mall-section-container {
  display: flex;
  background: #fff;
  margin: 24px;
  /*flex-flow: row;*/
}
/*树结构*/
.img-right-content {
  height: 100%;
  flex: 1;
  min-width: 1200px;
  overflow-x: auto;
}
.img-right {
  overflow-x: auto;
  min-width: 1200px;
}
</style>
