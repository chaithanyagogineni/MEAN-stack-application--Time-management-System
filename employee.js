const mongoose = require('mongoose');


//category schema
const employeeSchema =mongoose.Schema({
  userid:{
    type: String
  },
  password: {
    type:String
  },
  name:{
    type: String
  },
  email: {
    type:String
  },
  address:{
    type: String
  },
  title: {
    type:String
  },
  salary:{
    type: String
  }
});

const Employee =module.exports = mongoose.model('Employee',employeeSchema);

//Add Employee
module.exports.addEmployee = function(employee,callback){
  Employee.create(employee,callback);
}
//Manage employee
module.exports.getEmployees = function(callback,limit){
  Employee.find(callback).limit(limit).sort([['userid','ascending']]);
}
//Get the employees
module.exports.getEmployeeById = function(id,callback){
  Employee.findById(id,callback);
}
//Update Employees
module.exports.updateEmployee = function(query,update,options,callback){
  Employee.findOneAndUpdate(query,update,options,callback);
}
//Remove category
module.exports.removeEmployee = function(query,callback){
  Employee.remove(query,callback);
}
module.exports.getEmployeeDetails = function(query,callback){
  Employee.find(query,callback);
}
