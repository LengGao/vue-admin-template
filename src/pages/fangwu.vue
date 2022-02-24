<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="业主" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="temp.unti" class="filter-item" placeholder="单元">
        <el-option v-for="item in unitOptions" :key="'u_' + item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="类型" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in typeOptions" :key="'t_' + item" :label="typeOptionsTest[item]" :value="item" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="'s_' + item" :label="statusOptionsTest[item]" :value="item" />
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
      ref="dataTable"
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="fid" sortable="custom" align="center" width="100" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.fid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单元号" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.unti }}</span>
        </template>
      </el-table-column>
      <el-table-column label="楼栋号" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.building }}</span>
        </template>
      </el-table-column>
      <el-table-column label="楼层数" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.floors }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门牌号" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.house }}</span>
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
        <el-form-item label="单元号" prop="unti">
          <el-select v-model="temp.unti" class="filter-item" placeholder="请选择">
            <el-option v-for="item in unitOptions" :key="'u_' + item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋号" prop="building">
          <el-select v-model="temp.building" class="filter-item" placeholder="请选择">
            <el-option v-for="item in buildingOptions" :key="'b_' + item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="楼层数" prop="floors">
          <el-select v-model="temp.floors" class="filter-item" placeholder="请选择">
            <el-option v-for="item in floorsOptions" :key="'f_' + item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号" prop="house">
          <el-input v-model.number="temp.house" class="filter-item" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="'t_' + item" :label="typeOptionsTest[item]" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="业主" prop="uid">
          <el-select v-model="temp.uid" class="filter-item" placeholder="请选择">
            <el-option v-for="item in users" :key="item.uid" :value="item.uid">
              {{item.name}}-{{item.IDcard}} {{item.tel}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="'s_' + item" :label="statusOptionsTest[item]" :value="item" />
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
import { fetchList, fetchPv, createArticle, updateArticle, deleteArticle} from '@/api/article'
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
  name: 'FangWu',
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
        source: 'fangwu',
        name: '',
        unti: '',
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
      statusOptionsTest: { published: '已使用', draft: '未使用', deleted: '禁用' },
      typeOptions: ['one', 'two'],
      typeOptionsTest: { one: '住宅', two: '店铺' },
      showReviewer: false,
      users: [],
      temp: {
        source: 'fangwu',
        fid: undefined,
        unti: '',
        building: '',
        floors: '',
        house: '',
        type: '',
        status: 'draft',
        uid: undefined
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
        unti: [{ type: 'number', required: true, message: 'unti is required', trigger: 'change' }],
        building: [{ type: 'number', required: true, message: 'building is required', trigger: 'change' }],
        floors: [{ type: 'number', required: true, message: 'floors is required', trigger: 'change'}],
        house:  [{ type: 'number', message: 'house is required', trigger: 'change' }],
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        uid: [{ required: true, message: ' is required', trigger: 'change' }],
        tel: [{ required: true, message: 'atel is required', trigger: 'change' }],
        status: [{ required: true, message: 'status is required', trigger: 'change' }]
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
        message: '更新成功',
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
        source: 'fangwu',
        fid: undefined,
        unti: '',
        building: '',
        floors: '',
        house: '',
        type: '',
        status: 'draft',
        uid: undefined
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
          this.temp.createBy = this.$store.getters.name
          createArticle(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              message: '添加成功',
              type: 'success',
              duration: 2000,
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
      this.temp.source = 'fangwu',
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
          if (tempData.buy_timestamp) {
            tempData.buy_timestamp = parseTime(tempData.buy_timestamp)
          } else if (tempData.use_timestamp) {
            tempData.buy_timestamp = parseTime(tempData.use_timestamp)
          }
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              message: '更行成功',
              type: 'success',
              duration: 2000,
            })
            this.$nextTick(() => {
              this.getList()
            })
            // setTimeout(() => {
            //     console.log("get");
            //     this.getList()
            //   }, 0)
          })
        }
      })
    },
    handleDelete(row, index) {
      let data = {id: row.fid, source: 'fangwu'}
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
