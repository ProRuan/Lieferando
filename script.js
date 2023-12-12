// Variablen
let dishes = [
    {
        'title': 'dish1',
        'ingredients': 'Rindsuppe',
        'options': 'Fritatten, Backerbsen',
        'price': 3.50,
        'in-cart': false
    },
    {
        'title': 'Risipisi',
        'ingredients': 'Reis, Erbsen und Huhn',
        'options': 'Mais, Speckwürfel',
        'price': 6.00,
        'in-cart': false
    },
    {
        'title': 'dish3',
        'ingredients': 'Lasagne',
        'options': '',
        'price': 8.00,
        'in-cart': false
    },
    {
        'title': 'dish4',
        'ingredients': 'Gebackene Calamaris',
        'options': '1,00 € pro zusätzlichem Stück',
        'price': 12.00,
        'in-cart': false
    },
    {
        'title': 'dish5',
        'ingredients': 'Apfelkuchen',
        'options': 'Zimt',
        'price': 5.50,
        'in-cart': false
    }
];

let shoppingCart = [];


// Functions
load();


function showDishes() {    // Bitte bearbeiten!!!
    let restaurantDishes = document.getElementById('restaurant-dishes');
    restaurantDishes.innerHTML = '';
    for (let i = 0; i < dishes.length; i++) {
        restaurantDishes.innerHTML += `
        <div id="dish-card-${i}" class="dish-card">
            <div class="dish-card-top">
                <h4 class="dish-card-title">${getTitle(i)}</h4>
                <button id="menu-button" class="button" onclick="addDish(${i})">+</button>
            </div>
            <div class="dish-card-description">
                <p class="dish-card-ingredients">
                    Reis, Erbsen und Huhn
                </p>
                <p class="dish-card-option">
                    Auch mit Mais und Speckwürfeln.
                </p>
                <div class="dish-card-price">${getPrice(i)}</div>
            </div>
        </div>
    `;
    }

    showShoppingCartItems();
}


function addDish(i) {
    addOrIncreaseIf(i);
    saveAndShowDishes();
}
// if shopppingCart == false, add dish, else increase amount


function addOrIncreaseIf(i) {
    if (alreadyInCart(i)) {
        increaseAmount(i);
    } else {
        addToShoppingCart(i);
        setInCart(i);
    }
}


function alreadyInCart(i) {
    return dishes[i]['in-cart'];
}


function increaseAmount(i) {
    let requestedIndex = 0;
    getRequestedIndex(requestedIndex, i);
    setAmount(requestedIndex);
}


function getRequestedIndex(requestedIndex, i) {
    while (shoppingCart[requestedIndex]['title'] != getTitle(i)) {
        requestedIndex++;
    }
}


function setAmount(i) {
    shoppingCart[i]['amount']++;
}


function increaseAmount(i) {
    shoppingCart[i]['amount']++;
}


function addToShoppingCart(i) {
    let nextIndex = getNextIndex();
    shoppingCart[nextIndex] = {
        'title': getTitle(i),
        'price': getPrice(i),
        'options': getOptions(i),
        'amount': 1
    }
}


function getNextIndex() {
    return shoppingCart.length;
}


function getTitle(i) {
    return dishes[i]['title'];
}


function getPrice(i) {
    return dishes[i]['price'];
}


function getOptions(i) {
    return dishes[i]['options'];
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


function getItemAndParse(keys) {
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let variableAsText = localStorage.getItem(key);
        if (i == 0 && variableAsText) {
            dishes = JSON.parse(variableAsText);
        } else if(variableAsText) {
            shoppingCart = JSON.parse(variableAsText);
        }
    }
}


// Functions - Shopping Cart
function showShoppingCartItems() {
    let shoppingCartItems = document.getElementById('shopping-cart-items');
    shoppingCartItems.innerHTML = '';
    for (let i = 0; i < shoppingCart.length; i++) {
        shoppingCartItems.innerHTML += `
        <div id="shopping-cart-item-${i}" class="shopping-cart-item">
            <table>
                <tr>
                    <td id="item-index-${i}" class="item-index">${i}</td>
                    <td class="fd-column item-details">
                        <div id="item-title-and-price-${i}" class="jc-space-between item-title-and-price">
                            <div class="added-item-title">${getTitleInCart(i)}</div>
                            <div>${getPriceInCart(i)}</div>
                        </div>
                        <div class="added-options">${getOptionsInCart(i)}</div>
                        <div class="mt-8 jc-space-between">
                            <div class="width-50 item-notes">Anmerkungen hinzufügen</div>
                            <div class="width-50 jc-space-between">
                                <button id="menu-plus-button-${i}" class="button">+</button>
                                <div class="item-amount">${getAmountInCart(i)}</div>
                                <button id="menu-minus-button-${i}" class="button">-</button>
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


function getPriceInCart(i) {
    return shoppingCart[i]['price'];
}


function getOptionsInCart(i) {
    return shoppingCart[i]['options'];
}


function getAmountInCart(i) {
    return shoppingCart[i]['amount'];
}


function getProductOfItem(i) {
    let amount = getAmountInCart(i);
    let price = getPriceInCart(i);
    return amount * price;
}


function getSubTotalInCart() {
    let subTotal = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
        subTotal = subTotal + getProductOfItem(i);
    }
    return setDeliveryCosts(subTotal);
}


function setDeliveryCosts(subTotal) {
    if (subTotal < 30) {
        return getTotalInCart(subTotal, 30);
    } else {
        return getTotalInCart(subTotal, 0);
    }
}