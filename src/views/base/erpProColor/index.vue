<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="产品" prop="proId">
        <el-select v-model="queryParams.proId" placeholder="请选择产品">
          <el-option v-for="pro in erpProList" :key="pro.proId" :label="pro.proName" :value="pro.proId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="尺寸编码" prop="colorCode">
        <el-input v-model.trim="queryParams.colorCode" placeholder="请输入尺寸编码" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="尺寸名称" prop="colorName">
        <el-input v-model.trim="queryParams.colorName" placeholder="请输入尺寸名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['base:erpProColor:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['base:erpProColor:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['base:erpProColor:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['base:erpProColor:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ErpProColorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="产品ID" align="center" prop="proId" v-if="columns[0].visible" />
      <el-table-column label="单位id" align="center" prop="empId" v-if="columns[1].visible" />
      <el-table-column label="尺寸编码" align="center" prop="colorCode" v-if="columns[2].visible" />
      <el-table-column label="尺寸名称" align="center" prop="colorName" v-if="columns[3].visible" />
      <el-table-column label="排序号" align="center" prop="seqno" v-if="columns[4].visible" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" v-if="columns[5].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['base:erpProColor:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['base:erpProColor:remove']">删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改产品颜色管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="产品" prop="proId">
          <el-select v-model="form.proId" placeholder="请选择产品">
            <el-option v-for="pro in erpProList" :key="pro.proId" :label="pro.proName" :value="pro.proId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位id" prop="empId">
          <el-input v-model.trim="form.empId" placeholder="请输入单位id" />
        </el-form-item>
        <el-form-item label="颜色ID" prop="colorId">
          <el-input v-model.trim="form.colorId" placeholder="请输入尺码ID" />
        </el-form-item>
        <el-form-item label="颜色编码" prop="colorCode">
          <el-input v-model.trim="form.colorCode" placeholder="请输入尺寸编码" />
        </el-form-item>
        <el-form-item label="颜色名称" prop="colorName">
          <el-input v-model.trim="form.colorName" placeholder="请输入尺寸名称" />
        </el-form-item>
        <el-form-item label="排序号" prop="seqno">
          <el-input v-model.trim="form.seqno" placeholder="请输入排序号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listErpProColor, getErpProColor, delErpProColor, addErpProColor, updateErpProColor, exportErpProColor } from "@/api/base/erpProColor";
import { listErpPro } from "@/api/base/erpPro";
export default {
  name: "ErpProColor",
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
      // 产品颜色管理表格数据
      ErpProColorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        proId: null,
        colorCode: null,
        colorName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
        { key: 0, label: "id", visible: true },
        { key: 1, label: "产品ID", visible: true },
        { key: 2, label: "颜色id", visible: true },
        { key: 4, label: "颜色编码", visible: true },
        { key: 5, label: "颜色名称", visible: true },
        { key: 6, label: "排序号", visible: true },
        { key: 8, label: "创建时间", visible: true },
      ],
      erpProList: []
    };
  },
  created() {
    this.getList();
    this.getProductList();
  },
  methods: {
    /** 查询产品颜色管理列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listErpProColor(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ErpProColorList = content;
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
        empId: null,
        colorId: null,
        colorCode: null,
        colorName: null,
        seqno: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      this.reset();
      this.open = true;
      this.title = "添加产品颜色管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getErpProColor(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改产品颜色管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateErpProColor(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addErpProColor(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除产品颜色管理编号为"' + ids + '"的数据项？').then(function () {
        return delErpProColor(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有产品颜色管理数据项？').then(() => {
        this.exportLoading = true;
        return exportErpProColor(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
