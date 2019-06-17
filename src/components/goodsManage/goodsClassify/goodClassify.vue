<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>商品分类</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="goodsClassify-content">
          <div class="operate-top">
            <div class="fr"><el-button type="primary" @click="newName">新建分组</el-button></div>
          </div>
          <div v-loading="loading">
            <table class="brand-table">
              <thead>
                <tr>
                  <th>分类名称</th>
                  <th>关联商品数</th>
                  <th>
                    <span>是否显示</span>
                    <el-popover placement="top-start" width="200" trigger="hover" content="设置此分类是否在前端小程序显示或隐藏。">
                      <i slot="reference" class="iconfont icon-xinxixianshi"></i>
                    </el-popover>
                  </th>
                  <th>排序</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody v-for="(item, index) in classifyList" :key="index" style="width:100%">
                <tr class="parent-node" :class="index === 0 ? 'first' : ''">
                  <td style="width:300px">
                    <div class="parent-fold">
                      <i :class="item.showStatus ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click="explanNode(index, item.showStatus)"></i>
                      <div class="text-box" v-if="item.editStatus">
                        <span class="tag-name">{{ item.tagName }}</span>
                        <i class="el-icon-edit edit-name" @click="editParentName(item)"></i>
                      </div>
                      <div class="edit-box" v-if="!item.editStatus">
                        <el-input v-model="item.tagName" placeholder="" size="small" class="w-180" @input="value => mainPageNameLimit(value, item)"> </el-input>
                        <span class="operate-span" @click="submitParentName(item)">确定</span>
                        <span class="operate-span" @click="cancelSubmitName">取消</span>
                      </div>
                    </div>
                  </td>
                  <td class="edit-num">{{ item.tagGoodsCount }}<i class="el-icon-edit" @click="editNum(item)"></i></td>
                  <td>
                    <el-switch v-model="item.display" @change="adjustShow(item)"> </el-switch>
                  </td>
                  <td class="icon-sort">
                    <i class="el-icon-download icon-upload" @click="getSort(1, item.mallProTagId, 0)"></i>
                    <i class="iconfont icon-arrowdown icon-up" @click="getSort(2, item.mallProTagId, 0)"></i>
                    <i class="iconfont icon-arrowdown icon-down" @click="getSort(3, item.mallProTagId, 0)"></i>
                    <i class="el-icon-download icon-download" @click="getSort(4, item.mallProTagId, 0)"></i>
                  </td>
                  <td class="operate">
                    <el-button type="text" @click="getLink(item)">推广</el-button>
                    <el-popover placement="top" width="160" v-model="item.visible2">
                      <p style="line-height:1.5;padding: 10px 0px 10px 20px;">确定删除该分类吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="item.visible2 = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="deleteCate(item)">确定</el-button>
                      </div>
                      <el-button slot="reference" type="text">删除</el-button>
                    </el-popover>
                  </td>
                </tr>
                <tr class="children-node" v-for="(i, indx) in item.childTagList" v-show="item.showStatus" :class="indx === 0 ? 'children-first' : ''" :key="indx">
                  <td>
                    <div class="children-fold">
                      <div class="text-box" v-if="i.childrenEditStaus">
                        <span class="tag-name">{{ i.tagName }}</span>
                        <i class="el-icon-edit" @click="editChildrentName(i)"></i>
                      </div>
                      <div class="edit-box" v-if="!i.childrenEditStaus">
                        <el-input v-model="i.tagName" placeholder="" size="small" class="w-180" @input="value => mainPageNameLimit(value, i)"> </el-input>
                        <span class="operate-span" @click="submitChildrenName(i, index)">确定</span>
                        <span class="operate-span" @click="cancelChildrenName(i, index)">取消</span>
                      </div>
                    </div>
                  </td>
                  <!-- <td class="edit-num">{{item.tagGoodsCount}}<i class="el-icon-edit" @click="editNum(item)"></i></td> -->
                  <td class="edit-num">{{ i.tagGoodsCount }}<i class="el-icon-edit" @click="editNum(i)"></i></td>
                  <td></td>
                  <td class="children-sort">
                    <i class="iconfont icon-arrowdown icon-up" @click="getSort(2, i.mallProTagId, item.mallProTagId, index)"></i>
                    <i class="iconfont icon-arrowdown icon-down" @click="getSort(3, i.mallProTagId, item.mallProTagId, index)"></i>
                  </td>
                  <td class="operate">
                    <el-button type="text" @click="getLink(i)">推广</el-button>
                    <el-popover placement="top" width="160" v-model="i.visible2">
                      <p style="line-height:1.5;padding: 10px 10px 20px;">确定删除该分类吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="i.visible2 = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="deleteCate(i, index)">确定</el-button>
                      </div>
                      <el-button slot="reference" type="text">删除</el-button>
                    </el-popover>
                  </td>
                </tr>
                <tr v-show="item.showStatus" class="children-node">
                  <td class="add-edit">
                    <i class="el-icon-circle-plus-outline" @click="addList(item)"></i>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <template>
              <div class="no-data-wrap" v-show="classifyList.length <= 0">
                <div class="no-data-icon">
                  <img src="../../../../static/img/no-data_icon.png" />
                </div>
                <p>暂无数据</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加主分类的弹框 -->
    <el-dialog title="添加主分类" :visible.sync="dialogFormVisible" width="450px" @close="cancelName('modalForm')">
      <el-form :model="modalForm" :rules="modalRules" ref="modalForm" style="width:430px">
        <el-form-item label="一级分类" label-width="80px" prop="mainName">
          <el-input v-model="modalForm.mainName" style="width:300px" @input="value => mainNameLimit(value)">
            <span slot="suffix" style="margin-right:5px;font-size:13px">{{ formLen.mainNameLen }}/8</span>
          </el-input>
        </el-form-item>
        <el-form-item label="二级分类" label-width="80px">
          <el-tag :key="tag" v-for="tag in modalForm.childName" closable :disable-transitions="false" @close="handleClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input class="input-new-tag w-180" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" @input="value => childrenNameLimit(value)">
            <span slot="suffix" style="margin-right:5px;font-size:13px">{{ formLen.childNameLen }}/8</span>
          </el-input>
          <el-button size="small" v-else class="button-new-tag" icon="el-icon-plus" @click="showInput">添加</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelName('modalForm')">取 消</el-button>
        <el-button type="primary" @click="submitName('modalForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加子分类 -->
    <el-dialog title="添加子分类" :visible.sync="dialogFormVisible2" width="450px" @close="cancelChildName('modalChildForm')">
      <el-form :model="modalChildForm" :rules="modalChildRules" ref="modalChildForm" style="width:430px">
        <el-form-item label="子分类" label-width="80px" prop="childrenName">
          <el-input v-model="modalForm.childrenName" style="width:300px" @input="value => childNameLimit(value)">
            <span slot="suffix" style="margin-left:5px">{{ childLen }}/8</span>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelChildName('modalChildForm')">取 消</el-button>
        <el-button type="primary" @click="sumitChildName('modalChildForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 导入商品弹框 -->
    <el-dialog title="批量添加关联商品" :visible.sync="dialogVisible3" width="620px">
      <el-form :model="dialogForm" label-position="right" label-width="80px" v-loading="dialogLoading">
        <el-form-item label="选择文件" required>
          <div class="upload-btn">
            <div>
              <el-upload class="upload-ele" :action="action" :headers="headersUpload" :before-upload="uploadFileBefore" :on-success="uploadFile" with-credentials :show-file-list="showList" :data="uploadData">
                <el-button size="small"><i class="el-icon-upload2" style="margin-right:5px"></i>点击上传</el-button>
              </el-upload>
            </div>
          </div>
          <!-- <a href="javaScript:void(0)" @click="downloadFile">点击下载EXCEL模板</a> -->
          <el-button type="info" plain @click="downloadFile">下载EXCEL模板</el-button>
          <p class="import-info" v-show="importMess">
            本次共导入&nbsp;<span style="font-weight:600">{{ successNum + failNum }}</span
            >&nbsp;个商品，其中成功&nbsp;<span style="font-weight:600">{{ successNum }}</span
            >&nbsp;个，失败&nbsp;<span style="color:#f5222d">{{ failNum }}</span
            >&nbsp;个<a href="javaScript:void(0)" v-show="failNum > 0" style="margin-left:10px" @click="showInfo">查看失败原因</a>
          </p>
        </el-form-item>
        <el-form-item label="导入规则">
          <div class="line"></div>
          <div class="upload-rules">
            <p>1. 每个文件最多300个商品</p>
            <p>2. 只需要填写关联商品的SPU</p>
            <p>3. 仅支持.xlsx .xls文件的导入（建议直接下载模板，在模板的基础上进行数据的填充）</p>
            <p>4. 导入后，请在当前页面等待，系统将很快为您反馈导入结果！！！</p>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <importInfo :importInfo="importInfo"></importInfo>
    <!-- 商品链接弹框 -->
    <eqCodeDialog :modalData="modalData"></eqCodeDialog>
  </div>
