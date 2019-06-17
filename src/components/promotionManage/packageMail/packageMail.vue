<template>
  <div class="mall-section-container" @click.stop="hideDrag" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>促销活动</el-breadcrumb-item>
          <el-breadcrumb-item>包邮活动</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>创建包邮活动</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="content-wrap-padding">
          <!-- <div class="page-info">
            <h3><i class="el-icon-info"></i>商城活动已升级，可根据会员分组定向做活动（如需使用请先联系品牌项目经理协助开通新的会员分组功能）</h3>
          </div> -->
          <el-form ref="form" :model="form" label-width="100px" :rules="rules">
            <el-form-item label="活动状态">
              <el-switch v-model="isOpenBol"> </el-switch>
            </el-form-item>
            <div v-if="isOpenBol">
              <el-form-item label="活动名称" prop="activityName">
                <el-input v-model="form.activityName" @input="limitInput" class="width-600"
                  ><span slot="suffix">{{ limitInputLength }}/15</span></el-input
                >
              </el-form-item>
              <el-form-item label="活动说明" prop="activityDescription">
                <el-input type="textarea" :rows="3" v-model="form.activityDescription" @input="limitInput2" placeholder="请输入内容" class="width-600"></el-input>
                <span class="input-position">{{ limitInputLength2 }}/50</span>
              </el-form-item>
              <el-form-item label="适用对象" required>
                <template>
                  <el-radio v-model="form.memberLabelType" :label="1">全部会员</el-radio>
                  <el-radio v-model="form.memberLabelType" :label="2">会员分组</el-radio>
                  <el-radio v-model="form.memberLabelType" :label="3">会员筛选</el-radio>
                </template>
              </el-form-item>
              <div v-if="form.memberLabelType === 2" style="margin:-30px 0 0 70px;width:856px">
                <vue-gic-member-group :defaltSelected="defaltSelected" :height="height" :headerList="headerList" :projectName="projectName" :effectiveStatus="effectiveStatus" @handleDataTransferred="handleDataTransferred" @handleDataLeft="handleDataLeft"> </vue-gic-member-group>
              </div>
              <div v-if="form.memberLabelType === 3" class="fiter-class-container">
                <div v-if="channel === 0">
                  <vue-gic-people :projectName="projectName" :isAdd="isAdd" :searchBackTxt.sync="searchBackTxt" :conditionList.sync="conditionList" :triggerReset="true" :useId="useId" :hasSearchData="hasSearchData" :sceneValue="sceneValue" ref="peopleFilter" @findFilter="findFilter" @getBackData="getBackData" @editHide="editHide" @editShow="editShow" @hideBtn="hideBtn" />
                  <div class="gic-people--button" v-show="toggleTag">
                    <el-button size="small" type="primary" @click="getData">确 定</el-button>
                    <el-button size="small" @click="cancelFilter">取 消</el-button>
                  </div>
                </div>
                <el-popover placement="top-start" width="400" trigger="hover" :content="searchParams">
                  <el-button slot="reference" type="text">{{ peopleFilterInfo }}</el-button>
                </el-popover>
              </div>
              <el-form-item label="活动商品范围">
                <div class="goods-area">
                  <el-select v-model="form.proRelationType" clearable placeholder="请选择" class="width-style" style="width:200px">
                    <el-option v-for="item in selectArr" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                  <div class="goods-selected">
                    <goodsCatediff ref="modal" v-show="form.proRelationType == 3" @getCateIds="getCateIds" :selectCateData="selectCateData"></goodsCatediff>
                    <el-select v-show="form.proRelationType == 2" v-model="form.brandId" clearable placeholder="请选择" class="width-style" style="width:200px">
                      <el-option v-for="item in companyBrand" :key="item.brandId" :label="item.brandName" :value="item.brandId"> </el-option>
                    </el-select>
                    <div v-show="form.proRelationType == 4" class="goods-nature-item">
                      <treeselect :multiple="true" :options="options" placeholder="选择分类" v-model="value" class="tree-select" style="width:400px" :disable-branch-nodes="true" />
                    </div>
                    <div v-show="form.proRelationType == 5">
                      <!-- <el-button v-if="form.addProIdsStr instanceof Array" @click="goSelectGoods" style="width:200px">{{ form.addProIdsStr.length > 0? '已添加'+form.addProIdsStr.length+'件商品':'选择商品'}}</el-button>
                      <el-button v-else-if="form.proNum > 0" @click="goSelectGoods(form.activityId)" style="width:200px">已添加{{form.proNum}}件商品</el-button>
                      <el-button v-else @click="goSelectGoods()" style="width:200px">选择商品</el-button> -->
                      <el-button class="w-200" v-show="form.proRelationType === 5" @click="goSelectGoods" style="width:200px">{{ goodIdStatus ? '选择商品' : '已选择' + form.proNum + '件数' }}</el-button>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="包邮条件">
                <div class="width-600">
                  <el-row class="order-list-title">
                    <el-col :span="8">
                      <div class="grid-content">
                        阶段
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="grid-content">
                        消费满（元）
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="grid-content">
                        消费满（件）
                      </div>
                    </el-col>
                  </el-row>
                  <el-row class="order-list-content">
                    <el-col :span="8">
                      <div class="grid-content">
                        默认
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="grid-content">
                        <el-input size="small" v-model="form.freeConditionPrice" class="input-limit" placeholder="请输入内容"></el-input>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="grid-content">
                        <el-input size="small" v-model="form.freeConditionNumber" class="input-limit" placeholder="请输入内容"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('form')" :loading="submitLoading">保存活动</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import getInputVal from '../../../../static/js/common.js';
