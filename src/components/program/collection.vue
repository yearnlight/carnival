<template>
  <div class="collection">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/carnival/program/selection' }">节目管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/carnival/program/collection' }">节目征集</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="collection-content">
      <el-form ref="collectionFormRef" label-width="150px">
        <el-form-item label="是否关闭节目征集:">
          <el-radio-group v-model="collectionForm.closeState">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
          <span>（关闭节目征集后，app将会显示年会节目）</span>
        </el-form-item>
        <el-form-item label="上传节目征集海报:">
          <div v-if="!collectionForm.actUrl" class="collection-content-poster">
            <div class="collection-content-poster-add">
              <span class="icon-add" @click="goToImport()"></span>
            </div>
            <div class="collection-content-poster-label">点击添加图片</div>
          </div>
          <div v-if="collectionForm.actUrl" class="collection-content-posterExist">
            <img :src="collectionForm.actUrl">
            <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
          </div>
          <div class="collection-content-posterInfo">
            <div class="collection-content-posterInfo-operate">
              <el-button size="small" @click="goToImport()" type="primary">替换</el-button>

              <el-button size="small" @click="preview()" type="info">预览</el-button>
            </div>
            <div
              class="collection-content-posterInfo-explain"
            >图片尺寸为1125*1854像素，文件类型：jpg/jpeg/png，大小不超过2M</div>
          </div>
        </el-form-item>
        <el-form-item label>
          <el-button size="small" type="warning" @click="saveposter()">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      custom-class="importPoster"
      title="上传海报"
      :show-close="false"
      :visible.sync="isImport"
      width="600px"
    >
      <el-form ref="importform" label-width="80px">
        <el-form-item label prop>
          <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl()"
            :before-upload="beforeUpload"
            ref="imgupload"
            :limit="1"
            enctype="multipart/form-data"
            :on-error="uploadError"
            :on-success="handleAvatarSuccess"
            :auto-upload="false"
            :file-list="fileList"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">图片尺寸为1125*1854像素，文件类型：jpg/jpeg/png，大小不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isImport = false">取 消</el-button>
        <el-button size="small" type="primary" @click="importPoster('importform')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api/api";
import BigImg from "./bigImg.vue";
export default {
  components: {
    "big-img": BigImg
  },
  data() {
    return {
      showImg: false,
      imgSrc: "",
      collectionForm: {
        closeState: ""
      },
      imgInfo: {
        path: ""
      },
      file: "", //上传的文件对象
      fileList: [],
      isImport: false
    };
  },
  created() {
    this.selectionHome();
  },
  methods: {
    preview() {
      this.showImg = true;
      // 获取当前图片地址
      this.imgSrc = this.collectionForm.actUrl;
    },
    viewImg() {
      this.showImg = false;
    },
    saveposter() {
      api
        .saveposter({
          closeState: parseInt(this.collectionForm.closeState),
          url: this.imgInfo.path
        })
        .then(res => {
          if (res.code == 200) {
            this.$message.success("保存成功");
          } else {
            this.$message.success("保存失败");
          }
        });
    },
    uploadUrl() {
      return "/web/hb/actConfig/upload";
    },
    selectionHome() {
      api.selectionHome().then(res => {
        if (res.code == "200") {
          res.data = res.data || {};
          this.collectionForm = res.data;
          if (res.data.closeState == undefined) {
            this.collectionForm.closeState = "1";
          } else {
            this.collectionForm.closeState = res.data.closeState + "";
          }
          this.imgInfo.path = res.data.actUrl || ""; //默认路径
        } else {
          this.$message.error(res.message || "查询失败");
        }
      });
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    handleAvatarSuccess(res, file) {
      this.isImport = false;
      if (res.code == "200") {
        this.imgInfo = res.data[0];
        this.collectionForm.actUrl = this.imgInfo.path;
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.message || "上传失败");
      }
    },
    importPoster() {
      let _self = this;
      _self.$refs.imgupload.submit();
    },
    goToImport() {
      this.isImport = true;
      this.file = "";
      this.fileList = [];
    },
    beforeUpload(file) {
      this.file = file;
      const extension = file.name.split(".")[1] === "jpg";
      const extension1 = file.name.split(".")[1] === "jpeg";
      const extension2 = file.name.split(".")[1] === "png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!extension && !extension1 && !extension2) {
        this.$message.warning("上传模板只能是 jpg、jpeg、png格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.warning("上传模板大小不能超过 2MB!");
        return false;
      }
    }
  }
};
</script>


<style lang="less">
.collection {
  height: 100%;
  &-content {
    height: calc(100% - 62px);
    border-top: 2px solid #e7e7e7;
    background: #ffffff;
    .el-form {
      padding: 30px 50px;
    }
    .upload-replace {
      display: inline-block;
    }
    &-posterExist {
      height: 206px;
      width: 125px;
      float: left;
      img {
        height: 100%;
        width: 100%;
      }
    }
    &-poster {
      height: 206px;
      width: 125px;
      background-color: #f2f2f2;
      float: left;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      &-add {
        font-size: 32px;
        cursor: pointer;
        color: #a3b0c3;
      }
      &-label {
        color: #666666;
      }
    }
    &-posterInfo {
      height: 206px;
      width: 200px;
      float: left;
      padding: 0 20px;
      &-explain {
        line-height: 20px;
        padding: 20px 0;
      }
    }
  }
}
</style>
