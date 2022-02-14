<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="temp" label-position="left" label-width="150px" style="width: 400px; margin-left:50px;">
      <div class="avatar">
        <pan-thumb :image="temp.avatar" />
      </div>
      <el-form-item label="头像">
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">
          修改头像
        </el-button>
      </el-form-item>
      <el-form-item label="姓名" prop="type">
        <el-input v-model="temp.name" placeholder="请输入" readonly />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="temp.gender" class="filter-item" placeholder="请输入" readonly>
          <el-option v-for="(item,index) in genders" :key="'g_' + item" :label="item" :value="index" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input v-model="temp.tel" placeholder="请输入" readonly />
      </el-form-item>      
      <el-form-item v-if="temp.roles[0] === 'employer'" label="职位">
        <el-input v-model="temp.introduction" placeholder="请输入" readonly />
      </el-form-item>
    </el-form>

    <image-cropper v-show="imagecropperShow" :key="imagecropperKey"
      :width="300" :height="300" lang-type="en" url="https://httpbin.org/post"
      @close="close" @crop-upload-success="cropSuccess" />

  </div>
</template>

<script>
import { getInfo } from "@/api/user"
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'GeRen',
  components: { ImageCropper, PanThumb },
  data() {
    return {
      genders: ['女', '男'],
      role: '',
      imagecropperShow: false,
      imagecropperKey: 0,
      temp: {
        token: '',
        name: '',
        avatar: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
        gender: '',
        tel: '',
        roles: [''],
        introduction: ''
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
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>
<style scoped>
  .avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
  .avatar {
    margin-bottom: 5px;
  }
  .up_btn {
    position: absolute;
    bottom: 15px;
    margin-left: 40px;
  }
</style>