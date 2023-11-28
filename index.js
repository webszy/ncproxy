#!/usr/bin/env node
const chalk = require('chalk')
const {program,Option, Command} = require('commander')
const {version} =require('./package.json')
const child = require('node:child_process')
const {Buffer}= require("node:buffer");
const log = console.log;
const runShell = (cmd)=> Buffer.from((child.execSync(cmd))).toString()

// 定义version
program.version(version)
program.version(version, '-v')
// 扩展help
program.on('--help',()=>{
    console.log('')
    log(chalk.bgBlackBright.cyanBright.bold('help you set npm config for proxy'))
})
// options callback
const showAll = function (){
    const cmd1 =  runShell('npm config get proxy')
    const cmd2 =  runShell('npm config get https-proxy')
    console.log(chalk.bgBlackBright.cyanBright('Your npm Proxy list:'))
    log(chalk.cyanBright('http'),cmd1)
    log(chalk.cyanBright('https'),cmd1)
}
const setProxy = function (address, opts){
    console.log(address,opts)
    const {both=false,https=false,http=false} = opts
    let port = 7890
    if(!address){
        log(chalk.red('please input your proxy address'))
        return
    }
    if(!address.includes(':')){
        const str = chalk.cyanBright('please input your proxy port after : ') + chalk.red('default is 7890')
        log(str)
        address = address.replace(':','') + ':7890'
    }
    if(!address.startsWith('http')){
        const str = chalk.cyanBright('please start with network protocol: ') + chalk.red('default is http')
        log(str)
        address = 'http://' + address
    }
    log(chalk.cyanBright('your proxy is :'),address)
    const protocolName = (both || (https && http))
        ? 'http,https'
        : https
            ? 'https'
            : 'http'
    log(chalk.cyanBright('will set :'),protocolName , ' proxy')

    const setHttpProxy = ()=>child.execSync(`npm config set proxy ${address}`)
    const setHttpsProxy = ()=>child.execSync(`npm config set https-proxy ${address}`)
    if(protocolName==='http,https'){
        setHttpProxy()
        setHttpsProxy()
    } else if(protocolName==='https'){
        setHttpsProxy()
    } else {
        setHttpProxy()
    }
    log(chalk.cyanBright('--------------------'))
    showAll()

}
const removeAllProxy = function (){
    runShell('npm config delete proxy')
    runShell('npm config delete https-proxy')
    log(chalk.cyanBright.bold('all npm proxy has deleted'))
}
// 主功能区
program
    .addOption(
        new Option('-a --all','show all proxy which you set')
            .argParser(showAll)
    )
    .addCommand(
        new Command('list')
            .action(showAll),
        { isDefault: true }
    )
    .addCommand(
        new Command('reset')
            .action(removeAllProxy)
    )
    .addCommand(
        new Command('set')
            .argument('address')
            .option('-b --both','set http proxy and https proxy')
            .option('-h --http','only set http proxy')
            .option('-s --https','only set https proxy')
            .action(setProxy)
    )


// 解析入参
program.parse(process.argv)
// const options = program.opts();
// if(options.all){
//
// } else if(options.set){
//
// }

