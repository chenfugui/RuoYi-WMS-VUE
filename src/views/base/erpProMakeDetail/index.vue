<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="生产ID" prop="proMakeId">
        <el-input v-model.trim="queryParams.proMakeId" placeholder="请输入生产ID" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="生产编码" prop="proMakeNo">
        <el-input v-model.trim="queryParams.proMakeNo" placeholder="请输入生产编码" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="产品id" prop="proId">
        <el-input v-model.trim="queryParams.proId" placeholder="请输入产品id" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="尺码ID" prop="sizeId">
        <el-input v-model.trim="queryParams.sizeId" placeholder="请输入尺码ID" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="颜色ID" prop="colorId">
        <el-input v-model.trim="queryParams.colorId" placeholder="请输入颜色ID" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="布料ID" prop="clothId">
        <el-input v-model.trim="queryParams.clothId" placeholder="请输入布料ID" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="布料编码" prop="clothCode">
        <el-input v-model.trim="queryParams.clothCode" placeholder="请输入布料编码" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <template v-if="showMoreCondition">
        <el-form-item label="布料名称" prop="clothName">
          <el-input v-model.trim="queryParams.clothName" placeholder="请输入布料名称" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="生产数量" prop="makeNum">
          <el-input v-model.trim="queryParams.makeNum" placeholder="请输入生产数量" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="数据状态" prop="delFlag">
          <el-input v-model.trim="queryParams.delFlag" placeholder="请输入" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="单位id" prop="empId">
          <el-input v-model.trim="queryParams.empId" placeholder="请输入单位id" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
      </template>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini"
          @click="showMoreCondition = !showMoreCondition">{{ showMoreCondition ? '收起条件' : '展开条件' }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['base:ErpProMakeDetail:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['base:ErpProMakeDetail:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['base:ErpProMakeDetail:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['base:ErpProMakeDetail:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ErpProMakeDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="生产ID" align="center" prop="proMakeId" v-if="columns[0].visible" />
      <el-table-column label="生产编码" align="center" prop="proMakeNo" v-if="columns[1].visible" />
      <el-table-column label="产品id" align="center" prop="proId" v-if="columns[2].visible" />
      <el-table-column label="尺码ID" align="center" prop="sizeId" v-if="columns[3].visible" />
      <el-table-column label="颜色ID" align="center" prop="colorId" v-if="columns[4].visible" />
      <el-table-column label="布料ID" align="center" prop="clothId" v-if="columns[5].visible" />
      <el-table-column label="布料编码" align="center" prop="clothCode" v-if="columns[6].visible" />
      <el-table-column label="布料名称" align="center" prop="clothName" v-if="columns[7].visible" />
      <el-table-column label="生产数量" align="center" prop="makeNum" v-if="columns[8].visible" />
      <el-table-column label="数据状态" align="center" prop="delFlag" v-if="columns[9].visible" />
      <el-table-column label="单位id" align="center" prop="empId" v-if="columns[10].visible" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['base:ErpProMakeDetail:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['base:ErpProMakeDetail:remove']">删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改服装生产明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="生产ID" prop="proMakeId">
          <el-input v-model.trim="form.proMakeId" placeholder="请输入生产ID" />
        </el-form-item>
        <el-form-item label="生产编码" prop="proMakeNo">
          <el-input v-model.trim="form.proMakeNo" placeholder="请输入生产编码" />
        </el-form-item>
        <el-form-item label="产品id" prop="proId">
          <el-input v-model.trim="form.proId" placeholder="请输入产品id" />
        </el-form-item>
        <el-form-item label="尺码ID" prop="sizeId">
          <el-input v-model.trim="form.sizeId" placeholder="请输入尺码ID" />
        </el-form-item>
        <el-form-item label="颜色ID" prop="colorId">
          <el-input v-model.trim="form.colorId" placeholder="请输入颜色ID" />
        </el-form-item>
        <el-form-item label="布料ID" prop="clothId">
          <el-input v-model.trim="form.clothId" placeholder="请输入布料ID" />
        </el-form-item>
        <el-form-item label="布料编码" prop="clothCode">
          <el-input v-model.trim="form.clothCode" placeholder="请输入布料编码" />
        </el-form-item>
        <el-form-item label="布料名称" prop="clothName">
          <el-input v-model.trim="form.clothName" placeholder="请输入布料名称" />
        </el-form-item>
        <el-form-item label="生产数量" prop="makeNum">
          <el-input v-model.trim="form.makeNum" placeholder="请输入生产数量" />
        </el-form-item>
        <el-form-item label="数据状态" prop="delFlag">
          <el-input v-model.trim="form.delFlag" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="单位id" prop="empId">
          <el-input v-model.trim="form.empId" placeholder="请输入单位id" />
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
import { listErpProMakeDetail, getErpProMakeDetail, delErpProMakeDetail, addErpProMakeDetail, updateErpProMakeDetail, exportErpProMakeDetail } from "@/api/base/erpProMakeDetail";

export default {
  name: "ErpProMakeDetail",
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
      // 服装生产明细表格数据
      ErpProMakeDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        proMakeId: null,
        proMakeNo: null,
        proId: null,
        sizeId: null,
        colorId: null,
        clothId: null,
        clothCode: null,
        clothName: null,
        makeNum: null,
        delFlag: null,
        empId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
        { key: 1, label: "生产ID", visible: true },
        { key: 2, label: "生产编码", visible: true },
        { key: 3, label: "产品id", visible: true },
        { key: 4, label: "尺码ID", visible: true },
        { key: 5, label: "颜色ID", visible: true },
        { key: 6, label: "布料ID", visible: true },
        { key: 7, label: "布料编码", visible: true },
        { key: 8, label: "布料名称", visible: true },
        { key: 9, label: "生产数量", visible: true },
        { key: 14, label: "数据状态", visible: false },
        { key: 15, label: "单位id", visible: false },
      ],
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询服装生产明细列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listErpProMakeDetail(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ErpProMakeDetailList = content;
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
        proMakeId: null,
        proMakeNo: null,
        proId: null,
        sizeId: null,
        colorId: null,
        clothId: null,
        clothCode: null,
        clothName: null,
        makeNum: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加服装生产明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getErpProMakeDetail(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改服装生产明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateErpProMakeDetail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addErpProMakeDetail(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除服装生产明细编号为"' + ids + '"的数据项？').then(function () {
        return delErpProMakeDetail(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有服装生产明细数据项？').then(() => {
        this.exportLoading = true;
        return exportErpProMakeDetail(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
