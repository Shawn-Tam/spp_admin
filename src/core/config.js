/**
 * 网站配置文件
 */

const config = {
  appName: '数据库在线实验平台',
  appLogo: 'https://l2c-tsk.oss-cn-beijing.aliyuncs.com/study/graduate/sql_logo.png',
  showViteLogo: true
}

export const viteLogo = (env) => {
  if (config.showViteLogo) {
    const chalk = require('chalk')
    console.log(
      chalk.green(
        `> 欢迎使用数据库在线实验平台`
      )
    )
    console.log(
      chalk.green(
        `> 当前版本:v1.0.0`
      )
    )
    console.log(
      chalk.green(
        `> 默认自动化文档地址:http://127.0.0.1:${env.VITE_SERVER_PORT}/swagger/index.html`
      )
    )
    console.log(
      chalk.green(
        `> 默认前端文件运行地址:http://127.0.0.1:${env.VITE_CLI_PORT}`
      )
    )
    console.log('\n')
  }
}

export default config
