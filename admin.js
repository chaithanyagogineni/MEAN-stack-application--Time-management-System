const express = require('express');
const router = express.Router();
const session = require('express-session');
var current_user;
var emp_name;
var supervisor_flag=0;
const app =express();
var dialog = require('dialog');
var emp_to_delete;
var curr_sup_session = 1;
//app.use(session({ secret: 'keyboard cat', resave: false,saveUninitialized: true,cookie: { current_user: 60000 }}));


Employee = require('../models/employee');
Project = require('../models/project');
Sheet = require('../models/timesheet');
EHours = require('../models/EmployeeHours');



//ROute to Home
router.get('/',(req,res,next)=>{
  res.render('admin',{
    title:current_user
  });
});

//route to Login
router.get('/login',(req,res,next)=>{

  res.render('login');
});

//route to ADD Employee
router.get('/add_employee',(req,res,next)=>{
  res.render('add_employee',{
    title:'Employee'
  });
});

//Route to add Project
router.get('/add_project',(req,res,next)=>{
Employee.getEmployees((err,employees)=>{
if(err)
{
  res.send(err);
}
  res.render('add_project',{
    title:'Project',
    employees: employees
  });
});
});

//Route to admin time sheet
router.get('/manage_admin_timesheet',(req,res,next)=>{
  //console.log(req.username);
//  console.log(current_user);
  const query = {emps: {$elemMatch: {empuserid:current_user}}}
  Project.getEmployeesProject(query,(err,empsproj)=>{
   console.log(empsproj);
   //console.log(emp_name);
    if(err)
    {
      res.send(err);
    }
    res.render('manage_admin_timesheet',{
      empsproj: empsproj
    });

});
});
//Handling the post request of Manage Timesheet of Admin
router.post('/manage_admin_timesheet',(req,res,next)=>{
  res.render('admin_timesheet',{
    project : req.body.select_project,
    date : req.body.timesheet_date
  });
});
//Sample to test list employees
router.get('/list_employees',(req,res,next)=>{
  Employee.getEmployees((err,employees)=>{
    if(err)
    {
      res.send(err);
    }
    //console.log(categories);
    res.render('list_employees',{
      title:'Employees',
    employees: employees
  });
  });
});

//Sample to test selected employees
router.post('/selected_employees',(req,res,next)=>{
  let se = req.body.select_employee;
  //console.log(se);
  res.render('selected_employees',{
    se:se
  });
});

//Handle route to employee Home
router.get('/emp_home',(req,res,next)=>{
  res.render('emp_home',{
    title:current_user
  });
});

//Handle routes to supervisor home
router.get('/sup_home',(req,res,next)=>{
  res.render('sup_home',{
    title:current_user
  });
});
//login to admin page
router.post('/login',(req,res,next)=>{
  let user = req.body.username;
  let password = req.body.password;
  current_user = user;
  const query = {userid:current_user,password:password};
  var sup_query;
  Employee.getEmployeeDetails(query,(err,empdetails)=>{
    if(err)
    throw err;
    else if(empdetails.length!=0)
      {
        emp_name = empdetails[0].name;
      sup_query = {sup : emp_name}
//console.log("empdetails length is ",empdetails.length);
          }
  if(empdetails.length!=0)
  {
  Project.getEmployeesProject(sup_query,(err,supervisors)=>{
    console.log("supervisors length is ",supervisors.length);
    if(err)
    {
      res.send(err);
    }
  if(user=="chaitu" && password=="chaitu")
  {
         res.redirect('/');
  }
 else if(supervisors.length!=0)
  {
    res.render('sup_home',{
      title: user
    });

  }
  else if(empdetails.length==1){
    res.render('emp_home',{
      title:user,
      current_user : user
    });
  }

});
}
else {
dialog.info("Invalid credentials");
  res.redirect('/login');

}
});
});

