<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="生产批次" prop="batchId">
        <el-input
          v-model.trim="queryParams.batchId"
          placeholder="请输入生产批次"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工序Id" prop="stepId">
        <el-input
          v-model.trim="queryParams.stepId"
          placeholder="请输入工序Id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产状态" prop="makeStatus">
        <el-select v-model="queryParams.makeStatus" placeholder="请选择生产状态" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="实际生产数量" prop="realMakeNum">
        <el-input
          v-model.trim="queryParams.realMakeNum"
          placeholder="请输入实际生产数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单位id" prop="empId">
        <el-input
          v-model.trim="queryParams.empId"
          placeholder="请输入单位id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扫描人" prop="scanBy">
        <el-input
          v-model.trim="queryParams.scanBy"
          placeholder="请输入扫描人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扫描时间" prop="scanTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.scanTime"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择扫描时间">
        </el-date-picker>
      </el-form-item>
      <template v-if="showMoreCondition">
      <el-form-item label="创建人" prop="creater">
        <el-input
          v-model.trim="queryParams.creater"
          placeholder="请输入创建人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新人" prop="updater">
        <el-input
          v-model.trim="queryParams.updater"
          placeholder="请输入更新人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工资" prop="salary">
        <el-input
          v-model.trim="queryParams.salary"
          placeholder="请输入工资"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['base:ErpProBatchExe:add']"
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
          v-hasPermi="['base:ErpProBatchExe:edit']"
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
          v-hasPermi="['base:ErpProBatchExe:remove']"
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
          v-hasPermi="['base:ErpProBatchExe:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ErpProBatchExeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="生产批次" align="center" prop="batchId" v-if="columns[0].visible"/>
      <el-table-column label="工序Id" align="center" prop="stepId" v-if="columns[1].visible"/>
      <el-table-column label="生产状态" align="center" prop="makeStatus" v-if="columns[2].visible"/>
      <el-table-column label="实际生产数量" align="center" prop="realMakeNum" v-if="columns[3].visible"/>
      <el-table-column label="单位id" align="center" prop="empId" v-if="columns[4].visible"/>
      <el-table-column label="扫描人" align="center" prop="scanBy" v-if="columns[5].visible"/>
      <el-table-column label="扫描时间" align="center" prop="scanTime" width="180" v-if="columns[6].visible">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.scanTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="creater" v-if="columns[7].visible"/>
      <el-table-column label="更新人" align="center" prop="updater" v-if="columns[8].visible"/>
      <el-table-column label="工资" align="center" prop="salary" v-if="columns[9].visible"/>
      <el-table-column label="dr 1 正常  2  删除" align="center" prop="dr" v-if="columns[10].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:ErpProBatchExe:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:ErpProBatchExe:remove']"
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

    <!-- 添加或修改服装生产进度对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="生产批次" prop="batchId">
          <el-input v-model.trim="form.batchId" placeholder="请输入生产批次" />
        </el-form-item>
        <el-form-item label="工序Id" prop="stepId">
          <el-input v-model.trim="form.stepId" placeholder="请输入工序Id" />
        </el-form-item>
        <el-form-item label="生产状态">
          <el-radio-group v-model="form.makeStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="实际生产数量" prop="realMakeNum">
          <el-input v-model.trim="form.realMakeNum" placeholder="请输入实际生产数量" />
        </el-form-item>
        <el-form-item label="单位id" prop="empId">
          <el-input v-model.trim="form.empId" placeholder="请输入单位id" />
        </el-form-item>
        <el-form-item label="扫描人" prop="scanBy">
          <el-input v-model.trim="form.scanBy" placeholder="请输入扫描人" />
        </el-form-item>
        <el-form-item label="扫描时间" prop="scanTime">
          <el-date-picker clearable size="small"
                        v-model="form.scanTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择扫描时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建人" prop="creater">
          <el-input v-model.trim="form.creater" placeholder="请输入创建人" />
        </el-form-item>
        <el-form-item label="更新人" prop="updater">
          <el-input v-model.trim="form.updater" placeholder="请输入更新人" />
        </el-form-item>
        <el-form-item label="工资" prop="salary">
          <el-input v-model.trim="form.salary" placeholder="请输入工资" />
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
import { listErpProBatchExe, getErpProBatchExe, delErpProBatchExe, addErpProBatchExe, updateErpProBatchExe, exportErpProBatchExe } from "@/api/base/erpProBatchExe";

export default {
  name: "ErpProBatchExe",
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
      // 服装生产进度表格数据
      ErpProBatchExeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        batchId: null,
        stepId: null,
        makeStatus: null,
        realMakeNum: null,
        empId: null,
        scanBy: null,
        scanTime: null,
        creater: null,
        updater: null,
        salary: null,
        dr: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columns: [
            { key: 1, label: "生产批次", visible:  true  },
            { key: 2, label: "工序Id", visible:  true  },
            { key: 3, label: "生产状态", visible:  true  },
            { key: 4, label: "实际生产数量", visible:  true  },
            { key: 5, label: "单位id", visible:  true  },
            { key: 6, label: "扫描人", visible:  true  },
            { key: 7, label: "扫描时间", visible:  true  },
            { key: 8, label: "创建人", visible:  true  },
                { key: 10, label: "更新人", visible:  false  },
                { key: 12, label: "工资", visible:  false  },
            { key: 13, label: "dr 1 正常  2  删除", visible:  false  },
         ],
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询服装生产进度列表 */
    getList() {
      this.loading = true;
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listErpProBatchExe(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ErpProBatchExeList = content;
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
        batchId: null,
        stepId: null,
        makeStatus: "0",
        realMakeNum: null,
        empId: null,
        scanBy: null,
        scanTime: null,
        creater: null,
        createTime: null,
        updater: null,
        updateTime: null,
        salary: null,
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
      this.title = "添加服装生产进度";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getErpProBatchExe(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改服装生产进度";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateErpProBatchExe(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addErpProBatchExe(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除服装生产进度编号为"' + ids + '"的数据项？').then(function() {
        return delErpProBatchExe(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有服装生产进度数据项？').then(() => {
        this.exportLoading = true;
        return exportErpProBatchExe(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
