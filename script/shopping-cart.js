// Variables
let shoppingCart = [];    // contains all selected dishes


// Functions
function addDish(i) {    // adds dish i to the shopping cart
    addOrIncreaseIf(i);
    saveAndShowDishes();
}


function addOrIncreaseIf(i) {
    if (alreadyInCart(i)) {    // if item i is already in the shopping cart ...
        updateAmountAndPrice(i);    // update amount and price of item i
    } else {    // else ...
        addToShoppingCart(i);    // add item to the shopping cart
        setInCart(i);    // set dishes[i]['in-cart'] = true
    }
}


function alreadyInCart(i) {    // returns true or false
    return dishes[i]['in-cart'];
}