</template>

<script>
import qs from 'qs';
import getInputVal from '../../../../static/js/common.js';
import request from '../../../api/request.js';
import importInfo from '../../common/importInfo.vue';
import eqCodeDialog from '../../common/eqCode.vue';
export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      classifyList: [], //数据列表
      modalForm: {
        mainName: '',
        childName: []
      },
      formLen: {
        mainNameLen: 0,
        childNameLen: 0
      },
      modalRules: {
        mainName: [{ required: true, message: '请输入主分类名称', trigger: 'blur' }]
      },
      modalChildForm: {
        childName: ''
      },
      childLen: 0,
      mainNameId: '',
      modalChildRules: {
        childName: [{ required: true, message: '请输入子分类名称', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      inputVisible: false,
      inputValue: '',
      loading: true,

      dialogVisible3: false, //导入商品的弹框
      dialogForm: {},
      showList: false,
      uploadData: {
        tagId: ''
      }, //额外参数
      action: window.location.origin + '/api-mall/import-product-tag-relation?requestProject=mall',
      // action:'http://gicdev.demogic.com/api-mall/import-product-tag-relation?requestProject=mall',
      headersUpload: {
        sign: ''
      },
      dialogLoading: false,
      importMess: false,
      failNum: 0,
      successNum: 0,
      importInfo: {
        //失败原因列表
        dialogVisible: false,
        infoList: []
      },

      modalData: {
        show: false,
        imgUrl: '',
        loading: false
      }
    };
  },
  created() {
    this.getList();
  },

  computed: {},
  methods: {
    mainPageNameLimit(value, item) {
      this.$nextTick(() => {
        item.tagName = getInputVal.getInputVal(value, 8);
      });
    },
    childNameLimit(value) {
      this.$nextTick(() => {
        this.modalForm.childrenName = getInputVal.getInputVal(value, 8);
        this.childLen = getInputVal.getZhLen(this.modalForm.childrenName);
      });
    },
    // 弹框主分类限制
    mainNameLimit(value) {
      this.$nextTick(() => {
        this.modalForm.mainName = getInputVal.getInputVal(value, 8);
        this.formLen.mainNameLen = getInputVal.getZhLen(this.modalForm.mainName);
      });
    },
    // 弹框子分类
    childrenNameLimit(value) {
      this.$nextTick(() => {
        this.inputValue = getInputVal.getInputVal(value, 8);
        this.formLen.childNameLen = getInputVal.getZhLen(this.inputValue);
      });
    },
    // 获取列表
    getList(index) {
      let params = {
        where: 'categoryManage'
      };
      request.get('/api-mall/tag-list', { params }).then(res => {
        if (res.data.errorCode === 0) {
          for (let item of res.data.result) {
            item.showStatus = false;
            item.editStatus = true;
            if (!item.childTagList) {
              item.childTagList = [];
            }
            for (let i of item.childTagList) {
              i.childrenEditStaus = true;
            }
          }
          if (res.data.result) {
            this.classifyList = res.data.result;
          } else {
            this.classifyList = [];
          }

          if (index !== undefined) {
            this.classifyList[index].showStatus = true;
          }
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    // 折叠菜单
    explanNode(index, bol) {
      for (let i of this.classifyList) {
        i.showStatus = false;
      }
      this.classifyList[index].showStatus = !bol;
    },
    // 编辑父级
    editParentName(item) {
      item.editStatus = false;
    },

    // 修改主分类名字
    submitParentName(item) {
      let params = {
        tagId: item.mallProTagId,
        tagName: item.tagName
      };
      request.post('/api-mall/tag-edit', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('更新成功');
          item.editStatus = true;
          this.getList();
        } else {
          this.$message.success(res.data.errorCode);
        }
      });
    },
    // 取消修改
    cancelSubmitName(item) {
      item.editStatus = true;
      this.getList();
    },
    // 编辑子级
    editChildrentName(i) {
      i.childrenEditStaus = false;
    },
    // 修改子分类
    submitChildrenName(i, index) {
      let params = {
        tagId: i.mallProTagId,
        tagName: i.tagName
      };
      request.post('/api-mall/tag-edit', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('更新成功');
          i.childrenEditStaus = true;
          this.getList(index);
        } else {
          this.$message.success(res.data.errorCode);
        }
      });
    },
    // 取消修改子分类
    cancelChildrenName(i, index) {
      i.childrenEditStaus = true;
      this.getList(index);
    },
    // 排序的方法
    getSort(sortType, tagId, parentId, index) {
      let params = {
        sortType: sortType,
        tagId: tagId,
        parentId: parentId
      };
      request.post('/api-mall/tag-sort-operator', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.message);
          this.getList(index);
        } else {
          this.$message.success(res.data.errorCode);
        }
      });
    },
    //是否显示
    adjustShow(item) {
      let params = {
        tagId: item.mallProTagId,
        display: item.display
      };
      item.display = !item.display;
      this.$confirm(item.display ? '确认不显示?' : '确认显示?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.post('/api-mall/tag-update-display', qs.stringify(params)).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success('更新成功');
            this.getList();
          } else {
            this.$message.error(res.data.message);
          }
        });
      });
    },
    // 删除
    deleteCate(item, index) {
      let params = {
        tagId: item.mallProTagId
      };
      request.post('/api-mall/tag-delete', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.message);
          this.getList(index);
        } else {
          this.$message.success(res.data.errorCode);
        }
      });
    },
    // 推广
    getLink(item) {
      this.modalData.loading = true;
      let params = {
        tagId: item.mallProTagId,
        tagName: item.tagName
      };
      this.modalData.show = true;
      request.get('/api-mall/tag-qrCode', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.modalData.show = true;
          this.modalData.pageUrl = res.data.result.page;
          this.modalData.imgUrl = res.data.result.url;
          this.modalData.loading = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 新建分组
    handleClose(tag) {
      this.modalForm.childName.splice(this.modalForm.childName.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 回车生成标签
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.modalForm.childName.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
      this.formLen.childNameLen = 0;
    },
    newName() {
      this.dialogFormVisible = true;
    },
    // 提交新建主分类
    submitName(modalForm) {
      this.$refs[modalForm].validate(valid => {
        if (valid) {
          let childTagNames = this.modalForm.childName.join(',');
          let params = {
            tagName: this.modalForm.mainName,
            parentId: 0,
            childTagNames: childTagNames
          };
          request.get('/api-mall/tag-add', { params }).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('新建成功');
              this.dialogFormVisible = false;
              this.$refs[modalForm].resetFields();
              this.formLen.mainNameLen = 0;
              this.formLen.childNameLen = 0;
              this.getList();
            } else {
              this.$message.error(res.data.errorCode);
            }
          });
        } else {
          return false;
        }
      });
    },
    cancelName(modalForm) {
      this.dialogFormVisible = false;
      this.$refs[modalForm].resetFields();
    },
    // 添加子分类
    addList(item) {
      this.dialogFormVisible2 = true;
      this.mainNameId = item.mallProTagId;
    },
    sumitChildName(modalChildForm) {
      this.$refs[modalChildForm].validate(valid => {
        if (valid) {
          let params = {
            tagName: this.modalForm.childrenName,
            parentId: this.mainNameId
          };
          request.get('/api-mall/tag-child-add', { params }).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('新建成功');
              this.dialogFormVisible2 = false;
              this.childLen = 0;
              this.$refs[modalChildForm].resetFields();
              this.getList();
              this.modalForm.childrenName = '';
            } else {
              this.$message.error(res.data.errorCode);
            }
          });
        } else {
          return false;
        }
      });
    },
    cancelChildName(modalChildForm) {
      this.dialogFormVisible2 = false;
      this.$refs[modalChildForm].resetFields();
    },
    // 导入关联商品
    editNum(item) {
      this.importMess = false;
      this.dialogVisible3 = true;
      this.uploadData.tagId = item.mallProTagId;
    },
    //下载模板
    downloadFile() {
      let url = 'static/商品分类关联导入模板.xlsx';
      window.open(url);
    },
    //上传之前
    uploadFileBefore(file) {
      const isXlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const isCsv = 'application/vnd.ms-excel';
      if (file.type !== isXlsx && file.type !== isCsv) {
        this.$message.error('文件格式错误，请导入.xlsx .csv格式的文件');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.$message.error('请上传小于5MB的文件');
        return false;
      }
      if (localStorage.getItem('sign')) {
        this.headersUpload.sign = localStorage.getItem('sign');
      } else {
        this.headersUpload.sign = '';
      }
      this.dialogLoading = true;
      this.fileName = file.name;
    },
    //上传文件
    uploadFile(file, fileList) {
      this.dialogLoading = true;
      if (file.errorCode === 0) {
        this.dialogLoading = false;
        this.$message.success('导入成功');
        this.importMess = true;
        this.failNum = file.result.failNum;
        this.successNum = file.result.successNum;
        if (file.result.failDetail) {
          this.importInfo.infoList = file.result.failDetail;
        } else {
          this.importInfo.infoList = [];
        }

        this.getList();
      } else {
        this.dialogLoading = false;
        this.$message.error(file.message);
      }
    },
    //查看失败原因】
    showInfo() {
      this.importInfo.dialogVisible = true;
    }
  },
  components: {
    importInfo,
    eqCodeDialog
  }
};
</script>
<style>
.upload-btn .el-upload {
  width: 250px !important;
}
</style>
<style scoped>
.mall-content-title h3 {
  padding: 24px 0 0 0;
}
.w-800 {
  width: 800px;
}
.mall-section {
  margin: 24px;
}
.goodsClassify-content {
  background: #fff;
  padding: 24px;
}
.operate-top {
  height: 32px;
  margin-bottom: 22px;
}
.w_25 {
  width: 25%;
}
.parent-node i {
  cursor: pointer;
}
.children-node i {
  cursor: pointer;
}
.children-node td:first-child {
  padding-left: 55px;
}

