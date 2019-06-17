<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title" style="position:relative;border:none">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
          <el-breadcrumb-item>店铺装修</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>店铺装修</span>
        </h3>
        <!-- <div style="width:800px;position:absolute;left:50%;z-index:1;top:35px;transform: translateX(-50%);">
          <el-alert title="“辅助空白”组件已上线，小程序将不再默认添加空白，请按需求使用此组件设计主页（我们已做兼容处理，老页面仍可维持原样）" type="warning"> </el-alert>
        </div> -->
      </div>
      <div class="mall-section header-style">
        <div class="page-info">
          <h3><i class="el-icon-info"></i>会员的个性化装修已上线，并在装修时注意以下两点：</h3>
          <p>1.当一个会员处于多个会员分组时，可能造成该会员同时命中多个装修页，则可通过排序来设置优先显示的页面。</p>
          <p>2.当一个会员不处于任何一个会员分组时，可能造成该会员无法显示首页，因此必须编辑完成一个“默认首页”，来承接此类会员。</p>
        </div>
        <div class="operate-top">
          <div class="fl">
            <el-input v-model="searchValue" placeholder="请输入页面名称" prefix-icon="el-icon-search" @keyup.enter.native="handleSearch(searchValue)" clearable @clear="handleSearch(searchValue)"> </el-input>
          </div>
          <div class="fr">
            <el-button type="danger" plain @click="deleteBatch">批量删除</el-button>
            <el-button type="primary" @click="newPage">新建页面</el-button>
          </div>
        </div>
        <el-table ref="multipleTable" :data="tableList" style="width: 100%" @sort-change="sortChange" v-loading="loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="pageName" label="页面名称" width="260px">
            <template slot-scope="scope">
              <p v-if="scope.row.editStatus" class="name-tr" style="display:inline-block;">
                <span>{{ scope.row.pageName }}</span>
                <span v-if="scope.row.isDefault === 1 && scope.row.editStatus" class="default-page">默认</span>
                <i class="el-icon-edit" @click="editName(scope.row)"></i>
              </p>

              <div v-if="!scope.row.editStatus">
                <el-input v-model="scope.row.pageName" placeholder="" size="small" class="w-180" @input="value => pageLimit(value, scope.row)" style="width:160px"></el-input>
                <span class="operate-span" @click="editNameSubmit(scope.row)">确定</span>
                <span class="operate-span" @click="editNameCancel(scope.row)">取消</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" sortable="custom" prop="createTime" min-width="160px">
            <template slot-scope="scope">
              <p style="line-height:18px">{{ getTime(scope.row.createTime) }}</p>
              <p style="line-height:18px" class="gray-color">{{ getSeconds(scope.row.createTime) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="最后编辑时间" prop="updateTime" sortable="custom" min-width="160px">
            <template slot-scope="scope">
              <p style="line-height:18px">{{ getTime(scope.row.updateTime) }}</p>
              <p style="line-height:18px" class="gray-color">{{ getSeconds(scope.row.updateTime) }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="isOpen" label="发布状态">
            <template slot-scope="scope">
              <el-switch @change="openStatus(scope.row)" v-model="scope.row.isOpen" :active-value="1" :inactive-value="0" :disabled="scope.row.isDefault === 1"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="适用对象" min-width="160px">
            <template slot-scope="scope">
              <p class="edit-group">
                <span v-if="scope.row.memberLabelType === 2">{{ scope.row.memberTagCount }}个会员分组</span>
                <span v-else>全部会员</span>
                <i v-if="scope.row.isDefault === 0" class="el-icon-edit" @click="editMemberType(scope.row, scope.$index)"></i>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="序号" width="150px" :render-header="renderHeader">
            <template slot-scope="scope">
              <p v-if="scope.row.editNumStatus" class="edit-number">{{ scope.row.sortId }}<i v-if="scope.row.isDefault === 0" class="el-icon-edit" @click="editNumber(scope.row)"></i></p>
              <div v-if="!scope.row.editNumStatus && scope.row.isDefault === 0">
                <el-input v-if="!scope.row.editNumStatus" v-model="scope.row.sortId" placeholder="" size="small" class="w-180" type="number" style="width:60px"></el-input>
                <span class="operate-span" @click="editNumSubmit(scope.row)">确定</span>
                <span class="operate-span" @click="editNumCancel(scope.row)">取消</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="editNewPage(scope.row.pageId)">编辑</el-button>
                <el-popover placement="top" width="160" v-model="scope.row.visible" style="margin-left:8px">
                  <p style="line-height:1.5;padding: 10px 10px 20px;">确定复制该页面吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="copyPage(scope.row)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="text">复制</el-button>
                </el-popover>
                <el-popover placement="top" width="160" v-model="scope.row.visible2" v-if="scope.row.isOpen == 0" style="margin-left:8px">
                  <p style="line-height:1.5;padding: 10px 10px 20px;">确定删除该页面吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="scope.row.visible2 = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteList(scope.row.pageId, scope.$index)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="text">删除</el-button>
                </el-popover>
                <el-button style="margin-left:8px" type="text" v-if="scope.row.isOpen == 1" @click="wechartCode(scope.row)">页面链接</el-button>
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
        <div class="pagination-conteiner" v-show="tableList.length > 0">
          <div class="pagination">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 新建弹框 -->
    <el-dialog title="新建页面" :visible.sync="dialogFormVisible" width="946px" @close="cancelNewPage('modalForm')">
      <el-form :model="modalForm" :rules="modalRules" ref="modalForm">
        <el-form-item label="页面名称" label-width="80px" prop="newPageName">
          <el-input v-model="modalForm.newPageName" style="width:330px" @input="value => pageNameLimit(value)">
            <span slot="suffix" style="margin-right:5px;">{{ newPageNameLen }}/10</span>
          </el-input>
        </el-form-item>
        <el-form-item label="适用对象" label-width="80px" required>
          <template>
            <el-radio v-model="modalForm.memberType" :label="1">全部会员</el-radio>
            <el-radio v-model="modalForm.memberType" :label="2">会员分组</el-radio>
          </template>
        </el-form-item>
        <div v-if="modalForm.memberType === 2" style="margin:-30px 0 0 50px">
          <vue-gic-member-group :defaltSelected="defaltSelected" :height="height" :headerList="headerList" :projectName="projectName" :effectiveStatus="effectiveStatus" @handleDataTransferred="handleDataTransferred" @handleDataLeft="handleDataLeft"> </vue-gic-member-group>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNewPage('modalForm')">取 消</el-button>
        <el-button type="primary" @click="submitNewPage('modalForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 小程序二维码 -->
    <el-dialog title="页面链接" :visible.sync="dialogWechartCode" width="450px">
      <div class="dialog-body">
        <div class="wechat-url" style="margin-bottom:30px;">
          <p style="font-weight: 600;margin-bottom:15px">页面链接</p>
          <div style="display:flex;align-items: center">
            <el-input type="textarea" :rows="2" v-model="pageUrl" disabled> </el-input>
            <a href="javaScript:void(0)" style="width:40px;margin-left:20px" v-clipboard:copy="pageUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">
              复制
            </a>
          </div>
        </div>
        <div class="wechat-img-box" v-loading="loadingModal">
          <img :src="wechatImg" class="wechat-img" />
        </div>
      </div>
    </el-dialog>

    <!-- 编辑会员分组的弹框 -->
    <el-dialog title="编辑适用对象" :visible.sync="dialogVisible" width="946px" @close="cancelEditMemberType">
      <el-form :model="memberModalForm" ref="memberModalForm">
        <el-form-item label="适用对象" label-width="80px" required>
          <template>
            <el-radio v-model="memberModalForm.memberType" :label="1">全部会员</el-radio>
            <el-radio v-model="memberModalForm.memberType" :label="2">会员分组</el-radio>
          </template>
        </el-form-item>
        <div v-if="memberModalForm.memberType === 2" style="margin:-30px 0 0 50px">
          <vue-gic-member-group :defaltSelected="defaltSelected" :height="height" :projectName="projectName" :headerList="headerList" :effectiveStatus="effectiveStatus" @handleDataTransferred="handleDataTransferred" @handleDataLeft="handleDataLeft"> </vue-gic-member-group>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditMemberType">取 消</el-button>
        <el-button type="primary" @click="submitEditMemberType">确 定</el-button>
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
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      getTime: getInputVal.getTime,
      getSeconds: getInputVal.getSeconds,
      tableList: [],
      multipleSelection: [],
      currentPage: 1,
      pageSizes: [20, 40, 60, 80],
      pageSize: 20,
      total: 0,
      searchValue: '', //搜索字段
      sortField: 'updateTime', //排序字段
      sort: 'desc', //排序方式
      modalForm: {
        newPageName: '', //新建页面名
        memberType: 1 //适用对象的类型
      },
      newPageNameLen: 0,
      modalRules: {
        newPageName: [{ required: true, message: '请输入页面名称', trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogWechartCode: false,
      wechatImg: '',
      pageUrl: '',
      loading: true,
      loadingModal: true,
      dialogVisible: false,
      memberModalForm: {
        memberType: 1
      },
      // 会员分组信息
      defaltSelected: [], //  默认穿梭窗已选入数据
      height: 400, // 穿梭窗高度， 默认是543
      projectName: 'mall', // 默认是memberTag
      headerList: [], //表头配置
      effectiveStatus: 1,
      pageId: '' //页面id
    };
  },
  created() {
    // debugger
    this.getTableList();
  },
  directives: {
    focus: {
      // 当绑定元素插入到 DOM 中。
      inserted: function(el) {
        // 聚焦元素
        el.focus();
      }
    }
  },

  computed: {},
  methods: {
    renderHeader(h, { column, $index }, index) {
      return h('span', {}, [h('span', {}, '序号'), h('el-popover', { props: { placement: 'top-start', width: '200', trigger: 'hover', content: '当一个会员命中多个页面时，可通过序号排序来设置优先显示哪个页面。序号越大，优先级越高；序号相同，则编辑时间越晚，优先级越高。' } }, [h('i', { slot: 'reference', class: 'iconfont icon-xinxixianshi' }, '')])]);
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取列表
    getTableList() {
      let params = {
        isIndexPage: 1,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        search: this.searchValue.trim(),
        sortField: this.sortField,
        sort: this.sort
      };
      request.post('/api-mall/mall_page_list', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.result) {
            for (let item of res.data.result.result) {
              item.editStatus = true; //名字编辑的状态
              item.editNumStatus = true; //序号编辑的状态
            }
            this.tableList = res.data.result.result;
            this.total = res.data.result.totalCount;
            this.loading = false;
          } else {
            this.tableList = [];
            this.total = 0;
            this.loading = false;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //分页设置每页的数量
    handleSizeChange: function(size) {
      this.pageSize = size;
      this.getTableList();
    },
    // 分页设置跳转到第几页
    handleCurrentChange: function(page) {
      this.currentPage = page;
      this.getTableList();
    },
    // 批量删除
    deleteBatch() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请至少选择一个');
      } else {
        let arr = [];
        for (let i in this.multipleSelection) {
          if (this.multipleSelection[i].isOpen === 1) {
            this.$message.error('启用中的页面不可以删除');
            return false;
          } else {
            arr.push(this.multipleSelection[i].pageId);
          }
        }
        let params = {
          pageId: arr.join(',')
        };
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            request.post('/api-mall/delete_mall_page', qs.stringify(params)).then(res => {
              if (res.data.errorCode === 0) {
                this.$message.success('删除成功');
                this.getTableList();
              } else {
                this.$message.error(res.data.message);
              }
            });
          })
          .catch(() => {});
      }
    },
    // 单条删除
    deleteList(id, index) {
      let params = {
        pageId: id
      };
      request.post('/api-mall/delete_mall_page', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.tableList.splice(index, 1);
          if (this.tableList.length === 0) {
            if (this.currentPage > 1) {
              this.currentPage = this.currentPage - 1;
            }
          }
          this.$message.success('删除成功');
          this.getTableList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 编辑页面
    editNewPage(pageId) {
      this.$router.push({
        name: 'newPage',
        params: {
          pageId: pageId
        }
      });
    },
    // 小程序链接
    wechartCode(item) {
      let params = {
        type: 0,
        pageId: item.pageId,
        enterpriseId: item.enterpriseId
      };
      this.dialogWechartCode = true;
      this.loadingModal = true;
      request.post('/api-mall/mallpage-qrcode', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.wechatImg = res.data.result.url;
          this.pageUrl = res.data.result.page;
          this.loadingModal = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //新建页面
    newPage() {
      this.dialogFormVisible = true;
      this.modalForm.memberType = 1; //会员分组类型
      this.defaltSelected = []; //选中的会员分组
    },
    // 复制页面
    copyPage(item) {
      let params = {
        pageId: item.pageId
      };
      request.post('/api-mall/mall_page_copy', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('复制页面成功');
          this.getTableList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 确定新建
    submitNewPage(modalForm) {
      this.$refs[modalForm].validate(valid => {
        if (valid) {
          //校验通过

          let memberLabelId;

          if (this.defaltSelected.length < 1 && this.modalForm.memberType === 2) {
            this.$message.error('请选择会员分组');
            return false;
          }
          if (this.modalForm.memberType === 1) {
            memberLabelId = '';
          } else if (this.modalForm.memberType === 2) {
            memberLabelId = [];
            for (let item of this.defaltSelected) {
              //获取会员分组
              memberLabelId.push(item.memberTagGroupId);
            }
            memberLabelId = memberLabelId.join(',');
          }

          let params = {
            pageName: this.modalForm.newPageName,
            isIndexPage: 1,
            memberLabelType: this.modalForm.memberType,
            memberLabelId: memberLabelId
          };
          request.post('/api-mall/add_mall_home_page', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('新建成功');
              this.dialogFormVisible = false;
              this.getTableList(); //拉取列表
              this.$refs[modalForm].resetFields();
              let pageId = res.data.result;
              this.$router.push({
                name: 'newPage',
                params: {
                  pageId: pageId
                }
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 取消新建
    cancelNewPage(modalForm) {
      this.dialogFormVisible = false;
      this.modalForm.newPageName = '';
      this.modalForm.memberType = 1; //会员分组类型
      this.defaltSelected = []; //选中的会员分组
      this.$refs[modalForm].resetFields();
    },
    // 编辑名字
    editName(item) {
      item.editStatus = false;
    },
    // 编辑序号
    editNumber(item) {
      item.editNumStatus = false;
    },
    //完成编辑序号
    editNumSubmit(item) {
      let params = {
        pageId: item.pageId,
        sortId: item.sortId
      };
      request.post('/api-mall/mall_page_update_for_sort', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('新建成功');
          item.editNumStatus = true;
          this.getTableList(); //拉取列表
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 取消编辑序号
    editNumCancel(item) {
      item.editNumStatus = true;
    },
    // 确定编辑名字
    editNameSubmit(item) {
      let params = {
        pageId: item.pageId,
        pageName: item.pageName,
        isOpen: item.isOpen,
        isIndexPage: 1
      };
      request.post('/api-mall/update_mall_page', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('更新成功');
          this.getTableList();
          item.editStatus = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 取消名字编辑
    editNameCancel(item) {
      item.editStatus = true;
      this.getTableList();
    },
    // 编辑适用对象
    editMemberType(item, index) {
      this.pageId = item.pageId;
      if (item.tagGroupList) {
        this.defaltSelected = item.tagGroupList;
      } else {
        this.defaltSelected = [];
      }
      // this.defaltSelected=item.tagGroupList
      if (item.memberLabelType) {
        this.memberModalForm.memberType = item.memberLabelType;
      } else {
        this.memberModalForm.memberType = 1;
      }
      //
      this.dialogVisible = true;
    },
    // 确定编辑适用对象
    submitEditMemberType() {
      if (this.defaltSelected.length < 1 && this.memberModalForm.memberType === 2) {
        //没有选择会员分组
        this.$message.error('请选择会员分组');
        return false;
      }
      let memberIds;
      if (this.memberModalForm.memberType === 1) {
        memberIds = '';
      } else if (this.memberModalForm.memberType === 2) {
        memberIds = [];
        for (let item of this.defaltSelected) {
          memberIds.push(item.memberTagGroupId);
        }
        memberIds = memberIds.join(',');
      }

      let params = {
        tagIds: memberIds,
        pageId: this.pageId,
        memberLabelType: this.memberModalForm.memberType
      };
      request.post('/api-mall/mall_page_update_for_member', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('更新成功');
          this.getTableList();
          this.dialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //取消编辑使用对象
    cancelEditMemberType() {
      this.dialogVisible = false;
      this.memberModalForm.memberType = 1; //会员分组类型
      this.defaltSelected = []; //选中的会员分组
    },
    openStatus(item) {
      let params = {
        pageId: item.pageId,
        pageName: item.pageName,
        isOpen: 1,
        isIndexPage: 1
      };
      if (item.isOpen === 1) {
        //启用
        item.isOpen = 0;
        params.isOpen = 1;
      } else if (item.isOpen === 0) {
        item.isOpen = 1;
        params.isOpen = 0;
      }
      this.$confirm(item.isOpen == 1 ? '确认停用这个页面吗?' : '确认启用这个页面吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request.post('/api-mall/update_mall_page', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message({
                type: 'success',
                message: '更新成功!'
              });
              this.getTableList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      // if(item.isOpen===0){
      //   this.$confirm('启用中的页面不可以停用?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //   }).catch(() => {
      //   });
      //   item.isOpen = 1
      // }else{//启用
      //   item.isOpen = 0
      //   let params={
      //     pageId:item.pageId,
      //     pageName:item.pageName,
      //     isOpen:1,
      //     isIndexPage:1
      //   }
      //   this.$confirm('确认启用这个页面吗?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     request.post('/api-mall/update_mall_page',qs.stringify(params)).then(res => {
      //       if(res.data.errorCode===0){
      //         this.$message({
      //           type: 'success',
      //           message: '更新成功!'
      //         });
      //         this.getTableList()
      //       }else{
      //         this.$message.error(res.data.message);
      //       }
      //     })
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消'
      //     });
      //   });
      // }
    },
    //字符限制
    pageNameLimit(value) {
      this.$nextTick(() => {
        this.modalForm.newPageName = getInputVal.getInputVal(value, 10);
        this.newPageNameLen = getInputVal.getZhLen(this.modalForm.newPageName);
      });
    },
    // 页面限制
    pageLimit(value, item) {
      this.$nextTick(() => {
        item.pageName = getInputVal.getInputVal(value, 10);
      });
    },
    // 搜索筛选
    handleSearch(value) {
      this.currentPage = 1;
      this.searchValue = value;
      this.getTableList();
    },
    //排序
    sortChange(value) {
      this.sortField = value.prop;
      if (value.order == 'ascending') {
        this.sort = 'asc';
      } else if (value.order == 'descending') {
        this.sort = 'desc';
      }
      if (value.order === null) {
        this.sortField = 'createTime';
      }
      this.getTableList();
    },
    // 时间戳转换成年月日
    // getTime: function(time) {
    //   if (!isNaN(time)) time = Number(time);
    //   var now = new Date(time);
    //   var year = now.getFullYear();
    //   var month = now.getMonth() + 1;
    //   month >= 10 ? (month = month) : (month = '0' + month); //判断小于10月份的情况
    //   var date = now.getDate();
    //   date >= 10 ? (date = date) : (date = '0' + date); //判断小于10日的情况
    //   return year + '-' + month + '-' + date;
    // },
    // 时间戳转换成时分秒
    // getSeconds: function(time) {
    //   if (!isNaN(time)) time = Number(time);
    //   var now = new Date(time);
    //   var hour = now.getHours();
    //   hour >= 10 ? (hour = hour) : (hour = '0' + hour); //判断小于10的时的情况
    //   var minute = now.getMinutes();
    //   minute >= 10 ? (minute = minute) : (minute = '0' + minute); //判断小于10的分的情况
    //   var second = now.getSeconds();
    //   second >= 10 ? (second = second) : (second = '0' + second); //判断小于10的秒的情况
    //   return hour + ':' + minute + ':' + second;
    // },
    onCopy(e) {
      this.$message.success('复制成功');
    },
    onError(e) {
      this.$message.error('复制失败');
    },
    // 会员分组事件
    /**
     * 选择分组后子组件触发的事件
     */
    /**
     * selectedData 穿梭窗已选入数据
     * selectionToTransfer 本次选择的数据
     */
    handleDataTransferred(data) {
      this.defaltSelected = data;
    },
    /**
     * selectedData 剔除后剩下的数据
     * selectionToRemove 剔除的数据
     */
    handleDataLeft(selectedData, selectionToRemove) {
      this.defaltSelected = selectedData;
    }
  },
  components: {}
};
</script>
<style>
.el-input__suffix {
  font-size: 13px;
  font-size: 13px;
  color: #909399;
}
.header-style .icon-xinxixianshi {
  margin-left: 5px;
  color: #909399;
  font-size: 14px;
  cursor: pointer;
}
</style>
<style scoped>
.mall-section {
  margin: 24px;
  background: #fff;
  padding: 24px;
}
.operate-top {
  height: 32px;
  margin-bottom: 22px;
}
.operate-top .fr {
  font-size: 0;
}
.w-180 {
  width: 180px;
}
.name-tr .el-icon-edit {
  display: none;
}

.name-tr:hover .el-icon-edit {
  display: inline-block;
  cursor: pointer;
}
.wechat-img-box {
  margin: 0 auto;
  text-align: center;
}
.wechat-img {
  width: 200px;
  height: 200px;
}
.page-info {
  padding: 8px 16px;
  box-sizing: border-box;
  border-radius: 4px;
  background: #f4f4f5;
  color: #606266;
  margin-bottom: 22px;
  line-height: 1.5;
}
.page-info h3 {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
}
.page-info .el-icon-info {
  color: #1890ff;
  margin-right: 10px;
  font-size: 14px;
}
.page-info p {
  font-size: 12px;
}
.edit-group .el-icon-edit {
  margin-left: 5px;
  cursor: pointer;
  display: none;
}
.edit-number .el-icon-edit {
  margin-left: 5px;
  cursor: pointer;
  display: none;
}
.edit-group:hover .el-icon-edit {
  display: inline-block;
}
.edit-number:hover .el-icon-edit {
  display: inline-block;
}
/*默认页面*/
.default-page {
  display: inline-block;
  padding: 2px 4px 1px 4px;
  border-radius: 2px;
  color: #fff;
  background: #409eff;
  font-size: 12px;
  -webkit-transform: scale(0.84, 0.84);
  *font-size: 10px;
  line-height: 12px;
  text-align: center;
  margin-top: -10px;
  position: relative;
  top: -6px;
}
</style>
