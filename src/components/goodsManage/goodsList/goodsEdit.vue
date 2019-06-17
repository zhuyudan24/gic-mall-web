<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }" @click.stop="hideDrag('-1')">
    <div class="mall-content-section">
      <div class="mall-content-title" style="position:relative;">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/goodsList' }">商品列表</el-breadcrumb-item>
          <el-breadcrumb-item>{{ pageTitle }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>{{ pageTitle }}</span>
        </h3>
        <div style="width:800px;position:absolute;left:50%;z-index:1;top:35px;transform: translateX(-50%);" v-show="goodsForm.createSource == '0'">
          <el-alert title="即日起启用新版商品管理，请商户前往新版微商城及时完善商品资料。完善路径：新版->商品列表->编辑->保存，完善时可参考“旧版商品详情”。一经保存“旧版商品详情”入口关闭。请在10月15日之前完善，否则商品会被清除，感谢您的理解与支持。" type="warning"> </el-alert>
          <a :href="imgUrl" style="position:absolute;right:-120px;z-index:11;top:25px;font-size:14px" target="_blank">查看旧版商品详情</a>
        </div>
      </div>
      <div class="mall-section">
        <el-form :model="goodsForm" :rules="goodsRules" ref="goodsForm" label-width="90px" class="demo-ruleForm" label-position="left">
          <div class="form-group">
            <p class="title">基本信息</p>
            <el-form-item label="商品类型">
              <span>手动发布</span>
            </el-form-item>
            <el-form-item label="商品品类">
              <goodsCate ref="modal" @getCateIds="getCateIds" :selectCateData="selectCateData" @deleteSkuMess="deleteSkuMess"></goodsCate>
              <span style="display: none">{{ refash }}</span>
            </el-form-item>
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="goodsForm.goodsName" type="text" class="w-900" @input="value => goodsLimit(value)">
                <span slot="suffix">{{ goodsFormLen.nameLen }}/30</span>
              </el-input>
            </el-form-item>
            <el-form-item label="商品品牌" prop="goodsBrandSelect">
              <el-select v-model="goodsForm.goodsBrandSelect" placeholder="请选择" class="w-900" value-key="brandId">
                <el-option v-for="(item, index) in goodsForm.goodsBrand" :key="index" :label="item.brandName" :value="item.brandId"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品属性" style="display: inline-block;" v-show="selectCateData.length > 0" required> </el-form-item>
            <!-- 商品属性 -->
            <div class="goods-nature" v-show="this.selectCateData.length > 0" style="margin-bottom:22px">
              <!-- {{goodsForm.goodsPropertyData}} -->
              <div style="display:inline-block" v-for="(item, index) in goodsForm.goodsPropertyData" :key="index">
                <el-form-item
                  label-width="80px"
                  :prop="'goodsPropertyData.' + index + '.mallPropValues'"
                  :label="item.propertyName"
                  class="goods-nature-item"
                  :key="item.propertyId"
                  v-if="item.bizRequire"
                  :rules="[{ required: true, message: '请输入' + item.propertyName, trigger: item.propertyType === 'TYP_MULTI' || item.propertyType === 'TYP_CHECK' || item.propertyType === 'TYP_SINGLE' ? 'change' : 'blur' }]"
                >
                  <!-- :trigger:(item.propertyType==='TYP_SINGLE'||item.propertyType==='TYP_CHECK'||item.propertyType==='TYP_MULTI')?'change':'blur' -->
                  <!-- 文本，整数，实数 -->

                  <el-input type="text" class="w-260" v-model="item.mallPropValues" v-if="item.propertyType === 'TYP_TEXT' || item.propertyType === 'TYP_NUM' || item.propertyType === 'TYP_REAL_NUM'"> </el-input>
                  <!-- 单选 -->
                  <el-select @change="changeProperty(item, index)" v-model="item.mallPropValues" placeholder="请选择" class="w-260" v-if="item.propertyType === 'TYP_SINGLE'" value-key="valueId" filterable clearable>
                    <el-option v-for="(itm, indx) in item.children" :key="indx" :label="itm.valueName" :value="itm"> </el-option>
                  </el-select>
                  <!-- 多选 -->

                  <el-select @change="changeProperty(item, index)" v-model="item.mallPropValues" placeholder="请选择" multiple class="w-260" value-key="valueId" v-if="item.propertyType === 'TYP_CHECK'" filterable>
                    <el-option v-for="(itm, indx) in item.children" :key="indx" :label="itm.valueName" :value="itm"> </el-option>
                  </el-select>
                  <!-- 勾选 -->
                  <treeselect @input="changeProperty(item, index)" v-model="item.mallPropValues" :multiple="true" :options="item.children" placeholder="请选择" v-if="item.propertyType === 'TYP_MULTI'" class="w-260 tree-select" />
                  <!-- 时间属性 -->
                  <el-date-picker v-model="item.mallPropValues" type="datetime" placeholder="选择日期时间" class="w-260" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-if="item.propertyType === 'TYP_TIME'"> </el-date-picker>
                  <!-- 货币单位 -->
                  <div v-if="item.propertyType === 'TYP_CURRENCY'" style="display:inline-block">
                    <el-input type="text" class="w-220" v-model="item.mallPropValues"> </el-input>
                    <span class="property-unit">{{ item.units }}</span>
                  </div>
                  <!-- 百分比 -->
                  <div v-if="item.propertyType === 'TYP_PERCENT'" style="display:inline-block">
                    <el-input type="text" class="w-220" v-model="item.mallPropValues"> </el-input>
                    <span class="property-unit">%</span>
                  </div>
                  <i class="el-icon-delete" @click="deleteProperty(item, index)" :class="item.bizCommon ? 'common-property' : ''"></i>
                </el-form-item>
                <el-form-item label-width="80px" :prop="item.propertyName" :label="item.propertyName" class="goods-nature-item" :key="item.propertyId" v-else>
                  <!-- 文本，整数，实数 -->
                  <el-input type="text" class="w-260" v-model="item.mallPropValues" v-if="item.propertyType === 'TYP_TEXT' || item.propertyType === 'TYP_NUM' || item.propertyType === 'TYP_REAL_NUM'"> </el-input>
                  <!-- 单选 -->
                  <el-select @change="changeProperty(item, index)" v-model="item.mallPropValues" placeholder="请选择" class="w-260" v-if="item.propertyType === 'TYP_SINGLE'" value-key="valueId" filterable clearable>
                    <el-option v-for="(itm, indx) in item.children" :key="indx" :label="itm.valueName" :value="itm"> </el-option>
                  </el-select>
                  <!-- 多选 -->
                  <el-select @change="changeProperty(item, index)" v-model="item.mallPropValues" placeholder="请选择" multiple class="w-260" value-key="valueId" v-if="item.propertyType === 'TYP_CHECK'" filterable>
                    <el-option v-for="(itm, indx) in item.children" :key="indx" :label="itm.valueName" :value="itm"> </el-option>
                  </el-select>
                  <!-- 勾选 -->
                  <treeselect @input="changeProperty(item, index)" v-model="item.mallPropValues" :multiple="true" :options="item.children" placeholder="请选择" v-if="item.propertyType === 'TYP_MULTI'" class="w-260 tree-select" />
                  <!-- 时间属性 -->
                  <el-date-picker v-model="item.mallPropValues" type="datetime" placeholder="选择日期时间" class="w-260" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-if="item.propertyType === 'TYP_TIME'"> </el-date-picker>
                  <!-- 货币单位 -->
                  <div v-if="item.propertyType === 'TYP_CURRENCY'" style="display:inline-block">
                    <el-input type="text" class="w-220" v-model="item.mallPropValues"> </el-input>
                    <span class="property-unit">{{ item.units }}</span>
                  </div>
                  <!-- 百分比 -->
                  <div v-if="item.propertyType === 'TYP_PERCENT'" style="display:inline-block">
                    <el-input type="text" class="w-220" v-model="item.mallPropValues"> </el-input>
                    <span class="property-unit">%</span>
                  </div>
                  <i class="el-icon-delete" @click="deleteProperty(item, index)" :class="item.bizCommon ? 'common-property' : ''"></i>
                </el-form-item>
              </div>
              <div class="add-property">
                <el-button type="primary" @click="addProperty">添加属性</el-button>
              </div>
            </div>
            <el-form-item label="商品主图" style="width:856px">
              <div class="upload-list-box">
                <div style="display: inline-block;vertical-align: top;margin-right:5px">
                  <div v-for="(item, index) in dialogImageUrl" :key="index" class="img-box">
                    <img width="100%" :src="item.imageUrl" alt="" />
                    <i class="el-icon-arrow-left" @click="moveLeft(index)" v-show="index !== 0"></i>
                    <i class="el-icon-arrow-right" @click="moveRight(index)" v-show="index + 1 !== dialogImageUrl.length"></i>
                    <i class="el-icon-delete" @click="deteletDialogImageUrl(index)"></i>
                    <i class="el-icon-zoom-in" @click="enlargeDialogImageUrl(index)"></i>
                    <div class="dialog-img"></div>
                  </div>
                  <el-upload :action="uploadAction" :headers="headersUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :before-upload="beforeUpload" :on-success="uploadSuccess" with-credentials :show-file-list="false" style="display: inline-block;vertical-align: top;" v-show="uploadStatus">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </div>

                <el-dialog :visible.sync="dialogVisibleImg">
                  <img width="100%" :src="dialogEnlargeImageUrl" alt="" />
                </el-dialog>
              </div>
              <span data-v-75235512="" style="font-size: 12px; color: rgb(144, 147, 153);">图片规格宽度大于等于700px，高度不大于宽度的2倍，单张图片大小不超过 2 MB，至少上传1张，最多可上传 10 张。</span>
            </el-form-item>
            <el-form-item label="图文详情">
              <div class="tinymce-wrap">
                <tinymce-edit ref="tinymceWrap" :bodyHtml="goodsForm.imgTextEdit" :projectName="projectName"></tinymce-edit>
              </div>
            </el-form-item>
            <el-form-item label="商品分类" prop="goodsClassifySelect" class="tree-goods-cate">
              <treeselect v-model="goodsForm.goodsClassifySelect" :multiple="true" :options="goodsForm.goodsClassifyData" :disable-branch-nodes="true" placeholder="所有分类" class="w-320" />
            </el-form-item>
          </div>
          <div class="form-group" v-show="goodsForm.categoryIds.length > 0">
            <p class="title">规格信息</p>
            <el-button class="add-size" type="primary" size="medium" @click="handleAddStandard" style="margin:0 0 20px 32px">添加规格</el-button>
            <el-form-item label="商品规格" v-show="goodsForm.tableStandardList.length > 0">
              <table class="border-table w-900" v-for="(stardItem, stardIndex) in goodsForm.tableStandardList" :key="stardIndex">
                <thead>
                  <tr>
                    <th style="width:300px">{{ stardItem.standardName }}</th>
                    <th style="width:300px">备注</th>
                    <th style="width:200px">
                      <a href="JavaScript:void(0)" class="border-table-operate" @click="handleAddStandardValue(stardItem, stardIndex)">添加规格值</a>
                      <a href="JavaScript:void(0)" @click="deleteStandard(stardItem, stardIndex)">删除规格</a>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(valueItem, valueIndex) in stardItem.standardValues" :key="valueIndex">
                    <td>{{ valueItem.valueName }}</td>
                    <td>
                      <el-input size="small" placeholder="请输入内容" v-model="valueItem.remark" @input="remarkLimit(valueItem)"> </el-input>
                    </td>
                    <td><a href="JavaScript:void(0)" @click="deleteStandardValue(stardIndex, valueIndex, stardItem, valueItem)">删除</a></td>
                  </tr>
                </tbody>
              </table>
            </el-form-item>
            <el-form-item label="规格图片" v-show="table1ShowStatus">
              <span style="font-size:12px;color:#909399">图片规格≥200*200，高度不大于宽度的2倍 ，单张图片大小不超过 2 MB</span>
              <div style="width:900px;overflow-x:auto">
                <table class="border-table w-900">
                  <thead>
                    <tr>
                      <th v-for="(keyHeaderItem, keyHeaderIndex) in goodsForm.standardKeyHeaderList" :key="keyHeaderIndex">
                        {{ keyHeaderItem.standardName }}
                      </th>
                      <th>图片</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(item1, index1) in goodsForm.combineKeyValueList" :key="index1">
                      <td v-for="(item2, index2) in item1" :key="index2">
                        <div v-if="item1.length - index2 < 2" class="table-upload">
                          <el-upload class="avatar-uploader" :action="uploadAction" :headers="headersUpload" :show-file-list="false" :on-success="(response, file, fileList) => tableUploadSuccess(response, file, fileList, item2)" :before-upload="tableBeforeUpload" with-credentials>
                            <img v-if="item2.valueName" :src="item2.valueName" class="avatar" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                        </div>
                        <div v-else>{{ item2.valueName }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-form-item>
            <el-form-item label="sku信息" v-show="goodsForm.tableStandardList.length > 0">
              <div style="position:relative;" class="w-900">
                <div class="sku-top">
                  <el-input placeholder="价格" size="small" type="tel" class="sku-input" @blur="priceLimit(batchPrice)" v-model="batchPrice"></el-input>
                  <el-input placeholder="库存" size="small" class="sku-input" @input="stockLimit(batchStock)" v-model="batchStock"></el-input>
                  <el-input placeholder="SKU编码" size="small" class="sku-input" @input="SKULimit(batchSku)" v-model="batchSku"></el-input>
                  <el-input placeholder="商品条形码" size="small" class="sku-input" @input="barLimit(batchBar)" v-model="batchBar"></el-input>
                  <el-button type="primary" size="small" @click="batchSetSku">批量填充</el-button>
                </div>
                <div style="width:900px;overflow-x:auto">
                  <table class="border-table w-900">
                    <thead>
                      <tr>
                        <th style="width:120px" v-for="(keyHeaderItem, keyHeaderIndex) in goodsForm.standardAllHeaderList" :key="keyHeaderIndex">
                          {{ keyHeaderItem.standardName }}
                        </th>
                        <th style="width:80px">价格</th>
                        <th style="width:80px">库存</th>
                        <th style="width:200px">SKU编码</th>
                        <th style="width:120px">商品条形码</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item1, index1) in goodsForm.combineKeyAllValueList" v-show="table2ShowStatus" :key="index1">
                        <td v-for="(item2, index2) in item1" style="width:120px" :key="index2">
                          <span v-if="item1.length - index2 < 5">
                            <el-input size="small" v-model="item2.valueName" @input="sliceLimit(item1, item2, index2)" @blur="skuInput(item1, item2, index1, index2)"> </el-input>
                          </span>
                          <span v-else>{{ item2.valueName ? item2.valueName : '' }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="spu信息" v-show="goodsForm.tableStandardList.length > 0">
              <div style="width:900px;overflow-x:auto">
                <table class="border-table w-900">
                  <thead>
                    <tr>
                      <th>商品货号</th>
                      <th>价格</th>
                      <th>库存</th>
                      <th>商品条形码</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <el-form-item prop="proCode">
                          <el-input size="small" placeholder="请输入内容" v-model="goodsForm.proCode" @input="proCodeLimit(goodsForm.proCode)"> </el-input>
                        </el-form-item>
                      </td>
                      <td>
                        <el-form-item prop="mallProSpuPrice">
                          <el-input size="small" placeholder="请输入内容" v-model="goodsForm.mallProSpuPrice"> </el-input>
                        </el-form-item>
                      </td>
                      <td>
                        <el-input size="small" placeholder="" disabled v-model="goodsForm.stock"> </el-input>
                      </td>
                      <td>
                        <el-input size="small" placeholder="请输入内容" v-model="goodsForm.proCodeQuery" @input="proCodeQueryLimit(goodsForm.proCodeQuery)"> </el-input>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-form-item>
          </div>
          <div class="form-group">
            <p class="title">销售信息</p>
            <el-form-item label="运费模板" prop="templateSelect">
              <el-select v-model="goodsForm.templateSelect" placeholder="请选择" class="w-320">
                <el-option v-for="(item, index) in goodsForm.templateList" :key="index" :label="item.templateName" :value="item.freightTemplateId"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上架方式">
              <template>
                <el-radio v-model="goodsForm.putaway" label="1">立即上架</el-radio>
                <el-radio v-model="goodsForm.putaway" label="2">定时上架</el-radio>
                <el-radio v-model="goodsForm.putaway" label="3">放入仓库</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="上架时间" v-show="goodsForm.putaway === '2'">
              <el-date-picker v-model="goodsForm.putawayTime" type="datetime" placeholder="选择日期时间" class="w-320" :pickerOptions="pickerOptions"> </el-date-picker>
            </el-form-item>
            <div class="confim-btn" :style="{ width: fixedWidth + 'px' }">
              <el-form-item class="fix-btn">
                <el-button type="primary" @click="submitGoodsForm('goodsForm')" size="small" :loading="submitLoading">保存</el-button>
                <el-button @click="cancelGoodsForm" size="small">返回</el-button>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 属性值弹框 -->
    <addProperty v-if="propertyData.dialogVisible" :propertyData="propertyData" @getPropertyList="getPropertyList"></addProperty>
    <!-- 添加属性的弹框 -->
    <addStandard v-if="standardData.dialogVisible" :standardData="standardData" @getStandardSelectList="getStandardSelectList"></addStandard>
    <!-- 添加属性值弹框 -->
    <addStandardValue v-if="standardGroupData.dialogVisible" :standardGroupData="standardGroupData" @getStandardSelectValueList="getStandardSelectValueList"></addStandardValue>
  </div>
</template>

<script>
import qs from 'qs';
import getInputVal from '../../../../static/js/common.js';
import request from '../../../api/request.js';
import copy from '../../../../static/js/clone.js';
import goodsCate from '../../common/categoryTem';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

import tinymceEdit from '../../common/tinymce-edit'; //
import addProperty from '../../common/propertyTem';
import addStandard from '../../common/standardTem';
import addStandardValue from '../../common/standardValueTem';

export default {
  data() {
    let exitProCodeValidator = (rule, value, callback) => {
      // var that = this;
      let params = {
        mallProId: this.goodsForm.mallProId == '-1' ? '' : this.goodsForm.mallProId,
        proCode: this.goodsForm.proCode
      };
      request.get('/api-mall/check-pro-code', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (!res.data.result) {
            callback(new Error('商品货号禁止重复'));
          } else {
            callback();
          }
        } else {
          callback(new Error(res.data.result));
        }
      });
    };
    let proSpuPriceValidate = (rule, value, callback) => {
      if (Number(value) === 0) {
        callback(new Error('请输入大于0的数字'));
      } else {
        if (!Number(value)) {
          callback(new Error('请输入数字'));
        } else {
          callback();
        }
      }
    };
    return {
      getInputVal: getInputVal,
      getTime: getInputVal.getTime,
      getSeconds: getInputVal.getSeconds,
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      fixedWidth: document.documentElement.clientWidth - 200,
      goodsForm: {
        // 商品信息对象
        goodsName: '',
        mallProId: '', //商品id
        createSource: 0, //1代表新商品。0代表老商品
        goodsBrand: [], //商品品牌列表
        goodsBrandSelect: '', //商品品牌对象
        categoryIds: [], //商品品类ids
        goodsClassifyData: [], //商品分类
        goodsPropertyData: [], //商品属性
        goodsClassifySelect: null,
        goodsStandardData: [], //下拉列表商品规格
        goodsStandardSelect: [], //下拉列表选中商品规格id
        tableStandardList: [], //表格里的规格数据

        goodsStandardValueData: [], //下拉列表商品规格值
        goodsStandardValueSelect: '', //下拉列表选中商品规格值id
        tableStandardValueList: [], //表格里的规格数据
        dataIndex: 0,

        standardKeyList: [], //关键规格
        combineKeyValueList: [], //排列组合后的
        standardKeyHeaderList: [],

        skuImageJson: [], //提交的关键规格值图片
        mallProStandardJson: [], //提交的商品规格
        skuJson: [], //sku信息

        editSkuKeyJson: [], //编辑关键规格状态下
        editSkuKeyHeader: [], //编辑关键规格头部状态下

        combineKeyAllValueList: [],
        standardUnkeyList: [], //非关键规格
        standardUnkeyHeaderList: [],

        combineAllList: [], //关键规格和非关键规格排列组合后的
        standardAllHeaderList: [], //关键规格和非关键规格头部排列组合后的

        stock: '', //spu库存
        mallProSpuPrice: '', //spu价格
        proCode: '', //商品code
        proCodeQuery: '', //商品二维码

        imgTextEdit: '', //图文编辑
        templateList: [], //运费模板
        templateSelect: '',
        putaway: '1', //上方式
        putawayTime: '' //上架时间
      },
      table1ShowStatus: false,
      table2ShowStatus: false,
      tinymceHtml: '请输入内容',
      // datetime:new Date(),
      goodsRules: {
        //校验
        goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goodsBrandSelect: [{ required: true, message: '请选择商品品牌', trigger: 'blur' }],
        goodsClassifySelect: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
        templateSelect: [{ required: true, message: '请选择运费模板', trigger: 'blur' }],
        proCode: [{ required: true, message: '请填写商品货号', trigger: 'blur' }, { validator: exitProCodeValidator, trigger: 'blur' }],
        mallProSpuPrice: [{ required: true, message: '请填写商品价格', trigger: 'blur' }, { validator: proSpuPriceValidate, trigger: 'blur' }]
      },
      goodsFormLen: {
        nameLen: 0 //商品名字的字符限制
      },
      uploadAction: window.location.origin + '/api-plug/upload-img?requestProject=mall',
      headersUpload: {
        sign: ''
      },
      // uploadAction:'http://gicdev.demogic.com/api-plug/upload-img?requestProject=mall',
      uploadStatus: true, //上传按钮
      dialogVisible: false, //商品规格弹框
      dialogStandardValue: false, //商品规格值弹框
      dialogImageUrl: [],
      dialogEnlargeImageUrl: '', //放大的
      // dialogEnlargeImageUrl: '', //放大的
      dialogVisibleImg: false, //上传图片
      projectName: 'mall',
      batchPrice: '', //批量价格
      batchStock: '', //批量库存
      batchSku: '', //批量Sku编码
      batchBar: '', //批量条形码

      selectCateData: [], //商品品类回显
      refash: true,
      imgUrl: '',
      selectModalCopy: {},
      pageTitle: '新建商品',
      activeName: '',
      submitLoading: false, //按钮加载中
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime();
        }
      },
      propertyData: {
        //属性添加
        dialogVisible: false,
        categoryIds: '', //品类ids
        propertySelected: [] //选择过的回显
      },
      propertyListCopy: [],
      // 规格
      standardData: {
        dialogVisible: false,
        categoryIds: '', //品类ids
        standardSelected: [] //选择过的回显
      },
      //规格值组
      standardGroupData: {
        dialogVisible: false,
        categoryIds: '', //品类ids
        standardId: '',
        standardName: '',
        hasGroup: 1,
        standardSelected: []
      }
    };
  },
  mounted: function() {
    // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
    window.onbeforeunload = function(e) {
      // var storage = window.localStorage;
      // storage.clear('searchObj');
      localStorage.removeItem('goodsSearch');
    };
  },
  created() {
    this.getGoodsBrandList(); //商品品牌
    this.getClassifyList(); //商品分类
    this.getTemplateList(); //运费模板的列表
    this.goodsForm.mallProId = this.$route.params.mallProId;
    this.goodsForm.createSource = this.$route.params.createSource;
    this.activeName = this.$route.params.activeName;
    if (this.goodsForm.mallProId !== '-1' && this.goodsForm.createSource == '1') {
      //新版商品编辑页面
      this.getEditMes(); //编辑状态下商品信息
      this.getStandardImg(); //编辑状态下商品关键规格图片
      this.pageTitle = '编辑商品';
    } else if (this.goodsForm.mallProId !== '-1' && this.goodsForm.createSource == '0') {
      //老版商品编辑页面
      this.getEditOldMes();
      this.pageTitle = '编辑商品';
    }
    this.imgUrl = window.location.origin + '/gicweb/add-mall-goods?mallProId=' + this.goodsForm.mallProId;
  },

  computed: {},
  methods: {
    //根据新版商品id查询信息
    getEditMes() {
      let params = {
        mallProId: this.goodsForm.mallProId
      };
      request.get('/api-mall/get-mall-good', { params }).then(res => {
        if (res.data.errorCode === 0) {
          for (let i in res.data.result.mallCategories) {
            //处理shangpin 品类
            this.goodsForm.categoryIds.push(res.data.result.mallCategories[i].categoryId);
          }
          if (res.data.result.mallCategories === null) {
            this.selectCateData = [];
          } else {
            this.selectCateData = res.data.result.mallCategories; //商品品类
          }

          this.getProperyList(); //拉去商品的属性
          this.goodsForm.imgTextEdit = res.data.result.detailDescription; //商品图文详情
          this.goodsForm.goodsClassifySelect = res.data.result.mallProTagId; //商品分类
          this.goodsForm.goodsName = copy(res.data.result.proName); //商品名称

          this.goodsFormLen.nameLen = getInputVal.getZhLen(this.goodsForm.goodsName); //名字的限制

          this.goodsForm.tableStandardList = JSON.parse(res.data.result.mallProStandardJson);
          // 规格弹框
          for (let i in this.goodsForm.tableStandardList) {
            this.goodsForm.goodsStandardSelect.push(this.goodsForm.tableStandardList[i].standardId);
          }
          if (res.data.result.skuJson) {
            this.table2ShowStatus = true;
          }
          this.goodsForm.tableStandardList = JSON.parse(res.data.result.mallProStandardJson); //商品规格信息

          if (res.data.result.mallProImageUrl) {
            this.dialogImageUrl = res.data.result.mallProImageUrl; //商品主图
          } else {
            this.dialogImageUrl = [];
          }
          if (this.dialogImageUrl.length >= 10) {
            this.uploadStatus = false;
          } else {
            this.uploadStatus = true;
          }
          this.goodsForm.goodsBrandSelect = res.data.result.brandId === '-1' ? '' : res.data.result.brandId; //商品品牌

          // 处理商品sku信息
          if (res.data.result.skuJson) {
            let header = JSON.parse(res.data.result.skuJson[0].mallPropValues);
            for (let i in header) {
              // 处理得到关键规格的头部列表goodsForm.standardAllHeaderList
              this.goodsForm.standardAllHeaderList.push({
                standardName: header[i].propName,
                standardId: header[i].propId
              });
            }
          }

          for (let i in res.data.result.skuJson) {
            let tem = JSON.parse(res.data.result.skuJson[i].mallPropValues);
            tem.push({
              valueName: res.data.result.skuJson[i].mallProSkuPrice //得到列表数据
            });
            tem.push({
              valueName: res.data.result.skuJson[i].stock //得到列表数据
            });
            tem.push({
              valueName: res.data.result.skuJson[i].mallProSkuCode //得到列表数据
            });
            tem.push({
              valueName: res.data.result.skuJson[i].mallProSkuBarCode //得到列表数据
            });
            this.goodsForm.combineKeyAllValueList.push(tem);
          }

          this.goodsForm.proCode = res.data.result.proCode; //商品spu货号
          this.goodsForm.proCodeQuery = res.data.result.proCodeQuery; //商品spu条形码
          this.goodsForm.mallProSpuPrice = res.data.result.mallProSpuPrice; //商品spu价格
          this.goodsForm.stock = res.data.result.stock; //商品spu价格
          this.goodsForm.templateSelect = res.data.result.freightTemplateId; //运费模板

          if (res.data.result.status === 1) {
            this.goodsForm.putaway = '3';
          } else {
            this.goodsForm.putaway = String(res.data.result.upShelvesStatus); //上架方式
          }
          this.goodsForm.putawayTime = res.data.result.upShelvesTime; //上架时间
          this.addStock(); //计算库存
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //根据老版商品id查询信息
    getEditOldMes() {
      let params = {
        mallProId: this.goodsForm.mallProId
      };
      request.get('/api-mall/get-mall-good', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.goodsForm.imgTextEdit = res.data.result.detailDescription; //商品图文详情
          this.goodsForm.goodsClassifySelect = res.data.result.mallProTagId; //商品分类
          this.goodsForm.goodsName = copy(res.data.result.proName); //商品名称
          this.goodsFormLen.nameLen = getInputVal.getZhLen(this.goodsForm.goodsName); //名字的限制
          this.dialogImageUrl = res.data.result.mallProImageUrl; //商品主图
          this.goodsForm.goodsBrandSelect = res.data.result.brandId === '-1' ? '' : res.data.result.brandId; //商品品牌
          this.goodsForm.templateSelect = res.data.result.freightTemplateId; //运费模板
          this.goodsForm.putaway = String(res.data.result.upShelvesStatus); //上架方式
          this.goodsForm.putawayTime = res.data.result.upShelvesTime; //上架时间
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 拉取商品的规格图片信息
    getStandardImg() {
      let params = {
        mallProId: this.goodsForm.mallProId
      };
      request.get('/api-mall/list-mall-goods-standard-image', { params }).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.length) {
            let header = res.data.result[0].standardValues;
            for (let i in header) {
              // 处理得到关键规格的头部列表goodsForm.standardKeyHeaderList
              this.goodsForm.standardKeyHeaderList.push({
                standardName: header[i].standardName,
                standardId: header[i].standardId
              });
            }
            if (res.data.result) {
              //显示关键规格
              this.table1ShowStatus = true;
            }

            // 处理下来列表goodsForm.combineKeyValueList
            for (let i in res.data.result) {
              let tem = res.data.result[i].standardValues;
              tem.push({
                valueName: res.data.result[i].imageUrl //得到列表数据
              });
              this.goodsForm.combineKeyValueList.push(tem);
            }
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 商品名字的字符限制
    goodsLimit(value) {
      this.$nextTick(() => {
        this.goodsForm.goodsName = getInputVal.getInputVal(value, 30);
        this.goodsFormLen.nameLen = getInputVal.getZhLen(this.goodsForm.goodsName);
      });
    },
    // 商品规格备注的字数限制
    remarkLimit(item) {
      this.$nextTick(() => {
        item.remark = getInputVal.getInputVal(item.remark, 10);
      });
    },
    // 批量价格
    priceLimit(value) {
      if (!Number(this.batchPrice)) {
        this.$message.error('请输入数字类型');
        this.batchPrice = '';
      } else {
        this.batchPrice = Number(this.batchPrice).toFixed(2);
      }
    },
    // 批量库存
    stockLimit(value) {
      this.$nextTick(() => {
        this.batchStock = value.replace(/[^\d]/g, '');
        this.batchStock = getInputVal.getInputVal(value, 3);
      });
    },
    // 批量SKU编码
    SKULimit(value) {
      this.$nextTick(() => {
        this.batchSku = getInputVal.getInputVal(value, 16);
      });
    },
    // 批量条形码
    barLimit(value) {
      this.$nextTick(() => {
        this.batchBar = getInputVal.getInputVal(value, 16);
      });
    },
    // spu货号
    proCodeLimit(value) {
      this.$nextTick(() => {
        this.goodsForm.proCode = getInputVal.getInputVal(value, 16);
      });
    },
    proCodeQueryLimit(value) {
      this.$nextTick(() => {
        this.goodsForm.proCodeQuery = getInputVal.getInputVal(value, 16);
      });
    },
    //获取商品品牌
    getGoodsBrandList() {
      request.get('/api-mall/list-enterprise-brand').then(res => {
        if (res.data.errorCode === 0) {
          this.goodsForm.goodsBrand = res.data.result;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取商品分类
    getClassifyList() {
      request.get('/api-mall/list_mall_goods_tag_tree').then(res => {
        if (res.data.errorCode === 0) {
          this.goodsForm.goodsClassifyData.push({
            childTagList: res.data.result.childTagList,
            mallProTagId: res.data.result.mallProTagId,
            tagName: res.data.result.tagName
          });
          this.getTree(this.goodsForm.goodsClassifyData);
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

    // 获取商品属性
    getProperyList() {
      this.goodsForm.goodsPropertyData = [];
      let params = {
        categoryIds: this.goodsForm.categoryIds.join(',')
      };
      if (this.goodsForm.mallProId !== '-1') {
        params.mallProId = this.goodsForm.mallProId;
      }
      request.get('/api-mall/list-mall-goods-property', { params }).then(res => {
        if (res.data.errorCode === 0) {
          let property = [];
          property = res.data.result;

          for (let m in property) {
            //文本类
            if (this.goodsForm.mallProId === '-1' || this.goodsForm.createSource === '0') {
              //新建或者是老商品的编辑
              if (property[m].propertyType === 'TYP_TEXT' || property[m].propertyType === 'TYP_NUM' || property[m].propertyType === 'TYP_REAL_NUM' || property[m].propertyType === 'TYP_TIME' || property[m].propertyType === 'TYP_CURRENCY' || property[m].propertyType === 'TYP_PERCENT') {
                property[m].mallPropValues = '';
              } else if (property[m].propertyType === 'TYP_MULTI') {
                //勾选类
                for (let j in property[m].children) {
                  //处理下来列表的数据适用插件
                  property[m].children[j].label = property[m].children[j].valueName;
                  property[m].children[j].id = property[m].children[j].valueId;
                }
                property[m].mallPropValues = null;
              } else if (property[m].propertyType === 'TYP_CHECK') {
                //多选
                property[m].mallPropValues = [];
              }
            } else {
              //编辑 文本
              if (property[m].propertyType === 'TYP_TEXT' || property[m].propertyType === 'TYP_NUM' || property[m].propertyType === 'TYP_REAL_NUM' || property[m].propertyType === 'TYP_TIME' || property[m].propertyType === 'TYP_CURRENCY' || property[m].propertyType === 'TYP_PERCENT') {
                if (property[m].mallPropValues.length) {
                  property[m].mallPropValues = property[m].mallPropValues[0].valueName;
                } else {
                  property[m].mallPropValues = '';
                }
              } else if (property[m].propertyType === 'TYP_MULTI') {
                //勾选类

                for (let j in property[m].children) {
                  //处理下来列表的数据适用插件
                  property[m].children[j].label = property[m].children[j].valueName;
                  property[m].children[j].id = property[m].children[j].valueId;
                }
                if (property[m].mallPropValues.length) {
                  let checkSelect = [];
                  for (let k in property[m].mallPropValues) {
                    checkSelect.push(property[m].mallPropValues[k].valueId);
                  }

                  property[m].mallPropValues = checkSelect;
                } else {
                  property[m].mallPropValues = null;
                }
              } else if (property[m].propertyType === 'TYP_SINGLE') {
                //单选
                if (property[m].mallPropValues.length) {
                  property[m].mallPropValues = property[m].mallPropValues[0];
                } else {
                  property[m].mallPropValues = '';
                }
              } else {
                let dragList = [];
                for (let k in property[m].mallPropValues) {
                  //处理数据适用插件
                  dragList.push({
                    valueId: property[m].mallPropValues[k].valueId,
                    valueName: property[m].mallPropValues[k].valueName
                  });
                }
                property[m].mallPropValues = dragList;
              }
            }
          }
          this.goodsForm.goodsPropertyData = property;
          this.propertyListCopy = copy(this.goodsForm.goodsPropertyData);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 插入已经选择过的
    getPropertyList(val) {
      for (let item of val) {
        let bol = this.goodsForm.goodsPropertyData.some(i => {
          return i.propertyId === item.propertyId;
        });
        if (!bol) {
          //过滤已经选择过的
          this.goodsForm.goodsPropertyData.push(item);
        }
      }
      this.propertyListCopy = copy(this.goodsForm.goodsPropertyData);
    },
    //添加属性
    addProperty() {
      let propertySelected = [];
      for (let item of this.propertyListCopy) {
        propertySelected.push(item.propertyId);
      }
      this.propertyData.propertySelected = propertySelected;
      this.propertyData.categoryIds = this.goodsForm.categoryIds.join(',');
      this.propertyData.dialogVisible = true;
    },
    // 删除属性品类的关联关系
    deleteProperty(item, index) {
      let params = {
        categoryId: this.goodsForm.categoryIds.join(','),
        propertyId: item.propertyId
      };
      request.post('/api-goods/delete-category-property', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.goodsForm.goodsPropertyData.splice(index, 1);
          this.propertyListCopy = copy(this.goodsForm.goodsPropertyData);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    changeProperty(item, index) {
      this.newCategoryProperty(item, index);
      this.propertyListCopy = copy(this.goodsForm.goodsPropertyData);
    },

    //新增品类和属性，属性值的关联关系
    newCategoryProperty(item, index) {
      let productPropertyValueIds = '';
      // let data = [];
      if (item.propertyType === 'TYP_MULTI') {
        //勾选
        for (let m of item.mallPropValues) {
          if (productPropertyValueIds === '') {
            productPropertyValueIds = m;
          } else {
            productPropertyValueIds = productPropertyValueIds + ',' + m;
          }
        }
      } else if (item.propertyType === 'TYP_CHECK') {
        //多选
        for (let m of item.mallPropValues) {
          if (productPropertyValueIds === '') {
            productPropertyValueIds = m.valueId;
          } else {
            productPropertyValueIds = productPropertyValueIds + ',' + m.valueId;
          }
        }
      } else if (item.propertyType === 'TYP_SINGLE') {
        //单选
        productPropertyValueIds = item.mallPropValues.valueId ? item.mallPropValues.valueId : '';
      }
      let params = {
        categoryIds: this.goodsForm.categoryIds.join(','), //品类id
        productPropertyId: item.propertyId, //属性id
        productPropertyName: item.propertyName, //属性名
        // data: JSON.stringify(data)
        productPropertyValueIds: productPropertyValueIds
      };

      if (params.productPropertyValueIds === '') {
        return false;
      }

      request.post('/api-goods/save-category-property', params).then(res => {
        if (res.data.errorCode === 0) {
          return false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 上传图片前
    beforeUpload(file) {
      if (this.dialogImageUrl === null) {
        this.dialogImageUrl = [];
      }
      if (this.dialogImageUrl.length > 9) {
        this.$message.warning('最多上传10张商品主图');
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error('请上传小于2MB的图片');
        return false;
      }
      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif') {
        this.$message.error('请上传jpg，png，gif格式的图片');
        return false;
      }
      if (localStorage.getItem('sign')) {
        this.headersUpload.sign = localStorage.getItem('sign');
      } else {
        this.headersUpload.sign = '';
      }
      var that = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.onload = function(event) {
          let image = new Image();
          image.onload = function() {
            let width = this.width;
            let height = this.height;
            if (width < 700 || width / height < 1 / 2) {
              that.$message.error('请上传正确的图片尺寸');
              reject();
            }
            resolve();
          };
          image.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisibleImg = true;
    },
    // 上传图片成功
    uploadSuccess(response, file, fileList) {
      if (response.errorCode === 0) {
        this.dialogImageUrl.push({
          imageUrl: response.result[0].qcloudImageUrl,
          imageCode: response.result[0].imageFiledCode
        });
        this.$message.success('上传成功');
        if (this.dialogImageUrl.length === 10) {
          this.uploadStatus = false;
        } else {
          this.uploadStatus = true;
        }
      } else {
        this.$message.error(response.message);
      }
    },
    // 删除
    deteletDialogImageUrl(index) {
      this.uploadStatus = true;
      this.dialogImageUrl.splice(index, 1);
    },
    // 放大
    enlargeDialogImageUrl(index) {
      this.dialogEnlargeImageUrl = this.dialogImageUrl[index].imageUrl;
      this.dialogVisibleImg = true;
    },
    // 左移一位
    moveLeft(index) {
      this.swapArray(this.dialogImageUrl, index, index - 1);
    },
    //右移一位
    moveRight(index) {
      this.swapArray(this.dialogImageUrl, index, index + 1);
    },
    //两个数据条换位置
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },

    // 表格里面的图片上传前面
    tableBeforeUpload(file) {
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error('请上传小于2MB的图片');
        return false;
      }
      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif') {
        this.$message.error('请上传jpg，png，gif格式的图片');
        return false;
      }
      if (localStorage.getItem('sign')) {
        this.headersUpload.sign = localStorage.getItem('sign');
      } else {
        this.headersUpload.sign = '';
      }
      var that = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.onload = function(event) {
          let image = new Image();
          image.onload = function() {
            let width = this.width;
            let height = this.height;
            if (width < 200 || width / height < 1 / 2 || height < 200) {
              that.$message.error('请上传正确的图片尺寸');
              reject();
            }
            resolve();
          };
          image.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    },
    // 表格里面的图片上传成功
    tableUploadSuccess(response, file, fileList, item2) {
      if (response.errorCode === 0) {
        item2.valueName = response.result[0].qcloudImageUrl;
        item2.valueId = response.result[0].imageFiledCode;
        this.$message.success('上传成功');
      } else {
        this.$message.error(response.message);
      }
    },
    // 得到品类id列表
    getCateIds(ids) {
      this.goodsForm.categoryIds = ids;
      if (!ids.length) {
        this.selectCateData = [];
      }
      this.getProperyList(); //商品属性
      // this.getStandardList(); //获取商品规格列表
    },
    // 删除品类清空规格相关的信息
    deleteSkuMess() {
      this.goodsForm.goodsStandardSelect = []; //已经选中额规格清空
      this.goodsForm.goodsStandardValueSelect = []; //已经选中额规格值清空
      this.goodsForm.tableStandardList = []; //清空规格数组
      this.goodsForm.standardKeyHeaderList = []; //清空关键规格图片头部
      this.goodsForm.combineKeyValueList = []; //清空关键规格图片tbody数据
      this.table1ShowStatus = false; //规格图片不显示
      this.goodsForm.standardAllHeaderList = []; //sku信息头部清空
      this.goodsForm.combineKeyAllValueList = []; //sku信息tbody数据清空
      this.table1ShowStatus2 = false;
    },
    // 添加规格获取规格列表
    handleAddStandard() {
      this.standardData.categoryIds = this.goodsForm.categoryIds.join(',');
      this.standardData.standardSelected = this.goodsForm.goodsStandardSelect;
      this.standardData.dialogVisible = true;
    },
    // // 获取规格列表
    getStandardList() {
      let params = {
        categoryIds: this.goodsForm.categoryIds.join(',')
      };
      request.get('/api-mall/list-mall-goods-standard', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.goodsForm.goodsStandardData = res.data.result;
        } else {
          this.$message.error(res.data.message);
        }
      });
      this.selectModalCopy.goodsStandardSelect = copy(this.goodsForm.goodsStandardSelect);
    },
    // 确认规格弹框
    getStandardSelectList(arr) {
      // let allSelect = copy(this.goodsForm.tableStandardList)
      this.goodsForm.tableStandardList = [];
      let temArr = [];
      for (let item of this.goodsForm.tableStandardList) {
        temArr.push(item.standardId);
      }
      // this.goodsForm.goodsStandardSelect = arr;
      let arrList = [];
      for (let item of arr) {
        arrList.push({
          standardName: item.standardName,
          standardId: item.standardId,
          pivotal: item.pivotal
        });
      }
      this.goodsForm.tableStandardList = arrList;
      for (let i of this.goodsForm.tableStandardList) {
        this.goodsForm.goodsStandardSelect.push(i.standardId);
      }
      // for (let i in this.goodsForm.goodsStandardSelect) {
      //   //this.goodsForm.goodsStandardSelect选中的规格的id数组
      //   if (temArr.indexOf(this.goodsForm.goodsStandardSelect[i]) === -1) {
      //     for (let j in this.goodsForm.goodsStandardData) {
      //       if (this.goodsForm.goodsStandardSelect[i] === this.goodsForm.goodsStandardData[j].standardId) {
      //         this.goodsForm.tableStandardList.push({
      //           standardName: this.goodsForm.goodsStandardData[j].standardName,
      //           standardId: this.goodsForm.goodsStandardData[j].standardId,
      //           pivotal: this.goodsForm.goodsStandardData[j].pivotal
      //         });
      //       }
      //     }
      //   }
      // }
      this.handleDate(this.goodsForm.tableStandardList);
      this.dialogVisible = false;
      this.selectModalCopy.goodsStandardSelect = copy(this.goodsForm.goodsStandardSelect);
    },
    // 删除规格
    deleteStandard(stardItem, index) {
      this.goodsForm.tableStandardList.splice(index, 1); //删除规格列表
      this.goodsForm.goodsStandardSelect.splice(index, 1);
      this.handleDate(this.goodsForm.tableStandardList); //调用数据处理得到新的数据渲染
      // 删除规格和品类的关联关系
      let params = {
        categoryId: this.goodsForm.categoryIds.join(','),
        standardId: stardItem.standardId
      };
      request.post('/api-goods/delete-category-standard', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          //关联关系删除成功
          return false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //添加规格值获取规格值列表
    handleAddStandardValue(item, index) {
      this.dataIndex = index;
      let params = {
        standardId: item.standardId
      };
      request.get('/api-goods/find-standardgroup-count', { params }).then(res => {
        //通过规格id判断是否有规格值组列表
        if (res.data.errorCode === 0) {
          if (res.data.result > 0) {
            //有规格值组
            this.standardGroupData.hasGroup = res.data.result;
          } else {
            //无规格值组
            this.standardGroupData.hasGroup = 0;
          }
          this.standardGroupData.standardId = item.standardId;
          this.standardGroupData.standardName = item.standardName;
          // this.standardGroupData.hasGroup = item.groupIs;
          this.standardGroupData.categoryIds = this.goodsForm.categoryIds.join(',');
          this.standardGroupData.standardSelected = item.standardValues;
          this.standardGroupData.dialogVisible = true;
        } else {
          this.$message.error(res.data.message);
        }
      });

      // this.dialogStandardValue = true;
      // this.getStandardValueList(standardId, index);
    },
    //获取规格值列表
    getStandardValueList(standardId, index) {
      let params = {
        categoryIds: this.goodsForm.categoryIds.join(','),
        standardId: standardId
      };
      request.get('/api-mall/list-mall-goods-standard-values', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.goodsForm.goodsStandardValueData = res.data.result;
        } else {
          this.$message.error(res.data.message);
        }
      });
      this.selectModalCopy.goodsStandardValueData = copy(this.goodsForm.goodsStandardValueData);
      // 通过index动态改变规格值弹框里面对应规格选中的值并赋值
      this.goodsForm.goodsStandardValueSelect = [];
      for (let i in this.goodsForm.tableStandardList[index].standardValues) {
        this.goodsForm.goodsStandardValueSelect.push(this.goodsForm.tableStandardList[index].standardValues[i].valueId);
      }
    },
    //删除规格值
    deleteStandardValue(stardIndex, valueIndex, item, valueItem) {
      if (this.goodsForm.tableStandardList[stardIndex].standardValues.length === 1) {
        //如果该规格下只有一个规格值时候，直接将该规格的规格值属性删掉
        delete this.goodsForm.tableStandardList[stardIndex].standardValues;
      } else {
        this.goodsForm.tableStandardList[stardIndex].standardValues.splice(valueIndex, 1); //删除规格值列表
      }
      this.handleDate(this.goodsForm.tableStandardList); //调用数据处理得到新的数据渲染
      // this.handleStandard(this.goodsForm.tableStandardList)

      // 删除规格值和品类，规格，规格值组的关联关系
      let params = {
        categoryId: this.goodsForm.categoryIds.join(','),
        standardId: item.standardId,
        groupId: valueItem.groupId ? valueItem.groupId : '',
        valueId: valueItem.valueId
      };
      request.post('/api-goods/delete-category-standard-value', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          //关联关系删除成功
          return false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 确认规格值弹框
    getStandardSelectValueList(arr) {
      this.goodsForm.tableStandardValueList = []; //规格值列表
      // for (let m in this.goodsForm.goodsStandardValueSelect) {
      //   for (let n in this.goodsForm.goodsStandardValueData) {
      //     if (this.goodsForm.goodsStandardValueSelect[m] === this.goodsForm.goodsStandardValueData[n].valueId) {
      //       this.goodsForm.tableStandardValueList.push({
      //         valueName: this.goodsForm.goodsStandardValueData[n].valueName,
      //         valueId: this.goodsForm.goodsStandardValueData[n].valueId,
      //         remark: ''
      //       });
      //     }
      //   }
      // }
      let arrList = [];
      for (let item of arr) {
        arrList.push({
          valueId: item.valueId,
          valueName: item.valueName,
          remark: '',
          groupId: item.groupId
        });
      }
      this.goodsForm.tableStandardValueList = arr;
      this.goodsForm.tableStandardList[this.dataIndex].standardValues = this.goodsForm.tableStandardValueList;
      this.dialogStandardValue = false;
      this.handleDate(this.goodsForm.tableStandardList);
      this.selectModalCopy.goodsStandardValueData = copy(this.goodsForm.goodsStandardValueData);
      // this.handleStandard(this.goodsForm.tableStandardList)
    },
    // 处理关键规格数据得到想要的格式，以便于对数据进行排列组合
    handleDate(tableList) {
      // 得到关键规格列表即表格表头
      this.goodsForm.standardKeyHeaderList = []; //清空关键规格头部
      for (let m in tableList) {
        if (tableList[m].pivotal) {
          this.goodsForm.standardKeyHeaderList.push(tableList[m]);
        }
      }
      //处理数据得到关键规格值列表
      this.goodsForm.standardKeyList = [];
      for (let i = 0; i < tableList.length; i++) {
        if (tableList[i].pivotal) {
          if (tableList[i].standardValues) {
            this.goodsForm.standardKeyList.push(tableList[i].standardValues);
          } else {
            this.goodsForm.standardKeyList.push([
              {
                valueName: '',
                valueId: ''
              }
            ]);
          }
        }
      }
      this.goodsForm.standardKeyList.push([
        {
          valueName: '',
          valueId: ''
        }
      ]);
      let keyList = copy(this.goodsForm.standardKeyList);
      this.goodsForm.combineKeyValueList = copy(this.combine(copy(this.goodsForm.standardKeyList)));
      for (let k in this.goodsForm.combineKeyValueList) {
        for (let m in this.goodsForm.combineKeyValueList[k]) {
          if (this.goodsForm.combineKeyValueList[k][m].valueName) {
            this.table1ShowStatus = true;
          }
        }
      }

      this.handleStandard(tableList, keyList);
    },
    // 处理规格数据
    handleStandard(standardList, list) {
      list.pop();
      // 得到非关键规格列表即表格表头
      this.goodsForm.standardUnkeyHeaderList = []; //清空关键规格头部
      for (let m in standardList) {
        if (!standardList[m].pivotal) {
          this.goodsForm.standardUnkeyHeaderList.push(standardList[m]);
        }
      }
      this.goodsForm.standardAllHeaderList = this.goodsForm.standardKeyHeaderList.concat(this.goodsForm.standardUnkeyHeaderList);
      //处理数据得到非关键规格值列表
      this.goodsForm.standardUnkeyList = [];
      var keyList = [];
      for (let i = 0; i < standardList.length; i++) {
        //非关键规格
        if (!standardList[i].pivotal) {
          if (standardList[i].standardValues) {
            this.goodsForm.standardUnkeyList.push(standardList[i].standardValues);
          } else {
            this.goodsForm.standardUnkeyList.push([
              {
                valueName: '',
                valueId: ''
              }
            ]);
          }
        } else {
          //关键规格

          if (standardList[i].standardValues) {
            keyList.push(standardList[i].standardValues);
          } else {
            keyList.push([
              {
                valueName: '',
                valueId: ''
              }
            ]);
          }
        }
      }

      this.goodsForm.standardUnkeyList.push([
        {
          valueName: '',
          valueId: ''
        }
      ]);
      this.goodsForm.standardUnkeyList.push([
        {
          valueName: '',
          valueId: ''
        }
      ]);
      this.goodsForm.standardUnkeyList.push([
        {
          valueName: '',
          valueId: ''
        }
      ]);
      this.goodsForm.standardUnkeyList.push([
        {
          valueName: '',
          valueId: ''
        }
      ]);
      this.goodsForm.combineAllList = list.concat(this.goodsForm.standardUnkeyList);

      this.goodsForm.combineKeyAllValueList = copy(this.combine(copy(this.goodsForm.combineAllList)));
      for (let k in this.goodsForm.combineKeyAllValueList) {
        for (let j in this.goodsForm.combineKeyAllValueList[k]) {
          if (this.goodsForm.combineKeyAllValueList[k][j].valueName) {
            this.table2ShowStatus = true;
          }
        }
      }
    },
    // 取消规格值弹框
    cancelSelectValueList() {
      this.goodsForm.goodsStandardValueData = copy(this.selectModalCopy.goodsStandardValueData);
      this.dialogStandardValue = false;
    },
    // 排列组合规格值
    combine(arr) {
      arr.reverse();
      var r = [];

      (function f(t, a, n) {
        if (n == 0) return r.push(t);
        for (let i = 0; i < a[n - 1].length; i++) {
          f(t.concat(a[n - 1][i]), a, n - 1);
        }
      })([], arr, arr.length);
      // var t = r;
      return r; //r是排列组合后的数据与
    },
    // 合并单元格
    //获取运费列表
    getTemplateList() {
      request.get('/api-mall/list-mall-goods-freight').then(res => {
        if (res.data.errorCode === 0) {
          this.goodsForm.templateList = res.data.result;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 处理sku信息得到要提交的数据格式
    handleStandSku() {
      let arrValue = copy(this.goodsForm.combineKeyAllValueList); //规格值信息
      // let objList;
      let outArr;
      let outArr1;
      let skuPrice = [];
      let skuSta = [];
      for (let i in arrValue) {
        //先获取sku价格条码这些
        outArr = copy(arrValue[i]); //得到固定的数据
        outArr1 = outArr.splice(outArr.length - 4, 4);

        for (let k in outArr) {
          delete outArr[k].remark;
          outArr[k].propName = this.goodsForm.standardAllHeaderList[k].standardName;
          outArr[k].propId = this.goodsForm.standardAllHeaderList[k].standardId;
        }
        this.goodsForm.skuJson = [];
        // this.goodsForm.skuJson.mallPropValues=outArr
        skuSta.push(outArr);
        skuPrice.push(outArr1);
      }
      for (let j in arrValue) {
        //数据的个数
        this.goodsForm.skuJson.push({
          mallProSkuPrice: skuPrice[j][0].valueName,
          stock: skuPrice[j][1].valueName,
          mallProSkuCode: skuPrice[j][2].valueName,
          mallProSkuBarCode: skuPrice[j][3].valueName,
          mallPropValues: skuSta[j]
        });
      }
    },
    // 批量填充
    batchSetSku() {
      for (let i in this.goodsForm.combineKeyAllValueList) {
        let length = this.goodsForm.combineKeyAllValueList[i].length;
        if (this.batchPrice) {
          this.goodsForm.combineKeyAllValueList[i][length - 4].valueName = this.batchPrice;
        }
        if (this.batchStock) {
          this.goodsForm.combineKeyAllValueList[i][length - 3].valueName = this.batchStock;
        }
        if (this.batchSku) {
          this.goodsForm.combineKeyAllValueList[i][length - 2].valueName = this.batchSku;
        }
        if (this.batchBar) {
          this.goodsForm.combineKeyAllValueList[i][length - 1].valueName = this.batchBar;
        }
      }
      this.addStock();
    },
    //计算库存
    sliceLimit(item1, item2, index) {
      if (item1.length - index === 2 || item1.length - index === 1) {
        this.$nextTick(() => {
          item2.valueName = getInputVal.getInputVal(item2.valueName, 16);
        });
      }

      this.addStock(item1, item2, index);
    },
    addStock(item1, item2, index) {
      let temSum = 0;

      for (let i in this.goodsForm.combineKeyAllValueList) {
        for (let j in this.goodsForm.combineKeyAllValueList[i]) {
          if (this.goodsForm.combineKeyAllValueList[i].length - j == 3) {
            if (this.goodsForm.combineKeyAllValueList[i][j].valueName !== '') temSum += Number(this.goodsForm.combineKeyAllValueList[i][j].valueName);
          }
        }
      }
      this.goodsForm.stock = temSum;
      // }
    },
    // sku检验以及截取
    skuInput(item1, item2, index1, index2) {
      if (item1.length - index2 === 4) {
        //价格
        if (!Number(item2.valueName)) {
          this.$message.error('请输入数字类型');
          item2.valueName = '';
        } else {
          item2.valueName = Number(item2.valueName).toFixed(2);
        }
      } else if (item1.length - index2 === 3) {
        //库存
        let reg = /^\+?[1-9][0-9]*$/;
        if (Number(item2.valueName) !== 0) {
          if (!Number(item2.valueName)) {
            this.$message.error('请输入数字类型');
            item2.valueName = '';
          } else if (!reg.test(Number(item2.valueName))) {
            this.$message.error('请输入整数');
            item2.valueName = '';
          } else {
            item2.valueName = String(item2.valueName).slice(0, 6);
            this.addStock();
          }
        }
      } else if (item1.length - index2 === 2) {
        item2.valueName = item2.valueName.slice(0, 32);
      } else if (item1.length - index2 === 1) {
        item2.valueName = item2.valueName.slice(0, 32);
      }
    },
    // 保存数据提交let
    submitGoodsForm(goodsForm) {
      this.goodsForm.putawayTime = this.getTime(this.goodsForm.putawayTime) + ' ' + this.getSeconds(this.goodsForm.putawayTime);
      this.goodsForm.imgTextEdit = this.$refs.tinymceWrap.tinymceHtml;
      if (this.goodsForm.categoryIds.length === 0) {
        //商品品类
        this.$message.error('请选择商品品类');
        return false;
      } else if (this.dialogImageUrl.length === 0) {
        this.$message.error('请选择商品主图');
        return false;
      } else if (this.goodsForm.imgTextEdit === '' || !this.goodsForm.imgTextEdit) {
        this.$message.error('请编辑图文详情');
        return false;
      } else if (this.goodsForm.tableStandardList.length === 0) {
        this.$message.error('请添加规格信息');
        return false;
      }
      this.$refs[goodsForm].validate(valid => {
        if (valid) {
          for (let item of this.goodsForm.combineKeyValueList) {
            if (!item[item.length - 1].valueName && item.length !== 1) {
              this.$message.error('请上传规格图片');
              return false;
            }
          }

          for (let item1 of this.goodsForm.combineKeyAllValueList) {
            if (!item1[item1.length - 2].valueName) {
              this.$message.error('请上传SKU编码');
              return false;
            }
            if (!item1[item1.length - 3].valueName && item1[item1.length - 3].valueName !== 0) {
              this.$message.error('请上传库存');
              return false;
            }
            if (!item1[item1.length - 4].valueName) {
              this.$message.error('请上传sku价格');
              return false;
            }
          }
          this.handleStandSku(); //处理sku信息得到要提交的数据格式

          // 处理sku图片数据
          this.goodsForm.skuImageJson = [];
          for (let i in this.goodsForm.combineKeyValueList) {
            let valueId = '';
            for (let j = 0; j < this.goodsForm.combineKeyValueList[i].length - 1; j++) {
              valueId = valueId + '_' + this.goodsForm.combineKeyValueList[i][j].valueId;
            }
            this.goodsForm.skuImageJson.push({
              valueId: valueId,
              imageUrl: copy(this.goodsForm.combineKeyValueList[i]).pop().valueName,
              imageFileCode: copy(this.goodsForm.combineKeyValueList[i]).pop().valueId
            });
          }
          // 过滤商品属性数据
          let filterProperty = [];
          for (let i in this.goodsForm.goodsPropertyData) {
            filterProperty.push({
              mallPropId: this.goodsForm.goodsPropertyData[i].propertyId
            });
            filterProperty[i].mallPropValues = [];
            if (
              this.goodsForm.goodsPropertyData[i].propertyType === 'TYP_TEXT' ||
              this.goodsForm.goodsPropertyData[i].propertyType === 'TYP_NUM' ||
              this.goodsForm.goodsPropertyData[i].propertyType === 'TYP_REAL_NUM' ||
              this.goodsForm.goodsPropertyData[i].propertyType === 'TYP_TIME' ||
              this.goodsForm.goodsPropertyData[i].propertyType === 'TYP_CURRENCY' ||
              this.goodsForm.goodsPropertyData[i].propertyType === 'TYP_PERCENT'
            ) {
              filterProperty[i].mallPropValues.push({
                valueName: this.goodsForm.goodsPropertyData[i].mallPropValues,
                valueId: ''
              });
            } else if (this.goodsForm.goodsPropertyData[i].propertyType === 'TYP_MULTI') {
              //多选
              for (let j in this.goodsForm.goodsPropertyData[i].mallPropValues) {
                filterProperty[i].mallPropValues.push({
                  valueName: '',
                  valueId: this.goodsForm.goodsPropertyData[i].mallPropValues[j]
                });
              }
            } else if (this.goodsForm.goodsPropertyData[i].propertyType === 'TYP_SINGLE') {
              //单选
              filterProperty[i].mallPropValues.push({
                valueName: this.goodsForm.goodsPropertyData[i].mallPropValues.valueName,
                valueId: this.goodsForm.goodsPropertyData[i].mallPropValues.valueId
              });
            } else {
              //其他

              for (let j1 in this.goodsForm.goodsPropertyData[i].mallPropValues) {
                filterProperty[i].mallPropValues.push({
                  valueName: this.goodsForm.goodsPropertyData[i].mallPropValues[j1].valueName,
                  valueId: this.goodsForm.goodsPropertyData[i].mallPropValues[j1].valueId
                });
              }
            }
          }
          let params = {
            mallCategoryIds: this.goodsForm.categoryIds.join(','), //商品品类
            mallProTagId: this.goodsForm.goodsClassifySelect.join(','), //商品分类
            proName: this.goodsForm.goodsName.trim(), //商品名称
            brandId: this.goodsForm.goodsBrandSelect, //商品品牌id
            mallProImageUrl: JSON.stringify(this.dialogImageUrl), //商品主图

            mallProStandardJson: JSON.stringify(this.goodsForm.tableStandardList), //商品规格数据
            skuImageJson: JSON.stringify(this.goodsForm.skuImageJson), //sku图片
            propJson: JSON.stringify(filterProperty), //商品属性
            skuJson: JSON.stringify(this.goodsForm.skuJson), //sku信息

            stock: this.goodsForm.stock, //spu库存
            mallProSpuPrice: this.goodsForm.mallProSpuPrice, //spu价格
            proCode: this.goodsForm.proCode, //spu商品code
            proCodeQuery: this.goodsForm.proCodeQuery, //spu商品二维码
            detailDescription: this.goodsForm.imgTextEdit,
            stockOptType: 1, //扣库存类型 1创建订单时扣 2付款时扣
            freightTemplateId: this.goodsForm.templateSelect, //运费模板ID
            upShelvesStatus: this.goodsForm.putaway, //上架方式
            upShelvesTime: this.goodsForm.putaway === '2' ? this.goodsForm.putawayTime : '', //上架时间
            status: this.goodsForm.putaway === '3' ? 1 : 2 //0删除 1仓库 2上架 3回收站
          };
          if (this.goodsForm.mallProId !== '-1') {
            params.mallProId = this.goodsForm.mallProId;
          }
          if ((this.goodsForm.stock === 0 && this.goodsForm.putaway == 1) || (this.goodsForm.stock === 0 && this.goodsForm.putaway == 2)) {
            this.$message.error('商品总库存为0的商品不可上架');
            return false;
          }
          if (this.goodsForm.putaway == '1') {
            this.activeName = 'first';
          } else {
            this.activeName = 'third';
          }
          this.submitLoading = true;
          request.post('/api-mall/save-gic-mall-goods', qs.stringify(params)).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('保存成功');
              this.$router.push({
                name: 'goodsList'
              });
              this.submitLoading = false;
              // this.$router.push({path: '/goodsList', query: {activeName: this.activeName}})
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
    //取消编辑
    cancelGoodsForm() {
      this.$router.go(-1);
      // this.$router.push({path: '/goodsList', query: {activeName: this.activeName}})
    },
    //
    hideDrag(id) {
      if (id === '-1') {
        this.$nextTick(() => {
          if (this.$refs.modal) {
            this.$refs.modal.showDrag = false;
          }
        });
      }
    }
  },
  components: {
    Treeselect,
    goodsCate,
    tinymceEdit,
    addProperty,
    addStandard,
    addStandardValue
  }
};
</script>
<style>
.vue-treeselect {
  display: inline-block;
  vertical-align: middle;
}
.goods-nature-item .el-form-item__label {
  line-height: 20px;
}
.tree-select .vue-treeselect__multi-value-item {
  line-height: 26px;
}
.tree-select .vue-treeselect--has-value .vue-treeselect__multi-value {
  margin-bottom: 0px;
}

.tree-select .vue-treeselect__multi-value-item-container {
  line-height: 26px;
}
.tree-goods-cate .vue-treeselect__placeholder {
  line-height: 40px;
}
.tree-goods-cate .vue-treeselect__multi-value-item-container {
  line-height: 24px;
}
.tree-goods-cate .vue-treeselect--has-value .vue-treeselect__multi-value {
  margin-bottom: 0px;
}
.tree-goods-cate .vue-treeselect__multi-value-item-container {
  padding-top: 5px;
}
/*表格中上传组件样式调整*/
.table-upload .avatar-uploader {
  height: 40px;
  /*padding:8px 0;*/
}
.table-upload .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 40px;
}

.table-upload .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.table-upload .avatar-uploader-icon {
  font-size: 24px;
  color: #8c939d;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.table-upload .avatar {
  width: 40px;
  height: 40px;
  display: block;
}
.w-260 {
  width: 260px !important;
}
.upload-list-box .el-upload--picture-card {
  width: 104px;
  height: 104px;
  line-height: 104px;
}
</style>
<style scoped>
.bread-container {
  background: #fff;
}
.mall-content-title h3 {
  padding: 24px 0 0 0;
}
.w-900 {
  width: 900px;
}
.mall-section {
  margin: 24px;
}
.form-group {
  background: #fff;
  /*padding:24px 32px;*/
  margin-bottom: 25px;
  padding-bottom: 24px;
}

.form-group .el-form-item {
  margin-left: 32px;
}
.form-group .title {
  height: 55px;
  line-height: 55px;
  border-bottom: 1px solid #e4e7ed;
  font-weight: 500;
  margin-bottom: 25px;
  padding-left: 32px;
  font-size: 16px;
}
.w-320 {
  width: 320px;
}
.goods-nature {
  width: 900px;
  padding-top: 20px;
  display: inline-block;
  vertical-align: top;
  background: #f5f7fa;
  box-sizing: border-box;
  border-radius: 2px;
}
.goods-nature-item {
  display: inline-block;
  vertical-align: top;
}

.goods-nature-item:nth-of-type(odd) {
  margin-right: 30px;
}

.w-220 {
  width: 220px;
}
.property-unit {
  width: 36px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border: 1px solid #dcdfe6;
  display: inline-block;
  box-sizing: border-box;
  margin-left: -4px;
  border-left: none;
  vertical-align: top;
}
.el-form-item__label {
  line-height: auto;
}
.upload-list-box {
  /*margin-top:22px;*/
}
/*规格表格*/
.form-group .border-table {
  margin-bottom: 15px;
  box-sizing: border-box;
}
.border-table {
  font-size: 14px;
  color: #606266;
  border: 1px #e4e7ed solid;
}
.border-table thead tr {
  background: #f1f3f7;
  text-align: left;
}
.border-table thead th {
  height: 44px;
  line-height: 44px;
  padding: 0 15px;
  border: 1px #e4e7ed solid;
}
.border-table tbody td {
  padding: 10px 15px;
  border: 1px #e4e7ed solid;
  vertical-align: middle;
}
.border-table-operate {
  margin-right: 20px;
}
.img-box {
  width: 104px;
  height: 104px;
  border-radius: 4px;
  display: inline-block;
  margin-right: 8px;
  position: relative;
}
.img-box img {
  border-radius: 4px;
}

.dialog-img {
  width: 104px;
  height: 104px;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  cursor: pointer;
  border-radius: 6px;
}
.img-box:hover .dialog-img {
  display: block;
}

.upload-list-box .el-icon-delete {
  position: absolute;
  left: 56px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  font-size: 20px;
  color: #fff;
  z-index: 2;
}
.el-icon-zoom-in {
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  font-size: 20px;
  color: #fff;
  z-index: 2;
}
.el-icon-arrow-left {
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  font-size: 20px;
  color: #fff;
  z-index: 2;
}
.el-icon-arrow-right {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  font-size: 20px;
  color: #fff;
  z-index: 2;
}
.img-box:hover i {
  display: block;
  cursor: pointer;
}
.img-box:first-child .el-icon-arrow-left {
  display: none;
}
.img-box:last-child .el-icon-arrow-right {
  display: none;
}
/*.img-box:hover img{
    opacity:0.6;
    cursor: pointer;
  }*/
.img-box img {
  width: 104px;
  height: 104px;
}
.sku-input {
  width: 120px;
  display: inline-block;
}
.sku-top {
  text-align: right;
  margin-bottom: 15px;
  font-size: 0;
}
.sku-top .sku-input {
  margin-right: 10px;
}
.confim-btn {
  height: 32px;
  padding: 12px 0;
  position: fixed;
  bottom: 0px;
  left: 200px;
  background: #fff;
  z-index: 2;
  text-align: center;
  border-top: 1px solid #dcdfe6;
}
.fix-btn {
  margin-left: -100px;
}
.goods-nature-item .el-icon-delete {
  cursor: pointer;
  font-size: 16px;
  visibility: hidden;
}

.goods-nature-item .el-icon-edit {
  cursor: pointer;
  font-size: 16px;
  visibility: hidden;
}
.goods-nature-item:hover .el-icon-delete {
  visibility: visible;
}
.goods-nature-item:hover .el-icon-edit {
  visibility: visible;
}
.add-property {
  margin: 0 0 22px 32px;
}
.goods-nature-item .common-property {
  visibility: hidden;
}
.goods-nature-item:hover .common-property {
  visibility: hidden;
}
</style>
