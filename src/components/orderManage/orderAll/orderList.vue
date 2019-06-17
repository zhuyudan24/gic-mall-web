<template>
  <div class="goods-list-content">
    <el-table
      :data="tableData"
      ref="multipleTable"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        sortable="custom"
        prop="goodsName"
        label="全选"
      >
      </el-table-column>
      <el-table-column
        prop="brandName"
        label="商品"
        width="100px"
      >
      </el-table-column>
      <el-table-column
        prop="classify"
        label="单价"
        width="120px"
      >
      </el-table-column>
      <el-table-column
        prop="price"
        label="数量"
        sortable
        width="100px"
      >
      </el-table-column>
      <el-table-column
        prop="num"
        label="售后"
        width="80px"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="visitNum"
        label="买家"
        sortable
        width="100px"
      >
      </el-table-column>
      <el-table-column
        prop="sellNum"
        label="交易状态"
        sortable
        width="120px"
      >
      </el-table-column>
      <el-table-column
        prop="date"
        label="实付金额"
        sortable
        width="100px"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="140px"
      >
        <template>
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">浏览</el-button>
          <el-button type="text" size="small">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-conteiner">
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {

    data() {
      return {
        tableData: []
      }
    },

    mounted(){
      this.$emit('dataLen',this.tableData)

    },

    methods: {
    }
  }
</script>
<style scoped>
  .goods-list-content{
    padding:24px;
    background: #fff;
  }

</style>
