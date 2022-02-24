
<template>
  <div class="app-container">
    <div class="filter-container">
       <!-- <el-input v-model.number="listQuery.IDcard" placeholder="身份证" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
       <el-input v-model.number="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="类型" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in typeOptions" :key="item" :label="typeOptionsTest[item]" :value="item" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item" :label="statusOptionsTest[item]" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="uid" sortable="custom" align="center" width="100" :class-name="getSortClass('uid')">
        <template slot-scope="{row}">
          <span>{{ row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证" prop="IDcard" idth="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.IDcard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ genders[row.gender] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位" width="120" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.position }}</span>
        </template>
      </el-table-column>
     <el-table-column label="薪资" width="120" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.pay_charge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入职时间" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.buy_timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="离职时间" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.use_timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ statusOptionsTest[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 400px; margin-left:50px;">
        <!-- <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" placeholder="类型" style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in typeOptions" :key="item" :label="typeOptionsTest[item]" :value="item" />
          </el-select>
        </el-form-item> -->
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
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="statusOptionsTest[item]" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle, deleteArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'YonHu',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      typeOptions: ['one', 'two'],
      typeOptionsTest: { one: '业主', two: '物业' },
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        source: 'yonghu',
        // IDcard: '',
        name: '',
        type: '',
        // gender: '',
        status: '',
        sort: '+uid'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID 升序', key: '+uid' }, { label: 'ID 降序', key: '-uid' }],
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'uid') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+uid'
      } else {
        this.listQuery.sort = '-uid'
      }
      this.handleFilter()
    },
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
    handleUpdate(row) {
      row.source = 'yonghu'
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          tempData.source = 'yonghu'
          if (tempData.buy_timestamp) {
            tempData.buy_timestamp = parseTime(tempData.buy_timestamp)
          } else if (tempData.use_timestamp) {
            tempData.buy_timestamp = parseTime(tempData.use_timestamp)
          }
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.uid === this.temp.uid)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              
              message: '更行成功',
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
    handleDelete(row, index) {
      let data = {id: row.uid, source: 'yonghu'}
      this.list.splice(index, 1)
      let cu = this.$store.getters.tokens
      let loginout = parseInt(cu) === parseInt(row.id) ? true : false
      deleteArticle(data).then(() =>{
        this.$notify({
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        if (loginout) {
          this.$store.dispatch('user/logout').then(() => {
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          })
        }
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>