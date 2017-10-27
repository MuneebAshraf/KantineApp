$(document).ready(function () {
    
  $(".logout").on('click',function () {
      API.logOut(function (err) {
          if(err) {
              return alert("Kunne ikke logge ud, prøv igen")
          }
          window.location.href = "index.html";
      })
  })  
    
    
    
    
    
    
})