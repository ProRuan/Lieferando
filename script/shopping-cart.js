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
    updateItemId();
    saveAndRender();
}


function decreaseOrDeleteItem(i) {    // decreases or delete item i in the shopping cart
    let amount = getJSONIndexValue(shoppingCart, i, 'amount');    // contains the amount of item i
    if (amount > 1) {    // if the amount is greater than 1 ...
        increaseJSONIndexValue(shoppingCart, i, 'amount', -1);
        decreasePriceInCart(i);    // decrease price of item i
    } else {    // else ...
        deleteItem(i);    // delete item i
    }
}


function decreasePriceInCart(i) {    // decreases the price of item i in the shopping cart
    let dishId = getJSONIndexValue(shoppingCart, i, 'dish-id');    // contains the index of the related dish
    let original = getJSONIndexValue(dishes, dishId, 'original');    // contains true or false
    (original) ? decreasePriceOfOriginal(i, dishId) : decreasePriceOfUpgraded(i, dishId);
}


function decreasePriceOfOriginal(i, dishId) {    // decreases the price of original item in the shopping cart
    let price = getJSONIndexValue(dishes, dishId, 'price');
    increaseJSONIndexValue(shoppingCart, i, 'price', price);
}


function decreasePriceOfUpgraded(i, dishId) {    // decreases the price of upgraded item in the shopping cart
    originalDishId = downgradeIndex(dishId);    // reduces the index of upgraded dish to get the original dish
    let priceOfItem = getJSONIndexValue(dishes, originalDishId, 'price');
    let upcharge = getJSONIndexValue(dishes, originalDishId, 'upcharge');
    let totalPrice = priceOfItem + upcharge;    // contains the adding total price of item i
    shoppingCart[i]['price'] -= totalPrice;    // decreases the total price of item i
}


function deleteItem(i) {    // removes item i from the shopping cart
    let dishId = getJSONIndexValue(shoppingCart, i, 'dish-id');    // contains the index of related dish
    setJSONIndexValue(dishes, dishId, 'in-cart', false);
    delete dishes[dishId]['item-id'];    // deletes 'item-id' of related dish
    shoppingCart.splice(i, 1);    // removes the item i from the shopping cart
}


function outputSubtotal() {    // outputs the subtotal in the shopping cart
    let subtotalUnformatted = calculateSubtotal();    // contains the subtotal as number
    let subtotal = subtotalUnformatted.toFixed(2);    // contains the subtotal as String number with 2 decimals
    let output = getElement('subtotal');    // contains the output element 'subtotal'
    output.innerHTML = subtotal.replace('.', ',');    // outputs the subtotal with comma
}


function calculateSubtotal() {    // calculates the subtotal of all items in the shopping cart
    let subtotal = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
        subtotal += getPriceInCart(i);
    }
    return subtotal;
}


function outputDeliveryCosts() {    // outputs the delivery costs in the shopping cart
    let deliveryCostsUnformatted = calculateDeliveryCosts();    // contains the delivery costs as number
    let deliveryCosts = deliveryCostsUnformatted.toFixed(2);    // contains the delivery costs as String number with 2 decimals
    let output = getElement('delivery-costs');    // contains the output element 'delivery-costs'
    output.innerHTML = deliveryCosts.replace('.', ',');    // outputs the delivery costs with comma
}


function calculateDeliveryCosts() {    // calculates the delivery costs of the shopping cart
    let subtotal = getSubtotal();    // contains the subtotal
    return (subtotal < 20) ? 3.90 : 0;    // true: 3.90 | false: 0
}


function getSubtotal() {    // provides the subtotal from the output element 'subtotal'
    let subtotalFormatted = selectOutput('subtotal');    // contains the subtotal as String number
    return Number(subtotalFormatted.replace(',', '.'));    // returns the subtotal as number
}


function outputTotal() {    // outputs the total in the shopping cart
    let totalUnformatted = calculateTotal();    // contains the total as number
    let total = totalUnformatted.toFixed(2);    // contains the total as String number with 2 decimals
    let outputs = ['total', 'order-button-total', 'mobile-button-total'];    // contains the ids of output elements
    for (let i = 0; i < outputs.length; i++) {
        let output = getElement(outputs[i]);    // contains the output element i
        output.innerHTML = total.replace('.', ',');    // outputs the total with comma
    }
}


