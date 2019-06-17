<template>
  <div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="名称" width="300px">
        <template slot-scope="scope">
          <div class="img-box">
            <img v-if="scope.row.type === 'folder'" src="../../../../static/img/folder_pic.png" alt="" @dblclick="openFolder(scope.row)" />
            <div style="border-radius:2px;display: inline-block;border:1px solid #E4E7ED;" v-else>
              <img :src="scope.row.imgUrl" alt="" @dblclick="openImgDetail(scope.row, scope.$index)" />
            </div>
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="尺寸（px）">
        <template slot-scope="scope">
          <p v-if="scope.row.type === 'image'">{{ scope.row.width }}x{{ scope.row.length }}</p>
          <p v-else>--</p>
        </template>
      </el-table-column>
      <el-table-column label="大小">
        <template slot-scope="scope">
          <p v-if="scope.row.type === 'image'">{{ (scope.row.size / 1024).toFixed(2) }}</p>
          <p v-else>--</p>
        </template>
      </el-table-column>
      <el-table-column label="图片引用状态">
        <template slot-scope="scope">
          <div v-if="scope.row.type === 'image'">
            <p v-if="scope.row.quoteStatus === 1"><span class="dm-status--primary">已引用</span></p>
            <p v-else><span class="dm-status--info">未引用</span></p>
          </div>
          <p v-else>--</p>
        </template>
      </el-table-column>
      <el-table-column label="更新时间">
        <template slot-scope="scope">
          <p style="line-height: 1.2">{{ scope.row.updateTime ? getTime(scope.row.updateTime) : '--' }}</p>
          <p style="line-height: 1.2">{{ scope.row.updateTime ? getSeconds(scope.row.updateTime) : '--' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" class="el-popover-box">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="160" v-model="scope.row.visible2" trigger="hover" style="width:120px">
            <div class="img-operate" v-if="scope.row.type === 'image'">
              <p @click="moveFile(scope.row)">移动图片</p>
              <label for="upload1">
                <p @click="beforeUpload(scope.row.id)">重新上传</p>
                <input style="display: none;" id="upload1" type="file" @change="e => reuploadImg(e, scope.$index)" />
              </label>
              <!-- <input type="file" @change="e=>reuploadImg(scope.row,e)" id="upload"></input> -->
              <p v-clipboard:copy="scope.row.imgUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">
                复制链接
              </p>
              <p @click="listDelete(scope.row)">删除图片</p>
            </div>
            <div class="img-operate" v-else>
              <p @click="moveFile(scope.row)">移动文件</p>
              <p @click="listDelete(scope.row)">删除文件</p>
            </div>
            <el-button slot="reference" type="text"><i class="el-icon-more"></i></el-button>
          </el-popover>
        </template>
      </el-table-column>
      <template slot="empty" style="display:none">
        <div class="no-data-wrap">
          <div class="no-data-icon">
            <img src="../../../../static/img/no-data_icon.png" />
          </div>
          <p>暂无数据</p>
        </div>
      </template>
    </el-table>
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
    parentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      getTime: common.getTime,
      getSeconds: common.getSeconds,
      multipleSelection: [],
      imgUrl: '', //链接
      uploadData: {}, //上传参数
      action: window.location.origin + '/api-mall/gic-cloud-image-replace',
      // action:'http://gicdev.demogic.com/api-mall/gic-cloud-image-replace',
      dialogFormVisible: false, //图片详情弹框
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
      uploadId: ''
    };
  },
  computed: {},
  methods: {
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let idsArr = [];
      let ids = '';
      let matchNameArr = [];
      for (let item of this.multipleSelection) {
        idsArr.push(item.id);
        if (item.type === 'folder') {
          matchNameArr.push(item.name);
        }
      }
      ids = idsArr.join(',');
      this.$emit('beforeDelete', ids);
      this.$emit('getMatchName', matchNameArr);
      this.$emit('moveObj', this.multipleSelection);
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

    //复制链接
    onCopy(e) {
      this.$message.success('复制成功');
    },
    onError(e) {
      this.$message.error('复制失败');
    },
    // 双击打开文件夹
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

    beforeUpload(id) {
      this.uploadId = id;
    }
  },
  components: {}
};
</script>
<style>
.el-popover-box .el-popover {
  min-width: 120px;
}
.img-dialog .el-dialog__body {
  padding: 0px;
}
</style>
<style scoped>
.img-box img {
  width: 35px;
  height: 35px;
  vertical-align: middle;
  cursor: pointer;
  padding: 2px;
}
.img-box span {
  margin-left: 3px;
  display: inline-block;
  width: 160px;
  vertical-align: middle;
}
.img-operate p {
  text-align: center;
  line-height: 24px;
  padding: 3px 0;
  color: #1890ff;
  cursor: pointer;
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
