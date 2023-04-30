<template>
  <div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button type="primary" icon="plus" @click="addTask">新增作业</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <el-table-column align="left" label="ID" min-width="50" prop="ID" />
        <el-table-column align="left" label="作业名称" min-width="150" prop="taskName" />
        <el-table-column align="left" label="作业描述" min-width="150" prop="taskDescription" />
        <el-table-column align="left" label="作业分数" min-width="180" prop="taskScore" />
        <el-table-column align="left" label="开始时间" min-width="180" prop="startTime" />
        <el-table-column align="left" label="截止时间" min-width="200" prop="endTime" />
        <el-table-column align="left" label="关联实验" min-width="200" prop="practices">
          <el-select
            v-model="taskInfo.practices"
            multiple
            disabled
            placeholder="实验"
            style="width: 240px"
          >
            <el-option
              v-for="practice in practices"
              :key="practice.value"
              :label="practice.label"
              :value="practice.value"
            />
          </el-select>
        </el-table-column>
        <el-table-column align="left" label="启用" min-width="150">
          <template #default="scope">
            <el-switch
              v-model="scope.row.enable"
              inline-prompt
              :active-value="1"
              :inactive-value="2"
              @change="()=>{switchEnable(scope.row)}"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="250" fixed="right">
          <template #default="scope">
            <el-popover v-model="scope.row.visible" placement="top" width="160">
              <p>确定要删除此作业吗</p>
              <div style="text-align: right; margin-top: 8px;">
                <el-button type="primary" link @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" @click="deleteTaskFunc(scope.row)">确定</el-button>
              </div>
              <template #reference>
                <el-button type="primary" link icon="delete">删除</el-button>
              </template>
            </el-popover>
            <el-button type="primary" link icon="edit" @click="openEdit(scope.row)">编辑</el-button>
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
      v-model="addTaskDialog"
      custom-class="Task-dialog"
      title="作业"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:60vh;overflow:auto;padding:0 12px;">
        <el-form ref="taskForm" :rules="rules" :model="taskInfo" label-width="80px">
          <el-form-item v-if="dialogFlag === 'add'" label="作业名" prop="taskName">
            <el-input v-model="taskInfo.taskName" />
          </el-form-item>
          <el-form-item label="作业描述" prop="taskDescription">
            <el-input v-model="taskInfo.taskDescription" />
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="taskInfo.startTime"
              type="datetime"
              placeholder="Pick a Date"
              format="YYYY/MM/DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="截止时间" prop="endTime">
            <el-date-picker
              v-model="taskInfo.endTime"
              type="datetime"
              placeholder="Pick a Date"
              format="YYYY/MM/DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="启用" prop="disabled">
            <el-switch
              v-model="taskInfo.enable"
              inline-prompt
              :active-value="1"
              :inactive-value="2"
            />
          </el-form-item>
          <el-form-item label="选择实验" prop="practices">
            <el-select
              v-model="taskInfo.practices"
              multiple
              placeholder="选择实验"
              style="width: 240px"
            >
              <el-option
                v-for="practice in practices"
                :key="practice.value"
                :label="practice.label"
                :value="practice.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeAddTaskDialog">取 消</el-button>
          <el-button type="primary" @click="enterAddTaskDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import {ElDatePicker} from 'element-plus'
import CustomPic from '@/components/customPic/index.vue'
import ChooseImg from '@/components/chooseImg/index.vue'
import WarningBar from '@/components/warningBar/warningBar.vue'

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([
  {
    ID: '1',
    taskName: '查询SQL',
    taskDescription: '锻炼学生的Select的使用方法',
    taskScore: '12',
    startTime: '2011-10-10 14:10:13',
    endTime: '2011-10-10 14:10:18',
    enable: 1,
    practices: [
      { label: '查询实验', value: '1' },
      { label: '插入实验', value: '2' },
      { label: '删除实验', value: '3' },
    ]
  }
])

const taskForm = ref({})

const taskInfo = ref({
  ID: '',
  taskName: '',
  taskDescription: '',
  taskScore: '',
  startTime: '',
  endTime: '',
  enable: 1,
  practices: [
    { label: '查询实验', value: '1' },
    { label: '插入实验', value: '2' },
    { label: '删除实验', value: '3' },
  ]
})

const practices = ref([
  { label: '查询实验', value: '1' },
  { label: '插入实验', value: '2' },
  { label: '删除实验', value: '3' }
])
const openEdit = (row) => {
  dialogFlag.value = 'edit'
  taskInfo.value = JSON.parse(JSON.stringify(row))
  addTaskDialog.value = true
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
  const table = await getTaskList({ page: page.value, pageSize: pageSize.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

watch(() => tableData.value, () => {
  setAuthorityIds()
})

const initPage = async() => {
  getTableData()
  const res = await getAuthorityList({ page: 1, pageSize: 999 })
  setOptions(res.data.list)
}

initPage()
const deleteTaskFunc = async(row) => {
  const res = await deleteTask({ id: row.ID })
  if (res.code === 0) {
    ElMessage.success('删除成功')
    row.visible = false
    await getTableData()
  }
}
const enterAddTaskDialog = async() => {
  taskInfo.value.authorityId = taskInfo.value.authorityIds[0]
  taskForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...taskInfo.value
      }
      if (dialogFlag.value === 'add') {
        const res = await register(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddTaskDialog()
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await setTaskInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '编辑成功' })
          await getTableData()
          closeAddTaskDialog()
        }
      }
    }
  })
}

const addTaskDialog = ref(false)
const closeAddTaskDialog = () => {
  taskForm.value.resetFields()
  taskInfo.value.headerImg = ''
  taskInfo.value.authorityIds = []
  addTaskDialog.value = false
}

const dialogFlag = ref('add')

const addTask = () => {
  dialogFlag.value = 'add'
  addTaskDialog.value = true
}
const switchEnable = async(row) => {
  taskInfo.value = JSON.parse(JSON.stringify(row))
  await nextTick()
  const req = {
    ...taskInfo.value
  }
  const res = await setTaskInfo(req)
  if (res.code === 0) {
    ElMessage({ type: 'success', message: `${req.enable === 2 ? '禁用' : '启用'}成功` })
    await getTableData()
    taskInfo.value.headerImg = ''
    taskInfo.value.authorityIds = []
  }
}
</script>

<style>

</style>
