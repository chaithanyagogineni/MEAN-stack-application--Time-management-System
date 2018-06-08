$(document).ready(()=>{
  $('.employee-delete').on('click',(e)=>{
    $target = $(e.target);
    $.ajax({
      type: 'DELETE',
      url: '/delete/'+$target.attr('data-cat-id'),
      success: (response) =>{
        alert('Employee removed');
        window.location.href='/manage_employees'
      },
      error: (error) =>{
        console.log(error);
      }
    });
  });
  $('.emp-delete').on('click',(e)=>{
    $target = $(e.target);
    $.ajax({
      type: 'DELETE',
      url: '/delete/emp_project/'+$target.attr('data-emp-id'),
      success: (response) =>{
        alert('Employee removed');
        window.location.href='/manage_projects'
      },
      error: (error) =>{
        console.log(error);
      }
    });
  });
  $('.project-sup-delete').on('click',(e)=>{
    $target = $(e.target);
    $.ajax({
      type: 'DELETE',
      url: '/delete/emp_project/sup/'+$target.attr('data-emp-sup-id'),
      success: (response) =>{
        alert('Employee removed');
        window.location.href='/manage_sup_projects'
      },
      error: (error) =>{
        console.log(error);
      }
    });
  });
  $('.project-delete').on('click',(e)=>{
    $target = $(e.target);
    $.ajax({
      type: 'DELETE',
      url: '/delete/project/'+$target.attr('data-pro-id'),
      success: (response) =>{
        alert('Project removed');
        window.location.href='/manage_projects'
      },
      error: (error) =>{
        console.log(error);
      }
    });
  });
});
