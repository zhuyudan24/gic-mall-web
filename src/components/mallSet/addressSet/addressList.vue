<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>商城设置</el-breadcrumb-item>
          <el-breadcrumb-item>地址库</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>地址库</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="operate-top">
          <div class="fr"><el-button type="primary" @click="newAddress" :disabled="tableData.length > 19">新增地址</el-button></div>
        </div>
        <div class="table-content">
          <template>
            <el-table :data="tableData" style="width: 100%" v-loading="loading">
              <el-table-column label="联系人" prop="contactName"> </el-table-column>
              <el-table-column label="联系方式" min-width="120px">
                <template slot-scope="scope">
                  <p v-if="scope.row.areaNumber || scope.row.seatMachine || scope.row.extension">{{ scope.row.areaNumber }}{{ scope.row.areaNumber ? '-' : '' }}{{ scope.row.seatMachine }}{{ scope.row.extension ? '-' : '' }}{{ scope.row.extension }}</p>
                  <p v-else>{{ scope.row.contactPhone }}</p>
                </template>
              </el-table-column>
              <el-table-column label="地址" prop="addressDetail"> </el-table-column>
              <el-table-column label="地址类型">
                <template slot-scope="scope">
                  <p v-if="scope.row.addressType === 0" class="address-type">收货地址<span v-if="scope.row.ifDefault === 1">默认</span></p>
                  <p v-else class="address-type">退货地址<span v-if="scope.row.ifDefault === 1">默认</span></p>
                </template>
              </el-table-column>

              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="editAddress(scope.row.sellerAddressId)">编辑</el-button>
                  <el-popover placement="top" width="160" v-model="scope.row.visible2" style="margin-left:8px">
                    <p style="line-height:1.5;padding: 10px 10px 20px;">确定删除该地址吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="scope.row.visible2 = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="deleteAddress(scope.row)">确定</el-button>
                    </div>
                    <el-button slot="reference" type="text">删除</el-button>
                  </el-popover>
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
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import common from '../../../../static/js/common.js';
import request from '../../../api/request.js';
export default {
  data() {
    return {
      getTime: common.getTime,
      getSeconds: common.getSeconds,
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      tableData: [],
      loading: true
    };
  },
  created() {
    this.getList();
  },

  computed: {},
  methods: {
    //地址库列表
    getList() {
      request.get('/api-mall/seller/listAddress').then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result) {
            this.tableData = res.data.result;
            this.loading = false;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除
    deleteAddress(item) {
      if (item.ifDefault === 1) {
        //默认地址
        this.$message.error('默认地址请勿删除');
        return false;
      } else {
        request.post('/api-mall/seller/del_address/' + item.sellerAddressId).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success('删除成功!');
            this.getList();
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    //新建
    newAddress() {
      if (this.tableData.length > 20) {
        this.$message.error('最多可新建20条地址');
        return false;
      }
      this.$router.push({
        name: 'addressEdit',
        params: {
          sellerAddressId: '-1'
        }
      });
    },
    // 编辑地址
    editAddress(sellerAddressId) {
      this.$router.push({
        name: 'addressEdit',
        params: {
          sellerAddressId: sellerAddressId
        }
      });
    }
  },
  components: {}
};
</script>

<style scoped>
.operate-top {
  height: 32px;
}
.mall-section {
  margin: 24px;
  padding: 24px 32px;
  background: #fff;
}
.table-content {
  margin-top: 22px;
}
.address-type {
  position: relative;
}
.address-type span {
  display: inline-block;
  padding: 4px 4px;
  border-radius: 2px;
  color: #fff;
  background: #409eff;
  font-size: 10px;
  line-height: 10px;
  text-align: center;
  position: absolute;
  left: 60px;
  top: 0px;
}
</style>
