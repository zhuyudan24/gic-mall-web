<template>
  <div class="page-decoration-container">
    <span style="display:none">{{ refash }}</span>
    <!-- 双列商品 -->
    <el-form label-position="left" :model="doubleGoodsList" ref="doubleGoodsList" v-if="showEditStatus === 1">
      <div class="edit-double-goods">
        <h3>双列商品</h3>
        <el-form-item class="edit-item">
          <p class="title">标题</p>
          <el-input class="w-360" v-model="doubleGoodsList.pageModule.moduleName" @input="value => doubleNameLimit(value)">
            <span slot="suffix" style="margin-left:15px">{{ doubleNameLen }}/20</span>
          </el-input>
        </el-form-item>
        <el-form-item class="edit-item">
          <p class="title">更多链接</p>
          <div class="link-content">
            <p class="link-box">
              <span class="link-text">{{ doubleGoodsList.pageModule.moreButtonUrl.displayName }}</span>
              <el-button type="primary" icon="iconfont icon-lianjie" @click="moreLink1" style="border-radius:0px;"></el-button>
            </p>
          </div>
        </el-form-item>
        <el-form-item class="edit-item">
          <p class="title">商品数量</p>
          <el-select placeholder="2" class="w-360" v-model="doubleGoodsList.pageModule.proNumber">
            <el-option label="2" :value="2"></el-option>
            <el-option label="4" :value="4"></el-option>
            <el-option label="6" :value="6"></el-option>
            <el-option label="8" :value="8"></el-option>
            <el-option label="10" :value="10"></el-option>
            <el-option label="12" :value="12"></el-option>
            <el-option label="14" :value="14"></el-option>
            <el-option label="16" :value="16"></el-option>
            <el-option label="18" :value="18"></el-option>
            <el-option label="20" :value="20"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐类型" label-width="100px" class="edit-item">
          <el-radio v-model="doubleGoodsList.pageModule.choseType" :label="1">自动推荐</el-radio>
          <el-radio v-model="doubleGoodsList.pageModule.choseType" :label="2">手动推荐</el-radio>
        </el-form-item>
        <div v-show="doubleGoodsList.pageModule.choseType == 1" class="edit-item">
          <el-form-item>
            <p class="title">排序规则</p>
            <el-select placeholder="销量从高到低" class="w-360" v-model="doubleGoodsList.pageModule.sortCol">
              <el-option label="销量从高到低" value="1001"></el-option>
              <el-option label="上架时间从近到远" value="1002"></el-option>
              <el-option label="价格从低到高" value="1003"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <p class="title">商品品类</p>
            <el-button class="w-355" v-if="doubleGoodsList.pageModule.mallCategoryId !== ''" @click="selectCate">{{ mallCategoryName }}</el-button>
            <el-button class="w-355" v-else @click="selectCate">选择商品品类</el-button>
          </el-form-item>
          <el-form-item>
            <p class="title">商品分类</p>
            <treeselect v-model="doubleGoodsList.pageModule.mallProTagId" :multiple="false" :options="mallProTag" placeholder="所有分类" class="w-355" />
          </el-form-item>
          <el-form-item>
            <p class="title">价格范围</p>
            <el-col :span="11">
              <el-form-item prop="pageModule.priceRange.begin" :rules="[{ type: 'number', validator: beginValidator, trigger: 'blur' }]">
                <el-input v-model="doubleGoodsList.pageModule.priceRange.begin" type="text" style="width:170px;"> </el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="pageModule.priceRange.end" :rules="[{ type: 'number', validator: endValidator, trigger: 'blur' }]">
                <el-input v-model="doubleGoodsList.pageModule.priceRange.end" type="text" style="width:170px;"> </el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <p class="title">关键词(多个关键词用"#"分隔)</p>
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="doubleGoodsList.pageModule.proKeyword"> </el-input>
          </el-form-item>
        </div>
        <div v-show="doubleGoodsList.pageModule.choseType == 2" class="edit-item">
          <!-- v-show="handleGoodsStatus&&doubleGoodsList.pageModule.choseType==2" -->
          <div v-show="handleGoodsStatus && doubleGoodsList.pageModule.choseType == 2" v-for="(item, index) in doubleGoodsList.pageModule.productList" :key="index" class="img-text">
            <img :src="item.mallProImageUrl" />
            <div class="text">
              <p class="pro-name">{{ item.proName }}</p>
              <p class="pro-code">货号:{{ item.proCode }}</p>
              <p class="pro-price">￥{{ item.mallProSpuPrice }}</p>
            </div>
          </div>
          <el-form-item>
            <div class="add-img" @click="selectGoods">
              <i class="el-icon-plus"></i>
              <span>添加商品</span>
              <span class="add-num">{{ doubleGoodsList.pageModule.productList.length }}/{{ doubleGoodsList.pageModule.proNumber }}</span>
            </div>
          </el-form-item>
        </div>
        <div class="height60"></div>
        <div style="text-align: center;margin-top:30px;" class="bottom-btn">
          <span @click="saveDoubleGoods">保存</span>
          <span @click="cancelSaveDoubleGoods">重置</span>
        </div>
      </div>
    </el-form>
    <!-- 轮播图 -->
    <el-form label-position="left" v-if="showEditStatus === 2">
      <div class="edit-img-content">
        <h3>轮播图片</h3>
        <div class="edit-img-list edit-item">
          <div class="edit-img-item" v-for="(item, index) in swiperImg.pageModule.picInfo" :key="index">
            <div class="edit-img-title">
              <span>图片</span>
              <div class="img-move">
                <p class="move-box" @click="moveDown(index)" v-show="index !== 0"><i class="el-icon-arrow-up"></i></p>
                <p class="move-box" @click="moveUp(index)" v-show="index !== swiperImg.pageModule.picInfo.length - 1"><i class="el-icon-arrow-down"></i></p>
                <p class="move-box delete-move" v-show="index !== 0" @click="deleteImg(index)"><i class="el-icon-close"></i></p>
              </div>
            </div>
            <el-upload class="avatar-uploader" :show-file-list="false" style="width:270px;margin:15px auto;" :action="action" with-credentials :on-success="(response, file, fileList) => swiperUploadSuccess(response, file, fileList, index)" :before-upload="swiperUploadBefore">
              <img v-if="item.picURL" :src="item.picURL" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="img-warm">图片宽度大于等于750px，高度在100x~1500px之间，格式为：jpg、png，要求一组的图片高度必须完全一致</p>
            <!-- <p class="img-warm">图片宽高比例为2：1，格式为：jpg、png、gif，要求一组的图片高度必须完全一致</p> -->

            <div class="link-content">
              <p class="link-box">
                <span class="link-text">{{ swiperImg.pageModule.picInfo[index].hrefURL.displayName }}</span>
                <el-button type="primary" icon="iconfont icon-lianjie" style="border-radius:0px;" @click="moreLink2(index)"></el-button>
                }
              </p>
            </div>
          </div>
          <div class="add-img" @click="addSwiper">
            <i class="el-icon-plus"></i>
            <span>添加图片</span>
            <span class="add-num">{{ swiperImg.pageModule.picInfo.length }}/10</span>
          </div>
        </div>
        <div class="height60"></div>
        <div style="text-align: center;margin-top:30px;" class="bottom-btn">
          <span @click="saveSwiperImg('swiperImg')">保存</span>
          <span @click="cancelSaveSwiperImg">重置</span>
        </div>
      </div>
    </el-form>
    <!-- 单列图片 -->
    <el-form label-position="left" v-if="showEditStatus === 3">
      <div class="edit-img-content">
        <h3>单列图片</h3>
        <div class="edit-img-list edit-item">
          <div class="edit-img-item" v-for="(item, index) in singleImg.pageModule.picInfo" :key="index">
            <div class="edit-img-title">
              <span>图片</span>
            </div>
            <el-upload class="avatar-uploader" :show-file-list="false" style="width:270px;margin:15px auto;" :action="action" with-credentials :on-success="(response, file, fileList) => singleUploadSuccess(response, file, fileList, index)" :before-upload="singleloadBefore">
              <img v-if="item.picURL" :src="item.picURL" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="img-warm">图片宽度大于等于750px，高度在100x~1500px之间，格式为：jpg、png</p>
            <div class="link-content">
              <p class="link-box">
                <span class="link-text">{{ singleImg.pageModule.picInfo[index].hrefURL.displayName }}</span>
                <el-button type="primary" icon="iconfont icon-lianjie" style="border-radius:0px;" @click="moreLink3"></el-button>
              </p>
            </div>
          </div>
        </div>
        <div style="text-align: center;margin-top:30px;" class="bottom-btn">
          <span @click="saveSingalImg">保存</span>
          <span @click="cancelSaveSingalImg">重置</span>
        </div>
      </div>
    </el-form>
    <!-- 双列图片 -->
    <el-form v-if="showEditStatus === 4">
      <div class="edit-img-content">
        <h3>双列图片</h3>
        <div class="edit-img-list edit-item">
          <div class="edit-img-item" v-for="(item, index) in doubleImg.pageModule.picInfo" :key="index">
            <div class="edit-img-title">
              <span v-if="index === 0">第一张图片</span>
              <span v-else>第二张图片</span>
            </div>
            <el-upload class="avatar-uploader" style="width:270px;margin:15px auto;" :action="action" :show-file-list="false" with-credentials :on-success="(response, file, fileList) => doubleUploadSuccess(response, file, fileList, index)" :before-upload="doubleloadBefore">
              <img v-if="item.picURL" :src="item.picURL" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="img-warm">图片宽度大于等于350px，高度在100x~1000px之间，格式为：jpg、png，要求一组内的图片高度必须完全一致</p>
            <div class="link-content">
              <p class="link-box">
                <span class="link-text">{{ doubleImg.pageModule.picInfo[index].hrefURL.displayName }}</span>
                <el-button type="primary" icon="iconfont icon-lianjie" style="border-radius:0px;" @click="moreLink4(index)"></el-button>
              </p>
            </div>
          </div>
        </div>
        <div class="height60"></div>
        <div style="text-align: center;margin-top:30px;" class="bottom-btn">
          <span @click="saveDoubleImg">保存</span>
          <span @click="cancelSaveDoubleImg">重置</span>
        </div>
      </div>
    </el-form>

    <!-- 文本标题 -->
    <el-form v-if="showEditStatus === 5" :model="textTitle" ref="textTitle" :rules="textTitleRules">
      <div class="edit-text">
        <h3>文本标题</h3>
        <el-form-item prop="pageModule.titleText" :class="textTitleError === '0' ? 'is-error' : ''">
          <!-- :rules="[
                  { required: true, message: '请输入文本标题', trigger: 'blur' },,
                ]" -->
          <p class="title">标题</p>
          <el-input class="w-360" v-model="textTitle.pageModule.titleText" @input="value => textTitleLimit(value)" @blur="textTitleBlur">
            <span slot="suffix" style="margin-left:15px">{{ textTitleLen }}/20</span>
          </el-input>
          <span style="position:absolute;margin-top:5px;font-size: 12px;color:#f5222d;line-height:1.2;display:block;" v-show="textTitleError === '0'">请输入文本标题</span>
        </el-form-item>
        <el-form-item>
          <p class="title">链接</p>
          <div class="link-content">
            <p class="link-box">
              <span class="link-text">{{ textTitle.pageModule.hrefUrl.displayName }}</span>
              <el-button type="primary" icon="iconfont icon-lianjie" style="border-radius:0px;" @click="moreLink5"></el-button>
            </p>
          </div>
        </el-form-item>
      </div>
      <div style="text-align: center;margin-top:30px;" class="bottom-btn">
        <span @click="saveTextTitle">保存</span>
        <span @click="cancelSaveTextTitle">重置</span>
      </div>
    </el-form>
    <!-- 辅助线 -->
    <div class="edit-line" v-if="showEditStatus === 6">
      <h3>辅助线</h3>
      <div>该模块不可编辑</div>
    </div>
    <!-- 辅助空白 -->
    <el-form v-if="showEditStatus === 7" :model="assistBlank" :rules="blankRules">
      <div class="edit-blank">
        <h3>辅助空白</h3>
        <el-form-item class="edit-item" prop="setting.height">
          <p class="title">高度</p>
          <el-input-number class="w-320" v-model="assistBlank.setting.height" :min="1" :max="30" @blur="blankBlur"></el-input-number>
          <p style="color:#909399;">区间范围在10~30px</p>
        </el-form-item>
      </div>
      <div style="text-align: center;margin-top:30px;" class="bottom-btn">
        <span @click="saveBlank">保存</span>
        <span @click="cancelBlank">重置</span>
      </div>
    </el-form>
    <!-- 魔方  -->
    <el-form :model="cubeForm" v-if="showEditStatus === 8">
      <div class="edit-cube">
        <h3>魔方</h3>
        <el-form-item class="edit-item">
          <p class="title">魔方列数</p>
          <el-select v-model="cubeForm.setting.column" placeholder="请选择列数" class="w-330" @change="changeColumn">
            <el-option label="3" :value="3"></el-option>
            <el-option label="4" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="edit-item">
          <p class="title">魔方行数</p>
          <el-select v-model="cubeForm.setting.row" placeholder="请选择行数" class="w-330" @change="changeRow">
            <el-option label="1" :value="1"></el-option>
            <el-option label="2" :value="2"></el-option>
            <el-option label="3" :value="3"></el-option>
            <el-option label="4" :value="4"></el-option>
            <el-option label="5" :value="5"></el-option>
            <el-option label="6" :value="6"></el-option>
            <el-option label="7" :value="7"></el-option>
            <el-option label="8" :value="8"></el-option>
            <el-option label="9" :value="9"></el-option>
            <el-option label="10" :value="10"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="edit-item">
          <p class="title">布局</p>
          <!-- column列
            row行
            boxMsg 回显的数据，
            格式要是boxMsg=[{
            left:0,
            top:0,
            endLeft:2,
            endTop:2,
            picURL:picURL,
            hrefURL:hrefURL
            }]
            getBoxArr(item,index)获取事件:获取编辑好的区域针对点击哪一个区域好设置页面链接
            removeBoxArr(index)：删除的index
            getSelectAll（index）删除事件 bol为true是全部填充-->

          <cubeBox :column="cubeForm.setting.column" :row="cubeForm.setting.row" :boxMsg="boxMsg" :isNew="isNew" @getBoxIndex="getBoxIndex" @getBoxArr="getBoxArr" @removeBoxArr="removeBoxArr" @getSelectAll="getSelectAll"> </cubeBox>
        </el-form-item>
        <div class="edit-img-list edit-item">
          <div class="edit-img-item">
            <p class="img-warm" style="margin:0px">选定布局区域大小，在下方添加图片</p>
            <p class="img-warm" style="margin-top:0px">请按照建议尺寸或同比例尺寸上传图片，否则图片会被剪裁</p>
            <div class="link-content">
              <p class="link-box">
                <span class="link-text" v-if="cubeLink.length !== 0 && cubeLink[cubeLinkIndex]">{{ cubeLink[cubeLinkIndex].displayName }}</span>
                <span class="link-text" v-else></span>
                <el-button type="primary" icon="iconfont icon-lianjie" style="border-radius:0px;" @click="moreLink6"></el-button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style="text-align: center;margin-top:30px;" class="bottom-btn">
        <span @click="saveCube">保存</span>
        <span @click="cancelCube">重置</span>
      </div>
    </el-form>
    <!-- 商品品类 -->
    <cateModal v-if="showEditStatus === 1" @getCateMess="getCateMess" :cateModal="cateModal" @cancelCateModal="cancelCateModal"> </cateModal>
    <!-- 选商品 -->
    <selecGoods v-if="showEditStatus === 1" :selectGoodsModal="selectGoodsModal" @cancelSelectGoodsModal="cancelSelectGoodsModal" @getSelectGoods="getSelectGoods" ref="selectchild" :goodsNum="doubleGoodsList.pageModule.proNumber"> </selecGoods>
    <!-- 链接小工具 -->
    <linkModal :linkModal="linkModal" @cancelLinkModal="cancelLinkModal" @getLinkMess="getLinkMess"> </linkModal>
  </div>
