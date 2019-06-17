<template>
  <el-dialog title="导入失败原因" :visible.sync="importInfo.dialogVisible" width="420px">
    <div class="info-content" style="height:400px;overflow-y:auto">
      <div v-for="(item, index) in importInfo.infoList" :key="index" class="list-content">
        <p class="reason-info">{{ item.reason }}</p>
        <span class="sku-info">{{ item.data.join(',') }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    importInfo: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {},
  components: {}
};
</script>
<style scoped>
.sku-info {
  font-size: 13px;
  color: #606266;
  margin-left: 10px;
  vertical-align: top;
  width: 280px;
  display: inline-block;
  word-break: break-all;
}
.reason-info {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
  word-break: break-all;
  width: 80px;
  display: inline-block;
}
.list-content {
  margin-bottom: 15px;
  border-bottom: 1px solid #dcdfe6;
}
</style>
