<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="用户id" prop="userId">
        <el-input v-model.trim="queryParams.userId" placeholder="请输入用户id" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工序ID" prop="stepId">
        <el-input v-model.trim="queryParams.stepId" placeholder="请输入工序ID" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="生产数量" prop="mknum">
        <el-input v-model.trim="queryParams.mknum" placeholder="请输入生产数量" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="工价" prop="stepPrice">
        <el-input v-model.trim="queryParams.stepPrice" placeholder="请输入工价" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="应付工资" prop="payable">
        <el-input v-model.trim="queryParams.payable" placeholder="请输入应付工资" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="实付工资" prop="actPay">
        <el-input v-model.trim="queryParams.actPay" placeholder="请输入实付工资" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="数据录入类型：1 扫码，2 手工录入" prop="inputType">
        <el-select v-model="queryParams.inputType" placeholder="请选择数据录入类型：1 扫码，2 手工录入" clearable size="small">
          <el-option v-for="dict in dict.type.input_type" :key="dict.value" :label="dict.label" :value="dict.value" />
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
          v-hasPermi="['base:commonWkbill:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['base:commonWkbill:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['base:commonWkbill:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['base:commonWkbill:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="CommonWkbillList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户id" align="center" prop="userId" v-if="columns[0].visible" />
      <el-table-column label="工序ID" align="center" prop="stepId" v-if="columns[1].visible" />
      <el-table-column label="生产数量" align="center" prop="mknum" v-if="columns[2].visible" />
      <el-table-column label="工价" align="center" prop="stepPrice" v-if="columns[3].visible" />
      <el-table-column label="应付工资" align="center" prop="payable" v-if="columns[4].visible" />
      <el-table-column label="实付工资" align="center" prop="actPay" v-if="columns[5].visible" />
      <el-table-column label="数据录入类型：1 扫码，2 手工录入" align="center" prop="inputType" v-if="columns[6].visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.input_type" :value="scope.row.inputType" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['base:commonWkbill:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['base:commonWkbill:remove']">删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改工单信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model.trim="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="工序ID" prop="stepId">
          <el-input v-model.trim="form.stepId" placeholder="请输入工序ID" />
        </el-form-item>
        <el-form-item label="生产数量" prop="mknum">
          <el-input v-model.trim="form.mknum" placeholder="请输入生产数量" />
        </el-form-item>
        <el-form-item label="工价" prop="stepPrice">
          <el-input v-model.trim="form.stepPrice" placeholder="请输入工价" />
        </el-form-item>
        <el-form-item label="应付工资" prop="payable">
          <el-input v-model.trim="form.payable" placeholder="请输入应付工资" />
        </el-form-item>
        <el-form-item label="实付工资" prop="actPay">
          <el-input v-model.trim="form.actPay" placeholder="请输入实付工资" />
        </el-form-item>
        <el-form-item label="数据录入类型：1 扫码，2 手工录入" prop="inputType">
          <el-select v-model="form.inputType" placeholder="请选择数据录入类型：1 扫码，2 手工录入">
            <el-option v-for="dict in dict.type.input_type" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
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
import { listCommonWkbill, getCommonWkbill, delCommonWkbill, addCommonWkbill, updateCommonWkbill, exportCommonWkbill } from "@/api/base/commonWkbill";

export default {
  name: "CommonWkbill",
  dicts: ['input_type'],
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
      // 工单信息表格数据
      CommonWkbillList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        stepId: null,
        mknum: null,
        stepPrice: null,
        payable: null,
        actPay: null,
        inputType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户id不能为空", trigger: "blur" }
        ],
        stepId: [
          { required: true, message: "工序ID不能为空", trigger: "blur" }
        ],
        mknum: [
          { required: true, message: "生产数量不能为空", trigger: "blur" }
        ],
        stepPrice: [
          { required: true, message: "工价不能为空", trigger: "blur" }
        ],
      },
      columns: [
        { key: 1, label: "用户id", visible: true },
        { key: 2, label: "工序ID", visible: true },
        { key: 3, label: "生产数量", visible: true },
        { key: 4, label: "工价", visible: true },
        { key: 5, label: "应付工资", visible: true },
        { key: 6, label: "实付工资", visible: true },
        { key: 7, label: "数据录入类型：1 扫码，2 手工录入", visible: true },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工单信息列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listCommonWkbill(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.CommonWkbillList = content;
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
        wkbillId: null,
        userId: null,
        stepId: null,
        mknum: null,
        stepPrice: null,
        payable: null,
        actPay: null,
        inputType: null,
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
      this.ids = selection.map(item => item.wkbillId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工单信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const wkbillId = row.wkbillId || this.ids
      getCommonWkbill(wkbillId).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改工单信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.wkbillId != null) {
            updateCommonWkbill(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCommonWkbill(this.form).then(response => {
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
      const wkbillIds = row.wkbillId || this.ids;
      this.$modal.confirm('是否确认删除工单信息编号为"' + wkbillIds + '"的数据项？').then(function () {
        return delCommonWkbill(wkbillIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有工单信息数据项？').then(() => {
        this.exportLoading = true;
        return exportCommonWkbill(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
