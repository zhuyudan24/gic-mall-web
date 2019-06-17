<template>
  <div class="order-wrap-padding">
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="fl">
          <el-input placeholder="请输入运费模板名称" v-on:keyup.enter.native="getTemplateList()" v-model.trim="search" clearable prefix-icon="el-icon-search"></el-input>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="fr">
          <el-button type="primary" @click="goTemplateEdit('-1')">新建运费模板</el-button>
        </div>
      </el-col>
    </el-row>
    <div style="margin-top:22px;" v-loading="loading">
      <div class="template-list" v-for="(item, index) in templateList" :key="index">
        <el-row class="template-list-title">
          <el-col :span="12">
            <div class="grid-content-left" style="font-size:14px;font-weight:600;color:#303133">
              {{ item.templateName }}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content-right">
              <span>最近修改时间：{{ item.updateTime | getTime }} {{ item.updateTime | getSeconds }}</span>
              <a href="javascript:;" @click="goTemplateEdit(item.freightTemplateId)">编辑</a><a href="javascript:;" @click="deleteTemplate(item.freightTemplateId)">删除</a>
            </div>
          </el-col>
        </el-row>
        <el-row class="template-list-wrap" style="background-color:rgba(241, 243, 247, 1);color:#909399">
          <el-col :span="4">
            <div class="grid-content">
              运送方式
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              运送到
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              首件数（个）
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              首费（元）
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              续件数（个）
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              续费（元）
            </div>
          </el-col>
        </el-row>
        <el-row class="template-list-wrap">
          <el-col :span="4">
            <div class="grid-content">
              快递
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              中国
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              {{ item.fristBatchNumber }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              {{ item.fristBatchCostStr }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              {{ item.otherBatchNumber }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              {{ item.otherBatchCost }}
            </div>
          </el-col>
        </el-row>
        <el-row class="template-list-wrap" v-for="items in item.subList" :key="items.subFreightTemplateId">
          <el-col :span="4">
            <div class="grid-content">
              快递
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content">
              {{ items.areaName }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              {{ items.fristBatchNumber }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              {{ items.fristBatchCostStr }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              {{ items.otherBatchNumber }}
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              {{ items.otherBatchCost }}
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="block-page-wrap">
      <div class="block-page">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[20, 40, 60, 80]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../../api/request.js';
export default {
  data() {
    return {
      loading: true,
      search: '',
      pageSize: 20,
      pageNum: 1,
      currentPage4: 1,
      total: 4,
      templateList: [
        {
          freightTemplateId: 'ff808081644e485d01644e6e1626000d',
          enterpriseId: null,
          brandId: '-1',
          templateName: '0元测试',
          freeShipping: 0,
          areaId: '-1',
          fristBatchNumber: 1,
          fristBatchCost: 0.0,
          fristBatchCostStr: '0.00',
          otherBatchNumber: 1,
          otherBatchCost: 0.0,
          otherBatchCostStr: '0.00',
          isDefault: 0,
          status: 1,
          createTime: 1530324194000,
          updateTime: 1533203304000,
          subList: [
            {
              subFreightTemplateId: 'ff80808164ab74240164b5ff027e004f',
              enterpriseId: 'ff808081593917d90159398ec6340012',
              brandId: '-1',
              freightTemplateId: 'ff808081644e485d01644e6e1626000d',
              areaId: '310000,320000,330000,340000,350000,360000,370000',
              areaName: '上海市,江苏省,浙江省,安徽省,福建省,江西省,山东省',
              fristBatchNumber: 98,
              fristBatchCost: 14.0,
              fristBatchCostStr: '14.00',
              otherBatchNumber: 90,
              otherBatchCost: 9088.0,
              otherBatchCostStr: '9088.00',
              status: 1,
              createTime: 1532061745000,
              updateTime: 1533203304000
            }
          ]
        },
        {
          freightTemplateId: 'ff808081643b81720164447e35d50038',
          enterpriseId: null,
          brandId: '-1',
          templateName: '测试运费模板C',
          freeShipping: 0,
          areaId: '-1',
          fristBatchNumber: 1,
          fristBatchCost: 8.0,
          fristBatchCostStr: '8.00',
          otherBatchNumber: 1,
          otherBatchCost: 12.0,
          otherBatchCostStr: '12.00',
          isDefault: 0,
          status: 1,
          createTime: 1530157479000,
          updateTime: 1532065005000,
          subList: [
            {
              subFreightTemplateId: 'ff808081643b81720164447eb39d0039',
              enterpriseId: 'ff808081593917d90159398ec6340012',
              brandId: '-1',
              freightTemplateId: 'ff808081643b81720164447e35d50038',
              areaId: '210000,220000,230000',
              areaName: '辽宁省,吉林省,黑龙江省',
              fristBatchNumber: 1,
              fristBatchCost: 1.0,
              fristBatchCostStr: '1.00',
              otherBatchNumber: 1,
              otherBatchCost: 1.0,
              otherBatchCostStr: '1.00',
              status: 1,
              createTime: 1530157511000,
              updateTime: 1532065005000
            }
          ]
        },
        {
          freightTemplateId: 'ff8080816422610101643632d7e7005b',
          enterpriseId: null,
          brandId: '-1',
          templateName: '运费模板测试 B',
          freeShipping: 0,
          areaId: '-1',
          fristBatchNumber: 2,
          fristBatchCost: 10.0,
          fristBatchCostStr: '10.00',
          otherBatchNumber: 1,
          otherBatchCost: 4.0,
          otherBatchCostStr: '4.00',
          isDefault: 0,
          status: 1,
          createTime: 1529917659000,
          updateTime: 1529918439000,
          subList: [
            {
              subFreightTemplateId: 'ff8080816422610101643632d7ee005c',
              enterpriseId: 'ff808081593917d90159398ec6340012',
              brandId: '-1',
              freightTemplateId: 'ff8080816422610101643632d7e7005b',
              areaId: '210000,220000,230000',
              areaName: '辽宁省,吉林省,黑龙江省',
              fristBatchNumber: 5,
              fristBatchCost: 20.0,
              fristBatchCostStr: '20.00',
              otherBatchNumber: 2,
              otherBatchCost: 20.0,
              otherBatchCostStr: '20.00',
              status: 1,
              createTime: 1529917659000,
              updateTime: 1529918439000
            },
            {
              subFreightTemplateId: 'ff8080816422610101643632d7ee005d',
              enterpriseId: 'ff808081593917d90159398ec6340012',
              brandId: '-1',
              freightTemplateId: 'ff8080816422610101643632d7e7005b',
              areaId: '310000,320000,330000,340000,350000,360000,370000',
              areaName: '上海市,江苏省,浙江省,安徽省,福建省,江西省,山东省',
              fristBatchNumber: 5,
              fristBatchCost: 15.0,
              fristBatchCostStr: '15.00',
              otherBatchNumber: 2,
              otherBatchCost: 15.0,
              otherBatchCostStr: '15.00',
              status: 1,
              createTime: 1529917659000,
              updateTime: 1529918439000
            }
          ]
        },
        {
          freightTemplateId: 'ff80808160fed3c7016101e8256a0008',
          enterpriseId: null,
          brandId: '-1',
          templateName: '运费模板测试 A',
          freeShipping: 0,
          areaId: '-1',
          fristBatchNumber: 1,
          fristBatchCost: 10.0,
          fristBatchCostStr: '10.00',
          otherBatchNumber: 1,
          otherBatchCost: 5.0,
          otherBatchCostStr: '5.00',
          isDefault: 0,
          status: 1,
          createTime: 1516155446000,
          updateTime: 1529918413000,
          subList: [
            {
              subFreightTemplateId: 'ff8080816422610101643631fa82005a',
              enterpriseId: 'ff808081593917d90159398ec6340012',
              brandId: '-1',
              freightTemplateId: 'ff80808160fed3c7016101e8256a0008',
              areaId: '110000,120000,130000,140000,150000',
              areaName: '北京市,天津市,河北省,山西省,内蒙古自治区',
              fristBatchNumber: 1,
              fristBatchCost: 20.0,
              fristBatchCostStr: '20.00',
              otherBatchNumber: 1,
              otherBatchCost: 10.0,
              otherBatchCostStr: '10.00',
              status: 1,
              createTime: 1529917602000,
              updateTime: 1529918413000
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.getTemplateList();
  },
  computed: {},
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTemplateList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTemplateList();
    },
    getTemplateList() {
      // this.loading = true;
      this.loading = false;
      let params = {
        search: this.search,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      request.post('/api-mall/page-shipping-templates', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.templateList = res.data.result.result;
          this.total = res.data.result.totalCount;
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    deleteTemplate(id) {
      // 删除模板
      let params = {
        freightTemplateId: id
      };
      this.$confirm('确认删除该模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request.post('/api-mall/delete-shipping-templates', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('删除模板成功！！');
              this.getTemplateList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    goTemplateEdit(id) {
      // let temId = '';
      // if (id) {
      //   temId = id;
      // }
      this.$router.push({
        name: 'templateEdit',
        params: { templateId: id }
      });
      window.localStorage.setItem('tabName', 'second');
    }
  }
};
</script>

<style scoped>
.order-wrap-padding {
  margin: 24px;
  padding: 24px;
  background-color: #fff;
  margin-top: 0px;
}
.template-list {
  /*border:1px solid #dcdfe6;*/
  margin-bottom: 24px;
}
.template-list-title {
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: #909399;
  padding: 0px 10px;
  font-weight: 600;
  color: #606266;

  /*background-color:rgba(241, 243, 247, 1);*/
}
.template-list-title span {
  color: #909399;
  /*font-weight:600;*/
}
.grid-content-right {
  text-align: right;
}
.grid-content-right a {
  margin-left: 10px;
}
.template-list-wrap {
  /* height:48px;*/
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  color: #303133;
  padding: 10px 10px;
}
.grid-content {
  /*height:48px;*/
  line-height: 18px;
}
/*分页*/
.block-page-wrap {
  overflow: hidden;
  padding-bottom: 12px;
}
.block-page {
  float: right;
  padding-top: 14px;
}
</style>
