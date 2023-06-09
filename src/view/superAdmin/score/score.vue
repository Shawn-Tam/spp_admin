<template>
  <div>
    <div class="gva-table-box">
      <el-table :data="tableData" row-key="ID">
        <el-table-column align="left" label="ID" min-width="50" prop="ID" />
        <el-table-column
          align="left"
          label="学生班级"
          min-width="150"
          prop="class"
        />
        <el-table-column
          align="left"
          label="学生姓名"
          min-width="150"
          prop="stuName"
        />
        <el-table-column
          align="left"
          label="学生学号"
          min-width="150"
          prop="stuNumber"
        />
        <el-table-column
          align="left"
          label="作业名称"
          min-width="150"
          prop="taskName"
        />
        <el-table-column
          align="left"
          label="得分"
          min-width="180"
          prop="score"
        />
        <el-table-column
          align="left"
          label="提交时间"
          min-width="180"
          prop="CreatedAt"
        />
        <el-table-column
          align="left"
          label="教师评语"
          min-width="180"
          prop="feedback"
        />
        <el-table-column label="操作" min-width="250" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              link
              icon="query"
              @click="openQuery(scope.row)"
              >查询实验列表</el-button
            >
            <el-button
              type="primary"
              link
              icon="query"
              @click="feedback(scope.row)"
              >反馈</el-button
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
      v-model="queryPracticeDialog"
      custom-class="Practice-dialog"
      title="实验列表"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height: 60vh; overflow: auto; padding: 0 12px">
        <el-table :data="practicesScore" style="width: 100%" stripe>
          <el-table-column prop="name" label="实验名称" min-width="100" />
          <el-table-column
            prop="description"
            label="实验描述"
            min-width="300"
          />
          <el-table-column prop="code" label="实验代码" min-width="300" />
          <el-table-column prop="score" label="实验分数" min-width="100" />
          <el-table-column label="操作" min-width="100" fixed="right">
            <template #default="scope">
              <el-button
                type="primary"
                link
                icon="query"
                @click="giveScore(scope.row)"
                >打分</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeQueryPracticeDialog">关 闭</el-button>
          <el-button type="primary" @click="addQueryPracticeDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 弹窗 -->
    <el-dialog
      :title="dialogType === 'feedback' ? '教室评语' : '打分'"
      v-model="isShowDialogForm"
      class="feedback-box"
    >
      <el-form :model="formData" v-if="dialogType === 'feedback'">
        <el-form-item label="教室评语" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="formData.feedback"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="formData" v-if="dialogType === 'giveScore'">
        <el-form-item label="分数" :label-width="formLabelWidth">
          <el-input v-model="formData.score" autocomplete="off">
            <template #append>分</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialogForm = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, ref, watch, onMounted } from "vue";
// getExamUserTaskList
import {
  getExamUserTaskList,
  taskFeedback,
  getExamTaskList,
} from "@/api/task.js";
import { queryPracticeById, practiceFeedback } from "@/api/practice.js";
import { ElMessage } from "element-plus";

const page = ref(1);
const total = ref(0);
const pageSize = ref(10);
const tableData = ref([
  // {
  //   ID: "1",
  //   class: "计科192",
  //   stuName: "谭少康",
  //   stuNumber: "20191514203",
  //   taskName: "查询SQL",
  //   score: 10,
  //   submitTime: "2023-5-10 14:10:18",
  //   feedback: "",
  // },
]);
const formData = ref({
  feedback: "",
  score: 0,
});
const dialogFlag = ref("query");
const queryPracticeDialog = ref(false);
const isShowDialogForm = ref(false);
const dialogType = ref("feedback");
const formLabelWidth = "120px";
const practicesScore = ref([]);
let openQueryRowInfo = ref({})
const openQuery = async (row) => {
  openQueryRowInfo.value = row
  dialogFlag.value = "query";
  queryPracticeDialog.value = true;
  getQueryPracticeList(row)
};
// 获取实验
const getQueryPracticeList = async (row) => {
  const result = await queryPracticeById(row.taskId);
  if (result.code === 0) {
    practicesScore.value = result.data.list;
  }
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

// 查询
const getTableData = async () => {
  const table = await getExamUserTaskList({
    page: page.value,
    pageSize: pageSize.value,
  });
  if (table.code === 0) {
    tableData.value = table.data.list;
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }
};
let rowInfo = ref({});
// 反馈
const feedback = (val) => {
  console.log("11111", val);
  rowInfo.value = val;
  isShowDialogForm.value = true;
  dialogType.value = "feedback";
};
const submit = async () => {
  isShowDialogForm.value = false;
  // 调接口
  if (dialogType.value === "feedback") {
    let query = {
      taskId: rowInfo.value.taskId,
      comment: formData.value.feedback,
    };
    const result = await taskFeedback(query);
    if (result.code === 0) {
      ElMessage({ type: "success", message: "反馈成功" });
      getTableData()
    } else {
      ElMessage({ type: "success", message: "反馈失败" });
    }
  } else if (dialogType.value === "giveScore") {
    let query = {
      taskId: rowInfo.value.taskId,
      score: Number(formData.value.score),
    };
    const result = await practiceFeedback(query);
    console.log("result", result);
    if (result.code === 0) {
      ElMessage({ type: "success", message: "打分成功" });
      getQueryPracticeList(openQueryRowInfo.value)
      getTableData()
    } else {
      ElMessage({ type: "success", message: "打分失败" });
    }
  }
};
// 打分
const giveScore = (val) => {
  dialogType.value = "giveScore";
  isShowDialogForm.value = true;
  console.log("giveScore", val);
};

const closeQueryPracticeDialog = () => {
  queryPracticeDialog.value = false;
};
const addQueryPracticeDialog = () => {
  queryPracticeDialog.value = false;
}

onMounted(() => {
  getTableData();
});
</script>

<style scoped>
.feedback-box .dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
