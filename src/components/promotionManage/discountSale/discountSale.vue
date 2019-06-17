<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>促销活动</el-breadcrumb-item>
          <el-breadcrumb-item>折扣/减价</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>折扣/减价</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="content-wrap-padding">
          <el-row :gutter="10">
            <el-col :span="16">
              <div class="order-selects">
                <div class="block">
                  <el-select v-model="startStatus" @change="getSearchActivityList" clearable placeholder="活动状态" class="width-style">
                    <el-option v-for="item in selectArr" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </div>
                <div class="fl">
                  <el-input placeholder="请输入活动名称/活动标签" v-on:keyup.enter.native="getSearchActivityList" @clear="getSearchActivityList" v-model.trim="search" clearable prefix-icon="el-icon-search"> </el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="fr">
                <el-button type="primary" @click="goCreateActivity">创建活动</el-button>
              </div>
            </el-col>
          </el-row>
          <div v-loading="loading">
            <el-row class="order-list-title">
              <el-col :span="4">
                <div class="grid-content">
                  活动名称
                </div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content">
                  活动标签
                </div>
              </el-col>
              <el-col :span="4">
                <div class="grid-content">
                  活动时间
                </div>
              </el-col>
              <el-col :span="2">
                <div class="grid-content">
                  状态
                </div>
              </el-col>
              <el-col :span="2">
                <div class="grid-content">
                  商品数量
                </div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content">
                  购买限制
                </div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content">
                  <span
                    >优惠人群
                    <el-popover placement="top-start" width="200" trigger="hover" content="当一个会员处于多个会员分组时，可能造成该会员同时命中多个折扣/减价活动，此时默认只参与优惠力度最大的那个活动。">
                      <i slot="reference" class="iconfont icon-xinxixianshi"></i>
                    </el-popover>
                  </span>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="grid-content">
                  操作
                </div>
              </el-col>
            </el-row>
            <div v-if="activityList.length > 0">
              <el-row class="order-list-content" v-for="(item, index) in activityList" :key="index">
                <el-col :span="4">
                  <div class="grid-content grid-content-a">
                    <p>{{ item.activityName }}</p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content grid-content-a">
                    <p>{{ item.activityTag }}</p>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content grid-content-a">
                    <p style="line-height:18px">{{ item.beginTime | getTime }} {{ item.beginTime | getSeconds }} ~</p>
                    <p style="line-height:18px">{{ item.endTime | getTime }} {{ item.endTime | getSeconds }}</p>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div class="grid-content grid-content-a">
                    <p>{{ item.actType | activityStatus }}</p>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div class="grid-content grid-content-a">
                    <p>{{ item.proNum }}</p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content grid-content-a">
                    <p>{{ item.buyLimit }}</p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content">
                    <div v-if="item.memberLabelType === 1">全部会员</div>
                    <div v-if="item.memberLabelType === 2">{{ item.memberTagCount }}个会员分组</div>
                    <div v-if="item.memberLabelType === 3">会员筛选</div>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content">
                    <div>
                      <!-- <a v-if="item.actType != 1" href="javascript:;" @click="seeActivity(item.activityId)">查看</a>
                      <a v-else href="javascript:;" @click="editActivity(item.activityId)">编辑</a> -->
                      <a href="javascript:;" @click="editActivity(item.activityId)">编辑</a>
                      <el-popover placement="top" width="160" v-model="item.visible2" style="margin-left:8px">
                        <p style="line-height:1.5;padding: 10px 10px 20px;">确定删除该活动吗？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click="item.visible2 = false">取消</el-button>
                          <el-button type="primary" size="mini" @click="deleteActivity(item.activityId, index)">确定</el-button>
                        </div>
                        <el-button slot="reference" type="text">删除</el-button>
                      </el-popover>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div v-else class="empty">
              <div class="no-data-wrap">
                <div class="no-data-icon">
                  <img src="../../../../static/img/no-data_icon.png" />
                </div>
                <p>暂无数据</p>
              </div>
            </div>
          </div>

          <div class="block-page-wrap">
            <div class="block-page" v-if="total > 0">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="20" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import storage from '../../../../static/js/storage.js';
