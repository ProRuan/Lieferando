// Variables
let shoppingCart = [];    // contains all selected dishes with dish id, amount, title and price


// Functions
load('shoppingCart');


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


function writeTableTr(i) {    // writes the table row of item i in the shopping cart
    let amount = getCartObjectValue(i, 'amount');    // contains the amount of item i
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


function getCartObjectValue(index, key) {    // provides an object value of shoppingCart by index and key
    return shoppingCart[index][key];
}


function writeTitleAndPrice(i) {    // writes title and price of dish i in the shopping cart
    let title = getCartObjectValue(i, 'title');    // contains the title of item i
    let price = getDecimal(shoppingCart, i, 'price');    // contains the price of item i formatted as a decimal
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
    let amount = getCartObjectValue(i, 'amount');    // contains the amount of item i
    return `
        <div class="mt-8 width-100 display-between-center gap-20">
            <div class="item-notes">Anmerkungen hinzufügen</div>
            <div class="display-between-center">
                <button id="menu-plus-button-${i}" class="button" onclick="updateItemInCart(${i}, true)">+</button>
                <output id="item-amount-${i}" class="item-amount">${amount}</output>
                <button id="menu-minus-button-${i}" class="button" onclick="updateItemInCart(${i}, false)">-</button>
            </div>
        </div>
    `;
}


function setShoppingCartSections() {    // shows and hides sections of the shopping cart
    let cartEmpty = (shoppingCart.length < 1);
    if (cartEmpty) {    // shoppingCart is empty ...
        setClassOnCommand('shopping-cart-guide', 'remove', 'display-none');
        setClassOnCommand('shopping-cart-item-collector', 'add', 'display-none');
        setClassOnCommand('sum-and-order', 'add', 'display-none');
    } else {    // shopping cart contains one or more items ...
        setClassOnCommand('shopping-cart-guide', 'add', 'display-none');
        setClassOnCommand('shopping-cart-item-collector', 'remove', 'display-none');
        setClassOnCommand('sum-and-order', 'remove', 'display-none');
    }
}


function updateItemInCart(i, increase) {    // increases or decreases (deletes) item i in the shopping cart
    (increase) ? increaseItemInCart(i, 1) : decreaseOrDeleteItemInCart(i, -1);    // true: increase item | false: decrease or delete item
}


function increaseItemInCart(i, sign) {    // increases item i in the shopping cart
    let amount = getCartObjectValue(i, 'amount');    // contains the amount of item i
    let price = getCartObjectValue(i, 'price');    // contains the price of item i
    price = sign * (price / amount);    // contains the increasing or decreasing value of price
    increaseCartObjectValue(i, 'amount', sign);
    increaseCartObjectValue(i, 'price', price);
    saveAndRender();
}


function saveAndRender() {
    saveAll();
    render();
}


function decreaseOrDeleteItemInCart(i, sign) {    // decreases or deletes item i in the shopping cart
    let amount = getCartObjectValue(i, 'amount');    // contains amount of item i
    (amount > 1) ? increaseItemInCart(i, sign) : deleteItem(i);    // true: decrease item | false: delete item
}


function deleteItem(i) {    // removes item i from the shopping cart
    let dishId = getCartObjectValue(i, 'dish-id');    // contains the index of related dish
    setDishesObjectValue(dishId, 'in-cart', false);
    deleteDishesObjectValue(dishId, 'item-id');
    deleteCartObject(i, 1);
    saveAndRender();
    updateItemId();
}


function deleteDishesObjectValue(index, key) {    // deletes an object value of dishes
    delete dishes[index][key];
}


function deleteCartObject(index, value) {    // deletes an object of shoppingCart
    shoppingCart.splice(index, value);
}


function outputSubtotal() {    // outputs the subtotal in the shopping cart
    let subtotal = calculateSubtotal();    // contains the subtotal
    let subtotalAsDecimal = formatAsDecimal(subtotal);    // contains the subtotal formatted as decimal
    outputValue('subtotal', subtotalAsDecimal);
}


function calculateSubtotal() {    // summarizes the subtotal of all items in the shopping cart
    let subtotal = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
        subtotal += getCartObjectValue(i, 'price');
    }
    return subtotal;
}


function formatAsDecimal(number) {    // returns a decimal number with comma
    return number.toFixed(2).replace('.', ',');
}


function outputValue(id, decimal) {    // writes the inner HTML of an element
    document.getElementById(id).innerHTML = decimal;
}