function calculateTotal() {    // calculates the total of the shopping cart
    let subtotal = getSubtotal();    // contains the subtotal
    let deliveryCosts = getDeliveryCosts();    // contains the delivery costs
    return subtotal + deliveryCosts;    // returns the total
}


function getDeliveryCosts() {    // provides the delivery costs
    let deliveryCostsFormatted = selectOutput('delivery-costs');    // contains the delivery costs as String number
    return Number(deliveryCostsFormatted.replace(',', '.'));    // returns the delivery costs as number
}


function sortItems() {    // sorts items in the order of dishes
    let copy = copyOfShoppingCart();    // contains a copy of shoppingCart
    emptyShoppingCart();
    refillShoppingCart(copy);
}


function copyOfShoppingCart() {    // creates a copy of shoppingCart
    let copy = [];    // defines the empty JSON array copy
    for (let i = 0; i < shoppingCart.length; i++) {
        copy[i] = {
            'dish-id': shoppingCart[i]['dish-id'],
            'amount': shoppingCart[i]['amount'],
            'title': shoppingCart[i]['title'],
            'price': shoppingCart[i]['price']
        };
    }
    return copy;    // returns the whole copy
}


function refillShoppingCart(copy) {    // refills the variable shoppingCart
    for (let i = 0; i < copy.length; i++) {
        let min = dishes.length;    // defines the current minimum index
        let itemId = getLowestItemId(copy, min);    // contains the lowest itemID
        shoppingCart[i] = {
            'dish-id': copy[itemId]['dish-id'],
            'amount': copy[itemId]['amount'],
            'title': copy[itemId]['title'],
            'price': copy[itemId]['price']
        };    // adds the item i to the shopping cart
        copy[itemId]['dish-id'] = dishes.length;    // sets the index of copied item i out of range
    }
}


function getLowestItemId(copy, min) {    // provides the lowest itemId
    let itemId = 0;
    for (let j = 0; j < copy.length; j++) {
        let dishId = copy[j]['dish-id'];    // contains the dishId of copied item j
        if (dishId < min) {    // if dishId less than minimum index ...
            min = dishId;    // set minimum index = dishID
            itemId = j;    // set current lowest itemId
        }
    }
    return itemId;    // returns final lowest index
}


function updateItemId() {    // updates the itemId of dishes
    for (let i = 0; i < shoppingCart.length; i++) {
        let dishId = getDishId(i);    // contains the dishId of item i
        dishes[dishId]['item-id'] = i;    // sets itemId to related dish
    }
}


function showShoppingCart() {
    addOverflowYResponsive('body');    // stops scrolling in y direction
    removeDisplayUnset('shopping-cart-window');    // shows the element 'shopping-cart-window'
    addDisplayNone('shopping-cart-mobile');    // hides the element 'shopping-cart-mobile'
}


function removeDisplayUnset(id) {    // removes display:unset to the element 'id'
    document.getElementById(id).classList.remove('display-unset');
}


function addOverflowYResponsive(id) {    // adds overflow-y:hidden to the element 'id'
    document.getElementById(id).classList.add('overflowY-responsive');
}


function hideShoppingCart() {
    removeOverflowYResponsive('body');    // releases body for scrolling in y direction
    addDisplayUnset('shopping-cart-window');    // hides the element 'shopping-cart-window'
    removeDisplayNone('shopping-cart-mobile');    // shows the element 'shopping-cart-mobile'
}


function addDisplayUnset(id) {    // adds display:unset to the element 'id'
    document.getElementById(id).classList.add('display-unset');
}


function removeOverflowYResponsive(id) {    // removes overflow-y:hidden from the element 'id'
    document.getElementById(id).classList.remove('overflowY-responsive');
}





function getJSONIndexValueByMaster(variable, index, key, master, primary) {
    let dishId = getJSONIndexValue(variable, index, key);
    return getJSONIndexValue(master, dishId, primary);
}