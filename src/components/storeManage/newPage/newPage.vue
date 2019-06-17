<template>
  <div class="page-decoration-container">
    <div class="page-decoration-content">
      <div class="decoration-header">
        <div class="fl">
          <img src="../../../../static/img/navlogo.png" />
          <img src="../../../../static/img/mall-title-icon.png" />
        </div>
        <div class="fr">
          <el-button plain class="header-btn" @click="goBack">返回</el-button>
          <el-button plain class="header-btn" @click="submitPage('0')">保存</el-button>
          <el-button type="primary" @click="submitPage('1')">保存并发布</el-button>
        </div>
      </div>
      <div class="page-content" :style="{ height: mallHeight + 'px' }">
        <!-- 左侧组件 -->
        <div class="page-left">
          <div class="page-left-group">
            <h3>商品类</h3>
            <draggable element="div" v-model="leftList1" :options="dragOptions1" class="module-content">
              <div class="module-item" v-for="item in leftList1" :key="item.moduleType">
                <i class="mall-icon" :class="item.iconfontClass"></i>
                <p>{{ item.moduleName }}</p>
              </div>
            </draggable>
          </div>
          <div class="page-left-group">
            <h3>图文类</h3>
            <draggable element="div" v-model="leftList2" :options="dragOptions2" class="module-content" @start="dragStart">
              <div class="module-item" v-for="item1 in leftList2" :key="item1.moduleType">
                <i class="mall-icon" :class="item1.iconfontClass"></i>
                <p>{{ item1.moduleName }}</p>
              </div>
            </draggable>
          </div>
        </div>
        <!-- 中间的展示 -->

        <div class="page-center-content">
          <div class="page-center">
            <div class="phone-header">
              <img src="../.././../../static/img/navbar.png" />
            </div>
            <span style="display:none">{{ refash }}</span>
            <div class="phone-content">
              <draggable element="div" v-model="pageElementList" :options="dragOptions3" style="min-height:500px;" @add="changeElementList">
                <div v-for="(item, index) in pageElementList" :key="index" @click="selectEditItem(item.moduleType, index, item)" :class="classIndex == index ? 'activeSelect' : ''" class="hover-class">
                  <!-- 双列商品 -->
                  <div v-if="item.moduleType === 1 && item.pageModule.productList.length === 0" class="phone-double-goods">
                    <div class="double-goods-title">
                      <span>双列商品</span>
                      <i class="el-icon-arrow-right"></i>
                    </div>
                    <div class="double-goods-item" v-for="(ite, x) in 2" :key="x">
                      <img src="../../../../static/img/pic_default.png" />
                      <p class="goods-describe">商品名称</p>
                      <p class="goods-price">￥0.00</p>
                    </div>
                  </div>
                  <div v-if="item.moduleType === 1 && item.pageModule.productList.length !== 0" class="phone-double-goods">
                    <div class="double-goods-title">
                      <span>{{ item.pageModule.moduleName }}</span>
                      <i class="el-icon-arrow-right"></i>
                    </div>
                    <div class="double-goods-item" v-for="(itm, indx) in item.pageModule.productList" :key="indx">
                      <img :src="itm.mallProImageUrl" />
                      <p class="goods-describe">{{ itm.proName }}</p>
                      <p class="goods-price">￥{{ itm.mallProSpuPrice }}</p>
                    </div>
                  </div>

                  <!-- 轮播图 -->
                  <div v-if="item.moduleType === 2 && item.pageModule.picInfo[0].picURL === ''" class="phone-carousel">
                    <img src="../../../../static/img/pic_default.png" />
                  </div>
                  <!-- 轮播图 -->
                  <template v-if="item.moduleType === 2 && item.pageModule.picInfo[0].picURL">
                    <el-carousel :interval="5000" arrow="always" class="phone-carousel" height="150px">
                      <el-carousel-item v-for="(itm, indx) in item.pageModule.picInfo" :key="indx">
                        <img :src="itm.picURL" alt="" />
                      </el-carousel-item>
                    </el-carousel>
                  </template>

                  <!-- 单列图片 -->
                  <div v-if="item.moduleType === 3" class="phone-single-img">
                    <img v-if="item.pageModule.picInfo[0].picURL === ''" src="../../../../static/img/pic_default.png" />
                    <img v-else :src="item.pageModule.picInfo[0].picURL" alt="" />
                  </div>
                  <!-- 双列图片 -->
                  <div v-if="item.moduleType === 4" class="phone-double-img">
                    <img v-if="item.pageModule.picInfo[0].picURL === ''" src="../../../../static/img/pic_default.png" alt="" />
                    <img v-else :src="item.pageModule.picInfo[0].picURL" />
                    <img v-if="item.pageModule.picInfo[1].picURL === ''" src="../../../../static/img/pic_default.png" alt="" />
                    <img v-else :src="item.pageModule.picInfo[1].picURL" />
                  </div>
                  <!-- 文本标题 -->
                  <div v-if="item.moduleType === 5" class="phone-text-title">
                    <span v-if="item.pageModule.titleText === ''">文本标题</span>
                    <span v-else>{{ item.pageModule.titleText }}</span>
                    <i v-if="item.pageModule.hrefUrl && item.pageModule.hrefUrl.mallProId !== ''" class="el-icon-arrow-right"></i>
                    <!-- <i
                      class="el-icon-arrow-right"
                      v-if="item.pageModule.hrefUrl.mallProId!==''"></i> -->
                  </div>
                  <!-- 辅助线 -->
                  <div v-if="item.moduleType === 6" class="phone-line">
                    <p></p>
                  </div>
                  <!-- 辅助空白 -->
                  <div v-if="item.moduleType === 7" class="phone-blank">
                    <p :style="{ height: item.setting.height + 'px' }"></p>
                  </div>
                  <!-- 魔方 -->
                  <div v-if="item.moduleType === 8" class="phone-cube">
                    <div
                      v-if="item.pageModule.picInfo[0].zb == ''"
                      :style="{
                        height: (350 / item.setting.column) * item.setting.row + 'px'
                      }"
                    ></div>
                    <div
                      v-else
                      :style="{
                        height: (350 / item.setting.column) * item.setting.row + 'px'
                      }"
                    >
                      <img
                        class="img-cube"
                        :src="itm.picURL"
                        alt=""
                        v-for="(itm, idx) in item.pageModule.picInfo"
                        :key="idx"
                        :style="{
                          width:
                            (itm.zb
                              .split('.')
                              .join(',')
                              .split(',')[2] -
                              itm.zb
                                .split('.')
                                .join(',')
                                .split(',')[0]) *
                              (350 / item.setting.column) +
                            'px',
                          height:
                            (itm.zb
                              .split('.')
                              .join(',')
                              .split(',')[3] -
                              itm.zb
                                .split('.')
                                .join(',')
                                .split(',')[1]) *
                              (350 / item.setting.column) +
                            'px',
                          left:
                            itm.zb
                              .split('.')
                              .join(',')
                              .split(',')[0] *
                              (350 / item.setting.column) +
                            'px',
                          top:
                            itm.zb
                              .split('.')
                              .join(',')
                              .split(',')[1] *
                              (350 / item.setting.column) +
                            'px'
                        }"
                      />
                    </div>

                    <!-- width: (itm.zb[4] - itm.zb[0]) * (350 / item.setting.column) + 'px',
                    height: (itm.zb[6] - itm.zb[2]) * (350 / item.setting.column) + 'px',
                    left: itm.zb[0] * (350 / item.setting.column) + 'px',
                    top: itm.zb[2] * (350 / item.setting.column) + 'px' -->
                  </div>
                  <span class="deleteMoudle" @click="deletePageMoudle(index)"><i class="el-icon-close"></i></span>
                </div>
              </draggable>
            </div>
          </div>
        </div>
        <!-- 右边的编辑 -->
        <div class="page-right">
          <!-- 双列商品 -->
          <rightEdit :showEditStatus="showEditStatus" @getEditMess="getEditMess" :obj="obj" :changeStatus="changeStatus" @changePutStatus="changePutStatus"> </rightEdit>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '../../../api/request.js';
