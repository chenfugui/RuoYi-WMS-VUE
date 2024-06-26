<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="产品编码" prop="proCode">
        <el-input
          v-model.trim="queryParams.proCode"
          placeholder="请输入产品编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="proName">
        <el-input
          v-model.trim="queryParams.proName"
          placeholder="请输入产品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品类型" prop="proType">
        <el-select v-model="queryParams.proType" placeholder="请选择产品类型" clearable size="small">
            <el-option
              v-for="dict in dict.type.pro_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
        </el-select>
      </el-form-item>
      <el-form-item label="产品状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择产品状态" clearable size="small">
            <el-option
              v-for="dict in dict.type.data_status_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
        </el-select>
      </el-form-item>
      <el-form-item label="单位ID" prop="empId">
        <el-input
          v-model.trim="queryParams.empId"
          placeholder="请输入单位ID"
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
          v-hasPermi="['base:Product:add']"
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
          v-hasPermi="['base:Product:edit']"
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
          v-hasPermi="['base:Product:remove']"
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
          v-hasPermi="['base:Product:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ProductList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="产品编码" align="center" prop="proCode" v-if="columns[0].visible"/>
      <el-table-column label="产品名称" align="center" prop="proName" v-if="columns[1].visible"/>
      <el-table-column label="产品描述" align="center" prop="proDesc" v-if="columns[2].visible"/>
      <el-table-column label="产品类型" align="center" prop="proType" v-if="columns[3].visible">
        <template slot-scope="scope">
            <dict-tag :options="dict.type.pro_type" :value="scope.row.proType"/>
        </template>
      </el-table-column>
      <el-table-column label="产品备注" align="center" prop="proMemo" v-if="columns[4].visible"/>
      <el-table-column label="产品状态" align="center" prop="status" v-if="columns[5].visible">
        <template slot-scope="scope">
            <dict-tag :options="dict.type.data_status_type" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="单位ID" align="center" prop="empId" v-if="columns[6].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:Product:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:Product:remove']"
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

    <!-- 添加或修改产品信息表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="产品编码" prop="proCode">
          <el-input v-model.trim="form.proCode" placeholder="请输入产品编码" />
        </el-form-item>
        <el-form-item label="产品名称" prop="proName">
          <el-input v-model.trim="form.proName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品描述" prop="proDesc">
          <el-input v-model="form.proDesc" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="产品类型" prop="proType">
          <el-select v-model="form.proType" placeholder="请选择产品类型">
            <el-option
              v-for="dict in dict.type.pro_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品备注" prop="proMemo">
          <el-input v-model="form.proMemo" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="产品状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.data_status_type"
              :key="dict.value"
              :label="dict.value"            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单位ID" prop="empId">
          <el-input v-model.trim="form.empId" placeholder="请输入单位ID" />
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
import { listProduct, getProduct, delProduct, addProduct, updateProduct, exportProduct } from "@/api/base/product";

export default {
  name: "Product",
  dicts: ['pro_type', 'data_status_type'],
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
      // 产品信息表表格数据
      ProductList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        proCode: null,
        proName: null,
        proDesc: null,
        proType: null,
        proMemo: null,
        status: null,
        empId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
            { key: 1, label: "产品编码", visible:  true  },
            { key: 2, label: "产品名称", visible:  true  },
            { key: 3, label: "产品描述", visible:  true  },
            { key: 4, label: "产品类型", visible:  true  },
            { key: 5, label: "产品备注", visible:  true  },
            { key: 6, label: "产品状态", visible:  true  },
                                { key: 12, label: "单位ID", visible:  false  },
         ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询产品信息表列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listProduct(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ProductList = content;
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
        proId: null,
        proCode: null,
        proName: null,
        proDesc: null,
        proType: null,
        proMemo: null,
        status: "0",
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
      this.ids = selection.map(item => item.proId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加产品信息表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const proId = row.proId || this.ids
      getProduct(proId).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改产品信息表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.proId != null) {
            updateProduct(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProduct(this.form).then(response => {
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
      const proIds = row.proId || this.ids;
      this.$modal.confirm('是否确认删除产品信息表编号为"' + proIds + '"的数据项？').then(function() {
        return delProduct(proIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有产品信息表数据项？').then(() => {
        this.exportLoading = true;
        return exportProduct(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
