// Variablen
let dishes = [
    {
        'title': 'dish1',
        'description': 'Rindsuppe',
        'option': 'Fritatten, Backerbsen',
        'price': 3.50,
    },
    {
        'title': 'Risipisi',
        'description': 'Reis, Erbsen und Huhn',
        'option': 'Mais, Speckwürfel',
        'price': 6.00,
    },
    {
        'title': 'dish3',
        'description': 'Lasagne',
        'option': '',
        'price': 8.00,
    },
    {
        'title': 'dish4',
        'description': 'Gebackene Calamaris',
        'option': '1,00 € pro zusätzlichem Stück',
        'price': 12.00,
    },
    {
        'title': 'dish5',
        'description': 'Apfelkuchen',
        'option': 'Zimt',
        'price': 5.50,
    }
];

let shoppingCart = [];


// Functions
function addDish(i) {
    let title = getTitle(i);
    let price = getPrice(i);
    addToShoppingCart(title, price);
}


function getTitle(i) {
    return dishCards[i]['title'];
}


function getPrice(i) {
    return dishCards[i]['price'];
}


function addToShoppingCart(title, price) {
    shoppingCart['title'].push(title);
    shoppingCart['price'].push(price);
}