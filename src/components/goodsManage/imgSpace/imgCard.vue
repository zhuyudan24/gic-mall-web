<template>
  <div class="card-content">
    <div class="card-item" :class="item.selectItem ? 'select-item' : ''" v-for="(item, index) in tableData" :key="item.id">
      <span style="display:none">{{ refash }}{{ shuaxin }}</span>
      <div :class="item.type === 'folder' ? 'folder-img' : 'img-box'" @click="selectItemClick(item)">
        <div v-if="item.type === 'folder'" style="border:10px solid #fff;height:138px">
          <img src="../../../../static/img/folder_pic.png" alt="" @dblclick="openFolder(item)" />
        </div>
        <img v-else :src="item.imgUrl" alt="" @dblclick="openImgDetail(item, index)" />
        <div v-if="item.quoteStatus === 1 && item.type === 'image'" class="used-pic">引</div>
      </div>
      <div class="folder-name">
        <span v-if="!item.editStatus" @click.stop="editFileName(item, index)">{{ item.name }}</span>
        <input type="text" class="file-input" v-focus v-if="item.editStatus" v-model="item.name" @blur="editFinish(item)" @input="nameLimit(item)" />
        <span style="display:none">{{ refash }}</span>
        <div class="img-operate">
          <div style="display:flex;align-items: center;justify-content:center;">
            <a href="javaScript:void(0)" title="移动"><i class="iconfont icon-zhuanyi" @click.stop="moveFile(item)"></i></a>
            <a href="javaScript:void(0)" title="重新上传" v-if="item.type === 'image'">
              <label for="upload2">
                <i class="iconfont icon-shangchuan" @click="beforeUpload(item.id)"></i>
                <input style="display: none;" id="upload2" type="file" @change="e => reuploadImg(e, item)" />
              </label>
            </a>
            <a href="javaScript:void(0)" title="复制" v-if="item.type === 'image'">
              <i class="iconfont icon-lianjie" v-clipboard:copy="item.imgUrl" v-clipboard:success.prevent="onCopy" v-clipboard:error.prevent="onError"> </i>
            </a>
            <a href="javaScript:void(0)" title="删除">
              <i class="el-icon-delete" @click.stop="listDelete(item)"></i>
            </a>
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
    <!-- 图片放大的弹框 -->
    <el-dialog title="图片详情" :visible.sync="dialogFormVisible" width="900px" class="img-dialog">
      <div class="img-detail-content">
        <div class="img-detail-left">
          <i class="el-icon-arrow-left" @click="lastImg"></i>
          <i class="el-icon-arrow-right" @click="nextImg"></i>
          <div class="big-img-box">
            <img :src="imgDetail.imgUrl" alt="" />
          </div>
        </div>
        <div class="img-detail-right">
          <h2>{{ imgDetail.name }}</h2>
          <div class="img-info">
            <h3>图片属性</h3>
            <div class="img-info-item">
              <span>编辑时间：</span><span>{{ getTime(imgDetail.updateTime) }} {{ getSeconds(imgDetail.updateTime) }}</span>
            </div>
            <div class="img-info-item">
              <span>图片大小：</span><span>{{ (imgDetail.size / 1024).toFixed(2) }}KB</span>
            </div>
            <div class="img-info-item">
              <span>图片尺寸：</span><span>{{ imgDetail.width }}x{{ imgDetail.length }}</span>
            </div>
            <div class="img-info-item">
              <span>图片类型：</span><span>{{ imgDetail.imgType }}</span>
            </div>
          </div>
          <!-- <div slot="footer" class="dialog-footer" style="position:absolute;right:15px;bottom:15px">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button
              type="primary" @click="dialogFormVisible = false">确定</el-button>
          </div> -->
        </div>
      </div>
      <!--  <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button  type="primary" @click="dialogFormVisible = false">确定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import common from '../../../../static/js/common.js';
