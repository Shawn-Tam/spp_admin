<template>
  <div>
    <div class="gva-table-box">
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <el-table-column align="left" label="ID" min-width="50" prop="ID" />
        <el-table-column align="left" label="学生班级" min-width="150" prop="class" />
        <el-table-column align="left" label="学生姓名" min-width="150" prop="stuName" />
        <el-table-column align="left" label="学生学号" min-width="150" prop="stuNumber" />
        <el-table-column align="left" label="作业名称" min-width="150" prop="taskName" />
        <el-table-column align="left" label="得分" min-width="180" prop="score" />
        <el-table-column align="left" label="提交时间" min-width="180" prop="submitTime" />

        <el-table-column label="操作" min-width="250" fixed="right">
          <template #default="scope">
            <el-button type="primary" link icon="query" @click="openQuery(scope.row)">查询实验列表</el-button>
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
      <div style="height:60vh;overflow:auto;padding:0 12px;">
        <el-table :data="practicesScore" style="width: 100%" stripe>
          <el-table-column prop="practiceName" label="实验名称" min-width="100" />
          <el-table-column prop="practiceDescription" label="实验描述" min-width="300" />
          <el-table-column prop="code" label="实验代码" min-width="300" />
          <el-table-column prop="score" label="实验分数" min-width="100" />
        </el-table>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeQueryPracticeDialog">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([
  {
    ID: '1',
    class: '计科192',
    stuName: '谭少康',
    stuNumber: '20191514203',
    taskName: '查询SQL',
    score: 10,
    submitTime: '2023-5-10 14:10:18',
  },
])
const dialogFlag = ref('query')
const queryPracticeDialog = ref(false)
const practicesScore = ref([
  {
    practiceName: '查询SQL',
    practiceDescription: '写一个sql代码, 查询user表',
    code: 'select * from users',
    score: 4
  },
  {
    practiceName: '插入SQL',
    practiceDescription: '写一个sql代码, 查询user表',
    code: 'insert * from users',
    score: 0
  },
  {
    practiceName: '删除SQL',
    practiceDescription: '写一个sql代码, 查询user表',
    code: 'delete * from users',
    score: 4
  }
])
const openQuery = (row) => {
  dialogFlag.value = 'query'
  // practicesScore.value = JSON.parse(JSON.stringify(row))
  queryPracticeDialog.value = true
}
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 查询
const getTableData = async() => {
  const table = await getScoreList({ page: page.value, pageSize: pageSize.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

const initPage = async() => {
  getTableData()
}

initPage()

const closeQueryPracticeDialog = () => {
  queryPracticeDialog.value = false
}

</script>

<style>

</style>
