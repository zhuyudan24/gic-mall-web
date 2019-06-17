<template>
  <el-dialog title="添加商品规格值" :visible.sync="standardGroupData.dialogVisible" :width="standardGroupData.hasGroup ? '660px' : '400px'" @close="cancelSubmit">
    <div class="dialog-body">
      <div class="table-container-content">
        <div class="table-container" v-if="standardGroupData.hasGroup > 0">
          <div class="input-div">
            <el-input placeholder="请输入" prefix-icon="el-icon-search" v-model="dataSearch" clearable @keyup.enter.native="getSearchData()" @clear="getSearchData()"> </el-input>
          </div>
          <el-table :data="tableData" highlight-current-row @row-click="selectRowGroup" ref="selectedTable" style="width: 100%" v-loadmore="loadmore" class="scroll-table" height="400">
            <span style="display:none">{{ refash }}</span>
            <el-table-column width="30"> </el-table-column>
            <el-table-column prop="standardName" label="规格值组" border> </el-table-column>
          </el-table>
        </div>
        <div class="table-container">
          <div class="input-div">
            <el-input placeholder="请输入" prefix-icon="el-icon-search" v-model="dataValueSearch" clearable @keyup.enter.native="getSearchValueData()" @clear="getSearchValueData()"> </el-input>
          </div>
          <el-table :data="tableDataValue" ref="selectedValueTable" @row-click="selectRow" @selection-change="handleSelectionChange" style="width: 100%" v-loadmore="loadmoreValue" class="scroll-table" height="400">
            <span style="display:none">{{ refash }}</span>
            <el-table-column type="selection" width="55" reserve-selection="selectList"> </el-table-column>
            <el-table-column prop="valueName" label="规格值" border> </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelSubmit">取 消</el-button>
      <el-button type="primary" @click="submitStandard">确 定</el-button>
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
    standardGroupData: {
      type: Object
    }
  },
  data() {
    return {
      dataSearch: '', //搜索值
      selectList: [],
      pageSize: 20,
      currentPage: 1,
      totalPage: 1,
      tableData: [], //规格值组列表
      refash: false,
      tableDataValue: [], //规格值列表
      currentPageValue: 1, //规格值分页
      dataValueSearch: '', //规格值搜索
      totalPageValue: 1, //规格值总页数
      standardValueGroupId: '', //选中的规格值组id
      standardValueGroupName: '' //选中的规格值组名字
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
    if (this.standardGroupData.hasGroup) {
      this.getStandardGroupList();
    } else {
      this.getStandardValueList();
    }
  },
  methods: {
    /**
     * 拉到底部加载更多
     */
    loadmore() {
      if (this.currentPage < this.totalPage) {
        this.currentPage += 1;
        this.getStandardGroupList();
      }
    },
    loadmoreValue() {
      if (this.currentPageValue < this.totalPageValue) {
        this.currentPageValue += 1;
        this.getStandardValueList('load');
      }
    },
    // 规格值组
    // 获取列表
    getStandardGroupList() {
      this.refash = !this.refash;
      let params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        type: 'TYP_GROUP',
        parentId: this.standardGroupData.standardId, //规格id
        search: this.dataSearch,
        sortStatus: ''
      };
      request.get('/api-goods/page-standard', { params }).then(res => {
        // this.selectList = [];
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.tableData = this.tableData.concat(res.data.result.result);
          }
          this.totalPage = res.data.result.totalPage;
          this.refash = !this.refash;
        } else {
          this.$message.success(res.data.errorCode);
        }
      });
    },
    // 点击规格值组
    selectRowGroup(row, event, column) {
      this.standardValueGroupId = row.standardId;
      this.standardValueGroupName = row.standardName;
      this.$refs.selectedValueTable.clearSelection();
      this.getStandardValueList();
    },
    // 搜索
    getSearchData() {
      this.currentPage = 1;
      this.tableData = [];
      this.getStandardGroupList();
    },

    // 规格值
    // 获取规格值列表
    getStandardValueList(val) {
      let params = {
        currentPage: this.currentPageValue,
        pageSize: 20,
        standardId: this.standardGroupData.standardId,
        standardGroupId: this.standardValueGroupId,
        search: this.dataValueSearch
      };

      request.get('/api-goods/list-standardgroup-value', { params }).then(res => {
        // this.selectList = [];
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            if (val === 'load') {
              this.tableDataValue = this.tableDataValue.concat(res.data.result.result);
            } else {
              this.tableDataValue = res.data.result.result;
            }
          } else {
            this.tableDataValue = this.tableDataValue;
          }

          this.totalPageValue = res.data.result.totalPage;
          if (this.standardGroupData.standardSelected) {
            for (let item of this.standardGroupData.standardSelected) {
              let obj;
              obj = this.tableDataValue.find(i => {
                return i.valueId === item.valueId;
              });
              if (obj) {
                this.$refs.selectedValueTable.toggleRowSelection(obj, true);
              }
            }
          }

          this.refash = !this.refash;
        } else {
          this.$message.success(res.data.errorCode);
        }
      });
    },
    // 规格值搜索
    getSearchValueData() {
      this.currentPageValue = 1;
      this.tableDataValue = [];
      this.getStandardValueList();
    },
    //选中状态
    handleSelectionChange(val) {
      this.selectList = val;
    },
    // 点击正一行选中
    selectRow(row, event, column) {
      this.$refs.selectedValueTable.toggleRowSelection(row);
    },
    //提交
    submitStandard() {
      if (this.selectList.length === 0) {
        this.$message.error('请至少选择一个规格值进行添加');
        return false;
      } else {
        let list = [];
        let standardValues = [];
        for (let item of this.selectList) {
          if (
            !list.find(row => {
              return row.valueId === item.valueId;
            })
          ) {
            list.push({
              groupId: this.standardValueGroupId ? this.standardValueGroupId : '-1',
              groupName: this.standardValueGroupId ? this.standardValueGroupName : '-1',
              valueId: item.valueId,
              valueName: item.valueName
            });
            standardValues.push({
              valueId: item.valueId,
              valueName: item.valueName,
              remark: '',
              groupId: this.standardValueGroupId
            });
          }

          // list.push({
          //   groupId: this.standardValueGroupId ? this.standardValueGroupId : '-1',
          //   groupName: this.standardValueGroupId ? this.standardValueGroupName : '-1',
          //   valueId: item.valueId,
          //   valueName: item.valueName
          // });
          // standardValues.push({
          //   valueId: item.valueId,
          //   valueName: item.valueName,
          //   remark: '',
          //   groupId: this.standardValueGroupId
          // });
        }
        let params = {
          //品类属性属性值依赖关系
          categoryIds: this.standardGroupData.categoryIds,
          standardId: this.standardGroupData.standardId,
          standardName: this.standardGroupData.standardName,
          list: list
        };
        // params = JSON.stringify(params);
        request.post('/api-goods/save-category-standard', params).then(res => {
          if (res.data.errorCode === 0) {
            //向父组件传递已经选择过的规格值列表
            //已经选择过的其他规格值组下的规格值要一并传过去
            if (this.standardGroupData.standardSelected) {
              for (let item of this.standardGroupData.standardSelected) {
                let status = standardValues.find(i => {
                  return i.valueId === item.valueId;
                });
                if (!status) {
                  item.remark = '';
                  standardValues.push(item);
                }
              }
            }
            this.$emit('getStandardSelectValueList', standardValues);
            this.standardGroupData.dialogVisible = false;
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    // 取消添加
    cancelSubmit() {
      this.standardGroupData.dialogVisible = false;
      this.selectList = [];
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
.table-container-content {
  display: flex;
}
.table-container-content .table-container {
  flex: 1;
}
.table-container-content .table-container:first-child {
  margin-right: 20px;
}
</style>
<style>
.table-container .el-table th,
.table-container .el-table td {
  padding: 6px 0px !important;
}
</style>
