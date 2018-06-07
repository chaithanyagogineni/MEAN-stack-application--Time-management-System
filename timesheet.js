const mongoose = require('mongoose');


//category schema
const sheetSchema =mongoose.Schema({

  projecttitle:{
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
  }
});

const sheet =module.exports = mongoose.model('Sheet',sheetSchema);

//Add Timesheet
module.exports.addSheet = function(sheet,callback){
  Sheet.create(sheet,callback);
}
//Get Timesheets
module.exports.getTimesheets = function(callback,limit){
  Sheet.find(callback).limit(limit).sort([['empname','ascending']]);
}
module.exports.getTimesheetsByName = function(query,callback){
  Sheet.find(query,callback);
}
//Get the timesheet
module.exports.getSheetById = function(id,callback){
  Sheet.findById(id,callback);
}
//Update Timesheet
module.exports.updateSheet = function(query,update,options,callback){
  Sheet.findOneAndUpdate(query,update,options,callback);
}
