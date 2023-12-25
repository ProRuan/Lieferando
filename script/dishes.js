// Variables
let dishes = [
    {    // dish 0
        'original': true,    // original dish (without upgrade)
        'title': 'Pizza Mexicana',    // title of dish
        'description': 'Paradeiser, Käse, Hühnerfleisch, Paprika, Mais, Chilli',    // description of dish
        'price': 9.50,    // price of dish
        'option': 'große Pizza',    // optional upgrade of dish
        'upcharge': 2.40,    // upcharge (only if option selected)
        'option-selected': false,    // true, if option selected
        'in-cart': false    // true, if dish is already in shopping cart
    },
    {   // dish 1
        'original': false,    // upgrade of dish 0
        'title': 'Große Pizza Mexicana',    // title of upgraded dish
        'in-cart': false    // true, if dish is already in shopping cart
    },
    {
        'original': true,
        'title': 'Pizza Frutti di Mare',
        'description': 'Paradeiser, Käse, Meeresfrüchte, Knoblauch',
        'price': 9.90,
        'option': 'große Pizza',
        'upcharge': 2.60,
        'option-selected': false,
        'in-cart': false
    },
    {
        'original': false,
        'title': 'Große Pizza Frutti di Mare',
        'in-cart': false
    },
    {
        'original': true,
        'title': 'Pizzastangerl',
        'description': '2 Stück',
        'price': 1.50,
        'option': 'plus 3 Stück',
        'upcharge': 1.50,
        'option-selected': false,
        'in-cart': false
    },
    {
        'original': false,
        'title': 'Pizzastangerl Plus',
        'in-cart': false
    },
    {
        'original': true,
        'title': 'Spaghetti Bolognese',
        'description': 'Fleischsauce',
        'price': 9.90,
        'option': false,    // no upgrade available
        'in-cart': false
    },
    {
        'original': true,
        'title': 'Lasagne',
        'description': 'Fleisch- und Béchamelsause',
        'price': 9.90,
        'option': false,
        'in-cart': false
    },
    {
        'original': true,
        'title': 'Frühlingsrollen',
        'description': 'mit süß-saurer Sauce, 5 Stück',
        'price': 5.90,
        'option': 'plus 3 Stück',
        'upcharge': 2.40,
        'option-selected': false,
        'in-cart': false
    },
    {
        'original': false,
        'title': 'Frühlingsrollen Plus',
        'in-cart': false
    },
    {
        'original': true,
        'title': 'Paella Reis',
        'description': 'Curry Reis, Shrimps, Frutti di Mare, Hühnerfleisch und Salat',
        'price': 10.50,
        'option': false,
        'in-cart': false
    },
    {
        'original': true,
        'title': 'Nusspalatschinken',
        'description': '2 Stück',
        'price': 6.00,
        'option': 'plus 1 Stück',
        'upcharge': 2.00,
        'option-selected': false,
        'in-cart': false
    },
    {
        'original': false,
        'title': 'Nusspalatschinken Plus',
        'in-cart': false
    }
];    // contains all available dishes


// Functions
load('dishes');


function render() {    // renders ...
    showDishes();    // dishes of restaurant
    showItems();    // items of shopping cart
    outputSubtotal();    // value of subtotal
    outputDeliveryCosts();    // value of delivery costs
    outputTotal();    // value of total
    showShoppingCartMobileIf();    // shows the element 'shopping-cart-mobile' on one condition
}


function showDishes() {    // shows all available dishes of restaurant
    let dishCardCollector = getElement('dish-card-collector');    // contains the element 'dish-card-collector'
    dishCardCollector.innerHTML = '';
    fillDishCardCollector(dishCardCollector);
    save(dishes, 'dishes');
}


function getElement(id) {    // provides an element by the parameter 'id'
    return document.getElementById(id);
}


function fillDishCardCollector(dishCardCollector) {    // fills dishCardCollector with i dish cards
    for (let i = 0; i < dishes.length; i++) {
        let original = getDishesObjectValue(i, 'original');    // contains true or false
        if (original) {    // if this is an orignal dish (without upgrade) ...
            dishCardCollector.innerHTML += writeDishCard(i);    // writes the dish card i
        } else {
            calculatePriceOfUpgraded(i);
        }
    }
}


function getDishesObjectValue(index, key) {
    return dishes[index][key];
}


function writeDishCard(i) {    // writes the HTML code of dish card i
    return `
        <article id="dish-card-${i}" class="dish-card">
            ${writeHeader(i)}
            ${writeDescription(i)}
        </article>
    `;
}


function writeHeader(i) {    // writes the header of dish card i
    let title = getDishesObjectValue(i, 'title');
    return `
        <div id="dish-card-header-${i}" class="display-between-center">
            <h3 id="dish-card-title-${i}" class="dish-card-title">${title}</h3>
            <button id="add-dish-button-${i}" class="button dish-card-button" onclick="showDialogOrUpdateItem(${i})">+</button>
        </div>
    `;
}


function writeDescription(i) {    // writes the description of dish card i
    let description = getDishesObjectValue(i, 'description');
    let price = getDecimal(dishes, i, 'price');
    return `
        <div id="dish-card-description-${i}" class="column-start-start">
            <p id="dish-card-ingredients-${i}" class="dish-card-ingredients">${description}</p>
            ${writeOptionIf(i)}
            <output id="dish-card-price-${i}" class="dish-card-price">${price} €</output>
        </div>
    `;
}


function getDecimal(variable, index, key) {
    let number = getJSONObjectValue(variable, index, key);
    return number.toFixed(2).replace('.', ',');
}


