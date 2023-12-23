// Variables
let shoppingCart = [];    // contains all selected dishes


// Functions
load(shoppingCart, 'shoppingCart');


function showItems() {    // shows all items in the shopping cart
    let itemCollector = getElement('shopping-cart-item-collector');    // contains the element 'shopping-cart-item-collector'
    itemCollector.innerHTML = '';    // empties itemCollector
    fillItemCollector(itemCollector);
    setShoppingCartSections();
    save(shoppingCart, 'shoppingCart');
}


function fillItemCollector(itemCollector) {    // fills itemCollector with i items
    for (let i = 0; i < shoppingCart.length; i++) {
        itemCollector.innerHTML += writeItem(i);
    }
}


function writeItem(i) {    // writes the item i in the shopping cart
    return `
    <div id="shopping-cart-item-${i}" class="shopping-cart-item">
        <table>
            ${writeTableTr(i)}
        </table>
    </div>
`;
}


function writeTableTr(i) {    // writes the table row i in the shopping cart
    let amount = getJSONIndexValue(shoppingCart, i, 'amount');
    return `
        <tr>
            <td id="item-index-${i}" class="item-index fw-700">${amount}</td>
            <td class="column-start-start item-details">
                ${writeTitleAndPrice(i)}
                ${writeOption(i)}
                ${writeNotesAndAmount(i)}
            </td>
        </tr>
    `;
}


function writeTitleAndPrice(i) {    // writes title and price of dish i in the shopping cart
    let title = getJSONIndexValue(shoppingCart, i, 'title');
    let price = getDecimal(shoppingCart, i, 'price');
    return `
        <div id="item-title-and-price-${i}" class="width-100 display-between-center gap-20">
            <div id="item-title-${i}" class="added-item-title fw-700">${title}</div>
            <output id="item-price-${i}" class="item-price fw-700">${price} €</output>
        </div>
    `;
}


function writeOption(i) {    // writes the option of item i in the shopping cart
    return `
        <div id="added-option-${i}" class="added-options">${i}</div>
    `;
}


function writeNotesAndAmount(i) {    // writes notes and amount of item i in the shopping cart
    let amount = getJSONIndexValue(shoppingCart, i, 'amount');
    return `
        <div class="mt-8 width-100 display-between-center gap-20">
            <div class="item-notes">Anmerkungen hinzufügen</div>
            <div class="display-between-center">
                <button id="menu-plus-button-${i}" class="button" onclick="increaseItemInCart(${i})">+</button>
                <output id="item-amount-${i}" class="item-amount">${amount}</output>
                <button id="menu-minus-button-${i}" class="button" onclick="decreaseItemInCart(${i})">-</button>
            </div>
        </div>
    `;
}


function setShoppingCartSections() {    // shows and hides sections of the shopping cart
    let cartEmpty = (shoppingCart.length < 1);
    if (cartEmpty) {    // if shoppingCart is empty ...
        setClassOnCommand('shopping-cart-guide', 'display-none', 'remove');
        setClassOnCommand('shopping-cart-item-collector', 'display-none', 'add');
        setClassOnCommand('sum-and-order', 'display-none', 'add');
    } else {    // shopping cart contains one or more items ...
        setClassOnCommand('shopping-cart-guide', 'display-none', 'add');
        setClassOnCommand('shopping-cart-item-collector', 'display-none', 'remove');
        setClassOnCommand('sum-and-order', 'display-none', 'remove');
    }
}


function increaseItemInCart(i) {    // increases item i in the shopping cart
    increaseJSONIndexValue(shoppingCart, i, 'amount', 1);
    increasePriceInCart(i);
    saveAndRender();
}


function increasePriceInCart(i) {    // increases the price of item i in cart
    let dishId = getJSONIndexValue(shoppingCart, i, 'dish-id');    // contains the index of the related dish
    let original = getJSONIndexValue(dishes, dishId, 'original');    // contains true or false
    (original) ? increasePriceOfOriginal(i, dishId) : increasePriceOfUpgraded(i, dishId);
}


