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
    dishCardCollector.innerHTML = '';    // empties dishCardCollector
    fillDishCardCollector(dishCardCollector);
    save(dishes, 'dishes');
}


function getElement(id) {    // provides an element by the parameter 'id'
    return document.getElementById(id);
}


function fillDishCardCollector(dishCardCollector) {    // fills dishCardCollector with i dish cards
    for (let i = 0; i < dishes.length; i++) {
        let original = getJSONIndexValue(dishes, i, 'original');    // contains true or false
        if (original) {    // if this is an orignal dish (without upgrade) ...
            dishCardCollector.innerHTML += writeDishCard(i);    // writes the dish card i
        }
    }
}


function getJSONIndexValue(variable, index, key) {
    return variable[index][key];
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
    let title = getJSONIndexValue(dishes, i, 'title');
    return `
        <div id="dish-card-header-${i}" class="display-between-center">
            <h3 id="dish-card-title-${i}" class="dish-card-title">${title}</h3>
            <button id="add-dish-button-${i}" class="button dish-card-button" onclick="showDialogOrUpdateItem(${i})">+</button>
        </div>
    `;
}


function showDialogOrUpdateItem(i) {
    let optionAvailable = getJSONIndexValue(dishes, i, 'option');    // contains 'text' or false
    (optionAvailable) ? showDialog(i) : updateItem(i);
}


function updateItem(i) {    // adds one item of dish i to the shopping cart
    let inCart = getJSONIndexValue(dishes, i, 'in-cart');    // contains true or false
    (inCart) ? increaseItem(i) : addItem(i);
    sortUpdateSaveRender();
}


function increaseItem(i) {
    let original = getJSONIndexValue(dishes, i, 'original');
    (original) ? increaseOriginal(i) : increaseUpgraded(i);
}


function increaseOriginal(i) {
    let price = getJSONIndexValue(dishes, i, 'price');
    let itemId = getJSONIndexValue(dishes, i, 'item-id');
    increaseJSONIndexValue(shoppingCart, itemId, 'amount', 1);
    increaseJSONIndexValue(shoppingCart, itemId, 'price', price);
}


function increaseUpgraded(i) {
    let priceOriginal = getJSONIndexValue(dishes, i, 'price');
    let upcharge = getJSONIndexValue(dishes, i, 'upcharge');
    let price = priceOriginal + upcharge;
    let dishId = i + 1;
    let itemId = getJSONIndexValue(dishes, dishId, 'item-id');
    increaseJSONIndexValue(shoppingCart, itemId, 'amount', 1);
    increaseJSONIndexValue(shoppingCart, itemId, 'price', price);
}


function increaseJSONIndexValue(variable, index, key, input) {
    variable[index][key] += input;
}


function addItem(i) {
    let serial = getJSONLength(shoppingCart);
    let original = getJSONIndexValue(dishes, i, 'original');
    (original) ? addOriginal(i, serial) : addUpgraded(i, serial);
}


function getJSONLength(variable) {    // provides the index of new item
    return variable.length;
}


function addOriginal(i, serial) {
    let title = getJSONIndexValue(dishes, i, 'title');
    let price = getJSONIndexValue(dishes, i, 'price');
    addJSONObject(shoppingCart, serial, i);
    setJSONIndexValue(shoppingCart, serial, 'amount', 1);
    setJSONIndexValue(shoppingCart, serial, 'title', title);
    setJSONIndexValue(shoppingCart, serial, 'price', price);
    setJSONIndexValue(dishes, i, 'in-cart', true);
    setJSONIndexValue(dishes, i, 'item-id', serial);
}


function addJSONObject(variable, serial, primary) {
    variable[serial] = {
        'dish-id': primary,
        'amount': 0,
        'title': 'title',
        'price': 0
    }
}


function setJSONIndexValue(variable, index, key, input) {
    variable[index][key] = input;
}


function addUpgraded(i, serial) {
    let dishId = i + 1;
    let title = getJSONIndexValue(dishes, dishId, 'title');
    let priceOriginal = getJSONIndexValue(dishes, i, 'price');
    let upcharge = getJSONIndexValue(dishes, i, 'upcharge');
    let price = priceOriginal + upcharge;
    addJSONObject(shoppingCart, serial, dishId);
    setJSONIndexValue(shoppingCart, serial, 'amount', 1);
    setJSONIndexValue(shoppingCart, serial, 'title', title);
    setJSONIndexValue(shoppingCart, serial, 'price', price);
    setJSONIndexValue(dishes, dishId, 'in-cart', true);
    setJSONIndexValue(dishes, dishId, 'item-id', serial);
}


function sortUpdateSaveRender() {
    sortItems();
    updateItemId();
    saveAll();
    render();
}


function writeDescription(i) {    // writes the description of dish card i
    let description = getJSONIndexValue(dishes, i, 'description');
    let price = getDecimal(dishes, i, 'price');
    return `
        <div id="dish-card-description-${i}" class="column-start-start">
            <p id="dish-card-ingredients-${i}" class="dish-card-ingredients">${description}</p>
            ${writeOptionIf(i)}
            <output id="dish-card-price-${i}" class="dish-card-price">${price} €</output>
        </div>
    `;
}


