<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }" @click.stop="hideDrag">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>促销活动</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/reduceDiscountList' }">满减送</el-breadcrumb-item>
          <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>{{ pageTitle }}</span>
        </h3>
      </div>
      <div class="mall-section">
        <!-- <div class="page-info">
          <h3><i class="el-icon-info"></i>商城活动已升级，可根据会员分组定向做活动（如需使用请先联系品牌项目经理协助开通新的会员分组功能）</h3>
        </div> -->
        <el-form :model="priceForm" :rules="rules" ref="priceForm" label-width="130px" class="demo-ruleForm" label-position="right">
          <div class="el-form-group">
            <h3>活动信息</h3>
            <el-form-item label="活动名称" prop="activityName">
              <el-input v-model="priceForm.activityName" class="width-600" @input="value => activityNameLimit(value)">
                <span slot="suffix">{{ activityNameLen }}/15</span>
              </el-input>
            </el-form-item>
            <el-form-item label="活动说明" prop="activityDescription">
              <el-input type="textarea" :rows="3" v-model="priceForm.activityDescription" @input="activityDescriptionLimit" placeholder="请输入内容" class="width-600"> </el-input>
              <span class="input-position">{{ activityDescriptionLen }}/50</span>
            </el-form-item>
            <el-form-item label="活动时间" prop="activeTime">
              <el-date-picker v-model="priceForm.activeTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="changeTime"> </el-date-picker>
            </el-form-item>
            <el-form-item label="适用对象" required>
              <template>
                <el-radio v-model="priceForm.memberLabelType" :label="1">全部会员</el-radio>
                <el-radio v-model="priceForm.memberLabelType" :label="2">会员分组</el-radio>
                <el-radio v-model="priceForm.memberLabelType" :label="3">会员筛选</el-radio>
              </template>
            </el-form-item>

            <div v-if="priceForm.memberLabelType === 2" style="margin:-30px 0 0 100px;width:856px">
              <vue-gic-member-group :defaltSelected="defaltSelected" :headerList="headerList" :height="height" :projectName="projectName" :effectiveStatus="effectiveStatus" @handleDataTransferred="handleDataTransferred" @handleDataLeft="handleDataLeft"> </vue-gic-member-group>
            </div>
            <div v-if="priceForm.memberLabelType === 3" class="fiter-class-container">
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
            <el-form-item label="活动类型" required>
              <el-radio-group v-model="priceForm.fullType" @change="changeFullType">
                <el-radio :label="1">满金额</el-radio>
                <el-radio :label="2">满件数</el-radio>
              </el-radio-group>
            </el-form-item>
            <span class="goods-tip" v-show="priceForm.fullType === 2">商品计算规则</span>
            <el-form-item v-show="priceForm.fullType === 2" required style="vertical-align: middle;position:relative;display:inline-block;" label-width="20px">
              <el-popover class="tip-mol" placement="right" width="400" trigger="hover" style="margin-left:-10px">
                <p>设置购买数量是否限制为单商品：</p>
                <p>如：优惠设置了满2件8折，商品规则为商品池，则用户购买活动商品中的A和B，即满足8折的优惠条件；若商品设置为单商品，则用户购买A和B，不满足8折的优惠条件，需购买2件A才符合8折的优惠条件。</p>
                <el-button slot="reference" type="text"><i class="iconfont icon-xinxixianshi"></i></el-button>
              </el-popover>
              <template>
                <el-radio v-model="priceForm.proRule" :label="1">商品池</el-radio>
                <el-radio v-model="priceForm.proRule" :label="2">单商品</el-radio>
              </template>
            </el-form-item>
          </div>
          <div class="el-form-group">
            <h3 style="margin-bottom:8px">优惠设置</h3>
            <div class="title-tip">
              <i class="el-icon-info"></i>
              <span>当设置多层优惠时，请以逐级递增的形式进行设置，如设置5层优惠，系统检测顺序为5-4-3-2-1</span>
            </div>
            <div v-show="priceForm.fullType === 1">
              <div class="tier-table-content">
                <div class="tier-table" v-for="(item, index) in priceForm.discountValue" :key="index">
                  <div class="tier-table-header">优惠层级{{ index + 1 }}</div>
                  <div class="tier-table-tbody">
                    <div class="tier-table-item">
                      <el-form-item label-position="left" label-width="110px">
                        <span class="item1">优惠条件</span>
                        <span class="item2">满</span>
                        <el-input-number class="w-120" controls-position="right" v-model="item.cost" :precision="0" @change="compareReduceNum(index, item)"> </el-input-number>
                        <span class="item3">元</span>
                      </el-form-item>
                    </div>
                    <div class="tier-table-item">
                      <el-form-item label-position="left" label-width="110px">
                        <div>
                          <span class="item1">优惠内容</span>
                          <el-checkbox v-model="item.isUse" class="item2" @change="changeUpDate"></el-checkbox>
                          <span class="item2">减</span>
                          <el-input-number class="w-120" controls-position="right" v-model="item.reduce" :precision="2" @change="compareReduce(index, item)"> </el-input-number>
                          <span class="item3">元</span>
                        </div>
                        <div style="margin-left:100px;margin-top:10px" v-for="(itm, inx) in item.gift" :key="inx">
                          <div>
                            <el-checkbox v-model="itm.isUse" class="item2" @change="changeUpDate2(itm)">送赠品</el-checkbox>
                            <div v-if="itm.isUse" class="gift-name">
                              <div v-if="itm.editStatus">
                                <el-button type="text" class="item2">{{ itm.giftName }}</el-button>
                                <i class="el-icon-edit" v-if="itm.giftName" @click="EditGiftName(itm)"></i>
                              </div>
                              <div class="gift-name-input" v-else>
                                <el-input class="send-goods" v-model="itm.proCode" placeholder="请填写商品货号" @input="changeUpDate"> </el-input>
                                <el-button type="text" @click="confirmGift(itm)">确定</el-button>
                                <el-button type="text" @click="cancelGift(itm)">取消</el-button>
                              </div>
                            </div>
                          </div>
                          <p class="warm-tip">如需使用赠品功能，请选联系品牌项目经理将小程序升级到最新版</p>
                        </div>
                      </el-form-item>
                    </div>
                    <div style="vertical-align: middle;line-height:32px;margin-left:40px">
                      <el-checkbox v-model="item.limit" @change="changeUpDate(item)">
                        <span>上不封顶</span>
                        <el-popover class="tip-mol" placement="right" width="400" trigger="hover" style="left:85px;top:5px">
                          <p>若设置上不封顶，则优惠金额会随着满减金额而翻倍</p>
                          <p>如：设置满减金额为100元减20元且上不封顶，则买家购买总金额为200元时，可优惠40元</p>
                          <el-button slot="reference" type="text"><i class="iconfont icon-xinxixianshi"></i></el-button>
                        </el-popover>
                      </el-checkbox>
                    </div>

                    <div class="tier-table-item operate-btn" style="margin-left:100px">
                      <el-popover placement="top" width="160" v-model="item.visible1">
                        <p style="line-height:1.5;padding:10px">确定要删除吗？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click="item.visible1 = false">取消</el-button>
                          <el-button type="primary" size="mini" @click="deleteTiePrice1(index, item)">确定</el-button>
                        </div>
                        <el-button slot="reference" type="text">删除</el-button>
                      </el-popover>
                    </div>
                  </div>
                </div>
              </div>
              <div class="add-num" @click="addReducePrice" v-show="priceForm.discountValue.length < 10">
                <i class="el-icon-plus"></i>
                <el-button type="text" class="add-text">添加优惠层级</el-button>
                <span class="add-tip">最多可设置10级 （每级优惠不叠加）</span>
              </div>
            </div>
            <div v-show="priceForm.fullType === 2">
              <div class="tier-table-content">
                <div class="tier-table" v-for="(item, index) in priceForm.discountValue" :key="index">
                  <div class="tier-table-header">优惠层级{{ index + 1 }}</div>
                  <div class="tier-table-tbody">
                    <div class="tier-table-item">
                      <el-form-item label-position="left">
                        <span class="item1">优惠条件</span>
                        <span class="item2">满</span>
                        <el-input-number class="w-120" controls-position="right" v-model="item.cost" :precision="0" @change="compareNum(index, item)"> </el-input-number>
                        <span class="item3">件</span>
                      </el-form-item>
                    </div>
                    <div class="tier-table-item">
                      <el-form-item label-position="left">
                        <div>
                          <span class="item1">优惠内容</span>
                          <el-checkbox v-model="item.isUse" class="item2" @change="changeUpDate"></el-checkbox>
                          <span class="item2">打</span>
                          <el-input-number class="w-120" controls-position="right" v-model="item.reduce" :precision="2" @change="compareDiscount(index, item)"> </el-input-number>
                          <span class="item3">折</span>
                        </div>
                        <div style="margin-left:100px;margin-top:10px" v-for="(itm, inx) in item.gift" :key="inx">
                          <div>
                            <el-checkbox v-model="itm.isUse" class="item2" @change="changeUpDate2(itm)">送赠品</el-checkbox>
                            <div v-if="itm.isUse" class="gift-name">
                              <div v-if="itm.editStatus">
                                <el-button type="text" class="item2">{{ itm.giftName }}</el-button>
                                <i class="el-icon-edit" v-if="itm.giftName" @click="EditGiftName(itm)"></i>
                              </div>
                              <div class="gift-name-input" v-else>
                                <el-input class="send-goods" v-model="itm.proCode" placeholder="请填写商品货号" @input="changeUpDate"> </el-input>
                                <el-button type="text" @click="confirmGift(itm)">确定</el-button>
                                <el-button type="text" @click="cancelGift(itm)">取消</el-button>
                              </div>
                            </div>
                          </div>
                          <p class="warm-tip">如需使用赠品功能，请选联系品牌项目经理将小程序升级到最新版</p>
                        </div>
                      </el-form-item>
                    </div>
                    <div class="tier-table-item operate-btn" style="margin-left:100px">
                      <el-popover placement="top" width="160" v-model="item.visible2">
                        <p style="line-height:1.5;padding:10px">确定要删除该阶梯价吗？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click="item.visible2 = false">取消</el-button>
                          <el-button type="primary" size="mini" @click="deleteTiePrice(index, item)">确定</el-button>
                        </div>
                        <el-button slot="reference" type="text">删除</el-button>
                      </el-popover>
                    </div>
                  </div>
                </div>
              </div>
              <div class="add-num" @click="addReducePrice" v-show="priceForm.discountValue.length < 10">
                <i class="el-icon-plus"></i>
                <el-button type="text" class="add-text">添加优惠层级</el-button>
                <span class="add-tip">最多可设置10级 （每级优惠不叠加）</span>
              </div>
            </div>

            <span class="goods-tip" style="line-height: 42px">优惠共享</span>
            <el-form-item required style="vertical-align: middle;position:relative;display:inline-block;" label-width="20px">
              <el-popover class="tip-mol" placement="right" width="400" trigger="hover" style="margin-left:-10px;top:5px">
                <p>买家下单时仅可与勾选的活动类型叠加使用</p>
                <el-button slot="reference" type="text"><i class="iconfont icon-xinxixianshi"></i></el-button>
              </el-popover>
              <div style="display:inline-block;">
                <el-checkbox-group v-model="priceForm.checkedActivity">
                  <el-checkbox v-for="itemName in priceForm.activityShare" :label="itemName.type" :key="itemName.type" @change="changeCheck(itemName)">
                    <span v-if="itemName.type === 400">会员折扣</span>
                    <span v-else-if="itemName.type === 501">折扣活动</span>
                    <span v-else-if="itemName.type === 502">满立减活动</span>
                    <span v-else-if="itemName.type === 503">包邮活动</span>
                    <span v-else-if="itemName.type === 504">阶梯价活动</span>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <span style="display:inline-block;vertical-align:bottom" class="activiti-tip">其他未列入的活动默认可叠加，待后续迭代功能</span>
            </el-form-item>
          </div>
          <div class="el-form-group">
            <h3>选择活动商品</h3>
            <el-form-item label="活动商品范围" required>
              <el-select v-model="priceForm.proRelationType" placeholder="请选择活动区域" @change="goodsType">
                <el-option label="所有商品" :value="1"></el-option>
                <el-option label="按商品品牌" :value="2"></el-option>
                <el-option label="按商品品类" :value="3"></el-option>
                <el-option label="按商品分类" :value="4"></el-option>
                <el-option label="按单个商品" :value="5"></el-option>
              </el-select>
              <div class="goods-select">
                <!-- 商品品牌 -->
                <el-select v-show="priceForm.proRelationType === 2" v-model="brandId" clearable placeholder="请选择" class="w-200">
                  <el-option v-for="(item, index) in brandList" :key="index" :label="item.brandName" :value="item.brandId"> </el-option>
                </el-select>
                <!-- 按商品品类 -->
                <goodsCatediff ref="modal" v-show="priceForm.proRelationType == 3" @getCateIds="getCateIds" :selectCateData="selectCateData"></goodsCatediff>
                <!-- 按商品分类 -->
                <div v-show="priceForm.proRelationType == 4">
                  <treeselect :multiple="true" :options="goodsClassifyList" placeholder="选择分类" v-model="goodsClassify" :disable-branch-nodes="true" class="tree-select" style="width:400px" />
                </div>
                <!-- 按单件商品 -->
                <span style="display:none">{{ refash }}</span>
                <el-button class="w-200" v-show="priceForm.proRelationType === 5" @click="selectPieceGoods">{{ goodIdStatus ? '选择商品' : '已选择' + priceForm.proNum + '件数' }}</el-button>
                <a v-show="priceForm.proRelationType === 5" href="javaScript:void(0)" style="margin-left:30px" @click="uploadDialogVisible">（或）通过EXCEL导入活动商品</a>
                <span style="display:none">{{ refash }}</span>
              </div>
            </el-form-item>
          </div>
          <div class="confim-btn" :style="{ width: fixedWidth + 'px' }">
            <el-form-item class="fix-btn">
              <el-button type="primary" size="small" @click="submitActive('priceForm')" :loading="submitLoading">保 存</el-button>
              <el-button size="small" @click="goList">返 回</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 导入商品弹框 -->
    <el-dialog title="导入活动商品" :visible.sync="dialogVisible" width="620px">
      <el-form :model="dialogForm" label-position="right" label-width="80px" v-loading="loading">
        <el-form-item label="选择文件" required>
          <div>
            <div class="upload-btn">
              <el-upload class="upload-ele" :action="action" :headers="headersUpload" :before-upload="uploadFileBefore" :on-success="uploadFile" with-credentials :show-file-list="showList" :data="uploadData">
                <!-- :before-upload="uploadFileBefore"
                :on-success="uploadFile" -->
                <el-button size="small"><i class="el-icon-upload2" style="margin-right:5px"></i>点击上传</el-button>
              </el-upload>
              <!-- <i class="el-icon-upload2"></i>
              <span>点击上传</span> -->
            </div>
            <!-- <a href="javaScript:void(0)" @click="downloadFile">点击下载EXCEL模板</a> -->
            <el-button type="info" plain @click="downloadFile">下载EXCEL模板</el-button>
          </div>
          <p class="import-info" v-show="importMess">
            本次共导入&nbsp;<span style="font-weight:600">{{ successNum + falseNum }}</span
            >&nbsp;个商品，其中成功&nbsp;<span style="font-weight:600">{{ successNum }}</span
            >&nbsp;个，失败&nbsp;<span style="color:#f5222d">{{ falseNum }}</span
            >&nbsp;个<a href="javaScript:void(0)" v-show="falseNum > 0" style="margin-left:10px" @click="showInfo">查看失败原因</a>
          </p>
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
    <importInfo :importInfo="importInfo"></importInfo>
  </div>
