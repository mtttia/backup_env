const {existsSync, rmSync} = require('fs')
const fs = require('fs-extra')

async function copyDir(pathToCopy, finalPath) {
  fs.ensureDirSync(pathToCopy)
  if(existsSync(finalPath))
  {
    fs.rmSync(finalPath, { recursive: true, force: true });
  }
  fs.ensureDirSync(finalPath)
  await fs.copy(pathToCopy, finalPath)
}

module.exports = copyDir