import request from '../../../api/request.js';
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
    },
    parentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      getTime: common.getTime,
      getSeconds: common.getSeconds,
      inputVisible: false,
      dialogFormVisible: false, //图片详情弹框
      refash: false,
      uploadId: '',
      action: window.location.origin + '/api-mall/gic-cloud-image-replace',
      // action:'http://gicdev.demogic.com/api-mall/gic-cloud-image-replace',
      imgDetail: {
        imgUrl: '', //图片地址
        name: '', //图片名称
        updateTime: '', //编辑时间
        size: '', //图片大小
        width: '', //图片宽
        length: '', //图片高
        imgType: '', //图片类型
        id: '' //图片id
      }, //详情的图片地址
      currentIndex: -1,
      nameChange: ''
    };
  },
  directives: {
    focus: {
      // 当绑定元素插入到 DOM 中。
      inserted: function(el) {
        // 聚焦元素
        el.focus();
      }
    }
  },

  computed: {},
  methods: {
    //点击选中

    selectItemClick(item) {
      this.$emit('changeStatus', item, 2);
      this.refash = !this.refash;
    },
    // 双击文件夹事件
    openFolder(item) {
      this.$emit('getDbClick', item.id);
    },
    //双击图片事件
    openImgDetail(item, index) {
      this.dialogFormVisible = true;
      this.imgDetail = item;
      this.currentIndex = index;
    },
    // 上一张
    lastImg() {
      if (this.currentIndex === 0) {
        this.$message.error('已经是当前页的第一张了');
        return false;
      }
      if (this.tableData[this.currentIndex - 1].type === 'folder') {
        this.currentIndex--;
        this.$message.error('已经是当前页的第一张了');
      } else {
        this.imgDetail = this.tableData[this.currentIndex - 1];
        this.currentIndex--;
      }
    },
    //下一张
    nextImg() {
      if (this.currentIndex === this.tableData.length - 1) {
        this.$message.error('已经是当前页的最后一张了');
        return false;
      }
      if (this.tableData[this.currentIndex + 1].type === 'folder') {
        this.currentIndex++;
      } else {
        this.imgDetail = this.tableData[this.currentIndex + 1];
        this.currentIndex++;
      }
    },
    // 编辑名字
    editFileName(item, index) {
      this.$emit('changeStatus', item, 1, true); //这个
      this.refash = !this.refash;
      this.nameChange = item.name;

      // this.$nextTick(() => {
      //   let temRef= 'focus'+index;
      //   this.$refs[focusindex].onfocus()
      // })
    },
    // 编辑完
    editFinish(item) {
      this.$emit('changeStatus', item, 1, false);
      this.refash = !this.refash;
      let params = {
        id: item.id,
        name: item.name
      };
      if (this.nameChange === item.name) {
        //未做修改
        return false;
      } else {
        if (item.name === '') {
          this.$message.error('名称不能为空');
          item.name = this.nameChange;
          return false;
        }
        request.get('/api-mall/gic-cloud-image-rename', { params }).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success('修改成功!');
            this.$emit('getImgList'); //更新数据
            this.$emit('getTree'); //更新树数据
          } else {
            item.name = this.nameChange;
            this.$message.error(res.data.message);
          }
        });
      }
    },
    //编辑字数限制
    nameLimit(item) {
      let returnValue = '';
      let byteValLen = 0;
      if (item.name.length) {
        for (let i = 0; i < item.name.length; i++) {
          if (item.name[i].match(/[^\x00-\xff]/gi) != null) byteValLen += 1;
          else byteValLen += 0.5;
          if (byteValLen > 20) break;
          returnValue += item.name[i];
        }
        item.name = returnValue;
      }
    },
    // 删除图片或文件
    listDelete(item) {
      this.$emit('deleteFile', item.id);
    },
    // 移动文件
    moveFile(item) {
      let type;
      if (item.type === 'folder') {
        //文件夹
        type = 2;
      } else if (item.type === 'image') {
        //图片
        type = 1;
      }
      this.$emit('moveFile', item.id, type);
    },
    // 重新上传
    reuploadImg(e, item) {
      let formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('parentId', this.parentId);
      formData.append('targetId', this.uploadId);

      let img = e.target.files[0];
      let reader = new FileReader();
      reader.onload = function(event) {
        let data = event.target.result;
        let image = new Image();
        // image.onload=function(){
        //   let width = image.width;
        //   let height = image.height;

        // };
        image.src = data;
      };
      reader.readAsDataURL(img);
      if (img.type !== 'image/jpeg' && img.type !== 'image/png') {
        e.target.value = '';
        this.$message.error('请上传jpg，png格式的图片');
        return false;
      }
      if (img.size > 5 * 1024 * 1024) {
        //大于5M
        e.target.value = '';
        this.$message.error('请上传小于5MB的图片');
        return false;
      }
      request.post('/api-mall/gic-cloud-image-replace', formData).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('上传成功');
          this.$emit('getImgList');
          e.target.value = '';
        } else {
          e.target.value = '';
          this.$message.error(res.data.message);
        }
      });
    },
    beforeUpload(id) {
      this.uploadId = id;
    },
    //复制链接
    onCopy(e) {
      this.$message.success('复制成功');
    },
    onError(e) {
      this.$message.error('复制失败');
    }
  },
  components: {}
};
</script>
<style>
.img-dialog .el-dialog__body {
  padding: 0px;
}
</style>
<style scoped>
.card-item {
  width: 160px;
  /*height: 195px;*/
  /*border: 1px solid #E4E7ED;*/
  display: inline-block;
  vertical-align: top;
  margin-right: 10px;
  margin-bottom: 15px;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 2px;
}
/*文件夹*/
.folder-img {
  width: 158px;
  height: 158px;
  background: #f5f5f8;
  /*margin-top: 13px;*/
  text-align: center;
  border: 1px solid #e4e7ed;
  border-bottom: none;
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
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
  border: 1px solid #e4e7ed;
  border-bottom: none;
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
}
.folder-name {
  width: 160px;
  height: 37px;
  line-height: 37px;
  position: relative;
  box-sizing: border-box;
}
.folder-name span {
  width: 158px;
  height: 100%;
  display: inline-block;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  border: 1px solid #e4e7ed;
  border-top: none;
}
.file-input {
  width: 158px;
  height: 36px;
  display: inline-block;
  text-align: center;
  border: 1px solid rgba(24, 144, 255, 0.7);
  /*border-color:rgba(24,144,255,0.7);*/
  border-radius: 2px;
  border-top: none;
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
  z-index: 1;
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
.img-operate label {
  flex: 1;
  text-align: center;
}
.select-item .img-box img {
  border-color: rgba(24, 144, 255, 0.7);
}
.select-item .folder-name span {
  background: rgba(24, 144, 255, 0.7);
  color: #fff;
  border-color: rgba(24, 144, 255, 0.7);
}
.select-item .folder-img {
  border-color: rgba(24, 144, 255, 0.7);
}
/*图片详情弹框*/
.img-detail-content {
  font-size: 0;
  border-top: 1px solid #e4e7eb;
}
.img-detail-left {
  width: 640px;
  display: inline-block;
  background: #fff;
  position: relative;
  height: 610px;
  font-size: 14px;
}
.big-img-box {
  width: 348px;
  height: 492px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.big-img-box img {
  max-width: 100%;
  height: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.el-icon-arrow-left {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
.el-icon-arrow-right {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
.img-detail-right {
  display: inline-block;
  background: #f5f7fa;
  width: 260px;
  height: 612px;
  vertical-align: top;
  position: relative;
  font-size: 14px;
}
.img-detail-right h2 {
  font-size: 18px;
  margin: 25px 15px 60px 15px;
  word-break: break-all;
}
.img-info {
  padding-left: 15px;
}
.img-info h3 {
  font-size: 15px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #c0c4cc;
  margin-bottom: 8px;
}
.img-info-item {
  padding: 6px 0;
}
</style>
