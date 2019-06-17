<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>评价管理</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>评价管理</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="operate-top">
          <div class="fl">
            <div class="search-item">
              <el-select v-model="grade" placeholder="评价等级" class="w-120" @change="getSearchList" clearable>
                <el-option label="好评" value="3"></el-option>
                <el-option label="中评" value="2"></el-option>
                <el-option label="差评" value="1"></el-option>
              </el-select>
            </div>
            <div class="search-item">
              <el-select v-model="reply" placeholder="回复状态" class="w-120" @change="getSearchList" clearable>
                <el-option label="未回复" value="0"></el-option>
                <el-option label="已回复" value="1"></el-option>
              </el-select>
            </div>
            <div class="search-item">
              <el-input v-model="proParams" placeholder="请输入商品名称/货号" prefix-icon="el-icon-search" @keyup.enter.native="getSearchList" clearable @clear="getSearchList"> </el-input>
            </div>
            <div class="search-item">
              <el-input v-model="memberParams" class="w-320" placeholder="请输入买家昵称/卡号/订单编号" prefix-icon="el-icon-search" @keyup.enter.native="getSearchList" clearable @clear="getSearchList"> </el-input>
            </div>
          </div>
        </div>
        <div class="table-content">
          <template>
            <el-table :data="tableData" style="width: 100%" v-loading="loading">
              <el-table-column label="商品评价" width="300px">
                <template slot-scope="scope">
                  <div>
                    <span>
                      <el-rate v-model="scope.row.evaluateScore" disabled text-color="#ff9900"> </el-rate>
                      <!-- <i class="el-icon-star-on" v-for="(i, x) in scope.row.evaluateScore / 2" :key="x"></i>
                      <i class="el-icon-star-off" v-for="(j, y) in 5 - scope.row.evaluateScore / 2" :key="y"></i> -->
                    </span>
                  </div>
                  <p>{{ scope.row.evaluateContent }}</p>
                  <div class="evaluate-img" v-for="(item, index) in scope.row.shareImageList" :key="index">
                    <img :src="item.imageUrl" />
                    <i class="el-icon-zoom-in" @click="enlargeDialogImageUrl(item, index)"></i>
                    <div class="dialog-img"></div>
                  </div>
                  <el-dialog :visible.sync="dialogVisibleImg">
                    <img width="100%" :src="dialogEnlargeImageUrl" alt="" />
                  </el-dialog>
                </template>
              </el-table-column>
              <el-table-column label="商品信息" prop="mallProName" width="300px"> </el-table-column>
              <el-table-column label="订单" width="240px">
                <template slot-scope="scope">
                  <a style="line-height: 1.2;" :href="windowUrl + '/mall/#/orderDetails/' + scope.row.mallOrderId" target="_blank">{{ scope.row.orderNumber }}</a>
                  <!-- <a href='#'>{{scope.row.orderNumber}}</a> -->
                  <div style="line-height: 1.2;">
                    服务态度：
                    <span>
                      <el-rate v-model="scope.row.serviceScore" disabled text-color="#ff9900" style="display:inline-block"> </el-rate>
                      <!-- <i class="el-icon-star-on" v-for="(i, m) in scope.row.serviceScore / 2" :key="m"></i>
                      <i class="el-icon-star-off" v-for="(j, n) in 5 - scope.row.serviceScore / 2" :key="n"></i> -->
                    </span>
                  </div>
                  <div style="line-height: 1.2;">
                    快递服务：
                    <span>
                      <el-rate v-model="scope.row.expressScore" disabled text-color="#ff9900" style="display:inline-block"> </el-rate>
                      <!-- <i class="el-icon-star-on" v-for="(i, m1) in scope.row.expressScore / 2" :key="m1"></i>
                      <i class="el-icon-star-off" v-for="(j, n1) in 5 - scope.row.expressScore / 2" :key="n1"></i> -->
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="买家">
                <template slot-scope="scope">
                  <p style="line-height: 1.2;">{{ scope.row.memberNickname }}</p>
                  <a style="line-height: 1.2;" :href="windowUrl + '/member/#/wechatmemberDetail?memberId=' + scope.row.memberId" target="_blank">{{ scope.row.memberCardNo }}</a>
                </template>
              </el-table-column>
              <el-table-column label="评价时间">
                <template slot-scope="scope">
                  <p style="line-height: 1.2;">{{ scope.row.createTime ? getTime(scope.row.createTime) : '--' }}</p>
                  <p style="line-height: 1.2;">{{ scope.row.createTime ? getSeconds(scope.row.createTime) : '--' }}</p>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.replyContent" placement="top-start" v-if="scope.row.replyStatus === 1">
                    <el-button type="text">已回复</el-button>
                  </el-tooltip>
                  <el-button type="text" v-if="scope.row.replyStatus === 0" @click="replyEvaluate(scope.row, 0)">未回复</el-button>
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
    <!-- 评价回复的弹框   -->
    <el-dialog title="评价回复" :visible.sync="dialogFormVisible" width="450px" @close="cancelReplay('evaluateForm')">
      <el-form :model="evaluateForm" :rules="evaluateRules" label-position="left" ref="evaluateForm" class="evaluate-form">
        <el-form-item label="回复内容" prop="msg" style="position:relative;">
          <el-input type="textarea" v-model="evaluateForm.msg" class="w-320" :rows="4" @input="value => msgLimit(value)"></el-input>
          <span class="msg-limit">{{ msgLen }}/150</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelReplay('evaluateForm')">取 消</el-button>
        <el-button type="primary" @click="submitReplay('evaluateForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs';