//Handling post request of Admin Timesheet
router.post('/admin_timesheet',(req,res,next)=>{
  let sheet=new Sheet();
  sheet.projecttitle = req.body.project_name;
  sheet.empname = emp_name;
  sheet.date = req.body.timesheet_date;
  sheet.fromtime = req.body.timesheet_from_date;
  sheet.totime = req.body.timesheet_to_date;

  Sheet.addSheet(sheet,(err,sheet)=>{
  if(err)
  {
    res.send(err);
  }
  res.redirect('/');
  });
});
router.get('/Sample',(req,res,next)=>{
res.render('sampleButton');
});
//get all the employee timesheets
router.get('/get_sup_timesheets',(req,res,next)=>{
const query = {empname:emp_name}
Sheet.getTimesheetsByName(query,(err,ts)=>{
  if(err)
  {
    throw err;
  }
  else {
    {
      res.render('get_sup_timesheets',{
        timesheets:ts
      });
    }
  }
});
});

//get all the employee timesheets
router.get('/get_my_timesheets',(req,res,next)=>{
const query = {empname:emp_name}
Sheet.getTimesheetsByName(query,(err,ts)=>{
  if(err)
  {
    throw err;
  }
  else {
    {
      res.render('get_emp_timesheets',{
        timesheets:ts
      });
    }
  }
});
});
//get All timesheets

router.get('/get_timesheets',(req,res,next)=>{
  Sheet.getTimesheets((err,timesheets)=>{
    if(err)
    {
      res.send(err);
    }
    //console.log(categories);
    res.render('get_AllTimeSheets',{
    timesheets: timesheets
  });
  });
});
//Manage TImesheet of employee
router.get('/manage_emp_timesheet',(req,res,next)=>{
  const query = {emps: {$elemMatch: {empuserid:current_user}}}
  Project.getEmployeesProject(query,(err,empsproj)=>{
   console.log(empsproj);
   //console.log(emp_name);
    if(err)
    {
      res.send(err);
    }
    if(empsproj.length==0)
    {
      res.render('emp_error_page');
    }
    else {

    res.render('manage_emp_timesheet',{
      empsproj: empsproj
    });
}
});
});

//Manage TImesheet of supervisor
router.get('/manage_sup_timesheet',(req,res,next)=>{
  //const query = {emps: {$elemMatch: {empuserid:current_user}}}
  const query = { $or: [{emps: {$elemMatch: {empuserid:current_user}}},{sup : current_user}]}
  Project.getEmployeesProject(query,(err,empsproj)=>{
   console.log(empsproj);
   //console.log(emp_name);
    if(err)
    {
      res.send(err);
    }
    res.render('manage_sup_timesheet',{
      empsproj: empsproj
    });

});
});

//Handle POST request of Employee Timesheet
router.post('/manage_emp_timesheet',(req,res,next)=>{
  let sheet=new Sheet();
  sheet.projecttitle = req.body.select_project;
  sheet.empname = emp_name;
  sheet.date = req.body.timesheet_date;
  sheet.fromtime = req.body.timesheet_from_date;
  sheet.totime = req.body.timesheet_to_date;

  Sheet.addSheet(sheet,(err,sheet)=>{
  if(err)
  {
    res.send(err);
  }
  res.redirect('/emp_home');
  });
});

//Handle POST request of Supervisor Timesheet
router.post('/manage_sup_timesheet',(req,res,next)=>{
  let sheet=new Sheet();
  sheet.projecttitle = req.body.select_project;
  sheet.empname = emp_name;
  sheet.date = req.body.timesheet_date;
  sheet.fromtime = req.body.timesheet_from_date;
  sheet.totime = req.body.timesheet_to_date;

  Sheet.addSheet(sheet,(err,sheet)=>{
  if(err)
  {
    res.send(err);
  }
  res.redirect('/sup_home');
  });
});
//Manage the route to edit emoployee time sheet
router.get('/manage_timesheets/sup/edit/:id',(req,res,next)=>{
  const query = {emps: {$elemMatch: {empuserid:current_user}}}
  Project.getEmployeesProject(query,(err,empsproj)=>{
  Sheet.getSheetById(req.params.id,(err,sheet)=>{
    if(err){
      res.send(err);
    }
    var date = new Date();
   var resu = sheet.date;
   var splitted_res = resu.split("-");
  //  console.log(date.getFullYear());
  //  console.log(date.getMonth());
  //  console.log(date.getDate());
   if(splitted_res[0]==date.getFullYear()&&Math.abs(splitted_res[1]-date.getMonth())<=1&&Math.abs(splitted_res[2]-date.getDate())<=30)
    {
      res.render('edit_sup_timesheet',{
      sheet:sheet,
      projects:empsproj
    });
  }
  else {
    res.render('cannot_edit_sup_timesheet',{
      sheet:sheet,
      projects:empsproj
    });
  }
});
});
});
//Manage route to employee timesheet
//Manage the route to edit emoployee time sheet
router.get('/manage_timesheets/emp/edit/:id',(req,res,next)=>{
  const query = {emps: {$elemMatch: {empuserid:current_user}}}
  Project.getEmployeesProject(query,(err,empsproj)=>{
  Sheet.getSheetById(req.params.id,(err,sheet)=>{
    if(err){
      res.send(err);
    }
    var date = new Date();
   var resu = sheet.date;
   var splitted_res = resu.split("-");
  //  console.log(date.getFullYear());
  //  console.log(date.getMonth());
  //  console.log(date.getDate());
   if(splitted_res[0]==date.getFullYear()&&Math.abs(splitted_res[1]-date.getMonth())<=1&&Math.abs(splitted_res[2]-date.getDate())<=30)
    {
      res.render('edit_emp_timesheet',{
      sheet:sheet,
      projects:empsproj
    });
  }
  else{
    res.render('cannot_edit_emp_timesheet',{
    sheet:sheet,
    projects:empsproj
  });
  }
});
});
});


