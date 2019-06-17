<template>
  <div class="senior-search-container" @click.stop="hideDrag">
    <div class="senior-search-content">
      <el-form :model="searchForm" label-width="80px" :rules="searchFormRules">
        <el-form-item label="创建时间" class="inline-item">
          <el-date-picker v-model="searchForm.createTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:408px">
            <!-- @change="disabledDateChange" -->
            }
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品类型" class="inline-item">
          <el-select v-model="searchForm.productType" placeholder="请选择" style="width:408px" clearable>
            <el-option label="手动发布" value="1"></el-option>
            <el-option label="ERP同步" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品单价" class="inline-item">
          <el-col :span="11">
            <el-form-item prop="productPriceMin">
              <el-input v-model="searchForm.productPriceMin" style="width:195px;" placeholder="请输入"> </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" style="width:20px;text-align:center">-</el-col>
          <el-col :span="11">
            <el-form-item prop="productPriceMax">
              <el-input v-model="searchForm.productPriceMax" style="width:195px;" placeholder="请输入"> </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="商品库存" class="inline-item">
          <el-col :span="11">
            <el-form-item prop="productStockMin">
              <el-input v-model="searchForm.productStockMin" style="width:195px;" placeholder="请输入"> </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" style="width:20px;text-align:center">-</el-col>
          <el-col :span="11">
            <el-form-item prop="productStockMax">
              <el-input v-model="searchForm.productStockMax" style="width:195px;" placeholder="请输入"> </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="总销量" class="inline-item">
          <el-col :span="11">
            <el-form-item prop="productSaleNumMin">
              <el-input v-model="searchForm.productSaleNumMin" style="width:195px;" placeholder="请输入"> </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" style="width:20px;text-align:center">-</el-col>
          <el-col :span="11">
            <el-form-item prop="productSaleNumMax">
              <el-input v-model="searchForm.productSaleNumMax" style="width:195px;" placeholder="请输入"> </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="商品分类" class="inline-item">
          <treeselect v-model="searchForm.tagId" :multiple="false" :options="goodsClassifyData" size="small" placeholder="所有分类" style="width:408px" />
        </el-form-item>
        <el-form-item label="商品品类" style="display: inline-block;width:1000px">
          <cateSelect ref="modal" @getCateIds="getCateIds" :selectCateData2="selectCateData2"></cateSelect>
        </el-form-item>
        <!-- style="display: inline-block;width:1000px" -->
        <el-form-item label="完善状态" class="inline-item">
          <el-select v-model="searchForm.complete" placeholder="请选择" style="width:408px" clearable>
            <el-option label="未完善" :value="0"></el-option>
            <el-option label="已完善" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSeniorSearch">搜索</el-button>
          <el-button @click="uploadFile">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <vue-gic-export-excel :dataArr="tableData" :dialogVisible.sync="dialogVisible" :type="1" :excelUrl="excelUrl" :params="params" :projectName="projectName"></vue-gic-export-excel>
  </div>
</template>

