class Log{
  Date;
  StartHour;
  EndHour;
  State;
  Description;
  SrcFolder;
  DistFolder;

  static isLog(obj) {
    if(obj)
      return 'Date' in obj && 'StartHour' in obj && 'EndHour' in obj && 'State' in obj && 'Description' in obj && 'SrcFolder' in obj && 'DistFolder' in obj
    return false
  }
}

module.exports = Log;