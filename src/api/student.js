import service from '@/utils/request'

// 分页获取学生信息
export const getUserList = (data) => {
    return service({
        url: '/user/getUserList',
        method: 'post',
        data: data
    })
}
// 设置学生信息
export const SetSelfInfo = (data) => {
    return service({
        url: '/user/SetSelfInfo',
        method: 'put',
        data: data
    })
}
// 删除学生信息
export const deleteUser = (data) => {
    return service({
        url: '/user/deleteUser',
        method: 'delete',
        data: data
    })
}
// 修改学生密码
export const changePassword = (data) => {
    return service({
        url: '/user/changePassword',
        method: 'post',
        data: data
    })
}
// 重置密码
export const resetPassword = (data) => {
    return service({
        url: '/user/resetPassword',
        method: 'post',
        data: data
    })
}
// 设置学生权限
export const setUserAuthorities = (data) => {
    return service({
        url: '/user/setUserAuthorities',
        method: 'post',
        data: data
    })
}
// 更改学生权限
export const setUserAuthority = (data) => {
    return service({
        url: '/user/setUserAuthority',
        method: 'post',
        data: data
    })
}
// 设置学生信息
export const setUserInfo = (data) => {
    return service({
        url: '/user/setUserInfo',
        method: 'put',
        data: data
    })
}