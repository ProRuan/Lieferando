// Variables
let shoppingCart = [];    // contains all selected dishes


// Functions
loadShoppingCart();


function loadShoppingCart() {
    let shopingCartAsText = localStorage.getItem('shoppingCart');
    if (shopingCartAsText) {
        shoppingCart = JSON.parse(shopingCartAsText);
    }
}


function showItems() {
    let itemCollector = document.getElementById('shopping-cart-item-collector');
    itemCollector.innerHTML = '';
    fillItemCollector(itemCollector);
    save();
}


function fillItemCollector(itemCollector) {
    for (let i = 0; i < shoppingCart.length; i++) {
        itemCollector.innerHTML += writeItem(i);
    }
}


function writeItem(i) {
    return `
    <div id="shopping-cart-item-${i}" class="shopping-cart-item">
        <table>
            ${writeTableTr(i)}
        </table>
    </div>
`;
}


function writeTableTr(i) {
    return `
        <tr>
            <td id="item-index-${i}" class="item-index fw-700">${getAmountInCart(i)}</td>
            <td class="column-start-start item-details">
                ${writeTitleAndPrice(i)}
                ${writeOption(i)}
                ${writeNotesAndAmount(i)}
            </td>
        </tr>
    `;
}


function getAmountInCart(i) {
    return shoppingCart[i]['amount'];
}


function writeTitleAndPrice(i) {
    return `
        <div id="item-title-and-price-${i}" class="width-100 display-between-center gap-20">
            <div id="item-title-${i}" class="added-item-title fw-700">${getTitleOfDish(i)}</div>
            <output id="item-price-${i}" class="item-price fw-700">${getDecimalPriceInCart(i)} €</output>
        </div>
    `;
}


function getTitleOfDish(i) {
    let dishId = getDishId(i);
    return dishes[dishId]['title'];
}


function getDishId(i) {
    return shoppingCart[i]['dish-id'];
}


function getDecimalPriceInCart(i) {
    let price = getPriceInCart(i);
    return price.toFixed(2);
}


function getPriceInCart(i) {
    return shoppingCart[i]['price'];
}


function writeOption(i) {
    return `
        <div id="added-option-${i}" class="added-options">${getOptionOfDish(i)}</div>
    `;
}


function getOptionOfDish(i) {
    let dishId = getDishId(i);
    return dishes[dishId]['option'];
}


function writeNotesAndAmount(i) {
    return `
        <div class="mt-8 display-between-center gap-20">
            <div class="width-50 item-notes">Anmerkungen hinzufügen</div>
            <div class="width-50 display-between-center">
                <button id="menu-plus-button-${i}" class="button" onclick="increaseItemInCart(${i})">+</button>
                <div id="item-amount-${i}" class="item-amount">${getAmountInCart(i)}</div>
                <button id="menu-minus-button-${i}" class="button" onclick="decreaseItemInCart(${i})">-</button>
            </div>
        </div>
    `;
}


function increaseItemInCart(i) {
    increaseAmountInCart(i);
    increasePriceInCart(i);
    saveAndRender();
}


function saveAndRender() {
    save();
    render();
}




// in Arbeit ...
function increaseAmountInCart(i) {
    shoppingCart[i]['amount']++;
}


function increasePriceInCart(i) {
    let dishId = getDishId(i);
    let priceOfItem = getPrice(dishId);
    let upcharge = getUpchargeIf(dishId);
    let totalPrice = priceOfItem + upcharge;
    shoppingCart[i]['price'] += totalPrice;
}


function getUpchargeIf(dishId) {
    let optionSelected = getOptionSelected(dishId);
    if (optionSelected) {
        return getUpcharge(dishId);
    } else {
        return 0;
    }
}


// function getItemId(i) {
//     return dishes[i]['item-id'];
// }





function outputSubtotal() {
    let subtotal = calculateSubtotal();
    let output = document.getElementById('subtotal');
    output.innerHTML = subtotal.toFixed(2);
}


function calculateSubtotal() {
    let subtotal = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
        subtotal += shoppingCart[i]['price'];
    }
    return subtotal;
}


function outputDeliveryCosts() {
    let deliveryCosts = calculateDeliveryCosts();
    let output = document.getElementById('delivery-costs');
    output.innerHTML = deliveryCosts.toFixed(2);
}


function calculateDeliveryCosts() {
    // let subtotal = calculateSubtotal();
    let subtotal = +document.getElementById('subtotal').innerHTML;
    if (subtotal < 30) {
        return 30;
    } else {
        return 0;
    }
}


function outputTotal() {
    let total = calculateTotal();
    let output = document.getElementById('total');
    let orderButton = document.getElementById('order-button-total');
    output.innerHTML = total.toFixed(2);
    orderButton.innerHTML = total.toFixed(2);
}


function calculateTotal() {
    // let subtotal = calculateSubtotal();
    // let deliveryCosts = calculateDeliveryCosts();
    let subtotal = +document.getElementById('subtotal').innerHTML;
    let deliveryCosts = +document.getElementById('delivery-costs').innerHTML;
    return subtotal + deliveryCosts;
}






// Funktioert!!! :)
function sortItems() {
    let copy = copyOfShoppingCart();
    shoppingCart = [];
    for (let i = 0; i < copy.length; i++) {
        let min = dishes.length;
        let itemId = 0;
        for (let j = 0; j < copy.length; j++) {
            let dishId = copy[j]['dish-id'];
            if (dishId < min) {
                min = dishId;
                itemId = j;
            }
        }
        shoppingCart[i] = {
            'dish-id': copy[itemId]['dish-id'],
            'amount': copy[itemId]['amount'],
            'title': copy[itemId]['title'],
            'price': copy[itemId]['price']
        }
        copy[itemId]['dish-id'] = dishes.length;
    }
}


function copyOfShoppingCart() {
    let copy = [];
    for (let i = 0; i < shoppingCart.length; i++) {
        copy[i] = {
            'dish-id': shoppingCart[i]['dish-id'],
            'amount': shoppingCart[i]['amount'],
            'title': shoppingCart[i]['title'],
            'price': shoppingCart[i]['price']
        };
    }
    return copy;
}


function updateItemId() {
    for (let i = 0; i < shoppingCart.length; i++) {
        let dishId = getDishId(i);
        dishes[dishId]['item-id'] = i;
    }
}