import getInputVal from '../../../../static/js/common.js';
import request from '../../../api/request.js';
export default {
  data() {
    return {
      getTime: getInputVal.getTime,
      getSeconds: getInputVal.getSeconds,
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      grade: '', //评价等级
      reply: '', //回复类型
      proParams: '', //商品名称或货号
      memberParams: '', //买家昵称或买家卡号
      currentPage: 1,
      pageSize: 20,
      pageSizes: [20, 40, 60, 80],
      total: 0,
      tableData: [],
      loading: true,
      dialogFormVisible: false, //评价弹框
      evaluateForm: {
        msg: '', //评价回复的内容
        evaluateId: ''
      },
      evaluateRules: {
        msg: [{ required: true, message: '请输入回复内容', trigger: 'blur' }]
      },
      windowUrl: window.location.origin,
      dialogVisibleImg: false, //放大图片的弹框
      dialogEnlargeImageUrl: '', //放大图片地址
      msgLen: 0
    };
  },
  created() {
    this.getList();
  },

  computed: {},
  methods: {
    //评价列表
    getList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        grade: this.grade ? this.grade : '-1',
        reply: this.reply ? this.reply : '-1',
        proParams: this.proParams.trim(),
        memberParams: this.memberParams.trim()
      };

      request.get('/api-mall/evaluates', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.loading = false;
          if (res.data.result.result) {
            this.tableData = res.data.result.result;
            this.total = res.data.result.totalCount;
          } else {
            this.tableData = [];
            this.total = 0;
          }
          for (let item of this.tableData) {
            item.evaluateScore = item.evaluateScore / 2;
            item.serviceScore = item.serviceScore / 2;
            item.expressScore = item.expressScore / 2;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
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
    getSearchList() {
      this.currentPage = 1;
      this.getList();
    },
    msgLimit(value) {
      this.$nextTick(() => {
        this.evaluateForm.msg = getInputVal.getInputVal(value, 150);
        this.msgLen = getInputVal.getZhLen(this.evaluateForm.msg);
      });
    },
    //评价回复
    replyEvaluate(item, status) {
      this.dialogFormVisible = true;
      this.evaluateForm.evaluateId = item.evaluateId;
      if (status === 1) {
        this.evaluateForm.msg = item.replyContent;
      } else {
        this.evaluateForm.msg = '';
      }
    },
    // 提交评价回复
    submitReplay(evaluateForm) {
      this.$refs[evaluateForm].validate(valid => {
        if (valid) {
          let params = {
            msg: this.evaluateForm.msg,
            evaluateId: this.evaluateForm.evaluateId
          };
          request.post('/api-mall/reply_msg', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('保存成功');
              this.dialogFormVisible = false;
              this.msgLen = 0;
              this.getList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 取消提交
    cancelReplay(evaluateForm) {
      this.$refs[evaluateForm].resetFields();
      this.dialogFormVisible = false;
      this.msgLen = 0;
    },
    // 放大查看图片
    enlargeDialogImageUrl(item, index) {
      this.dialogVisibleImg = true;
      this.dialogEnlargeImageUrl = item.imageUrl;
    }
  },
  components: {}
};
</script>
<style>
.el-tooltip__popper.is-dark {
  max-width: 260px;
}
</style>
<style scoped>
.evaluate-form /deep/ .el-form-item__content {
  margin-left: 80px;
}
.operate-top {
  height: 32px;
}
.mall-section {
  margin: 24px;
  padding: 24px 24px;
  background: #fff;
}
.operate-top .fl {
  font-size: 0;
}
.search-item {
  display: inline-block;
  margin-right: 8px;
}
.w-120 {
  width: 120px;
}
.table-content {
  margin-top: 22px;
}
.evaluate-img {
  position: relative;
  width: 40px;
  display: inline-block;
  margin-right: 3px;
}
.evaluate-img img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 5px;
  cursor: pointer;
}
.el-icon-star-on {
  color: rgba(244, 149, 26, 1);
}
.w-320 {
  width: 320px;
}

.el-icon-zoom-in {
  position: absolute;
  left: 50%;
  top: 12px;
  transform: translateX(-50%);
  font-size: 20px;
  color: #fff;
  z-index: 2;
  display: none;
}
.evaluate-img:hover .el-icon-zoom-in {
  display: block;
  cursor: pointer;
}
.dialog-img {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  /*display:none;*/
  cursor: pointer;
  border-radius: 4px;
}
.msg-limit {
  position: absolute;
  right: 10px;
  bottom: -30px;
}
</style>
