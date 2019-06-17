<template>
  <div class="mall-section-container-right">
    <div class="mall-content-section">
      <!-- <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>图片空间</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>图片空间</span>
        </h3>
      </div> -->
      <div class="mall-section">
        <div class="operate-top">
          <el-select style="width:130px" v-model="quoteStatus" placeholder="全部状态" clearable @change="getSearchImgList">
            <el-option label="已引用" :value="1"></el-option>
            <el-option label="未引用" :value="0"></el-option>
          </el-select>
          <div class="search-box">
            <el-input v-model="searchParams" placeholder="请输入图片名称/文件夹名称" prefix-icon="el-icon-search" clearable class="w-260" @clear="getSearchImgList" @keyup.enter.native="getSearchImgList"> </el-input>
          </div>
        </div>
        <div class="space-list-container">
          <div class="space-list-title">
            <div class="fl">
              <el-checkbox v-model="checked" class="check-box" v-if="activeIndex === '2'" @change="selectAll" :disabled="tableData.length === 0">全选</el-checkbox>
              <el-button type="text" @click="moveFile('-1')">移动</el-button>
              <el-button type="text" @click="deleteFile('-1')">删除</el-button>
              <el-button type="text" @click="newFileClick">新建文件夹</el-button>
              <el-button type="text" @click="matchImg('-1')">匹配图片</el-button>
              <el-popover placement="right" width="400" trigger="hover" style="margin-left:-4px">
                <p>匹配规则如下：</p>
                <p>只有文件夹可勾选匹配，单张图片不可匹配</p>
                <p>文件夹命名规则如下：</p>
                <p>第一层文件夹：文件夹名称【款号】</p>
                <p>第二层文件夹：</p>
                <p>文件夹名称【主图】：01，02</p>
                <p>文件夹名称【颜色图】：色号</p>
                <p>文件夹名称【详情页】：01，02</p>
                <el-button slot="reference" type="text"><i class="iconfont icon-xinxixianshi"></i></el-button>
              </el-popover>
              <el-button type="text" @click="matchImg2('-1')">匹配门店商品图片</el-button>

              <el-popover placement="right" width="400" trigger="hover" style="margin-left:-4px">
                <p>匹配规则如下：</p>
                <p>只有图片可勾选匹配</p>
                <p>文件夹命名规则如下：</p>
                <p>货号-1，货号-2（当有多张主图时</p>
                <p>或者直接使用货号</p>
                <p>货号（当只需要一张主图时）</p>
                <el-button slot="reference" type="text"><i class="iconfont icon-xinxixianshi"></i></el-button>
              </el-popover>
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
              <el-button type="primary" @click="uploadFolder"><i class="el-icon-upload" style="margin-right:4px"></i>上传图片</el-button>
              <!-- <label for="upload">
                <span class="upload-btn" ><i class="el-icon-upload" style="margin-right:4px"></i>上传图片</span>
                <input style="display: none;" id="upload" type="file" @change="beforeUpload"></input>
              </label> -->
              <!-- </el-upload> -->
              <el-button plain @click="goNextPage">图片回收站</el-button>
            </div>
          </div>
          <div class="space-list-content">
            <imgList v-if="activeIndex === '1'" :tableData="tableData" @deleteFile="deleteFile" @beforeDelete="beforeDelete" @moveFile="moveFile" :parentId="parentId" @getDbClick="getDbClick" @getImgList="getImgList" @getMatchName="getMatchName" @moveObj="moveObj"> </imgList>
            <imgCard v-if="activeIndex === '2'" :shuaxin="shuaxin" :tableData="tableData" @deleteFile="deleteFile" @moveFile="moveFile" @getImgList="getImgList" @changeStatus="changeStatus" :parentId="parentId" @getDbClick="getDbClick" @getTree="getTree"> </imgCard>
            <div class="pagination-conteiner" v-show="tableData.length > 0">
              <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新建文件夹  -->
    <el-dialog title="新建文件夹" :visible.sync="dialogFormVisible" width="600px" @close="cancelNewFile('newFileForm')">
      <el-form :model="newFileForm" :rules="newFileRules" ref="newFileForm" label-width="120px">
        <el-form-item label="所属上级文件夹" prop="newParentId">
          <treeselect v-model="newFileForm.newParentId" :multiple="false" :options="moveData" size="small" placeholder="请选择" style="width:408px" />
        </el-form-item>
        <el-form-item label="文件夹名称" prop="fileName">
          <el-input v-model="newFileForm.fileName" style="width:400px" @input="value => fileNameLimit(value)">
            <span slot="suffix" style="margin-right:5px;">{{ fileNameLen }}/20</span>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNewFile('newFileForm')">取 消</el-button>
        <el-button type="primary" @click="submitNewFile('newFileForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 转移文件弹框 -->
    <el-dialog title="转移文件" :visible.sync="dialogFormVisible2" width="450px">
      <treeselect v-model="moveParentId" :multiple="false" :options="moveData" size="small" placeholder="请选择" style="width:408px" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitMoveFile">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传文件夹弹框 -->
    <el-dialog title="上传图片" :visible.sync="dialogFormVisible3" width="700px">
      <el-form :model="uploadForm" ref="uploadForm" label-width="120px" class="tree-delete-hidden">
        <el-form-item label="所属上级文件夹">
          <treeselect v-model="uploadForm.uploadParentId" :multiple="false" :options="moveData" size="small" placeholder="全部图片" style="width:500px" />
        </el-form-item>
        <el-form-item>
          <vue-gic-space id="dropzone" ref="myDropzone" :clearable="clearable" :options="dropzoneOptions" :action="folderUrl" :parentId="uploadForm.uploadParentId" :useCustomSlot="true" @upload-complete="uploadComplete">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将图片或文件夹拖到此处上传，或点击<b>上传</b>图片</div>
            <div class="upload-tips">仅支持5M以内的jpg、png、gif格式的图片</div>
          </vue-gic-space>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible3 = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs';
