<template>
  <el-dialog title="添加商品属性" :visible.sync="propertyData.dialogVisible" width="400px" @close="cancelSubmit">
    <div class="dialog-body">
      <div class="table-container">
        <div class="input-div">
          <el-input placeholder="请输入" prefix-icon="el-icon-search" v-model="dataSearch" clearable @keyup.enter.native="getSearchData()" @clear="getSearchData()"> </el-input>
        </div>
        <el-table :data="tableData" ref="selectedTable" @row-click="selectRow" @selection-change="handleSelectionChange" style="width: 100%" v-loadmore="loadmore" class="scroll-table" height="400">
          <span style="display:none">{{ refash }}</span>
          <el-table-column type="selection" width="55" reserve-selection="selectList"> </el-table-column>
          <el-table-column prop="propertyName" label="属性" border> </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit">取 消</el-button>
      <el-button type="primary" @click="submitAdd">确 定</el-button>
    </div>
    <!-- @click="submitAdd" -->
  </el-dialog>
</template>

<script>
// import qs from 'qs';
import request from '../../api/request.js';
// import copy from '../../../static/js/clone.js';
export default {
  props: {
    propertyData: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataSearch: '', //搜索值
      selectList: [],
      pageSize: 20,
      currentPage: 1,
      totalPage: 1,
      tableData: [],
      refash: false
    };
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          /*
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           *
           */
          let sign = 1; // 定义默认的向上滚于乡下滚的边界
          const CONDITION = this.scrollHeight - this.scrollTop < this.clientHeight + 1 && this.scrollTop > sign; // 注意: && this.scrollTop

          if (this.scrollTop > sign) {
            sign = this.scrollTop;
          }
          if (this.scrollTop < sign) {
            sign = this.scrollTop;
          }

          if (CONDITION) {
            binding.value();
          }
        });
      }
    }
  },
  created() {
    this.getPropertyList();
  },
  methods: {
    /**
     * 拉到底部加载更多
     */
    loadmore() {
      if (this.currentPage < this.totalPage) {
        this.currentPage += 1;
        this.getPropertyList();
      }
    },
    // 获取列表
    getPropertyList() {
      this.refash = !this.refash;
      let params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        search: this.dataSearch
      };
      request.get('/api-goods/page-property', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.tableData = this.tableData.concat(res.data.result.result);
          }
          this.totalPage = res.data.result.totalPage;
          this.refash = !this.refash;
          for (let item of this.propertyData.propertySelected) {
            let obj;
            obj = this.tableData.find(i => {
              return i.propertyId === item;
            });
            if (obj) {
              this.$refs.selectedTable.toggleRowSelection(obj, true);
            }
          }
        } else {
          this.$message.success(res.data.errorCode);
        }
      });
    },
    // 搜索
    getSearchData() {
      this.currentPage = 1;
      this.tableData = [];
      this.getPropertyList();
    },
    //选中状态
    handleSelectionChange(val) {
      this.selectList = val;
      // for (let row of this.selectList) {
      //   this.$refs.selectedTable.toggleRowSelection(row);
      // }
    },
    // 点击正一行选中
    selectRow(row, event, column) {
      this.$refs.selectedTable.toggleRowSelection(row);
    },
    // 提交属性添加
    submitAdd() {
      if (this.selectList.length === 0) {
        this.$message.error('请至少选择一个属性进行添加');
        return false;
      } else {
        let propertyIds = ''; //属性值id
        let propertyArr = []; //传递的属性和属性值的列表

        for (let item of this.selectList) {
          if (propertyIds === '') {
            propertyIds = item.propertyId;
          } else {
            propertyIds = propertyIds + ',' + item.propertyId;
          }
        }
        let params = {
          propertyIds: propertyIds
        };
        request.get('/api-goods/list-property-value', { params }).then(res => {
          if (res.data.errorCode === 0) {
            if (res.data.result) {
              for (let item of res.data.result) {
                if (item.propertyType === 'TYP_MULTI') {
                  //勾选
                  for (let j in item.propertyValueDTOList) {
                    //处理下来列表的数据适用插件
                    item.propertyValueDTOList[j].label = item.propertyValueDTOList[j].valueName;
                    item.propertyValueDTOList[j].id = item.propertyValueDTOList[j].valueId;
                  }
                  item.mallPropValues = null;
                } else if (item.propertyType === 'TYP_CHECK') {
                  //多选
                  item.mallPropValues = [];
                } else if (item.propertyType === 'TYP_SINGLE') {
                  //单选
                  item.mallPropValues = {
                    valueId: '',
                    valueName: ''
                  };
                }

                propertyArr.push({
                  propertyId: item.propertyId,
                  bizRequire: item.bizRequire,
                  propertyName: item.propertyName,
                  propertyType: item.propertyType,
                  children: item.propertyValueDTOList,
                  mallPropValues: item.mallPropValues,
                  units: item.units
                });
              }
            } else {
              propertyArr = [];
            }
            this.$emit('getPropertyList', propertyArr);
            this.propertyData.dialogVisible = false;
          } else {
            this.$message.success(res.data.errorCode);
          }
        });
      }
    },
    // 取消
    cancelSubmit() {
      this.selectList = [];
      this.propertyData.dialogVisible = false;
    }
  }
};
</script>
<style scoped>
.table-container {
  height: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.input-div {
  margin: 20px 14px;
}
</style>
<style>
.table-container .el-table th,
.table-container .el-table td {
  padding: 6px 0px !important;
}
</style>
