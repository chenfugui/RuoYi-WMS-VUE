<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="产品" prop="proId">
        <el-select v-model="queryParams.proId" placeholder="请选择产品">
          <el-option v-for="pro in erpProList" :key="pro.proId" :label="pro.proName" :value="pro.proId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工序" prop="stepId">
        <el-select v-model="queryParams.stepId" placeholder="请选择工序">
          <el-option v-for="process in erpProProcessList" :key="process.id" :label="process.stepName"
            :value="process.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="尺码" prop="sizeId">
        <el-select v-model="queryParams.sizeId" placeholder="请选择尺码">
          <el-option v-for="proSize in erpProSizeList" :key="proSize.id" :label="proSize.sizeName"
            :value="proSize.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位ID" prop="empId">
        <el-input v-model.trim="queryParams.empId" placeholder="请输入单位ID" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工价" prop="price">
        <el-input v-model.trim="queryParams.price" placeholder="请输入工价" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="数据状态" prop="delFlag">
        <el-input v-model.trim="queryParams.delFlag" placeholder="请输入" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['base:erpProPrice:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['base:erpProPrice:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['base:erpProPrice:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['base:erpProPrice:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ErpProPriceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="产品ID" align="center" prop="proId" v-if="columns[0].visible" />
      <el-table-column label="工序ID" align="center" prop="stepId" v-if="columns[1].visible" />
      <el-table-column label="尺码ID" align="center" prop="sizeId" v-if="columns[2].visible" />
      <el-table-column label="单位ID" align="center" prop="empId" v-if="columns[3].visible" />
      <el-table-column label="工价" align="center" prop="price" v-if="columns[4].visible" />
      <!-- <el-table-column label="数据状态" align="center" prop="delFlag" v-if="columns[5].visible" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['base:erpProPrice:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['base:erpProPrice:remove']">删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改服装工价信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="产品" prop="proId">
          <el-select v-model="form.proId" placeholder="请选择产品">
            <el-option v-for="pro in erpProList" :key="pro.proId" :label="pro.proName" :value="pro.proId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工序" prop="stepId">
          <el-select v-model="form.stepId" placeholder="请选择工序">
            <el-option v-for="process in erpProProcessList" :key="process.id" :label="process.stepName"
              :value="process.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="尺码" prop="sizeId">
          <el-select v-model="form.sizeId" placeholder="请选择尺码">
            <el-option v-for="proSize in erpProSizeList" :key="proSize.id" :label="proSize.sizeName"
              :value="proSize.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位ID" prop="empId">
          <el-input v-model.trim="form.empId" placeholder="请输入EMP_ID" />
        </el-form-item>
        <el-form-item label="工价" prop="price">
          <el-input v-model.trim="form.price" placeholder="请输入PRICE" />
        </el-form-item>
        <!-- <el-form-item label="数据状态" prop="delFlag">
          <el-input v-model.trim="form.dr" placeholder="请输入" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listErpProPrice, getErpProPrice, delErpProPrice, addErpProPrice, updateErpProPrice, exportErpProPrice } from "@/api/base/erpProPrice";
import { listErpPro } from "@/api/base/erpPro";
import { listErpProProcess } from "@/api/base/erpProProcess";
import { listErpProSize } from "@/api/base/erpProSize";
export default {
  name: "ErpProPrice",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 服装工价信息表格数据
      ErpProPriceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        proId: null,
        stepId: null,
        sizeId: null,
        empId: null,
        price: null,
        delFlag: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
        { key: 1, label: "产品ID", visible: true },
        { key: 2, label: "工序ID", visible: true },
        { key: 3, label: "尺码ID", visible: true },
        { key: 4, label: "单位ID", visible: true },
        { key: 5, label: "工价", visible: true },
        // { key: 10, label: "delFlag", visible: false },
      ],
      erpProList: [],
      erpProProcessList: [],
      erpProSizeList: [],
    };
  },
  created() {
    this.getList();
    this.getProductList();
    this.getProductSizeList();
    this.getProductProcessList();
  },
  methods: {
    /** 查询服装工价信息列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listErpProPrice(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ErpProPriceList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    getProductList() {
      const pageReq = { page: 0, size: 999999 };
      const proQuery = {};
      listErpPro(proQuery, pageReq).then(response => {
        const { content, totalElements } = response
        this.erpProList = content;
      });
    },
    getProductProcessList() {
      const pageReq = { page: 0, size: 999999 };
      const proQuery = {};
      listErpProProcess(proQuery, pageReq).then(response => {
        const { content, totalElements } = response
        this.erpProProcessList = content;
      });
    },
    getProductSizeList() {
      const pageReq = { page: 0, size: 999999 };
      const proQuery = {};
      listErpProSize(proQuery, pageReq).then(response => {
        const { content, totalElements } = response
        this.erpProSizeList = content;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        proId: null,
        stepId: null,
        sizeId: null,
        empId: null,
        price: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.getProductList();
      this.getProductProcessList();
      this.getProductSizeList();
      this.reset();
      this.open = true;
      this.title = "添加服装工价信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getErpProPrice(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改服装工价信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateErpProPrice(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addErpProPrice(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除服装工价信息编号为"' + ids + '"的数据项？').then(function () {
        return delErpProPrice(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有服装工价信息数据项？').then(() => {
        this.exportLoading = true;
        return exportErpProPrice(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
