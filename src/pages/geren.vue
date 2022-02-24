<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="temp" label-position="left" label-width="150px" style="width: 400px; margin-left:50px;">
      <el-form-item label="头像" prop="avatar">
        <el-upload class="avatar-uploader" action="/api/upload" list-type="picture-card"
            :file-list="fileList" multiple :show-file-list="false"
            :headers="{ enctype: 'multipart/form-data'}" 
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
        <el-image v-if="temp.avatar" class="avatar" fit="fill" :src="temp.avatar"></el-image>
        <el-image v-else class="avatar" fit="fill" :src="defaultAvator"></el-image>
        </el-upload>
      </el-form-item>
      <el-form-item label="姓名" prop="type" style="margin-top: 25px;">
        <el-input v-model="temp.name" placeholder="请输入" readonly />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select :value="genders[temp.gender]" class="filter-item" placeholder="请输入">
          <el-option v-for="(item,index) in genders" :key="'g_item' + item" :label="item" :value="index" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="temp.tel" placeholder="请输入" />
      </el-form-item>      
      <el-form-item v-if="temp.types === 'two'" label="职位">
        <el-input v-model="temp.position" readonly />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getInfo, updateArticle } from "@/api/user"
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { parseTime } from '@/utils'

export default {
  name: 'GeRen',
  components: { ImageCropper, PanThumb },
  data() {
    return {
      genders: ['女', '男'],
      type: {},
      role: '',
      fileList: [],
      defaultAvator: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
      temp: {
        token: '',
        type: '',
        name: '',
        gender: '',
        tel: '',
        position: '',
        avatar: '',
        pay_charge: 0.00,
        buy_timestamp: '',
        use_timestamp: '',
        status: ''
      },
    }
  },
  created() {
    const { token } = this.$store.getters
    getInfo(token).then(response => {
      this.temp = response.data
    })
  },
  methods: {
    genderChange(v) {
      this.temp.gender = v
    },
    submitForm() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          // tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          if (tempData.buy_timestamp) {
            tempData.buy_timestamp = parseTime(tempData.buy_timestamp)
          } else if (tempData.use_timestamp) {
            tempData.buy_timestamp = parseTime(tempData.use_timestamp)
          }
          updateArticle(tempData).then(() => {
            this.$notify({
              title: "Success",
              message: "更行成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    beforeAvatarUpload(file) {
      const types = ['image/jpeg', 'image/jpg', 'image/jpng', 'image/png', 'image/gif']
      const isJPG = types.includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是jpg、jpeg、jpng、png、gif 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(file) {
      console.log("handleAvatarSuccess",file);
      this.temp.avatar = file.data[0].url;
    },
    handlePreview(file) {
      console.log("handlePreview",file);
    }
  }
}
</script>
<style scoped>
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar  {
    width: 140px;
    height: 150px;
    display: inline-block;
  }
</style>