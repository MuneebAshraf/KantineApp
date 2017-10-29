$(document).ready(function () {

    API.Items.getAll(function (err, items) {
        if (err) {
            return window.location.href = "index.html";
        }

        var total = 0;
        var OrderGridRowSpan = 2;
        var itemsInBag = [];


        $(".Order").addClass('fadeIn')
        for(i = 0 ; i < items.length ; i++){
            var item = items[i];
            $("section").append(
                "<div class='items animated fadeIn' data-id='"+ item.itemId + "' data-index='"+ i + "' data-name='"+item.itemName+"' data-price='"+item.itemPrice+"' >" +
                "<img src=lib/"+item.itemName+".jpg>" +
                "<p>"+item.itemName+"</p>" +
                "<p>"+item.itemPrice+" kr.</p>" +
                "</div>")
        }

        $(".items").on('click', function () {
            //add this item to array that will be sent to server
            itemsInBag.push(items[$(this).attr('data-index')]);

            //get height of Order element before inserting
            height = $(".Order").height();

            //insert clicked item
            $(".Order #total").before("<h3>" +$(this).attr('data-name')+"</h3><h3 style='align-self: flex-end'>"+$(this).attr('data-price')+" kr.</h3>");

            //add price to total
            total += parseInt($(this).attr('data-price'));
            $('.amount').text(total + " kr.");

            //if number items makes the height change, then make Order element bigger
            if (height !== $(".Order").height() ) {
                $(".Order").css('grid-area', 'span '+ ++OrderGridRowSpan +' / span 2 / 2 / -1');
            }
        });


        $(".sendOrder").on('click', function () {
            //check if bag is empty
            if (itemsInBag.length !== 0) {
                //confirm if user wants to send the order
                var confirm = window.confirm("Er du sikker på at du vil sende ordren?");
                if (confirm) {
                    //send order
                    API.Orders.create(itemsInBag, function () {
                        window.alert("Din Ordre er blevet sendt!\nDu skal selv holde dig opdateret om din ordre er klar\nForventet tid er ca 10 minutter,")
                    })
                }
                //if bag is empty alert user that no items has been added
            } else  {
                window.alert("Din Ordre er tom!")
            }
        })

    });





    $(".logout").on('click',function () {
        API.logOut(function () {
            window.location.href = "index.html";
        })
    })
})