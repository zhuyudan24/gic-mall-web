<template>
  <div class="cube-content">
    <div style="position: relative;" class="">
      <div class="cube-box">
        <ul v-for="(i, m) in lineData" :key="m" class="cube-ul">
          <li v-for="(j, n) in i.rowData" :key="n" @click="handleSelect(m, n)" style="position: relative;" @mouseenter="mouseMove(m, n)" class="cube-item" :style="{ 'background-color': j.isSelect ? '#e8f7fd' : '', width: boxWidth + 'px', height: boxWidth + 'px', 'line-height': boxWidth + 'px' }">
            <span class="el-icon-plus"></span>
          </li>
        </ul>
      </div>
      <div style="display: none">
        {{ refash }}
      </div>
      <div
        v-for="(item, index) in boxArr"
        :key="index"
        @click="selectBox(index)"
        class="click-box"
        :style="{
          left: item.left * boxWidth + item.left + 'px',
          top: item.top * boxWidth + item.top + 'px',
          width: (item.endLeft - item.left) * boxWidth + (item.endLeft - item.left - 1) + 'px',
          height: (item.endTop - item.top) * boxWidth + (item.endTop - item.top - 1) + 'px',
          'z-index': selecIndex === index ? 1 : 0,
          border: selecIndex === index ? '1px solid #1890ff' : '1px solid #dcdfe6'
        }"
      >
        <span class="img-size-text">建议{{ ((750 / column) * (item.endLeft - item.left)).toFixed(0) }}*{{ ((750 / column) * (item.endTop - item.top)).toFixed(0) }}</span>
        <img
          class="upload-img"
          :src="item.picURL"
          :style="{
            width: (item.endLeft - item.left) * boxWidth + (item.endLeft - item.left - 1) + 'px',
            height: (item.endTop - item.top) * boxWidth + (item.endTop - item.top - 1) + 'px'
          }"
          alt=""
        />
        <!-- :src="item.picURL -->
        <span
          @click.stop="removeBox(index)"
          class="delete-cube-icon el-icon-error"
          :style="{
            display: selecIndex === index ? 'inline-block' : 'none'
          }"
        >
          <!-- {{item.endLeft}}---{{boxWidth}} -->
        </span>
      </div>
    </div>
    <div class="edit-img-list edit-item">
      <div class="edit-img-item">
        <div class="edit-img-title">
          <span>图片</span>
        </div>
        <el-upload class="avatar-uploader" :show-file-list="false" style="width:270px;margin:15px auto;" :action="action" with-credentials :on-success="(response, file, fileList) => cubeUploadSuccess(response, file, fileList)" :before-upload="cubeUploadBefore">
          <img v-if="boxArr[selecIndex] && boxArr[selecIndex].picURL" :src="boxArr[selecIndex] ? boxArr[selecIndex].picURL : ''" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import copy from '../../../../static/js/clone.js';