.icon-sort .el-icon-download {
  font-size: 22px;
}
.icon-sort .icon-upload {
  display: inline-block;
  transform: rotate(180deg);
  vertical-align: top;
}
.icon-arrowdown {
  font-size: 20px;
}
.icon-sort .icon-up {
  display: inline-block;
  transform: rotate(180deg);
  vertical-align: top;
  margin-top: 2px;
}
.children-sort .icon-up {
  display: inline-block;
  transform: rotate(180deg);
  vertical-align: top;
  margin-top: 2px;
}
.brand-table .first .icon-upload,
.brand-table .first .icon-up {
  cursor: not-allowed;
  color: #e6e6e6;
}
.brand-table .children-first .icon-up {
  cursor: not-allowed;
  color: #e6e6e6;
}
.brand-table tbody tr:last-child .icon-down {
  cursor: not-allowed;
  color: #e6e6e6;
}
.brand-table tbody:last-child .icon-download {
  cursor: not-allowed;
  color: #e6e6e6;
}
.brand-table tbody:last-child .icon-down {
  cursor: not-allowed;
  color: #e6e6e6;
}
.brand-table .children-node:nth-last-child(2) .icon-down {
  cursor: not-allowed;
  color: #e6e6e6;
}
.parent-fold .el-icon-arrow-down,
.parent-fold .el-icon-arrow-right {
  font-size: 20px;
}
.brand-table .el-icon-edit {
  cursor: pointer;
}
.parent-node .el-icon-edit {
  display: none;
}
.parent-fold:hover .edit-name {
  display: inline-block;
}
.edit-num .el-icon-edit {
  margin-left: 5px;
  cursor: pointer;
}
.edit-num:hover .el-icon-edit {
  display: inline-block;
  cursor: pointer;
}
.children-node .el-icon-edit {
  display: none;
}
.children-fold:hover .el-icon-edit {
  display: inline-block;
}
.w-180 {
  width: 180px;
}
.text-box {
  display: inline-block;
}
.edit-box {
  display: inline-block;
}
.edit-box .el-input {
  margin-right: 8px;
}
.add-edit .el-icon-circle-plus-outline {
  font-size: 24px;
  color: #5092e1;
  padding-left: 0px;
  cursor: pointer;
}
.add-edit .el-icon-circle-plus-outline:hover {
  color: #1e6cd5;
}
.el-tag {
  margin-right: 5px;
}
.tag-name {
  height: 32px;
  line-height: 32px;
}
/*暂无数据*/
.no-data-wrap {
  text-align: center;
}
.no-data-wrap p {
  color: #909399;
  font-size: 14px;
}
.brand-table tbody td {
  padding: 8px 15px;
}