import request from '../../../api/request.js';
export default {
  data() {
    return {
      length: 0,
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      loading: true,
      pageSize: 20,
      pageNum: 1,
      currentPage: 1,
      total: 0,
      selectArr: [
        {
          value: '0',
          label: '未开始'
        },
        {
          value: '1',
          label: '进行中'
        },
        {
          value: '2',
          label: '已结束'
        }
      ],
      startStatus: '',
      search: '',
      activityList: []
    };
  },
  mounted() {
    this.getActivityList();
    storage.setNewActivity('');
  },
  created() {
    localStorage.removeItem('importInfoObj'); //使用完就清除缓存
  },
  filters: {
    activityStatus: function(value) {
      //活动状态显示
      if (value == 0) {
        return '未开始';
      }
      if (value == 1) {
        return '进行中';
      }
      if (value == 2) {
        return '已结束';
      }
      return '--';
    }
  },
  computed: {},
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getActivityList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getActivityList();
    },
    getSearchActivityList() {
      this.currentPage = 1;
      this.getActivityList();
    },
    getActivityList() {
      // this.loading = true;
      let params = {
        pageSize: this.pageSize,
        startStatus: this.startStatus,
        currentPage: this.currentPage,
        search: this.search
      };
      request.post('/api-mall/page-discount-activity', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            this.activityList = res.data.result.result;
          } else {
            this.activityList = [];
          }
          this.total = res.data.result.totalCount;
          this.loading = false;
        } else {
          this.$message.error('获取活动数据失败！！');
        }
      });
    },
    deleteActivity(id, index) {
      let params = {
        activityId: id
      };
      request.post('/api-mall/delete-discount-activity', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.activityList.splice(index, 1);
          if (this.activityList.length === 0) {
            if (this.currentPage > 1) {
              this.currentPage = this.currentPage - 1;
            }
          }
          this.$message.success('删除活动成功！！');
          this.getActivityList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    seeActivity(id) {
      // 查看活动
      let params = {
        activityId: id
      };
      request.get('/api-mall/get-discount-activity', { params }).then(res => {
        if (res.data.errorCode === 0) {
          storage.setNewActivity(res.data.result);
          this.$router.push({
            name: 'seediscountActivity',
            query: {
              id: id
            }
          });
        } else {
          this.$message.error('获取活动数据失败！！');
        }
      });
    },
    editActivity(id) {
      this.$router.push({
        name: 'createActivity',
        query: {
          id: id,
          isNew: 'false'
        }
      });
    },
    goCreateActivity() {
      this.$router.push({
        name: 'createActivity',
        query: {
          id: '-1',
          isNew: 'true'
        }
      });
    }
  },
  components: {}
};
</script>
<style scoped>
.bread-container {
  background: #fff;
}
.mall-content-title h3 {
  padding: 24px 0 0 0;
}
.content-wrap-padding {
  margin: 24px;
  padding: 24px;
  background-color: #fff;
}
.order-selects {
  display: flex;
}
.order-selects .fl {
  margin-left: 10px;
  width: 250px;
}
.order-list-title {
  height: 48px;
  line-height: 48px;
  background-color: rgba(241, 243, 247, 1);
  margin-top: 22px;
  padding-left: 14px;
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}
.grid-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.grid-content-a {
  padding-left: 10px;
}
.order-list-content {
  font-size: 14px;
  color: #303133;

  height: 48px;
  border-bottom: 1px solid rgba(241, 243, 247, 1);
  color: #606266;
}
/*分页*/
.block-page-wrap {
  overflow: hidden;
  margin: 16px 0 34px 0;
}
.block-page {
  float: right;
  padding-top: 14px;
}
.empty {
  text-align: center;
}
.empty p {
  font-size: 14px;
  color: #909399;
}
</style>
<style>
.order-list-content .el-col {
  height: 100%;
}
</style>
