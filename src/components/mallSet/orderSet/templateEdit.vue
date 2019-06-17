<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>商城设置</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/orderSet' }">订单设置</el-breadcrumb-item>
          <el-breadcrumb-item>编辑运费模板</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>{{ pageTitle }}</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="order-wrap-padding">
          <div class="edit-wrap">
            <div class="edit-title">模板名称</div>
            <div class="edit-content">
              <el-input v-model="saveForm.templateName" style="width:380px"></el-input>
            </div>
          </div>
          <div class="edit-wrap">
            <div class="edit-title">是否包邮</div>
            <div class="edit-content">
              <el-radio-group v-model="saveForm.freeShipping">
                <el-radio :label="0">自定义运费</el-radio>
                <el-radio :label="1">卖家承担运费</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="edit-wrap" v-if="saveForm.freeShipping == 0">
            <div class="edit-title">运费设置</div>
            <div class="edit-content-table">
              <div class="template-list">
                <div class="template-list-title">
                  <span>默认运费</span>
                  <div class="input-width">
                    <el-input size="small" v-model="saveForm.fristBatchNumber"></el-input>
                  </div>
                  <span>件内</span>
                  <div class="input-width">
                    <el-input size="small" v-model="saveForm.fristBatchCost"></el-input>
                  </div>
                  <span>元，每增加</span>
                  <div class="input-width">
                    <el-input size="small" v-model="saveForm.otherBatchNumber"></el-input>
                  </div>
                  <span>件，运费增加</span>
                  <div class="input-width">
                    <el-input size="small" v-model="saveForm.otherBatchCost"></el-input>
                  </div>
                  <span>元</span>
                </div>
                <el-row class="template-list-wrap" style="background-color:rgba(241, 243, 247, 1);color:#909399">
                  <el-col :span="10">
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
                  <el-col :span="2">
                    <div class="grid-content">
                      操作
                    </div>
                  </el-col>
                </el-row>
                <el-row class="template-list-wrap" v-for="(item, index) in saveForm.subList" :key="item.subFreightTemplateId + index">
                  <el-col :span="9">
                    <div class="grid-content-area">
                      {{ item.areaName }}
                      <a href="javascript:;" v-if="!item.areaName" @click="dialogAreaForm(index)">点击设置地区</a>
                    </div>
                  </el-col>
                  <el-col :span="1">
                    <div class="grid-content">
                      <a href="javascript:;" v-if="item.areaName" @click="dialogAreaForm(index)">编辑</a>
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="grid-content">
                      <el-input size="small" v-model="item.fristBatchNumber"></el-input>
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="grid-content">
                      <el-input size="small" v-model="item.fristBatchCost"></el-input>
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="grid-content">
                      <el-input size="small" v-model="item.otherBatchNumber"></el-input>
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="grid-content">
                      <el-input size="small" v-model="item.otherBatchCost"></el-input>
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="grid-content">
                      <a href="javascript:;" @click="deleteAreaItem(index)">删除</a>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="add-template-list" style="margin-top:10px">
                <a href="javascript:;" @click="addTemplateList">
                  <i class="el-icon-plus"></i>
                  <span>为指定地区设置运费</span>
                </a>
              </div>
            </div>
          </div>
          <div class="comfire-btn" style="padding-bottom:24px">
            <el-button type="primary" @click="saveTemplate">确认保存</el-button>
          </div>
        </div>
        <!-- 地区选择 -->
        <el-dialog title="选择区域" :visible.sync="dialogAreaFormVisible">
          <div style="height:400px;overflow-y:auto">
            <el-tree :data="data2" show-checkbox node-key="id" ref="tree" highlight-current :default-checked-keys="checkedKeys" :props="defaultProps"> </el-tree>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAreaFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
          </div>
        </el-dialog>
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
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      saveForm: {
        templateName: '', //模板名称
        freightTemplateId: '', //模板id ，新建时为空
        freeShipping: 0, // 是否包邮：0否，1是
        fristBatchNumber: '', //默认模板：首件支持的数量
        fristBatchCost: '', //默认模板：首件费用
        otherBatchNumber: '', //默认模板：后续续费的数量
        otherBatchCost: '', //默认模板：后续续费的费用
        subList: []
      },
      saveSellForm: {
        templateName: '', //模板名称
        freightTemplateId: '', //模板id ，新建时为空
        freeShipping: 1, // 是否包邮：0否，1是
        fristBatchNumber: '', //默认模板：首件支持的数量
        fristBatchCost: '', //默认模板：首件费用
        otherBatchNumber: '', //默认模板：后续续费的数量
        otherBatchCost: '', //默认模板：后续续费的费用
        subList: []
      },
      indexItem: 0, // 地区运费子项下标
      checkedKeys: [], //地区运费子项默认选中的值
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      dialogAreaFormVisible: false,
      areaData: [],
      data3: [],
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pageTitle: '新建运费模板'
    };
  },
  mounted() {
    // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
    window.onbeforeunload = function(e) {
      // var storage = window.localStorage;
      // storage.clear();
      localStorage.removeItem('tabName');
    };
    this.getMallDictTree();
    this.templateId = this.$route.params.templateId;
    if (this.templateId !== '-1') {
      this.getTemplateById(this.templateId);
      this.pageTitle = '编辑运费模板';
    }
    // if (typeof this.templateId == 'string' && this.templateId != '') {
    //   this.getTemplateById(this.templateId);
    //   this.pageTitle = '编辑运费模板';
    // }
  },
  computed: {},
  methods: {
    getCheckedNodes() {
      // 确认地区选择
      let arrObj = this.$refs.tree.getCheckedNodes();
      let childrenArr = [];
      for (let i = 0; i < arrObj.length; i++) {
        if (arrObj[i].children) {
          for (let j = 0; j < arrObj[i].children.length; j++) {
            childrenArr.push(arrObj[i].children[j]);
            if (arrObj[i].children[j].children) {
              for (let m = 0; m < arrObj[i].children[j].children.length; m++) {
                childrenArr.push(arrObj[i].children[j].children[m]);
              }
            }
          }
        }
      }
      let comfireArr = [];
      for (let i = 0; i < arrObj.length; i++) {
        let bol = true;
        for (let j = 0; j < childrenArr.length; j++) {
          if (arrObj[i].id == childrenArr[j].id) {
            bol = false;
          }
        }
        if (bol) {
          comfireArr.push(arrObj[i]);
        }
      }
      let index = this.indexItem;
      let areaId = '';
      let areaName = '';
      for (let i = 0; i < comfireArr.length; i++) {
        if (i < comfireArr.length - 1) {
          areaId += comfireArr[i].id + ',';
          areaName += comfireArr[i].label + ',';
        } else {
          areaId += comfireArr[i].id;
          areaName += comfireArr[i].label;
        }
      }
      this.saveForm.subList[index].areaId = areaId;
      this.saveForm.subList[index].areaName = areaName;
      this.dialogAreaFormVisible = false;
    },

    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes([
        {
          id: 5,
          label: '二级 2-1'
        },
        {
          id: 9,
          label: '三级 1-1-1'
        }
      ]);
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3]);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    getMallDictTree() {
      // 获取地区数据
      request.post('/api-mall/mall-dict-tree').then(res => {
        if (res.data.errorCode === 0) {
          this.areaData = res.data.result;
          let data3 = [];
          for (let i = 0; i < res.data.result.length; i++) {
            let itemobj = {};
            itemobj.id = res.data.result[i].partStr;
            itemobj.label = res.data.result[i].partName;
            itemobj.disabled = false;
            itemobj.children = [];
            if (res.data.result[i].node) {
              let arr1 = res.data.result[i].node;
              for (let j = 0; j < arr1.length; j++) {
                let keyObj = {};
                keyObj.id = arr1[j].provinceId;
                keyObj.label = arr1[j].provinceName;
                keyObj.disabled = false;
                keyObj.children = [];
                if (arr1[j].node) {
                  for (let m = 0; m < arr1[j].node.length; m++) {
                    let arr2 = {};
                    arr2.id = arr1[j].node[m].cityId;
                    arr2.label = arr1[j].node[m].cityName;
                    arr2.disabled = false;
                    keyObj.children.push(arr2);
                  }
                }
                itemobj.children.push(keyObj);
              }
            }
            data3.push(itemobj);
          }
          this.data2 = data3;
          this.data3 = data3.concat([]);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getTemplateById(id) {
      //获取模板数据
      let params = {
        templateId: id
      };
      request.post('/api-mall/get-shipping-templates', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          // this.saveForm = res.data.result;
          if (res.data.result.otherBatchNumber) {
            this.saveForm.otherBatchNumber = res.data.result.otherBatchNumber;
          } else {
            this.saveForm.otherBatchNumber = 0;
          }

          if (res.data.result.otherBatchCostStr) {
            this.saveForm.otherBatchCost = res.data.result.otherBatchCostStr;
          } else {
            this.saveForm.otherBatchCost = 0;
          }
          this.saveForm.templateName = res.data.result.templateName;
          this.saveForm.freightTemplateId = res.data.result.freightTemplateId;
          this.saveForm.freeShipping = res.data.result.freeShipping;
          this.saveForm.fristBatchNumber = res.data.result.fristBatchNumber;
          this.saveForm.fristBatchCost = res.data.result.fristBatchCostStr;
          if (res.data.result.subList) {
            for (let item of res.data.result.subList) {
              if (item.otherBatchCostStr) {
                item.otherBatchCost = item.otherBatchCostStr;
              } else {
                item.otherBatchCost = 0;
              }
              if (item.otherBatchNumber) {
                item.otherBatchNumber = item.otherBatchNumber;
              } else {
                item.otherBatchNumber = 0;
              }
            }
          }
          this.saveForm.subList = res.data.result.subList;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    addTemplateList() {
      // 添加运费子项
      let obj = {
        fristBatchNumber: '', //首件支持的数量
        fristBatchCost: '', //首件费用
        otherBatchNumber: 0, //后续续费的数量
        otherBatchCost: 0, //后续续费的费用
        areaName: '', //地区名字
        areaId: '', //地区id
        subFreightTemplateId: '' //id
      };
      this.saveForm.subList.push(obj);
    },
    /*eslint-disable*/
    dialogAreaForm(index) {
      // 设置每个子项的地区数据
      this.dialogAreaFormVisible = true;
      this.data2 = this.data3.concat([]);
      this.checkedKeys = []; //清空选中的值
      this.indexItem = index;
      let disabledArr = []; // 其他子项已选的地区
      let checkedArr = []; // 当前子项已选的地区
      for (let i = 0; i < this.saveForm.subList.length; i++) {
        if (index != i) {
          let arr = this.saveForm.subList[i].areaId.split(',');
          disabledArr = disabledArr.concat(arr);
        } else if (index == i) {
          let arr = this.saveForm.subList[i].areaId.split(',');
          checkedArr = checkedArr.concat(arr);
        }
      }

      for (let i = 0; i < this.data2.length; i++) {
        this.data2[i].disabled = false;
        for (let m = 0; m < this.data2[i].children.length; m++) {
          this.data2[i].children[m].disabled = false;
          for (let n = 0; n < this.data2[i].children[m].children.length; n++) {
            this.data2[i].children[m].children[n].disabled = false;
          }
        }
      }
      for (let i = 0; i < this.data2.length; i++) {
        for (let j = 0; j < disabledArr.length; j++) {
          if (disabledArr[j] == this.data2[i].id) {
            this.data2[i].disabled = true;
            for (let m = 0; m < this.data2[i].children.length; m++) {
              this.data2[i].children[m].disabled = true;
              for (let n = 0; n < this.data2[i].children[m].children.length; n++) {
                this.data2[i].children[m].children[n].disabled = true;
              }
            }
          } else {
            // this.data2[i].disabled = false;
          }
        }
      }
      for (let i = 0; i < this.data2.length; i++) {
        for (let m = 0; m < this.data2[i].children.length; m++) {
          for (let j = 0; j < disabledArr.length; j++) {
            if (disabledArr[j] == this.data2[i].children[m].id) {
              this.data2[i].children[m].disabled = true;
              for (let n = 0; n < this.data2[i].children[m].children.length; n++) {
                this.data2[i].children[m].children[n].disabled = true;
              }
            } else {
              // this.data2[i].children[m].disabled = false;
            }
          }
        }
      }
      for (let i = 0; i < this.data2.length; i++) {
        for (let m = 0; m < this.data2[i].children.length; m++) {
          for (let n = 0; n < this.data2[i].children[m].children.length; n++) {
            for (let j = 0; j < disabledArr.length; j++) {
              if (disabledArr[j] == this.data2[i].children[m].children[n].id) {
                this.data2[i].children[m].children[n].disabled = true;
              } else {
                // this.data2[i].children[m].children[n].disabled = false;
              }
            }
          }
        }
      }
      this.checkedKeys = checkedArr;
    },
    deleteAreaItem(index) {
      // 删除运费子项
      let indexs = index;
      this.$confirm('确认删除该项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.saveForm.subList.splice(indexs, 1);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      // this.saveForm.subList.splice(indexs,1);
    },
    /*eslint-disable*/
    saveTemplate() {
      //保存模板
      if (this.saveForm.templateName == '') {
        this.$message.error('请填写模板名称！！');
        return;
      }
      if (this.saveForm.freeShipping === 0) {
        if (!this.saveForm.fristBatchNumber || !this.saveForm.fristBatchCost || !this.saveForm.otherBatchNumber || !this.saveForm.otherBatchCost) {
          this.$message.error('请填写默认运费');
          return;
        }
      }

      let data = {};
      if (this.saveForm.freeShipping == 1) {
        this.saveSellForm.templateName = this.saveForm.templateName;
        this.saveSellForm.freightTemplateId = this.saveForm.freightTemplateId;
        data = this.saveSellForm;
      } else {
        data = this.saveForm;
      }
      for (let item of this.saveForm.subList) {
        if (item.areaId) {
          if (!(item.fristBatchNumber && item.fristBatchCost)) {
            this.$message.error('请填写首件数或首费');
            return false;
          }
          if (item.otherBatchNumber === '' || item.otherBatchCost === '') {
            if (item.otherBatchNumber != '0' && item.otherBatchCost != '0') {
              this.$message.error('请填写续件数或续费');
              return false;
            }
          }
        }
      }
      data = JSON.stringify(data);
      let params = {
        payload: data
      };
      request.post('/api-mall/add-update-shipping-templates', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('模板保存成功！！');
          this.$router.push({
            name: 'orderSet'
            // params: { tab: 'second' }
          });
        } else {
          this.$message.error(res.data.message);
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
.order-wrap-padding {
  margin: 24px;
  padding: 24px;
  background-color: #fff;
}
.edit-wrap {
  display: flex;
  margin-bottom: 22px;
}
.edit-title {
  width: 80px;
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: #303133;
}
.edit-content {
  line-height: 48px;
}
.edit-content-table {
  width: 100%;
}
.template-list-title {
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: #606266;
  /*padding:0px 10px;*/
  /*background-color:rgba(241,243,247,1);*/
  display: flex;
  margin-bottom: 10px;
}
.input-width {
  width: 80px;
  margin: 0px 10px;
}
.grid-content-right {
  text-align: right;
}
.grid-content-right a {
  margin-left: 10px;
}
.template-list-wrap {
  /*height:48px;*/
  border-bottom: 1px solid #dcdfe6;
  font-size: 13px;
  color: #303133;
  padding: 0px 10px;
}
.grid-content-area {
  /*height:48px;*/
  line-height: 29px;
  padding: 10px 0px;
}
.grid-content {
  height: 48px;
  line-height: 48px;
  width: 82px;
}
.add-template-list {
  color: #409eff;
  font-size: 14px;
  margin: 10px 0px;
}
.comfire-btn {
  margin-left: 80px;
  /*display: flex;
    justify-content: center;*/
}
</style>
