


function updateAmountAndPrice(i) {
    let requestedIndex = getRequestedIndex(i);
    setAmountInCart(requestedIndex);
    setPriceInCart(requestedIndex);
}


function getRequestedIndex(i) {
    let requestedIndex = shoppingCart[i]['id'];
    // let requestedIndex = 0;
    // while (shoppingCart[requestedIndex]['title'] != getTitle(i)) {
    //     requestedIndex++;
    // }
    return requestedIndex;
}


function setAmountInCart(i) {
    shoppingCart[i]['amount']++;
}


function setPriceInCart(requestedIndex) {
    let currentPrice = recalculatePrice(requestedIndex);
    shoppingCart[requestedIndex]['total-price'] = currentPrice;
}


function recalculatePrice(requestedIndex) {
    let totalPrice = getTotalPriceInCart(requestedIndex);
    let price = getPriceInCart(requestedIndex);
    return totalPrice + price;
}


function getTotalPriceInCart(i) {
    return shoppingCart[i]['total-price'];
}


function getPriceInCart(i) {
    return shoppingCart[i]['price'];
}


function addToShoppingCart(i) {
    let nextIndex = getNextIndex();
    shoppingCart[nextIndex] = {
        'id': i,
        'title': getTitle(i),
        'price': getPrice(i),
        'options': getOptions(i),
        'amount': 1,
        'total-price': getPrice(i)
    }
}


function getNextIndex() {
    return shoppingCart.length;
}



function setInCart(i) {
    dishes[i]['in-cart'] = true;
}


function save() {
    let keys = ['dishes', 'shoppingCart'];
    let variables = [dishes, shoppingCart];
    stringifyAndSetItem(keys, variables);
}


function stringifyAndSetItem(keys, variables) {
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let variable = variables[i];
        let variableAsText = JSON.stringify(variable);
        localStorage.setItem(key, variableAsText);
    }
}


function saveAndShowDishes() {
    save();
    showDishes();
}


function load() {
    let keys = ['dishes', 'shoppingCart'];
    getItemAndParse(keys);
}


function getItemAndParse(keys) {    // Bitte ueberdenken!!!
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let variableAsText = localStorage.getItem(key);
        if (i == 0 && variableAsText) {
            dishes = JSON.parse(variableAsText);
        } else if (variableAsText) {
            shoppingCart = JSON.parse(variableAsText);
        }
    }
}


// Functions - Shopping Cart
function showShoppingCartItems() {
    let shoppingCartItems = document.getElementById('shopping-cart-item-collector');
    shoppingCartItems.innerHTML = '';
    for (let i = 0; i < shoppingCart.length; i++) {
        shoppingCartItems.innerHTML += `
        <div id="shopping-cart-item-${i}" class="shopping-cart-item">
            <table>
                <tr>
                    <td id="item-index-${i}" class="item-index fw-700">${i}</td>
                    <td class="column-start-start item-details">
                        <div id="item-title-and-price-${i}" class="width-100 display-between-center gap-20">
                            <div class="added-item-title fw-700">${getTitleInCart(i)}</div>
                            <div id="item-price-${i}" class="item-price fw-700">${getTotalPriceInCart(i)}</div>
                        </div>
                        <div class="added-options">${getOptionsInCart(i)}</div>
                        <div class="mt-8 display-between-center gap-20">
                            <div class="width-50 item-notes">Anmerkungen hinzufügen</div>
                            <div class="width-50 display-between-center">
                                <button id="menu-plus-button-${i}" class="button" onclick="increaseItems(${i})">+</button>
                                <div class="item-amount">${getAmountInCart(i)}</div>
                                <button id="menu-minus-button-${i}" class="button" onclick="decreaseItems(${i})">-</button>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    `;
    }
}


function getTitleInCart(i) {
    return shoppingCart[i]['title'];
}


function getOptionsInCart(i) {
    return shoppingCart[i]['options'];
}


function getAmountInCart(i) {
    return shoppingCart[i]['amount'];
}


function increaseItems(i) {
    increaseAmount(i);
    increaseTotalPrice(i);
    saveAndShowDishes();
}


function increaseAmount(i) {
    shoppingCart[i]['amount']++;
}


function increaseTotalPrice(i) {
    let totalPrice = getTotalPriceInCart(i);
    let price = getPriceInCart(i);
    let currentPrice = totalPrice + price;
    shoppingCart[i]['total-price'] = currentPrice;
}


function decreaseItems(i) {
    decreaseAmount(i);
    // decreaseTotalPrice(i);
    saveAndShowDishes();
}


function decreaseAmount(i) {
    let amount = shoppingCart[i]['amount'];
    decreaseOrDeleteItem(amount, i);
}


function decreaseOrDeleteItem(amount, i) {
    if (amount > 1) {
        shoppingCart[i]['amount']--;
        decreaseTotalPrice(i);
    } else {
        let native = shoppingCart[i]['id'];
        dishes[native]['in-cart'] = false;
        shoppingCart.splice(i, 1);
    }
}


function decreaseTotalPrice(i) {
    let totalPrice = getTotalPriceInCart(i);
    let price = getPriceInCart(i);
    let currentPrice = totalPrice - price;
    shoppingCart[i]['total-price'] = currentPrice;
}


function setValuesInCart() {
    setTotal();
    setSubtotalAndDeliveryCosts();
}


function setTotal() {
    let total = calculateTotal();
    writeTotal(total);
}


function calculateTotal() {
    let subtotal  = calculateSubtotal();
    let deliveryCosts = calculateDeliveryCosts(subtotal);
    return subtotal + deliveryCosts;
}


function calculateSubtotal() {
    let subtotal = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
        subtotal = subtotal + getTotalPriceInCart(i);
    }
    return subtotal;
}


function calculateDeliveryCosts(subtotal) {
    return (subtotal < 30) ? 30 : 0;
}


function writeTotal(total) {
    let valueOfTotal = document.getElementById('value-of-total');
    valueOfTotal.innerHTML = total;
}


function setSubtotalAndDeliveryCosts() {
    let subtotal = calculateSubtotal();
    let deliveryCosts = calculateDeliveryCosts(subtotal);
    writeSubtotal(subtotal);
    writeDeliveryCosts(deliveryCosts);
}


function writeSubtotal(subtotal) {
    let valueOfSubtotal = document.getElementById('value-of-subtotal');
    valueOfSubtotal.innerHTML = subtotal;
}


function writeDeliveryCosts(deliveryCosts) {
    let valueOfDeliveryCosts = document.getElementById('value-of-delivery-costs');
    valueOfDeliveryCosts.innerHTML = deliveryCosts;
}