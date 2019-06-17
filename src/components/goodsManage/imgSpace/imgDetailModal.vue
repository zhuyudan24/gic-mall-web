<template>
  <!-- 调整库存弹框  -->
    <el-dialog title="调整库存" :visible.sync="stockModalData.modalShow" :width="(stockModalData.modalWidth+40)+'px'" @close="cancelStockModal">



    </el-dialog>
</template>

<script>
  import qs from 'qs';
  import request  from '../../../api/request.js'
  import common from '../../../../static/js/common.js';
  export default {
    props:{
      tableSkuHeaderData:{
       type:Array,
      },
      stockModalData:{
        type:Object,
      }
    },
    data() {
      return {

      }
    },

    mounted(){

    },
    created(){

    },
    methods: {

    }
  }
</script>
