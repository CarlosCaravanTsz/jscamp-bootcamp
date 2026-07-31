import os from 'node:os'
import ms from 'ms'

console.log(os.type())
console.log(os.platform())
console.log(os.arch())
console.log(os.freemem())
console.log(os.homedir())
console.log(ms(os.uptime()*1000))
console.log(os.cpus())
console.log(os.networkInterfaces())