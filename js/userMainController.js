$(document).ready(function () {

    API.Items.getAll(function (err, items) {
        if (err) {
            return window.location.href = "index.html";
        }

        var total = 0;
        var OrderGridRowSpan = 2;
        var itemsInBag = [];


        //show order box only if items has been fetched from server
        $(".overOverview").addClass('fadeIn');
        //loop through all items
        for(i = 0 ; i < items.length ; i++){
            var item = items[i];
            $(".newOrder").append(
                "<div class='items animated fadeIn' data-id='"+ item.itemId + "' data-index='"+ i + "' data-name='"+item.itemName+"' data-price='"+item.itemPrice+"' >" +
                "<img src=lib/" + item.itemName.replace(' ', '-') + ".jpg>" +
                "<p>"+item.itemName+"</p>" +
                "<p>"+item.itemPrice+" kr.</p>" +
                "</div>")
        }

        //listener for click on any of the items
        $(".items").on('click', function () {
            //add this item to array that will be sent to server
            itemsInBag.push(items[$(this).attr('data-index')]);

            //get height of Order element before inserting
            height = $(".overOverview").height();

            //insert clicked item
            $(".overOverview #total").before("<h3 class='baggedItem'>" +$(this).attr('data-name')+"</h3><h3 class='baggedItem' style='align-self: flex-end'>"+$(this).attr('data-price')+" kr.</h3>");

            //add price to total
            total += parseInt($(this).attr('data-price'));
            $('.amount').text(total + " kr.");

            //if number items makes the height change, then make Order element bigger
            if (height !== $(".overOverview").height() ) {
                $(".overOverview").css('grid-area', 'span '+ ++OrderGridRowSpan +' / span 2 / 2 / -1');
            }
        });


        //listener for click on the sendorder button
        $(".sendOrder").on('click', function () {
            //check if bag is empty
            if (itemsInBag.length !== 0) {
                //confirm if user wants to send the order
                var confirm = window.confirm("Er du sikker på at du vil sende ordren?");
                if (confirm) {
                    //send order
                    API.Orders.create(itemsInBag, function () {
                        window.alert("Din ordre er blevet sendt!\nDu skal selv holde dig opdateret om din ordre er klar\nForventet tid er ca 10 minutter,");
                        total = 0;
                        $(".baggedItem").remove();
                        $('.amount').text(total + " kr.");
                    })
                }
                //if bag is empty alert user that no items has been added
            } else  {
                window.alert("Din Ordre er tom!")
            }
        })

    });

    $("#history").on('click',function () {
        $(".newOrder").hide();
        $(".history").show();
       API.Orders.getByUserId(function (err, orders) {
           if (err)
               return alert("Kunne ikke hente din historik, prøv igen om et øjeblik");

           for (var i = 0 ; i < orders.length ; i++) {
               var order = orders[i];
               var items = order.items;
               function isReady() {if(order.isReady === true){return "Din ordre er klar til afhentning"}else{return "Din ordre er stadig ikke klar"}}
               $(".history").append(
                "<div class='order animated fadeIn'>" +
                    "<p>"+ order.orderId +"</p>" +
                    "<p>"+ order.orderTime +"</p>" +
                    "<p>"+ isReady() +"</p>" +
               "</div>"
               );
               for (var j = 0 ; j < items.length ; j++) {
                   var item = items[j];


                $(".order").append(
                    "<p>"+item.itemName+"</p>" +
                    "<p>"+item.itemPrice+"</p>"
                )
               }
           }
       })
    });

    $("#newOrder").on('click',function () {
        $(".newOrder").show();
        $(".history").hide();
        $(".order").remove();

    });


    $(".logout").on('click',function () {
        API.logOut(function () {
            window.location.href = "index.html";
        })
    })
});