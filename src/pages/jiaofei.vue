<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.author"
        placeholder="业主"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.reviewer"
        placeholder="负责人"
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
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="100"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单元号" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.unit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="楼栋号" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.building }}</span>
        </template>
      </el-table-column>
      <el-table-column label="楼层数" width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.floors }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门牌号" width="100" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.house }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业主" width="120" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="150" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.atel }}</span>
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
          <span>{{ row.water_change }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="120" align="center">
        <template slot-scope="{ row }">
          <span style="color: red">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.buy_timestamp | parseTime("{y}-{m}-{d} {h}:{i}")
          }}</span>
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
        <el-form-item label="单元号" prop="unit">
          <el-select
            v-model="temp.unit"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in unitOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋号" prop="building">
          <el-select
            v-model="temp.building"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in buildingOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="楼层数" prop="floors">
          <el-select
            v-model="temp.floors"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in floorsOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号" prop="house">
          <el-input
            v-model.number="temp.house"
            class="filter-item"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="业主" prop="author">
          <el-input v-model="temp.author" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="业主联系方式" prop="atel">
          <el-input v-model="temp.atel" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="负责人" prop="reviewer">
          <el-input v-model="temp.reviewer" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="物业费" prop="author">
          <el-input v-model="temp.wuye_charge" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="燃气费" prop="author">
          <el-input v-model="temp.ranqi_charge" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="电费" prop="author">
          <el-input v-model="temp.electric_charge" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="水费" prop="author">
          <el-input v-model="temp.weter_charge" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="创建时间" prop="buy_timestamp">
          <el-date-picker
            v-model="temp.buy_timestamp"
            type="datetime"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="temp.status"
            class="filter-item"
            placeholder="请选择"
            disabled
          >
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="statusOptionsTest[item]"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'update'" label="上传缴费凭证">
          <div class="image-box">
            <el-image
              v-if="temp.status == 'published'"
              style="width: 100px; height: 100px"
              :preview-src-list="previewImage"
              :src="temp.pay_charge"
            ></el-image>
          </div>
          <el-button type="primary" icon="el-icon-upload" @click="uploadImage">上传凭证</el-button>
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

    <image-cropper
      v-show="imagecropperShow"
      :key="'i_' + imagecropperKey"
      :width="300"
      :height="300"
      lang-type="en"
      :withCredentials="true"
      url="http://192.168.0.100:9527/public/"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
  </div>
</template>

<script>
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle,
} from "@/api/article";
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
      listQuery: {
        page: 1,
        limit: 20,
        author: undefined,
        reviewer: undefined,
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
      temp: {
        id: undefined,
        unit: "",
        building: "",
        floors: "",
        house: "",
        uid: "",
        author: "",
        atel: "",
        reviewer: "",
        wuye_charge: "",
        ranqi_charge: "",
        electric_charge: "",
        water_change: "",
        buy_timestamp: "",
        pay_charge: "",
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
        unit: [
          {
            type: "number",
            required: true,
            message: "unit is required",
            trigger: "change",
          },
        ],
        building: [
          {
            type: "number",
            required: true,
            message: "building is required",
            trigger: "change",
          },
        ],
        floors: [
          {
            type: "number",
            required: true,
            message: "floors is required",
            trigger: "change",
          },
        ],
        house: [
          { type: "number", message: "house is required", trigger: "change" },
        ],
        author: [
          { required: true, message: "author is required", trigger: "blur" },
        ],
        atel: [
          { required: true, message: "atel is required", trigger: "blur" },
        ],
        reviewer: [
          { required: true, message: "reviewer is required", trigger: "blur" },
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
        buy_timestamp: [
          {
            type: "date",
            required: true,
            message: "buy_timestamp is required",
            trigger: "change",
          },
        ],
        status: [
          { required: true, message: "status is required", trigger: "change" },
        ],
      },
      downloadLoading: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      previewImage: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
        message: "操作Success",
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
        id: undefined,
        unit: "",
        building: "",
        floors: "",
        house: "",
        uid: "",
        author: "",
        atel: "",
        reviewer: "",
        wuye_charge: "",
        ranqi_charge: "",
        electric_charge: "",
        water_change: "",
        buy_timestamp: "",
        pay_charge: "",
        status: "",
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
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      console.log(this.temp);
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
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000,
      });
      this.list.splice(index, 1);
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
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.temp.image = resData.files.avatar;
      this.temp.status = "published";
      this.previewImage = [resData.files.avatar]
    },
    close() {
      this.imagecropperShow = false;
    },
    uploadImage() {
      this.imagecropperShow = true;
    },
  },
};
</script>