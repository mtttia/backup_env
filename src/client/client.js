const Setting = require('../class/setting')
const BackupData = require('../class/backupData')
const { ipcRenderer } = require('electron')

let setting = null
let backupData = null
let backupInPause = false
main()

function main() {
    ipcRenderer.send('say-status', '')
    if (BackupData.exist()) {
        backupData = BackupData.load()
    }
    else {
        backupData = BackupData.create()
    }
    if (Setting.firstTime()) {
        document.getElementById('welcome').classList.remove('d-none')
        document.getElementById('home').classList.add('d-none')
    }
    else {
        loadSetting()
    }
}

function loadSetting() {
    ipcRenderer.send('ask-recup', '')
    setting = Setting.load()
    //popolo setting
    const reverseMapDayOfWeek =  {
        1: 'lunedi',
        2: 'martedi',
        3: 'mercoledi',
        4: 'giovedi',
        5: 'venerdi',
        6: 'sabato',
        7: 'domenica'
    }
    let pattern = setting.CronPattern.split(' ');
    
    time = {
        minutes : pattern[0],
        hour : pattern[1]
    }
    if (pattern[2] != '*') {
        day_month = pattern[2]
        type = 'mensile'
    }
    if (pattern[4] != '*') {
        day = reverseMapDayOfWeek[pattern[4]]
        type = 'settimanale'
    }
    if (type != 'mensile' && type != 'settimanale')
        type = 'giornaliero'        
    document.getElementById(type).checked = true
    if (type == 'settimanale') {
        document.getElementById(day).checked = true
    }
    if (type == 'mensile') {
        document.getElementById('select_month_day').value = day_month
    }
    document.getElementById('timePicker').value = time.hour + ':' + time.minutes
    document.getElementById('txtSrc').value = setting.SrcFolder;
    document.getElementById('txtDist').value = setting.DistFolder;

    populateStateModal()
}

document.getElementById('btnInizia').addEventListener('click', initializeSetting)