function increasePriceOfOriginal(i, dishId) {    // increases the price of original item in the shopping cart
    let price = getJSONIndexValue(dishes, dishId, 'price');
    increaseJSONIndexValue(shoppingCart, i, 'price', price);
}


function increasePriceOfUpgraded(i, dishId) {    // increases the price of upgraded item in the shopping cart
    originalDishId = downgradeIndex(dishId);    // reduces the index of upgraded dish to get the original dish
    let priceOfItem = getJSONIndexValue(dishes, originalDishId, 'price');
    let upcharge = getJSONIndexValue(dishes, originalDishId, 'upcharge');
    let totalPrice = priceOfItem + upcharge;        // contains the adding total price of item i
    increaseJSONIndexValue(shoppingCart, i, 'price', totalPrice);
}


function downgradeIndex(dishId) {    // reduces the index of upgraded dish to get the index of original dish
    return --dishId;    // index of upgraded dish - 1
}


function saveAndRender() {
    saveAll();
    render();
}


function decreaseItemInCart(i) {    // decreases item i in the shopping cart
    decreaseOrDeleteItem(i);
    saveAndRender();
}


function decreaseOrDeleteItem(i) {    // decreases or delete item i in the shopping cart
    let amount = getJSONIndexValue(shoppingCart, i, 'amount');    // contains the amount of item i
    if (amount > 1) {    // if the amount is greater than 1 ...
        increaseJSONIndexValue(shoppingCart, i, 'amount', -1);
        decreasePriceInCart(i);    // decrease price of item i
    } else {    // else ...
        deleteItem(i);    // delete item i
        updateItemId();
    }
}


function decreasePriceInCart(i) {    // decreases the price of item i in the shopping cart
    let dishId = getJSONIndexValue(shoppingCart, i, 'dish-id');    // contains the index of the related dish
    let original = getJSONIndexValue(dishes, dishId, 'original');    // contains true or false
    (original) ? decreasePriceOfOriginal(i, dishId) : decreasePriceOfUpgraded(i, dishId);
}


function decreasePriceOfOriginal(i, dishId) {    // decreases the price of original item in the shopping cart
    let price = getJSONIndexValue(dishes, dishId, 'price');
    increaseJSONIndexValue(shoppingCart, i, 'price', -price);
}


function decreasePriceOfUpgraded(i, dishId) {    // decreases the price of upgraded item in the shopping cart
    originalDishId = downgradeIndex(dishId);    // reduces the index of upgraded dish to get the original dish
    let priceOfItem = getJSONIndexValue(dishes, originalDishId, 'price');
    let upcharge = getJSONIndexValue(dishes, originalDishId, 'upcharge');
    let totalPrice = priceOfItem + upcharge;    // contains the adding total price of item i
    increaseJSONIndexValue(shoppingCart, i, 'price', -totalPrice);
}


function deleteItem(i) {    // removes item i from the shopping cart
    let dishId = getJSONIndexValue(shoppingCart, i, 'dish-id');    // contains the index of related dish
    setJSONIndexValue(dishes, dishId, 'in-cart', false);
    deleteJSONObjectValue(dishes, dishId, 'item-id');
    deleteJSONObject(shoppingCart, i, 1);
}


function deleteJSONObjectValue(variable, index, key) {
    delete variable[index][key];
}


function deleteJSONObject(variable, index, value) {
    variable.splice(index, value);
}


function outputSubtotal() {    // outputs the subtotal in the shopping cart
    let subtotal = calculateSubtotal();
    let subtotalAsDecimal = formatAsDecimal(subtotal);
    outputValue('subtotal', subtotalAsDecimal);
}


function calculateSubtotal() {    // calculates the subtotal of all items in the shopping cart
    let subtotal = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
        subtotal += getJSONIndexValue(shoppingCart, i, 'price');
    }
    return subtotal;
}


function formatAsDecimal(number) {
    return number.toFixed(2).replace('.', ',');
}


function outputValue(id, decimal) {
    document.getElementById(id).innerHTML = decimal;
}


