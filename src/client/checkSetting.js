const { dialog } = require('electron').remote
const bootstrap = require('bootstrap')

document.getElementById('btnStartConfig').addEventListener('click', () => {
  var settingModal = new bootstrap.Modal(document.getElementById('settingModal'), {
    keyboard: false
  })

  settingModal.show()
  // document.getElementById('welcome').classList.add('d-none')
  document.getElementById('type').classList.remove('d-none')
  document.getElementById('day').classList.add('d-none')
  document.getElementById('time').classList.add('d-none')
  document.getElementById('folder').classList.add('d-none')
  document.getElementById('recup').classList.add('d-none')
})

document.getElementById('btnSetting').addEventListener('click', () => {
  var settingModal = new bootstrap.Modal(document.getElementById('settingModal'), {
    keyboard: false
  })

  settingModal.show()
  // document.getElementById('welcome').classList.add('d-none')
  document.getElementById('type').classList.remove('d-none')
  document.getElementById('day').classList.add('d-none')
  document.getElementById('time').classList.add('d-none')
  document.getElementById('folder').classList.add('d-none')
  document.getElementById('recup').classList.add('d-none')
})

let type = ""
document.getElementById('type').addEventListener('submit', sendType)
function sendType(e) {
  e.preventDefault();

  type = document.getElementById('mensile').checked ? 'mensile' : type
  type = document.getElementById('settimanale').checked ? 'settimanale' : type
  type = document.getElementById('giornaliero').checked ? 'giornaliero' : type

  if (type != "") {
    //ok 
    if (type == 'settimanale') {
      document.getElementById('type').classList.add('d-none')
      document.getElementById('day').classList.remove('d-none')
    }
    else if (type == 'mensile') {
      document.getElementById('type').classList.add('d-none')
      document.getElementById('day_month').classList.remove('d-none')
    }
    else {
      document.getElementById('type').classList.add('d-none')
      document.getElementById('time').classList.remove('d-none')
    }
    
  }
  else
  {
    alert('Seleziona un tipo di backup')  
  }
}

document.getElementById('gotoType').addEventListener('click', () => {
  document.getElementById('type').classList.remove('d-none')
  document.getElementById('day').classList.add('d-none')  
})
document.getElementById('gotoType_month').addEventListener('click', () => {
  document.getElementById('type').classList.remove('d-none')
  document.getElementById('day_month').classList.add('d-none')
})

let day = ""
document.getElementById('day').addEventListener('submit', sendDay)
function sendDay(e) {
  e.preventDefault();

  day = document.getElementById('lunedi').checked ? 'lunedi' : day
  day = document.getElementById('martedi').checked ? 'martedi' : day
  day = document.getElementById('mercoledi').checked ? 'mercoledi' : day
  day = document.getElementById('giovedi').checked ? 'giovedi' : day
  day = document.getElementById('venerdi').checked ? 'venerdi' : day
  day = document.getElementById('sabato').checked ? 'sabato' : day
  day = document.getElementById('domenica').checked ? 'domenica' : day

  if (day == "") {
    alert('Seleziona il giorno per fare il backup')
  }
  else {
    document.getElementById('day').classList.add('d-none')
    document.getElementById('time').classList.remove('d-none')
  }
}

let day_month;
document.getElementById('day_month').addEventListener('submit', sendDayMonth)
function sendDayMonth(e) {
  e.preventDefault();

  day_month = document.getElementById('select_month_day').value 

  if (!day_month) {
    alert('Seleziona il giorno per fare il backup')
  }
  else {
    document.getElementById('day_month').classList.add('d-none')
    document.getElementById('time').classList.remove('d-none')
  }
}

document.getElementById('day').addEventListener('submit', sendDay)
function sendDay(e) {
  e.preventDefault();

  day = document.getElementById('lunedi').checked ? 'lunedi' : day
  day = document.getElementById('martedi').checked ? 'martedi' : day
  day = document.getElementById('mercoledi').checked ? 'mercoledi' : day
  day = document.getElementById('giovedi').checked ? 'giovedi' : day
  day = document.getElementById('venerdi').checked ? 'venerdi' : day
  day = document.getElementById('sabato').checked ? 'sabato' : day
  day = document.getElementById('domenica').checked ? 'domenica' : day

  if (day == "") {
    alert('Seleziona il giorno per fare il backup')
  }
  else {
    document.getElementById('day').classList.add('d-none')
    document.getElementById('time').classList.remove('d-none')
  }
}

document.getElementById('gotoDay').addEventListener('click', () => {
  if (type == 'settimanale') {
    document.getElementById('time').classList.add('d-none')
    document.getElementById('day').classList.remove('d-none')
  }
  else if (type == 'mensile') {
    document.getElementById('time').classList.add('d-none')
    document.getElementById('day_month').classList.remove('d-none')
  }
  else {
    document.getElementById('time').classList.add('d-none')
   document.getElementById('type').classList.remove('d-none')
  }
})

let time = null
document.getElementById('time').addEventListener('submit', sendTime)
function sendTime(e) {
  e.preventDefault()

  time = document.getElementById('timePicker').value.split(':')
  time = {
    hour: time[0],
    minutes: time[1]
  }
  
  if (time) {
    //ok    
    document.getElementById('time').classList.add('d-none')
   document.getElementById('folder').classList.remove('d-none')
  }
  else {
    alert('seleziona un orario')
  }
  
}

document.getElementById('browseSrc').addEventListener('click', async () => {
  let src = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  
  document.getElementById('txtSrc').value = src.filePaths[0]
})
document.getElementById('browseDist').addEventListener('click', async () => {
  let dist = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  
  document.getElementById('txtDist').value = dist.filePaths[0]
})

let srcFolder = ""
let distFolder = ""

document.getElementById('folder').addEventListener('submit', (e) => {
  e.preventDefault()

  document.getElementById('txtSrc').classList.remove('is-invalid')
  document.getElementById('txtDist').classList.remove('is-invalid')

  srcFolder = validatePath(document.getElementById('txtSrc').value)
  distFolder = validatePath(document.getElementById('txtDist').value)

  if (srcFolder.trim() != "" && distFolder.trim() != "") {
    makeRecup()
    document.getElementById('folder').classList.add('d-none')
    document.getElementById('recup').classList.remove('d-none')
  } else {
    if (srcFolder.trim() == "") {
      document.getElementById('txtSrc').classList.add('is-invalid')
    }
    if (distFolder.trim() == "") {
      document.getElementById('txtDist').classList.add('is-invalid')      
    }
  }
})

function validatePath(s){
  let arr = Array.from(s)
  arr.map((val, i) => {
    return val == "\\" ? '\\\\' : val
  })
  return arr.join('')
}

document.getElementById('gotoTime').addEventListener('click', () => {  
  document.getElementById('folder').classList.add('d-none')
   document.getElementById('time').classList.remove('d-none')
})

function makeRecup() {
  document.getElementById('rtype').innerText = "Tipo: "+type
  document.getElementById('rday').innerText = "Giorno: " + day || "Tutti"
  document.getElementById('rtime').innerText = `Orario: ${time.hour}:${time.minutes}`
  document.getElementById('rfolder').innerHTML = `Sorgente: ${srcFolder} <br>Destinazione: ${distFolder}`
}

document.getElementById('gotoFolder').addEventListener('click', () => {
  document.getElementById('recup').classList.add('d-none')
  document.getElementById('folder').classList.remove('d-none')
})

