<template>
  <div class="goods-list-content">
    <el-table @sort-change="sortChange" :data="tableData" ref="multipleTable" style="width: 100%" @selection-change="handleSelectAll">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="商品信息" width="400px">
        <template slot-scope="scope">
          <div class="img-text">
            <img :src="scope.row.mallProImageUrl ? scope.row.mallProImageUrl : 'http://pic01-10001430.image.myqcloud.com/img-icon-pro.png'" />
            <div class="text">
              <p class="goods-descript">{{ scope.row.proName }}<i class="el-icon-edit" @click="editProName(scope.row)"></i></p>
              <p class="goods-code">货号:{{ scope.row.proCode }}</p>
              <p>
                <span v-if="scope.row.activityIcon.reductionStatus === 1" class="active-icon-reduce">满</span>
                <span v-if="scope.row.activityIcon.discountStatus === 1" class="active-icon-discount">折</span>
                <span v-if="scope.row.activityIcon.freeStatus === 1" class="active-icon-postage">邮</span>
                <!-- <span v-if="scope.row.activityIcon.tieredStatus===1" class="active-icon-tiered">阶</span> -->
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="proType"
        label="类型"
        >
        <template slot-scope="scope">
          <p v-if="scope.row.proType===0">手动发布</p>
          <p  v-if="scope.row.proType===1">ERP发布</p>
        </template>
      </el-table-column> -->
      <el-table-column prop="mallProSpuPrice" label="单价" sortable="custom">
        <template slot-scope="scope">
          <p>￥{{ scope.row.mallProSpuPrice }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" sortable="custom">
        <template slot-scope="scope">
          <p>
            <span>{{ scope.row.stock }}</span>
            <i class="el-icon-edit" @click="handleStock(scope.row)"></i>
          </p>
        </template>
      </el-table-column>

      <el-table-column prop="saleNum" label="总销量" sortable="custom" width="110px"> </el-table-column>
      <el-table-column prop="complete" label="完善状态">
        <template slot-scope="scope">
          <p style="line-height:18px" v-if="scope.row.complete === 0"><span class="dm-status--error">未完善</span></p>
          <p style="line-height:18px" v-if="scope.row.complete === 1"><span class="dm-status--success">已完善</span></p>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom" width="110px">
        <template slot-scope="scope">
          <p style="line-height:18px">{{ getTime(scope.row.createTime) }}</p>
          <p style="line-height:18px" class="gray-color">{{ getSeconds(scope.row.createTime) }}</p>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="updateTime"
        label="下架时间"
        sortable="custom"

        >
        <template slot-scope="scope">
          <p>{{getTime(scope.row.updateTime)}}</p>
          <p class="gray-color">{{getSeconds(scope.row.updateTime)}}</p>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="240px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="editGoods(scope.row)" v-if="scope.row.proType === 0">编辑</el-button>
          <el-button type="text" @click="editErpGoods(scope.row)" v-if="scope.row.proType === 1">编辑</el-button>
          <!-- <el-button type="text" @click="deleteItem(scope.row.mallProId,2)">上架</el-button> -->
          <tishi ref="tishi" @confirm="deleteItem(scope.row.mallProId, 2, scope.row)" tips="是否上架该商品?">
            <el-button type="text">上架</el-button>
          </tishi>
          <!-- <el-button type="text" @click="deleteItem(scope.row.mallProId,3)">删除</el-button> -->
          <tishi ref="tishi" @confirm="deleteItem(scope.row.mallProId, 3)" tips="是否删除该商品?" style="margin-left:-8px">
            <el-button type="text">删除</el-button>
          </tishi>
          <el-button type="text" @click="getLink(scope.row.mallProId)">商品链接</el-button>
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
    <eqCodeDialog :modalData="modalData"></eqCodeDialog>
    <!-- 调整库存弹框  -->
    <stockModal :stockModalData="stockModalData"></stockModal>
    <!-- 修改商品名称 -->
    <editInfo :editInfoModal="editInfoModal" @getList="getList"></editInfo>
  </div>
</template>

<script>
import request from '../../../api/request.js';
import common from '../../../../static/js/common.js';
import eqCodeDialog from '../../common/eqCode.vue';
import stockModal from './stockModal.vue';
import tishi from './popover.vue';
import editInfo from './editGoodsInfo';
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    searchObj: {
      type: Object
    }
  },
  data() {
    return {
      getTime: common.getTime,
      getSeconds: common.getSeconds,
      modalData: {
        show: false,
        imgUrl: '',
        loading: false
      },
      stockModalData: {
        tableSkuData: [], //sku列表
        tableSkuHeaderData: [], //表头数据
        modalWidth: '',
        modalShow: false
      },
      editInfoModal: {
        proName: '',
        proNameLen: 0,
        mallProId: '',
        dialogVisible: false
      }
    };
  },
  methods: {
    //当前组件触发这个函数
    getList(val) {
      this.$emit('getList');
    },
    // 排序
    sortChange(value) {
      this.sortColumn = value.prop;
      if (value.order == 'ascending') {
        this.sortType = 'asc';
      } else if (value.order == 'descending') {
        this.sortType = 'desc';
      }
      this.$emit('getList', this.sortType, this.sortColumn);
    },
    // 全选
    handleSelectAll(val) {
      this.$emit('getSelectList', val);
    },
    //删除
    deleteItem(mallProId, status, item) {
      if (item) {
        if (status === 2) {
          //上架商品
          if (item.complete === 0) {
            this.$message.error('未完善的商品不允许上架');
            return false;
          }
        }
      }
      this.$emit('handleItem', mallProId, status);
    },
    // 商品链接
    getLink(mallProId) {
      this.modalData.loading = true;
      let params = {
        mallProId: mallProId
      };
      this.modalData.show = true;
      request.get('/api-mall/get-mall-goods-qRCode', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.modalData.imgUrl = res.data.result.url;
          this.modalData.pageUrl = res.data.result.page;
          this.modalData.loading = false;
          this.modalData.show = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 调整库存弹框
    handleStock(item) {
      // this.dialogFormVisible=true
      this.stockModalData.modalShow = true;
      let params = {
        mallProId: item.mallProId
      };
      request.get('/api-mall/get-mall-goods-skus', { params }).then(res => {
        if (res.data.errorCode === 0) {
          this.stockModalData.list = res.data.result;
          this.stockModalData.total = res.data.result.length;
          //处理表头数据
          this.stockModalData.tableSkuData = [];
          this.stockModalData.tableSkuHeaderData = [];
          let header = JSON.parse(res.data.result[0].mallPropValues);
          for (let i in header) {
            this.stockModalData.tableSkuHeaderData.push(header[i].propName); //得到表头数组
          }
          this.stockModalData.tableSkuHeaderData.push('库存'); //得到表头数组数据
          for (let i in res.data.result) {
            let tem = JSON.parse(res.data.result[i].mallPropValues);
            tem.push({
              valueName: res.data.result[i].stock //得到列表数据
            });
            this.stockModalData.tableSkuData.push(tem);
          }
          this.refreshStatus = !this.refreshStatus;
          this.stockModalData.modalWidth = (this.stockModalData.tableSkuData[0].length + 1) * 140; //根据内容设置弹框的宽度
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 进入编辑页面
    editGoods(item) {
      window.localStorage.setItem('goodsSearch', JSON.stringify(this.searchObj));
      this.$router.push({
        name: 'goodsEdit',
        params: {
          mallProId: item.mallProId,
          createSource: item.createSource
        }
      });
    },
    // erp商品的编辑
    editErpGoods(item) {
      window.localStorage.setItem('goodsSearch', JSON.stringify(this.searchObj));
      this.$router.push({
        name: 'goodsErpEdit',
        params: {
          mallProId: item.mallProId
        }
      });
    },
    // 编辑商品名称
    editProName(item) {
      this.editInfoModal.proName = item.proName;
      this.editInfoModal.dialogVisible = true;
      this.editInfoModal.proNameLen = common.getZhLen(this.editInfoModal.proName);
      this.editInfoModal.mallProId = item.mallProId;
    }
  },
  components: {
    eqCodeDialog,
    stockModal,
    tishi,
    editInfo
  }
};
</script>
<style>
.goods-list-content .el-table__fixed-right {
  z-index: 0;
}
.el-table:before {
  height: 0px;
}
</style>
<style scoped>
.goods-list-content {
  margin: 0 25px 25px 25px;
  padding: 22px 24px 24px 24px;
  background: #fff;
}
/*商品信息*/
.img-text img {
  width: 80px;
  height: 80px;
  border-radius: 5px;
}
.img-text .text {
  display: inline-block;
  vertical-align: top;
  width: 70%;
  margin-left: 3px;
  font-size: 13px;
  line-height: 14px;
}
.goods-descript {
  height: 36px;
}
.goods-descript .el-icon-edit {
  margin-left: 5px;
  display: none;
}
.img-text:hover .el-icon-edit {
  display: inline-block;
}
.goods-code {
  margin-bottom: 6px;
}
/* .active-icon-reduce{
    width:20px;
    height:20px;
    display:inline-block;
    background:url(../../../../static/img/icon-20.png) 0 -30px;
  }*/
.active-icon-reduce {
  width: 20px;
  height: 20px;
  line-height: 20px;
  background: #ff6e66;
  font-size: 14px;
  text-align: center;
  display: inline-block;
  color: #fff;
  border-radius: 2px;
}
/*.active-icon-discount{
    width:20px;
    height:20px;
    display:inline-block;
    background:url(../../../../static/img/icon-20.png) 0 -67px;
  }*/
.active-icon-discount {
  width: 20px;
  height: 20px;
  line-height: 20px;
  background: #ba6de2;
  font-size: 14px;
  text-align: center;
  display: inline-block;
  color: #fff;
  border-radius: 2px;
  font-weight: 500;
}

/*.active-icon-postage{
    width:20px;
    height:20px;
    display:inline-block;
    background:url(../../../../static/img/icon-20.png) 0 -102px;
  }*/
.active-icon-postage {
  width: 20px;
  height: 20px;
  line-height: 20px;
  background: #ffb02d;
  font-size: 14px;
  text-align: center;
  display: inline-block;
  color: #fff;
  border-radius: 2px;
  font-weight: 500;
}
.active-icon-tiered {
  width: 20px;
  height: 20px;
  line-height: 20px;
  background: #ff66a0;
  font-size: 14px;
  text-align: center;
  display: inline-block;
  color: #fff;
  border-radius: 2px;
  font-weight: 500;
}
.el-icon-edit {
  cursor: pointer;
}
</style>
