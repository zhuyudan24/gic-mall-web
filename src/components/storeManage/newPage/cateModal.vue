<template>
  <el-dialog title="选择品类" :visible="cateModal" width="840px" @close="cancelCate">
    <div class="goods-cate-content-modal">
      <div class="goods-cate-title" @click="showDragClick">
        <el-tag v-show="selectCateData.categoryName" closable :disable-transitions="false" @close="handleClose()" class="select-tag" size="small">
          {{ selectCateData.categoryName }}
        </el-tag>
      </div>
      <div class="goods-cate-list-container" v-show="showDrag">
        <div class="goods-cate-list-content">
          <div class="goods-cate-box" v-for="(item, index) in allDate" :key="index">
            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" size="medium" clearable class="cate-search" v-model="item.search" @keyup.enter.native="searchCate(item.search, index, item)"> </el-input>
            <div class="goods-cate-list">
              <div class="goods-cate-item" v-for="(i, ind) in item.arr" :class="i.classIndex === ind ? 'cate-item-active' : ''" :key="i.categoryId" @click="getNextCateList(i, ind, item, index)">
                <span>{{ i.categoryName }}</span>
                <i class="el-icon-arrow-right" v-if="i.isChildren"></i>
              </div>
            </div>
            <span style="display: none;">{{ refreshStatus }}</span>
          </div>
        </div>
        <div class="goods-cate-footer">
          <el-button type="text" class="confirm-cate" size="small" @click="handaleConfirmCate">确认选择</el-button>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelCate">取 消</el-button>
      <el-button type="primary" @click="getCateMessage">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '../../../api/request.js';
export default {
  props: {
    cateModal: {
      type: Boolean
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
      selectCateData: {},
      selectedCate: '',
      showDrag: false
    };
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
    },
    //确认弹框
    getCateMessage() {
      // this.cancelCate()
      this.$emit('getCateMess', this.selectCateData);
      this.$emit('cancelCateModal');
    },
    cancelCate() {
      this.selectCateData = {};
      this.$emit('cancelCateModal');
    },
    handleClose() {
      this.selectCateData = [];
    }
  }
};
</script>
<style>
.goods-cate-content-modal {
  width: 800px;
}
.goods-cate-content-modal .goods-cate-title {
  min-height: 40px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 0 10px;
  cursor: pointer;
}
.goods-cate-content-modal .select-tag {
  margin: 9px 5px;
}
.goods-cate-content-modal .goods-cate-list-content {
  overflow-x: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  border-top: none;
  padding: 10px 0 20px 0;
  white-space: nowrap;
  padding-left: 10px;
  width: 788px;
  background: #fff;
}
.goods-cate-content-modal .goods-cate-footer {
  width: 100%;
  height: 32px;
  padding: 5px 0;
  border: 1px solid #dcdfe6;
  border-top: none;
  position: relative;
  background: #fff;
}
.goods-cate-content-modal .goods-cate-footer .confirm-cate {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.goods-cate-content-modal .goods-cate-box {
  width: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: inline-block;
  margin-right: 10px;
}
.goods-cate-content-modal .cate-search {
  margin: 10px;
  width: 180px;
}
.goods-cate-content-modal .goods-cate-list {
  height: 200px;
  overflow-y: auto;
}
.goods-cate-content-modal .goods-cate-item {
  height: 32px;
  line-height: 32px;
  position: relative;
  color: #909399;
  cursor: pointer;
  padding-left: 10px;
}
.goods-cate-content-modal .cate-item-active {
  background: #f5f5f6;
}
.goods-cate-content-modal .goods-cate-item .el-icon-arrow-right {
  position: absolute;
  right: 5px;
  top: 9px;
  font-weight: 600;
}
</style>
