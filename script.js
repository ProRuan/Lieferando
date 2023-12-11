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
    let variables = [dishes, shoppingCart];
    getItemAndParse(keys, variables);
}


function getItemAndParse(keys, variables) {
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let variable = variables[i];
        let variableAsText = localStorage.getItem(key);
        if (variableAsText) {
            variable = JSON.parse(variableAsText);
        }
    }
}