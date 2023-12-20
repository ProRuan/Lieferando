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
loadDishes();


function render() {    // renders ...
    showDishes();    // dishes of restaurant
    showItems();    // items of shopping cart
    outputSubtotal();    // value of subtotal
    outputDeliveryCosts();    // value of delivery costs
    outputTotal();    // value of total
}


function showDishes() {    // shows all available dishes of restaurant
    let dishCardCollector = getElement('dish-card-collector');    // contains the element 'dish-card-collector'
    dishCardCollector.innerHTML = '';    // empties dishCardCollector
    fillDishCardCollector(dishCardCollector);
    save();
}


function getElement(id) {    // provides an element by the parameter 'id'
    return document.getElementById(id);
}


function fillDishCardCollector(dishCardCollector) {    // fills dishCardCollector with i dish cards
    for (let i = 0; i < dishes.length; i++) {
        let original = getOriginal(i);    // contains true or false
        if (original) {    // if this is an orignal dish (without upgrade) ...
            dishCardCollector.innerHTML += writeDishCard(i);    // writes dish card i
        }
    }
}


function getOriginal(i) {    // provides 'original' of dish i
    return dishes[i]['original'];
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
    return `
        <div id="dish-card-header-${i}" class="display-between-center">
            <h3 id="dish-card-title-${i}" class="dish-card-title">${getTitle(i)}</h3>
            <button id="add-dish-button-${i}" class="button dish-card-button" onclick="showDialogOrAddItem(${i})">+</button>
        </div>
    `;
}


function getTitle(i) {    // provides the title of dish i
    return dishes[i]['title'];
}


function showDialogOrAddItem(i) {
    let optionAvailable = getOption(i);    // contains 'text' or false
    if (optionAvailable) {    // if true ...
        showDialog(i);    // open dialog
    } else {    // else ...
        addOneItem(i);    // add one item directly (without dialog)
        sortItems();
        updateItemId();
        saveAndRender();
    }
}


function getOption(i) {    // provides the option of dish i
    return dishes[i]['option'];
}


function addOneItem(i) {    // adds one item of dish i to the shopping cart
    let inCart = getInCart(i);    // contains true or false
    if (inCart) {    // if dish i is already in the shopping cart ...
        increaseAmountAndPrice(i);    // increase amount and price of dish i in the shopping cart
    } else {    // else ...
        let newIndex = getNewIndex();    // contains the index of new item
        addNewItem(i, newIndex);    // add dish i to the shopping cart
        setInCartTrue(i);
        setItemId(i, newIndex);
    }
}

function getInCart(i) {    // provides 'in-cart' of dish i
    return dishes[i]['in-cart'];
}


function increaseAmountAndPrice(i) {
    let itemId = getItemId(i);    // contains the item-id of dish i
    let price = getPrice(i);    // contains the price of dish i 
    shoppingCart[itemId]['amount']++;    // increases amount of item
    shoppingCart[itemId]['price'] += price;    // increases price of item
}


function getItemId(i) {    // provides 'item-id' of dish i
    return dishes[i]['item-id'];
}


function getPrice(i) {    // provides the price of dish i
    return dishes[i]['price'];
}


function getNewIndex() {    // provides the index of new item
    return shoppingCart.length;
}


function addNewItem(i, newIndex) {    // adds the dish i with one item to shopping cart
    shoppingCart[newIndex] = {
        'dish-id': i,    // contains the index of dish i
        'amount': 1,    // contains amount 1
        'title': getTitle(i),    // contains the title of dish i
        'price': getPrice(i)    // contains the price of dish i
    };
}


function setInCartTrue(i) {    // sets 'in-cart' of dish i to true
    dishes[i]['in-cart'] = true;
}


function setItemId(i, newIndex) {    // sets 'item-id' of dish i
    dishes[i]['item-id'] = newIndex;
}


function writeDescription(i) {    // writes the description of dish card i
    return `
        <div id="dish-card-description-${i}" class="column-start-start">
            <p id="dish-card-ingredients-${i}" class="dish-card-ingredients">${getDescription(i)}</p>
            ${writeOptionIf(i)}
            <output id="dish-card-price-${i}" class="dish-card-price">${getDecimalPrice(i)} €</output>
        </div>
    `;
}


function getDescription(i) {    // provides the description of dish card i
    return dishes[i]['description'];
}


function writeOptionIf(i) {    // writes the option of dish card i on one condition
    let optionAvailable = getOption(i);    // contains 'text' or false
    if (optionAvailable) {    // if true ...
        return `<p id="dish-card-option-${i}" class="dish-card-option">Option: ${getOption(i)}</p>`;    // write option of dish card i ...
    } else {
        return '';    // no content
    }
}


function getDecimalPrice(i) {    // provides the price of dish i as decimal number
    let priceUnformatted = getPrice(i);    // contains the price
    let price = priceUnformatted.toFixed(2);    // contains a String number with 2 decimals
    return price.replace('.', ',');    // outputs the price with comma
}


function save() {    // saves the global variables to the local storage
    let keys = ['dishes', 'shoppingCart'];    // contains global variables' keys
    let variables = [dishes, shoppingCart];    // contains global variables
    stringifyAndSetItem(keys, variables);
}


function stringifyAndSetItem(keys, variables) {    // creates Strings and sets items at the local storage
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];    // contains the key i
        let variable = variables[i];    // contains the variable i
        let variableAsText = JSON.stringify(variable);    // contains a String of variable i
        localStorage.setItem(key, variableAsText);    // sets this item at the local storage
    }
}


function loadDishes() {    // loads the variable dishes
    let dishesAsText = localStorage.getItem('dishes');    // get Item 'dishes'
    if (dishesAsText) {    // if 'text' ...
        dishes = JSON.parse(dishesAsText);    // parse the String to the variable dishes
    }
}