function initializeSetting() {
    const mapDayOfWeek =  {
        lunedi: 1,
        martedi: 2,
        mercoledi: 3,
        giovedi: 4,
        venerdi: 5,
        sabato: 6,
        domenica: 7
    }

    let minutes = time.minutes;
    let hour = time.hour;
    let dayOfMonth = type == 'mensile' ? day_month : '*'
    let month = '*'
    let dayOfWeek = type == 'settimanale' ? mapDayOfWeek[day] : '*'

    const pattern = `${minutes} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
    console.log(pattern)
    setting = new Setting(pattern, srcFolder, distFolder, true)
    //run real app
    document.getElementById('welcome').classList.add('d-none')
    document.getElementById('home').classList.remove('d-none')

    ipcRenderer.send('say-upload-setting', "")
    ipcRenderer.send('say-start-backup', "")
    ipcRenderer.send('say-status', '')

    populateStateModal()
}

document.getElementById('btnShowMenu').addEventListener('click', () => {
    document.getElementById('menu-option').classList.toggle('menu-option-active')
})

ipcRenderer.on('status', (event, arg) => {
    document.getElementById('btn-restart-on-status').classList.add('d-none')
    backupInPause = arg.pause
    togglePauseIcon()
    if (arg.running == true && arg.pause == false) {
        //all ok
        document.getElementById('status_bar').setAttribute('class', 'status_bar_ok')
        document.getElementById('status_bar_text').innerText = "Stato: OK"
    }
    else if(arg.running == false){
        //is an error
        document.getElementById('status_bar').setAttribute('class', 'status_bar_error')
        document.getElementById('status_bar_text').innerText = "Errore"
    }
    else {
        //pause == true
        document.getElementById('status_bar').setAttribute('class', 'status_bar_pause')
        document.getElementById('status_bar_text').innerText = "In pausa"
        document.getElementById('btn-restart-on-status').classList.remove('d-none')
    }
})

ipcRenderer.on('config', (event, arg) => {
    if (!arg.running) {
        ipcRenderer.send('say-upload-setting', "")
        ipcRenderer.send('say-start-backup', "")
        ipcRenderer.send('say-status', '')
    }
})

ipcRenderer.on('log', (event, arg) => {
    backupData.upload()
    populateStateModal()
})

function populateStateModal() {
    //setting data
    document.getElementById('sm-type').innerText = "Tipo: " + type
    let myday = day || day_month ? day || day_month : "tutti"
    document.getElementById('sm-day').innerText = "Giorno: " + myday
    document.getElementById('sm-time').innerText = `Orario: ${time.hour}:${time.minutes}`
    document.getElementById('sm-folder').innerHTML = `Sorgente: ${setting.SrcFolder} <br>Destinazione: ${setting.DistFolder}`

    //logs data
    let html = ''
    let id = 0
    for (let l of backupData.Logs) {
        html += `
<div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#log${id}" aria-expanded="false" aria-controls="collapseOne">
            ${l.Date}, inizio: ${l.StartHour} - fine: ${l.EndHour}
        </button>
    </h2>
    <div id="log${id}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#sm-accordationLog">
        <div class="accordion-body">
            Stato: ${l.State}<br>
            ${l.Description ? 'Description: ' + l.Description + '<br>' : ''}
            Source: ${l.SrcFolder}<br>
            Destinazione: ${l.DistFolder}
        </div>
    </div>
</div>`
        id++
    }

    document.getElementById('sm-accordationLog').innerHTML = html
}


document.getElementById('mb-form').addEventListener('click', (e) => {
    e.preventDefault()

    let source = document.getElementById('mb-source').value
    let destination = document.getElementById('mb-destination').value

    if (source.trim() && destination.trim()) {
        ipcRenderer.send('say-new-backup', {
            SrcFolder: source,
            DistFolder: destination
        })
        document.getElementById('mb-after').classList.remove('d-none')
    }
    else {
        if (!source.trim()) {
            document.getElementById('mb-source').classList.add('is-invalid')
        }
        else if (!destination.trim()) {
            document.getElementById('mb-destination').classList.add('is-invalid')
        }
    }
})

document.getElementById('mb-browse-source').addEventListener('click', async () => {
    let src = await dialog.showOpenDialog({ properties: ['openDirectory'] }) || ""
    document.getElementById('mb-source').value = src.filePaths[0]
})

document.getElementById('mb-browse-destination').addEventListener('click', async () => {
    let dist = await dialog.showOpenDialog({ properties: ['openDirectory'] }) || ""
    document.getElementById('mb-destination').value = dist.filePaths[0]
})

ipcRenderer.on('new-backup-end', (event, arg) => {
    document.getElementById('mb-after-report').classList.remove('d-none')
    document.getElementById('mb-after').classList.add('d-none')

    document.getElementById('mb-after-report').innerHTML = `
    <h2>Report</h2><br>
    <p>Data = ${arg.Date}</p>
    <p>Ora inizio = ${arg.StartHour}</p>
    <p>Ora fine = ${arg.EndHour}</p>
    <p>Stato = ${arg.State}</p>
    <p>Descrizione = ${arg.Description}</p>
    <p>Source = ${arg.SrcFolder}</p>
    <p>Destinazione = ${arg.DistFolder}</p>
    `
})

document.getElementById('btnPause').addEventListener('click', () => {
    if (backupInPause) ipcRenderer.send('say-resume-backup', '')
    else ipcRenderer.send('say-pause-backup', '')
    backupInPause = !backupInPause
    togglePauseIcon()
    ipcRenderer.send('say-status', '')
})

function togglePauseIcon() {
    if (backupInPause) {
        document.getElementById('btnPause').setAttribute('title', 'riattiva')
        document.getElementById('icon-pause').classList.add('d-none')
        document.getElementById('icon-play').classList.remove('d-none')
    }
    else {
        document.getElementById('btnPause').setAttribute('title', 'pausa')
        document.getElementById('icon-pause').classList.remove('d-none')
        document.getElementById('icon-play').classList.add('d-none')
    }
}

document.getElementById('btn-restart-on-status').addEventListener('click', ()=>{
    if (backupInPause) ipcRenderer.send('say-resume-backup', '')
    backupInPause = false
    ipcRenderer.send('say-status', '')
})

ipcRenderer.on('upload-setting', (event, arg) => {
    loadSetting()
})