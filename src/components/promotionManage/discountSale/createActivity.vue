<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>促销活动</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/discountSale' }">折扣/减价</el-breadcrumb-item>
          <el-breadcrumb-item>创建折扣/减价活动</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>创建折扣/减价活动</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="content-wrap-padding">
          <!-- <div class="page-info">
            <h3><i class="el-icon-info"></i>商城活动已升级，可根据会员分组定向做活动（如需使用请先联系品牌项目经理协助开通新的会员分组功能）</h3>
          </div> -->
          <el-form ref="form" :model="form" label-width="100px" :rules="rules">
            <el-form-item label="活动名称" prop="activityName">
              <el-input v-model="form.activityName" class="width-450" @input="limitInput">
                <span class="input-prompt" slot="suffix">{{ limitInputLength }}/15</span>
              </el-input>
            </el-form-item>
            <el-form-item label="活动标签" prop="activityTag">
              <el-input v-model="form.activityTag" class="width-450" @input="limitInput2">
                <span class="input-prompt" slot="suffix">{{ limitInputLength2 }}/5</span>
              </el-input>
            </el-form-item>
            <el-form-item label="时间范围" prop="times">
              <el-date-picker v-model="form.times" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeTime" @blur="blurTime"> </el-date-picker>
            </el-form-item>
            <span style="display:none">{{ refash }}</span>
            <el-form-item label="适用对象" required>
              <template>
                <el-radio v-model="form.memberLabelType" :label="1">全部会员</el-radio>
                <el-radio v-model="form.memberLabelType" :label="2">会员分组</el-radio>
                <el-radio v-model="form.memberLabelType" :label="3">会员筛选</el-radio>
              </template>
            </el-form-item>
            <div v-if="form.memberLabelType === 2" style="margin:-30px 0 0 70px;width:856px">
              <vue-gic-member-group :defaltSelected="defaltSelected" :height="height" :projectName="projectName" :headerList="headerList" :effectiveStatus="effectiveStatus" @handleDataTransferred="handleDataTransferred" @handleDataLeft="handleDataLeft"> </vue-gic-member-group>
            </div>
            <div v-if="form.memberLabelType === 3" class="fiter-class-container">
              <div v-if="channel === 0">
                <vue-gic-people :projectName="projectName" :isAdd="isAdd" :searchBackTxt.sync="searchBackTxt" :conditionList.sync="conditionList" :triggerReset="true" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" @findFilter="findFilter" @getBackData="getBackData" @editHide="editHide" @editShow="editShow" @hideBtn="hideBtn" />
                <div class="gic-people--button" v-show="toggleTag">
                  <el-button size="small" type="primary" @click="getData">确 定</el-button>
                  <el-button size="small" @click="cancelFilter">取 消</el-button>
                </div>
              </div>
              <!-- <div v-if="channel === 1">{{ peopleFilterInfo }}</div>
               -->
              <el-popover placement="top-start" width="400" trigger="hover" :content="searchParams">
                <el-button slot="reference" type="text">{{ peopleFilterInfo }}</el-button>
              </el-popover>
            </div>
            <el-form-item label="购买限制">
              <el-radio-group v-model="form.buyLimitFlag">
                <el-radio :label="0">不限制</el-radio>
                <el-radio :label="1">限制</el-radio>
              </el-radio-group>
              <el-input-number v-if="form.buyLimitFlag == 1" v-model="form.buyLimit" style="width:130px;margin-left: 12px;"></el-input-number>
              <template slot="append">
                件
              </template>
            </el-form-item>
            <el-form-item label="活动商品范围">
              <div style="display:inline-block">
                <div v-if="form.groupProList">
                  <el-button @click="goSelectGoods" style="width:200px">{{ form.groupProList.length > 0 ? '已添加' + form.groupProList[0].priceArr.length + '件商品' : '选择商品' }}</el-button>
                </div>
                <div v-else-if="form.proNum > 0">
                  <el-button @click="goSelectGoods(form.activityId)" style="width:200px">已添加{{ form.proNum }}件商品</el-button>
                </div>
                <div v-else>
                  <el-button @click="goSelectGoods()">选择商品</el-button>
                </div>
              </div>

              <a href="javaScript:void(0)" @click="uploadDialogVisible" style="margin-left:30px">（或）通过EXCEL导入活动商品</a>
            </el-form-item>
            <el-form-item style="font-size:0px">
              <el-button type="primary" @click="onSubmit('form')" :loading="submitLoading">保存活动</el-button>
              <el-button @click="goBack">返 回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 导入商品弹框 -->
    <el-dialog title="导入活动商品" :visible.sync="dialogVisible" width="620px">
      <el-form :model="dialogForm" label-position="right" label-width="80px" v-loading="loading">
        <el-form-item label="选择文件" required>
          <div class="upload-btn">
            <el-upload class="upload-ele" :action="action" :headers="headersUpload" :before-upload="uploadFileBefore" :on-success="uploadFile" with-credentials :show-file-list="showList" :data="uploadData">
              <el-button size="small"><i class="el-icon-upload2" style="margin-right:5px"></i>点击上传</el-button>
            </el-upload>
          </div>
          <el-button type="info" plain @click="downloadFile">下载EXCEL模板</el-button>
        </el-form-item>
        <el-form-item label="导入规则">
          <div class="line"></div>
          <div class="upload-rules">
            <p>1. 每个文件最多300个宝贝，文件大小不超过2M</p>
            <p>2. 只需要填写SPU（货号）和实售价</p>
            <p>3. 仅支持.xlsx .csv文件的导入（建议直接下载模板，在模板的基础上进行数据的填充）</p>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs';
