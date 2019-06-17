<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/imgSpaceList' }">图片空间</el-breadcrumb-item>
          <el-breadcrumb-item>回收站</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>回收站</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="operate-top">
          <div class="search-box">
            <el-input v-model="searchParams" placeholder="请输入图片名称/文件夹名称" prefix-icon="el-icon-search" clearable class="w-260" @clear="getSearchImgList" @keyup.enter.native="getSearchImgList"> </el-input>
          </div>
        </div>
        <div class="space-list-container">
          <div class="space-list-title">
            <div class="fl">
              <el-checkbox v-model="checked" class="check-box" v-if="activeIndex === '2'" @change="selectAll" :disabled="tableData.length === 0">全选</el-checkbox>
              <el-button type="text" @click="imgRecyFile('-1')">恢复</el-button>
              <el-button type="text" @click="deleteFile('-1')">彻底删除</el-button>
            </div>
            <div class="fr">
              <el-select v-model="sortType" placeholder="图片引用状态" @change="getSearchImgList" style="width:130px">
                <el-option label="时间升序" value="timeAsc"></el-option>
                <el-option label="时间降序" value="timeDesc"></el-option>
                <el-option label="大小升序" value="sizeAsc1"></el-option>
                <el-option label="大小降序" value="sizeDesc"></el-option>
                <el-option label="名称升序" value="nameAsc"></el-option>
                <el-option label="名称降序" value="nameDesc"></el-option>
              </el-select>
              <ul class="toggle-list">
                <li class="icon-item" :class="activeIndex === '1' ? 'icon-item-active' : ''" @click="toggleClick('1')"><i class="icon-toggle-list"></i></li>
                <li class="icon-item" :class="activeIndex === '2' ? 'icon-item-active' : ''" @click="toggleClick('2')"><i class="icon-toggle-card"></i></li>
              </ul>
            </div>
          </div>
          <div class="space-list-content">
            <imgList v-if="activeIndex === '1'" :tableData="tableData" @beforeRececyle="beforeRececyle"></imgList>
            <imgCard v-if="activeIndex === '2'" :tableData="tableData" @changeStatus="changeStatus" @cardListDelete="cardListDelete" :shuaxin="shuaxin" @cardListRece="cardListRece"> </imgCard>
            <div class="pagination-conteiner" v-show="tableData.length > 0">
              <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '../../../api/request.js';