import storage from '../../../../static/js/storage.js';
import request from '../../../api/request.js';
import goodsCatediff from '../../common/goodsCatediff.vue';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  data() {
    return {
      length: 0,
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      limitInputLength: 0,
      limitInputLength2: 0,
      isold: false,
      searchId: '',
      isOpenBol: false,
      form: {
        isOpen: 0,
        activityId: '',
        activityName: '',
        activityDescription: '',
        proRelationType: 1, //活动商品范围 【 1 所有商品 2按商品品牌，3按商品品类，4>按商品分类，5按单件商品】
        personGroupStatus: 0,
        relationId: '', // 商品ids,或者 分类ids,或者品类ids
        addProIdsStr: '', //选中商品
        removeIdsStr: '',
        brandId: '',
        proNum: 0,
        freeConditionPrice: 0, //消费满（元）
        freeConditionNumber: 0, //消费满（件）
        // activityGroupList: [
        //   {
        //     mallActivityGroupId: -1,
        //     sort: 1,
        //     freeConditionPrice: 0, //消费满（元）
        //     freeConditionNumber: 0 //消费满（件）
        //   }
        // ],
        memberLabelType: 1,
        removeProIdsArr: [],
        addProIdsArr: []
      },
      goodIdStatus: false, //未选择商品
      rules: {
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        activityDescription: [{ required: true, message: '请输入活动说明', trigger: 'blur' }]
      },
      selectArr: [
        {
          value: 1,
          label: '所有商品'
        },
        {
          value: 2,
          label: '按商品品牌'
        },
        {
          value: 3,
          label: '按商品品类'
        },
        {
          value: 4,
          label: '按商品分类'
        },
        {
          value: 5,
          label: '按单个商品'
        }
      ],
      companyBrand: [],
      value: [],
      options: [],
      selectCateData: [], // 商品品类回显
      // 会员分组信息
      defaltSelected: [], //  默认穿梭窗已选入数据
      height: 543, // 穿梭窗高度， 默认是543
      projectName: 'mall', // 默认是memberTag
      headerList: [],
      effectiveStatus: 1,
      proNum: 0,
      submitLoading: false,
      selectNum: 0,
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
  mounted() {
    if (this.searchBackTxt !== '') {
      this.$refs.peopleFilter.getAbInfo(this.searchBackTxt);
    }
    this.getCompanyBrand();
    this.getListTags();
  },
  created() {
    if (storage.getNewMailActivity() && this.$route.query.id === '-1') {
      //有缓存的
      this.form = storage.getNewMailActivity();
      this.defaltSelected = this.form.tagGroupList;
      this.limitInputLength = getInputVal.getZhLen(this.form.activityName);
      this.limitInputLength2 = getInputVal.getZhLen(this.form.activityDescription);
      this.selectNum = this.form.proNum;
      this.proNum = this.form.proNum;
      this.form.proNum = this.proNum - this.form.removeProIdsArr.length + this.form.addProIdsArr.length;
      this.responseParams = this.form.responseParams;
      this.searchParams = this.form.searchParams;

      this.searchBackTxt = this.form.searchBackTxt;
      this.channel = this.form.channel;
      if (this.channel === 1) {
        this.getPeopleFilter();
      }

      if (this.form.proNum > 0) {
        //商品选择
        this.goodIdStatus = false;
      } else {
        this.goodIdStatus = true;
      }
      if (storage.getNewMailActivity().isOpen === 1) {
        this.isOpenBol = true;
      } else if (storage.getNewMailActivity().isOpen === 0) {
        this.isOpenBol = false;
      }
      this.defaltSelected = this.form.tagGroupList;
      storage.setNewMailActivity(''); //用完即清
    } else {
      //刷新与默认进来的
      this.getMaillActivity();
    }
    storage.setNewMailActivity(''); //用完即清
  },
  filters: {},
  computed: {},
  methods: {
    onSubmit(form) {
      if (!this.isOpenBol) {
        this.form.isOpen = 0;
        this.stopMaillActivity();
      } else {
        this.form.isOpen = 1;
        this.saveMaillActivity(form);
      }
    },
    getCompanyBrand() {
      // 获取公司下拉列表
      request.get('/api-mall/list-enterprise-brand').then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.companyBrand = res.data.result;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getListTags() {
      // 获取商品分类下拉列表
      request.get('/api-mall/list_mall_goods_tag_tree').then(res => {
        if (res.data.errorCode === 0) {
          this.options.push({
            childTagList: res.data.result.childTagList,
            mallProTagId: res.data.result.mallProTagId,
            tagName: res.data.result.tagName
          });
          this.getTree(this.options);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getTree(data) {
      for (let i in data) {
        data[i].label = data[i].tagName;
        data[i].id = data[i].mallProTagId;
        data[i].children = data[i].childTagList;
        if (data[i].children) {
          if (data[i].children.length) {
            this.getTree(data[i].children);
          } else {
            delete data[i].children;
          }
        } else {
          delete data[i].children;
        }
      }
    },
    getMaillActivity() {
      request.get('/api-mall/get-freight-activity').then(res => {
        if (res.data.errorCode === 0) {
          this.usePeopleFilter = false;
          if (res.data.result) {
            this.form = res.data.result;
            if (this.form.isOpen == 1) {
              this.isOpenBol = true;
            } else {
              this.isOpenBol = false;
            }
            // if (this.form.isOpen == 0) {
            //   this.isOpenBol = false;
            // }
            if (this.form.tagGroupList) {
              this.defaltSelected = this.form.tagGroupList; //会员分组的信息
            } else {
              this.defaltSelected = [];
            }
            if (this.form.memberLabelType === 3) {
              this.useId = res.data.result.activityId;
              this.searchParams = res.data.result.searchParams;
              this.responseParams = res.data.result.responseParams;
              this.hasSearchData = res.data.result.searchParams;
              this.searchBackTxt = JSON.parse(res.data.result.searchParams);
              // this.conditionList = res.data.result.responseParams;
            }

            this.channel = res.data.result.channel;
            if (this.channel === 1) {
              this.getPeopleFilter();
            }

            this.selectNum = this.form.proNum;
            // this.defaltSelected=this.form.tagGroupList//会员分组的信息
            this.limitInputLength = getInputVal.getZhLen(this.form.activityName);
            this.limitInputLength2 = getInputVal.getZhLen(this.form.activityDescription);
            if (this.form.proRelationType == 4) {
              if (this.form.relationId) {
                this.value = this.form.relationId.split(',');
              }
            }
            if (this.form.proRelationType == 3) {
              if (this.form.relationId) {
                this.searchId = this.form.relationId.split(',');
              }
              let relateArr = this.form.relationId;
              this.showCateName(relateArr);
            }
            if (this.form.proRelationType == 5) {
              // this.form.addProIdsStr=this.form.relationId?this.form.relationId.split(','):''
              this.proNum = this.form.proNum;
              if (this.form.proNum > 0) {
                //商品选择
                this.goodIdStatus = false;
              } else {
                this.goodIdStatus = true;
              }
            }

            if (!this.form.addProIdsArr) {
              this.form.addProIdsArr = [];
            }

            if (!this.form.removeProIdsArr) {
              this.form.removeProIdsArr = [];
            }

            this.useId = res.data.result.activityId;
          } else {
            storage.setNewMailActivity('');
            this.form.proNum = 0;
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
    stopMaillActivity() {
      // 停用活动
      this.submitLoading = true;
      request.get('/api-mall/cancel-freight-activity').then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.$message.success('停用活动成功！！');
            this.getMaillActivity();
            // 停用活动处理数据
            this.form.isOpen = 0;
            this.form.activityId = '';
            this.form.activityName = '';
            this.form.activityDescription = '';
            this.form.proRelationType = 1;
            this.form.personGroupStatus = 0;
            this.form.relationId = '';
            this.form.addProIdsStr = '';
            this.form.removeIdsStr = '';
            this.form.brandId = '';
            this.form.proNum = 0;
            this.form.addProIdsArr = [];
            this.form.removeProIdsArr = [];
            this.form.freeConditionPrice = 0;
            this.form.freeConditionNumber = 0;
            // this.form.activityGroupList[0].mallActivityGroupId = -1;
            // this.form.activityGroupList[0].sort = 1;
            // this.form.activityGroupList[0].freeConditionPrice = 0;
            // this.form.activityGroupList[0].freeConditionNumber = 0;
            this.form.searchParams = '';
            this.form.responseParams = '';
            // storage.setNewMailActivity(this.form);
            this.submitLoading = false;
          }
        } else {
          this.submitLoading = false;
          this.$message.error(res.data.message);
        }
      });
    },
    /*eslint-disable*/
    // 启用活动的保存
    saveMaillActivity(form) {
      this.$refs[form].validate(valid => {
        if (this.defaltSelected.length < 1 && this.form.memberLabelType === 2) {
          //没有选择会员分组
          this.$message.error('请选择会员分组');
          return false;
        }
        if (!this.form.memberLabelType) {
          this.$message.error('请选择适用对象');
          return false;
        }
        if (this.form.memberLabelType === 3) {
          console.log(this.toggleTag,!this.getSaveData)
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
          for (let item of this.defaltSelected) {
            memberLabelId.push(item.memberTagGroupId);
          }
          memberLabelId = memberLabelId.join(',');
          this.searchParams = '';
          this.responseParams = '';
        } else  if(this.form.memberLabelType === 3) {
          memberLabelId = '';
        }
        if (this.form.proRelationType != 2) {
          this.form.brandId = '';
        }
        if (this.form.proRelationType == 4) {
          this.form.relationId = this.value.join(',');
        } else if (this.form.proRelationType == 3) {
          if (this.searchId.length) {
            this.form.relationId = this.searchId.join(',');
          } else {
            this.form.relationId = '';
          }
        } else {
          this.form.relationId = '';
        }
        let strIds = '';
        if (this.form.addProIdsStr instanceof Array) {
          strIds = this.form.addProIdsStr.join(',');
        }

        if (this.form.proRelationType === 2) {
          //商品品牌
          if (this.form.brandId === '') {
            //没选商品
            this.$message.error('请选择商品品牌');
            return false;
          }
        }
        if (this.form.proRelationType === 3) {
          //商品品类
          if (this.form.relationId === '') {
            //没选商品
            this.$message.error('请选择商品品类');
            return false;
          }
        }
        if (this.form.proRelationType === 4) {
          //商品分类
          if (this.form.relationId === '') {
            //没选商品
            this.$message.error('请选择商品分类');
            return false;
          }
        }
        if (this.form.proRelationType === 5) {
          //单件商品
          // if(strIds===''){//没选商品
          //   this.$message.error('请选择商品');
          //   return false
          // }
          if (this.form.proNum <= 0) {
            this.$message.error('请选择商品');
            return false;
          }
        }
        // if (this.form.memberLabelType === 3) {
        //   // JSON.stringify(this.searchParams) === '{}' || !this.searchParams || this.searchParams === ''
        //   if (!this.usePeopleFilter) {
        //     this.$message.error('请选中人群筛选器的数据');
        //     return false;
        //   }
        // }
        let params = {
          isOpen: this.form.isOpen,
          activityId: this.form.activityId,
          activityName: this.form.activityName,
          activityDescription: this.form.activityDescription,
          proRelationType: this.form.proRelationType,
          personGroupStatus: this.form.personGroupStatus,
          relationId: this.form.relationId,
          addProIdsStr: strIds,
          removeIdsStr: this.form.removeIdsStr,
          brandId: this.form.brandId,
          // activityGroupList: this.form.activityGroupList,
          freeConditionPrice:this.form.freeConditionPrice,
          freeConditionNumber:this.form.freeConditionNumber,
          memberLabelId: memberLabelId, //分组信息
          memberLabelType: this.form.memberLabelType, //适用对象
          searchParams: this.searchParams, //查询数据
          responseParams: this.responseParams //回显数据
        };
        params.addProIdsStr = this.form.addProIdsArr ? this.form.addProIdsArr.join(',') : '';
        params.removeProIdsStr = this.form.removeProIdsArr ? this.form.removeProIdsArr.join(',') : '';
        this.submitLoading = true;
        if (valid) {
          request.post('/api-mall/create-or-update-freight-activity', params).then(res => {
            if (res.data.errorCode === 0) {
              if (this.form.proRelationType == 3) {
                this.getMaillActivity();
              }

              this.$message.success('保存活动成功！！');
              this.submitLoading = false;
              this.form.tagGroupList = this.defaltSelected;
              this.getMaillActivity();
              // storage.setNewMailActivity(this.form);
            } else {
              this.submitLoading = false;
              this.$message.error(res.data.message);
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
      let names = this.form.activityDescription;
      this.$nextTick(() => {
        this.form.activityDescription = getInputVal.getInputVal(names, 50);
        this.limitInputLength2 = getInputVal.getZhLen(this.form.activityDescription);
      });
    },
    getCateIds(item) {
      this.searchId = item;
      if (!item.length) {
        this.selectCateData = [];
      }
    },
    showCateName(idArr) {
      //回显已选商品品类
      let arrId = idArr;
      let params = {
        categorys: arrId
      };
      request
        .get('/api-goods/list-categorys', { params })
        .then(res => {
          if (res.data.errorCode === 0) {
            this.selectCateData = res.data.result;
          }
        })

    },
    goSelectGoods() {
      // if (this.searchBackTxt != '') {
      //   this.$refs.peopleFilter.saveSelectData();
      // }
      if (this.usePeopleFilter) {
        this.$refs.peopleFilter.saveSelectData();
      }
      if (this.isOpenBol) {
        this.form.isOpen = 1;
      } else {
        this.form.isOpen = 0;
      }
      if (this.form.memberLabelType === 3) {
        if (this.toggleTag && !this.getSaveData) {
          this.$message.error('请选中人群筛选器的数据');
          return false;
        }
      }
      this.form.tagGroupList = this.defaltSelected;
      this.form.proNum = this.proNum;
      this.form.searchBackTxt = this.searchBackTxt; //人群筛选器数据
      this.form.conditionList = this.conditionList;
      this.form.searchParams = this.searchParams; //查询数据
      this.form.responseParams = this.responseParams; //回显数据
      this.form.conditionList = this.conditionList;
      this.form.channel = this.channel;
      storage.setNewMailActivity(this.form);
      this.$router.push({
        name: 'mailActivityGoods',
        query: {
          selectNum: this.selectNum
        }
      });
    },
    goBack() {
      this.$router.back(-1);
      storage.setNewMailActivity('');
    },
    hideDrag() {
      this.$nextTick(() => {
        if (this.$refs.modal) {
          this.$refs.modal.showDrag = false;
        }
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
     //人群筛选器使用的方法
    // 父组件调用子组件方法,触发父组件事件
    getData() {
      var that = this;
      that.$refs.peopleFilter.confirmSet();
      that.usePeopleFilter = true
    },
    // 子组件触发父组件事件,返回过滤条件数据
    findFilter(value) {
      // var that = this;
      this.searchParams = value
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
      that.getSaveData = val
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
    },
    // 保存当前模板,对接保存接口
  },
  watch: {},


  components: {
    goodsCatediff,
    Treeselect
  }
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
.width-450 {
  width: 400px;
  position: relative;
}
.width-600 {
  width: 600px;
}
.input-position {
  position: absolute;
  bottom: -30px;
  left: 575px;
  color: #c0c4cc;
  font-size: 13px;
}
.order-list-title {
  height: 48px;
  line-height: 48px;
  background-color: rgba(241, 243, 247, 1);
  padding-left: 14px;
  font-size: 13px;
  color: #909399;
}
.order-list-content {
  font-size: 13px;
  color: #303133;
  padding: 10px 0px 10px 14px;
  border-bottom: 1px solid rgba(241, 243, 247, 1);
}
.input-limit {
  width: 140px;
}

.goods-area {
  display: flex;
}
.width-style {
  flex-shrink: 0;
  width: 150px;
}
.goods-selected {
  margin-left: 8px;
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
</style>
<style>
.goods-nature-item .el-form-item__label {
  line-height: 20px;
}
.tree-select .vue-treeselect__multi-value-item {
  line-height: 22px;
}
.tree-select .vue-treeselect--has-value .vue-treeselect__multi-value {
  line-height: 22px;
  margin-bottom: 0px;
}
.tree-select .vue-treeselect__control {
  height: 32px;
  line-height: 26px;
}
.tree-select .vue-treeselect__multi-value-item-container {
  line-height: 22px;
}
.fiter-class-container {
  margin: -15px 0 22px 70px;
}
.gic-people--button {
  background: #f2f3f4;
  padding: 0 0 20px 124px;
}
</style>
