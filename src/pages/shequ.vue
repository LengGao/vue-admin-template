
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="业主" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
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
      <el-table-column label="ID" prop="sid" sortable="custom" align="center" width="100" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.sid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ typeOptionsTest[row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业主" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业主联系方式" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="200" align="center">
        <template slot-scope="{row,$index}">
          <div style="width: 100%" @click="handleShowRemark(row,$index)">
            <span>{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.buy_timestamp | parseTime('{y}-{m}-{d}') }}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 600px; margin-left:50px;">
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="item" :label="typeOptionsTest[item]" :value="item" />
          </el-select>
        </el-form-item>
           <el-form-item label="业主" prop="uid">
          <el-select v-model="temp.uid" class="filter-item" placeholder="请选择">
            <el-option v-for="item in users" :key="item.uid" :value="item.uid">
              {{item.name}}-{{item.IDcard}} {{item.tel}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="buy_timestamp">
          <el-date-picker v-model="temp.buy_timestamp" type="date" value-format="yyyy-MM-dd" placeholder="请选择" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="statusOptionsTest[item]" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="temp.remark" :autosize="{ minRows: 10, maxRows: 20 }" type="textarea" placeholder="Please input" />
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

    <el-dialog title="详情" :visible.sync="showRemark" @closed="showRemark = false">
      <el-form ref="dataForm" :model="detailInfo" label-position="right" label-width="120px" style="margin-right: 50px;">
        <el-form-item label="标题">
          <el-input v-model="detailInfo.title" readonly />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="detailInfo.remark" type="textarea" :autosize="{ minRows: 10, maxRows: 20 }" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRemark = false">
          关闭
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
import { all } from '@/api/user'
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
  name: 'SheQu',
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
        source: 'shequ',
        name: undefined,
        // title: undefined,
        type: undefined,
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
      statusOptionsTest: { published: '已处理', draft: '未处理', deleted: '暂不处理' },
      typeOptions: ['one', 'two'],
      typeOptionsTest: { one: '维修', two: '投诉' },
      showReviewer: false,
      showRemark: false,
      detailInfo: {title: '', remark: ''},
      users: [],
      temp: {
        source: 'shequ',
        id: undefined,
        // unti: '',
        // building: '',
        type: '',
        name: '',
        tei: '',
        buy_timestamp: '',
        title: '',
        remark: '',
        status: '',
        uid: ''
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
        // unti: [{ type: 'number', required: true, message: 'unti is required', trigger: 'change' }],
        // building: [{ type: 'number', required: true, message: 'building is required', trigger: 'change' }],
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        tel: [{ required: true, message: 'atel is required', trigger: 'blur' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        status: [{ required: true, message: 'status is required', trigger: 'change' }],
        uid: [{ required: true, message: 'status is required', trigger: 'change' }],
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  beforeMount() {
    this.getALL()
  },
  methods: {
   getALL() {
     let t = this.$store.getters.type === 'one' ?  true : false,
         u = this.$store.getters.token
      all().then(res => {
        if (t) {
          this.users = res.data.filter(item => {
            return item.uid === parseInt(u)
          })
        } else {
          this.users = res.data 
        }
      }).catch(e => {
        this.$message({
          message: '获取用户数据失败',
          type: 'error',
        })
      })
    },
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
        source: 'shequ',
        id: undefined,
        type: '',
        name: '',
        tei: '',
        buy_timestamp: '',
        title: '',
        remark: '',
        status: '',
        uid: ''
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
          this.temp.source = 'shequ'
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
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleShowRemark(row) {
      const { title, remark } = row
      this.detailInfo = {title, remark}
      this.showRemark = true    
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          tempData.source = 'shequ'
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
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
      let data = {id: row.sid, source: 'shequ'}
      this.list.splice(index, 1)
      deleteArticle(data).then(() =>{
        this.$notify({
          
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
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