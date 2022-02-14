
<template>
  <div class="app-container">
    <div class="filter-container">
       <el-input v-model.number="listQuery.idCard" placeholder="身份证" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
       <el-input v-model.number="listQuery.author" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
       <el-input v-model.number="listQuery.position" placeholder="职位" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.gender" placeholder="性别" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="(item,index) in genders" :key="'g_' + item" :label="item" :value="index" />
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="100" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.idCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ genders[row.gender] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.atel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位" width="120" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.position }}</span>
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
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model.number="temp.idCard" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="姓名" prop="author">
          <el-input v-model="temp.author" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender" class="filter-item" placeholder="请选择">
            <el-option v-for="(item, index) in genders" :key="item" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="atel">
          <el-input v-model="temp.atel" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="职位" prop="reviewer">
          <el-input v-model="temp.position" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="入职时间" prop="buy_timestamp">
          <el-date-picker v-model="temp.buy_timestamp" type="datetime" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="离职时间" prop="buy_timestamp">
          <el-date-picker v-model="temp.buy_timestamp" type="datetime" placeholder="请选择" />
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
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
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
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        idCard: '',
        author: '',
        gender: '',
        position: '',
        status: '',
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID 升序', key: '+id' }, { label: 'ID 降序', key: '-id' }],
      unitOptions: [1, 2, 3, 4, 5, 6],
      floorsOptions: [1, 2, 3, 4, 5, 6, 7, 8 , 9, 10],
      buildingOptions: [1, 2, 3, 4, 5, 6, 7, 8 , 9, 10],
      statusOptions: ['published', 'draft', 'deleted'],
      statusOptionsTest: { published: '在职', draft: '离职', deleted: '禁用' },
      typeOptions: ['one', 'two'],
      typeOptionsTest: { one: '买断', two: '租赁' },
      genders: ['女', '男'],
      showReviewer: false,
      temp: {
        id: undefined,
        idCard: '',
        author: '',
        gender: '',
        atel: '',
        position: '',
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
        idCard: [{ required: true, message: 'idCard is required', trigger: 'blur'}],
        author: [{ required: true, message: 'author is required', trigger: 'blur' }],
        atel: [{ required: true, message: 'atel is required', trigger: 'blur' }],
        gender: [{ required: true, message: 'gender is required', trigger: 'change' }],
        position: [{ required: true, message: 'position is required', trigger: 'blur' }],
        buy_timestamp: [{ type: 'date', required: true, message: 'buy_timestamp is required', trigger: 'change' }],
        use_timestamp: [{ type: 'date', required: true, message: 'use_timestamp is required', trigger: 'change' }],
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
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        idCard: '',
        author: '',
        gender: '',
        atel: '',
        position: '',
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.createBy = this.$store.getters.name
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
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
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
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