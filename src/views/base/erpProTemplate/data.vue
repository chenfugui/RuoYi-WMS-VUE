<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
        <el-form-item label="模板" prop="tmpId">
          <el-select v-model="selectTmpId" placeholder="请选择模板" clearable size="small">
              <el-option
                v-for="item in tmpList"
                :key="item.id"
                :label="item.tmpName"
                :value="item.id"
              />
          </el-select>
        </el-form-item>
        <el-form-item label="模板编码" prop="tmpCode">
          <el-input
            v-model.trim="queryParams.tmpCode"
            placeholder="请输入模板编码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="项目编码" prop="itemCode">
          <el-input
            v-model.trim="queryParams.itemCode"
            placeholder="请输入项目编码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="项目名称" prop="itemName">
          <el-input
            v-model.trim="queryParams.itemName"
            placeholder="请输入项目名称"
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
            v-hasPermi="['base:erpProTemplateDetail:add']"
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
            v-hasPermi="['base:erpProTemplateDetail:edit']"
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
            v-hasPermi="['base:erpProTemplateDetail:remove']"
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
            v-hasPermi="['base:erpProTemplateDetail:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
      </el-row>
  
      <WmsTable v-loading="loading" :data="ErpProTemplateDetailList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="模板" align="center" prop="tmpId" v-if="columns[0].visible">
          <template slot-scope="scope">
              <dict-tag :options="dict.type.tmp_type" :value="scope.row.tmpId"/>
          </template>
        </el-table-column>
        <el-table-column label="模板编码" align="center" prop="tmpCode" v-if="columns[1].visible"/>
        <el-table-column label="项目编码" align="center" prop="itemCode" v-if="columns[2].visible"/>
        <el-table-column label="项目名称" align="center" prop="itemName" v-if="columns[3].visible"/>
        <el-table-column label="备注" align="center" prop="itemMemo" v-if="columns[4].visible"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['base:erpProTemplateDetail:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['base:erpProTemplateDetail:remove']"
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
  
      <!-- 添加或修改模板项目明细管理对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
          <el-form-item label="模板" prop="tmpId">
            <el-select v-model="form.tmpId" placeholder="请选择模板">
              <el-option
                v-for="dict in dict.type.tmp_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"            ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板编码" prop="tmpCode">
            <el-input v-model.trim="form.tmpCode" placeholder="请输入模板编码" />
          </el-form-item>
          <el-form-item label="项目编码" prop="itemCode">
            <el-input v-model.trim="form.itemCode" placeholder="请输入项目编码" />
          </el-form-item>
          <el-form-item label="项目名称" prop="itemName">
            <el-input v-model.trim="form.itemName" placeholder="请输入项目名称" />
          </el-form-item>
          <el-form-item label="备注" prop="itemMemo">
            <el-input v-model="form.itemMemo" type="textarea" placeholder="请输入内容" />
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
  import { listErpProTemplateDetail, getErpProTemplateDetail, delErpProTemplateDetail, addErpProTemplateDetail, updateErpProTemplateDetail, exportErpProTemplateDetail } from "@/api/base/erpProTemplateDetail";
  import { getErpProTemplate,listErpProTemplate } from "@/api/base/erpProTemplate";

  export default {
    name: "TemplateData",
    dicts: ['tmp_type'],
    data() {
      return {
        selectTmpId:0,
        tmpList:[],
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
        // 模板项目明细管理表格数据
        ErpProTemplateDetailList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          tmpId: null,
          tmpCode: null,
          itemCode: null,
          itemName: null,
          itemMemo: null,
        },
        // 表单参数
        form: {
          tmpId: null,
          tmpCode: null,
          itemCode: null,
          itemName: null,
          itemMemo: null,
          seqNo: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          empId: null
        },
        // 表单校验
        rules: {
        },
        columns: [
              { key: 1, label: "模板", visible:  true  },
              { key: 2, label: "模板编码", visible:  true  },
              { key: 3, label: "项目编码", visible:  true  },
              { key: 4, label: "项目名称", visible:  true  },
              { key: 5, label: "备注", visible:  true  },
                                       ],
      };
    },
    created() {
      const tmpId = this.$route.params.tmpId;
      console.info("tmpid--------------"+tmpId);
      if (tmpId) {
        this.queryParams.tmpId = tmpId;
        this.form.tmpId = parseInt(tmpId);
        this.form.tmpName = this.$route.query.tmpName;
        this.getTemplateDetails(tmpId);
      }
      this.getList();
    },
    methods: {
      /** 查询模板项目明细管理列表 */
      getList() {
        this.loading = true;
        const {pageNum, pageSize} = this.queryParams;
        const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
        const pageReq = {page: pageNum - 1, size: pageSize};
        listErpProTemplateDetail(query, pageReq).then(response => {
          const { content, totalElements } = response
          this.ErpProTemplateDetailList = content;
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
          tmpId: null,
          tmpCode: null,
          itemCode: null,
          itemName: null,
          itemMemo: null,
          seqNo: null,
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
        this.title = "添加模板项目明细管理";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getErpProTemplateDetail(id).then(response => {
          this.form = response;
          this.open = true;
          this.title = "修改模板项目明细管理";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateErpProTemplateDetail(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addErpProTemplateDetail(this.form).then(response => {
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
        this.$modal.confirm('是否确认删除模板项目明细管理编号为"' + ids + '"的数据项？').then(function() {
          return delErpProTemplateDetail(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$modal.confirm('是否确认导出所有模板项目明细管理数据项？').then(() => {
          this.exportLoading = true;
          return exportErpProTemplateDetail(queryParams);
        }).then(response => {
          this.$download.download(response);
          this.exportLoading = false;
        }).catch(() => {});
      },
      getTemplateDetails(tmpId) {
        console.info(tmpId);
        getErpProTemplate(tmpId).then(response => {
         this.tmpList=[];
         this.tmpList.push(response);
         this.selectTmpId=tmpId;
         console.log(this.tmpList);
          this.form.tmpCode = response.tmpCode;
          this.form.tmpId = response.tmpId;
          this.form.tmpName = response.tmpName;
        });
      },
    }
  };
  </script>
  