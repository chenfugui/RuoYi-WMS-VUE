<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="产品id" prop="proId">
        <el-select v-model="queryParams.proId" placeholder="请选择产品" @change="handleQuery">
          <el-option v-for="pro in erpProList" :key="pro.proId" :label="pro.proName" :value="pro.proId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品生产编码" prop="proMakeNo">
        <el-input v-model.trim="queryParams.proMakeNo" placeholder="请输入产品生产编码" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="生产开始时间" prop="makeStartTime">
        <el-date-picker clearable size="small" v-model="queryParams.makeStartTime" type="datetime"
          value-format="yyyy-MM-ddTHH:mm:ss" placeholder="选择生产开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="生产结束时间" prop="makeEndTime">
        <el-date-picker clearable size="small" v-model="queryParams.makeEndTime" type="datetime"
          value-format="yyyy-MM-ddTHH:mm:ss" placeholder="选择生产结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="交付时间" prop="deliverTime">
        <el-date-picker clearable size="small" v-model="queryParams.deliverTime" type="datetime"
          value-format="yyyy-MM-ddTHH:mm:ss" placeholder="选择交付时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="生产状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" @change="handleQuery">
          <el-option v-for="dict in dict.type.pro_make_status" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位id" prop="empId">
        <el-input v-model.trim="queryParams.empId" placeholder="请输入单位id" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <template v-if="showMoreCondition">
        <el-form-item label="顺序号" prop="seqNo">
          <el-input v-model.trim="queryParams.seqNo" placeholder="请输入顺序号" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="数据状态" prop="delFlag">
          <el-input v-model.trim="queryParams.delFlag" placeholder="请输入" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item> -->
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
          v-hasPermi="['base:erpProMake:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['base:erpProMake:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['base:erpProMake:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" :loading="exportLoading"
          @click="handleExport" v-hasPermi="['base:erpProMake:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ErpProMakeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="产品id" align="center" prop="proId" v-if="columns[0].visible" />
      <el-table-column label="产品生产编码" align="center" prop="proMakeNo" v-if="columns[1].visible" />
      <el-table-column label="生产开始时间" align="center" prop="makeStartTime" width="180" v-if="columns[2].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.makeStartTime, '') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产结束时间" align="center" prop="makeEndTime" width="180" v-if="columns[3].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.makeEndTime, '') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交付时间" align="center" prop="deliverTime" width="180" v-if="columns[4].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deliverTime, '') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产状态" align="center" prop="status" v-if="columns[5].visible" />
      <el-table-column label="单位id" align="center" prop="empId" v-if="columns[6].visible" />
      <el-table-column label="顺序号" align="center" prop="seqNo" v-if="columns[7].visible" />
      <!-- <el-table-column label="数据状态" align="center" prop="delFlag" v-if="columns[8].visible" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['base:erpProMake:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['base:erpProMake:remove']">删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改服装生产管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="产品" prop="proId">
          <el-select v-model="form.proId" placeholder="请选择产品">
            <el-option v-for="pro in erpProList" :key="pro.proId" :label="pro.proName" :value="pro.proId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品生产编码" prop="proMakeNo">
          <el-input v-model.trim="form.proMakeNo" placeholder="请输入产品生产编码" />
        </el-form-item>
        <el-form-item label="生产开始时间" prop="makeStartTime">
          <el-date-picker clearable size="small" v-model="form.makeStartTime" type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss" placeholder="选择生产开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生产结束时间" prop="makeEndTime">
          <el-date-picker clearable size="small" v-model="form.makeEndTime" type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss" placeholder="选择生产结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交付时间" prop="deliverTime">
          <el-date-picker clearable size="small" v-model="form.deliverTime" type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss" placeholder="选择交付时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生产状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option v-for="dict in dict.type.pro_make_status" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位id" prop="empId">
          <el-input v-model.trim="form.empId" placeholder="请输入单位id" />
        </el-form-item>
        <el-form-item label="顺序号" prop="seqNo">
          <el-input v-model.trim="form.seqNo" placeholder="请输入顺序号" />
        </el-form-item>
        <!-- <el-form-item label="数据状态" prop="delFlag">
          <el-input v-model.trim="form.delFlag" placeholder="请输入dr 1 正常  2  删除" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listErpProMake, getErpProMake, delErpProMake, addErpProMake, updateErpProMake, exportErpProMake } from "@/api/base/erpProMake";
import { listErpPro } from "@/api/base/erpPro";
export default {
  name: "ErpProMake",
  dicts: ['pro_make_status'],
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
      // 服装生产管理表格数据
      ErpProMakeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        proId: null,
        proMakeNo: null,
        makeStartTime: null,
        makeEndTime: null,
        deliverTime: null,
        status: null,
        empId: null,
        seqNo: null,
        delFlag: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
        { key: 1, label: "产品id", visible: true },
        { key: 2, label: "产品生产编码", visible: true },
        { key: 3, label: "生产开始时间", visible: true },
        { key: 4, label: "生产结束时间", visible: true },
        { key: 5, label: "交付时间", visible: true },
        { key: 6, label: "生产状态: 1 正常  2 停止 3 作废", visible: true },
        { key: 7, label: "单位id", visible: true },
        { key: 8, label: "顺序号", visible: true },
        { key: 13, label: "数据状态", visible: false },
      ],
      showMoreCondition: false,
      erpProList: [],
    };
  },
  created() {
    this.getList();
    this.getProductList();
  },
  methods: {
    /** 查询服装生产管理列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listErpProMake(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ErpProMakeList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    getProductList() {
      const pageReq = { page: 0, size: 999999 };
      const proQuery = {};
      listErpPro(proQuery, pageReq).then(response => {
        const { content, totalElements } = response
        this.erpProList = content;
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
        proMakeNo: null,
        makeStartTime: null,
        makeEndTime: null,
        deliverTime: null,
        status: "0",
        empId: null,
        seqNo: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
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
      this.getProductList();
      this.reset();
      this.open = true;
      this.title = "添加服装生产管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getErpProMake(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改服装生产管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateErpProMake(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addErpProMake(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除服装生产管理编号为"' + ids + '"的数据项？').then(function () {
        return delErpProMake(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有服装生产管理数据项？').then(() => {
        this.exportLoading = true;
        return exportErpProMake(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => { });
    }
  }
};
</script>
