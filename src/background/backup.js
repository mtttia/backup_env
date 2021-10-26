const {existsSync, rmSync} = require('fs')
const fs = require('fs-extra')

async function copyDir(pathToCopy, finalPath) {
  fs.ensureDirSync(pathToCopy)
  fs.ensureDirSync(finalPath)
  await fs.copy(pathToCopy, finalPath)
}

module.exports = copyDir