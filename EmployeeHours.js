const mongoose = require('mongoose');


//category schema
const empHoursSchema =mongoose.Schema({

  ptitle:{
    type: String
  },
  empname:{
    type: String
  },
  date :{
    type: String
  },
  fromtime:{
    type: String
  },
  totime:{
    type: String
  },
  hours :{
    type: String
  }
});

const EHours =module.exports = mongoose.model('EHours',empHoursSchema);

//Add Timesheet
module.exports.addEmpHours = function(emphours,callback){
  EHours.create(emphours,callback);
}
//Get Timesheets
module.exports.getEmpHours = function(callback,limit){
  EHours.find(callback).limit(limit).sort([['ptitle','ascending']]);
}
module.exports.getHoursByName = function(query,callback){
  EHours.find(query,callback);
}
//Get the timesheet
module.exports.getHoursById = function(id,callback){
  EHours.findById(id,callback);
}
//Update Timesheet
module.exports.updateHours = function(query,update,options,callback){
  EHours.findOneAndUpdate(query,update,options,callback);
}
module.exports.removeAll =function(query,callback){
  EHours.remove(query,callback);
}
