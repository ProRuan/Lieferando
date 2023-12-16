// Variables
let shoppingCart = [];    // contains all selected dishes


// Functions
loadShoppingCart();


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


function writeTitleAndPrice(i) {
    return `
        <div id="item-title-and-price-${i}" class="width-100 display-between-center gap-20">
            <div id="item-title-${i}" class="added-item-title fw-700">${getTitleOfDish(i)}</div>
            <output id="item-price-${i}" class="item-price fw-700">${getDecimalPriceInCart(i)} €</output>
        </div>
    `;
}


function getTitleOfDish(i) {
    let index = getDishId(i);
    return dishes[index]['title'];
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
        <div id="added-option-${i}" class="added-options">${getOptionInCart(i)}</div>
    `;
}


function getOptionInCart(i) {
    return shoppingCart[i]['option'];
}


function writeNotesAndAmount(i) {
    return `
        <div class="mt-8 display-between-center gap-20">
            <div class="width-50 item-notes">Anmerkungen hinzufügen</div>
            <div class="width-50 display-between-center">
                <button id="menu-plus-button-${i}" class="button" onclick="increaseItems(${i})">+</button>
                <div id="item-amount-${i}" class="item-amount">${getAmountInCart(i)}</div>
                <button id="menu-minus-button-${i}" class="button" onclick="decreaseItems(${i})">-</button>
            </div>
        </div>
    `;
}


function getAmountInCart(i) {
    return shoppingCart[i]['amount'];
}


function loadShoppingCart() {
    let shopingCartAsText = localStorage.getItem('shoppingCart');
    if (shopingCartAsText) {
        shoppingCart = JSON.parse(shopingCartAsText);
    }
}


function addDish(i) {    // adds dish i to the shopping cart
    addOrIncreaseIf(i);
    sortItems();
    updateId();
    saveAndRender();
    calculateTotalPriceIf(i)    // notwendig?
    saveAndRender();    // notwendig?
}


function saveAndRender() {
    save();
    render();
}


function addOrIncreaseIf(i) {
    if (alreadyInCart(i)) {    // if item i is already in the shopping cart ...
        updateAmountAndPrice(i);    // update amount and price of item i
    } else {    // else ...
        addToShoppingCart(i);    // add item to the shopping cart
    }
}


function alreadyInCart(i) {    // returns true or false
    return dishes[i]['in-cart'];
}


function updateAmountAndPrice(i) {    // sets the current amount and price of the requested item
    let itemId = getItemId(i);    // contains the index of the requested item in the shopping cart
    increaseAmountInCart(itemId);
    increasePriceInCart(i, itemId);
}


function getItemId(i) {
    return dishes[i]['item-id'];
}


function increaseAmountInCart(itemId) {
    shoppingCart[itemId]['amount']++;
}


function increasePriceInCart(i, itemId) {
    let price = getPrice(i);
    let optionPrice = getOptionPriceIf(i);
    let totalPrice = price + optionPrice;
    shoppingCart[itemId]['price'] += totalPrice;
}


function addToShoppingCart(i) {    // adds the dish i to shopping cart
    let currentIndex = getCurrentIndex();    // contains the index of the current item
    shoppingCart[currentIndex] = {
        'dish-id': i,    // contains the id of dish i
        // 'item-id': currentIndex,
        'price': getPriceIf(i),    // takes the price of dish i
        'option': 'keine / nicht ausgewählt',    // takes the option of dish i
        'amount': 1,    // sets amount = 1
    };    // adds the dish i to shopping cart

    dishes[i]['in-cart'] = true,
        dishes[i]['item-id'] = currentIndex;
}


function getCurrentIndex() {    // provides the current index for the new item
    return shoppingCart.length;
}


function getPriceIf(i) {
    let price = getPrice(i);
    let optionSelected = getOptionSelected(i);
    if (optionSelected) {
        let optionPrice = getOptionPrice(i);
        return price + optionPrice;
    } else {
        return price;
    }
}


function increaseItems(i) {
    increaseAmount(i);
    increasePrice(i);
    saveAndRender();
}


function increaseAmount(i) {
    shoppingCart[i]['amount']++;
}


function increasePrice(i) {
    let priceInCart = getPriceInCart(i);
    let dishId = getDishId(i);
    let price = getPriceIf(dishId);
    let currentPrice = priceInCart + price;
    shoppingCart[i]['price'] = currentPrice;
}


function decreaseItems(i) {
    decreaseAmount(i);
    saveAndRender();
}


function decreaseAmount(i) {
    let amount = getAmountInCart(i);
    decreaseOrDeleteItem(amount, i);
}


function decreaseOrDeleteItem(amount, i) {
    if (amount > 1) {
        shoppingCart[i]['amount']--;
        decreasePrice(i);
    } else {
        let dishId = getDishId(i);
        dishes[dishId]['in-cart'] = false;
        delete dishes[dishId]['item-id'];
        shoppingCart.splice(i, 1);
        updateItemId();
    }
}


function decreasePrice(i) {
    let priceInCart = getPriceInCart(i);
    let dishId = getDishId(i);
    let price = getPriceIf(dishId);
    let currentPrice = priceInCart - price;
    shoppingCart[i]['price'] = currentPrice;
}


// in Gebrauch?
function updateItemId() {
    for (let i = 0; i < shoppingCart.length; i++) {
        // shoppingCart[i]['item-id'] = i;
        let dishId = getDishId(i);
        dishes[dishId]['item-id'] = i;
    }
}


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
            // 'item-id': copy[itemId]['item-id'],
            'amount': copy[itemId]['amount'],
            'price': copy[itemId]['price'],
            'option': copy[itemId]['option']
        }
        copy[itemId]['dish-id'] = dishes.length;
    }
}


function copyOfShoppingCart() {
    let copy = [];
    for (let i = 0; i < shoppingCart.length; i++) {
        copy[i] = {
            'dish-id': shoppingCart[i]['dish-id'],
            // 'item-id': shoppingCart[i]['item-id'],
            'amount': shoppingCart[i]['amount'],
            'price': shoppingCart[i]['price'],
            'option': shoppingCart[i]['option']
        };
    }
    return copy;
}


function updateId() {
    for (let i = 0; i < shoppingCart.length; i++) {
        let dishId = getDishId(i);
        dishes[dishId]['item-id'] = i;
    }
}