<template>
  <div>
    <el-row class="order-list-title">
      <el-col :span="3">
        <div>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" class="order-checkbox">全选</el-checkbox>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content">
          商品
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content">
          单价
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content">
          数量
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content">
          售后
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content">
          买家
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content">
          交易状态
        </div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content">
          实付金额
        </div>
      </el-col>
    </el-row>

    <div class="order-list-wrap" v-for="(item,index) in list" :key="index">
      <div class="order-item-title">
        <el-checkbox :label="item.id" v-model="item.checked"  @change="handleCheckedCitiesChange"></el-checkbox>
        <span>订单编号：{{item.orderNumber}}</span>
        <span>下单时间：{{item.createTime | times}}</span>
        <span class="order-detail" @click="goToDetail(item.orderId)">
          订单详情
          <i class="el-icon-arrow-right"></i>
        </span>
      </div>
      <el-row class="order-item-wrap">
        <el-col :span="6">
          <div class="goods-info">
            <div>
              <a href="javascript:;">
                <img class="imgs-style" :src="item.orderItemList[0].mallProImageUrl" alt="">
              </a>
            </div>
            <div class="goods-text">
              <div>{{item.orderItemList[0].mallProName}}</div>
              <div class="goods-text-info">
                <div>
                  <span>颜色：</span>
                  <span>尺码：</span>
                </div>
                <div>SKU编码：{{item.orderItemList[0].mallProSkuCode}}</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content-other">
            <span>￥{{item.orderItemList[0].mallProPrice}}</span>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content-other">
            <span>{{item.orderItemList[0].mallProNumber}}</span>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content-other">
            <span>售后</span>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content-other">
            <div>{{item.buyerName}}</div>
            <div>{{item.buyerPhone}}</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content-other">
            <div>待付款</div>
            <div>关闭订单</div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content-other">
            <div>￥199.00 (含运费：￥10.00)</div>
            <div>修改运费</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        checkAll: false,
        isIndeterminate: false,
        lists:[],
        list:[]
      }
    },
    mounted() {
      for(let i = 0;i < this.list.length;i++){
        // this.list[i].checked = false;
        this.$set(this.list[i],'checked',false)
      }
    },
    filters:{
      times: function (value){ //时间戳转化为 yyyy-yy-yy 00:00:00格式
        var date = new Date(value);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
        return Y+M+D+h+m+s;
      }
    },
    methods: {
      handleCheckAllChange(val) {
        if(val){
          for(let i =0; i<this.list.length; i++ ){
            this.list[i].checked = true
          }
        }else{
          for(let i =0; i<this.list.length; i++ ){
            this.list[i].checked = false
          }
        }
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedOrdersLength = 0;
        for(let i=0;i<this.list.length;i++){
          if(this.list[i].checked){
            checkedOrdersLength += 1;
          }
        }
        this.checkAll = checkedOrdersLength === this.list.length;
        this.isIndeterminate = checkedOrdersLength > 0 && checkedOrdersLength < this.list.length;
      },
      goToDetail(id) {
        this.$router.push({
          name: 'orderDetails',
          params: { orderId: id }
        })
      }
    }
  }
</script>

<style scoped>
  .order-list-title{
    height:48px;
    line-height:48px;
    background-color:rgba(241,243,247,1);
    margin-bottom:21px;
    padding-left:14px;
    font-size:13px;
    color:#909399;
  }
  .grid-content{
    text-align:center;
  }
  .order-list-title .order-checkbox{
    /*不起作用？*/
    /*font-size:13px !important;*/
    color:#909399;
  }
  .order-item-title{
    height:48px;
    line-height:48px;
    background-color:rgba(241,243,247,1);
    margin-top:10px;
    padding-left:14px;
    font-size:13px;
    color:#909399;
    position:relative;
  }
  .order-detail{
    position:absolute;
    right:20px;
  }
  .order-item-wrap{
    height:90px;
    padding-left:14px;
    border-bottom:1px solid rgba(241,243,247,1);
  }
  .goods-info{
    height:100%;
    display:flex;
  }
  .goods-info > div{
    margin: 14px 0px;
  }
  .goods-info .goods-text{
    margin-left:18px;
    font-size:14px;
    color:#303133;
  }
  .goods-text{
    display:flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .goods-text-info{
    color:#909399;
    font-size:14px;
  }
  .goods-text-info div:first-child{
    margin-bottom:10px;
  }
  .imgs-style{
    width:62px;
    height:62px;
  }
  .grid-content-other{
    height:90px;
    color:#303133;
    font-size:14px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .grid-content-other div:first-child{
    margin-bottom:10px;
  }
</style>

