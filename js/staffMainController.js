$(window).ready(() => {

SDK.Orders.getAll((err, orders) => {
    if(err)


    for (let i = 0 ; i < orders.length ; i++) {
        let order = orders[orders.length - i - 1];
        let items = order.items;
        let total = 0;
        isReady= () => {
            if(order.isReady === true) {
                return "class= 'ready' >Klar"
            } else {
                return "class= 'notReady'>Ikke klar"
            }
        };
        $(".ordersContainer").append(
            `<div class='order animated fadeIn' data-id = ${order.orderId}> 
                <h2 ${isReady()}</h2>
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


    $(".order").on('click', function() {
        if (!($(this).find('h2').hasClass('ready'))){
            let confirm = window.confirm("Er du sikker på at du vil markere denne ordre som klar?");
            if (confirm)
                SDK.Orders.makeReady($(this).data("id"), (err, data) => {
                    if (err) return alert("Der var en fejl ved at ændre status på ordre!");

                    $(this).find('h2').toggleClass('ready notReady').text('Klar')


                })

        }
    })


});




$(".logout").on('click', () => {
    SDK.logOut( () => {
        this.total = 0;

        window.location.href = "index.html";
    })
});
});
