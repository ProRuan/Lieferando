// Variables
let dishes = [
    {
        'original': true,
        'title': 'Pizza Mexicana',
        'description': 'Paradeiser, Käse, Hühnerfleisch, Paprika, Mais, Chilli',
        'price': 9.50,
        'option': 'große Pizza',
        'upcharge': 2.40,
        'option-selected': false,
        'in-cart': false
    },
    {
        'original': false,
        'title': 'Große Pizza Mexicana',
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
        'option': false,
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
        'option': 'große Portion',
        'upcharge': 1.40,
        'option-selected': false,
        'in-cart': false
    },
    {
        'original': false,
        'title': 'Großer Paella Reis',
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
    save();    // notwendig?
}


function fillDishCardCollector(dishCardCollector) {    // fills dishCardCollector with dish cards
    for (let i = 0; i < dishes.length; i++) {
        let original = getOriginal(i);
        if (original) {
            dishCardCollector.innerHTML += writeDishCard(i);
        }
    }
}


function getOriginal(i) {
    return dishes[i]['original'];
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
            <button id="add-dish-button-${i}" class="button dish-card-button" onclick="showDialogOrAddItem(${i})">+</button>
        </div>
    `;
}


function getTitle(i) {    // provides the title of dish card i
    return dishes[i]['title'];
}


function showDialogOrAddItem(i) {
    let optionAvailable = getOption(i);
    if (optionAvailable) {
        showDialog(i);
    } else {
        addOneItem(i);
        sortItems();
        updateItemId();
        saveAndRender();
    }
}


function addOneItem(i) {
    let inCart = getInCart(i);
    if (inCart) {
        let itemId = getItemId(i);
        let price = getPrice(i);
        shoppingCart[itemId]['amount']++;
        shoppingCart[itemId]['price'] += price;
    } else {
        let newIndex = getNewIndex();
        shoppingCart[newIndex] = {
            'dish-id': i,
            'amount': 1,
            'title': getTitle(i),
            'price': getPrice(i)
        };
        dishes[i]['in-cart'] = true;
        dishes[i]['item-id'] = newIndex;
    }
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
    let priceUnformatted = getPrice(i);
    let price = priceUnformatted.toFixed(2);
    return price.replace('.', ',');
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