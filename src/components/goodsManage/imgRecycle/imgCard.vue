<template>
  <div class="card-content">
    <div class="card-item" :class="item.selectItem ? 'select-item' : ''" v-for="(item, index) in tableData" :key="index">
      <span style="display:none">{{ refash }}{{ shuaxin }}</span>
      <div class="img-box">
        <img :src="item.imgUrl" alt="" @click="selectItemClick(item)" />
        <div v-if="item.quoteStatus === 1 && item.type === 'image'" class="used-pic">引</div>
      </div>
      <div class="folder-name">
        <span>{{ item.name }}</span>
        <span style="display:none">{{ refash }}</span>
        <div class="img-operate">
          <div style="display:flex;align-items: center;justify-content:center;">
            <a href="javaScript:void(0)" title="恢复"><i class="iconfont icon-10chexiao" @click.stop="recycleFile(item)"></i></a>
            <a href="javaScript:void(0)" title="彻底删除"><i class="el-icon-delete" @click.stop="deleteFile(item)"></i></a>
          </div>
        </div>
      </div>
    </div>
    <div class="no-data-wrap" style="text-align: center;" v-show="tableData.length === 0">
      <div class="no-data-icon">
        <img src="../../../../static/img/no-data_icon.png" />
      </div>
      <p style="color:#909399;font-size:14px">暂无数据</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    shuaxin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputVisible: false,
      refash: false
    };
  },
  computed: {},
  methods: {
    //点击选中
    selectItemClick(item) {
      this.$emit('changeStatus', item, 2);
      this.refash = !this.refash;
    },
    // 删除图片或文件
    deleteFile(item) {
      this.$emit('cardListDelete', item.id);
    },
    //恢复文件
    recycleFile(item) {
      this.$emit('cardListRece', item.id);
    }
  },
  components: {}
};
</script>

<style scoped>
.card-item {
  width: 160px;
  height: 195px;
  border: 1px solid #e4e7ed;
  display: inline-block;
  vertical-align: top;
  margin-right: 10px;
  margin-bottom: 15px;
  cursor: pointer;
  box-sizing: border-box;
}
/*文件夹*/
.folder-img {
  width: 130px;
  height: 130px;
  background: #f5f5f8;
  margin: 13px auto;
  text-align: center;
}
.folder-img img {
  width: 80px;
  height: 80px;
  margin: 25px auto;
}
/*文件*/
.img-box {
  width: 158px;
  height: 158px;
  position: relative;
}
.img-box img {
  width: 158px;
  height: 158px;
}
.folder-name {
  width: 158px;
  height: 37px;
  line-height: 37px;
  position: relative;
  box-sizing: border-box;
}
.folder-name span {
  width: 100%;
  height: 100%;
  display: inline-block;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}
.file-input {
  width: 100%;
  height: 34px;
  display: inline-block;
  text-align: center;
  border: 1px solid #1890ff;
  outline: none;
  /*display: none;*/
}
.card-item:hover .folder-name {
  background: #f0f2f5;
}
.used-pic {
  width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 16px;
  text-align: center;
  position: absolute;
  right: 0px;
  top: 0px;
}
/*操作按钮*/
.img-operate {
  width: 100%;
  height: 26px;
  line-height: 26px;
  background: rgba(0, 0, 0, 0.8);
  position: absolute;
  left: 0;
  top: -26px;
  padding: 0 20px;
  display: none;
  box-sizing: border-box;
}
.card-item:hover .img-operate {
  display: block;
}
.img-operate a {
  cursor: pointer;
  color: #fff;
  flex: 1;
  text-align: center;
}
.img-operate i {
  cursor: pointer;
  color: #fff;
  text-align: center;
}
.select-item {
  border: 1px solid rgba(24, 144, 255, 0.7);
}
.select-item .folder-name span {
  background: rgba(24, 144, 255, 0.7);
}
</style>