import getInputVal from '../../../../static/js/common.js';
import request from '../../../api/request.js';
import imgList from './imgList.vue';
import imgCard from './imgCard.vue';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      quoteStatus: '', //图片引用状态0未引用，1引用
      searchParams: '', //搜索关键字
      checked: false, //是否全选
      sortType: 'timeDesc', //排序timeAsc(由老到新)， sizeAsc(大小-由小到大)， sizeDesc（大小-由大到小）， nameAsc（名称-升序）， nameDesc（名称-降序）
      activeIndex: '2', //选中状态
      currentPage: 1,
      pageSize: 20,
      pageSizes: [20, 40, 60, 80],
      total: 0,
      tableData: [],
      deleteIds: '', //删除的文件ids
      dialogFormVisible: false, //新建文件夹弹框
      newFileForm: {
        fileName: '',
        newParentId: null //转移的文件夹的id
      }, //文件夹弹框数据
      moveData: [], //转移文件数据
      defaultOptions: {
        children: 'chlidren',
        label: 'name'
      },
      newFileRules: {
        fileName: [{ required: true, message: '请输入文件夹名称', trigger: 'blur' }],
        newParentId: [{ required: true, message: '请选择所属文件夹', trigger: 'blur' }]
      },
      fileNameLen: 0,
      action: window.location.origin + '/api-mall/gic-cloud-image-upload?requestProject=mall',
      // action:'http://gicdev.demogic.com/api-mall/gic-cloud-image-upload',
      uploadData: {},
      dialogFormVisible2: false, //转移文件
      moveParentId: null, //转移的父id
      moveIds: '', //要移动的id
      shuaxin: false,
      parentId: '', //父节点id
      matchNameArr: [], //匹配文件的名字
      moveFolderArr: [], //转移的文件夹的id
      moveTableObj: [],

      // 上传图片文件夹
      uploadFolderData: [],
      clearable: true,
      dialogFormVisible3: false, //文件夹弹框
      uploadForm: {
        uploadParentId: null
      },
      dropzoneOptions: {
        autoProcessQueue: false,
        // url: 'http://gicdev.com/api-mall/gic-cloud-image-upload?requestProject=mall', // 上传地址
        url: window.location.origin + '/api-mall/gic-cloud-image-upload?requestProject=mall', // 上传地址
        headers: { 'Gic-Header': 'header value' }
      },
      group: 'mall',
      folderUrl: window.location.origin + '/api-mall/gic-cloud-image-createUploadFolder?requestProject=mall',
      // folderUrl:'http://gicdev.com/api-mall/gic-cloud-image-createUploadFolder?requestProject=mall',
      matchOnlyImg: [],
      matchOnlyImgCode: []
    };
  },
  created() {
    // this.getImgList()//获取
  },

  computed: {},
  methods: {
    //调用树数据
    getTree() {
      this.$emit('getTree'); //更新树数据
    },
    // 切换左侧全选取消
    cancelCheckAll() {
      this.checked = false;
    },
    //切换事件
    toggleClick(value) {
      this.currentPage = 1;
      this.pageSize = 20;
      this.sortType = 'timeDesc';
      this.searchParams = '';
      this.quoteStatus = '';
      if (value === '1') {
        this.activeIndex = '1';
      } else if (value === '2') {
        this.activeIndex = '2';
      }
      this.checked = false;
      this.getImgList();
    },
    // 从父级获取id
    getParentId(id) {
      this.parentId = id;
      this.currentPage = 1;
      this.getImgList();
    },
    // 双击文件夹事件
    getDbClick(id) {
      this.parentId = id;
      this.searchParams = '';
      this.currentPage = 1;
      this.getImgList();
    },
    //获取列表事件
    getImgList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        sortType: this.sortType,
        parentId: this.parentId ? this.parentId : '', //父组件传递来的
        searchParams: this.searchParams.trim(),
        quoteStatus: this.quoteStatus
      };
      request.get('/api-mall/gic-cloud-image-list', { params }).then(res => {
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
    //删除前的赋值，（主要针对批量的删除）
    beforeDelete(val) {
      this.deleteIds = val; //批量删除的id
      // this.moveIds=val//批量转移的id
    },
    // 删除操作
    deleteFile(ids) {
      let params = {
        ids
      };
      if (ids === '-1') {
        //批量删除
        if (this.activeIndex === '2') {
          //卡片形式
          let idsArr = [];
          for (let item of this.tableData) {
            if (item.selectItem) {
              idsArr.push(item.id);
            }
          }
          if (idsArr.length <= 0) {
            this.$message.error('请选择要删除的文件');
            return false;
          } else {
            params.ids = idsArr.join(',');
          }
        } else {
          //表格形式
          params.ids = this.deleteIds;
          if (this.deleteIds === '' || !this.deleteIds) {
            this.$message.error('请选择要删除的文件');
            return false;
          }
        }
      } else {
        //单个删除
        params.ids = ids;
      }
      this.$confirm('此操作删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //确定删除
          request.get('/api-mall/gic-cloud-image-delete', { params }).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('删除成功!');
              this.getImgList(); //请求列表
              this.$emit('getFileData'); //获取文件夹数据
              this.getTreeData();
              this.checked = false;
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          return false;
        });
    },
    // 转移的列表返回的对象
    moveObj(obj) {
      //表格
      this.moveTableObj = obj;
      let moveIdArr = []; //选中的要移动的文件
      let folder = []; //文件夹的id
      let matchOnlyImg = [];
      let matchOnlyImgCode = [];
      for (let item of obj) {
        moveIdArr.push(item.id);
        if (item.type === 'folder') {
          //文件夹的id
          folder.push(item.id);
        } else if (item.type === 'image') {
          matchOnlyImg.push(item.imgUrl);
          matchOnlyImgCode.push(item.name);
        }
      }
      this.moveFolderArr = folder;
      this.moveIds = moveIdArr.join(',');
      this.matchOnlyImg = matchOnlyImg;
      this.matchOnlyImgCode = matchOnlyImgCode;
    },
    // 获取要匹配的文件名字
    getMatchName(val) {
      if (this.activeIndex === '1') {
        //列表
        this.matchNameArr = val;
      }
    },
    // 匹配图片
    matchImg() {
      let params = {
        proNos: ''
      };
      if (this.activeIndex === '1') {
        if (this.matchNameArr.length <= 0) {
          this.$message.error('请选择要匹配的文件');
          return false;
        } else {
          params.proNos = this.matchNameArr.join(',');
        }
      } else if (this.activeIndex === '2') {
        let nameArr = [];
        for (let item of this.tableData) {
          if (item.selectItem && item.type === 'folder') {
            nameArr.push(item.name);
          }
        }
        if (nameArr.length <= 0) {
          this.$message.error('请选择要匹配的文件');
          return false;
        } else {
          params.proNos = nameArr.join(',');
        }
      }
      request.get('/api-mall/gic-cloud-image-matching', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('正在匹配中，请耐心等待');
          this.checked = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 匹配积分商城图片
    matchImg2() {
      let params = {
        proCodes: '',
        mainImgs: ''
      };
      let proCodeArr = [];
      let mainImgArr = [];
      if (this.activeIndex === '1') {
        if (this.matchOnlyImgCode.length === 0) {
          this.$message.error('请选择要匹配的图片');
          return false;
        }
        params.proCodes = this.matchOnlyImgCode.join(',');
        params.mainImgs = this.matchOnlyImg.join(',');
      } else if (this.activeIndex === '2') {
        //卡片形式
        let status = this.tableData.every(item => {
          return item.type === 'folder';
        });
        if (status) {
          //全为文件夹
          this.$message.error('请选择要匹配的图片');
          return false;
        }
        for (let item of this.tableData) {
          if (item.type === 'image' && item.selectItem) {
            proCodeArr.push(item.name);
            mainImgArr.push(item.imgUrl);
          }
        }
        params.proCodes = proCodeArr.join(',');
        params.mainImgs = mainImgArr.join(',');
      }
      request.post('/api-mall/goods-image-matching', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('正在匹配中，请耐心等待');
          this.checked = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
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

    //新建文件夹字数限制
    fileNameLimit(value) {
      this.$nextTick(() => {
        this.newFileForm.fileName = getInputVal.getInputVal(value, 20);
        this.fileNameLen = getInputVal.getZhLen(this.newFileForm.fileName);
      });
    },
    //新建文件夹
    newFileClick() {
      this.getFileData();
      //清空上次的数据
      this.newFileForm.fileName = '';
      this.newFileForm.newParentId = null;
      this.dialogFormVisible = true;
    },
    //获取要转移的文件
    getFileData() {
      request.get('/api-mall/gic-cloud-image-group-list').then(res => {
        if (res.data.errorCode === 0) {
          this.moveData = res.data.result;
          this.getTreeData(this.moveData);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getTreeData(data) {
      for (let i in data) {
        data[i].label = data[i].name;
        data[i].children = data[i].chlidren;
        if (data[i].children.length) {
          this.getTreeData(data[i].children);
        } else {
          delete data[i].children;
        }
      }
    },
    //文件夹的形式
    getFileDateFolder(folder) {
      let params = {
        folderIds: folder
      };
      request.get('/api-mall/gic-cloud-image-group-moveList', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.moveData = res.data.result;
          this.getTreeData(this.moveData);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 确认新建
    submitNewFile(newFileForm) {
      this.$refs[newFileForm].validate(valid => {
        if (valid) {
          let params = {
            parentId: this.newFileForm.newParentId,
            groupName: this.newFileForm.fileName
          };
          request.get('/api-mall/gic-cloud-image-createFolder', { params }).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('新建成功');
              this.dialogFormVisible = false;
              this.getImgList(); //获取列表
              this.$emit('getFileData');
              this.getTreeData();
              this.checked = false;
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 取消
    cancelNewFile(newFileForm) {
      this.$refs[newFileForm].resetFields();
      this.dialogFormVisible = false;
    },

    //上传文件夹
    uploadFolder() {
      request.get('/api-mall/gic-cloud-image-group-list').then(res => {
        if (res.data.errorCode === 0) {
          this.moveData = res.data.result;
          this.uploadForm.uploadParentId = res.data.result[0].id;
          this.getTreeData(this.moveData);
        } else {
          this.$message.error(res.data.message);
        }
      });
      this.dialogFormVisible3 = true;
    },
    uploadComplete() {
      this.getImgList(); //获取列表
      this.$emit('getFileData'); //左侧树结构数据
      this.dialogFormVisible3 = false;
    },
    //上传图片
    beforeUpload(e) {
      let formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('parentId', this.parentId);

      let img = e.target.files[0];
      let reader = new FileReader();
      reader.onload = function(event) {
        let data = event.target.result;
        let image = new Image();
        // image.onload=function(){
        //   let width = image.width;
        //   let height = image.height;

        // };
        image.src = data;
      };
      reader.readAsDataURL(img);
      if (img.type !== 'image/jpeg' && img.type !== 'image/png') {
        e.target.value = '';
        this.$message.error('请上传jpg，png格式的图片');

        return false;
      }
      if (img.size > 5 * 1024 * 1024) {
        //大于5M
        e.target.value = '';
        this.$message.error('请上传小于5MB的图片');

        return false;
      }
      request.post('/api-mall/gic-cloud-image-upload', formData).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('上传成功');
          e.target.value = '';
          this.getImgList(); //获取列表
        } else {
          e.target.value = '';
          this.$message.error(res.data.message);
        }
      });
    },
    moveFile(id, type) {
      //type为1是图片，为2是文件夹
      if (id === '-1') {
        //批量转移点击事件
        if (this.activeIndex === '2') {
          //卡片形式
          let idsArr = [];
          let folderCardArr = [];
          for (let item of this.tableData) {
            if (item.selectItem) {
              idsArr.push(item.id);
              if (item.type === 'folder') {
                folderCardArr.push(item.id);
              }
            }
          }
          if (idsArr.length <= 0) {
            this.$message.error('请选择要移动的文件');
            return false;
          } else {
            this.moveIds = idsArr.join(',');
          }

          let listStatus = folderCardArr.every(i1 => {
            return i1.type === 'image';
          });
          if (listStatus) {
            //全为图片
            this.getFileData(); //获取数据
          } else {
            //不全为图片
            let ids;
            ids = folderCardArr.join(',');
            this.getFileDateFolder(ids); //单个文件夹请求的
          }
        } else {
          //表格形式
          let testStatus = this.moveTableObj.every(i => {
            return i.type === 'image';
          });
          if (testStatus) {
            //选中的全是图片
            this.getFileData();
          } else {
            //不全为图片、
            let folderids;
            folderids = this.moveFolderArr.join(',');
            this.getFileDateFolder(folderids);
          }
          if (this.moveIds === '' || !this.moveIds) {
            this.$message.error('请选择要移动的文件');
            return false;
          }
        }
      } else {
        //单个文件的转移
        if (type === 1) {
          //type为1是图片
          this.getFileData(); //获取数据
        } else if (type === 2) {
          //为2是文件夹
          this.getFileDateFolder(id); //单个文件夹请求的
        }
        this.moveIds = id;
      }

      (this.dialogFormVisible2 = true), (this.moveParentId = null);
    },
    // 确定转移函数
    submitMoveFile() {
      let params = {
        moveIds: this.moveIds,
        moveToId: this.moveParentId
      };
      if (!this.moveParentId) {
        this.$message.error('请选择要移动到的文件夹名称');
        return false;
      } else {
        request.get('/api-mall/gic-cloud-image-move', { params }).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success('移动成功');
            this.dialogFormVisible2 = false;
            this.getImgList(); //获取列表
            this.$emit('getFileData'); //左侧树结构数据
            this.checked = false;
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    //子组件改变父组件状态
    changeStatus(item, num, bol) {
      if (num === 1) {
        //编辑状态切换
        item.editStatus = bol;
      }
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
    },
    //跳转到回收站
    goNextPage() {
      this.$router.push('imgRecycleList');
    }
  },
  components: {
    imgList,
    imgCard,
    Treeselect
  }
};
</script>
<style>
.tree-delete-hidden .vue-treeselect__x-container {
  display: none;
}
</style>
<style scoped>
.mall-section-container-right {
  width: 100%;
  height: 100%;
  /*margin-top:0px;*/
}
.mall-content-section {
  width: 100%;
}
.mall-section {
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
  margin-top: 16px;
}
.upload-btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-color: #dcdfe6;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 8px 15px;
  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;
  margin-right: 5px;
}
.upload-btn:hover {
  background: #40a9ff;
  border-color: #40a9ff;
  color: #fff;
}
.icon-xinxixianshi {
  font-size: 14px;
  color: #909399;
  cursor: pointer;
}
</style>
