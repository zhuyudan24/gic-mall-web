<template>
  <div class="mall-section-container" :style="{ minHeight: mallHeight + 'px' }">
    <div class="mall-content-section">
      <div class="mall-content-title">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>微商城</el-breadcrumb-item>
          <el-breadcrumb-item>商城设置</el-breadcrumb-item>
          <el-breadcrumb-item>通用设置</el-breadcrumb-item>
        </el-breadcrumb>
        <h3>
          <span>通用设置</span>
        </h3>
      </div>
      <div class="mall-section">
        <div class="common-content">
          <el-form :model="mallForm" :rules="mallRules" label-width="100px" label-position="left">
            <!-- <el-form-item label="商城状态">
              <el-switch v-model="mallForm.useStatus"></el-switch>
            </el-form-item> -->
            <!-- <el-form-item label="停业图片" v-if="!mallForm.useStatus">
              <p style="font-size:13px;color:#909399;">请上传尺寸：750*1000像素，格式：jpg、png的图片</p>
              <div style="width:240px;height:350px;background:#f5f5f6;">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadAction"
                  :on-success="uploadSuccess"
                  accept="image/jpg,image/png,image/jpeg"
                  :before-upload="beforeUpload"
                  with-credentials
                  :show-file-list="false"
                  >
                  <img v-if="mallForm.closePicUrl" :src="mallForm.closePicUrl" class="avatar" style="width:240px;height:320px">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </el-form-item> -->
            <el-form-item label="显示收藏按钮">
              <el-switch v-model="mallForm.useCollection"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import request from '../../../api/request.js';

export default {
  data() {
    return {
      mallHeight: document.documentElement.clientHeight - 64 - 98,
      mallForm: {
        useStatus: false,
        closePicUrl: '',
        useCollection: false
      },
      mallRules: {},
      commonURL: window.location.origin,
      uploadAction: window.location.origin + '/api-plug/upload-img?requestProject=mall'
    };
  },
  mounted() {
    this.getMessage();
  },
  computed: {},
  methods: {
    //查询高级设置
    getMessage() {
      request.post('/api-mall/mall_advanced_setting').then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.result.useStatus === 1) {
            this.mallForm.useStatus = true;
          } else {
            this.mallForm.useStatus = false;
          }
          if (res.data.result.useCollection === 1) {
            this.mallForm.useCollection = true;
          } else {
            this.mallForm.useCollection = false;
          }
          this.mallForm.closePicUrl = res.data.result.closePicUrl;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    onSubmit() {
      // if(!this.mallForm.useStatus){//停业状态
      //   if(this.mallForm.closePicUrl==''){
      //     this.$message.error("请上传图片")
      //     return false
      //   }
      // }
      let params = {
        // useStatus:this.mallForm.useStatus?"1":"0",
        // closePicUrl:this.mallForm.useStatus?"":this.mallForm.closePicUrl,
        useCollection: this.mallForm.useCollection ? '1' : '0'
      };
      request.post('/api-mall/update_advanced_setting', qs.stringify(params)).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('设置成功');
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    beforeUpload(file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
        this.$message.error('格式有误');
        return false;
      }
      var that = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.onload = function(event) {
          let image = new Image();
          image.onload = function() {
            let width = this.width;
            let height = this.height;
            if (width !== 750 || height !== 1000) {
              that.$message.error('请上传尺寸：750*1000像素，格式：jpg、png的图片');
              reject();
            }
            resolve();
          };
          image.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    },
    // 上传图片
    uploadSuccess(response, file, fileList) {
      if (response.errorCode === 0) {
        this.mallForm.closePicUrl = response.result[0].qcloudImageUrl;
        this.$message.success('上传成功');
      }
    }
  },
  components: {}
};
</script>

<style scoped>
.mall-section {
  margin: 24px;
}
.common-content {
  background: #fff;
  padding: 24px 32px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 240px;
  height: 350px;
  line-height: 350px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
