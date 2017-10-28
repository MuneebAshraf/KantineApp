$(document).ready(function () {

    API.Items.getAll(function (err, items) {
        if (err) {
            return window.location.href = "index.html";
        }

        for(i = 0 ; i < items.length ; i++){
            var item = items[i];
            $("section").append(
                "<div class='items animated fadeIn' data-id = " + item.itemId + ">" +
                "<img src=lib/"+item.itemName+".jpg>" +
                "<p>"+item.itemName+"</p>" +
                "<p>"+item.itemPrice+" kr.</p>" +
                "</div>")
        }

    });



    $(".logout").on('click',function () {
        API.logOut(function () {

            window.location.href = "index.html";
        })
    })








})