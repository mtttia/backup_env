class Log{
  Date;
  StartHour;
  EndHour;
  State;
  Description;
  SrcFolder;
  DistFolder;

  static isLog(obj) {
    return obj.Date && obj.StartHour && obj.EndHour && obj.State && obj.Description && obj.SrcFolder && obj.DistFolder
  }
}

module.exports = Log;