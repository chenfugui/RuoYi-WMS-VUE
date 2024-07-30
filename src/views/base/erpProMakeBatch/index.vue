<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="生产计划" prop="proMakeId">
        <el-input v-model.trim="queryParams.proMakeId" placeholder="请输入产品生产id" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="产品生产编码" prop="proMakeNo">
        <el-input v-model.trim="queryParams.proMakeNo" placeholder="请输入产品生产编码" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="产品ID" prop="proId">
        <el-input v-model.trim="queryParams.proId" placeholder="请输入产品ID" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="尺码id" prop="sizeId">
        <el-input v-model.trim="queryParams.sizeId" placeholder="请输入尺码id" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="批次编码(同一个产品生产编码，批次号唯一)" prop="batchNo">
        <el-input v-model.trim="queryParams.batchNo" placeholder="请输入批次编码(同一个产品生产编码，批次号唯一)" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="尺码名称" prop="sizeName">
        <el-input v-model.trim="queryParams.sizeName" placeholder="请输入尺码名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="尺码编码" prop="sizeCode">
        <el-input v-model.trim="queryParams.sizeCode" placeholder="请输入尺码编码" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <template v-if="showMoreCondition">
        <el-form-item label="颜色id" prop="colorId">
          <el-input v-model.trim="queryParams.colorId" placeholder="请输入颜色id" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="颜色编码" prop="colorCode">
          <el-input v-model.trim="queryParams.colorCode" placeholder="请输入颜色编码" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="颜色名称" prop="colorName">
          <el-input v-model.trim="queryParams.colorName" placeholder="请输入颜色名称" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="生产数量" prop="makeNum">
          <el-input v-model.trim="queryParams.makeNum" placeholder="请输入生产数量" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="床次" prop="bedNo">
          <el-input v-model.trim="queryParams.bedNo" placeholder="请输入床次" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="开始扎号" prop="pkgStartNo">
          <el-input v-model.trim="queryParams.pkgStartNo" placeholder="请输入开始扎号" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="结束扎号" prop="pkgEndNo">
          <el-input v-model.trim="queryParams.pkgEndNo" placeholder="请输入结束扎号" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="单位id" prop="empId">
          <el-input v-model.trim="queryParams.empId" placeholder="请输入单位id" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="数据状态" prop="delFlag">
          <el-input v-model.trim="queryParams.delFlag" placeholder="请输入" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="顺序号" prop="seqNo">
          <el-input v-model.trim="queryParams.seqNo" placeholder="请输入顺序号" clearable size="small"
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
          v-hasPermi="['base:erpProMakeBatch:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['base:erpProMakeBatch:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['base:erpProMakeBatch:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['base:erpProMakeBatch:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ErpProMakeBatchList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="产品生产id" align="center" prop="proMakeId" v-if="columns[0].visible" />
      <el-table-column label="产品生产编码" align="center" prop="proMakeNo" v-if="columns[1].visible" />
      <el-table-column label="产品ID" align="center" prop="proId" v-if="columns[2].visible" />
      <el-table-column label="尺码id" align="center" prop="sizeId" v-if="columns[3].visible" />
      <el-table-column label="批次编码(同一个产品生产编码，批次号唯一)" align="center" prop="batchNo" v-if="columns[4].visible" />
      <el-table-column label="尺码名称" align="center" prop="sizeName" v-if="columns[5].visible" />
      <el-table-column label="尺码编码" align="center" prop="sizeCode" v-if="columns[6].visible" />
      <el-table-column label="颜色id" align="center" prop="colorId" v-if="columns[7].visible" />
      <el-table-column label="颜色编码" align="center" prop="colorCode" v-if="columns[8].visible" />
      <el-table-column label="颜色名称" align="center" prop="colorName" v-if="columns[9].visible" />
      <el-table-column label="生产数量" align="center" prop="makeNum" v-if="columns[10].visible" />
      <el-table-column label="床次" align="center" prop="bedNo" v-if="columns[11].visible" />
      <el-table-column label="开始扎号" align="center" prop="pkgStartNo" v-if="columns[12].visible" />
      <el-table-column label="结束扎号" align="center" prop="pkgEndNo" v-if="columns[13].visible" />
      <el-table-column label="单位id" align="center" prop="empId" v-if="columns[14].visible" />
      <el-table-column label="数据状态" align="center" prop="delFlag" v-if="columns[15].visible" />
      <el-table-column label="顺序号" align="center" prop="seqNo" v-if="columns[16].visible" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['base:erpProMakeBatch:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['base:erpProMakeBatch:remove']">删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改服装生产批次对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="产品生产id" prop="proMakeId">
          <el-input v-model.trim="form.proMakeId" placeholder="请输入产品生产id" />
        </el-form-item>
        <el-form-item label="产品生产编码" prop="proMakeNo">
          <el-input v-model.trim="form.proMakeNo" placeholder="请输入产品生产编码" />
        </el-form-item>
        <el-form-item label="产品ID" prop="proId">
          <el-input v-model.trim="form.proId" placeholder="请输入产品ID" />
        </el-form-item>
        <el-form-item label="尺码id" prop="sizeId">
          <el-input v-model.trim="form.sizeId" placeholder="请输入尺码id" />
        </el-form-item>
        <el-form-item label="批次编码(同一个产品生产编码，批次号唯一)" prop="batchNo">
          <el-input v-model.trim="form.batchNo" placeholder="请输入批次编码(同一个产品生产编码，批次号唯一)" />
        </el-form-item>
        <el-form-item label="尺码名称" prop="sizeName">
          <el-input v-model.trim="form.sizeName" placeholder="请输入尺码名称" />
        </el-form-item>
        <el-form-item label="尺码编码" prop="sizeCode">
          <el-input v-model.trim="form.sizeCode" placeholder="请输入尺码编码" />
        </el-form-item>
        <el-form-item label="颜色id" prop="colorId">
          <el-input v-model.trim="form.colorId" placeholder="请输入颜色id" />
        </el-form-item>
        <el-form-item label="颜色编码" prop="colorCode">
          <el-input v-model.trim="form.colorCode" placeholder="请输入颜色编码" />
        </el-form-item>
        <el-form-item label="颜色名称" prop="colorName">
          <el-input v-model.trim="form.colorName" placeholder="请输入颜色名称" />
        </el-form-item>
        <el-form-item label="生产数量" prop="makeNum">
          <el-input v-model.trim="form.makeNum" placeholder="请输入生产数量" />
        </el-form-item>
        <el-form-item label="床次" prop="bedNo">
          <el-input v-model.trim="form.bedNo" placeholder="请输入床次" />
        </el-form-item>
        <el-form-item label="开始扎号" prop="pkgStartNo">
          <el-input v-model.trim="form.pkgStartNo" placeholder="请输入开始扎号" />
        </el-form-item>
        <el-form-item label="结束扎号" prop="pkgEndNo">
          <el-input v-model.trim="form.pkgEndNo" placeholder="请输入结束扎号" />
        </el-form-item>
        <el-form-item label="单位id" prop="empId">
          <el-input v-model.trim="form.empId" placeholder="请输入单位id" />
        </el-form-item>
        <el-form-item label="数据状态" prop="delFlag">
          <el-input v-model.trim="form.delFlag" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="顺序号" prop="seqNo">
          <el-input v-model.trim="form.seqNo" placeholder="请输入顺序号" />
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
import { listErpProMakeBatch, getErpProMakeBatch, delErpProMakeBatch, addErpProMakeBatch, updateErpProMakeBatch, exportErpProMakeBatch } from "@/api/base/erpProMakeBatch";

export default {
  name: "ErpProMakeBatch",
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
      // 服装生产批次表格数据
      ErpProMakeBatchList: [],
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
        batchNo: null,
        sizeName: null,
        sizeCode: null,
        colorId: null,
        colorCode: null,
        colorName: null,
        makeNum: null,
        bedNo: null,
        pkgStartNo: null,
        pkgEndNo: null,
        empId: null,
        delFlag: null,
        seqNo: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
        { key: 1, label: "产品生产id", visible: true },
        { key: 2, label: "产品生产编码", visible: true },
        { key: 3, label: "产品ID", visible: true },
        { key: 4, label: "尺码id", visible: true },
        { key: 5, label: "批次编码(同一个产品生产编码，批次号唯一)", visible: true },
        { key: 6, label: "尺码名称", visible: true },
        { key: 7, label: "尺码编码", visible: true },
        { key: 8, label: "颜色id", visible: true },
        { key: 9, label: "颜色编码", visible: true },
        { key: 10, label: "颜色名称", visible: false },
        { key: 11, label: "生产数量", visible: false },
        { key: 12, label: "床次", visible: false },
        { key: 13, label: "开始扎号", visible: false },
        { key: 14, label: "结束扎号", visible: false },
        { key: 15, label: "单位id", visible: false },
        { key: 20, label: "数据状态", visible: false },
        { key: 21, label: "顺序号", visible: false },
      ],
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询服装生产批次列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listErpProMakeBatch(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ErpProMakeBatchList = content;
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
        batchNo: null,
        sizeName: null,
        sizeCode: null,
        colorId: null,
        colorCode: null,
        colorName: null,
        makeNum: null,
        bedNo: null,
        pkgStartNo: null,
        pkgEndNo: null,
        empId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        seqNo: null
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
      this.title = "添加服装生产批次";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getErpProMakeBatch(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改服装生产批次";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateErpProMakeBatch(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addErpProMakeBatch(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除服装生产批次编号为"' + ids + '"的数据项？').then(function () {
        return delErpProMakeBatch(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有服装生产批次数据项？').then(() => {
        this.exportLoading = true;
        return exportErpProMakeBatch(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