import rightEdit from './rightEdit.vue';
import draggable from 'vuedraggable';

export default {
  data() {
    return {
      changeStatus: false,
      mallHeight: document.documentElement.clientHeight - 65,
      leftList1: [
        {
          moduleName: '双列商品',
          moduleType: 1,
          iconfontClass: 'mall-icon-double-goods',
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
            productList: []
          }
        }
      ],
      leftList2: [
        {
          moduleName: '轮播图片',
          moduleType: 2,
          iconfontClass: 'mall-icon-carousel',
          pageModule: {
            moduleType: 2,
            picInfo: [
              {
                picURL: '',
                hrefURL: {
                  type: 4,
                  displayName: '',
                  pageId: ''
                }
              }
            ]
          }
        },
        {
          moduleName: '单列图片',
          moduleType: 3,
          iconfontClass: 'mall-icon-single-img',
          pageModule: {
            moduleType: 3,
            picInfo: [
              {
                picURL: '',
                hrefURL: {
                  type: 4,
                  displayName: '',
                  pageId: ''
                }
              }
            ]
          }
        },
        {
          moduleName: '双列图片',
          moduleType: 4,
          iconfontClass: 'mall-icon-double-img',
          pageModule: {
            moduleType: 2,
            picInfo: [
              {
                picURL: '',
                hrefURL: {
                  type: 4,
                  displayName: '',
                  pageId: ''
                }
              },
              {
                picURL: '',
                hrefURL: {
                  type: 4,
                  displayName: '',
                  pageId: ''
                }
              }
            ]
          }
        },
        {
          moduleName: '文本标题',
          moduleType: 5,
          iconfontClass: 'mall-icon-text',
          pageModule: {
            titleText: '', //文本类型标题
            hrefUrl: {
              type: 1,
              displayName: '',
              mallProId: ''
            } //链接信息
          }
        },
        {
          moduleName: '辅助线',
          moduleType: 6,
          iconfontClass: 'mall-icon-line',
          pageModule: {}
        },
        {
          moduleName: '辅助空白',
          moduleType: 7, //辅助空白
          iconfontClass: 'mall-icon-blank',
          setting: {
            height: 20 //高度
          },
          pageModule: {}
        },
        {
          moduleName: '魔方',
          moduleType: 8,
          iconfontClass: 'mall-icon-cube',
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
                zb: ''
              }
            ]
          }
        }
      ],
      dragOptions1: {
        sort: false,
        group: {
          name: 'description',
          pull: 'clone',
          put: false
        },
        ghostClass: 'ghost'
      },
      dragOptions2: {
        sort: false,
        group: {
          name: 'description',
          pull: 'clone',
          put: false
        },
        ghostClass: 'ghost'
      },
      dragOptions3: {
        group: {
          name: 'description',
          pull: false,
          put: true
        },
        ghostClass: 'ghost'
      },
      pageElementList: [],
      obj: {},
      showEditStatus: 0,
      classIndex: '',
      itemIndex: -1,
      refash: false,
      mallProId: '',
      showDialog: false,
      pageId: ''
    };
  },
  created() {
    this.pageId = this.$route.params.pageId;
    this.getPageMess(); //查询页面元素
  },
  computed: {},
  methods: {
    // 添加的时候右侧对应显示他自己的编辑项
    changeElementList(event) {
      this.showEditStatus = this.pageElementList[event.newIndex].moduleType;
      this.obj = this.pageElementList[event.newIndex];
      this.itemIndex = event.newIndex;
      this.changeStatus = !this.changeStatus;
    },
    // 点击中间手机展示的部分显示选择的编辑
    selectEditItem(itemNum, index, item) {
      if (!this.dragOptions3.group.put) {
        this.$message.error('请先保存');
      } else {
        this.showEditStatus = itemNum;
        this.classIndex = index;
        this.itemIndex = index;
        this.obj = item;
        this.changeStatus = !this.changeStatus;
      }
    },
    // 删除模块
    deletePageMoudle(index) {
      this.$confirm('确定删除该模块吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.pageElementList.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 托砖开始前
    dragStart() {
      if (!this.dragOptions3.group.put) {
        this.$message.error('请先保存');
      }
    },
    changePutStatus(bol) {
      this.showDialog = bol;
      this.dragOptions3.group.put = bol;
    },
    // 获取编辑的信息
    getEditMess(value) {
      if (value.moduleType === 8) {
        //魔方
        if (value.pageModule.picInfo.length === 0) {
          this.$message.error('请填充魔方布局');
          return false;
        }
      }
      this.pageElementList[this.itemIndex] = value;
      this.refash = !this.refash;
    },
    //获取后台编辑的信息
    getPageMess() {
      let params = {
        pageId: this.pageId
      };
      request.get('/api-mall/mall_page_design', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.pageId = res.data.result.pageId;
          this.pageElementList = res.data.result.pageElementList;
          if (this.pageElementList) {
            for (let i in this.pageElementList) {
              if (this.pageElementList[i].moduleType === 1) {
                //双列商品
                //处理商品列表的数据
                if (this.pageElementList[i].pageModule.proList) {
                  this.pageElementList[i].pageModule.productList = this.pageElementList[i].pageModule.proList;
                  this.pageElementList[i].pageModule.moreButtonUrl = JSON.parse(this.pageElementList[i].pageModule.moreButtonUrl);
                } else {
                  this.pageElementList[i].pageModule.productList = [];
                }

                //处理商品价格范围
                if (this.pageElementList[i].pageModule.priceRange) {
                  this.pageElementList[i].pageModule.priceRange = JSON.parse(this.pageElementList[i].pageModule.priceRange);
                }
              }

              // 处理链接不一样的字段
              if (this.pageElementList[i].moduleType === 2 || this.pageElementList[i].moduleType === 3 || this.pageElementList[i].moduleType === 4) {
                if (this.pageElementList[i].pageModule.picInfo) {
                  this.pageElementList[i].pageModule.picInfo = JSON.parse(this.pageElementList[i].pageModule.picInfo);
                }
              }
              if (this.pageElementList[i].moduleType === 5) {
                this.pageElementList[i].pageModule.hrefUrl = JSON.parse(this.pageElementList[i].pageModule.hrefUrl);
              }
              if (this.pageElementList[i].moduleType === 7) {
                this.pageElementList[i].setting = JSON.parse(this.pageElementList[i].setting);
              }
              if (this.pageElementList[i].moduleType === 8) {
                this.pageElementList[i].pageModule.picInfo = JSON.parse(this.pageElementList[i].pageModule.picInfo);
                this.pageElementList[i].setting = JSON.parse(this.pageElementList[i].setting);
              }
            }
            this.pageElementList = this.pageElementList;
          } else {
            this.pageElementList = [];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 保存
    /*eslint-disable*/
    submitPage(isOpen) {
      let pageData = [];
      for (let i in this.pageElementList) {
        pageData[i] = {
          sortScore: i,
          moduleType: this.pageElementList[i].moduleType,
          pageModule: this.pageElementList[i].pageModule
        };
        if (this.pageElementList[i].moduleType === 7) {
          //辅助空白
          pageData[i].setting = this.pageElementList[i].setting;
        }
        if (this.pageElementList[i].moduleType === 8) {
          //魔方
          pageData[i].setting = this.pageElementList[i].setting;

        }
      }

      let params = {
        pageId: this.pageId,
        pageElementList: pageData
      };
      if (this.pageElementList.length === 0) {
        this.$message.error('请完善页面信息');
        return false;
      }
      for (let i in this.pageElementList) {
        if (this.pageElementList[i].moduleType === 1) {
          //双列商品
          for (let doubleI in this.pageElementList[i].pageModule.productList) {
            if (this.pageElementList[i].pageModule.productList[doubleI].mallProImageUrl === '') {
              this.$message.error('请完善页面信息');
              return false;
            }
          }
        } else if (this.pageElementList[i].moduleType === 2) {
          //轮播图片
          for (let doubleI in this.pageElementList[i].pageModule.picInfo) {
            if (this.pageElementList[i].pageModule.picInfo[doubleI].picURL === '') {
              this.$message.error('请完善页面信息');
              return false;
            }
          }
        } else if (this.pageElementList[i].moduleType === 3) {
          //单列图片

          for (let doubleI in this.pageElementList[i].pageModule.picInfo) {
            if (this.pageElementList[i].pageModule.picInfo[doubleI].picURL === '') {
              this.$message.error('请完善页面信息');
              return false;
            }
          }
        } else if (this.pageElementList[i].moduleType === 4) {
          //双列图片
          for (let doubleI in this.pageElementList[i].pageModule.picInfo) {
            if (this.pageElementList[i].pageModule.picInfo[doubleI].picURL === '') {
              this.$message.error('请完善页面信息');
              return false;
            }
          }
        } else if (this.pageElementList[i].moduleType === 5) {
          //文本标题
          if (this.pageElementList[i].pageModule.titleText === '') {
            this.$message.error('请完善页面信息');
            return false;
          }
        } else if (this.pageElementList[i].moduleType === 7) {
          //辅助空白
          if (!this.pageElementList[i].setting.height) {
            this.$message.error('请完善页面信息');
            return false;
          }
        } else if (this.pageElementList[i].moduleType === 8) {
          //魔方
          let isAll = this.pageElementList[i].pageModule.picInfo.some(item => {
            return item.picURL === '';
          });
          if (isAll) {
            //存在没有传图片的
            this.$message.error('请完善信息');
            return false;
          }
        }
      }
      if (isOpen === '1') {
        params.isOpen = 1;
      }
      request.post('/api-mall/mall_page_save_elements', params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('保存成功');
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    }
  },
  components: {
    rightEdit,
    draggable
  }
};
</script>
<style>
.phone-carousel .el-carousel__button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>
<style scoped>
.mall-section {
  margin: 24px;
  background: #fff;
  padding: 24px;
}
.operate-top {
  height: 40px;
  margin-bottom: 22px;
}
.page-decoration-container {
  height: 100%;
}
.decoration-header {
  width: 100%;
  height: 65px;
  background: #04143a;
}
.decoration-header .fl {
  margin-left: 25px;
}
.decoration-header img {
  padding: 8px 0;
  vertical-align: middle;
}
.decoration-header img:last-child {
  margin-left: 20px;
}
.decoration-header .fr {
  padding: 12px 0;
  margin-right: 25px;
}
.header-btn {
  background: #04143a;
  border-color: #409eff;
  color: #409eff;
}
.header-btn:hover {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
/*商城装修左侧*/
.page-content {
  font-size: 0;
  display: flex;
}
.page-left {
  width: 300px;
  height: 100%;
  overflow-y: auto;
  background: #fff;
  font-size: 14px;
  display: inline-block;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}
.page-left-group h3 {
  font-size: 15px;
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #dcdfe6;
  padding-left: 15px;
  font-weight: 700;
  color: #333;
}
.page-left-group {
  margin-bottom: 15px;
}
.module-item {
  /*border:1px solid #dcdfe6;*/
  width: 95px;
  height: 45px;
  text-align: center;
  padding: 20px 0;
  display: inline-block;
  cursor: move;
  box-sizing: border-box;
}

.module-item p {
  margin-bottom: 22px;
}
.mall-icon {
  width: 24px;
  height: 24px;
  display: inline-block;
  margin-bottom: 10px;
  background: url(../../../../static/img/mall-modal-icon.png);
}
.mall-icon-double-goods {
  background-position: 0px 0px;
}
.module-item:hover {
  color: #409eff;
}
.module-item:hover .mall-icon-double-goods {
  background-position: 0px -60px;
}
.mall-icon-carousel {
  background-position: -40px 0;
}
.module-item:hover .mall-icon-carousel {
  background-position: -40px -60px;
}
.mall-icon-single-img {
  background-position: -80px 0px;
}
.module-item:hover .mall-icon-single-img {
  background-position: -80px -60px;
}
.mall-icon-double-img {
  background-position: -120px 0px;
}
.module-item:hover .mall-icon-double-img {
  background-position: -120px -60px;
}
.mall-icon-text {
  background-position: 0px -104px;
}
.module-item:hover .mall-icon-text {
  background-position: 0px -164px;
}
.mall-icon-line {
  background-position: -40px -104px;
}
.module-item:hover .mall-icon-line {
  background-position: -40px -164px;
}
.mall-icon-blank {
  background-position: 0 -300px;
}
.module-item:hover .mall-icon-blank {
  background-position: 0 -360px;
}
.mall-icon-cube {
  background-position: 0 -206px;
}
.module-item:hover .mall-icon-cube {
  background-position: 0 -266px;
}
/********中间手机显示模块********/
.page-center-content {
  text-align: center;
  display: inline-block;
  flex: 1;
  padding-top: 50px;
  overflow-y: auto;
  padding-bottom: 50px;
}
.page-center {
  width: 375px;
  margin-top: 50px;
  background: #f0f2f5;
  font-size: 14px;
  display: inline-block;
  margin: 0 auto;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}
.hover-class {
  position: relative;
  margin-bottom: 10px;
  background: #fff;
}
.deleteMoudle {
  width: 32px;
  height: 32px;
  line-height: 32px;
  color: #bfc3cc;
  background-color: #7f8798;
  cursor: pointer;
  position: absolute;
  right: -32px;
  top: 0;
  display: none;
}
.hover-class:hover {
  border: 1px dashed #409eff;
}
.hover-class:hover .deleteMoudle {
  display: block;
}
.activeSelect {
  border: 1px solid #409eff;
  box-shadow: 0 1px 3px #409eff;
}
.phone-header img {
  width: 375px;
}
/*双列商品*/
.phone-double-goods {
  padding: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  text-align: left;
}
.double-goods-title {
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
}
.double-goods-title i {
  cursor: pointer;
}
.double-goods-item {
  width: 175px;
  display: inline-block;
  vertical-align: top;
  text-align: left;
  margin-top: 15px;
}

.double-goods-item img {
  width: 170px;
  height: 170px;
}
.goods-describe {
  margin-top: 10px;
  width: 174px;
  line-height: 24px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.goods-price {
  color: #f25058;
}
/*轮播图*/
.phone-carousel {
  padding: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
}
.phone-carousel img {
  width: 350px;
  height: 175px;
}
/*单列图片*/
.phone-single-img {
  padding: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
}
.phone-single-img img {
  width: 350px;
  height: 175px;
}
/*双列图片*/
.phone-double-img {
  padding: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.phone-double-img img {
  width: 170px;
  height: 170px;
}
/*文本标题*/
.phone-text-title {
  display: flex;
  justify-content: space-between;
  padding: 15px 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  /*margin-top:10px;*/
}
.phone-line {
  padding: 15px 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
}
.phone-line p {
  height: 1px;
  border-bottom: 1px dashed #dcdfe6;
}
/*辅助空白*/
.phone-blank p {
  height: 20px;
}
/*魔方*/
.phone-cube {
  width: 350px;
  border: 10px solid #fff;
  background: #d9d9d9;
  position: relative;
}
.img-cube {
  position: absolute;
}
/********右侧编辑模块********/
.page-right {
  width: 400px;
  height: 100%;
  overflow-y: auto;
  background: #fff;
  font-size: 14px;
  display: inline-block;
  float: right;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}
/*双列商品*/
.edit-double-goods {
  padding: 20px;
}
.edit-double-goods h3 {
  height: 20px;
  line-height: 20px;
  font-size: 18px;
  font-weight: 700;
}
.w-360 {
  width: 360px;
}
.link-content {
  font-size: 0;
  height: 40px;
}
.link-content .link-box {
  width: 360px;
  border: 1px solid #dcdfe6;
  height: 40px;
  line-height: 40px;
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
}
.add-img:hover {
  color: #409eff;
  border-color: #409eff;
}
/*图片*/
.edit-img-content {
  padding: 20px;
}
.edit-img-content h3 {
  height: 20px;
  line-height: 20px;
  font-size: 18px;
  font-weight: 700;
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
}
.move-box:hover {
  background: rgb(64, 158, 255);
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
  width: 100%;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.img-warm {
  margin: 20px 0;
  font-size: 12px;
}
</style>