//Manage the route to edit timesheet of supervisors
//Manage the route to edit emoployee time sheet
router.get('/manage_timesheets/edit/sup/:id',(req,res,next)=>{

  Sheet.getSheetById(req.params.id,(err,sheet)=>{
    if(err){
      res.send(err);
    }
    res.render('edit_sup_timesheet',{
      sheet:sheet
    });
});
});


//Manage the route to edit emoployee time sheet
router.get('/manage_timesheets/edit/:id',(req,res,next)=>{
  const query = {emps: {$elemMatch: {empuserid:current_user}}}
  Project.getEmployeesProject(query,(err,empsproj)=>{
  Sheet.getSheetById(req.params.id,(err,sheet)=>{
    if(err){
      res.send(err);
    }
    res.render('edit_timesheet',{
      sheet:sheet,
      projects:empsproj
    });
});
});
});

//Add an Employee
router.post('/add_employee/add',(req,res,next)=>{
  let employee=new Employee();
  employee.userid = req.body.userid;
  employee.password = req.body.password;
  employee.name = req.body.name;
  employee.email = req.body.email;
  employee.address = req.body.address;
  employee.title = req.body.jobtitle;
  employee.salary = req.body.salary;


Employee.addEmployee(employee,(err,employee)=>{
  if(err)
  {
    res.send(err);
  }
  res.redirect('/');
});

});

//Add a Project
router.post('/add_project/add',(req,res,next)=>{
  let project=new Project();
  project.title = req.body.title;
  project.budget = req.body.budget;
  project.customer = req.body.customer;
  project.supervisor = req.body.supervisor;
  project.employee = req.body.employee;
  project.sup = req.body.select_supervisor;
  //project.emps=req.body.select_employee;
  //console.log(req.body.select_employee);
console.log(typeof(req.body.select_employee));
for( var i=0;i<req.body.select_employee.length;i++){
  var x = { empid : JSON.parse(req.body.select_employee[i])._id, empname : JSON.parse(req.body.select_employee[i]).name,empuserid : JSON.parse(req.body.select_employee[i]).userid,empactive : true };
project.emps.push(x);
}//console.log(project.emps);
Project.addProject(project,(err,project)=>{
  if(err)
  {
    res.send(err);
  }
  res.redirect('/');
});

});

//Manage Employees
router.get('/manage_employees',(req,res,next)=>{
  Employee.getEmployees((err,employees)=>{
    if(err)
    {
      res.send(err);
    }
    //console.log(categories);
    res.render('manage_employees',{
      title:'Employees',
    employees: employees
  });
  });

});

//Manage Projects
router.get('/manage_projects',(req,res,next)=>{
  Project.getProjects((err,projects)=>{
    if(err)
    {
      res.send(err);
    }
    Employee.getEmployees((err,employees)=>{
      if(err)
      {
        res.send(err);
      }
      //console.log(categories);
    //console.log(categories);
    res.render('manage_projects',{
      title:'Projects',
    projects: projects,
    employees: employees
  });
  });
  });

});