/*上传文件*/
.upload-btn {
  height: 30px;
  border: 1px dashed rgba(192, 196, 204, 1);
  display: inline-block;
  font-size: 14px;
  color: #c0c4cc;
  cursor: pointer;
  margin-right: 10px;
  width: 250px;
  text-align: center;
  border-radius: 4px;
}
.import-info {
  color: #606266;
  margin-top: 10px;
}
.upload-ele .el-button {
  border: none;
  color: #c0c4cc;
}
.upload-ele .el-button--small {
  padding: 7px 15px;
}
.upload-btn .el-icon-upload2 {
  font-size: 16px;
  color: #c0c4cc;
}
/*.upload-btn:hover .el-button,.upload-btn .el-button:focus{
   color: #1890ff;
 }*/
/*.upload-btn .upload-ele:hove .el-button{
    color: #1890ff;
 }*/
/*.upload-btn:hover .el-icon-upload2{
    color: #1890ff;
 }*/
.upload-btn:hover {
  border-color: #1890ff;
}
.line {
  border-top: 1px solid #e4e7ed;
  position: absolute;
  left: 0px;
  top: 15px;
  width: 100%;
}
.upload-rules {
  color: #909399;
  font-size: 13px;
  line-height: 18px;
  margin-top: 30px;
}
</style>
