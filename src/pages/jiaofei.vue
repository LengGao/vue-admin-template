<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="业主"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item"
          :label="statusOptionsTest[item]"
          :value="item"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        style="width: 140px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
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
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="jid" sortable="custom" align="center" width="100" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.jid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单元" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.unti }}</span>
        </template>
      </el-table-column>
      <el-table-column label="楼栋" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.building }}</span>
        </template>
      </el-table-column>
      <el-table-column label="楼层" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.floors }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门牌号" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.house }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业主" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物业费" width="150" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.wuye_charge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="燃气费" width="150" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ranqi_charge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电费" width="150" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.electric_charge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="水费" width="150" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.water_charge }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="120">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ statusOptionsTest[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="width: 600px; margin-left: 50px"
      >
        <el-form-item label="房屋" prop="fid">
          <el-select v-model="temp.fid" class="filter-item" placeholder="请选择">
            <el-option v-for="item in roons" :key="item.fid" :value="item.fid">
              {{item.unti}}单元{{item.building}}楼{{item.floors}}层{{item.house}}号
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业主" prop="uid">
          <el-select v-model="temp.uid" class="filter-item" placeholder="请选择">
            <el-option v-for="item in users" :key="item.uid" :value="item.uid">
              {{item.name}}-{{item.IDcard}}-{{item.tel}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物业费" prop="name">
          <el-input v-model="temp.wuye_charge" placeholder="请输入" />
        </el-form-item>
      <el-form-item label="上传缴费凭证" prop="wuye_pay_charge">
        <el-upload class="avatar-uploader" action="/api/upload" list-type="picture-card"
            name="wuye_pay_charge" multiple :show-file-list="false"
            :limit="1" :headers="{ enctype: 'multipart/form-data' }" 
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
        <el-image v-if="temp.wuye_pay_charge" class="avatar" fit="fill" :src="temp.wuye_pay_charge"></el-image>
        <!-- <el-image v-else class="avatar" fit="fill" :src="defaultAvator"></el-image> -->
        </el-upload>
      </el-form-item>
        <el-form-item label="燃气费" prop="name">
          <el-input v-model="temp.ranqi_charge" placeholder="请输入" />
        </el-form-item>
      <el-form-item label="上传缴费凭证" prop="ranqi_pay_charge">
        <el-upload class="avatar-uploader" action="/api/upload" list-type="picture-card"
            name="ranqi_pay_charge" multiple :show-file-list="false"
            :limit="1" :headers="{ enctype: 'multipart/form-data' }" 
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
        <el-image v-if="temp.ranqi_pay_charge" class="avatar" fit="fill" :src="temp.ranqi_pay_charge"></el-image>
        <!-- <el-image v-else class="avatar" fit="fill" :src="defaultAvator"></el-image> -->
        </el-upload>
      </el-form-item>
        <el-form-item label="电费" prop="name">
          <el-input v-model="temp.electric_charge" placeholder="请输入" />
        </el-form-item>
      <el-form-item label="上传缴费凭证" prop="electric_pay_charge">
        <el-upload class="avatar-uploader" action="/api/upload" list-type="picture-card"
            name="electric_pay_charge" multiple :show-file-list="false"
            :limit="1" :headers="{ enctype: 'multipart/form-data' }" 
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
        <el-image v-if="temp.electric_pay_charge" class="avatar" fit="fill" :src="temp.electric_pay_charge"></el-image>
        <!-- <el-image v-else class="avatar" fit="fill" :src="defaultAvator"></el-image> -->
        </el-upload>
      </el-form-item>
        <el-form-item label="水费" prop="name">
          <el-input v-model="temp.water_charge" placeholder="请输入" />
        </el-form-item>
      <el-form-item label="上传缴费凭证" prop="water_pay_charge">
        <el-upload class="avatar-uploader" action="/api/upload" list-type="picture-card"
            name="water_pay_charge" multiple :show-file-list="false"
            :limit="1" :headers="{ enctype: 'multipart/form-data' }" 
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
        <el-image v-if="temp.water_pay_charge" class="avatar" fit="fill" :src="temp.water_pay_charge"></el-image>
        <!-- <el-image v-else class="avatar" fit="fill" :src="defaultAvator"></el-image> -->
        </el-upload>
      </el-form-item>
        <el-form-item label="状态" prop="status"  :disabled="power === 'one'">
          <el-select
            v-model="temp.status"
            class="filter-item"
            placeholder="请选择"
            :disabled="power === 'one'"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="statusOptionsTest[item]"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle,
  deleteArticle
} from "@/api/article";
import { all, rAll } from '@/api/user'
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "JaoFei",
  components: { Pagination, ImageCropper, PanThumb },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      defaultAvator: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
      listQuery: {
        page: 1,
        limit: 20,
        source: 'jiaofei',
        name: '',
        status: "",
        sort: "+id",
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID 升序", key: "+id" },
        { label: "ID 降序", key: "-id" },
      ],
      unitOptions: [1, 2, 3, 4, 5, 6],
      floorsOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      buildingOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      statusOptions: ["published", "draft", "deleted"],
      statusOptionsTest: {
        published: "已处理",
        draft: "未处理",
        deleted: "暂不处理",
      },
      typeOptions: ["one", "two"],
      typeOptionsTest: { one: "维修", two: "投诉" },
      showReviewer: false,
      showRemark: false,
      detailInfo: { title: "", remark: "" },
      power: '',
      roons: [],
      users: [],
      temp: {
        source: 'jiaofei',
        jid: undefined,
        fid: undefined,
        unti: "",
        building: "",
        floors: "",
        house: "",
        uid: "",
        name: "",
        tel: "",
        wuye_charge: "",
        wuye_pay_charge: '',
        ranqi_charge: "",
        ranqi_pay_charge: '',
        electric_charge: "",
        electric_pay_charge: '',
        water_charge: "",
        water_pay_charge: '',
        status: "draft",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        uid: [
          {
            required: true,
            message: "uid is required",
            trigger: "blur",
          }
        ],
        fid: [
          {
            required: true,
            message: "fid is required",
            trigger: "blur",
          }
        ],
        wuye_charge: [
          {
            required: true,
            message: "wuye_charge is required",
            trigger: "blur",
          },
        ],
        ranqi_charge: [
          {
            required: true,
            message: "ranqi_charge is required",
            trigger: "blur",
          },
        ],
        electric_charge: [
          {
            required: true,
            message: "electric_charge is required",
            trigger: "blur",
          },
        ],
        water_change: [
          {
            required: true,
            message: "water_change is required",
            trigger: "blur",
          },
        ],
        // status: [
        //   { required: true, message: "status is required", trigger: "change" },
        // ],
      },
      downloadLoading: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      previewImage: []
    };
  },
  created() {
    this.getList();
    this.power =  this.$store.getters.type
  },
  beforeMount() {
    this.getALL()
    this.getRall()
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
    getRall() {
     let t = this.$store.getters.type === 'one' ? true : false,
         u = this.$store.getters.token
     rAll().then(res => {
        if (t) {
          this.roons = res.data.filter(item => {
            return item.uid === parseInt(u)
          })
        } else {
          this.roons = res.data
        }
      }).catch(e => {
        this.$message({
          message: '获取用户数据失败',
          type: 'error',
        })
      })
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success",
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        source: 'jiaofei',
        jid: undefined,
        fid: undefined,
        unti: "",
        building: "",
        floors: "",
        house: "",
        uid: "",
        name: "",
        tel: "",
        wuye_charge: "",
        wuye_pay_charge: '',
        ranqi_charge: "",
        ranqi_pay_charge: '',
        electric_charge: "",
        electric_pay_charge: '',
        water_charge: "",
        water_pay_charge: '',
        status: "draft",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.createBy = this.$store.getters.name;
          this.temp.source = 'jiaofei'
          createArticle(this.temp).then(() => {
            // this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "T添加成功",
              type: "success",
              duration: 2000,
            });
            this.$nextTick(() => {
              this.getList()
            })
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleShowRemark(row) {
      const { title, remark } = row;
      this.detailInfo = { title, remark };
      this.showRemark = true;
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          // tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          tempData.source = 'jiaofei'
          // tempData.status = 'published'
          // if (tempData.buy_timestamp) {
          //   tempData.buy_timestamp = parseTime(tempData.buy_timestamp)
          // } else if (tempData.use_timestamp) {
          //   tempData.buy_timestamp = parseTime(tempData.use_timestamp)
          // }
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "更行成功",
              type: "success",
              duration: 2000,
            });
            this.$nextTick(() => {
              this.getList()
            })
          });
        }
      });
    },
    handleDelete(row, index) {
      let data = {id: row.jid, source: 'jiaofei'}
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
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
    beforeAvatarUpload(file) {
      // console.log("handleAvatarSuccess", file);
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
      console.log("handleAvatarSuccess", file);
      this.temp[file.data[0].fieldname] = file.data[0].url;
    },
    handlePreview(file) {
      console.log("handlePreview",file);
    },
    handleError() {
      this.$message({
        message: "上传失败",
        type: "error"
      })
    }
  },
};
</script>

<style scoped>
  .avatar {
    position: relative;
    top: 0;
    width: 140px;
    height: 150px;
  }
</style>