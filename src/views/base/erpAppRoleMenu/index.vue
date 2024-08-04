<template>
  <!-- <div class="app-container"> -->
  <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
      size="medium"
      class="ry_form"
    >
      <el-form-item label="角色id" prop="roleId">
        <el-input
          v-model.trim="queryParams.roleId"
          placeholder="请输入角色id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="菜单id" prop="menuId">
        <el-input
          v-model.trim="queryParams.menuId"
          placeholder="请输入菜单id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
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
          v-hasPermi="['base:erpAppRoleMenu:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['base:erpAppRoleMenu:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['base:erpAppRoleMenu:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['base:erpAppRoleMenu:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        :columns="columns"
      ></right-toolbar>
    </el-row> -->

  <!-- <WmsTable v-loading="loading" :data="erpAppRoleMenuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色id" align="center" prop="roleId" v-if="columns[0].visible"/>
      <el-table-column label="菜单id" align="center" prop="menuId" v-if="columns[1].visible"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:erpAppRoleMenu:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:erpAppRoleMenu:remove']"
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
    /> -->

  <!-- 添加或修改角色菜单表对话框 -->
  <!-- <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="108px"
        inline
        class="dialog-form-two"
      >
        <el-form-item label="主键id" prop="id">
          <el-input v-model.trim="form.id" placeholder="请输入主键id" />
        </el-form-item>
        <el-form-item label="角色id" prop="roleId">
          <el-input v-model.trim="form.roleId" placeholder="请输入角色id" />
        </el-form-item>
        <el-form-item label="菜单id" prop="menuId">
          <el-input v-model.trim="form.menuId" placeholder="请输入菜单id" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
   
  </div> -->

  <div style="padding:10px 10px" class="app-container">
    <el-row type="flex" :gutter="40" style="height:24px"><el-col :offset="1" :span="3"><i class="el-icon-user-solid iconsize"></i><span class="titletext"><b>系统角色</b></span></el-col>
    <el-col :span="20"><span class="titletext"><b>功能菜单授权</b></span></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4"
        >
          <el-tree
            :data="roleData"
            :props="defaultProps"
            node-key="roleId"
            show-checkbox
            ref="tree"
            accordion
            @node-click="handleNodeClick"
            @check-change="handleCheckChange"
          >
          </el-tree>
      </el-col>
      <el-col :span="20">
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入城市拼音"
            v-model="selectMenu"
            :data="menuData"
            :props="transProps"
            :titles="transfTitle"
            @change="handleChange"
          >
          </el-transfer>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listErpAppRoleMenu,
  getErpAppRoleMenu,
  delErpAppRoleMenu,
  addErpAppRoleMenu,
  saveErpAppRoleMenu,
  updateErpAppRoleMenu,
  exportErpAppRoleMenu,
} from "@/api/base/erpAppRoleMenu";
import { listErpAppMenu, getErpAppMenuByRoleId } from "@/api/base/erpAppMenu";
import { listRole } from "@/api/system/role";

export default {
  name: "ErpAppRoleMenu",
  data() {
    return {
      transfTitle:['未授权功能','已授权功能'],
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
      // 角色菜单表表格数据
      erpAppRoleMenuList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleId: null,
        menuId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      columns: [
        { key: 1, label: "角色id", visible: true },
        { key: 2, label: "菜单id", visible: true },
      ],
      defaultHeight: {
        height: "",
      },
      roleData: [
        { id: "1", label: "管理员1", children: [] },
        { id: "2", label: "管理员2", children: [] },
        { id: "3", label: "管理员3", children: [] },
      ],
      defaultProps: {
        label: "roleName",
        children: "children",
      },
      menuData: [],
      transProps: {
        key: "id",
        label: "menuName",
      },
      selectMenu: [],
      roleId:null,
    };
  },
  created() {
    this.getList();
    this.getMenuList();
  },
  methods: {
    filterMethod(query, item) {
      return item.menuName.indexOf(query) > -1;
    },
    //获取菜单列表
    getMenuList() {
      const menuePageReq = { page: 0, size: 9999999 };
      const menuQuery = {};
      //获取角色
      listRole(menuQuery, menuePageReq).then((response) => {
        const { rows, total } = response;
        this.roleData = rows;
      });
      //获取所有菜单
      listErpAppMenu(menuQuery, menuePageReq).then((response) => {
        const { content, totalElements } = response;
        this.menuData = content;
      });
    },
    handleCheckChange(data, checked, indeterminate){
      console.log(JSON.stringify(data));
      console.log(JSON.stringify(checked));
      console.log(JSON.stringify(indeterminate));
      if(checked){
        this.$refs.tree.setCheckedKeys([data.roleId]);
        this.roleId=data.roleId;
        //获取角色的所有菜单
        getErpAppMenuByRoleId(data.roleId).then((response) => {
          this.selectMenu=[];
          for (let item of response) {
            this.selectMenu.push(item.id);
          }
        });
      }else{
        this.selectMenu=[];
        this.roleId=null;
      }
    },
    handleNodeClick(data) {
      this.roleId=data.roleId;
      this.$refs.tree.setCheckedKeys([data.roleId]);
    },
    /** 查询角色菜单表列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = {
        ...this.queryParams,
        pageNum: undefined,
        pageSize: undefined,
      };
      const pageReq = { page: pageNum - 1, size: pageSize };
      listErpAppRoleMenu(query, pageReq).then((response) => {
        const { content, totalElements } = response;
        this.erpAppRoleMenuList = content;
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
        roleId: null,
        menuId: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加角色菜单表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getErpAppRoleMenu(id).then((response) => {
        this.form = response;
        this.open = true;
        this.title = "修改角色菜单表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateErpAppRoleMenu(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addErpAppRoleMenu(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除角色菜单表编号为"' + ids + '"的数据项？')
        .then(function () {
          return delErpAppRoleMenu(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal
        .confirm("是否确认导出所有角色菜单表数据项？")
        .then(() => {
          this.exportLoading = true;
          return exportErpAppRoleMenu(queryParams);
        })
        .then((response) => {
          this.$download.download(response);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
    //保存授权信息
    handleChange(value, direction, movedKeys){
      const paramData = {roleId:this.roleId,menuIdList:this.selectMenu}
      console.log(JSON.stringify(paramData));
      saveErpAppRoleMenu(paramData);
    },
  },
};
</script>

<style>
.el-transfer-panel__list.is-filterable{
  height: 80vh;
  width: 40vh;
}
.el-transfer-panel__body{
  height: 80vh;
  width: 40vh;
}
.el-transfer-panel{
height: 80vh;
width: 40vh;
}
.titletext{
  font-size: 16px;
}
.iconsize{
  height: 20px;
  width: 20px;
  color: rgb(64, 158, 255);
}
.realheight {
  height: calc(100vh - 140px);
}
.pageheight {
  height: calc(100vh - 140px);
  padding: 10px 10px;
}
.el-transfer {
  flex: 1;
  width: 100%;
  height: 100%;
}
.greenbg {
  background-color: aqua;
}
.yellowbg {
  background-color: yellow;
}
</style>>