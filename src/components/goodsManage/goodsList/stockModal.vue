<template>
  <!-- 调整库存弹框  -->
  <el-dialog title="调整库存" :visible.sync="stockModalData.modalShow" :width="stockModalData.modalWidth + 40 + 'px'" @close="cancelStockModal">
    <div class="dialog-body" style="width:570px">
      <table class="brand-table" :style="{ width: stockModalData.modalWidth + 'px' }">
        <thead style=" display:table; width:100%;table-layout:fixed;">
          <tr>
            <th v-for="(item, index) in stockModalData.tableSkuHeaderData" :key="index">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody style=" display:block;max-height:300px;overflow-y:auto;">
          <tr v-for="(i, j) in stockModalData.tableSkuData" :key="j" style=" display:table; width:100%;table-layout:fixed;">
            <td v-for="(m, n) in i" :key="n">
              <span v-if="n !== i.length - 1">{{ m.valueName }}</span>
              <el-input v-model="m.valueName" placeholder="请输入内容" style="width:150px" v-else> </el-input>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelStockModal">取 消</el-button>
      <el-button type="primary" @click="confirmStockModal()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '../../../api/request.js';
export default {
  props: {
    tableSkuHeaderData: {
      type: Array
    },
    stockModalData: {
      type: Object
    }
  },
  data() {
    return {
      payload: []
    };
  },
  methods: {
    // 提交数据
    confirmStockModal() {
      var arrStock = [];
      for (let j in this.stockModalData.tableSkuData) {
        let index = this.stockModalData.tableSkuData[0].length - 1;
        for (let i in this.stockModalData.tableSkuData[j]) {
          if (i == index) {
            arrStock.push(this.stockModalData.tableSkuData[j][i].valueName);
          }
        }
      }
      this.payload = [];
      for (let i in this.stockModalData.list) {
        this.payload.push({
          mallProSkuId: this.stockModalData.list[i].mallProSkuId,
          mallProId: this.stockModalData.list[i].mallProId,
          stock: arrStock[i]
        });
      }
      request.post('/api-mall/update-mall-goods-stock', this.payload).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.result);
          this.stockModalData.modalShow = false;
          // setTimeout(()=>{

          // },800)
          this.$nextTick(() => {
            this.$emit('getList');
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 取消调整库存
    cancelStockModal() {
      this.stockModalData.modalShow = false;
    }
  }
};
</script>
<style scoped>
.wechat-img-box {
  margin: 0 auto;
  text-align: center;
}
.wechat-img {
  width: 200px;
  height: 200px;
}
table tbody {
  display: block;
  height: 195px;
  overflow-y: scroll;
}
table thead,
tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}
table thead {
  width: calc(100% - 1em);
}
</style>
