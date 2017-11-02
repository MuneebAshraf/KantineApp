$(document).ready( () => {

    const history = $(".ordersContainer");
    SDK.Items.getAll( (err, items) => {
        if (err) {
            return window.location.href = "index.html";
        }

        let total = 0;
        let OrderGridRowSpan = 2;
        let itemsInBag = [];



        //show order box only if items has been fetched from server
        $(".orderOverview").addClass('fadeIn');
        //loop through all items
        for(let i = 0 ; i < items.length ; i++){
            let item = items[i];

            $(".itemsContainer").append(
               `<div class='items animated fadeIn' data-id='${item.itemId}' data-index='${i}' data-name='${item.itemName}' data-price='${item.itemPrice}'>
                <img src=lib/${item.itemName.replace(' ', '-')}.jpg>
                <p>${item.itemName}</p>                     
                <p>${item.itemPrice} kr.</p>
                </div>`)
        }

        //listener for click on any of the items
        $(".items").on('click', function() {
            //add this item to array that will be sent to server
            itemsInBag.push(items[$(this).data('index')]);

            //get height of Order element before inserting
            height = $(".orderOverview").height();

            //insert clicked item
            $("#total").before("<h3 class='baggedItem'>" +$(this).data('name')+"</h3><h3 class='baggedItem' style='align-self: flex-end'>"+$(this).data('price')+" kr.</h3>");

            //add price to total
            total += parseInt($(this).data('price'));
            $('.amount').text(total + " kr.");

            //if number items makes the height change, then make Order element bigger
            if (height !== $(".orderOverview").height() ) {
                $(".orderOverview").css('grid-area', 'span '+ ++OrderGridRowSpan +' / span 2 / 2 / -1');
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
                    SDK.Orders.create(itemsInBag, () => {
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

    $("#history").on('click', () => {
        $(".ordersContainer").empty();
        $(".itemsContainer").hide();
        $(".ordersContainer").show();
        SDK.Orders.getByUserId( (err, orders) => {
            if (err)
                return alert("Kunne ikke hente din historik, prøv igen om et øjeblik");

            for (let i = 0 ; i < orders.length ; i++) {
                //show latest order first through this counter
                let order = orders[orders.length - i - 1];
                let items = order.items;
                let total = 0;
                isReady= () => {
                    if(order.isReady === true) {
                        return "class= 'ready' > Din ordre er klar til afhentning"
                    } else {
                        return "class= 'notReady' >  Din ordre er stadig ikke klar"
                    }
                };
                $(".ordersContainer").append(
                    `<div class='order animated fadeIn' data-id = ${order.orderId}> 
                    <h2 ${isReady()}</h2><br>
                    <p> Bestilt: </p>
                    <p> ${order.orderTime}</p><br>
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
                    total += item.itemPrice;
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

                $(`<h4>Total pris:  <span style="position: absolute; right: 12%;">${total} kr.</span></h4>`).insertBefore('*[data-id='+ order.orderId +'] table')
            }
        });
    });

    $("#newOrder").on('click', () => {
        $(".ordersContainer").hide().empty();
        $(".itemsContainer").show();
    });


    $(".logout").on('click', () => {
        SDK.logOut( () => {
            this.total = 0;
            $(".ordersContainer").empty();
            $(".baggedItem").remove();
            $('.amount').text(total + " kr.");

            window.location.href = "index.html";
        })
    })
});