function outputDeliveryCosts() {    // outputs the delivery costs in the shopping cart
    let deliveryCosts = calculateDeliveryCosts();
    let deliveryCostsAsDecimal = formatAsDecimal(deliveryCosts);
    outputValue('delivery-costs', deliveryCostsAsDecimal);
}


function calculateDeliveryCosts() {    // calculates the delivery costs of the shopping cart
    let subtotal = getUnformattedNumber('subtotal');    // contains the subtotal
    return (subtotal < 20) ? 3.90 : 0;    // true: 3.90 | false: 0
}


function getUnformattedNumber(id) {
    let numberFormatted = selectOutput(id);
    return Number(numberFormatted.replace(',', '.'));
}


function outputTotal() {    // outputs the total in the shopping cart
    let total = calculateTotal();
    let totalAsDecimal = formatAsDecimal(total);
    let ids = ['total', 'order-button-total', 'mobile-button-total'];    // contains the ids of output elements
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        outputValue(id, totalAsDecimal);
    }
}


function calculateTotal() {    // calculates the total of the shopping cart
    let subtotal = getUnformattedNumber('subtotal');    // contains the subtotal
    let deliveryCosts = getUnformattedNumber('delivery-costs');    // contains the delivery costs
    return subtotal + deliveryCosts;    // returns the total
}


function sortItems() {    // sorts items in the order of dishes
    let copy = copyJSON(shoppingCart);    // contains a copy of shoppingCart
    emptyJSON(shoppingCart);
    refillJSON(copy);
}


function copyJSON(variable) {
    let copy = [];    // defines the empty JSON array copy
    for (let i = 0; i < variable.length; i++) {
        copy[i] = {
            'dish-id': getJSONIndexValue(variable, i, 'dish-id'),
            'amount': getJSONIndexValue(variable, i, 'amount'),
            'title': getJSONIndexValue(variable, i, 'title'),
            'price': getJSONIndexValue(variable, i, 'price')
        };
    }
    return copy;    // returns the whole copy
}


function emptyJSON(variable) {
    variable = [];
}


function refillJSON(variable, master, copy) {
    for (let i = 0; i < copy.length; i++) {
        let min = getJSONLength(master);
        let lowest = getLowestIndex(copy, min);    // contains the lowest itemID
        variable[i] = {
            'dish-id': getJSONIndexValue(copy, lowest, 'dish-id'),
            'amount': getJSONIndexValue(copy, lowest, 'amount'),
            'title': getJSONIndexValue(copy, lowest, 'title'),
            'price': getJSONIndexValue(copy, lowest, 'price')
        };    // adds the item i to the shopping cart
        setJSONIndexValue(copy, lowest, 'dish-id', master.length);
    }
}


function getLowestIndex(copy, min) {    // provides the lowest itemId
    let lowest = 0;
    for (let i = 0; i < copy.length; i++) {
        let dishId = getJSONIndexValue(copy, i, 'dish-id');    // contains the dishId of copied item j
        if (dishId < min) {    // if dishId less than minimum index ...
            min = dishId;    // set minimum index = dishID
            lowest = i;    // set current lowest itemId
        }
    }
    return lowest;    // returns final lowest index
}


function updateItemId() {    // updates the itemId of dishes
    for (let i = 0; i < shoppingCart.length; i++) {
        let dishId = getJSONIndexValue(shoppingCart, i, 'dish-id');    // contains the dishId of item i
        setJSONIndexValue(dishes, dishId, 'item-id', i);
    }
}


function showShoppingCart() {
    setClassOnCommand('body', 'overflowY-responsive', 'add');
    setClassOnCommand('shopping-cart-window', 'display-unset', 'remove');
    setClassOnCommand('shopping-cart-mobile', 'display-none', 'add');
}


function hideShoppingCart() {
    setClassOnCommand('body', 'overflowY-responsive', 'remove');
    setClassOnCommand('shopping-cart-window', 'display-unset', 'add');
    setClassOnCommand('shopping-cart-mobile', 'display-none', 'remove');
}