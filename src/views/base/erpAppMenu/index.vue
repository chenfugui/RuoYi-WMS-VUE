<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="目录名称" prop="catalogName">
        <el-input v-model.trim="queryParams.catalogName" placeholder="请输入目录名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="菜单编码" prop="menuCode">
        <el-input v-model.trim="queryParams.menuCode" placeholder="请输入菜单编码" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model.trim="queryParams.menuName" placeholder="请输入菜单名称" clearable size="small"
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
          v-hasPermi="['base:erpAppMenu:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['base:erpAppMenu:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['base:erpAppMenu:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['base:erpAppMenu:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="erpAppMenuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="目录名称" align="center" prop="catalogName" v-if="columns[0].visible" />
      <el-table-column label="菜单编码" align="center" prop="menuCode" v-if="columns[1].visible" />
      <el-table-column label="菜单名称" align="center" prop="menuName" v-if="columns[2].visible" />
      <el-table-column label="菜单路径" align="center" prop="menuPath" v-if="columns[3].visible" />
      <el-table-column label="图标" align="center" prop="icon" v-if="columns[6].visible" />
      <el-table-column label="创建人" align="center" prop="createBy" v-if="columns[4].visible" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" v-if="columns[5].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['base:erpAppMenu:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['base:erpAppMenu:remove']">删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改app功能菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <!-- <el-form-item label="主键id" prop="id">
          <el-input v-model.trim="form.id" placeholder="请输入主键id" />
        </el-form-item> -->
        <el-form-item label="目录id" prop="catalogId">
          <el-input v-model.trim="form.catalogId" placeholder="请输入目录id" />
        </el-form-item>
        <el-form-item label="目录名称" prop="catalogName">
          <el-input v-model.trim="form.catalogName" placeholder="请输入目录名称" />
        </el-form-item>
        <el-form-item label="菜单编码" prop="menuCode">
          <el-input v-model.trim="form.menuCode" placeholder="请输入菜单编码" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model.trim="form.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model.trim="form.icon" placeholder="请输入图标编码" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="menuPath">
          <el-input v-model="form.menuPath" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="序号" prop="seqNo">
          <el-input v-model.trim="form.seqNo" placeholder="请输入序号" />
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
import {getErpAppMenuGroup, listErpAppMenu, getErpAppMenu, delErpAppMenu, addErpAppMenu, updateErpAppMenu, exportErpAppMenu } from "@/api/base/erpAppMenu";

export default {
  name: "ErpAppMenu",
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
      // app功能菜单表格数据
      erpAppMenuList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        catalogName: null,
        menuCode: null,
        menuName: null,
        menuPath: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
        { key: 2, label: "目录名称", visible: true },
        { key: 3, label: "菜单编码", visible: true },
        { key: 4, label: "菜单名称", visible: true },
        { key: 5, label: "菜单路径", visible: true },
        { key: 7, label: "创建人", visible: true },
        { key: 8, label: "创建时间", visible: true },
        { key: 9, label: "图标", visible: true },
      ],
    };
  },
  created() {
    this.getList();
    //this.getAppMenuGroupList();
  },
  methods: {
    //获取app分组菜单
     async getAppMenuGroupList() {
       const data =  await getErpAppMenuGroup();
       console.log(JSON.stringify(data));
    },
    /** 查询app功能菜单列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listErpAppMenu(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.erpAppMenuList = content;
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
        catalogId: null,
        catalogName: null,
        menuCode: null,
        menuName: null,
        menuPath: null,
        seqNo: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        icon:null,
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
      this.reset();
      this.open = true;
      this.title = "添加app功能菜单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getErpAppMenu(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改app功能菜单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateErpAppMenu(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addErpAppMenu(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除app功能菜单编号为"' + ids + '"的数据项？').then(function () {
        return delErpAppMenu(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有app功能菜单数据项？').then(() => {
        this.exportLoading = true;
        return exportErpAppMenu(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