function outputDeliveryCosts() {    // outputs the delivery costs in the shopping cart
    let deliveryCosts = calculateDeliveryCosts();    // contains the delivery costs
    let deliveryCostsAsDecimal = formatAsDecimal(deliveryCosts);    // contais the delivery costs formatted as decimal
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


function selectOutput(id) {    // selects the element 'id' including innerHTML
    return document.getElementById(id).innerHTML;
}


function outputTotal() {    // outputs the total in the shopping cart
    let total = calculateTotal();    // contains the total
    let totalAsDecimal = formatAsDecimal(total);    // contains the total formatted as decimal
    let ids = ['total', 'order-button-total', 'mobile-button-total'];    // contains the ids of output elements
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];    // contains the current id
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
    emptyShoppingCart();
    refillShoppingCart(dishes, copy);
}


function copyJSON(variable) {    // creates a copy of a JSON
    let copy = [];
    for (let i = 0; i < variable.length; i++) {
        copy[i] = {
            'dish-id': getJSONObjectValue(variable, i, 'dish-id'),
            'amount': getJSONObjectValue(variable, i, 'amount'),
            'title': getJSONObjectValue(variable, i, 'title'),
            'price': getJSONObjectValue(variable, i, 'price')
        };
    }
    return copy;
}


function refillShoppingCart(master, copy) {    // refills the shopping cart with the sorted items
    for (let i = 0; i < copy.length; i++) {
        let min = getJSONLength(master);    // contains the current lowest dishId
        let lowest = getLowestIndex(copy, min);    // contains the lowest itemId
        shoppingCart[i] = {
            'dish-id': getJSONObjectValue(copy, lowest, 'dish-id'),
            'amount': getJSONObjectValue(copy, lowest, 'amount'),
            'title': getJSONObjectValue(copy, lowest, 'title'),
            'price': getJSONObjectValue(copy, lowest, 'price')
        };    // adds the item i to the shopping cart
        copy[lowest]['dish-id'] = master.length;    // sets the dishId out of reach
    }
}


function getLowestIndex(copy, min) {    // provides the lowest itemId
    let lowest = 0;
    for (let i = 0; i < copy.length; i++) {
        let dishId = getJSONObjectValue(copy, i, 'dish-id');    // contains the dishId of copied item j
        if (dishId < min) {    // if dishId less than minimum index ...
            min = dishId;    // set minimum index = dishID
            lowest = i;    // set current lowest itemId
        }
    }
    return lowest;    // returns final lowest index
}


function updateItemId() {    // updates the itemId of dishes
    for (let i = 0; i < shoppingCart.length; i++) {
        let dishId = getCartObjectValue(i, 'dish-id');    // contains the dishId of item i
        setDishesObjectValue(dishId, 'item-id', i);
    }
}


function showShoppingCartMobileIf() {    // shows the element 'shopping-cart-mobile' on one condition
    let itemAmount = getJSONLength(shoppingCart);    // contains the number of items in the shopping cart
    if (itemAmount > 0) {    // if itemAmount is greater than 0 ...
        setClassOnCommand('shopping-cart-mobile', 'add', 'display-flex');    // show shopping cart mobile
    } else {    // else ...
        setClassOnCommand('shopping-cart-mobile', 'remove', 'display-flex');    // hide shopping cart mobile
    }
}


function showShoppingCart() {    // shows the shopping cart
    setClassOnCommand('body', 'add', 'overflowY-responsive');
    setClassOnCommand('shopping-cart-window', 'remove', 'display-unset');
    setClassOnCommand('shopping-cart-mobile', 'add', 'display-none');
}


function hideShoppingCart() {    // hides the shopping cart
    setClassOnCommand('body', 'remove', 'overflowY-responsive');
    setClassOnCommand('shopping-cart-window', 'add', 'display-unset');
    setClassOnCommand('shopping-cart-mobile', 'remove', 'display-none');
}


function setClassOnCommand(id, command, className) {    // manages a class of an element on command
    (command == 'toggle') ? toggleClass(id, className) : addOrRemoveClass(id, command, className);
}


function toggleClass(id, className) {    // toggles a class of an element
    document.getElementById(id).classList.toggle(className);
}


function addOrRemoveClass(id, command, className) {    // adds or removes an element's class on command
    (command == 'add') ? addClass(id, className) : removeClass(id, className);
}


function addClass(id, className) {    // adds a class to an element
    document.getElementById(id).classList.add(className);
}


function removeClass(id, className) {    // removes a class from an element
    document.getElementById(id).classList.remove(className);
}