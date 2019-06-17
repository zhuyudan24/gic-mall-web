<template>
  <div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="名称" width="300px">
        <template slot-scope="scope">
          <div class="img-box">
            <img v-if="scope.row.type === 'folder'" src="../../../../static/img/folder_pic.png" alt="" />
            <div style="border-radius:2px;display: inline-block;border:1px solid #E4E7ED;" v-else>
              <img :src="scope.row.imgUrl" alt="" @dblclick="openImgDetail(scope.row, scope.$index)" />
            </div>
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <p v-if="scope.row.type === 'image'">{{ scope.row.imgType }}</p>
        </template>
      </el-table-column>
      <el-table-column label="尺寸（px）">
        <template slot-scope="scope">
          <p v-if="scope.row.type === 'image'">{{ scope.row.width }}x{{ scope.row.length }}</p>
        </template>
      </el-table-column>
      <el-table-column label="大小">
        <template slot-scope="scope">{{ (scope.row.size / 1024).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="图片引用状态">
        <template slot-scope="scope">
          <div v-show="scope.row.type === 'image'">
            <p v-if="scope.row.quoteStatus === 1"><span class="dm-status--primary">已引用</span></p>
            <p v-else><span class="dm-status--info">未引用</span></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <p style="line-height: 1.2">{{ scope.row.updateTime ? getTime(scope.row.updateTime) : '--' }}</p>
          <p style="line-height: 1.2">{{ scope.row.updateTime ? getSeconds(scope.row.updateTime) : '--' }}</p>
        </template>
      </el-table-column>
      <template slot="empty" style="display:none">
        <div class="no-data-wrap">
          <div class="no-data-icon">
            <img src="../../../../static/img/no-data_icon.png" />
          </div>
          <p>暂无数据</p>
        </div>
      </template>
    </el-table>
  </div>
</template>

<script>
import common from '../../../../static/js/common.js';
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      getTime: common.getTime,
      getSeconds: common.getSeconds,
      multipleSelection: [],
      imgUrl: '' //链接
    };
  },
  computed: {},
  methods: {
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let idsArr = [];
      let ids = '';
      for (let item of this.multipleSelection) {
        idsArr.push(item.id);
      }
      ids = idsArr.join(',');
      this.$emit('beforeRececyle', ids);
    }
  },
  components: {}
};
</script>

<style scoped>
.img-box img {
  width: 35px;
  height: 35px;
  vertical-align: middle;
  padding: 2px;
}
.img-box span {
  margin-left: 3px;
}
.img-operate p {
  text-align: center;
  line-height: 24px;
  padding: 3px 0;
  color: #1890ff;
  cursor: pointer;
}
</style>
