<template>
  <div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button type="primary" icon="plus" @click="addPractice"
          >新增实验</el-button
        >
      </div>
      <el-table :data="tableData" row-key="ID">
        <el-table-column align="left" label="ID" min-width="50" prop="ID" />
        <el-table-column
          align="left"
          label="实验名称"
          min-width="150"
          prop="name"
        />
        <el-table-column
          align="left"
          label="实验描述"
          min-width="150"
          prop="description"
        />
        <el-table-column
          align="left"
          label="实验分数"
          min-width="180"
          prop="score"
        />

        <el-table-column label="操作" min-width="250" fixed="right">
          <template #default="scope">
            <el-popover v-model="scope.row.visible" placement="top" width="160">
              <p>确定要删除此实验吗</p>
              <div style="text-align: right; margin-top: 8px">
                <el-button
                  type="primary"
                  link
                  @click="scope.row.visible = false"
                  >取消</el-button
                >
                <el-button type="primary" @click="deletePracticeFunc(scope.row)"
                  >确定</el-button
                >
              </div>
              <template #reference>
                <el-button type="primary" link icon="delete">删除</el-button>
              </template>
            </el-popover>
            <el-button
              type="primary"
              link
              icon="edit"
              @click="openEdit(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <el-dialog
      v-model="addPracticeDialog"
      custom-class="Practice-dialog"
      title="实验"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height: 60vh; overflow: auto; padding: 0 12px">
        <el-form
          ref="practiceForm"
          :rules="rules"
          :model="practiceInfo"
          label-width="80px"
        >
          <el-form-item
            label="实验名"
            prop="practiceName"
          >
            <el-input v-model="practiceInfo.name" />
          </el-form-item>
          <el-form-item label="实验描述" prop="practiceDescription">
            <el-input v-model="practiceInfo.description" />
          </el-form-item>
          <el-form-item label="实验分数" prop="practiceScore">
            <el-input v-model="practiceInfo.score" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeAddPracticeDialog">取 消</el-button>
          <el-button type="primary" @click="enterAddPracticeDialog"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, ref, watch, onMounted } from "vue";
import { ElDatePicker,ElMessage } from "element-plus";
import CustomPic from "@/components/customPic/index.vue";
import ChooseImg from "@/components/chooseImg/index.vue";
import WarningBar from "@/components/warningBar/warningBar.vue";
import { queryPractice, insertPractice,updatePractice,deletePractice } from "@/api/practice.js";

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([]);

const practiceForm = ref({});

const practiceInfo = ref({
  name: "",
  description: "",
  score: "",
});


onMounted(() => {
  getTableData();
});

const openEdit = (row) => {
  console.log('111',row)
  dialogFlag.value = "edit";
  practiceInfo.value = JSON.parse(JSON.stringify(row));
  addPracticeDialog.value = true;
};
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val;
  getTableData();
};

const handleCurrentChange = (val) => {
  page.value = val;
  getTableData();
};

// 获取实验列表
const getTableData = async() => {
  const table = await queryPractice({ page: page.value, pageSize: pageSize.value })
  console.log('table',table)
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

const deletePracticeFunc = async (row) => {
  console.log('deletePracticeFunc',row)
  const res = await deletePractice({ practiceId: row.ID });
  console.log('resresres',res);
  if (res.code === 0) {
    ElMessage.success("删除成功");
    row.visible = false;
    await getTableData();
  }
};
// 新增
const enterAddPracticeDialog = async () => {
  practiceForm.value.validate(async (valid) => {
    if (valid) {
      if (dialogFlag.value === "add") {
        let query = {
          description: practiceInfo.value.description,
          name: practiceInfo.value.name,
          score: Number(practiceInfo.value.score),
        };
        console.log('88888',query)
        const result = await insertPractice(query);
        if (result.code === 0) {
          ElMessage({ type: "success", message: "创建成功" });
          await getTableData();
          closeAddPracticeDialog();
        }
      }
      if (dialogFlag.value === "edit") {
        let query = {
          description: practiceInfo.value.description,
          name: practiceInfo.value.name,
          score: Number(practiceInfo.value.score),
          practiceId: Number(practiceInfo.value.ID)
        };
        console.log('9999',practiceInfo.value)
        const result = await updatePractice(query);
        if (result.code === 0) {
          ElMessage({ type: "success", message: "编辑成功" });
          await getTableData();
          closeAddPracticeDialog();
        }
      }
    }
  });
};

const addPracticeDialog = ref(false);
const closeAddPracticeDialog = () => {
  practiceForm.value.resetFields();
  addPracticeDialog.value = false;
};

const dialogFlag = ref("add");

// 新增
const addPractice = () => {
  dialogFlag.value = "add";
  addPracticeDialog.value = true;
};
const switchEnable = async (row) => {
  practiceInfo.value = JSON.parse(JSON.stringify(row));
  await nextTick();
  const req = {
    ...practiceInfo.value,
  };
  const res = await setPracticeInfo(req);
  if (res.code === 0) {
    ElMessage({
      type: "success",
      message: `${req.enable === 2 ? "禁用" : "启用"}成功`,
    });
    await getTableData();
  }
};
</script>

<style></style>
