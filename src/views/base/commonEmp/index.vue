<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="单位编码" prop="empCode">
        <el-input
          v-model.trim="queryParams.empCode"
          placeholder="请输入单位编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位名称" prop="empName">
        <el-input
          v-model.trim="queryParams.empName"
          placeholder="请输入单位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上级单位ID" prop="parentId">
        <el-input
          v-model.trim="queryParams.parentId"
          placeholder="请输入上级单位ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序号" prop="orderNum">
        <el-input
          v-model.trim="queryParams.orderNum"
          placeholder="请输入排序号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['base:CommonEmp:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['base:CommonEmp:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['base:CommonEmp:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['base:CommonEmp:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="CommonEmpList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单位编码" align="center" prop="empCode" v-if="columns[0].visible"/>
      <el-table-column label="单位名称" align="center" prop="empName" v-if="columns[1].visible"/>
      <el-table-column label="上级单位ID" align="center" prop="parentId" v-if="columns[2].visible"/>
      <el-table-column label="祖级列表" align="center" prop="ancestors" v-if="columns[3].visible"/>
      <el-table-column label="排序号" align="center" prop="orderNum" v-if="columns[4].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:CommonEmp:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:CommonEmp:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改单位信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="单位编码" prop="empCode">
          <el-input v-model.trim="form.empCode" placeholder="请输入单位编码" />
        </el-form-item>
        <el-form-item label="单位名称" prop="empName">
          <el-input v-model.trim="form.empName" placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item label="上级单位ID" prop="parentId">
          <el-input v-model.trim="form.parentId" placeholder="请输入上级单位ID" />
        </el-form-item>
        <el-form-item label="排序号" prop="orderNum">
          <el-input v-model.trim="form.orderNum" placeholder="请输入排序号" />
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
import { listCommonEmp, getCommonEmp, delCommonEmp, addCommonEmp, updateCommonEmp, exportCommonEmp } from "@/api/base/commonEmp";

export default {
  name: "CommonEmp",
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
      // 单位信息表格数据
      CommonEmpList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        empCode: null,
        empName: null,
        parentId: null,
        ancestors: null,
        orderNum: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
            { key: 1, label: "单位编码", visible:  true  },
            { key: 2, label: "单位名称", visible:  true  },
                { key: 4, label: "上级单位ID", visible:  true  },
            { key: 5, label: "祖级列表", visible:  true  },
            { key: 6, label: "排序号", visible:  true  },
                                 ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询单位信息列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listCommonEmp(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.CommonEmpList = content;
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
        empId: null,
        empCode: null,
        empName: null,
        empType: null,
        parentId: null,
        ancestors: null,
        orderNum: null,
        status: [],
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
      this.ids = selection.map(item => item.empId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加单位信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const empId = row.empId || this.ids
      getCommonEmp(empId).then(response => {
        this.form = response;
        this.form.status = this.form.status.split(",");
        this.open = true;
        this.title = "修改单位信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.status = this.form.status.join(",");
          if (this.form.empId != null) {
            updateCommonEmp(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCommonEmp(this.form).then(response => {
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
      const empIds = row.empId || this.ids;
      this.$modal.confirm('是否确认删除单位信息编号为"' + empIds + '"的数据项？').then(function() {
        return delCommonEmp(empIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有单位信息数据项？').then(() => {
        this.exportLoading = true;
        return exportCommonEmp(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