import getInputVal from '../../../../static/js/common.js';
import storage from '../../../../static/js/storage.js';
import request from '../../../api/request.js';
export default {
  data() {
    return {
      getTimeAll: getInputVal.formatDate,
      length: 0,
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      limitInputLength: 0,
      limitInputLength2: 0,
      times: [],
      form: {
        activityName: '',
        activityTag: '',
        beginTime: '',
        endTime: '',
        times: [],
        buyLimitFlag: 0,
        buyLimit: 0,
        proNum: 0,
        groupProList: [],
        personGroupStatus: 0, //是否启用 分阶梯 0 停用，1 启用
        activityGroupList: [
          {
            mallActivityGroupId: '-1',
            sort: 1
          }
        ],
        memberLabelType: 1 //会员类型
      },
      rules: {
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        activityTag: [{ required: true, message: '请输入活动标签', trigger: 'blur' }],
        times: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      },
      // 会员分组信息
      defaltSelected: [], //  默认穿梭窗已选入数据
      height: 543, // 穿梭窗高度， 默认是543
      projectName: 'mall', // 默认是memberTag
      headerList: [],
      effectiveStatus: 1,
      activityId: '',
      refash: false,
      proNum: 0,
      dialogVisible: false, //导入商品弹框
      dialogForm: {},
      showList: false,
      uploadData: {
        type: 1,
        activityId: ''
      }, //上传的额外参数
      action: window.location.origin + '/api-mall/upload-goods-selected-goods?requestProject=mall',
      // action: 'http://gicdev.demogic.com/api-mall/upload-goods-selected-goods?requestProject=mall',
      headersUpload: {
        sign: ''
      },
      loading: false,
      isNew: 'true',
      submitLoading: false,
      selectNum: 0,
      addProIdsArr: [],
      removeProIdsArr: [],
      channel: 0,
      peopleFilterInfo: '',
      // 人群筛选器
      // projectName: 'mall', // 当前项目名
      searchBackTxt: '', // 保存选中的筛选条件用来不走接口查缩略信息
      getSaveData: '',
      conditionList: [],
      usePeopleFilter: false,
      sceneValue: 'member', // 场景值
      useId: '', // 模板id
      hasSearchData: '', // 当前页回显的数据(接口返回)
      operateType: true, // 编辑的时候是false 新增是true 例如列表筛选是开始true 编辑改成false
      toggleTag: false, // 控制(确认取消)按钮显示的参数,仅供参考,可自行修改
      saveTag: false, // 控制(保存)按钮显示的参数,仅供参考,可自行修改
      searchParams: {}, //查询数据数据
      responseParams: [] //回显的数据
    };
  },
  created() {
    this.activityId = this.$route.query.id;
    if (this.activityId !== '-1') {
      this.uploadData.activityId = this.activityId;
    } else {
      this.uploadData.activityId = '';
    }

    localStorage.removeItem('importInfoObj'); //使用完就清除缓存
    this.isNew = this.$route.query.isNew;
    if (storage.getNewActivity() !== '') {
      //选商品跳转

      this.form = storage.getNewActivity();
      this.selectNum = this.form.proNum;
      this.defaltSelected = this.form.tagGroupList;
      this.limitInputLength = getInputVal.getZhLen(this.form.activityName);
      this.limitInputLength2 = getInputVal.getZhLen(this.form.activityTag);
      this.addProIdsArr = this.form.addProIdsArr;
      this.removeProIdsArr = this.form.removeProIdsArr;
      this.searchBackTxt = this.form.searchBackTxt;
      this.searchParams = this.form.searchParams;
      this.responseParams = this.form.responseParams;
      this.conditionList = this.form.conditionList;
      this.channel = this.form.channel;
      if (this.channel === 1 && this.form.memberLabelType === 3) {
        this.getPeopleFilter();
      }
      // this.form.proNum=this.form.proNum
      // this.form.proNum=this.proNum-this.form.removeProIdsArr.length+this.form.addProIdsArr.length
      storage.setNewActivity(''); //用完即清
    } else {
      if (this.isNew === 'false') {
        //编辑页面
        this.getActiveMess();
      }
    }
  },
  mounted() {
    if (this.searchBackTxt !== '') {
      this.$refs.peopleFilter.getAbInfo(this.searchBackTxt);
    }
  },
  filters: {},
  computed: {},
  methods: {
    changeTime() {
      if (this.form.times) {
        if (new Date(this.form.times[1]).valueOf() < new Date(new Date().toLocaleDateString()).valueOf()) {
          this.$message.error('结束时间不能小于当前时间！');
        }
      }
    },
    blurTime() {
      this.refash = !this.refash;
    },
    // 获取活动信息
    getActiveMess() {
      let params = {
        activityId: this.activityId
      };
      request.get('/api-mall/get-discount-activity', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.usePeopleFilter = false;
          this.form = res.data.result;
          this.form.times = [];
          this.form.times.push(this.form.beginTime);
          this.form.times.push(this.form.endTime);
          this.limitInputLength = getInputVal.getZhLen(this.form.activityName);
          this.limitInputLength2 = getInputVal.getZhLen(this.form.activityTag);
          this.selectNum = this.form.proNum;
          if (this.form.memberLabelType === 3) {
            this.useId = this.form.activityId;
            this.searchParams = this.form.searchParams; //查询数据
            this.responseParams = this.form.responseParams; //回显数据
            this.hasSearchData = res.data.result.searchParams;
            this.searchBackTxt = JSON.parse(res.data.result.searchParams);
          }

          // this.conditionList = res.data.result.responseParams;
          this.channel = res.data.result.channel;
          if (this.channel === 1 && this.form.memberLabelType === 3) {
            this.getPeopleFilter();
          }
          if (this.form.tagGroupList) {
            this.defaltSelected = this.form.tagGroupList;
          } else {
            this.defaltSelected = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getPeopleFilter() {
      let params = {
        params: this.searchParams
      };
      request.post('/api-plug/screening-show-back', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.peopleFilterInfo = res.data.result;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    onSubmit(form) {
      if (!this.form.memberLabelType) {
        this.$message.error('请选择适用对象');
        return false;
      }
      if (this.isNew === 'false') {
        this.oldActivitySave(form);
      } else {
        this.newActivitySave(form);
      }
    },
    newActivitySave(form) {
      //新活动保存
      this.$refs[form].validate(valid => {
        if (this.form.buyLimitFlag == 0) {
          this.form.buyLimit = 0;
        }
        if (new Date()) {
          if (new Date(this.form.times[1]).valueOf() < new Date(new Date().toLocaleDateString()).valueOf()) {
            this.$message.error('结束时间不能小于当前时间！');
            return false;
          }
        }

        // 判断分组对象
        if (this.defaltSelected.length < 1 && this.form.memberLabelType === 2) {
          //没有选择会员分组
          this.$message.error('请选择会员分组');
          return false;
        }
        if (this.form.memberLabelType === 3) {
          if (this.toggleTag && !this.getSaveData) {
            this.$message.error('请选中人群筛选器的数据');
            return false;
          }
        }
        let memberLabelId;
        if (this.form.memberLabelType === 1) {
          memberLabelId = '';
          this.searchParams = '';
          this.responseParams = '';
        } else if (this.form.memberLabelType === 2) {
          memberLabelId = [];
          // 处理会员分组的数据
          for (let item of this.defaltSelected) {
            memberLabelId.push(item.memberTagGroupId);
          }
          memberLabelId = memberLabelId.join(',');
          this.searchParams = '';
          this.responseParams = '';
        } else if (this.form.memberLabelType === 3) {
          memberLabelId = '';
        }
        let params = this.form;
        params.beginTime = this.form.times ? this.getTimeAll(this.form.times[0]) : '';
        params.endTime = this.form.times ? this.getTimeAll(this.form.times[1]) : '';
        params.memberLabelId = memberLabelId;
        params.searchParams = this.searchParams;
        params.responseParams = this.responseParams;
        this.submitLoading = true;
        if (valid) {
          request.post('/api-mall/create-discount-activity', params).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('新活动创建成功！！');
              this.$router.push({
                name: 'discountSale'
              });
              this.submitLoading = false;
            } else {
              this.$message.error(res.data.message);
              this.submitLoading = false;
            }
          });
        } else {
          this.submitLoading = false;
          return false;
        }
      });
    },
    oldActivitySave(form) {
      // 旧活动保存
      this.$refs[form].validate(valid => {
        if (this.form.times) {
          if (new Date(this.form.times[1]).valueOf() < new Date(new Date().toLocaleDateString()).valueOf()) {
            this.$message.error('结束时间不能小于当前时间！');
            return false;
          }
        }

        // 判断分组对象
        if (this.defaltSelected.length < 1 && this.form.memberLabelType === 2) {
          //没有选择会员分组
          this.$message.error('请选择会员分组');
          return false;
        }
        if (this.form.memberLabelType === 3) {
          if (this.toggleTag && !this.getSaveData) {
            this.$message.error('请选中人群筛选器的数据');
            return false;
          }
        }
        let memberLabelId;
        if (this.form.memberLabelType === 1) {
          memberLabelId = '';
          this.searchParams = '';
          this.responseParams = '';
        } else if (this.form.memberLabelType === 2) {
          memberLabelId = [];
          // 处理会员分组的数据
          for (let item of this.defaltSelected) {
            memberLabelId.push(item.memberTagGroupId);
          }
          memberLabelId = memberLabelId.join(',');
          this.searchParams = '';
          this.responseParams = '';
        } else if (this.form.memberLabelType === 3) {
          memberLabelId = '';
        }
        if (this.form.buyLimitFlag == 0) {
          this.form.buyLimit = 0;
        }
        let goodsObj = {
          groupProList: this.form.groupProList
        };
        let params = {
          activityId: this.form.activityId,
          activityName: this.form.activityName,
          activityTag: this.form.activityTag,
          beginTime: this.form.times ? this.getTimeAll(this.form.times[0]) : '',
          endTime: this.form.times ? this.getTimeAll(this.form.times[1]) : '',
          buyLimitFlag: this.form.buyLimitFlag,
          buyLimit: this.form.buyLimit,
          proEditData: goodsObj,
          proList: this.form.proList,
          personGroupStatus: this.form.personGroupStatus,
          activityGroupList: this.form.activityGroupList,
          memberLabelType: this.form.memberLabelType, //适用对象的类型
          memberLabelId: memberLabelId, //会员分组的
          searchParams: this.searchParams, //查询数据
          responseParams: this.responseParams //回显数据
        };
        this.submitLoading = true;
        if (valid) {
          request.post('/api-mall/update-discount-activity', params).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('保存活动成功！！');
              this.$router.push({
                name: 'discountSale'
              });
              this.submitLoading = false;
            } else {
              this.$message.error(res.data.message);
              this.submitLoading = false;
            }
          });
        } else {
          this.submitLoading = false;
          return false;
        }
      });
    },
    limitInput() {
      let names = this.form.activityName;
      this.$nextTick(() => {
        this.form.activityName = getInputVal.getInputVal(names, 15);
        this.limitInputLength = getInputVal.getZhLen(this.form.activityName);
      });
    },
    limitInput2() {
      let names = this.form.activityTag;
      this.$nextTick(() => {
        this.form.activityTag = getInputVal.getInputVal(names, 5);
        this.limitInputLength2 = getInputVal.getZhLen(this.form.activityTag);
      });
    },
    goSelectGoods() {
      if (this.form.memberLabelType === 3) {
        if (this.toggleTag && !this.getSaveData) {
          this.$message.error('请选中人群筛选器的数据');
          return false;
        }
      }
      if (this.usePeopleFilter) {
        this.$refs.peopleFilter.saveSelectData();
      }
      // if (this.searchBackTxt != '') {
      //   this.$refs.peopleFilter.saveSelectData();
      // }

      this.form.addProIdsArr = this.addProIdsArr;
      this.form.removeProIdsArr = this.removeProIdsArr;
      this.form.tagGroupList = this.defaltSelected;
      this.form.searchBackTxt = this.searchBackTxt; //人群筛选器数据
      this.form.searchParams = this.searchParams;
      this.form.responseParams = this.responseParams;
      this.form.conditionList = this.conditionList;
      this.form.channel = this.channel;
      storage.setNewActivity(this.form);
      this.$router.push({
        name: 'createActivityGoods',
        query: {
          isNew: this.isNew,
          selectNum: this.selectNum
        }
      });
    },
    goBack() {
      this.$router.push({
        name: 'discountSale'
      });
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
    },
    //活动商品导入
    uploadDialogVisible() {
      this.dialogVisible = true;
    },
    //下载模板
    downloadFile() {
      let url = 'static/折扣减价活动商品导入模板.xlsx';
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
      this.loading = true;
      this.fileName = file.name;
    },
    //上传文件
    uploadFile(file, fileList) {
      this.loading = true;
      if (file.errorCode === 0) {
        this.loading = false;
        this.form.tagGroupList = this.defaltSelected;
        this.uploadData.activityId = file.result.activityId;
        this.form.temActivityId = file.result.activityId;
        let importInfoObj = [];
        if (file.result.failDetail) {
          importInfoObj = file.result.failDetail;
        } else {
          importInfoObj = [];
        }
        window.localStorage.setItem('importInfoObj', JSON.stringify(importInfoObj));
        storage.setNewActivity(this.form);
        this.$router.push({ path: '/createActivityGoods', query: { falseNum: file.result.falseNum, successNum: file.result.successNum, selectedProIds: file.result.selectedProIds, isNew: this.isNew, activityId: file.result.activityId, import: true } });
        // this.$router.push({
        //   name: 'createActivityGoods'
        // })
      } else {
        this.loading = false;
        this.$message.error(file.message);
      }
    },
    //人群筛选器使用的方法
    // 父组件调用子组件方法,触发父组件事件
    getData() {
      var that = this;
      that.$refs.peopleFilter.confirmSet();
      that.usePeopleFilter = true;
    },
    // 子组件触发父组件事件,返回过滤条件数据
    findFilter(value) {
      // var that = this;
      this.searchParams = value;
    },
    // 取消
    cancelFilter() {
      var that = this;
      that.$refs.peopleFilter.cancelSet();
    },
    // 获取需要回显的数据, 供保存时候使用
    getBackData(val) {
      var that = this;
      that.responseParams = val;
      this.getSaveData = val;
    },
    // 显示编辑,保存按钮隐藏,确认按钮显示 (子组件会调用)
    editShow() {
      var that = this;
      that.toggleTag = true;
      that.saveTag = false;
    },
    // 显示保存按钮,隐藏确认按钮显示  (子组件会调用)
    editHide() {
      var that = this;
      that.toggleTag = false;
      that.saveTag = true;
    },
    // 隐藏保存按钮和确认按钮  (子组件会调用)
    // 传个参数给父组件 来查数据
    hideBtn(refresh) {
      if (refresh === 0) {
        this.memberSearchStr = -1;
        this.toggleTag = false;
        // 查数据的方法
        // this.getList();
      }
    }
    // 保存当前模板,对接保存接口
  },
  components: {}
};
</script>
<style>
.upload-btn .el-upload {
  width: 250px !important;
}
.el-popover {
  word-break: break-all !important;
}
</style>
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
.width-450 {
  width: 400px;
}
.input-prompt {
  color: #909399;
  font-size: 13px;
  margin-right: 6px;
}
/*提示文案样式*/
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
}
.page-info .el-icon-info {
  color: #1890ff;
  margin-right: 8px;
  font-size: 14px;
}
/*上传文件*/
.upload-btn {
  height: 30px;
  text-align: center;
  text-align: center;
  border: 1px dashed rgba(192, 196, 204, 1);
  display: inline-block;
  font-size: 14px;
  color: #c0c4cc;
  cursor: pointer;
  margin-right: 50px;
  border-radius: 4px;
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

/*.upload-btn .upload-ele:hove .el-button{
    color: #1890ff;
 }
 .upload-btn:hover .el-icon-upload2{
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
.fiter-class-container {
  margin: -15px 0 22px 70px;
}
.gic-people--button {
  background: #f2f3f4;
  padding: 0 0 20px 124px;
}
</style>
