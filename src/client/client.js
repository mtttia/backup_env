const Setting = require('../class/setting')
const BackupData = require('../class/backupData')
const { ipcRenderer } = require('electron')

let setting = null
let backupData = null
main()

function main() {
    //inizializa log
    if (BackupData.exist()) {
        backupData = BackupData.load()
    }
    else {
        backupData = BackupData.create()
    }
    if (Setting.firstTime()) {
        // first application opening
        document.getElementById('welcome').classList.remove('d-none')
        document.getElementById('home').classList.add('d-none')
    }
    else {
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
        
        let time = {
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
    }
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
}

document.getElementById('btnShowMenu').addEventListener('click', () => {
    document.getElementById('menu-option').classList.toggle('menu-option-active')
})

//listener
ipcRenderer.on('log', (event, arg) => {
    let l = arg
    console.log(l);
    backupData.addLog(l, {save:true})
})