<script>
import request from '../../../api/request.js';
import common from '../../../../static/js/common.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import cateSelect from '../../common/cateSelect.vue';
import copy from '../../../../static/js/clone.js';
export default {
  props: {
    goodsStatus: {
      type: Number,
      default: 2
    },
    tableData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    //单价
    let productPriceMinValidator = (rule, value, callback) => {
      // var reg = /[1-9]\d*.\d*|0.\d*[1-9]\d*/;

      if (value !== '') {
        if (Number(value) !== 0) {
          if (!Number(value)) {
            callback(new Error('请输入数字'));
          } else {
            this.searchForm.productPriceMin = Number(this.searchForm.productPriceMin).toFixed(2);
            if (this.searchForm.productPriceMax !== '') {
              if (Number(value) > Number(this.searchForm.productPriceMax)) {
                callback(new Error('最小单价不能大于最大单价'));
              }
            } else {
              callback();
            }
          }
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let productPriceMaxValidator = (rule, value, callback) => {
      if (value !== '') {
        if (Number(value) !== 0) {
          if (!Number(value)) {
            callback(new Error('请输入数字'));
          } else {
            this.searchForm.productPriceMax = Number(this.searchForm.productPriceMax).toFixed(2);
            if (this.searchForm.productPriceMin !== '') {
              if (Number(value) < Number(this.searchForm.productPriceMin)) {
                callback(new Error('最大单价不能小于最小单价'));
              }
            } else {
              callback();
            }
          }
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    //库存
    let productStockMinValidator = (rule, value, callback) => {
      var reg = /^[0-9]*$/;
      if (value !== '') {
        if (!reg.test(value)) {
          callback(new Error('请输入整数'));
        } else if (this.searchForm.productStockMax && Number(value) > Number(this.searchForm.productStockMax)) {
          callback(new Error('最小库存不能大于最大库存'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let productStockMaxValidator = (rule, value, callback) => {
      var reg = /^[0-9]*$/;
      if (value !== '') {
        if (!reg.test(value)) {
          callback(new Error('请输入整数'));
        } else if (this.searchForm.productStockMin && Number(value) < Number(this.searchForm.productStockMin)) {
          callback(new Error('最大库存不能小于最小库存'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    //销量
    let productSaleNumMinValidator = (rule, value, callback) => {
      var reg = /^[0-9]*$/;
      if (value != '') {
        if (!reg.test(value)) {
          callback(new Error('请输入整数'));
        } else if (Number(this.searchForm.productSaleNumMax) && Number(value) > Number(this.searchForm.productSaleNumMax)) {
          callback(new Error('最小销量不能大于最大销量'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let productSaleNumMaxValidator = (rule, value, callback) => {
      var reg = /^[0-9]*$/;
      if (value !== '') {
        if (!reg.test(value)) {
          callback(new Error('请输入整数'));
        } else if (Number(this.searchForm.productSaleNumMin) && Number(value) < Number(this.searchForm.productSaleNumMin)) {
          callback(new Error('最大销量不能小于最小销量'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      getTime: common.getTime,
      getSeconds: common.getSeconds,
      getTimeAll: common.formatDate,
      searchValue: '', //搜索关键字
      showSearch: true,
      searchForm: {
        createTime: [],
        productPriceMin: '',
        productPriceMax: '',
        productStockMin: '',
        productStockMax: '',
        productSaleNumMin: '',
        productSaleNumMax: '',
        productType: '',
        mallCategoryId: '',
        tagId: null, //分类id
        complete: ''
      },
      searchFormRules: {
        productPriceMin: [{ type: 'number', validator: productPriceMinValidator, trigger: 'blur' }],
        productPriceMax: [{ type: 'number', validator: productPriceMaxValidator, trigger: 'blur' }],
        productStockMin: [{ type: 'number', validator: productStockMinValidator, trigger: 'blur' }],
        productStockMax: [{ type: 'number', validator: productStockMaxValidator, trigger: 'blur' }],
        productSaleNumMin: [{ type: 'number', validator: productSaleNumMinValidator, trigger: 'blur' }],
        productSaleNumMax: [{ type: 'number', validator: productSaleNumMaxValidator, trigger: 'blur' }]
      },
      goodsClassifyData: [], //商品分类
      uploadUrl: window.location.origin,
      // uploadUrl:'http://gicdev.demogic.com',
      showTree: false,
      selectCateData2: {}, //回显
      optionsData: {
        disabledDate: time => {}
      },
      // 导出数据控件
      projectName: 'mall', // 当前项目名
      dialogVisible: false,
      excelUrl: '/api-mall/download-simple-mall-goods', // 下载数据的地址
      params: {} // 传递的参数
    };
  },

  mounted() {
    this.getCateList();
  },

  methods: {
    // disabledDateChange() {

    //   if( this.searchForm.createTime[1]-this.searchForm.createTime[0] > 90*24*60*60*1000 ) {
    //     this.$message.error('不能超过三个月')
    //     this.searchForm.createTime[1] = new Date(this.searchForm.createTime[0].valueOf() + 90*24*60*60*1000)
    //   }

    // },
    //高级搜索
    handleSearch() {
      this.showSearch = !this.showSearch;
    },
    // 获取商品分类烈表
    getCateList() {
      this.testList = [];
      request.get('/api-mall/list_mall_goods_tag_tree').then(res => {
        if (res.data.errorCode === 0) {
          this.goodsClassifyData.push({
            childTagList: res.data.result.childTagList,
            mallProTagId: res.data.result.mallProTagId,
            tagName: res.data.result.tagName
          });
          this.getTreeData(this.goodsClassifyData);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //处理数据适用于vue-treeSelect
    getTreeData(data) {
      for (let i in data) {
        data[i].label = data[i].tagName;
        data[i].id = data[i].mallProTagId;
        data[i].children = data[i].childTagList;
        if (data[i].children) {
          this.getTreeData(data[i].children);
        } else {
          delete data[i].children;
        }
      }
    },
    // 高级搜索
    handleSeniorSearch() {
      if (!this.searchForm.createTime) {
        this.searchForm.createTime = [];
      }
      let obj = copy(this.searchForm);
      this.$emit('getSearch', obj);
    },
    //导出商品
    uploadFile() {
      let createTimeMin;
      let createTimeMax;
      if (this.searchForm.createTime.length === 2) {
        createTimeMin = this.getTimeAll(this.searchForm.createTime[0]);
        createTimeMax = this.getTimeAll(this.searchForm.createTime[1]);
      } else {
        createTimeMin = '';
        createTimeMax = '';
      }
      let tagId;
      if (this.searchForm.tagId === null) {
        tagId = '';
      } else {
        tagId = this.searchForm.tagId;
      }
      this.params = {
        goodsStatus: this.goodsStatus,
        createTimeMin: createTimeMin,
        createTimeMax: createTimeMax,
        productType: this.searchForm.productType,
        productPriceMin: this.searchForm.productPriceMin,
        productPriceMax: this.searchForm.productPriceMax,
        productStockMin: this.searchForm.productStockMin,
        productStockMax: this.searchForm.productStockMax,
        productSaleNumMin: this.searchForm.productSaleNumMin,
        productSaleNumMax: this.searchForm.productSaleNumMax,
        mallCategoryId: this.searchForm.mallCategoryId,
        tagId: tagId,
        complete: this.searchForm.complete,
        requestProject: 'mall'
      };
      this.dialogVisible = true;
      // var url = this.uploadUrl + '/api-mall/download-simple-mall-goods?goodsStatus='+this.goodsStatus+
      // '&createTimeMin='+createTimeMin+
      // '&createTimeMax='+createTimeMax+
      // '&productType='+this.searchForm.productType +
      // '&productPriceMin='+ this.searchForm.productPriceMin +
      // '&productPriceMax=' + this.searchForm.productPriceMax +
      // '&productStockMin=' + this.searchForm.productStockMin +
      // '&productStockMax=' + this.searchForm.productStockMax +
      // '&productSaleNumMin=' + this.searchForm.productSaleNumMin +
      // '&productSaleNumMax=' + this.searchForm.productSaleNumMax +
      // '&mallCategoryId=' + this.searchForm.mallCategoryId +
      // '&tagId=' + tagId +
      // '&complete=' + this.searchForm.complete +
      // '&requestProject=mall';
      // window.location = url;
    },
    getCateIds(item) {
      this.searchForm.mallCategoryId = item.categoryId;
      this.selectCateData2 = item;
      if (!item.length) {
        this.selectCateData2 = {};
      }
    },
    hideDrag() {
      this.$nextTick(() => {
        if (this.$refs.modal.showDrag) {
          this.$refs.modal.showDrag = false;
        }
      });
    }
  },
  components: {
    Treeselect,
    cateSelect
  }
};
</script>
<style scoped>
.senior-search-container {
  margin: 0 25px;
  background: #fff;
  padding: 25px 25px 5px 25px;
}
.senior-search-content {
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  padding: 15px 24px;
}

.inline-item {
  display: inline-block;
  width: 500px;
  vertical-align: top;
}
</style>
<style>
.inline-item .vue-treeselect__control {
  height: 32px;
}
</style>