</template>

<script>
import qs from 'qs';
import getInputVal from '../../../../static/js/common.js';
import request from '../../../api/request.js';
import Treeselect from '@riophae/vue-treeselect';
import copy from '../../../../static/js/clone.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import goodsCatediff from '../../common/goodsCatediff.vue';
import importInfo from '../../common/importInfo.vue';
export default {
  name: 'newPrice',
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      fixedWidth: document.documentElement.clientWidth - 200,
      getTimeAll: getInputVal.formatDate,
      pageTitle: '新建满减送',
      priceForm: {
        activityId: '',
        activityName: '', //活动名称
        activityDescription: '', //活动说明
        activeTime: [],
        proRule: 1,
        proRelationType: 1, //活动商品类型
        // isUse 1使用2未用 giftType商品2积分3卡券
        discountValue: [{ cost: '', reduce: '', limit: 0, isUse: 0, gift: [{ giftType: 1, proCode: '', giftId: '', giftName: '', isUse: 0 }] }], //优惠层级
        // reduceValue:[{num:'',reduce:''}],//满立减
        memberLabelType: 1, //会员类型
        fullType: 1, //活动类型
        proNum: 0,

        checkedActivity: [], //选中的
        activityShare: [
          {
            type: 400, //会员折扣
            isShare: 1 //0不共享，1共享
          }
        ] //优惠共享
      },
      rules: {
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        activityDescription: [{ required: true, message: '请输入活动说明', trigger: 'blur' }],
        activeTime: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      },
      activityNameLen: 0,
      activityDescriptionLen: 0,
      brandList: [], //商品品牌
      brandId: '', //选中的商品品牌
      goodsClassifyList: [], //商品分类列表
      goodsClassify: null, //商品分类
      goodsCateIds: [], //商品品类id
      selectCateData: [], // 商品品类回显
      goodsShow: false, //选择单件商品
      goodIdStatus: true, //未选商品
      proNum: 0, //选择商品的数量
      refash: false,
      selectNum: 0,
      // 会员分组信息
      defaltSelected: [], //  默认穿梭窗已选入数据
      height: 543, // 穿梭窗高度， 默认是543
      projectName: 'mall', // 默认是memberTag
      headerList: [],
      effectiveStatus: 1,
      removeProIdsArr: [], //新增商品的id
      addProIdsArr: [], //取消商品的id
      pickerOptions: {},
      dialogVisible: false, //导入商品弹框
      dialogForm: {},
      showList: false,
      uploadData: {
        type: 5,
        activityId: ''
      }, //上传的额外参数
      action: window.location.origin + '/api-mall/upload-goods-selected-goods?requestProject=mall',
      // action: 'http://gicdev.demogic.com/api-mall/upload-goods-selected-goods?requestProject=mall',
      headersUpload: {
        sign: ''
      },
      loading: false,
      isImport: false,
      importAddId: '',
      successNum: 0,
      falseNum: 0,
      importMess: false,
      submitLoading: false,
      importInfo: {
        //失败原因列表
        dialogVisible: false,
        infoList: [
          {
            reason: '货号在该品牌下面没有对应的商品',
            data: ['ab', '234234324']
          },
          {
            reason: '货号在该品牌下面没有对应的商品',
            data: ['ab']
          }
        ]
      },
      channel: 0, //0可编辑人群筛选器1不可编辑
      peopleFilterInfo: '',
      // 人群筛选器
      // projectName: 'mall', // 当前项目名
      searchBackTxt: '', // 保存选中的筛选条件用来不走接口查缩略信息
      conditionList: [],
      getSaveData: '',
      sceneValue: 'member', // 场景值
      useId: '', // 模板id
      hasSearchData: '', // 当前页回显的数据(接口返回)
      operateType: true, // 编辑的时候是false 新增是true 例如列表筛选是开始true 编辑改成false
      toggleTag: false, // 控制(确认取消)按钮显示的参数,仅供参考,可自行修改
      saveTag: false, // 控制(保存)按钮显示的参数,仅供参考,可自行修改
      usePeopleFilter: false,
      searchParams: {}, //查询数据数据
      responseParams: [] //回显的数据
    };
  },
  mounted() {
    if (this.searchBackTxt !== '') {
      this.$refs.peopleFilter.getAbInfo(this.searchBackTxt);
    }
  },
  created() {
    if (localStorage.getItem('addProIds')) {
      this.importAddId = localStorage.getItem('addProIds');

      localStorage.removeItem('addProIds'); //使用完就清除缓存
    } else {
      this.importAddId = '';
    }

    this.activityId = this.$route.params.activityId;
    if (!localStorage.getItem('priceObj')) {
      if (this.activityId !== '-1') {
        //编辑
        this.pageTitle = '编辑满减送';
        this.getMess();
      } else {
        this.pageTitle = '新建满减送';
        for (let item of this.priceForm.activityShare) {
          if (item.isShare === 1) {
            //共享
            this.priceForm.checkedActivity.push(item.type);
          }
        }
      }
    } else {
      if (this.activityId === '-1') {
        this.pageTitle = '新建满减送';
      } else {
        this.pageTitle = '编辑满减送';
      }
      this.priceForm.activeTime = [];
      let local = JSON.parse(localStorage.getItem('priceObj'));
      // let {
      //   priceForm,
      //   brandId,
      //   goodsClassify,
      //   goodsCateIds,
      //   selectCateData,
      //   memberLabelType,
      //   tagGroupList
      // } = local
      this.priceForm = local.priceForm;
      this.brandId = local.brandId;
      this.goodsClassify = local.goodsClassify;
      this.goodsCateIds = local.goodsCateIds;
      this.selectCateData = local.selectCateData;
      this.priceForm.proRelationType = local.proRelationType;
      this.priceForm.memberLabelType = local.memberLabelType; //适用对象类型
      this.defaltSelected = local.tagGroupList;
      this.removeProIdsArr = local.removeProIdsArr;
      this.addProIdsArr = local.addProIdsArr;
      this.uploadData.activityId = this.priceForm.activityId;
      this.proNum = local.proNum;
      this.selectNum = local.proNum;
      this.priceForm.proNum = this.proNum - local.removeProIdsArr.length + local.addProIdsArr.length;
      this.searchBackTxt = local.searchBackTxt;
      this.conditionList = local.conditionList;
      this.searchParams = local.searchParams; //查询数据
      this.responseParams = local.responseParams; //回显数据
      this.channel = local.channel;
      if (this.channel === 1 && this.priceForm.memberLabelType === 3) {
        this.getPeopleFilter();
      }
      if (this.priceForm.proNum > 0) {
        //商品选择
        this.goodIdStatus = false;
      } else {
        this.goodIdStatus = true;
      }
      localStorage.removeItem('priceObj'); //使用完就清除缓存
    }
  },

  computed: {},
  methods: {
    changeTime() {
      if (this.priceForm.activeTime) {
        if (new Date(this.priceForm.activeTime[1]).valueOf() < new Date(new Date().toLocaleDateString()).valueOf()) {
          this.$message.error('结束时间不能小于当前时间！');
        }
      }
    },
    //编辑查询
    getMess() {
      let params = {
        activityId: this.activityId
      };
      request.get('/api-mall/get-reduce-activity', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.usePeopleFilter = false;

          this.priceForm.activeTime = [];
          this.priceForm.activityName = res.data.result.activityName; //活动名称
          this.priceForm.activityDescription = res.data.result.activityDescription;
          this.activityNameLen = getInputVal.getZhLen(this.priceForm.activityName);
          this.priceForm.activeTime.push(res.data.result.beginTime);
          this.priceForm.activeTime.push(res.data.result.endTime); //活动时间
          this.priceForm.proRule = res.data.result.proRule; //计算规则
          this.priceForm.discountValue = JSON.parse(res.data.result.discountValue); //优惠设置
          this.channel = res.data.result.channel;
          this.priceForm.memberLabelType = res.data.result.memberLabelType; //适用对象类型
          this.searchParams = res.data.result.searchParams;
          if (this.priceForm.memberLabelType === 3) {
            if (this.searchParams === '' || !this.searchParams) {
              this.$message.error('会员筛选为空');
            } else {
              if (this.channel === 1 && this.priceForm.memberLabelType === 3) {
                this.getPeopleFilter();
              }
            }
          }

          // 兼容优惠设置的老数据
          for (let item of this.priceForm.discountValue) {
            item.hasOwnProperty('isUse');
            if (!item.hasOwnProperty('isUse')) {
              item.isUse = 1;
            }
            if (!item.hasOwnProperty('gift')) {
              item.gift = [{ giftType: 1, giftId: '', giftName: '', isUse: 0, proCode: '' }];
            }
          }

          this.priceForm.activityId = res.data.result.activityId;
          this.priceForm.proRelationType = res.data.result.proRelationType;

          if (this.priceForm.memberLabelType === 3) {
            this.useId = res.data.result.activityId;
            this.searchBackTxt = JSON.parse(res.data.result.searchParams);
            this.searchParams = res.data.result.searchParams;
            this.responseParams = res.data.result.responseParams;
            this.hasSearchData = res.data.result.searchParams;
            // this.conditionList = res.data.result.responseParams;
          }

          this.priceForm.fullType = res.data.result.fullType;
          this.uploadData.activityId = this.activityId;
          for (let item of this.priceForm.discountValue) {
            item.isUse = item.isUse === 1 ? true : false;
            if (item.gift) {
              for (let itm of item.gift) {
                itm.isUse = itm.isUse === 1 ? true : false;
                itm.editStatus = itm.giftId ? true : false; //编辑新增的标志
              }
            }
          }
          if (this.priceForm.fullType === 1) {
            for (let item of this.priceForm.discountValue) {
              item.limit = item.limit === 1 ? true : false;
            }
          }

          this.defaltSelected = res.data.result.tagGroupList; //分组
          this.memberLabelType = res.data.result.memberLabelType;
          this.proNum = res.data.result.proNum;
          this.priceForm.proNum = res.data.result.proNum;

          if (res.data.result.tagGroupList) {
            //处理数据
            this.defaltSelected = res.data.result.tagGroupList;
          } else {
            this.defaltSelected = [];
          }
          this.priceForm.memberLabelType = res.data.result.memberLabelType; //适用对象类型

          if (this.priceForm.proRelationType === 4) {
            //分类
            this.goodsClassify = res.data.result.relationId.split(','); //分类id
            this.getClassifyList();
          }
          if (this.priceForm.proRelationType === 2) {
            //商品品牌
            this.brandId = res.data.result.brandId === '-1' ? '' : res.data.result.brandId; //品牌id
            this.getBrandList(); //加载商品品牌
          }
          if (this.priceForm.proRelationType === 3) {
            //品类
            this.getCateMess(res.data.result.relationId);
          }
          if (this.priceForm.proRelationType === 5) {
            //商品id
            if (this.$route.params.goodIds === '-1') {
              this.goodIds = res.data.result.relationId; //商品id
            }
          }

          this.selectNum = res.data.result.proNum; //商品id

          if (res.data.result.proNum > 0) {
            //商品选择
            this.goodIdStatus = false;
          } else {
            this.goodIdStatus = true;
          }
          //处理优惠共享
          this.priceForm.activityShare = JSON.parse(res.data.result.activityShare);

          if (this.priceForm.activityShare) {
            for (let item of this.priceForm.activityShare) {
              if (item.isShare === 1) {
                //共享
                this.priceForm.checkedActivity.push(item.type);
              }
            }
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
    // 获取品类的回显
    getCateMess(ids) {
      let params = {
        categorys: ids
      };
      request.get('/api-goods/list-categorys', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.selectCateData = res.data.result;
          } else {
            this.selectCateData = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 商品类型
    goodsType() {
      if (this.priceForm.proRelationType === 2) {
        //商品品牌
        this.getBrandList(); //加载商品品牌
      } else if (this.priceForm.proRelationType === 4) {
        //分类
        this.getClassifyList(); //获取商品分类
      }
    },
    //限制字数
    activityNameLimit(value) {
      this.$nextTick(() => {
        this.priceForm.activityName = getInputVal.getInputVal(value, 15);
        this.activityNameLen = getInputVal.getZhLen(this.priceForm.activityName);
      });
    },
    // 活动说明限制字数
    activityDescriptionLimit(value) {
      this.$nextTick(() => {
        this.priceForm.activityDescription = getInputVal.getInputVal(value, 30);
        this.activityDescriptionLen = getInputVal.getZhLen(this.priceForm.activityDescription);
      });
    },
    //获取商品品牌
    getBrandList() {
      request.get('/api-mall/list-enterprise-brand').then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.brandList = res.data.result;
          } else {
            this.brandList = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取商品分类
    getClassifyList() {
      request.get('/api-mall/list_mall_goods_tag_tree').then(res => {
        if (res.data.errorCode === 0) {
          this.goodsClassifyList.push({
            childTagList: res.data.result.childTagList,
            mallProTagId: res.data.result.mallProTagId,
            tagName: res.data.result.tagName
          });
          this.getTree(this.goodsClassifyList);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 商品分类数据处理
    getTree(data) {
      for (let i in data) {
        data[i].label = data[i].tagName;
        data[i].id = data[i].mallProTagId;
        data[i].children = data[i].childTagList;
        if (data[i].children) {
          this.getTree(data[i].children);
        } else {
          delete data[i].children;
        }
      }
    },
    // 获取商品品类id
    getCateIds(item) {
      this.searchId = item;
      if (!item.length) {
        this.selectCateData = [];
      }
    },
    // 隐藏品类狂
    hideDrag() {
      this.$nextTick(() => {
        if (this.$refs.modal) {
          if (this.$refs.modal.showDrag) {
            this.$refs.modal.showDrag = false;
          }
        }
      });
    },
    // 活动的切换
    changeFullType() {
      this.priceForm.discountValue = [{ cost: '', reduce: '', isUse: false, gift: [{ giftType: 1, giftId: '', giftName: '', isUse: false }] }];
    },
    // 件数限制
    compareNum(index, item) {
      if (index !== this.priceForm.discountValue.length - 1) {
        //不是最后一个
        if (Number(item.cost) >= Number(this.priceForm.discountValue[index + 1].cost)) {
          //大于下一个
          this.$message.error('不可大于下一个阶段折扣件数');
          this.$nextTick(() => {
            item.cost = this.priceForm.discountValue[index + 1].cost - 1;
          });
          return false;
        }
      }
      if (Number(item.cost) <= 0) {
        //小于0
        this.$message.error('满减件数不可为0');
        item.cost = 0;
      }
      if (index !== 0) {
        //不是第一个
        if (Number(item.cost) <= Number(this.priceForm.discountValue[index - 1].cost)) {
          //小于下一个
          this.$message.error('不可小于上一个阶段折扣件数');
          this.$nextTick(() => {
            item.cost = this.priceForm.discountValue[index - 1].cost + 1;
          });
          return false;
        }
      }
      if (index === 0) {
        //第一个
        if (Number(item.cost) === 0) {
          //大于下一个
          this.$message.error('不可设置为0');
          if (this.priceForm.discountValue.length !== 1) {
            this.$nextTick(() => {
              item.cost = this.priceForm.discountValue[1].cost - 1;
            });
          } else {
            this.$nextTick(() => {
              item.cost = 1;
            });
          }
          return false;
        }
      }
    },
    // 满件数折扣限制
    compareDiscount(index, item) {
      if (index !== this.priceForm.discountValue.length - 1) {
        //不是最后一个
        if (Number(item.reduce) <= Number(this.priceForm.discountValue[index + 1].reduce)) {
          //大于下一个
          this.$message.error('不可大于下一个阶段折扣');
          this.$nextTick(() => {
            item.reduce = this.priceForm.discountValue[index + 1].reduce + 1;
          });
          return false;
        }
      }
      if (Number(item.reduce) <= 0) {
        //小于0
        this.$message.error('折扣不可为0');
        this.$nextTick(() => {
          item.reduce = 0;
        });
      }
      if (index !== 0) {
        //不是第一个
        if (Number(item.reduce) >= Number(this.priceForm.discountValue[index - 1].reduce)) {
          //小于下一个
          this.$message.error('不可小于上一个阶段折扣');
          if (Number(this.priceForm.discountValue[index - 1].reduce) === 0) {
            //上一阶段是0
            this.$nextTick(() => {
              item.reduce = '';
            });
          } else {
            this.$nextTick(() => {
              item.reduce = this.priceForm.discountValue[index - 1].reduce - 1;
            });
          }

          return false;
        }
      }
      if (index === this.priceForm.discountValue.length - 1) {
        //最后一个
        if (Number(item.reduce) >= 10 || Number(item.reduce) <= 0) {
          //大于10
          this.$message.error('折扣设置不合理');
          if (this.priceForm.discountValue.length !== 1) {
            this.$nextTick(() => {
              item.reduce = 0;
            });
          } else {
            //有且只有一个
            this.$nextTick(() => {
              item.reduce = 9;
            });
          }

          return false;
        }
      }
    },
    // 满金额输入的限制
    compareReduceNum(index, item) {
      if (Number(item.cost) <= 0) {
        //小于0
        this.$message.error('满减金额不可为0');
        item.cost = 0;
      }
      if (Number(item.reduce) > Number(item.cost)) {
        //商品价格小于满减金额
        this.$message.error('满减不能大于商品的价格');
        this.$nextTick(() => {
          item.cost = item.reduce + 1;
        });
      }

      // 和上一级比较
      if (index !== 0) {
        //第一个
        if (Number(item.cost) <= Number(this.priceForm.discountValue[index - 1].cost)) {
          //小于下一个
          this.$message.error('不可小于上一个阶段');
          this.$nextTick(() => {
            item.cost = this.priceForm.discountValue[index - 1].cost + 1;
          });
          return false;
        }
      }

      //和下一级比较
      if (index !== this.priceForm.discountValue.length - 1) {
        //不是最后一个
        if (Number(item.cost) >= Number(this.priceForm.discountValue[index + 1].cost)) {
          //大于下一个
          this.$message.error('不可大于下一个阶段');
          this.$nextTick(() => {
            item.cost = this.priceForm.discountValue[index + 1].cost - 1;
          });
          return false;
        }
      }
    },
    //满金额减价输入限制
    compareReduce(index, item) {
      if (Number(item.cost) <= 0) {
        //小于0
        this.$message.error('满减金额不可为0');
        item.cost = 0;
      }
      if (Number(item.reduce) > Number(item.cost)) {
        //满减金额大于商品价格
        this.$message.error('满减不能大于商品的价格');
        this.$nextTick(() => {
          item.reduce = 0;
        });
      }

      // 和上一级比较
      if (index !== 0) {
        //不是第一个
        if (Number(item.reduce) <= Number(this.priceForm.discountValue[index - 1].reduce)) {
          //小于下一个
          this.$message.error('不可小于上一个阶段');
          this.$nextTick(() => {
            item.reduce = this.priceForm.discountValue[index - 1].reduce + 1;
          });
          return false;
        }
      }

      //和下一级比较
      if (index !== this.priceForm.discountValue.length - 1) {
        //不是最后一个
        if (Number(item.reduce) >= Number(this.priceForm.discountValue[index + 1].reduce)) {
          //大于下一个
          this.$message.error('不可大于下一个阶段');
          this.$nextTick(() => {
            item.reduce = this.priceForm.discountValue[index + 1].reduce - 1;
          });
          return false;
        }
      }
    },
    // 删除阶梯价
    deleteTiePrice(index, item) {
      this.priceForm.discountValue.splice(index, 1);
      item.visible2 = false;
    },
    deleteTiePrice1(index, item) {
      this.priceForm.discountValue.splice(index, 1);
      item.visible1 = false;
    },
    // 添加满立减
    addReducePrice() {
      if (this.priceForm.discountValue.length >= 10) {
        this.$message.error('最多添加5级');
        return false;
      }
      if (this.priceForm.fullType === 1) {
        //满金额
        this.priceForm.discountValue.push({ cost: this.priceForm.discountValue[this.priceForm.discountValue.length - 1].cost + 1, reduce: 0, limit: 0, gift: [{ giftType: 1, giftId: '', giftName: '', isUse: false }] });
      } else if (this.priceForm.fullType === 2) {
        //满件数
        this.priceForm.discountValue.push({ cost: this.priceForm.discountValue[this.priceForm.discountValue.length - 1].cost + 1, reduce: 0, gift: [{ giftType: 1, giftId: '', giftName: '', isUse: false }] });
      }
    },
    // 返回列表
    goList() {
      localStorage.removeItem('priceObj');
      this.$router.push({
        name: 'reduceDiscountList'
      });
    },
    // 选择商品
    selectPieceGoods() {
      if (this.priceForm.memberLabelType === 3) {
        if (this.toggleTag && !this.getSaveData) {
          this.$message.error('请选中人群筛选器的数据');
          return false;
        }
      }
      // 是否重新编辑了人群筛选器
      if (this.usePeopleFilter) {
        this.$refs.peopleFilter.saveSelectData();
      }

      for (let item of this.priceForm.discountValue) {
        item.visible2 = false;
        item.visible1 = false;
      }
      if (this.activityId === '-1') {
        this.priceForm.proNum = 0;
      }
      let priceObj = {
        priceForm: this.priceForm,
        proNum: this.proNum,
        brandId: this.brandId, //选中的商品品牌
        goodsClassify: this.goodsClassify, //商品分类
        goodsCateIds: this.goodsCateIds, //商品品类id
        selectCateData: this.selectCateData, // 商品品类回显
        proRelationType: this.priceForm.proRelationType, //商品类型
        memberLabelType: this.priceForm.memberLabelType, //适用对象类型，
        tagGroupList: this.defaltSelected,
        importAddId: this.importAddId,
        removeProIdsArr: this.removeProIdsArr,
        addProIdsArr: this.addProIdsArr,
        searchBackTxt: this.searchBackTxt, //人群筛选器数据
        conditionList: this.conditionList,
        searchParams: this.searchParams, //查询数据
        responseParams: this.responseParams, //回显数据
        channel: this.channel
      };

      window.localStorage.setItem('priceObj', JSON.stringify(priceObj));
      this.isImport = false;
      this.$router.push({
        name: 'selectGoods',
        params: {
          activityId: this.activityId,
          selectNum: this.selectNum //已选的数量
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
    // 优惠共享
    changeCheck(item) {
      if (this.priceForm.checkedActivity.length === 0) {
        for (let item of this.priceForm.activityShare) {
          item.isShare = 0;
        }
      }
      for (let item of this.priceForm.activityShare) {
        if (this.priceForm.checkedActivity.indexOf(item.type) === -1) {
          item.isShare = 0;
        } else {
          item.isShare = 1;
        }
      }
    },
    //活动商品导入
    uploadDialogVisible() {
      this.dialogVisible = true;
      this.importMess = false;
    },
    //下载模板
    downloadFile() {
      let url = 'static/满减送活动商品导入模板.xlsx';
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
        this.isImport = true;
        if (this.importAddId) {
          this.importAddId = this.importAddId + ',' + file.result.selectedProIds;
        } else {
          this.importAddId = file.result.selectedProIds;
        }
        // console.log(this.importAddId);
        // let arrId1=[];
        // let arrId2=[]
        // if(this.importAddId) {
        //   arrId1 = this.importAddId.split(',')
        //   arrId2 = file.result.selectedProIds.split(',')
        //   for(let item of arrId1) {

        //   }
        // }
        this.uploadData.activityId = file.result.activityId;
        this.priceForm.activityId = file.result.activityId;
        this.successNum = file.result.successNum;
        this.falseNum = file.result.falseNum;
        this.priceForm.proNum = this.priceForm.proNum + file.result.successNum;
        if (this.proNum !== 0) {
          this.proNum = this.proNum + file.result.successNum;
        } else {
          this.proNum = file.result.successNum;
        }
        if (file.result.failDetail) {
          this.importInfo.infoList = file.result.failDetail;
        } else {
          this.importInfo.infoList = [];
        }
        this.selectNum = file.result.successNum;

        window.localStorage.setItem('addProIds', this.importAddId);

        this.importMess = true;
        if (this.priceForm.proNum > 0) {
          //商品选择
          this.goodIdStatus = false;
        } else {
          this.goodIdStatus = true;
        }
        this.activityId = file.result.activityId;
      } else {
        this.loading = false;
        this.$message.error(file.message);
      }
    },
    showInfo() {
      this.importInfo.dialogVisible = true;
    },
    // 更新数据
    changeUpDate() {
      this.refash = !this.refash;
    },
    //送赠品
    changeUpDate2(item) {
      this.refash = !this.refash;
      // item.giftId = '';
      // item.giftName = '';
      // item.proCode = '';
      // item.editStatus = item.giftId ? true : false; //编辑新增的标志
    },
    // 确定赠品
    confirmGift(item) {
      if (item.proCode === '' || !item.hasOwnProperty('proCode')) {
        this.$message.error('请填写商品货号');
        return false;
      }
      let params = {
        proCode: item.proCode
      };
      request.post('/api-mall/get-free-pro', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.refash = !this.refash;
            item.editStatus = true;
            item.giftId = res.data.result.proId;
            item.giftName = res.data.result.proName;
          } else {
            this.$message.error(res.data.message);
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 取消赠品
    cancelGift(item) {
      if (item.giftId) {
        //编辑状态取消
        item.proCode = '';
        item.editStatus = true; //变成编辑状态
      } else {
        //新建状态下的取消
        this.$nextTick(() => {
          item.giftId = '';
          item.giftName = '';
          item.proCode = '';
        });
      }
      this.refash = !this.refash;
    },
    //编辑赠品
    EditGiftName(item) {
      this.refash = !this.refash;
      item.editStatus = false; //变成编辑状态
    },
    //保存活动
    submitActive(priceForm) {
      let activityGroupList = [
        {
          storeTags: [],
          mallActivityGroupId: '-1',
          sort: 1
        }
      ];
      if (this.priceForm.activeTime) {
        if (new Date(this.priceForm.activeTime[1]).valueOf() < new Date(new Date().toLocaleDateString()).valueOf()) {
          this.$message.error('结束时间小能大于当前时间！');
          return false;
        }
      }
      if (this.priceForm.memberLabelType === 3) {
        if (this.toggleTag && !this.getSaveData) {
          this.$message.error('请选中人群筛选器的数据');
          return false;
        }
      }

      let params = {
        activityId: this.activityId === '-1' ? '' : this.activityId,
        activityName: this.priceForm.activityName,
        activityDescription: this.priceForm.activityDescription,
        beginTime: this.priceForm.activeTime ? this.getTimeAll(this.priceForm.activeTime[0]) : '',
        endTime: this.priceForm.activeTime ? this.getTimeAll(this.priceForm.activeTime[1]) : '',
        proRule: this.priceForm.proRule, //商品计算规则
        discountValue: [], //阶梯价保存的数据
        proRelationType: this.priceForm.proRelationType, //活动商品的范围
        addProIdsStr: '', //添加的商品id
        removeProIdsStr: '', //取消的商品id
        brandId: this.brandId, //品牌id
        // relationId:'',//品类或者分类的id
        activityGroupList: activityGroupList,
        memberLabelType: this.priceForm.memberLabelType,
        fullType: this.priceForm.fullType,
        activityShare: JSON.stringify(this.priceForm.activityShare), //优惠共享
        searchParams: this.searchParams, //查询数据
        responseParams: this.responseParams //回显数据
      };
      if (this.priceForm.proRelationType === 3) {
        //品类
        let submitCateIds = [];
        for (let item of this.selectCateData) {
          submitCateIds.push(item.categoryId);
        }
        params.relationId = submitCateIds === [] ? '' : submitCateIds.join(',');
      } else if (this.priceForm.proRelationType === 4) {
        //分类
        params.relationId = this.goodsClassify ? this.goodsClassify.join(',') : '';
      } else if (this.priceForm.proRelationType === 5) {
        //商品id
        let addArr = [];
        let removeArr = [];

        if (this.addProIdsArr.length === 0) {
          addArr = [];
        } else {
          for (let item of this.addProIdsArr) {
            addArr.push(item.mallProId);
          }
        }

        if (this.removeProIdsArr.length === 0) {
          removeArr = [];
        } else {
          for (let item of this.removeProIdsArr) {
            removeArr.push(item.mallProId);
          }
        }

        params.removeProIdsStr = removeArr.join(',');
        if (this.importAddId !== '') {
          //导入有数据
          params.addProIdsStr = addArr.join(',') + ',' + this.importAddId;
        } else {
          params.addProIdsStr = addArr.join(',');
        }
      }

      // return false
      /*eslint-disable*/
      this.$refs[priceForm].validate((valid) => {
        for(let i in this.priceForm.discountValue){//判断阶梯价
          if(this.priceForm.discountValue[i].cost===0 ||(this.priceForm.discountValue[i].reduce===0 && this.priceForm.discountValue[i].isUse)){
            this.$message.error('请填写正确的优惠条件')
            return false
          }
          if(!this.priceForm.discountValue[i].cost||(!this.priceForm.discountValue[i].reduce && this.priceForm.discountValue[i].isUse)){
            this.$message.error('阶梯价设置不可为空')
            return false
          }
          if (!this.priceForm.discountValue[i].isUse&&!this.priceForm.discountValue[i].gift[0].isUse){
            this.$message.error('请填写正确的优惠条件')
            return false
          }
        }


        // 判断分组对象
        if(this.priceForm.memberLabelType ===2&&this.defaltSelected.length<1){//没有选择会员分组
          this.$message.error('请选择会员分组')
          return false
        }
        if(!this.priceForm.memberLabelType){
          this.$message.error('请选择适用对象')
          return false
        }
        let memberLabelId
        if(this.priceForm.memberLabelType===2){
          memberLabelId=[]
          for(let item of this.defaltSelected){
            memberLabelId.push(item.memberTagGroupId)
          }
          params.memberLabelId=memberLabelId.join(',');
          this.searchParams = '';
          this.responseParams = '';
        }else if(this.priceForm.memberLabelType===1){
          params.memberLabelId="";
          this.searchParams = '';
          this.responseParams = '';
        }else if(this.priceForm.memberLabelType===3) {
          params.memberLabelId=""
        }
        if(this.priceForm.proRelationType===2){//商品品牌
          if(this.brandId===''){
            this.$message.error('请选择商品品牌');
            return false
          }
        }
        if(this.priceForm.proRelationType===3){//商品品类
          if(params.relationId===''){
            this.$message.error('请选择商品品类');
            return false
          }
        }
        if(this.priceForm.proRelationType===4){//商品分类
          if(params.relationId===''){
            this.$message.error('请选择商品分类');
            return false
          }
        }
        if(this.priceForm.proRelationType===5){//单件商品
          if(this.priceForm.proNum<=0){
            this.$message.error('请选择商品');
            return false
          }
        }
        // 处理删除的阶梯价的数据
        let priceDisList = [];
        let disArray = copy(this.priceForm.discountValue)
        for (let item of disArray) {
          //处理阶梯价的最终保存
          item.limit = item.limit ? 1 : 0;
          item.isUse = item.isUse ? 1 : 0;
          let giftArr = [];
          for ( let itm of item.gift) {
            if (itm.isUse && itm.giftType===1) {
              if (itm.giftId === '') {
                this.$message.error('请选择赠品')
                return false
              }
            }
            giftArr.push({
              giftType:itm.giftType,
              giftId:itm.isUse?itm.giftId:'',
              giftName:itm.isUse?itm.giftName:'',
              isUse:itm.isUse ? 1 : 0
            })
            item.gift = giftArr
          }
          //阶梯活动最终保存的数据
          priceDisList.push({
            cost: item.cost,
            reduce: item.reduce,
            limit: this.priceForm.fullType === 1 ? item.limit : '-1',
            isUse: item.isUse,
            gift:item.gift
          });
        }
        params.discountValue = priceDisList
        // return false
        this.submitLoading = true
        if (valid) {//校验通过
          request.post('/api-mall/create-reduce-activity',params).then(res => {
            if(res.data.errorCode===0){
              this.$message.success('保存成功')
              localStorage.removeItem("priceObj")
              window.localStorage.removeItem('addProIds');
              this.$router.push({
                name: 'reduceDiscountList',
              })
              this.submitLoading = false
            }else{
              this.$message.error(res.data.message)
              this.submitLoading = false
            }
          })
        } else {
          this.submitLoading = false
          return false;
        }
      });
    },
    //人群筛选器使用的方法
    // 父组件调用子组件方法,触发父组件事件
    getData() {
      this.$refs.peopleFilter.confirmSet();
      this.usePeopleFilter = true
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
      that.getSaveData = val;
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
  // mounted() {
  //   // 主动去查缩略信息
  //   // 去本地
  //   if () {

  //   }
  // },
  components: {
    Treeselect,
    goodsCatediff,
    importInfo

  }
}
</script>
<style>
  /*修改商品分类样式*/
  .tree-select .vue-treeselect__multi-value-item{
    line-height:26px;
  }
  .tree-select .vue-treeselect--has-value .vue-treeselect__multi-value{
    margin-bottom:0px;
  }

  .tree-select .vue-treeselect__multi-value-item-container{
    line-height:26px;
  }
  .tree-goods-cate .vue-treeselect__placeholder{
    line-height:40px;
  }
  .tree-goods-cate .vue-treeselect__multi-value-item-container{
    line-height: 24px;
  }
  .tree-goods-cate .vue-treeselect--has-value .vue-treeselect__multi-value{
    margin-bottom:0px;
  }
  .tree-goods-cate .vue-treeselect__multi-value-item-container{
      padding-top:5px;
  }
  /*品类框的方向*/
  .el-form-group .goods-cate-list-container{
    top:-360px!important;
  }
 .upload-btn .el-upload{
  width:250px!important;
 }
</style>
<style scoped>
  .operate-top{
    height:40px;
  }
  .mall-section{
    margin:24px;
    padding:24px;
    background: #fff;
  }
  .w-400{
    width:400px;
  }
  .el-form-group{
    border-bottom:1px solid #e7e7eb;
    margin-bottom:22px;
  }
  .el-form-group h3{
    height: 22px;
    line-height: 22px;
    font-weight: 600;
    margin-bottom: 25px;
    font-size: 16px;
    color:#303133;
  }
  /*提示*/
  .title-tip{
    padding:8px 16px;
    border:1px solid rgba(145,213,255,1);
    background:#E6F7FF;
    border-radius:4px;

  }
  .title-tip .el-icon-info{
    color: #1890FF;
    font-size:13px;
  }
  .title-tip span{
    color:#606266;
    font-size:13px;
    margin-left:4px;
  }
 .tip-text{
    color:#606266;
    font-size:14px;
  }
  /*阶梯*/
  .tier-table-content{
    margin-bottom:22px;
    padding-top:22px;
    border-bottom:1px solid rgba(220,223,230,1);
  }
  .tier-table-header{
    height:48px;
    line-height:48px;
    background: #F1F3F7;
    padding-left:15px;
    color:#909399;
    font-size:14px;
  }
  .tier-table-tbody{
    padding:8px 0;
    display:flex;

  }
  .tier-table-item{
    font-size:14px;
    color:#303133;
  }
  .tier-table-item .item1{
    margin-right:40px;
  }
  .tier-table-item .item2{
    margin-right:8px;
  }
  .tier-table-item .item3{
    margin-left:8px;
  }
  .tier-table-content .tier-table:first-child .operate-btn{
      display:none;
  }
  .tier-table-content .tier-table .operate-btn{
    line-height:32px;
  }
  .tier-table-item .el-form-item{
    margin-bottom:0px;
  }
  /*添加按钮*/
  .add-num{
    height:50px;
    line-height:50px;
    text-align: center;
    border:1px dashed rgba(220,223,230,1);
    cursor: pointer;
    margin-bottom:22px;
  }
  .add-num:hover{
    border:1px dashed #1890ff;
  }
  .add-num i{
    color:#303133;
    font-size:12px;
  }
  .add-num .add-text{
    font-size:13px;
    margin-left:5px;
    color:#303133;
  }
  .add-num:hover .add-text{
    color:#1890ff
  }
  .add-num:hover i{
    color:#1890ff
  }
  .add-num .add-tip{
    font-size:13px;
    color:#C0C4CC;
    margin-left:10px;
  }
  /*商品选择*/
  .goods-select{
    display:inline-block;
    margin-left:10px;
    vertical-align: top;
  }
  .w-200{
    width:200px;
  }
  .confim-btn{
    height:32px;
    padding:12px 0;
    position:fixed;
    bottom:0px;
    left:200px;
    background:#fff;
    z-index:2;
    text-align: center;
    border-top:1px solid #dcdfe6;
  }
  .fix-btn{
    margin-left:-100px;
  }
  .icon-xinxixianshi{
    font-size: 14px;
    color: #909399;
    cursor: pointer;
  }
  .goods-tip{
    display: inline-block;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #606266;
    width: 100px;
    text-align: right;
    vertical-align: top;
    margin-right:6px;
  }
  .goods-tip:before{
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  .tip-mol{
    position: absolute;
    left:-17px;
  }
   /*提示文案样式*/
  .page-info{
    padding:8px 16px;
    box-sizing: border-box;
    border-radius: 4px;
    background: #f4f4f5;
    color: #606266;
    margin-bottom:22px;
    line-height: 1.5;
  }
  .page-info h3{
    font-size:13px;
    color:#606266;
  }
  .page-info .el-icon-info{
    color: #1890ff;
    margin-right: 8px;
    font-size:14px;
  }
  .activiti-tip{
    display: inline-block;
    vertical-align: middle;
    font-size:12px;
    color: rgb(144, 147, 153);
    margin-left:25px;
  }
  .input-position{
    position: absolute;
    bottom: -26px;
    left: 575px;
    color: #c0c4cc;
    font-size: 13px;
  }
  .width-600{
    width:600px;
  }
  /*上传文件*/
 .upload-btn{
    height:30px;
    text-align: center;
    border: 1px dashed rgba(192,196,204,1);
    display:inline-block;
    font-size:14px;
    color:#C0C4CC;
    cursor: pointer;
    margin-right:10px;
    text-align: center;
    border-radius: 4px;
 }
 .import-info{
    color:#606266;
    margin-top:10px;
  }
 .upload-ele .el-button{
    border:none;
    color: #C0C4CC;
 }
 .upload-ele .el-button--small{
   padding: 7px 15px;
 }
 .upload-btn .el-icon-upload2{
    font-size:16px;
    color:#C0C4CC;
 }
 /*.upload-btn:hover .el-button,.upload-btn .el-button:focus{
   color: #1890ff;
 }
 .upload-btn .upload-ele:hove .el-button{
    color: #1890ff;
 }
 .upload-btn:hover .el-icon-upload2{
    color: #1890ff;
 }*/
 .upload-btn:hover{
   border-color:#1890ff;
 }
 .line{
   border-top: 1px solid #e4e7ed;
   position:absolute;
   left:0px;
   top:15px;
   width:100%;
 }
 .upload-rules{
   color: #909399;
   font-size:13px;
   line-height:18px;
   margin-top:30px;
 }
 .send-goods{
   width:150px;
   display:inline-block;
 }
 .gift-name-input{
   display:inline-block;
 }
 .gift-name{
   display:inline-block;
 }
 .w-120{
   width:120px;
 }
 .fiter-class-container {
  margin: -15px 0 22px 70px;
}
.gic-people--button {
  background: #f2f3f4;
  padding: 0 0 20px 124px;
}
.el-icon-edit{
  cursor: pointer;
}
.warm-tip{
  font-size: 13px;
  color: #C0C4CC;
}
</style>