function getJSONObjectValue(variable, index, key) {
    return variable[index][key];
}


function writeOptionIf(i) {    // writes the option of dish card i on one condition
    let option = getDishesObjectValue(i, 'option');    // contains 'text' or false
    if (option) {    // if true ...
        return `<p id="dish-card-option-${i}" class="dish-card-option">Option: ${option}</p>`;    // write option of dish card i ...
    } else {
        return '';    // no content
    }
}


function calculatePriceOfUpgraded(i) {
    let previous = i - 1;
    let price = getDishesObjectValue(previous, 'price');
    let upcharge = getDishesObjectValue(previous, 'upcharge');
    price += upcharge;
    setDishesObjectValue(i, 'price', price);
}


function saveAll() {
    save(dishes, 'dishes');
    save(shoppingCart, 'shoppingCart');
}


function save(variable, key) {
    let variableAsText = JSON.stringify(variable);
    localStorage.setItem(key, variableAsText);
}


function load(key) {
    let variableAsText = localStorage.getItem(key);
    if (variableAsText && key == 'shoppingCart') {
        shoppingCart = JSON.parse(variableAsText);
    } else if (variableAsText && key == 'dishes') {
        dishes = JSON.parse(variableAsText);
    }
}


function showDialogOrUpdateItem(i) {
    let optionAvailable = getDishesObjectValue(i, 'option');
    (optionAvailable) ? showDialog(i) : updateItem(i);
}


function updateItem(i) {    // adds one item of dish i to the shopping cart
    let inCart = getDishesObjectValue(i, 'in-cart');
    (inCart) ? increaseItem(i) : addItem(i);
    sortUpdateSaveRender();
}


function increaseItem(i) {
    let price = getDishesObjectValue(i, 'price');
    let itemId = getDishesObjectValue(i, 'item-id');
    increaseCartObjectValue(itemId, 'amount', 1);
    increaseCartObjectValue(itemId, 'price', price);
}

function increaseCartObjectValue(index, key, increment) {
    shoppingCart[index][key] += increment;
}


function addItem(i) {
    let serial = getJSONLength(shoppingCart);
    let title = getDishesObjectValue(i, 'title');
    let price = getDishesObjectValue(i, 'price');
    let values = [i, 1, title, price];
    addCartObject(serial, values);
    setDishesObjectValue(i, 'in-cart', true);
    setDishesObjectValue(i, 'item-id', serial);
}


function getJSONLength(variable) {    // provides the index of new item
    return variable.length;
}


function addCartObject(index, values) {
    shoppingCart[index] = {
        'dish-id': values[0],
        'amount': values[1],
        'title': values[2],
        'price': values[3]
    }
}


function setDishesObjectValue(index, key, value) {
    dishes[index][key] = value;
}


function sortUpdateSaveRender() {
    sortItems();
    updateItemId();
    saveAll();
    render();
}


window.onscroll = function() {
    let hHTML = html.clientHeight;
    let hDeltaHTML = calculateHTMLDeltaHeight();
    let hHeader = header.offsetHeight;
    if (scrollY > hDeltaHTML) {
        updateShoppingCartHeightFooter(hHTML, hDeltaHTML);
    } else if (scrollY > hHeader) {
        updateShoppingCartHeightContent();
    } else {
        updateShoppingCartHeightHeader(hHTML, hHeader);
    }
}


function calculateHTMLDeltaHeight() {
    let hMaxScroll = calculateMaxScrollHeight();
    return hMaxScroll - footer.offsetHeight;
}


function calculateMaxScrollHeight() {
    return body.scrollHeight - html.clientHeight;
}


function updateShoppingCartHeightFooter(hWindow, hDeltaWindow) {
    let hDelta = scrollY - hDeltaWindow;
    let hNew = getFormattedHeight(hWindow, hDelta);
    setNewHeight('shopping-cart-window', hNew);
    calculateItemCollectorHeight(hNew);
}


function getFormattedHeight(minuend, subtrahend) {
    heightUnformatted = minuend - subtrahend;
    return 'height: ' + heightUnformatted.toString() + 'px';
}


function setNewHeight(id, hNew) {
    document.getElementById(id).style = hNew;
}


function calculateItemCollectorHeight(newHeight) {
    let hNew = getFormattedHeight(newHeight, 328);
    setNewHeight('shopping-cart-item-collector', hNew);
}


function updateShoppingCartHeightContent() {
    setNewHeight('shopping-cart-window', 'height: 100vh');
    setNewHeight('shopping-cart-item-collector', 'height: calc(100vh- 328px)')
}


function updateShoppingCartHeightHeader(hWindow, hHeader) {
    let hDelta = hHeader - scrollY;
    let hNew = getFormattedHeight(hWindow, hDelta);
    setNewHeight('shopping-cart-window', hNew);
    calculateItemCollectorHeight(hNew);
}


function showShoppingCartMobileIf() {    // shows the element 'shopping-cart-mobile' on one condition
    let itemAmount = getJSONLength(shoppingCart);    // contains the number of items in the shopping cart
    if (itemAmount > 0) {    // if itemAmount is greater than 0 ...
        setClassOnCommand('shopping-cart-mobile', 'add', 'display-flex');
    } else {    // else ...
        setClassOnCommand('shopping-cart-mobile', 'remove', 'display-flex');
    }
}


function setClassOnCommand(id, command, className) {
    (command == 'add') ? addClass(id, className) : removeClass(id, className);
}


function addClass(id, className) {
    document.getElementById(id).classList.add(className);
}


function removeClass(id, className) {
    document.getElementById(id).classList.remove(className);
}