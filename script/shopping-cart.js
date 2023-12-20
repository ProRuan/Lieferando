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
    setDisplayNone();
    save();
}


function setDisplayNone() {
    let cartEmpty = (shoppingCart.length < 1);
    if (cartEmpty) {
        addDisplayNone('shopping-cart-item-collector');
        addDisplayNone('sum-and-order');
        removeDisplayNone('shopping-cart-guide');
    } else {
        addDisplayNone('shopping-cart-guide');
        removeDisplayNone('shopping-cart-item-collector');
        removeDisplayNone('sum-and-order');
    }
}


function addDisplayNone(id) {
    let element = document.getElementById(id);
    element.classList.add('display-none');
}


function removeDisplayNone(id) {
    let element = document.getElementById(id);
    element.classList.remove('display-none');
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
    let priceUnformatted = getPriceInCart(i);
    let price = priceUnformatted.toFixed(2);
    return price.replace('.', ',');
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
        <div class="mt-8 width-100 display-between-center gap-20">
            <div class="item-notes">Anmerkungen hinzufügen</div>
            <div class="display-between-center">
                <button id="menu-plus-button-${i}" class="button" onclick="increaseItemInCart(${i})">+</button>
                <output id="item-amount-${i}" class="item-amount">${getAmountInCart(i)}</output>
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


function increaseAmountInCart(i) {
    shoppingCart[i]['amount']++;
}


function increasePriceInCart(i) {
    let dishId = getDishId(i);
    let original = getOriginal(dishId);
    if (original) {
        let price = getPrice(dishId);
        shoppingCart[i]['price'] += price;
    } else {
        originalDishId = downgradeIndex(dishId);
        let priceOfItem = getPrice(originalDishId);
        let upcharge = getUpcharge(originalDishId);
        let totalPrice = priceOfItem + upcharge;
        shoppingCart[i]['price'] += totalPrice;
    }
}


function downgradeIndex(dishId) {
    return --dishId;
}


function decreaseItemInCart(i) {
    decreaseOrDeleteItem(i);
    updateItemId();
    saveAndRender();
}


function decreaseOrDeleteItem(i) {
    let amount = getAmountInCart(i);
    if (amount > 1) {
        decreaseAmountInCart(i);
        decreasePriceInCart(i);
    } else {
        let dishId = getDishId(i);
        dishes[dishId]['in-cart'] = false;
        delete dishes[dishId]['item-id'];
        shoppingCart.splice(i, 1);
    }
}


function decreaseAmountInCart(i) {
    shoppingCart[i]['amount']--;
}


function decreasePriceInCart(i) {
    let dishId = getDishId(i);
    let original = getOriginal(dishId);
    if (original) {
        let price = getPrice(dishId);
        shoppingCart[i]['price'] -= price;
    } else {
        originalDishId = downgradeIndex(dishId);
        let priceOfItem = getPrice(originalDishId);
        let upcharge = getUpcharge(originalDishId);
        let totalPrice = priceOfItem + upcharge;
        shoppingCart[i]['price'] -= totalPrice;
    }
}


function outputSubtotal() {
    let subtotalUnformatted = calculateSubtotal();
    let subtotal = subtotalUnformatted.toFixed(2);
    let output = selectOutput('subtotal');
    output.innerHTML = subtotal.replace('.', ',');
}


function selectOutput(id) {
    return document.getElementById(id);
}


function calculateSubtotal() {
    let subtotal = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
        subtotal += getPriceInCart(i);
    }
    return subtotal;
}


function outputDeliveryCosts() {
    let deliveryCostsUnformatted = calculateDeliveryCosts();
    let deliveryCosts = deliveryCostsUnformatted.toFixed(2);
    let output = selectOutput('delivery-costs');
    output.innerHTML = deliveryCosts.replace('.', ',');
}


function calculateDeliveryCosts() {
    // let subtotal = calculateSubtotal();
    let subtotal = getSubtotal();
    return (subtotal < 20) ? 3.90 : 0;
    // if (subtotal < 30) {
    //     return 30;
    // } else {
    //     return 0;
    // }
}


function getSubtotal() {
    let subtotalFormatted = document.getElementById('subtotal').innerHTML;
    let subtotal = Number(subtotalFormatted.replace(',', '.'));
    return subtotal;
}


function outputTotal() {
    let totalUnformatted = calculateTotal();
    let total = totalUnformatted.toFixed(2);
    let output = selectOutput('total');
    let outputButton = selectOutput('order-button-total');
    let outputMobileButton = selectOutput('mobile-button-total');
    output.innerHTML = total.replace('.', ',');
    outputButton.innerHTML = total.replace('.', ',');
    outputMobileButton.innerHTML = total.replace('.', ',');
}


function calculateTotal() {
    // let subtotal = calculateSubtotal();
    // let deliveryCosts = calculateDeliveryCosts();
    let subtotal = getSubtotal();
    let deliveryCosts = getDeliveryCosts();
    return subtotal + deliveryCosts;
}


function getDeliveryCosts() {
    let deliveryCostsFormatted = document.getElementById('delivery-costs').innerHTML;
    let deliveryCosts = Number(deliveryCostsFormatted.replace(',', '.'));
    return deliveryCosts;
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


window.onscroll = function () {
    let maxWidth = body.scrollWidth;
    let shoppingCartWindow = document.getElementById('shopping-cart-window');
    if (maxWidth > 1024) {
        let heightWindow = window.innerHeight;
        let heightBody = body.scrollHeight;
        let heightHeader = 72;
        let heightFooter = 128;
        let maxScrollHeight = heightBody - heightWindow;
        if (scrollY > maxScrollHeight - heightFooter) {
            let delta = scrollY - (maxScrollHeight - heightFooter);
            let newHeight = heightWindow - delta;
            let output = newHeight.toString() + "px";
            shoppingCartWindow.style.height = output;
            calculateHeight(newHeight);
        } else if (scrollY > heightHeader) {
            shoppingCartWindow.style.height = "100vh";
            let element = document.getElementById('shopping-cart-item-collector');
            element.style.height = "calc(100vh - 328px)";
        } else {
            let delta = heightHeader - scrollY;
            let newHeight = heightWindow - delta;
            let output = newHeight.toString() + "px";
            shoppingCartWindow.style.height = output;
            calculateHeight(newHeight);
        }
    } else {
        shoppingCartWindow.style.height = "100vh";    // notwendig? - nein!
    }
}



function calculateHeight(newHeight) {
    let element = document.getElementById('shopping-cart-item-collector');
    let heightElement = newHeight - 328;
    let output = heightElement.toString() + "px";
    element.style.height = output;
}


function showShoppingCart() {
    let shoppingCartWindow = document.getElementById('shopping-cart-window');
    shoppingCartWindow.classList.remove('display-unset');
    let shoppingCartMobile = document.getElementById('shopping-cart-mobile');
    shoppingCartMobile.classList.add('display-none');
}


function hideShoppingCart() {
    let shoppingCartWindow = document.getElementById('shopping-cart-window');
    shoppingCartWindow.classList.add('display-unset');
    let shoppingCartMobile = document.getElementById('shopping-cart-mobile');
    shoppingCartMobile.classList.remove('display-none');
}