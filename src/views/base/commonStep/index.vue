<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="工序编码" prop="stepCode">
        <el-input v-model.trim="queryParams.stepCode" placeholder="请输入工序编码" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工序名称" prop="stepName">
        <el-input v-model.trim="queryParams.stepName" placeholder="请输入工序名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工价" prop="stepPrice">
        <el-input v-model.trim="queryParams.stepPrice" placeholder="请输入工价" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="单位编码" prop="empCode">
        <el-input
          v-model.trim="queryParams.empCode"
          placeholder="请输入单位编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="序号" prop="stepSort">
        <el-input v-model.trim="queryParams.stepSort" placeholder="请输入序号" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option v-for="dict in dict.type.data_status_type" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['base:commonStep:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['base:commonStep:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['base:commonStep:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['base:commonStep:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="CommonStepList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工序编码" align="center" prop="stepCode" v-if="columns[0].visible" />
      <el-table-column label="工序名称" align="center" prop="stepName" v-if="columns[1].visible" />
      <el-table-column label="工价" align="center" prop="stepPrice" v-if="columns[2].visible" />

      <el-table-column label="序号" align="center" prop="stepSort" v-if="columns[3].visible" />
      <el-table-column label="状态" align="center" prop="status" v-if="columns[4].visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.data_status_type" :value="scope.row.status" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="单位编码" align="center" prop="empCode" v-if="columns[5].visible"/> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['base:commonStep:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['base:commonStep:remove']">删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改工序信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="工序编码" prop="stepCode">
          <el-input v-model.trim="form.stepCode" placeholder="请输入工序编码" />
        </el-form-item>
        <el-form-item label="工序名称" prop="stepName">
          <el-input v-model.trim="form.stepName" placeholder="请输入工序名称" />
        </el-form-item>
        <el-form-item label="工价" prop="stepPrice">
          <el-input v-model.trim="form.stepPrice" placeholder="请输入工价" />
        </el-form-item>
        <!-- <el-form-item label="单位编码" prop="empCode">
          <el-input v-model.trim="form.empCode" placeholder="请输入单位编码" />
        </el-form-item> -->
        <el-form-item label="序号" prop="stepSort">
          <el-input v-model.trim="form.stepSort" placeholder="请输入序号" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in dict.type.data_status_type" :key="dict.value" :label="dict.value">{{ dict.label
              }}</el-radio>
          </el-radio-group>
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
import { listCommonStep, getCommonStep, delCommonStep, addCommonStep, updateCommonStep, exportCommonStep } from "@/api/base/commonStep";

export default {
  name: "CommonStep",
  dicts: ['data_status_type'],
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
      // 工序信息表格数据
      CommonStepList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stepCode: null,
        stepName: null,
        stepPrice: null,
        empCode: null,
        stepSort: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stepCode: [
          { required: true, message: "工序编码不能为空", trigger: "blur" }
        ],
        stepName: [
          { required: true, message: "工序名称不能为空", trigger: "blur" }
        ],
        stepPrice: [
          { required: true, message: "工价不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
      },
      columns: [
        { key: 1, label: "工序编码", visible: true },
        { key: 2, label: "工序名称", visible: true },
        { key: 3, label: "工价", visible: true },
        { key: 5, label: "序号", visible: true },
        { key: 6, label: "状态", visible: true },
        //{ key: 4, label: "单位编码", visible:  true  },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工序信息列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listCommonStep(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.CommonStepList = content;
        this.total = totalElements;
        this.loading = false;
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
        stepId: null,
        stepCode: null,
        stepName: null,
        stepPrice: null,
        empCode: null,
        stepSort: null,
        status: "0",
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
      this.ids = selection.map(item => item.stepId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工序信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const stepId = row.stepId || this.ids
      getCommonStep(stepId).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改工序信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.stepId != null) {
            updateCommonStep(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCommonStep(this.form).then(response => {
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
      const stepIds = row.stepId || this.ids;
      this.$modal.confirm('是否确认删除工序信息编号为"' + stepIds + '"的数据项？').then(function () {
        return delCommonStep(stepIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有工序信息数据项？').then(() => {
        this.exportLoading = true;
        return exportCommonStep(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