import imgList from './imgList.vue';
import imgCard from './imgCard.vue';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      searchParams: '', //搜索关键字
      checked: false, //是否全选
      sortType: 'timeDesc', //排序timeAsc(由老到新)， sizeAsc(大小-由小到大)， sizeDesc（大小-由大到小）， nameAsc（名称-升序）， nameDesc（名称-降序）
      activeIndex: '2', //选中状态
      currentPage: 1,
      pageSize: 20,
      pageSizes: [20, 40, 60, 80],
      total: 0,
      tableData: [],
      rececyleIds: '',
      deleteIds: '',
      shuaxin: false
    };
  },
  created() {
    this.getImgList(); //获取
  },
  computed: {},
  methods: {
    //切换事件
    toggleClick(value) {
      this.currentPage = 1;
      this.pageSize = 20;
      this.sortType = 'timeDesc';
      this.searchParams = '';

      if (value === '1') {
        this.activeIndex = '1';
      } else if (value === '2') {
        this.activeIndex = '2';
      }
      this.checked = false;
      this.getImgList();
    },
    //获取列表事件
    getImgList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        sortType: this.sortType,
        searchParams: this.searchParams.trim()
      };
      request.get('/api-mall/gic-cloud-image-recycleList', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.tableData = res.data.result.result;
            this.total = res.data.result.totalCount;
          } else {
            this.tableData = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 搜索关键字
    getSearchImgList() {
      this.currentPage = 1;
      this.getImgList();
    },
    // 分页
    handleSizeChange(size) {
      //设置每页条数
      this.checked = false;
      this.pageSize = size;
      this.getImgList();
    },
    handleCurrentChange(page) {
      //设置跳到第几页
      this.checked = false;
      this.currentPage = page;
      this.getImgList();
    },
    beforeRececyle(id) {
      this.rececyleIds = id; //恢复id
      this.deleteIds = id; //删除的id
    },
    //恢复文件
    imgRecyFile(val) {
      if (val === '-1') {
        if (this.activeIndex === '2') {
          //卡片形式
          let newArr = [];
          for (let item of this.tableData) {
            if (item.selectItem) {
              newArr.push(item.id);
            }
          }
          if (newArr.length <= 0) {
            this.$message.error('请至少选择一个要恢复的文件');
            return false;
          } else {
            this.rececyleIds = newArr.join(',');
          }
        } else {
          //列表形式的
          if (this.rececyleIds === '') {
            this.$message.error('请至少选择一个要恢复的文件');
            return false;
          }
        }
      }
      let params = {
        ids: this.rececyleIds
      };
      request.get('/api-mall/gic-cloud-image-recycleRecover', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('恢复成功');
          this.getImgList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //彻底删除文件
    deleteFile(val) {
      if (val === '-1') {
        if (this.activeIndex === '2') {
          //卡品形式
          let idsArr = [];
          for (let item of this.tableData) {
            if (item.selectItem) {
              idsArr.push(item.id);
            }
          }
          if (idsArr.length <= 0) {
            this.$message.error('请至少选择一个要彻底删除的文件');
            return false;
          } else {
            this.deleteIds = idsArr.join(',');
          }
        } else if (this.activeIndex === '1') {
          //列表形式
          if (this.deleteIds === '') {
            this.$message.error('请至少选择一个要彻底删除的文件');
            return false;
          }
        }
      }

      let params = {
        ids: this.deleteIds
      };
      this.$confirm('此操作将彻底删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //确定删除
        request.get('/api-mall/gic-cloud-image-recycleDelete', { params }).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success('删除成功!');
            this.getImgList(); //请求列表
            this.checked = false;
          } else {
            this.$message.error(res.data.message);
          }
        });
      });
    },
    // 卡片的删除
    cardListDelete(id) {
      this.deleteIds = id;
      this.deleteFile();
    },
    //卡片上的额恢复
    cardListRece(id) {
      this.rececyleIds = id;
      this.imgRecyFile();
    },
    //全选
    selectAll() {
      if (this.checked) {
        //全选
        for (let item of this.tableData) {
          item.selectItem = true;
        }
      } else {
        //全不选
        for (let item of this.tableData) {
          item.selectItem = false;
        }
      }
      this.shuaxin = !this.shuaxin;
    },

    moveFile(id) {
      if (id === '-1') {
        //批量转移点击事件
        if (this.activeIndex === '2') {
          //卡片形式

          let idsArr = [];
          for (let item of this.tableData) {
            if (item.selectItem) {
              idsArr.push(item.id);
            }
          }
          if (idsArr.length <= 0) {
            this.$message.error('请选择要移动的文件');
            return false;
          } else {
            this.moveIds = idsArr.join(',');
          }

          //表格形式
          if (this.moveIds === '' || !this.moveIds) {
            this.$message.error('请选择要移动的文件');
            return false;
          }
        }

        //子组件的删除
        this.moveIds = id;
      }
      this.getFileData(); //获取数据
      (this.dialogFormVisible2 = true), (this.moveParentId = null);
    },
    //子组件改变父组件状态
    changeStatus(item, num, bol) {
      if (num === 2) {
        //选中状态
        item.selectItem = !item.selectItem;
      }
      for (let items of this.tableData) {
        if (!items.selectItem) {
          //只要有一个不选中
          this.checked = false;
        }
      }
      let arr = [];
      for (let item1 of this.tableData) {
        if (item1.selectItem) {
          arr.push(item1);
        }
      }
      if (arr.length === this.tableData.length) {
        this.checked = true;
      }
    }
  },
  components: {
    imgList,
    imgCard,
    Treeselect
  }
};
</script>

<style scoped>
.mall-section-container {
  width: 100%;
  height: 100%;
}
.mall-content-section {
  width: 100%;
}
.mall-section {
  margin: 24px;
  padding: 22px 24px 24px;
  background: #fff;
  height: 100%;
}
.operate-top {
  font-size: 0;
}
.w-260 {
  width: 260px;
}
.search-box {
  display: inline-block;
  margin-left: 8px;
}
.space-list-container {
  margin-top: 22px;
}
.check-box {
  margin-right: 8px;
}
.space-list-title {
  height: 32px;
  background: #f0f2f5;
  padding: 8px 15px;
}
.space-list-title .fl {
  line-height: 32px;
}
/*切换列表按钮*/
.toggle-list {
  display: inline-block;
  vertical-align: top;
  margin: 0 5px;
  border: 1px solid #e7e7eb;
}
.icon-item {
  width: 32px;
  height: 32px;
  line-height: 40px;
  float: left;
  text-align: center;
  background: #f8fcff;
  cursor: pointer;
}
.icon-item-active {
  background: #fff;
}
.icon-item:first-child {
  border-right: 1px solid #e7e7eb;
}
.icon-toggle-list {
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url(../../../../static/img/icon-16.png) 0px -255px;
}
.icon-toggle-card {
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url(../../../../static/img/icon-16.png) 0px -285px;
}
.icon-toggle-list .icon-toggle-list {
  background: url(../../../../static/img/icon-16.png) -30px -255px;
}
.icon-toggle-list .icon-toggle-card {
  background: url(../../../../static/img/icon-16.png) -30px -255px;
}
.space-list-content {
  margin-top: 22px;
}
</style>
