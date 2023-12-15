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
            <td id="item-index-${i}" class="item-index fw-700">${i}</td>
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
            <div id="item-price-${i}" class="item-price fw-700">${getDecimalPriceInCart(i)} €</div>
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
    let roundedPrice = Math.round(price * 100) / 100;
    return roundedPrice.toFixed(2);
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
    saveAndShowItems();
}


function saveAndShowItems() {
    save();
    showItems();
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
    shoppingCart[itemId]['price'] += price;
}


function addToShoppingCart(i) {    // adds the dish i to shopping cart
    let currentIndex = getCurrentIndex();    // contains the index of the current item
    shoppingCart[currentIndex] = {
        'dish-id': i,    // contains the id of dish i
        'item-id': currentIndex,    // contains the id of the new item
        'price': getPrice(i),    // takes the price of dish i
        'option': 'keine / nicht ausgewählt',    // takes the option of dish i
        'amount': 1,    // sets amount = 1
    };    // adds the dish i to shopping cart

    dishes[i]['in-cart'] = true,
    dishes[i]['item-id'] = currentIndex;
}


function getCurrentIndex() {    // provides the current index for the new item
    return shoppingCart.length;
}


function increaseItems(i) {
    increaseAmount(i);
    increasePrice(i);
    saveAndShowItems();
}


function increaseAmount(i) {
    shoppingCart[i]['amount']++;
}


function increasePrice(i) {
    let priceInCart = getPriceInCart(i);
    let dishId = getDishId(i);
    let price = getPrice(dishId);
    let currentPrice = priceInCart + price;
    shoppingCart[i]['price'] = currentPrice;
}


function decreaseItems(i) {
    decreaseAmount(i);
    saveAndShowItems();
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
        shoppingCart.splice(i, 1);
    }
}


function decreasePrice(i) {
    let priceInCart = getPriceInCart(i);
    let dishId = getDishId(i);
    let price = getPrice(dishId);
    let currentPrice = priceInCart - price;
    shoppingCart[i]['price'] = currentPrice;
}