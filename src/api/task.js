import service from '@/utils/request'

// 创建作业
export const createExamTask = (data) => {
    return service({
        url: '/examTask/createExamTask',
        method: 'post',
        data: data
    })
}
// 删除作业
export const deleteExamTask = (data) => {
    return service({
        url: '/examTask/deleteExamTask',
        method: 'delete',
        data: data
    })
}
// 批量删除作业
export const deleteExamTaskByIds = (data) => {
    return service({
        url: '/examTask/deleteExamTaskByIds',
        method: 'post',
        data: data
    })
}
// 获取作业列表
export const getExamTaskList = () => {
    return service({
        url: '/examTask/getExamTaskList',
        method: 'get'
    })
}
// 根据用户id获取作业列表 获取成绩管理数据
export const getExamUserTaskList = (data) => {
    return service({
        url: '/examTask/getExamUserTaskList',
        method: 'get',
        data: data
    })
}
// 发布作业
export const publishExamTask = (data) => {
    return service({
        url: '/examTask/publishExamTask',
        method: 'post',
        data: data
    })
}
// 提交分数
export const taskFeedback = (data) => {
    return service({
        url: '/examTask/taskFeedback',
        method: 'post',
        data: data
    })
}
// 编辑作业
export const updateTask = (data) => {
    return service({
        url: '/examTask/updateTask',
        method: 'post',
        data: data
    })
}