//HAndling the get of manage supervisor projects
router.get('/manage_sup_projects/:id',(req,res,next)=>{
  Project.getProjectById(req.params.id,(err,project)=>{
    if(err){
      res.send(err);
    }
    var list_emps = [];
    var rem_emps = [];

   if(project.emps.length>0)
   {
    for (var i = 0; i < project.emps.length;i++) {
      //console.log(project.emps.empname);
      list_emps.push(project.emps[i]);

  }

  }
  else {

  }
  //  console.log(list_emps);
  var flag = 1;
    Employee.getEmployees((err,employees)=>{
      if(err)
      {
        res.send(err);
      }
      for(var x=0;x<employees.length;x++)
      {
        flag =1;
        for(var y=0;y<list_emps.length;y++)
        {
          //console.log(employees[x].name,' ',list_emps[y].empname);
          if(employees[x].name===list_emps[y].empname)
          {
            flag=0;
            break;
        }

      }
      if(flag==1)
      rem_emps.push(employees[x].name);
      }
      //console.log(rem_emps);
    res.render('edit_project_supervisor',{
      title:'Edit Project',
      project:project,
      employees:employees,
      list_emps:list_emps,
      rem_emps:rem_emps
    });
  });
});
});

//Handling the Get sumary report of sypervisor
router.get('/sup_get_summary',(req,res,next)=>{
  const query = {sup : current_user}
  Project.getEmployeesProject(query,(err,projects)=>{
    if(err)
    {
      res.send(err);
    }
    if(curr_sup_session == 1){
    for(var i=0;i<projects.length;i++)
    {
      Sheet.getTimesheetsByName({projecttitle : projects[i].title},(err,sheets)=>{
        if(err)
        {
          res.send(err);
        }
        for(var m=0;m<sheets.length;m++)
        {
          var ehours = new EHours();
          ehours.ptitle = sheets[m].projecttitle;
          ehours.empname = sheets[m].empname;
          ehours.date = sheets[m].date;
          ehours.fromtime = sheets[m].fromtime;
          ehours.totime = sheets[m].totime;
          var from_parse = sheets[m].fromtime.split(":");
          var to_parse = sheets[m].totime.split(":");
          ehours.hours = Math.abs(from_parse[0]-to_parse[0])+(Math.abs(from_parse[1]-to_parse[1])/60);
          console.log(ehours);
          EHours.addEmpHours(ehours,(err,ehours)=>{
       if(err)
       {
         res.send(err);
       }
          });
        }
      });
    }

  }
  curr_sup_session = curr_sup_session + 1;
    Employee.getEmployees((err,employees)=>{
      if(err)
      {
        res.send(err);
      }
      //console.log(categories);
    //console.log(categories);
    res.render('sup_summary_request',{
      title:'Summary Request',
    projects: projects,
    employees: employees
  });
  });
});
});

//Handle supervisor Summary Request
router.post('/sup_get_summary',(req,res,next)=>{
const query = {ptitle : req.body.select_project[0]};
console.log(req.body.select_project);
//console.log(req.body.select_category);
if(req.body.select_project[1]=="Daily")
{
  EHours.getHoursByName(query,(err,sheets)=>{
    if(err)
    {
      res.send(err);
    }
    console.log(sheets);
      res.render('sup_summary_report_daily',{
        sheets : sheets,
        title : req.body.select_project[0]
      });
  });
}
else if(req.body.select_project[1]=="Weekly")
{
  EHours.getHoursByName(query,(err,sheets)=>{
    if(err)
    {
      res.send(err);
    }
      res.render('sup_summary_report_weekly',{
        sheets : sheets,
        title : req.body.select_project[0]
      });
  });
}
else if(req.body.select_project[1]=="Monthly")
{
  EHours.getHoursByName(query,(err,sheets)=>{
    if(err)
    {
      res.send(err);
    }
      res.render('sup_summary_report_monthly',{
        sheets : sheets,
        title : req.body.select_project[0]
      });
  });
}
else {
  EHours.getHoursByName(query,(err,sheets)=>{
    if(err)
    {
      res.send(err);
    }
      res.render('sup_summary_report_daterange',{
        sheets : sheets,
        title : req.body.select_project[0]
      });
  });
}
});
//Manage Supervisor ProjectS
//Manage Projects
router.get('/manage_sup_projects',(req,res,next)=>{
  const query = {sup : current_user}
  Project.getEmployeesProject(query,(err,projects)=>{
    if(err)
    {
      res.send(err);
    }
    Employee.getEmployees((err,employees)=>{
      if(err)
      {
        res.send(err);
      }
      //console.log(categories);
    //console.log(categories);
    res.render('manage_sup_projects',{
      title:'Projects',
    projects: projects,
    employees: employees
  });
  });
  });

});