</template>

<script>
import getInputVal from '../../../../static/js/common.js';
import request from '../../../api/request.js';
import copy from '../../../../static/js/clone.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import selecGoods from './selectGoodsModal.vue';
import linkModal from './linkModal.vue';
import cateModal from './cateModal.vue';
import cubeBox from './magicCube.vue';

export default {
  name: 'rightEdit',
  props: {
    showEditStatus: {
      type: Number
    },
    obj: {
      type: Object
    },
    changeStatus: {
      type: Boolean
    }
  },
  data() {
    let beginValidator = (rule, value, callback) => {
      // var reg = /^[0-9]*$/;
      if (!Number(value)) {
        callback(new Error('请输入数字'));
      } else if (this.doubleGoodsList.pageModule.priceRange.end !== '') {
        if (Number(value) > Number(this.doubleGoodsList.pageModule.priceRange.end)) {
          callback(new Error('最低价格不能高于最高价格'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let endValidator = (rule, value, callback) => {
      // var reg = /^[0-9]*$/;
      if (!Number(value)) {
        callback(new Error('请输入数字'));
      } else if (this.doubleGoodsList.pageModule.priceRange.begin !== '') {
        if (Number(value) < Number(this.doubleGoodsList.pageModule.priceRange.begin)) {
          callback(new Error('最高价格不能低于最价格'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      mallHeight: document.documentElement.clientHeight - 65,
      imageUrl: '',
      // 单列图片
      singleImg: {
        moduleType: 3,
        pageModule: {
          picInfo: [
            {
              picURL: '', //图片地址
              hrefURL: {
                type: 1,
                displayName: '', //图片链接的名字
                mallProId: ''
              }
            }
          ]
        }
      },
      singleImgRules: {}, //单列图片校验
      singleParams: {}, //单列图片上传图片的尺寸
      // 双列图片
      doubleImg: {
        moduleType: 4,
        pageModule: {
          picInfo: [
            {
              picURL: '', //图片地址
              hrefURL: {
                type: '',
                displayName: '', //图片链接的名字
                mallProId: ''
              }
            },
            {
              picURL: '', //图片地址
              hrefURL: {
                type: '',
                displayName: '', //图片链接的名字
                mallProId: ''
              }
            }
          ]
        }
      },
      doubleImgHeight: '',
      doubleIndex: -1,
      doubleParams: {}, //双列商品的图片尺寸
      //文本标题
      textTitle: {
        moduleType: 5, //文本，
        pageModule: {
          titleText: '', //文本类型标题
          hrefUrl: {
            //链接信息
            type: 1,
            displayName: '',
            mallProId: ''
          }
        }
      },
      textTitleLen: 0, //文本标题字数限制
      textTitleRules: {
        // titleText:[
        //   { required: true, message: '请输入文本标题', trigger: 'blur' },
        // ]
      }, //文本标题校验
      textTitleError: '1',
      swiperPicInfo: [
        {
          picURL: '' //图片地址
        }
      ],
      swiperImgHeight: '',
      swiperIndex: 1,
      // 双列商品的编辑
      doubleGoodsList: {
        moduleType: 1,
        moduleName: '', //标题名称
        pageModule: {
          moduleName: '',
          moreButtonUrl: {
            type: 0,
            displayName: '',
            mallProId: ''
          },
          choseType: 1,
          proNumber: 2,
          sortCol: '1001',
          mallCategoryId: '',
          mallProTagId: null,
          priceRange: { begin: '', end: '' },
          proKeyword: '',
          productList: [
            {
              mallProId: '',
              mallProImageUrl: '',
              proName: '',
              mallProSpuPrice: ''
            },
            {
              mallProId: '',
              mallProImageUrl: '',
              proName: '',
              mallProSpuPrice: ''
            }
          ]
        }
      },
      handleGoodsStatus: false,
      mallCategoryName: '', //商品品类名称
      productSelectList: [], //手动
      doubleNameLen: 0,
      selectGoodsModal: false, //商品弹框
      // 双列商品校验
      beginValidator,
      endValidator,
      mallProTag: [], //商品分类
      // 轮播图片
      swiperImg: {
        moduleType: 2,
        pageModule: {
          moduleType: 2,
          picInfo: [
            {
              picURL: '',
              hrefURL: {
                type: '',
                displayName: '',
                mallProId: ''
              }
            }
          ]
        }
      },
      swiperLinkIndex: -1,
      swiperImgRules: {}, //轮播图片的校验
      swiperParams: {}, //存放上传图片的尺寸
      cateModal: false, //商品品类弹框
      linkModal: false, //链接小工具
      action: window.location.origin + '/api-plug/upload-img?requestProject=mall',
      // action:'http://gicdev.demogic.com/api-plug/upload-img?requestProject=mall',

      // 辅助空白
      assistBlank: {
        moduleType: 7, //辅助空白，
        setting: {
          height: 20 //高度
        },
        pageModule: {}
      },
      blankRules: {},
      // 魔方
      cubeForm: {
        moduleType: 8,
        setting: {
          row: 3,
          column: 3
        },
        pageModule: {
          picInfo: [
            {
              picURL: '',
              hrefURL: {
                type: 1,
                displayName: '', //图片链接的名字
                mallProId: ''
              },
              zb: '' //坐标
            }
          ]
        }
      },
      selectCubeIndex: 0,
      cubeLinkIndex: 0,
      cubeLink: [], //魔方链接
      boxPosition: [],
      refash: false,
      selectAll: true, //是否选中全部
      boxMsg: [],
      isNew: false
    };
  },
  watch: {
    changeStatus() {
      // this.getChangePutStatus(false)
      this.textTitleError = '1';
      if (this.showEditStatus === 1) {
        //双列商品
        this.getGoodsCate(); //商品分类
        this.doubleGoodsList = copy(this.obj);

        if (this.doubleGoodsList.pageModule.choseType === 2) {
          this.handleGoodsStatus = true;
          this.productSelectList = this.doubleGoodsList.pageModule.productList;
        }
        this.doubleNameLen = getInputVal.getZhLen(this.doubleGoodsList.pageModule.moduleName);
      } else if (this.showEditStatus === 2) {
        //轮播图
        this.swiperImgHeight = '';
        this.swiperImg = copy(this.obj);
      } else if (this.showEditStatus === 3) {
        //单列图片
        this.singleImg = copy(this.obj);
      } else if (this.showEditStatus === 4) {
        //双列图片
        this.doubleImgHeight = '';
        this.doubleImg = copy(this.obj);
      } else if (this.showEditStatus === 5) {
        //文本标题
        this.textTitle = copy(this.obj);
        this.textTitleLen = getInputVal.getZhLen(this.textTitle.pageModule.titleText);
      } else if (this.showEditStatus === 7) {
        //辅助空白
        this.assistBlank = copy(this.obj);
      } else if (this.showEditStatus === 8) {
        //魔方
        this.cubeLinkIndex = 0;
        this.cubeForm = copy(this.obj);
        this.cubeFormCopy = copy(this.obj);

        if (this.cubeForm.pageModule.picInfo[0].picURL !== '') {
          //编辑
          this.isNew = false;
          this.boxMsg = this.cubeForm.pageModule.picInfo.map(item => {
            let b = item.zb.split(',');

            let arr = [];
            for (let item1 of b) {
              arr = [...arr, ...item1.split('.')];
            }
            return {
              left: Number(arr[0]),
              top: Number(arr[1]),
              endLeft: Number(arr[2]),
              endTop: Number(arr[3]),
              picURL: item.picURL,
              hrefURL: item.hrefURL
            };
          });
          this.cubeLink = this.cubeForm.pageModule.picInfo.map(item => {
            return {
              hrefURL: item.hrefURL
            };
          });
        } else {
          //新增
          this.boxMsg = [];
          this.isNew = true;
        }
      }
    }
  },
  created() {
    let a = '0.8,2.10';
    let b = a.split(',');
    let arr = [];
    for (let item of b) {
      arr = [...arr, ...item.split('.')];
    }
  },

  computed: {},
  methods: {
    getGoodsCate() {
      request.get('/api-mall/list_mall_goods_tag_tree').then(res => {
        this.mallProTag = [];
        if (res.data.errorCode === 0) {
          this.mallProTag.push({
            childTagList: res.data.result.childTagList,
            mallProTagId: res.data.result.mallProTagId,
            tagName: res.data.result.tagName
          });
          this.getTree(this.mallProTag);
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
    // 双列商品字数限制
    doubleNameLimit(value) {
      this.$nextTick(() => {
        this.doubleGoodsList.pageModule.moduleName = getInputVal.getInputVal(value, 20);
        this.doubleNameLen = getInputVal.getZhLen(this.doubleGoodsList.pageModule.moduleName);
      });
    },
    // 预览双列图片
    saveDoubleGoods(doubleGoodsList) {
      if (this.doubleGoodsList.pageModule.choseType == 1) {
        //自动推荐
        this.handleGoodsStatus = false;
        this.doubleGoodsList.pageModule.productList = [];
        let params = {
          mallCategoryId: this.doubleGoodsList.pageModule.mallCategoryId,
          mallProTagId: this.doubleGoodsList.pageModule.mallProTagId,
          begin: this.doubleGoodsList.pageModule.priceRange.begin,
          end: this.doubleGoodsList.pageModule.priceRange.end,
          searchName: this.doubleGoodsList.pageModule.proKeyword,
          sort: this.doubleGoodsList.pageModule.sortCol,
          size: this.doubleGoodsList.pageModule.proNumber
        };
        request.get('/api-mall/list_or_save_goods_for_mallpage', { params }).then(res => {
          if (res.data.errorCode === 0) {
            if (!res.data.result.list.length) {
              this.$message.error('暂无推荐的商品');
              return false;
            } else {
              for (let i in res.data.result.list) {
                this.doubleGoodsList.pageModule.productList.push({
                  proName: res.data.result.list[i].proName,
                  mallProSpuPrice: res.data.result.list[i].mallProSpuPrice,
                  mallProImageUrl: res.data.result.list[i].mallProImageUrl,
                  mallProId: res.data.result.list[i].mallProId
                });
              }
            }
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        //手动推荐

        this.doubleGoodsList.pageModule.productList = [];
        for (let i in this.productSelectList) {
          this.doubleGoodsList.pageModule.productList.push({
            proName: this.productSelectList[i].proName,
            mallProSpuPrice: this.productSelectList[i].mallProSpuPrice,
            mallProImageUrl: this.productSelectList[i].mallProImageUrl,
            mallProId: this.productSelectList[i].mallProId,
            proCode: this.productSelectList[i].proCode
          });
        }
        this.handleGoodsStatus = true;
      }
      if (this.doubleGoodsList.pageModule.moreButtonUrl.mallProId === '') {
        this.doubleGoodsList.pageModule.moreButtonUrl = {};
      }

      this.$emit('getEditMess', this.doubleGoodsList);
      this.$refs.selectchild.handleDate();
    },
    // 重置
    cancelSaveDoubleGoods() {
      this.doubleGoodsList.pageModule.moduleName = '';
      this.doubleGoodsList.pageModule.moreButtonUrl.type = '';
      this.doubleGoodsList.pageModule.moreButtonUrl.displayName = '';
      this.doubleGoodsList.pageModule.moreButtonUrl.displayName = '';
      this.doubleGoodsList.pageModule.choseType = 1;
      this.doubleGoodsList.pageModule.proNumber = 2;
      this.doubleGoodsList.pageModule.sortCol = '1001';
      this.doubleGoodsList.pageModule.mallCategoryId = '';
      this.doubleGoodsList.pageModule.mallProTagId = null;
      this.doubleGoodsList.pageModule.priceRange.begin = '';
      this.doubleGoodsList.pageModule.priceRange.end = '';
      this.doubleGoodsList.pageModule.proKeyword = '';
      this.doubleGoodsList.pageModule.productList = [];
      this.$emit('getEditMess', this.doubleGoodsList);
    },
    //获取商品品类
    getCateMess(item) {
      this.mallCategoryName = item.categoryName;
      this.doubleGoodsList.pageModule.mallCategoryId = item.categoryId;
    },

    // 弹出弹框
    selectCate() {
      this.cateModal = true;
    },
    cancelCateModal() {
      this.cateModal = false;
    },
    // 选择商品
    selectGoods() {
      this.selectGoodsModal = true;
    },
    // 取消
    cancelSelectGoodsModal() {
      this.selectGoodsModal = false;
    },
    // 链接小工具
    moreLink1() {
      this.linkModal = true;
    },
    // 取消链接小工具
    cancelLinkModal() {
      this.linkModal = false;
    },
    // 获得选中的链接
    getLinkMess(value) {
      if (this.showEditStatus === 1) {
        //双列商品
        this.doubleGoodsList.pageModule.moreButtonUrl = value;
      }
      if (this.showEditStatus === 2) {
        //轮播图片
        if (this.swiperLinkIndex === -1) {
          return false;
        } else {
          this.swiperImg.pageModule.picInfo[this.swiperLinkIndex].hrefURL = value;
          this.swiperImg.pageModule.picInfo = copy(this.swiperImg.pageModule.picInfo);
        }
      }
      if (this.showEditStatus === 3) {
        //单列图片
        this.singleImg.pageModule.picInfo[0].hrefURL = value;
      }
      if (this.showEditStatus === 4) {
        if (this.doubleIndex === -1) {
          return false;
        } else {
          this.doubleImg.pageModule.picInfo[this.doubleIndex].hrefURL = value;
          this.doubleImg.pageModule.picInfo = copy(this.doubleImg.pageModule.picInfo);
        }
      }
      if (this.showEditStatus === 5) {
        //双列图片
        this.textTitle.pageModule.hrefUrl = value;
      }
      if (this.showEditStatus === 8) {
        //魔方
        if (this.selectCubeIndex === -1) {
          return false;
        } else {
          this.cubeForm.pageModule.picInfo[this.selectCubeIndex].hrefURL = value;
          this.cubeForm.pageModule.picInfo = copy(this.cubeForm.pageModule.picInfo);
          this.cubeLink[this.cubeLinkIndex] = value;
          this.cubeLink = copy(this.cubeLink);
        }
      }
    },
    // 得到选中的商品
    getSelectGoods(item) {
      this.productSelectList = item;
    },
    // 添加轮播图片
    addSwiper() {
      if (this.swiperImg.pageModule.picInfo.length >= 10) {
        this.$message.error('最多添加10张图片');
        return false;
      }
      this.swiperImg.pageModule.picInfo.push({
        picURL: '',
        hrefURL: {}
      });
    },
    // 上传图片之前
    swiperUploadBefore(file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif') {
        this.$message.error('请上传jpg，png格式的图片');
        this.swiperImgHeight = '';
        return false;
      }
      if (file.size > 3 * 1024 * 1024) {
        this.$message.error('图片大小请控制在3M内');
        return false;
      }
      var that = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.onload = function(event) {
          let image = new Image();
          image.onload = function() {
            let width = this.width;
            let height = this.height;
            that.swiperParams = {
              width,
              height
            };

            if (that.swiperImg.pageModule.picInfo[0].picURL === '' && that.swiperImgHeight === '') {
              that.swiperImgHeight = height;
            }
            if (that.swiperImg.pageModule.picInfo[0].picURL) {
              that.swiperImgHeight = that.imgHeight(that.swiperImg.pageModule.picInfo[0].picURL);
            }

            if (that.swiperImg.pageModule.picInfo.length === 1) {
              //仅有一张图片的时候图片的高度的统一高度限制去掉
              that.swiperImgHeight = '';
            }
            if (width < 750 || height < 100 || height > 1500) {
              that.$message.error('请上传正确的图片尺寸');
              that.swiperImgHeight = '';
              reject();
            }

            if (that.swiperImgHeight !== '' && height !== that.swiperImgHeight) {
              that.$message.error('请上传相同高度的图片');
              reject();
            }

            resolve();
          };
          image.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    },
    // 轮播图片
    swiperUploadSuccess(response, file, fileList, index) {
      if (response.errorCode === 0) {
        this.swiperImg.pageModule.picInfo[index].picURL = response.result[0].qcloudImageUrl;
        // setTimeout(()=>{
        this.swiperImg.pageModule.picInfo[index].width = this.swiperParams.width;
        this.swiperImg.pageModule.picInfo[index].height = this.swiperParams.height;

        // },1000)
        this.swiperImg.pageModule.picInfo[index].hrefURL = {};
        this.$message.success('上传成功');
        this.getChangePutStatus(false);
      } else {
        this.$message.error(response.message);
      }
    },
    // 删除轮播图片
    deleteImg(index) {
      if (this.swiperImg.pageModule.picInfo.length == 1) {
        this.$message.error('不能再减少了');
        return false;
      }
      this.swiperImg.pageModule.picInfo.splice(index, 1);
    },
    // 下移图片
    moveUp(index) {
      this.moveItem(this.swiperImg.pageModule.picInfo, index, index + 1);
    },
    // 上移图片
    moveDown(index) {
      this.moveItem(this.swiperImg.pageModule.picInfo, index, index - 1);
    },
    // 数组移动的函数
    moveItem(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    //链接小工具
    moreLink2(index) {
      this.linkModal = true;
      this.swiperLinkIndex = index;
    },
    // 轮播图的预览保存
    saveSwiperImg(swiperImg) {
      if (
        this.swiperImg.pageModule.picInfo.every(item => {
          item.picURL === '';
        })
      ) {
        this.$message.error('请上传图片');
        return false;
      } else {
        this.$emit('getEditMess', this.swiperImg);
        this.getChangePutStatus(true);
      }
    },
    //取消
    cancelSaveSwiperImg() {
      for (let i in this.swiperImg.pageModule.picInfo) {
        this.swiperImg.pageModule.picInfo[i].picURL = '';
        this.swiperImg.pageModule.picInfo[i].hrefURL = {};
      }
    },
    // 单列图片
    singleUploadSuccess(response, file, fileList, index) {
      if (response.errorCode === 0) {
        this.singleImg.pageModule.picInfo[index].picURL = response.result[0].qcloudImageUrl;
        this.singleImg.pageModule.picInfo[index].width = this.singleParams.width;
        this.singleImg.pageModule.picInfo[index].height = this.singleParams.height;

        this.$message.success('上传成功');
        this.getChangePutStatus(false);
      } else {
        this.$message.error(response.message);
      }
    },
    singleloadBefore(file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif') {
        this.$message.error('请上传jpg，png格式的图片');
        return false;
      }
      if (file.size > 3 * 1024 * 1024) {
        this.$message.error('图片大小请控制在3M内');
        return false;
      }
      var that = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.onload = function(event) {
          let image = new Image();
          image.onload = function() {
            let width = this.width;
            let height = this.height;
            that.singleParams = {
              width,
              height
            };
            if (width < 750 || height < 100 || height > 1500) {
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
    // 单列图片链接
    moreLink3() {
      this.linkModal = true;
    },
    // 单列图片预览
    saveSingalImg() {
      if (this.singleImg.pageModule.picInfo[0].picURL !== '') {
        //可以预览
        if (this.singleImg.pageModule.picInfo[0].hrefURL.pageId === '') {
          this.singleImg.pageModule.picInfo[0].hrefURL = {};
        }
        this.$emit('getEditMess', this.singleImg);
        this.getChangePutStatus(true);
      } else {
        this.$message.error('请上传图片');
      }
    },
    // 取消
    cancelSaveSingalImg() {
      this.singleImg.pageModule.picInfo[0].picURL = '';
      this.singleImg.pageModule.picInfo[0].hrefURL = {};
    },

    // 双列图片
    doubleUploadSuccess(response, file, fileList, index) {
      if (response.errorCode === 0) {
        this.doubleImg.pageModule.picInfo[index].picURL = response.result[0].qcloudImageUrl;
        this.doubleImg.pageModule.picInfo[index].width = this.doubleParams.width;
        this.doubleImg.pageModule.picInfo[index].height = this.doubleParams.height;
        this.$message.success('上传成功');
        this.getChangePutStatus(false);
      } else {
        this.$message.error(response.message);
      }
    },
    doubleloadBefore(file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif') {
        this.$message.error('请上传jpg，png格式的图片');
        this.doubleImgHeight = '';
        return false;
      }
      if (file.size > 3 * 1024 * 1024) {
        this.$message.error('图片大小请控制在3M内');
        return false;
      }
      var that = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.onload = function(event) {
          let image = new Image();
          image.onload = function() {
            let width = this.width;
            let height = this.height;
            that.doubleParams = {
              width,
              height
            };
            if (that.doubleImg.pageModule.picInfo[0].picURL === '' && that.doubleImgHeight === '') {
              that.doubleImgHeight = height;
            }
            if (that.doubleImg.pageModule.picInfo[0].picURL) {
              that.doubleImgHeight = that.imgHeight(that.doubleImg.pageModule.picInfo[0].picURL);
            }
            if (that.doubleImg.pageModule.picInfo.length === 1) {
              //图片仅有一张的时候图片的统一高度限制为0
              that.doubleImgHeight = '';
            }
            if (width < 350 || height < 100 || height > 1000) {
              that.$message.error('请上传正确的图片尺寸');
              that.doubleImgHeight = '';

              reject();
            }
            if (that.doubleImgHeight !== '' && height !== that.doubleImgHeight) {
              that.$message.error('请上传相同高度的图片');
              reject();
            }
            resolve();
          };
          image.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    },
    imgHeight(file) {
      let img = new Image();
      img.src = file;
      return img.height;
    },
    moreLink4(index) {
      this.doubleIndex = index;
      this.linkModal = true;
    },
    // 预览
    saveDoubleImg() {
      for (let i in this.doubleImg.pageModule.picInfo) {
        if (this.doubleImg.pageModule.picInfo[i].picURL === '') {
          //可以预览
          this.$message.error('请上传图片');
          return false;
        }
      }
      for (let j in this.doubleImg.pageModule.picInfo) {
        if (this.doubleImg.pageModule.picInfo[j].hrefURL.pageId === '') {
          this.doubleImg.pageModule.picInfo[j].hrefURL = {};
        }
      }
      this.$emit('getEditMess', this.doubleImg);
      this.getChangePutStatus(true);
    },
    // 取消
    cancelSaveDoubleImg() {
      for (let i in this.doubleImg.pageModule.picInfo) {
        this.doubleImg.pageModule.picInfo[i].picURL = '';
        this.doubleImg.pageModule.picInfo[i].hrefURL = {};
      }
    },
    // 文本标题
    textTitleLimit(value) {
      this.$nextTick(() => {
        this.textTitle.pageModule.titleText = getInputVal.getInputVal(value, 20);
        this.textTitleLen = getInputVal.getZhLen(this.textTitle.pageModule.titleText);
      });
    },
    //更多链接
    moreLink5() {
      this.linkModal = true;
    },
    textTitleBlur() {
      if (this.textTitle.pageModule.titleText === '') {
        this.textTitleError = '0';
        return false;
      } else {
        this.textTitleError = '1';
      }
    },
    // 预览
    saveTextTitle() {
      if (this.textTitle.pageModule.hrefUrl.mallProId === '') {
        this.textTitle.pageModule.hrefUrl = {};
      }
      if (this.textTitle.pageModule.titleText === '') {
        this.textTitleError = '0';
        // return false
      } else {
        this.textTitleError = '1';
      }
      this.textTitle.pageModule.titleText;
      this.$emit('getEditMess', this.textTitle);
    },
    // 取消
    cancelSaveTextTitle() {
      this.textTitle.pageModule.titleText = '';
      this.textTitle.pageModule.hrefUrl = {};
    },
    // 辅助空白
    blankBlur() {
      if (!this.assistBlank.setting.height) {
        this.$nextTick(() => {
          this.assistBlank.setting.height = 10;
        });
      }
      if (this.assistBlank.setting.height > 30) {
        this.$message.error('辅助空白最多30px');
        this.$nextTick(() => {
          this.assistBlank.setting.height = 30;
        });
      }
    },
    // 保存
    saveBlank() {
      this.assistBlank.pageModule = {};
      this.$emit('getEditMess', this.assistBlank);
    },
    // 取消
    cancelBlank() {
      this.assistBlank.setting.height = 20;
    },

    // 获取点击的div的index
    getBoxIndex(val) {
      this.selectCubeIndex = Number(val);
    },

    getBoxArr(item, index) {
      this.selectCubeIndex = index;
      this.cubeLinkIndex = index;
      this.cubeForm.pageModule.picInfo[index] = item;
      if (item.hrefURL) {
        this.cubeLink[index] = item.hrefURL;
      } else {
        this.cubeLink[index] = {
          type: 1,
          displayName: '', //图片链接的名字
          mallProId: ''
        };
      }
      this.refash = !this.refash;
      if (item.endLeft - item.left && item.picURL === '') {
        this.getChangePutStatus(false);
      }
    },
    //删除事件
    removeBoxArr(index) {
      this.cubeForm.pageModule.picInfo.splice(index, 1);
      this.cubeLink.splice(index, 1);
      let bol = this.cubeForm.pageModule.picInfo.some(item => {
        return item.hasOwnProperty('left');
      });
      if (this.isNew && !this.cubeForm.pageModule.picInfo.length) {
        bol = true;
      }
      this.getChangePutStatus(bol);
    },
    // 魔方图片链接
    moreLink6() {
      this.linkModal = true;
    },
    //改变列
    changeColumn() {
      this.boxMsg = [];
      this.cubeForm.pageModule.picInfo = [];
    },
    // 改变行
    changeRow() {
      this.boxMsg = [];
      this.cubeForm.pageModule.picInfo = [];
    },
    //获取魔方是否选择全部的状态
    getSelectAll(bol) {
      this.selectAll = bol;
    },
    // 保存
    saveCube() {
      let picInfoSubmit = [];
      if (!this.selectAll) {
        this.$message.error('布局区域的列必须全部填充');
        return false;
      }
      for (let item of this.cubeForm.pageModule.picInfo) {
        let zb = item.left + '.' + item.top + ',' + item.endLeft + '.' + item.endTop;
        if (item.hrefURL) {
          picInfoSubmit.push({
            picURL: item.picURL,
            hrefURL: item.hrefURL,
            zb: item.zb ? item.zb : zb
          });
        } else {
          picInfoSubmit.push({
            picURL: item.picURL,
            hrefURL: {},
            zb: item.zb ? item.zb : zb
          });
        }
      }
      this.cubeForm.pageModule.picInfo = picInfoSubmit;
      let isAll = this.cubeForm.pageModule.picInfo.some(item => {
        return item.picURL === '';
      });
      if (isAll) {
        //存在没有传图片的
        this.$message.error('请上传图片');
        return false;
      }
      this.$emit('getEditMess', this.cubeForm);
      this.getChangePutStatus(true);
    },
    //取消保存
    cancelCube() {
      this.boxMsg = [];
      this.cubeForm.pageModule.picInfo = [];

      this.cubeForm.setting.column = 3;
      this.cubeForm.setting.row = 3;
      // this.$emit('getEditMess', this.cubeForm);
      // if (this.isNew) {
      //   //新建取消
      //   this.boxMsg = [];
      //   this.cubeForm.pageModule.picInfo = [];

      //   this.cubeForm.setting.column = 3;
      //   this.cubeForm.setting.row = 3;
      //   this.getChangePutStatus(true);
      // } else {
      //   this.boxMsg = this.cubeFormCopy.pageModule.picInfo.map(item => {
      //     return {
      //       left: Number(
      //         item.zb
      //           .split('.')
      //           .join(',')
      //           .split(',')[0]
      //       ),
      //       top: Number(
      //         item.zb
      //           .split('.')
      //           .join(',')
      //           .split(',')[1]
      //       ),
      //       endLeft: Number(
      //         item.zb
      //           .split('.')
      //           .join(',')
      //           .split(',')[2]
      //       ),
      //       endTop: Number(
      //         item.zb
      //           .split('.')
      //           .join(',')
      //           .split(',')[3]
      //       ),
      //       picURL: item.picURL,
      //       hrefURL: item.hrefURL
      //     };
      //   });
      //   this.cubeLink = this.cubeFormCopy.pageModule.picInfo.map(item => {
      //     return {
      //       hrefURL: item.hrefURL
      //     };
      //   });
      //   this.cubeForm.setting.column = this.cubeFormCopy.setting.column;
      //   this.cubeForm.setting.row = this.cubeFormCopy.setting.row;
      //   this.getChangePutStatus(true);
      // }
    },
    // 预览传参
    getChangePutStatus(bol) {
      this.$emit('changePutStatus', bol);
    }
  },
  components: {
    Treeselect,
    selecGoods,
    linkModal,
    cateModal,
    cubeBox
  }
};
</script>

<style scoped>
/*双列商品*/
.edit-double-goods {
  padding: 20px 0;
}
.edit-double-goods h3 {
  height: 20px;
  line-height: 20px;
  font-size: 18px;
  font-weight: 700;
  margin-left: 20px;
}
.w-360 {
  width: 360px;
}
.w-320 {
  width: 320px;
}
.w-330 {
  width: 330px;
}
.link-content {
  font-size: 0;
  height: 40px;
}
.link-content .link-box {
  width: 360px;
  border: 1px solid #dcdfe6;
  height: 32px;
  line-height: 32px;
  display: inline-block;
  border-radius: 4px;
  background: #f5f7fa;
}
.link-content button {
  vertical-align: top;
  float: right;
}
.add-img {
  height: 40px;
  line-height: 40px;
  border: 1px dashed #e7e7eb;
  text-align: center;
  cursor: pointer;
  margin-top: 70px;
  color: #606266;
}
.add-img:hover {
  color: #409eff;
  border-color: #409eff;
}
/*图片*/
.edit-img-content {
  padding: 20px 0;
}
.edit-img-content h3 {
  height: 20px;
  line-height: 20px;
  font-size: 18px;
  font-weight: 700;
  margin-left: 20px;
}
.edit-img-item {
  margin-top: 24px;
  margin-bottom: 25px;
}
.edit-img-title {
  display: flex;
  justify-content: space-between;
}
.move-box {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  border: 1px solid #e7e7eb;
  cursor: pointer;
  margin-right: 7px;
  vertical-align: top;
  text-align: center;
}
.move-box i {
  font-size: 16px;
  font-weight: 600;
  color: #909399;
  margin-top: 2px;
}
.move-box:hover {
  background: rgb(64, 158, 255);
  color: #fff;
}
.delete-move:hover {
  background: #f56c6c;
}
.move-box:hover i {
  color: #fff;
}
/*element上传图片样式*/
.avatar-uploader {
  background: #f5f5fa;
  margin-top: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 270px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 270px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 270px;
  height: 178px;
  display: block;
}
.img-warm {
  margin: 20px 0;
  line-height: 16px;
  font-size: 12px;
  color: #909399;
}
/*文本标题*/
.edit-text {
  padding: 20px;
}
.edit-text h3 {
  height: 20px;
  line-height: 20px;
  font-size: 18px;
  font-weight: 700;
}
/*辅助线*/
.edit-line {
  padding: 20px;
}
.edit-line h3 {
  height: 20px;
  line-height: 20px;
  font-size: 18px;
  font-weight: 700;
}
.edit-line div {
  margin-top: 20px;
}
.w-355 {
  width: 355px;
}
/*辅助空白*/
.edit-blank {
  padding: 20px 0;
}
.edit-blank h3 {
  height: 20px;
  line-height: 20px;
  font-size: 18px;
  font-weight: 700;
  margin-left: 20px;
}
/*魔方*/
.edit-cube {
  padding: 20px 0;
  padding-bottom: 77px;
}
.edit-cube h3 {
  height: 20px;
  line-height: 20px;
  font-size: 18px;
  font-weight: 700;
  margin-left: 20px;
  margin-bottom: 22px;
}

.img-text {
  margin-bottom: 15px;
}
.img-text img {
  width: 80px;
  height: 80px;
}
.img-text .text {
  display: inline-block;
  vertical-align: top;
  width: 70%;
  margin-left: 3px;
  font-size: 13px;
  line-height: 14px;
}
.link-text {
  font-size: 12px;
  width: 295px;
  height: 40px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 5px;
}
.edit-item {
  padding: 0 20px;
}
.height60 {
  height: 60px;
}
.bottom-btn {
  width: 400px;
  background: #fff;
  height: 50px;
  position: fixed;
  bottom: 0px;
  font-size: 0px;
  z-index: 3;
}
.bottom-btn span {
  width: 50%;
  height: 50px;
  line-height: 50px;
  color: red;
  font-size: 14px;
  cursor: pointer;
  display: inline-block;
}
.bottom-btn span:first-child {
  background: #1890ff;
  color: #fff;
}
.bottom-btn span:last-child {
  background: #f4f4f5;
  color: #909399;
}
</style>
