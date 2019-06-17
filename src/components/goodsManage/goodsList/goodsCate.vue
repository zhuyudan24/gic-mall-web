<template>
  <div class="goods-cate-content">
    <div class="goods-cate-title">
      <el-tag
        :key="tag.categoryId"
        v-for="tag in selectCateData"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
        class='select-tag'
        size="small">
        {{tag.categoryName}}
      </el-tag>
    </div>
    <div class="goods-cate-list-content">
      <div class="goods-cate-box" v-for="(item,index) in allDate" :key='index'>
        <el-input
          placeholder="请输入内容"
          prefix-icon='el-icon-search'
          size="medium"
          clearable
          class="cate-search"
          >
        </el-input>
        <div class="goods-cate-list">
          <div
            class="goods-cate-item"
            v-for="(i,ind) in item"
            :class="i.classIndex===ind?'cate-item-active':''"
            :key='ind'
            @click="getNextCateList(i,ind,item,index)">
            <span>{{i.categoryName}}</span>
            <i class="el-icon-arrow-right" v-if="i.isChildren"></i>
          </div>
        </div>
        <span style="display: none;">{{refreshStatus}}</span>
      </div>
    </div>
    <div class="goods-cate-footer">
      <el-button type="primary" class="confirm-cate" size="small" @click='handaleConfirmCate'>确认选择</el-button>
    </div>
  </div>
</template>

<script>
  import request  from '../../../api/request.js'
  export default {

    data() {
      return {
        allDate:[],
        firstCate:[],
        classIndex1:0,
        refreshStatus:false,
        seceltIndex1:'',
        seceltIndex2:'',
        selectCateData:[],
      }
    },
    created(){
      this.getFirstCateList()
    },
    methods: {
      //获取一级品类列表
      getFirstCateList(){
        request.get('/api-mall/list-mall-goods-all-category').then(res => {
          if(res.data.errorCode===0){
            this.allDate=[]
            this.allDate.push(res.data.result)
          }else{
            this.$message.error(res.data.message)
          }
        })
      },
      // 获取子级品类
      getNextCateList(i,ind,item,index){
        this.seceltIndex1 = index;
        this.seceltIndex2 = ind;
        this.allDate.length = index + 1
        this.refreshStatus = !this.refreshStatus
        for( let j of item  ) {
          j.classIndex = -1
          i.selectBgcolor=false
        }
        i.classIndex = ind
        i.selectBgcolor=true//选中元素的标志
        let params = {
          categoryId:i.categoryId
        }
        request.get('/api-mall/list-mall-goods-children-category',{params}).then(res => {
          if(res.data.errorCode===0){
            if(res.data.result.length){
              this.allDate[index+1] = res.data.result
              this.refreshStatus = !this.refreshStatus
            }
          }else{
            this.$message.error(res.data.message)
          }
        })
      },
      // 确认选择子级
      handaleConfirmCate(){
        for(let i in this.selectCateData ){
          if(this.allDate[this.seceltIndex1][this.seceltIndex2].categoryGroupId==this.selectCateData[i].categoryGroupId){
            this.selectCateData.splice(i,1)
          }
        }

        this.selectCateData.push(this.allDate[this.seceltIndex1][this.seceltIndex2]);
        let cateIdsList=[]
        for(let j in this.selectCateData){
          cateIdsList.push(this.selectCateData[j].categoryId)//得到选中的品类列表集合
        }
        this.$emit("getCateIds",cateIdsList)
      },
      handleClose(tag) {
        this.selectCateData.splice(this.selectCateData.indexOf(tag), 1);
      },
    },
    components: {

    }
  }
</script>
<style scoped>
  .goods-cate-content{
    width:800px;
  }
  .goods-cate-title{
    height:32px;
    border-radius:4px;
    border:1px solid #dcdfe6;
    padding:0 10px;
  }
  .goods-cate-title .el-tag--small{
    line-height:24px;
  }
  .select-tag{
    margin:0 5px;
  }
  .goods-cate-list-content{
    overflow-x:auto;
    border:1px solid #dcdfe6;
    border-radius:4px;
    border-top:none;
    padding:10px 0 20px 0;
    white-space: nowrap;
    padding-left:10px;
  }
  .goods-cate-footer{
    width:100%;
    height:32px;
    padding:5px 0;
    border:1px solid #dcdfe6;
    border-top:none;
    position:relative;
  }
  .goods-cate-footer .confirm-cate{
    position:absolute;
    right:10px;
  }
  .goods-cate-box{
    width:200px;
    border:1px solid #dcdfe6;
    border-radius:4px;
    display:inline-block;
    margin-right:10px;
  }
  .cate-search{
    margin:10px;
    width:180px;
  }
  .goods-cate-list{
    height:200px;
    overflow-y:auto;
  }
  .goods-cate-item{
    height:32px;
    line-height: 32px;
    position: relative;
    color:#909399;
    cursor: pointer;
    padding-left:10px;
  }
  .cate-item-active{
    background: #f5f5f6;
  }
  .goods-cate-item .el-icon-arrow-right{
    position:absolute;
    right:5px;
    top:9px;
    font-weight:600;
  }
</style>
