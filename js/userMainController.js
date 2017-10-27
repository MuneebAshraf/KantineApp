$(document).ready(function () {

    API.Items.getAll(function (err, items) {
        if (err) {
            return alert("Noget gik galt, venligst opdater siden")
        }

        // for(i = 0 ; i < items.length ; i++){
        //     var item = items[i]
        //     $("section").append(
        //         "<div class='items' data-id = " + item.itemId + "> " +
        //         "<img src=lib/"+item.itemName+".jpg>" +
        //         "<p>"+item.itemName+"</p>" +
        //         "<p>"+item.itemPrice+" kr.</p>" +
        //         "</div>")
        // }

        console.log(items)
    })


  $(".logout").on('click',function () {
      API.logOut(function (err) {
          if(err) {
              return alert("Kunne ikke logge ud, prøv igen")
          }
          window.location.href = "index.html";
      })
  })  
    
    
    
    
    
    
})