//Edit employees
router.get('/manage_employees/employees/edit/:id',(req,res,next)=>{
  Employee.getEmployeeById(req.params.id,(err,employee)=>{
    if(err){
      res.send(err);
    }
     emp_to_delete = employee.userid;

    res.render('edit_employee',{
      title:'Edit Employee',
      employee:employee
    });

});
});

//Edit Projects
router.get('/manage_projects/projects/edit/:id',(req,res,next)=>{
  Project.getProjectById(req.params.id,(err,project)=>{
    if(err){
      res.send(err);
    }
    var list_emps = [];
    var rem_emps = [];

   if(project.emps.length>0)
   {
    for (var i = 0; i < project.emps.length;i++) {
      //console.log(project.emps.empname);
      list_emps.push(project.emps[i]);

  }

  }
  else {

  }
  //  console.log(list_emps);
  var flag = 1;
    Employee.getEmployees((err,employees)=>{
      if(err)
      {
        res.send(err);
      }
      for(var x=0;x<employees.length;x++)
      {
        flag =1;
        for(var y=0;y<list_emps.length;y++)
        {
          //console.log(employees[x].name,' ',list_emps[y].empname);
          if(employees[x].name===list_emps[y].empname)
          {
            flag=0;
            break;
        }

      }
      if(flag==1)
      rem_emps.push(employees[x].name);
      }
      //console.log(rem_emps);
    res.render('edit_project',{
      title:'Edit Project',
      project:project,
      employees:employees,
      list_emps:list_emps,
      rem_emps:rem_emps
    });
  });
});
});
//Edit employeeS
router.post('/employees/edit/:id',(req,res,next)=>{
  let employee=new Employee();
  const query = {_id:req.params.id}
  const update ={userid:req.body.userid,password:req.body.password,name:req.body.name, email:req.body.email,address:req.body.address,
  title:req.body.jobtitle,salary:req.body.salary}

Employee.updateEmployee(query,update,{},(err,employee)=>{
  if(err)
  {
    res.send(err);
  }
  res.redirect('/manage_employees');
});

});
//Post of sup edit timesheet
router.post('/timesheets/sup/edit/:id',(req,res,next)=>{
  let sheet=new Sheet();
  const query = {_id:req.params.id}
  //console.log(req.params.emp_project);
  //const update ={projecttitle:'IOS Student Project',empname:emp_name,date:req.body.timesheet_date,fromtime:req.body.timesheet_from_date,totime:req.body.timesheet_to_date}
const update ={date:req.body.timesheet_date,fromtime:req.body.timesheet_from_date,totime:req.body.timesheet_to_date}
//console.log(req.body.select_supervisor);
Sheet.updateSheet(query,update,{},(err,sheet)=>{
  if(err)
  {
    res.send(err);
  }
  res.redirect('/get_sup_timesheets');
});

});
//Handling the post request of employees
//Edit TimesheetS
router.post('/timesheets/emp/edit/:id',(req,res,next)=>{
  let sheet=new Sheet();
  const query = {_id:req.params.id}
  //console.log(req.params.emp_project);
  //const update ={projecttitle:'IOS Student Project',empname:emp_name,date:req.body.timesheet_date,fromtime:req.body.timesheet_from_date,totime:req.body.timesheet_to_date}
const update ={date:req.body.timesheet_date,fromtime:req.body.timesheet_from_date,totime:req.body.timesheet_to_date}
//console.log(req.body.select_supervisor);
Sheet.updateSheet(query,update,{},(err,sheet)=>{
  if(err)
  {
    res.send(err);
  }
  res.redirect('/get_my_timesheets');
});

});
//Edit TimesheetS
router.post('/timesheets/edit/:id',(req,res,next)=>{
  let sheet=new Sheet();
  const query = {_id:req.params.id}
  const update ={date:req.body.timesheet_date,fromtime:req.body.timesheet_from_date,totime:req.body.timesheet_to_date}
//console.log(req.body.select_supervisor);
Sheet.updateSheet(query,update,{},(err,sheet)=>{
  if(err)
  {
    res.send(err);
  }
  res.redirect('/get_timesheets');
});

});

