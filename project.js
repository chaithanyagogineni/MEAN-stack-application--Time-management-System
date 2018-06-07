const mongoose = require('mongoose');


//category schema
const projectSchema =mongoose.Schema({

  title:{
    type: String
  },
  budget:{
    type:String
  },
  customer:{
    type:String
  },
  sup: {
    type: String
  },
    emps :[{
    empid : mongoose.Schema.Types.ObjectId,
    empname : String ,
    empuserid : String,
    empactive : Boolean
  }]



});

const Project =module.exports = mongoose.model('Project',projectSchema);

//Add Employee
module.exports.addProject = function(project,callback){
  Project.create(project,callback);
}
//Manage employee
module.exports.getProjects = function(callback,limit){
  Project.find(callback).limit(limit).sort([['userid','ascending']]);
}
//Get the employees
module.exports.getProjectById = function(id,callback){
  Project.findById(id,callback);
}

//Update Employees
module.exports.updateProject = function(query,update,options,callback){
  Project.findOneAndUpdate(query,update,options,callback);
}
//remove Project
module.exports.removeProject = function(query,callback){
  Project.remove(query,callback);
}
module.exports.removeEmployee = function(query,callback){
  Project.deleteOne(query,callback);
}
module.exports.getEmployeesProject = function(query,callback){
  Project.find(query,callback);
}
module.exports.removeDeletedEmployee = function(query,callback){

  Project.update(query,callback);

}
