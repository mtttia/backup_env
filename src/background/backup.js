const { copyFileSync, readdirSync, statSync, } = require('fs')
const path = require('path')

copyDir('C:/Users/matti/Desktop/src', 'C:/Users/matti/Desktop/dist')


function copyDir(src, dest) {
  const condition = statSync(src).isDirectory()
  if (!condition) throw new Error('src not exists')
  
  let files = readdirSync(src)
  console.log(files);
}