//Edit ProjectS
router.post('/projects/edit/:id',(req,res,next)=>{
  let project=new Project();
  const query = {_id:req.params.id}
  const update ={title:req.body.title,budget:req.body.budget,customer:req.body.customer,sup:req.body.select_supervisor}
//console.log(req.body.select_supervisor);
   for(var i=0;i<req.body.select_other_emps.length;i++)
   {
     var x = { empid : req.params.id, empname : req.body.select_other_emps[i],empuserid : current_user};
     project.emps.push(x);
   }
Project.updateProject(query,update,{},(err,project)=>{
  if(err)
  {
    res.send(err);
  }
  res.redirect('/manage_projects');
});

});
router.post('/projects/edit/supervisor/:id',(req,res,next)=>{
  let project=new Project();
  const query = {_id:req.params.id}
  const update ={title:req.body.title,budget:req.body.budget,customer:req.body.customer,sup:req.body.select_supervisor}
//console.log(req.body.select_supervisor);
  /* for(var i=0;i<req.body.select_other_emps.length;i++)
   {
     var x = { empid : req.params.id, empname : req.body.select_other_emps[i],empuserid : current_user};
     project.emps.push(x);
   }*/
Project.updateProject(query,update,{},(err,project)=>{
  if(err)
  {
    res.send(err);
  }
  res.redirect('/manage_sup_projects');
});

});


//Delete Employee from project
router.delete('/delete/emp-project/:emp-id/:project-id',(req,res,next)=>{

  const query = {}
  console.log(req.params.emp-id);
  console.log(req.params.project-id);
//console.log("I am deleting Employee");
Project.removeEmployee(query,(err,employee)=>{
  if(err){
    res.send(err);
  }
  res.status(200);
});

});
//Delete Employee
router.delete('/delete/:id',(req,res,next)=>{

  const query = {_id:req.params.id}
  console.log("employee to delete value is ",emp_to_delete);
  const query2 = {$pull : { emps : { empuserid : emp_to_delete } } }
//console.log("I am deleting Employee");
Project.removeDeletedEmployee(query2,(err,project)=>{
Employee.removeEmployee(query,(err,employee)=>{
  if(err){
    res.send(err);
  }
  res.status(200);
});
});
});

router.delete('/delete/emp_project/:id',(req,res,next)=>{

  const query = {_id:req.params.id}
  console.log("employee to delete value is ",emp_to_delete);
  const query2 = {$pull : { emps : { empid : req.params.id } } }
//console.log("I am deleting Employee");
Project.removeDeletedEmployee(query2,(err,project)=>{
});
});


router.delete('/delete/emp_project/sup/:id',(req,res,next)=>{

  const query = {_id:req.params.id}
  console.log("employee to delete value is ",emp_to_delete);
  const query2 = {$pull : { emps : { empid : req.params.id } } }
//console.log("I am deleting Employee");
Project.removeDeletedEmployee(query2,(err,project)=>{
});
});
//Remove an employee
router.get('/manage_projects/projects/removeEmployee/:pid/:eid',(req,res,next)=>{
  console.log(req.params.pid);
console.log(req.params.eid);
const query ={_id:req.params.pid}
//const rem_query = { emps._id : eid}, { $set : { emps.$.empactive  : false }}
//Project.findOneAndUpdate({_id: req.params.pid},{$set : {'emps.$[elem].empactive' : false}},{ arrayFilters: [ { "elem.empactive": {"elem._id" : req.params.eid } } ] })
res.render('manage_projects');
});
//Delete Projec
router.delete('/delete/project/:id',(req,res,next)=>{

  const query = {_id:req.params.id}

Project.removeProject(query,(err,project)=>{
  if(err){
    res.send(err);
  }
  res.status(200);
});

});

module.exports=router
