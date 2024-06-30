<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="产品id" prop="proId">
        <el-input
          v-model.trim="queryParams.proId"
          placeholder="请输入产品id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="工序id" prop="stepId">
        <el-input
          v-model.trim="queryParams.stepId"
          placeholder="请输入工序id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工序编码" prop="stepcode">
        <el-input
          v-model.trim="queryParams.stepcode"
          placeholder="请输入工序编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工序名称" prop="stepname">
        <el-input
          v-model.trim="queryParams.stepname"
          placeholder="请输入工序名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工序工价" prop="price">
        <el-input
          v-model.trim="queryParams.price"
          placeholder="请输入工序工价"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序号" prop="seqno">
        <el-input
          v-model.trim="queryParams.seqno"
          placeholder="请输入排序号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <template v-if="showMoreCondition">
      <el-form-item label="工序状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择工序状态" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="dr 1 正常  2  删除" prop="dr">
        <el-input
          v-model.trim="queryParams.dr"
          placeholder="请输入dr 1 正常  2  删除"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    </template>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini" @click="showMoreCondition = !showMoreCondition">{{showMoreCondition ? '收起条件' : '展开条件'}}</el-button>
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
          v-hasPermi="['base:ErpProProcess:add']"
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
          v-hasPermi="['base:ErpProProcess:edit']"
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
          v-hasPermi="['base:ErpProProcess:remove']"
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
          v-hasPermi="['base:ErpProProcess:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ErpProProcessList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="产品id" align="center" prop="proId" v-if="columns[0].visible"/>
      <el-table-column label="单位ID" align="center" prop="empId" v-if="columns[1].visible"/>
      <el-table-column label="工序id" align="center" prop="stepId" v-if="columns[2].visible"/>
      <el-table-column label="工序编码" align="center" prop="stepcode" v-if="columns[3].visible"/>
      <el-table-column label="工序名称" align="center" prop="stepname" v-if="columns[4].visible"/>
      <el-table-column label="工序工价" align="center" prop="price" v-if="columns[5].visible"/>
      <el-table-column label="排序号" align="center" prop="seqno" v-if="columns[6].visible"/>
      <el-table-column label="工序状态" align="center" prop="status" v-if="columns[7].visible"/>
      <el-table-column label="dr 1 正常  2  删除" align="center" prop="dr" v-if="columns[8].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:ErpProProcess:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:ErpProProcess:remove']"
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

    <!-- 添加或修改服装工序信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="产品id" prop="proId">
          <el-input v-model.trim="form.proId" placeholder="请输入产品id" />
        </el-form-item>
        <el-form-item label="单位ID" prop="empId">
          <el-input v-model.trim="form.empId" placeholder="请输入单位ID" />
        </el-form-item>
        <el-form-item label="工序id" prop="stepId">
          <el-input v-model.trim="form.stepId" placeholder="请输入工序id" />
        </el-form-item>
        <el-form-item label="工序编码" prop="stepcode">
          <el-input v-model.trim="form.stepcode" placeholder="请输入工序编码" />
        </el-form-item>
        <el-form-item label="工序名称" prop="stepname">
          <el-input v-model.trim="form.stepname" placeholder="请输入工序名称" />
        </el-form-item>
        <el-form-item label="工序工价" prop="price">
          <el-input v-model.trim="form.price" placeholder="请输入工序工价" />
        </el-form-item>
        <el-form-item label="排序号" prop="seqno">
          <el-input v-model.trim="form.seqno" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="工序状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="dr 1 正常  2  删除" prop="dr">
          <el-input v-model.trim="form.dr" placeholder="请输入dr 1 正常  2  删除" />
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
import { listErpProProcess, getErpProProcess, delErpProProcess, addErpProProcess, updateErpProProcess, exportErpProProcess } from "@/api/base/erpProProcess";

export default {
  name: "ErpProProcess",
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
      // 服装工序信息表格数据
      ErpProProcessList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        proId: null,
        empId: null,
        stepId: null,
        stepcode: null,
        stepname: null,
        price: null,
        seqno: null,
        status: null,
        dr: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
            { key: 1, label: "产品id", visible:  true  },
            { key: 2, label: "单位ID", visible:  true  },
            { key: 3, label: "工序id", visible:  true  },
            { key: 4, label: "工序编码", visible:  true  },
            { key: 5, label: "工序名称", visible:  true  },
            { key: 6, label: "工序工价", visible:  true  },
            { key: 7, label: "排序号", visible:  true  },
            { key: 8, label: "工序状态", visible:  true  },
                            { key: 13, label: "dr 1 正常  2  删除", visible:  false  },
         ],
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询服装工序信息列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listErpProProcess(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ErpProProcessList = content;
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
        proId: null,
        empId: null,
        stepId: null,
        stepcode: null,
        stepname: null,
        price: null,
        seqno: null,
        status: "0",
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        dr: null
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
      this.title = "添加服装工序信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getErpProProcess(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改服装工序信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateErpProProcess(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addErpProProcess(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除服装工序信息编号为"' + ids + '"的数据项？').then(function() {
        return delErpProProcess(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有服装工序信息数据项？').then(() => {
        this.exportLoading = true;
        return exportErpProProcess(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
