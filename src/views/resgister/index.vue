<template>
    <div>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="身份证" prop="IDcard">
          <el-input v-model.number="temp.IDcard" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender" class="filter-item" placeholder="请选择">
            <el-option v-for="(item, index) in genders" :key="item" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="'t_' + item" :label="typeOptionsTest[item]" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="tel">
          <el-input v-model="temp.tel" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="temp.position" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="薪资" prop="pay_charge">
          <el-input v-model.number="temp.pay_charge" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="入职时间" prop="buy_timestamp">
          <el-date-picker v-model="temp.buy_timestamp" type="date" value-format="yyyy-MM-dd" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="离职时间" prop="use_timestamp">
          <el-date-picker v-model="temp.use_timestamp" type="date" value-format="yyyy-MM-dd" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model  ="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="statusOptionsTest[item]" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确定
        </el-button>
      </div>
    </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle, deleteArticle } from '@/api/article'
import { parseTime } from '@/utils'

export default {
  name: 'resgister',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      typeOptions: ['one', 'two'],
      typeOptionsTest: { one: '业主', two: '物业' },      
      unitOptions: [1, 2, 3, 4, 5, 6],
      floorsOptions: [1, 2, 3, 4, 5, 6, 7, 8 , 9, 10],
      buildingOptions: [1, 2, 3, 4, 5, 6, 7, 8 , 9, 10],
      statusOptions: ['published', 'draft', 'deleted'],
      statusOptionsTest: { published: '在职', draft: '离职', deleted: '禁用' },
      typeOptions: ['one', 'two'],
      typeOptionsTest: { one: '业主', two: '物业' },
      genders: ['女', '男'],
      showReviewer: false,
      temp: {
        source: 'yonghu',
        uid: undefined,
        IDcard: '',
        type: '',
        name: '',
        password: '',
        gender: '',
        tel: '',
        position: '',
        pay_charge: '',
        buy_timestamp: '',
        use_timestamp: '',
        status: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',   
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [], 
      rules: {        
        type: [{ required: true, message: 'gender is required', trigger: 'change' }],
        IDcard: [{ required: true, message: 'IDcard is required', trigger: 'blur'}],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        password: [{ required: true, message: 'password is required', trigger: 'blur' }],
        tel: [{ required: true, message: 'tel is required', trigger: 'blur' }],
        gender: [{ required: true, message: 'gender is required', trigger: 'change' }],
        // position: [{ required: true, message: 'position is required', trigger: 'blur' }],
        // buy_timestamp: [{ type: 'date', message: 'buy_timestamp is required', trigger: 'change' }],
        // use_timestamp: [{ type: 'date', message: 'use_timestamp is required', trigger: 'change' }],
        status: [{ required: true, message: 'status is required', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    console.log("jiaomi");
  },
  methods: {
    resetTemp() {
      this.temp = {
        source: 'yonghu',
        uid: undefined,
        name: '',
        password: '',
        type: '',
        tel: '',
        gender: '',
        IDcard: '',
        position: '',
        pay_charge: '',
        buy_timestamp: '',
        use_timestamp: '',
        status: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.uid = parseInt(Math.random() * 100) + 1024 // mock a uid
          this.temp.createBy = this.$store.getters.name
          createArticle(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              
              message: 'T添加成功',
              type: 'success',
              duration: 2000
            })
            this.$nextTick(() => {
              this.getList()
            })
          })
        }
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
  }
}
</script>

<style scoped>

</style>