export default {
  props: {
    column: {
      type: Number,
      default: 3
    },
    row: {
      type: Number,
      default: 3
    },
    boxMsg: {
      type: Array,
      default() {
        return [];
      }
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      boxWidth: 0,
      boxHeigth: 0,
      selecIndex: -1,
      refash: false,
      isClick: false,
      falseClick: {
        x: 0,
        y: 0
      },
      trueClick: {
        x: 0,
        y: 0
      },
      boxArr: [],
      boxPosition: [],
      lineData: [{ rowData: [{ isSelect: false, isUse: false }, { isSelect: false, isUse: false }, { isSelect: false, isUse: false }] }, { rowData: [{ isSelect: false, isUse: false }, { isSelect: false, isUse: false }, { isSelect: false, isUse: false }] }, { rowData: [{ isSelect: false, isUse: false }, { isSelect: false, isUse: false }, { isSelect: false, isUse: false }] }],

      // lineList:[
      //   {label:'4',value:4},
      //   {label:'5',value:5},
      //   {label:'6',value:6},
      //   {label:'7',value:7},
      //   {label:'8',value:8},
      // ],

      // line:3,

      // rowList:[
      //   {label:'4',value:4},
      //   {label:'5',value:5},
      //   {label:'6',value:6},
      //   {label:'7',value:7},
      //   {label:'8',value:8},
      // ],
      // row:3,
      isUse: false,
      action: window.location.origin + '/api-plug/upload-img?requestProject=mall'
      // action:'http://gicdev.demogic.com/api-plug/upload-img?requestProject=mall',
    };
  },
  watch: {
    column() {
      this.changeRow(this.column);
    },
    row() {
      this.changeLine(this.row);
    },

    boxMsg() {
      this.boxArr = copy(this.boxMsg);

      if (!this.boxArr.length) {
        this.changeBox();
      }
      this.refash = !this.refash;
    }
  },
  created() {
    this.boxArr = copy(this.boxMsg);
    this.boxWidth = 325 / this.column;
    this.boxHeigth = this.boxWidth;
    // this.changeRow(this.column);
    // this.changeLine( this.row );

    // this.boxArr =  this.boxMsg;
    this.changeBox();
    this.refash = !this.refash;
  },
  methods: {
    changeLine(val) {
      this.refash = !this.refash;
      this.row = val;
      // let sum = 325 - (val - 4);
      // this.boxHeigth = sum/val;
      this.boxHeigth = this.boxWidth;
      this.boxPosition = [];
      this.boxArr = [];
      setTimeout(() => {
        this.changeBox1();
      }, 50);
      // this.changeBox1();
    },
    changeRow(val) {
      this.refash = !this.refash;
      this.column = val;
      let sum = 325 - (val - 4);
      this.boxWidth = sum / val;
      this.boxPosition = [];
      this.boxArr = [];
      setTimeout(() => {
        this.changeBox1();
      }, 50);
    },
    /*eslint-disable*/
    handleSelect(m, n) {
      this.isClick = !this.isClick;
      if (this.isClick) {
        //点击选择起点
        this.trueClick.x = n;
        this.trueClick.y = m;
        this.lineData[m].rowData[n].isSelect = true;
        this.isUse = false;
      }
      if (!this.isClick) {
        //点击选择区域
        this.falseClick.x = n;
        this.falseClick.y = m;
        this.resetColor();
        let startX = this.trueClick.x < n ? this.trueClick.x : n;
        let startY = this.trueClick.y < m ? this.trueClick.y : m;
        let endX = this.trueClick.x > n ? this.trueClick.x : n;
        let endY = this.trueClick.y > m ? this.trueClick.y : m;
        if (this.isUse) {
          this.boxPosition.push({
            startX: this.trueClick.x,
            startY: this.trueClick.y,
            endX: this.trueClick.x,
            endY: this.trueClick.y
          });
          this.boxArr.push({
            left: this.trueClick.x,
            top: this.trueClick.y,
            endLeft: this.trueClick.x + 1,
            endTop: this.trueClick.y + 1,
            height: 0,
            width: 0,
            picURL: ''
          });
          this.lineData[this.trueClick.y].rowData[this.trueClick.x].isUse = true;
        } else {
          this.boxArr.push({
            left: this.falseClick.x - this.trueClick.x > 0 ? this.trueClick.x : this.falseClick.x,
            top: this.falseClick.y - this.trueClick.y > 0 ? this.trueClick.y : this.falseClick.y,
            endLeft: this.trueClick.x > n ? this.trueClick.x + 1 : n + 1,
            endTop: this.trueClick.y > m ? this.trueClick.y + 1 : m + 1,
            height: Math.abs(this.falseClick.y - this.trueClick.y),
            width: Math.abs(this.falseClick.x - this.trueClick.x),
            picURL: ''
          });
          this.boxPosition.push({
            startX: this.trueClick.x < n ? this.trueClick.x : n,
            startY: this.trueClick.y < m ? this.trueClick.y : m,
            endX: this.trueClick.x > n ? this.trueClick.x : n,
            endY: this.trueClick.y > m ? this.trueClick.y : m
          });
          for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
              this.lineData[y].rowData[x].isUse = true;
            }
          }

          let remArr = copy(this.boxArr);
          for (let item of remArr) {
            let top = item.top;
            let endTop = item.endTop - 1;
            let left = item.left;
            let endLeft = item.endLeft - 1;
            for (let y = top; y <= endTop; y++) {
              for (let x = left; x <= endLeft; x++) {
                this.lineData[y].rowData[x].isUse = true;
                this.refash = !this.refash;
              }
            }
          }
        }

        this.selecIndex = this.boxArr.length - 1;

        this.$emit('getBoxArr', this.boxArr[this.selecIndex], this.selecIndex);
        this.$emit('getBoxIndex', this.selecIndex);
        let bol = this.lineData
          .map(i => {
            let arr = i.rowData.every(j => {
              return j.isUse === true;
            });
            return arr;
          })
          .every(k => {
            return k === true;
          });
        this.$emit('getSelectAll', bol);
      }
      this.refash = !this.refash;
    },

    mouseMove(m, n) {
      let startX = this.trueClick.x < n ? this.trueClick.x : n;
      let startY = this.trueClick.y < m ? this.trueClick.y : m;
      let endX = this.trueClick.x > n ? this.trueClick.x : n;
      let endY = this.trueClick.y > m ? this.trueClick.y : m;
      if (this.isClick) {
        let allBol = [];
        for (let y = startY; y <= endY; y++) {
          for (let x = startX; x <= endX; x++) {
            allBol.push(this.lineData[y].rowData[x].isUse);
          }
        }
        this.isUse = allBol.some(item => {
          return item === true;
        });
        if (!this.isUse) {
          for (let i in this.lineData) {
            if (startY <= i && i <= endY) {
              for (let j in this.lineData[i].rowData) {
                if (startX <= j && j <= endX) {
                  this.lineData[i].rowData[j].isSelect = true;
                } else {
                  this.lineData[i].rowData[j].isSelect = false;
                }
              }
            } else {
              for (let j in this.lineData[i].rowData) {
                this.lineData[i].rowData[j].isSelect = false;
              }
            }
          }
        }
      }
      this.refash = !this.refash;
    },

    resetColor() {
      for (let i in this.lineData) {
        for (let j in this.lineData[i].rowData) {
          this.lineData[i].rowData[j].isSelect = false;
        }
      }
    },

    removeBox(index) {
      // this.boxArr.splice( index, 1);
      // let removeIndex = this.boxPosition.splice( index, 1 );

      let removeIndex = this.boxArr.splice(index, 1);

      this.falseClick.x = removeIndex[0].left;
      this.falseClick.y = removeIndex[0].top;
      this.trueClick.x = removeIndex[0].endLeft;
      this.trueClick.y = removeIndex[0].endTop;

      let startX = this.trueClick.x < this.falseClick.x ? this.trueClick.x : this.falseClick.x;
      let startY = this.trueClick.y < this.falseClick.y ? this.trueClick.y : this.falseClick.y;
      let endX = (this.trueClick.x > this.falseClick.x ? this.trueClick.x : this.falseClick.x) - 1;
      let endY = (this.trueClick.y > this.falseClick.y ? this.trueClick.y : this.falseClick.y) - 1;
      // let startX = this.falseClick.x;
      // let startY = this.falseClick.y;
      // let endX = this.trueClick.x-1 ;
      // let endY = this.trueClick.y -1;

      if (removeIndex) {
        for (let y = startY; y <= endY; y++) {
          for (let x = startX; x <= endX; x++) {
            this.lineData[y].rowData[x].isUse = false;
            this.refash = !this.refash;
          }
        }
      }

      // return
      let bol = this.lineData
        .map(i => {
          let arr = i.rowData.every(j => {
            return j.isUse === true;
          });
          return arr;
        })
        .every(k => {
          return k === true;
        });
      this.$emit('getSelectAll', bol);
      this.$emit('removeBoxArr', this.selecIndex);
    },

    changeBox() {
      this.lineData = [];
      for (let i = 0; i < this.row; i++) {
        this.lineData[i] = {};
        this.lineData[i].rowData = [];
        for (let j = 0; j < this.column; j++) {
          this.lineData[i].rowData[j] = {
            isSelect: false,
            isUse: false
          };
        }
      }

      let remArr = copy(this.boxArr);

      for (let item of remArr) {
        let top = item.top;
        let endTop = item.endTop - 1;
        let left = item.left;
        let endLeft = item.endLeft - 1;
        for (let y = top; y <= endTop; y++) {
          for (let x = left; x <= endLeft; x++) {
            this.lineData[y].rowData[x].isUse = true;
            this.refash = !this.refash;
          }
        }
      }
      if (!remArr.length) {
        for (let i = 0; i < this.row; i++) {
          this.lineData[i] = {};
          this.lineData[i].rowData = [];
          for (let j = 0; j < this.column; j++) {
            this.lineData[i].rowData[j] = {
              isSelect: false,
              isUse: !this.isNew
            };
          }
        }
      }
    },
    changeBox1() {
      this.lineData = [];
      for (let i = 0; i < this.row; i++) {
        this.lineData[i] = {};
        this.lineData[i].rowData = [];
        for (let j = 0; j < this.column; j++) {
          this.lineData[i].rowData[j] = {
            isSelect: false,
            isUse: false
          };
        }
      }

      let remArr = copy(this.boxArr);

      for (let item of remArr) {
        let top = item.top;
        let endTop = item.endTop - 1;
        let left = item.left;
        let endLeft = item.endLeft - 1;
        for (let y = top; y <= endTop; y++) {
          for (let x = left; x <= endLeft; x++) {
            this.lineData[y].rowData[x].isUse = true;
            this.refash = !this.refash;
          }
        }
      }
      if (!remArr.length) {
        for (let i = 0; i < this.row; i++) {
          this.lineData[i] = {};
          this.lineData[i].rowData = [];
          for (let j = 0; j < this.column; j++) {
            this.lineData[i].rowData[j] = {
              isSelect: false,
              isUse: false
            };
          }
        }
      }
    },
    selectBox(index) {
      this.selecIndex = index;
      this.$emit('getBoxArr', this.boxArr[this.selecIndex], this.selecIndex);
      this.$emit('getBoxIndex', this.selecIndex);

      let bol = this.lineData
        .map(i => {
          let arr = i.rowData.every(j => {
            return j.isUse === true;
          });
          return arr;
        })
        .every(k => {
          return k === true;
        });

      this.$emit('getSelectAll', bol);
    },
    getPic(index, picURL) {
      this.boxArr[index].picURL = picURL;
    },
    // 上传图片之前
    cubeUploadBefore(file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif') {
        this.$message.error('请上传jpg，png格式的图片');
        return false;
      }
      if (file.size > 3 * 1024 * 1024) {
        this.$message.error('图片大小请控制在3M内');
        return false;
      }
      // var that = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.onload = function(event) {
          let image = new Image();
          image.onload = function() {
            resolve();
          };
          image.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    },
    cubeUploadSuccess(response, file, fileList) {
      if (response.errorCode === 0) {
        if (this.selecIndex !== -1) {
          this.boxArr[this.selecIndex].picURL = response.result[0].qcloudImageUrl;
          this.$message.success('上传成功');
          this.refash = !this.refash;
        }
        this.$emit('getBoxArr', this.boxArr[this.selecIndex], this.selecIndex);
      } else {
        this.$message.error(response.message);
      }
    }
  },
  components: {}
};
</script>
<style>
.cube-content,
div,
.cube-item {
  box-sizing: content-box;
}
.cube-item {
  border: 1px solid #dcdfe6;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  border-left: 0;
  border-bottom: 0;
  color: #1890ff;
  cursor: pointer;
}
.cube-ul .cube-item:first-child {
  border-left: 1px solid #dcdfe6;
}
.cube-ul:last-child .cube-item {
  border-bottom: 1px solid #dcdfe6;
}
.click-box {
  position: absolute;
  background-color: #e8f7fd;
}
.upload-img {
  position: relative;
}
.img-size-text {
  width: 100%;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  line-height: 1;
  transform: translate(-50%, -50%);
  color: #909399;
}
.delete-cube-icon {
  position: absolute;
  top: -9px;
  right: -6px;
  z-index: 3;
  color: #bbb;
  background: #fff;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  display: none;
}
/*上传图片*/
.cube-content .avatar-uploader {
  /* background:#f5f5fa;*/
  margin-top: 10px;
}
.cube-content .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 270px;
}
.cube-content .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.cube-content .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 270px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.cube-content .avatar {
  width: 270px;
  height: 178px;
  display: block;
}
.cube-content .img-warm {
  margin: 20px 0;
  line-height: 16px;
  font-size: 12px;
  color: #909399;
}
</style>
