import service from '@/utils/request'

// 删除实验
export const deletePractice = (data) => {
    return service({
        url: '/examPractice/deletePractice',
        method: 'DELETE',
        data: data
    })
}
// 创建实验
export const insertPractice = (data) => {
    return service({
        url: '/examPractice/insertPractice',
        method: 'post',
        data: data
    })
}
// 给实验打分
export const practiceFeedback = (data) => {
    return service({
        url: '/examPractice/practiceFeedback',
        method: 'post',
        data: data
    })
}
// 学生提交代码
export const submitPracticeCode = (data) => {
    return service({
        url: '/examPractice/submitPracticeCode',
        method: 'post',
        data: data
    })
}
//获取实验列表
export const queryPractice = () => {
    return service({
        url: '/examPractice/queryPractice',
        method: 'get'
    })
}
//更新实验列表
export const updatePractice = (data) => {
    return service({
        url: '/examPractice/updatePractice',
        method: 'post',
        data: data
    })
}
// 获取作业的ExamPractice列表
export const queryPracticeById = (data) => {
    return service({
        url: 'examPractice/queryPracticeById?taskId='+data,
        method: 'get',
    })
}