<template>
  <div class="goods-cate-content">
    <div class="goods-cate-title" @click.stop="showDragClick">
      <el-tag v-show="selectCateData.categoryName" closable :disable-transitions="false" @close="handleClose()" class="select-tag" size="small">
        {{ selectCateData.categoryName }}
      </el-tag>
      <i :class="showDrag ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
    </div>
    <div class="goods-cate-list-container" v-show="showDrag" @click.stop="searchBlur">
      <div class="goods-cate-list-content">
        <div class="goods-cate-box" v-for="(item, index) in allDate" :key="index" @click.stop="searchBlur">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search" size="small" clearable class="cate-search" v-model="item.search" @keyup.enter.native="searchCate(item.search, index, item)"> </el-input>
          <div class="goods-cate-list">
            <div class="goods-cate-item" v-for="(i, ind) in item.arr" :class="i.classIndex === ind ? 'cate-item-active' : ''" :key="i.categoryId" @click.stop="getNextCateList(i, ind, item, index)">
              <span>{{ i.categoryName }}</span>
              <i class="el-icon-arrow-right" v-if="i.isChildren"></i>
            </div>
          </div>
          <span style="display: none;">{{ refreshStatus }}</span>
        </div>
      </div>
      <div class="goods-cate-footer">
        <el-button type="text" class="cancel-cate" @click="cancelConfirmCate">取消</el-button>
        <el-button type="text" class="confirm-cate" @click="handaleConfirmCate">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import request from '../../api/request.js';
import copy from '../../../static/js/clone.js';
export default {
  props: {
    selectCateData2: {
      type: Object
      // default:[]
    }
  },
  data() {
    return {
      allDate: [],
      firstCate: [],
      classIndex1: 0,
      refreshStatus: false,
      seceltIndex1: '',
      seceltIndex2: '',
      selectCateData: [],
      selectedCate: '',
      showDrag: false
    };
  },
  mounted() {
    this.selectCateData = copy(this.selectCateData2);
  },
  created() {
    this.getFirstCateList();
  },
  methods: {
    showDragClick() {
      this.showDrag = !this.showDrag;
    },
    //获取一级品类列表
    getFirstCateList() {
      request.get('/api-mall/list-mall-goods-all-category').then(res => {
        if (res.data.errorCode === 0) {
          this.allDate = [];
          this.allDate.push({
            search: '',
            arr: res.data.result
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取子级品类
    getNextCateList(i, ind, item, index) {
      this.seceltIndex1 = index;
      this.seceltIndex2 = ind;
      this.allDate.length = index + 1;
      this.refreshStatus = !this.refreshStatus;
      for (let j of item.arr) {
        j.classIndex = -1;
        i.selectBgcolor = false;
      }
      i.classIndex = ind;
      i.selectBgcolor = true; //选中元素的标志
      let params = {
        categoryId: i.categoryId
      };
      request.get('/api-mall/list-mall-goods-children-category', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.length) {
            this.allDate[index + 1] = {
              search: '',
              arr: res.data.result
            };
            this.refreshStatus = !this.refreshStatus;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    searchCate(search, index, item) {
      this.allDate.length = index + 1;
      if (index === 0) {
        let params = {
          search
        };
        request.get('/api-mall/list-mall-goods-all-category', { params }).then(res => {
          if (res.data.errorCode === 0) {
            this.allDate = [];
            this.allDate.push({
              search: search !== '' ? search : '',
              arr: res.data.result
            });
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        let categoryId = '';
        for (let ind in this.allDate[index - 1].arr) {
          if (this.allDate[index - 1].arr[ind].classIndex !== -1) {
            categoryId = this.allDate[index - 1].arr[ind].categoryId;
          }
        }
        let params = {
          search: search,
          categoryId: categoryId
        };
        request.get('/api-mall/list-mall-goods-children-category', { params }).then(res => {
          if (res.data.errorCode === 0) {
            this.allDate[index] = {
              search: search !== '' ? search : '',
              arr: res.data.result
            };
            this.refreshStatus = !this.refreshStatus;
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    // 确认选择子级
    handaleConfirmCate() {
      this.showDrag = !this.showDrag;
      if (this.seceltIndex1 === '' || this.seceltIndex2 === '') {
        return false;
      }
      this.selectCateData = {};
      this.selectCateData = this.allDate[this.seceltIndex1].arr[this.seceltIndex2];
      this.$emit('getCateIds', this.selectCateData);
    },
    // 取消选择
    cancelConfirmCate() {
      this.selectCateData = {};
      this.showDrag = false;
      this.$emit('getCateIds', this.selectCateData);
    },
    handleClose() {
      this.selectCateData = [];
    },
    /*eslint-disable*/
    searchBlur(e) {
      return false
    }
  },
  components: {}
};
</script>
<style scoped>
.goods-cate-content {
  width: 910px;
  position: relative;
}
.goods-cate-title {
  min-height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 0 10px;
  cursor: pointer;
  position: relative;
}
.goods-cate-title .el-tag {
  line-height: 24px;
}
.goods-cate-title i {
  position: absolute;
  right: 10px;
  top: 14px;
  color: #c0c4cc;
}
.select-tag {
  margin: 0 5px;
}
.goods-cate-list-content {
  overflow-x: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  border-top: none;
  padding: 10px 0 20px 0;
  white-space: nowrap;
  padding-left: 10px;
  width: 898px;
  background: #fff;
}
.goods-cate-list-container {
  position: absolute;
  left: 0px;
  top: 42px;
  z-index: 2;
}
.goods-cate-footer {
  width: 100%;
  height: 32px;
  padding: 5px 0;
  border: 1px solid #dcdfe6;
  border-top: none;
  position: relative;
  background: #fff;
}
.goods-cate-footer .confirm-cate {
  position: absolute;
  right: 10px;
}
.goods-cate-footer .cancel-cate {
  position: absolute;
  right: 45px;
}
.goods-cate-box {
  width: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: inline-block;
  margin-right: 10px;
}
.cate-search {
  margin: 10px;
  width: 180px;
}
.goods-cate-list {
  height: 200px;
  overflow-y: auto;
}
.goods-cate-item {
  height: 32px;
  line-height: 32px;
  position: relative;
  color: #909399;
  cursor: pointer;
  padding-left: 10px;
}
.cate-item-active {
  color: #409eff;
}
.goods-cate-item .el-icon-arrow-right {
  position: absolute;
  right: 5px;
  top: 9px;
  font-weight: 600;
}
</style>
