// Variables
let dishes = [
    {    // dish with index 0
        'title': 'dish1',    // title of dish
        'ingredients': 'Rindsuppe',    // ingredients of dish
        'option': 'Fritatten, Backerbsen',    // optional ingredients of dish
        'price': 3.50,    // price of dish
        'in-cart': false    // true, if in shopping cart
    },
    {
        'title': 'Risipisi',
        'ingredients': 'Reis, Erbsen und Huhn',
        'option': 'Mais, Speckwürfel',
        'price': 6.00,
        'in-cart': false
    },
    {
        'title': 'dish3',
        'ingredients': 'Lasagne',
        'option': '',
        'price': 8.00,
        'in-cart': false
    },
    {
        'title': 'dish4',
        'ingredients': 'Gebackene Calamaris',
        'option': '1,00 € pro zusätzlichem Stück',
        'price': 12.00,
        'in-cart': false
    },
    {
        'title': 'dish5',
        'ingredients': 'Apfelkuchen',
        'option': 'Zimt',
        'price': 5.50,
        'in-cart': false
    }
];    // contains all available dishes


// Functions
load();


function showDishes() {    // shows all available dishes of restaurant
    let dishCardCollector = document.getElementById('dish-card-collector');    // contains the element 'dish-card-collector'
    dishCardCollector.innerHTML = '';    // empties dishCardCollector
    fillDishCardCollector(dishCardCollector);

    showShoppingCartItems();    // Bitte bearbeiten!!!
    setValuesInCart();    // Bitte bearbeiten!!!
}


function fillDishCardCollector(dishCardCollector) {    // fills dishCardCollector with dish cards
    for (let i = 0; i < dishes.length; i++) {
        dishCardCollector.innerHTML += `
        <article id="dish-card-${i}" class="dish-card">
            ${writeHeader(i)}
            ${writeDescription(i)}
        </article>
    `;    // writes the dish card i
    }
}


function writeHeader(i) {    // writes the header of dish card i
    return `
        <div id="dish-card-header-${i}" class="display-between-center">
            <h3 id="dish-card-title-${i}" class="dish-card-title">${getTitle(i)}</h3>
            <button id="add-dish-button-${i}" class="button" onclick="addDish(${i})">+</button>
        </div>
    `;
}


function getTitle(i) {    // provides the title of dish card i
    return dishes[i]['title'];
}


function writeDescription(i) {    // writes the description of dish card i
    return `
        <div id="dish-card-description-${i}" class="dish-card-description column-start-start">
            <p id="dish-card-ingredients-${i}" class="dish-card-ingredients">${getIngredients(i)}</p>
            <p id="dish-card-option-${i}" class="dish-card-option">${getOption(i)}</p>
            <div id="dish-card-price-${i}" class="dish-card-price">${getPrice(i)}</div>
        </div>
    `;
}


function getIngredients(i) {    // provides the ingredients of dish card i
    return dishes[i]['ingredients'];
}


function getOption(i) {    // provides the option of dish card i
    return dishes[i]['option'];
}


function getPrice(i) {    // provides the price of dish card i
    return dishes[i]['price'];
}