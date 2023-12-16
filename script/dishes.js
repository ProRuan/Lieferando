// Variables
let dishes = [
    {
        'title': 'Mexicana scharf',
        'description': 'Paradeiser, Käse, Hühnerfleisch, Paprika, Mais, Chilli',
        'price': 9.50,
        'option': 'große Pizza',
        'option-price': 2.40,
        'in-cart': false
    },
    {
        'title': 'Frutti di Mare',
        'description': 'Paradeiser, Käse, Meeresfrüchte, Knoblauch',
        'price': 9.90,
        'option': 'große Pizza',
        'option-price': 2.60,
        'in-cart': false
    },
    {
        'title': 'Pizzastangerl',
        'description': '2 Stück',
        'price': 1.50,
        'option': 'plus 3 Stück',
        'option-price': 1.50,
        'in-cart': false
    },
    {
        'title': 'Spaghetti Bolognese',
        'description': 'Fleischsauce',
        'price': 9.90,
        'option': 'keine',
        'option-price': 0,
        'in-cart': false
    },
    {
        'title': 'Lasagne',
        'description': 'keine',
        'price': 9.90,
        'option': 'keine',
        'option-price': 0,
        'in-cart': false
    },
    {
        'title': 'Frühlingsrollen',
        'description': 'mit süß-saurer Sauce, 5 Stück',
        'price': 5.90,
        'option': 'plus 3 Stück',
        'option-price': 2.40,
        'in-cart': false
    },
    {
        'title': 'Paella Reis',
        'description': 'Curry Reis, Shrimps, Frutti di Mare, Hühnerfleisch und Salat',
        'price': 10.50,
        'option': 'große Portion',
        'option-price': 1.40,
        'in-cart': false
    },
    {
        'title': 'Nusspalatschinken',
        'description': '2 Stück',
        'price': 6.00,
        'option': 'plus 1 Stück',
        'option-price': 2.00,
        'in-cart': false
    }
];


// Functions
loadDishes();


function render() {
    showDishes();
    showItems();
    outputSubtotal();
    outputDeliveryCosts();
    outputTotal();
}


function showDishes() {    // shows all available dishes of restaurant
    let dishCardCollector = document.getElementById('dish-card-collector');    // contains the element 'dish-card-collector'
    dishCardCollector.innerHTML = '';    // empties dishCardCollector
    fillDishCardCollector(dishCardCollector);
    save();
}


function fillDishCardCollector(dishCardCollector) {    // fills dishCardCollector with dish cards
    for (let i = 0; i < dishes.length; i++) {
        dishCardCollector.innerHTML += writeDishCard(i);
    }
}


function writeDishCard(i) {
    return `
        <article id="dish-card-${i}" class="dish-card">
            ${writeHeader(i)}
            ${writeDescription(i)}
        </article>
    `;    // writes the dish card i
}


function writeHeader(i) {    // writes the header of dish card i
    return `
        <div id="dish-card-header-${i}" class="display-between-center">
            <h3 id="dish-card-title-${i}" class="dish-card-title">${getTitle(i)}</h3>
            <button id="add-dish-button-${i}" class="button dish-card-button" onclick="openDialog(${i})">+</button>
        </div>
    `;
}


function getTitle(i) {    // provides the title of dish card i
    return dishes[i]['title'];
}


function writeDescription(i) {    // writes the description of dish card i
    return `
        <div id="dish-card-description-${i}" class="column-start-start">
            <p id="dish-card-ingredients-${i}" class="dish-card-ingredients">${getDescription(i)}</p>
            <p id="dish-card-option-${i}" class="dish-card-option">Option: ${getOption(i)}</p>
            <div id="dish-card-price-${i}" class="dish-card-price">${getDecimalPrice(i)} €</div>
        </div>
    `;
}


function getDescription(i) {    // provides the description of dish card i
    return dishes[i]['description'];
}


function getOption(i) {    // provides the option of dish card i
    return dishes[i]['option'];
}


function getDecimalPrice(i) {
    let price = getPrice(i);
    let roundedPrice = Math.round(price * 100) / 100;
    return roundedPrice.toFixed(2);
}


function getPrice(i) {    // provides the price of dish card i
    return dishes[i]['price'];
}


function save() {    // saves global variables to the local storage
    let keys = ['dishes', 'shoppingCart'];    // contains global variables' keys
    let variables = [dishes, shoppingCart];    // contains global variables
    stringifyAndSetItem(keys, variables);
}


function stringifyAndSetItem(keys, variables) {    // creates Strings and sets items at the local storage
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];    // contains the key i
        let variable = variables[i];    // contains the variable i
        let variableAsText = JSON.stringify(variable);    // creates a String of variable i
        localStorage.setItem(key, variableAsText);    // sets this item at the local storage
    }
}


function loadDishes() {
    let dishesAsText = localStorage.getItem('dishes');
    if (dishesAsText) {
        dishes = JSON.parse(dishesAsText);
    }
}