function writeOptionIf(i) {    // writes the option of dish card i on one condition
    let option = getJSONIndexValue(dishes, i, 'option');    // contains 'text' or false
    if (option) {    // if true ...
        return `<p id="dish-card-option-${i}" class="dish-card-option">Option: ${option}</p>`;    // write option of dish card i ...
    } else {
        return '';    // no content
    }
}


function getDecimal(variable, index, key) {
    let number = getJSONIndexValue(variable, index, key);
    return number.toFixed(2).replace('.', ',');
}


function saveAll() {
    let variables = [dishes, shoppingCart];
    let keys = ['dishes', 'shoppingCart'];
    for (let i = 0; i < variables.length; i++) {
        let variable = variables[i];
        let key = keys[i];
        save(variable, key);
    }
}


function save(variable, key) {
    let variableAsText = JSON.stringify(variable);
    localStorage.setItem(key, variableAsText);
}


function load(key) {
    if (key == 'dishes') {
        let dishesAsText = localStorage.getItem(key);
        if (dishesAsText) {
            dishes = JSON.parse(dishesAsText);
        }
    } else {
        let shoppingCartAsText = localStorage.getItem(key);
        if (shoppingCartAsText) {
            shoppingCart = JSON.parse(shoppingCartAsText);
        }
    }
}


window.onscroll = function () {    // resizes height of shopping cart window during scrolling
    let shoppingCartWindow = getElement('shopping-cart-window');    // contains the element 'shopping-cart-window'
    updateHeightShoppingCart(shoppingCartWindow);    // updates height of shopping cart window
}


function updateHeightShoppingCart(shoppingCartWindow) {    // updates the height of the shopping cart window
    let heightBody = body.scrollHeight;    // contains the scroll height of 'body'
    let heightWindow = window.innerHeight;    // contains the inner height of window
    let maxScrollHeight = heightBody - heightWindow;    // contains the difference of body height and window height
    let heightHeader = header.offsetHeight;    // contains the offset height of 'header'
    let heightFooter = footer.offsetHeight;    // contains the offset height of 'footer'
    if (scrollY > maxScrollHeight - heightFooter) {    // if scrolling reaches the footer area ...
        updateHeightShoppingCartAreaFooter(shoppingCartWindow, heightWindow, maxScrollHeight, heightFooter);
    } else if (scrollY > heightHeader) {    // if scrolling reaches the 'content' area ...
        updateHeightShoppingCartAreaContent(shoppingCartWindow);
    } else {     // scrolling reaches the header area ...
        updateHeightShoppingCartAreaHeader(shoppingCartWindow, heightWindow, heightHeader);
    }
}


function updateHeightShoppingCartAreaFooter(shoppingCartWindow, hWindow, hMaxSroll, hFooter) {    // updates the height of shopping cart window in regard to the 'footer' area
    let delta = scrollY - (hMaxSroll - hFooter);    // contains the difference of height which is to subtract from height of shopping cart window
    let heightUnformatted = hWindow - delta;    // contains the updated height of shopping cart
    let newHeight = heightUnformatted.toString() + "px";    // contains the updated height as a String
    shoppingCartWindow.style.height = newHeight;    // sets the updated height as new style
    calculateHeightItemCollector(newHeight);
}


function calculateHeightItemCollector(newHeight) {    // calculates the new height of the element 'shopping-cart-item-collector'
    let element = getElement('shopping-cart-item-collector');    // contains the element 'shopping-cart-item-collector'
    let heightUnformatted = newHeight - 328;    // contains the updated height (328 is the height of other elements in the 'shopping-cart-window')
    let newValue = heightUnformatted.toString() + "px";    // contains the updated height as String
    element.style.height = newValue;    // sets the updated height as new style
}


function updateHeightShoppingCartAreaContent(shoppingCartWindow) {     // updates the height of shopping cart window in regard to the 'content' area
    shoppingCartWindow.style.height = "100vh";
    let element = getElement('shopping-cart-item-collector');
    element.style.height = "calc(100vh - 328px)";
}


function updateHeightShoppingCartAreaHeader(shoppingCartWindow, hWindow, hHeader) {    // updates the height of shopping cart window in regard to the 'header' area
    let delta = hHeader - scrollY;
    let heightUnformatted = hWindow - delta;
    let newHeight = heightUnformatted.toString() + "px";
    shoppingCartWindow.style.height = newHeight;
    calculateHeightItemCollector(newHeight);
}


function showShoppingCartMobileIf() {    // shows the element 'shopping-cart-mobile' on one condition
    let itemAmount = shoppingCart.length;    // contains the number of items in the shopping cart
    if (itemAmount > 0) {    // if itemAmount is greater than 0 ...
        setClassOnCommand('shopping-cart-mobile', 'display-flex', 'add');
    } else {    // else ...
        setClassOnCommand('shopping-cart-mobile', 'display-flex', 'remove');
    }
}


function setClassOnCommand(id, className, command) {
    (command == 'add') ? addClass(id, className) : removeClass(id, className);
}


function addClass(id, className) {
    document.getElementById(id).classList.add(className);
}


function removeClass(id, className) {
    document.getElementById(id).classList.remove(className);
}