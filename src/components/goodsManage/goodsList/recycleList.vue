<template>
  <div class="goods-list-content">
    <el-table @sort-change="sortChange" :data="tableData" ref="multipleTable" style="width: 100%" @selection-change="handleSelectAll">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="商品信息" width="360px">
        <template slot-scope="scope">
          <div class="img-text">
            <img :src="scope.row.mallProImageUrl ? scope.row.mallProImageUrl : 'http://pic01-10001430.image.myqcloud.com/img-icon-pro.png'" />
            <div class="text">
              <p class="goods-descript">{{ scope.row.proName }}<i class="el-icon-edit" @click="editProName(scope.row)"></i></p>
              <p class="goods-code">货号:{{ scope.row.proCode }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <!--  <el-table-column
        prop="proType"
        label="类型"
        >
        <template slot-scope="scope">
          <p v-if="scope.row.proType===0">手动发布</p>
          <p  v-if="scope.row.proType===1">ERP发布</p>
        </template>
      </el-table-column> -->
      <el-table-column prop="mallProSpuPrice" label="单价" sortable="custom">
        <template slot-scope="scope">
          <p>￥{{ scope.row.mallProSpuPrice }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" sortable="custom">
        <template slot-scope="scope">
          <p>
            <span>{{ scope.row.stock }}</span>
          </p>
        </template>
      </el-table-column>

      <el-table-column prop="saleNum" label="总销量" sortable="custom" width="110px"> </el-table-column>
      <el-table-column prop="complete" label="完善状态">
        <template slot-scope="scope">
          <p style="line-height:18px" v-if="scope.row.complete === 0"><span class="dm-status--error">未完善</span></p>
          <p style="line-height:18px" v-if="scope.row.complete === 1"><span class="dm-status--success">已完善</span></p>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom" width="110px">
        <template slot-scope="scope">
          <p style="line-height:18px">{{ getTime(scope.row.createTime) }}</p>
          <p style="line-height:18px" class="gray-color">{{ getSeconds(scope.row.createTime) }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="删除时间" sortable="custom" width="110px">
        <template slot-scope="scope">
          <p>{{ getTime(scope.row.updateTime) }}</p>
          <p class="gray-color">{{ getSeconds(scope.row.updateTime) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="130px">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="deleteItem(scope.row.mallProId,1,0)">恢复到仓库</el-button> -->
          <tishi ref="tishi" @confirm="deleteItem(scope.row.mallProId, 1, 0)" tips="是否恢复到仓库?">
            <el-button type="text">是否恢复到仓库</el-button>
          </tishi>
        </template>
      </el-table-column>
      <template slot="empty">
        <div class="no-data-wrap">
          <div class="no-data-icon">
            <img src="../../../../static/img/no-data_icon.png" />
          </div>
          <p>暂无数据</p>
        </div>
      </template>
    </el-table>
    <!-- 修改商品名称 -->
    <editInfo :editInfoModal="editInfoModal" @getList="getList"></editInfo>
  </div>
</template>

<script>
import common from '../../../../static/js/common.js';
import tishi from './popover.vue';
import editInfo from './editGoodsInfo';
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    searchObj: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      getTime: common.getTime,
      getSeconds: common.getSeconds,
      editInfoModal: {
        proName: '',
        proNameLen: 0,
        mallProId: '',
        dialogVisible: false
      }
    };
  },
  methods: {
    //当前组件触发这个函数
    getList(val) {
      this.$emit('getList');
    },
    // 排序
    sortChange(value) {
      this.sortColumn = value.prop;
      if (value.order == 'ascending') {
        this.sortType = 'asc';
      } else if (value.order == 'descending') {
        this.sortType = 'desc';
      }
      this.$emit('getList', this.sortType, this.sortColumn);
    },
    // 全选
    handleSelectAll(val) {
      this.$emit('getSelectList', val);
    },
    //上架
    deleteItem(mallProId, status, bol) {
      this.$emit('handleItem', mallProId, status, bol);
    },
    // 编辑商品名称
    editProName(item) {
      this.editInfoModal.proName = item.proName;
      this.editInfoModal.dialogVisible = true;
      this.editInfoModal.proNameLen = common.getZhLen(this.editInfoModal.proName);
      this.editInfoModal.mallProId = item.mallProId;
    }
  },
  components: {
    tishi,
    editInfo
  }
};
</script>
<style>
.goods-list-content .el-table__fixed-right {
  z-index: 0;
}
.el-table:before {
  height: 0px;
}
</style>
<style scoped>
.goods-list-content {
  margin: 0 25px 25px 25px;
  padding: 22px 24px 24px 24px;
  background: #fff;
}
/*商品信息*/
.img-text img {
  width: 80px;
  height: 80px;
  border-radius: 5px;
}
.img-text .text {
  display: inline-block;
  vertical-align: top;
  width: 70%;
  margin-left: 3px;
  font-size: 13px;
  line-height: 14px;
}
.goods-descript {
  height: 36px;
}
.goods-descript .el-icon-edit {
  margin-left: 5px;
  display: none;
}
.img-text:hover .el-icon-edit {
  display: inline-block;
}
.goods-code {
  margin-bottom: 6px;
}
.active-icon-reduce {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: url(../../../../static/img/icon-20.png) 0 -30px;
}
.active-icon-discount {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: url(../../../../static/img/icon-20.png) 0 -67px;
}
.active-icon-postage {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: url(../../../../static/img/icon-20.png) 0 -102px;
}
.el-icon-edit {
  cursor: pointer;
}
</style>
