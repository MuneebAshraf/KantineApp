$(document).ready( () => {

    let total = 0;
    let OrderGridRowSpan = 2;
    let itemsInBag = [];
    const orderOverview = $(".orderOverview");
    const history = $(".history");
    const newOrder = $(".newOrder");
    const baggedItem = $(".baggedItem");


    API.Items.getAll( (err, items) => {
        if (err) {
            return window.location.href = "index.html";
        }

        //show order box only if items has been fetched from server
        orderOverview.addClass('fadeIn');
        //loop through all items
        for(i = 0 ; i < items.length ; i++){
            let item = items[i];
            newOrder.append(
                "<div class='items animated fadeIn' data-id='"+ item.itemId + "' data-index='"+ i + "' data-name='"+item.itemName+"' data-price='"+item.itemPrice+"' >" +
                "<img src=lib/" + item.itemName.replace(' ', '-') + ".jpg>" +
                "<p>"+item.itemName+"</p>" +
                "<p>"+item.itemPrice+" kr.</p>" +
                "</div>")
        }

        //listener for click on any of the items
        $(".items").on('click', () => {
            //add this item to array that will be sent to server
            itemsInBag.push(items[$(this).attr('data-index')]);

            //get height of Order element before inserting
            height = orderOverview.height();

            //insert clicked item
            $("#total").before("<h3 class='baggedItem'>" +$(this).attr('data-name')+"</h3><h3 class='baggedItem' style='align-self: flex-end'>"+$(this).attr('data-price')+" kr.</h3>");

            //add price to total
            total += parseInt($(this).attr('data-price'));
            $('.amount').text(total + " kr.");

            //if number items makes the height change, then make Order element bigger
            if (height !== orderOverview.height() ) {
                orderOverview.css('grid-area', 'span '+ ++OrderGridRowSpan +' / span 2 / 2 / -1');
            }
        });


        //listener for click on the sendorder button
        $(".sendOrder").on('click', () => {
            //check if bag is empty
            if (itemsInBag.length !== 0) {
                //confirm if user wants to send the order
                let confirm = window.confirm("Er du sikker på at du vil sende ordren?");
                if (confirm) {
                    //send order
                    API.Orders.create(itemsInBag, () => {
                        window.alert("Din ordre er blevet sendt!\nDu skal selv holde dig opdateret om din ordre er klar\nForventet tid er ca 10 minutter,");
                        total = 0;
                        baggedItem.remove();
                        $('.amount').text(total + " kr.");
                    })
                }
                //if bag is empty alert user that no items has been added
            } else  {
                window.alert("Din Ordre er tom!")
            }
        })

    });

    $("#history").on('click', () => {
        history.empty();
        newOrder.hide();
        history.show();
       API.Orders.getByUserId( (err, orders) => {
           if (err)
               return alert("Kunne ikke hente din historik, prøv igen om et øjeblik");

           for (let i = 0 ; i < orders.length ; i++) {
               console.log(orders);
               let order = orders[i];
               let items = order.items;
               isReady= () => {
                   if(order.isReady === true) {
                       return "class= 'ready' > Din ordre er klar til afhentning"
                   } else {
                       return "class= 'notReady' >  Din ordre er stadig ikke klar"
                   }
               };
               history.append(
                `<div class='order animated fadeIn' data-id = ${order.orderId}> 
                    <h1 ${isReady()}</h1>
                    <p> Bestilt d.: </p>
                    <p> ${order.orderTime}</p>
                    <table>
                        <tr>
                            <th>Produkter:</th>
                            <th>Pris:</th>
                        </tr>
                    </table>
                   </div>`
               );
               for (let j = 0 ; j < items.length ; j++) {
                   let item = items[j];

                   $('*[data-id='+ order.orderId +'] table').append(
                    `<tr>
                        <td>
                            ${item.itemName}
                        </td> 
                        <td>
                            ${item.itemPrice} kr.
                        </td>
                    </tr>`
                )
               }            
           }
       })
    });

    $("#newOrder").on('click', () => {
        history.hide().empty();
        newOrder.show();
    });


    $(".logout").on('click', () => {
        API.logOut( () => {
            this.total = 0;
            history.empty();
            baggedItem.remove();
            $('.amount').text(total + " kr.");

            window.location.href = "index.html";
        })
    })
});