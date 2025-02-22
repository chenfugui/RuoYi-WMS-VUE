<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="应用版本" prop="appVersion">
        <el-input
          v-model.trim="queryParams.appVersion"
          placeholder="请输入应用版本"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="苹果地址" prop="iosUrl">
        <el-input
          v-model.trim="queryParams.iosUrl"
          placeholder="请输入苹果地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="安卓地址" prop="androidUrl">
        <el-input
          v-model.trim="queryParams.androidUrl"
          placeholder="请输入安卓地址"
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
          v-hasPermi="['base:erpAppVer:add']"
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
          v-hasPermi="['base:erpAppVer:edit']"
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
          v-hasPermi="['base:erpAppVer:remove']"
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
          v-hasPermi="['base:erpAppVer:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ErpAppVerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="应用版本" align="center" prop="appVersion" v-if="columns[0].visible"/>
      <el-table-column label="发布编号" align="center" prop="releaseNum" v-if="columns[1].visible"/>
      <el-table-column label="版本信息" align="center" prop="appInfo" v-if="columns[2].visible"/>
      <el-table-column label="苹果地址" align="center" prop="iosUrl" v-if="columns[3].visible"/>
      <el-table-column label="安卓地址" align="center" prop="androidUrl" v-if="columns[4].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:erpAppVer:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:erpAppVer:remove']"
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

    <!-- 添加或修改App版本对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="应用版本" prop="appVersion">
          <el-input v-model.trim="form.appVersion" placeholder="请输入应用版本" />
        </el-form-item>
        <el-form-item label="发布编号" prop="releaseNum">
          <el-input v-model="form.releaseNum" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="版本信息" prop="appInfo">
          <el-input v-model="form.appInfo" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="苹果地址" prop="iosUrl">
          <el-input v-model.trim="form.iosUrl" placeholder="请输入苹果地址" />
        </el-form-item>
        <el-form-item label="安卓地址" prop="androidUrl">
          <el-input v-model.trim="form.androidUrl" placeholder="请输入安卓地址" />
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
import { listErpAppVer, getErpAppVer, delErpAppVer, addErpAppVer, updateErpAppVer, exportErpAppVer } from "@/api/base/erpAppVer";

export default {
  name: "ErpAppVer",
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
      // App版本表格数据
      ErpAppVerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        appVersion: null,
        releaseNum: null,
        appInfo: null,
        iosUrl: null,
        androidUrl: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
            { key: 1, label: "应用版本", visible:  true  },
            { key: 2, label: "发布编号", visible:  true  },
            { key: 3, label: "版本信息", visible:  true  },
            { key: 4, label: "苹果地址", visible:  true  },
            { key: 5, label: "安卓地址", visible:  true  },
                             ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询App版本列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listErpAppVer(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ErpAppVerList = content;
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
        appVersion: null,
        releaseNum: null,
        appInfo: null,
        iosUrl: null,
        androidUrl: null,
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加App版本";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getErpAppVer(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改App版本";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateErpAppVer(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addErpAppVer(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除App版本编号为"' + ids + '"的数据项？').then(function() {
        return delErpAppVer(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有App版本数据项？').then(() => {
        this.exportLoading = true;
        return exportErpAppVer(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
