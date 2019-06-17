<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>促销活动</el-breadcrumb-item>
          <el-breadcrumb-item>满减送</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>满减送</span>
        </h3>
      </div>
      <div class="mall-section header-style">
        <div class="operate-top">
          <div class="fl">
            <div class="search-item">
              <el-select v-model="activeStatus" placeholder="活动状态" class="w-120" clearable @change="getSearchList">
                <el-option label="未开始" :value="0"></el-option>
                <el-option label="进行中" :value="1"></el-option>
                <el-option label="已结束" :value="2"></el-option>
              </el-select>
            </div>
            <div class="search-item">
              <el-input v-model="search" placeholder="请输入活动名称" prefix-icon="el-icon-search" @keyup.enter.native="getSearchList" clearable @clear="getSearchList"> </el-input>
            </div>
          </div>
          <div class="fr">
            <el-button type="primary" @click="newActive('-1')">新建活动</el-button>
          </div>
        </div>
        <div class="table-content">
          <template>
            <el-table :data="tableData" style="width: 100%" v-loading="loading">
              <el-table-column label="活动名称" prop="activityName"> </el-table-column>
              <el-table-column label="活动时间">
                <template slot-scope="scope">
                  <p class="time-lh">{{ scope.row.beginTime ? getTime(scope.row.beginTime) : '--' }} {{ scope.row.beginTime ? getSeconds(scope.row.beginTime) : '--' }}~~</p>
                  <p class="time-lh">{{ scope.row.endTime ? getTime(scope.row.endTime) : '--' }} {{ scope.row.endTime ? getSeconds(scope.row.endTime) : '--' }}</p>
                </template>
              </el-table-column>
              <el-table-column label="活动状态" prop="startStatus">
                <template slot-scope="scope">
                  <p v-if="scope.row.startStatus === 0">未开始</p>
                  <p v-if="scope.row.startStatus === 1">进行中</p>
                  <p v-if="scope.row.startStatus === 2">已结束</p>
                </template>
              </el-table-column>
              <el-table-column label="商品范围" prop="proRelationType">
                <template slot-scope="scope">
                  <p v-if="scope.row.proRelationType === 1">所有商品</p>
                  <p v-else-if="scope.row.proRelationType === 2">按商品品牌</p>
                  <p v-if="scope.row.proRelationType === 3">按商品品类</p>
                  <p v-if="scope.row.proRelationType === 4">按商品分类</p>
                  <p v-if="scope.row.proRelationType === 5">按单件商品</p>
                </template>
              </el-table-column>
              <el-table-column label="优惠人群" :render-header="renderHeader">
                <template slot-scope="scope">
                  <p v-if="scope.row.memberLabelType === 1">全部会员</p>
                  <p v-if="scope.row.memberLabelType === 2">{{ scope.row.memberTagCount }}个会员分组</p>
                  <p v-if="scope.row.memberLabelType === 3">会员筛选</p>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div class="fz0">
                    <el-button type="text" @click="newActive(scope.row.activityId)" style="margin-right:16px;line-height:24px">编辑</el-button>
                    <el-popover placement="top" width="160" v-model="scope.row.visible2">
                      <p style="line-height:1.5;padding: 10px 10px 20px;">确定删除该活动吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="scope.row.visible2 = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="deleteActive(scope.row, scope.$index)">确定</el-button>
                      </div>
                      <el-button slot="reference" type="text">删除</el-button>
                    </el-popover>
                  </div>
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
          </template>
          <div class="pagination-conteiner" v-show="tableData.length">
            <div class="pagination">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import common from '../../../../static/js/common.js';
import request from '../../../api/request.js';
export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      getTime: common.getTime,
      getSeconds: common.getSeconds,
      search: '', //搜索关键字
      activeStatus: '', //活动状态
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      pageSizes: [20, 40, 60, 80],
      total: 0,
      loading: false
    };
  },
  created() {
    this.getList();
  },

  computed: {},
  methods: {
    renderHeader(h, { column, $index }, index) {
      return h('span', {}, [h('span', {}, '优惠人群'), h('el-popover', { props: { placement: 'top-start', width: '200', trigger: 'hover', content: '当一个会员处于多个会员分组时，可能造成该会员同时命中多个满减送活动，此时默认只参与优惠力度最大的那个活动。' } }, [h('i', { slot: 'reference', class: 'iconfont icon-xinxixianshi' }, '')])]);
    },
    getList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        startStatus: this.activeStatus,
        search: this.search.trim()
      };
      this.loading = true;
      request.get('/api-mall/page-reduce-activity', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.loading = false;
          if (res.data.result.result) {
            this.tableData = res.data.result.result;
            this.total = res.data.result.totalCount;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    // 搜索关键字
    getSearchList() {
      this.currentPage = 1;
      this.getList();
    },
    // 分页
    handleSizeChange(size) {
      //设置每页条数
      this.pageSize = size;
      this.getList();
    },
    handleCurrentChange(page) {
      //设置跳到第几页
      this.currentPage = page;
      this.getList();
    },
    // 删除
    deleteActive(item, index) {
      let params = {
        activityId: item.activityId
      };
      request.post('/api-mall/delete-reduce-activity', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.tableData.splice(index, 1);
          if (this.tableData.length === 0) {
            if (this.currentPage > 1) {
              this.currentPage = this.currentPage - 1;
            }
          }
          this.$message.success('删除成功');
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 新建活动跳转
    newActive(activityId) {
      localStorage.removeItem('priceObj');
      this.$router.push({
        name: 'newReduceDiscount',
        params: {
          activityId: activityId
        }
      });
    }
  },
  components: {}
};
</script>
<style>
.header-style .icon-xinxixianshi {
  margin-left: 5px;
}
.upload-btn:hover .el-button,
.upload-btn .el-button:focus {
  color: #1890ff;
}
</style>
<style scoped>
.operate-top {
  height: 32px;
}
.mall-section {
  margin: 24px;
  padding: 24px;
  background: #fff;
}
.operate-top .fl {
  font-size: 0;
}
.search-item {
  display: inline-block;
  margin-right: 10px;
}
.table-content {
  margin-top: 22px;
}
.fz0 {
  font-size: 0px;
}
.time-lh {
  line-height: 18px;
}
</style>
