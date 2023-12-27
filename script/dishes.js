// Variables
let dishes = [
    {    // dish 0
        'original': true,    // original dish (without upgrade)
        'title': 'Pizza Mexicana',    // title of dish
        'description': 'Paradeiser, Käse, Hühnerfleisch, Paprika, Mais, Chilli',    // description of dish
        'price': 9.50,    // price of dish
        'option': 'große Pizza',    // optional upgrade of dish
        'upcharge': 2.40,    // upcharge (if option selected)
        'option-selected': false,    // true (if option selected)
        'in-cart': false    // true (if dish is already in shopping cart)
    },
    {   // dish 1
        'original': false,    // upgrade of dish 0
        'title': 'Große Pizza Mexicana',    // title of upgraded dish
        'in-cart': false
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
    showDishes();    // the available dishes
    showItems();    // the items in the shopping cart
    outputSubtotal();    // the subtotal
    outputDeliveryCosts();    // the delivery costs
    outputTotal();    // the total
    showShoppingCartMobileIf();    // shows the element 'shopping-cart-mobile' on one condition
}


function showDishes() {    // shows all available dishes of restaurant
    let dishCardCollector = getElement('dish-card-collector');    // contains the element 'dish-card-collector'
    dishCardCollector.innerHTML = '';    // empties dishCardCollector
    fillDishCardCollector(dishCardCollector);
    save(dishes, 'dishes');
}


function getElement(id) {    // provides an element by the parameter id
    return document.getElementById(id);
}


function fillDishCardCollector(dishCardCollector) {    // fills dishCardCollector with i dish cards
    for (let i = 0; i < dishes.length; i++) {
        let original = getDishesObjectValue(i, 'original');    // contains true or false
        if (original) {    // if this is an orignal dish ...
            dishCardCollector.innerHTML += writeDishCard(i);    // writes the dish card i
        } else {    // else ...
            calculatePriceOfUpgraded(i);    // calculate the price of upgraded dish i
        }
    }
}


function getDishesObjectValue(index, key) {    // provides an object value of dishes by index and key
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
    let title = getDishesObjectValue(i, 'title');    // contains the title of dish i
    return `
        <div id="dish-card-header-${i}" class="display-between-center">
            <h3 id="dish-card-title-${i}" class="dish-card-title">${title}</h3>
            <button id="add-dish-button-${i}" class="button dish-card-button" onclick="showDialogOrUpdateItem(${i})">+</button>
        </div>
    `;
}


function writeDescription(i) {    // writes the description of dish card i
    let description = getDishesObjectValue(i, 'description');    // contains the description of dish i
    let price = getDecimal(dishes, i, 'price');    // contains the price of dish i formatted as a decimal
    return `
        <div id="dish-card-description-${i}" class="column-start-start">
            <p id="dish-card-ingredients-${i}" class="dish-card-ingredients">${description}</p>
            ${writeOptionIf(i)}
            <output id="dish-card-price-${i}" class="dish-card-price">${price} €</output>
        </div>
    `;
}


function getDecimal(variable, index, key) {    // provides the formatted decimal of a number
    let number = getJSONObjectValue(variable, index, key);    // contains the value of any JSON
    return number.toFixed(2).replace('.', ',');    // outputs a number with 2 decimals and comma
}


function getJSONObjectValue(variable, index, key) {    // provides an object value of any JSON by variable, index and key
    return variable[index][key];
}


function writeOptionIf(i) {    // writes the option of dish card i on one condition
    let option = getDishesObjectValue(i, 'option');    // contains a String or false
    if (option) {    // if true ...
        return `<p id="dish-card-option-${i}" class="dish-card-option">Option: ${option}</p>`;    // write option of dish card i ...
    } else {    // else ...
        return '';    // empty
    }
}


function calculatePriceOfUpgraded(i) {    // calculates the price of upgraded dish i
    let previous = i - 1;    // contains the index of previous (original) dish
    let price = getDishesObjectValue(previous, 'price');    // contains the price of previous (original) dish
    let upcharge = getDishesObjectValue(previous, 'upcharge');    // provides the price of previous (original) dish
    price += upcharge;    // (total) price of dish i
    setDishesObjectValue(i, 'price', price);
}


function saveAll() {    // saves ...
    save(dishes, 'dishes');    // the variable dishes
    save(shoppingCart, 'shoppingCart');    // the variable shoppingCart
}


function save(variable, key) {    // saves a variable by variable and key
    let variableAsText = JSON.stringify(variable);
    localStorage.setItem(key, variableAsText);
}


function load(key) {    // loads a variable by key
    let variableAsText = localStorage.getItem(key);
    if (variableAsText && key == 'shoppingCart') {
        shoppingCart = JSON.parse(variableAsText);    // shoppingCart
    } else if (variableAsText && key == 'dishes') {
        dishes = JSON.parse(variableAsText);    // dishes
    }
}


function showDialogOrUpdateItem(i) {    // onclick function (of dish card i)
    let optionAvailable = getDishesObjectValue(i, 'option');    // contains the option of dish i
    (optionAvailable) ? showDialog(i) : updateItem(i);    // true: show dialog | false: update item
}


function updateItem(i) {
    let inCart = getDishesObjectValue(i, 'in-cart');    // contains true or false
    (inCart) ? increaseItem(i) : addItem(i);    // true: increase item | false: add item
    sortUpdateSaveRender();
}


function increaseItem(i) {    // increase the item i in the shopping cart
    let price = getDishesObjectValue(i, 'price');    // contains the price of dish i
    let itemId = getDishesObjectValue(i, 'item-id');    // contains the item id of dish i
    increaseCartObjectValue(itemId, 'amount', 1);
    increaseCartObjectValue(itemId, 'price', price);
}

function increaseCartObjectValue(index, key, increment) {    // increases an object value of dishes by an increment
    shoppingCart[index][key] += increment;
}


function addItem(i) {    // adds item i to the shopping cart
    let serial = getJSONLength(shoppingCart);    // contains the serial number of new item
    let title = getDishesObjectValue(i, 'title');    // contains the title of dish i
    let price = getDishesObjectValue(i, 'price');    // contains the price of dish i
    let values = [i, 1, title, price];    // contains the index, amount, title and price of new item
    addCartObject(serial, values);
    setDishesObjectValue(i, 'in-cart', true);
    setDishesObjectValue(i, 'item-id', serial);
}


function getJSONLength(variable) {    // provides the index of new item
    return variable.length;
}


function addCartObject(index, values) {    // adds a new item to the shopping cart
    shoppingCart[index] = {    // contains the serial number of new item
        'dish-id': values[0],    // contains the index of related dish
        'amount': values[1],    // contains the amount of item
        'title': values[2],    // contains the title of item
        'price': values[3]    // contains the price of item
    }
}


function setDishesObjectValue(index, key, value) {    // sets an object value of dishes by a value
    dishes[index][key] = value;
}


function sortUpdateSaveRender() {    // collector function
    sortItems();
    updateItemId();
    saveAll();
    render();
}


window.onscroll = function () {    // resizes the height of the 'shopping-cart-window' depending on the scrolling area
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


function calculateHTMLDeltaHeight() {    // calculates the difference of maxScrollHeight and footerHeight
    let hMaxScroll = calculateMaxScrollHeight();
    return hMaxScroll - footer.offsetHeight;
}


function calculateMaxScrollHeight() {    // calculates the difference of body's scrollHeight and the html's clientHeight
    return body.scrollHeight - html.clientHeight;
}


function updateShoppingCartHeightFooter(hWindow, hDeltaWindow) {    // rezising function of footer area
    let hDelta = scrollY - hDeltaWindow;
    let hNew = hWindow - hDelta;
    let hNewFormatted = getFormattedHeight(hNew);
    setNewHeight('shopping-cart-window', hNewFormatted);
    calculateItemCollectorHeight(hNew);
}


function getFormattedHeight(number) {    // formats the height for subsequent style settings
    return `height: ${number}px`;
}


function setNewHeight(id, hNew) {    // sets a new style (height) to an element
    document.getElementById(id).style = hNew;
}


function calculateItemCollectorHeight(number) {    // resizes the height of the element 'shopping-cart-item-collector'
    let hNew = number - 328;
    let hNewFormatted = getFormattedHeight(hNew);
    setNewHeight('shopping-cart-item-collector', hNewFormatted);
}


function updateShoppingCartHeightContent() {    // resizing function of content area
    setNewHeight('shopping-cart-window', 'height: 100vh');
    setNewHeight('shopping-cart-item-collector', 'height: calc(100vh - 328px)');
}


function updateShoppingCartHeightHeader(hWindow, hHeader) {    // resizing function of header area
    let hDelta = hHeader - scrollY;
    let hNew = hWindow - hDelta;
    let hNewFormatted = getFormattedHeight(hNew);
    setNewHeight('shopping-cart-window', hNewFormatted);
    calculateItemCollectorHeight(hNew);
}