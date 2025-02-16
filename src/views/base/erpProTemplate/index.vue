<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="模板编码" prop="tmpCode">
        <el-input
          v-model.trim="queryParams.tmpCode"
          placeholder="请输入模板编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模板名称" prop="tmpName">
        <el-input
          v-model.trim="queryParams.tmpName"
          placeholder="请输入模板名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模板类型" prop="tmpType">
        <el-select v-model="queryParams.tmpType" placeholder="请选择模板类型" clearable size="small">
            <el-option
              v-for="dict in dict.type.tmp_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
        </el-select>
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
          v-hasPermi="['base:erpProTemplate:add']"
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
          v-hasPermi="['base:erpProTemplate:edit']"
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
          v-hasPermi="['base:erpProTemplate:remove']"
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
          v-hasPermi="['base:erpProTemplate:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ErpProTemplateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模板编码" align="center" prop="tmpCode" v-if="columns[0].visible"/>
      <el-table-column label="模板名称" align="center" prop="tmpName" v-if="columns[1].visible"/>
      <el-table-column label="模板类型" align="center" prop="tmpType" v-if="columns[2].visible">
        <template slot-scope="scope">
            <dict-tag :options="dict.type.tmp_type" :value="scope.row.tmpType"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="tmpMemo" v-if="columns[3].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:erpProTemplate:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:erpProTemplate:remove']"
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

    <!-- 添加或修改模板对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="模板编码" prop="tmpCode">
          <el-input v-model.trim="form.tmpCode" placeholder="请输入模板编码" />
        </el-form-item>
        <el-form-item label="模板名称" prop="tmpName">
          <el-input v-model.trim="form.tmpName" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="模板类型" prop="tmpType">
          <el-select v-model="form.tmpType" placeholder="请选择模板类型">
            <el-option
              v-for="dict in dict.type.tmp_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="tmpMemo">
          <el-input v-model="form.tmpMemo" type="textarea" placeholder="请输入内容" />
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
import { listErpProTemplate, getErpProTemplate, delErpProTemplate, addErpProTemplate, updateErpProTemplate, exportErpProTemplate } from "@/api/base/erpProTemplate";

export default {
  name: "ErpProTemplate",
  dicts: ['tmp_type'],
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
      // 模板表格数据
      ErpProTemplateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tmpCode: null,
        tmpName: null,
        tmpType: null,
        tmpMemo: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
            { key: 1, label: "模板编码", visible:  true  },
            { key: 2, label: "模板名称", visible:  true  },
            { key: 3, label: "模板类型", visible:  true  },
            { key: 4, label: "备注", visible:  true  },
                                 ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询模板列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listErpProTemplate(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ErpProTemplateList = content;
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
        id: null,
        tmpCode: null,
        tmpName: null,
        tmpType: null,
        tmpMemo: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        empId: null
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加模板";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getErpProTemplate(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改模板";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateErpProTemplate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addErpProTemplate(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除模板编号为"' + ids + '"的数据项？').then(function() {
        return delErpProTemplate(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有模板数据项？').then(() => {
        this.exportLoading = true;
        return exportErpProTemplate(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
