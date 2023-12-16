let counter = 0;

function showDialog(i) {
    openDialog();
    showDialogBox(i);
}

function openDialog(i) {
    let dialog = document.getElementById('dialog');
    dialog.show();
}


function showDialogBox(i) {
    let dialogBox = document.getElementById('dialog-box');
    dialogBox.innerHTML = '';
    fillDialogBox(i, dialogBox);
}


function fillDialogBox(i, dialogBox) {
    dialogBox.innerHTML = `
        ${writeDialogBoxHeader(i)}
        ${writeDialogBoxContent(i)}
        ${writeDialogBoxFooter(i)}
    `;
}


function writeDialogBoxHeader(i) {
    return `
        <div class="dialog-box-header display-between-center">
            <h2 class="dialog-box-headline">${getTitle(i)}</h2>
            <div id="dialog-box-close-button" class="dialog-box-close-button" onclick="closeDialog()"></div>
        </div>
    `;
}


function closeDialog() {
    let dialog = document.getElementById('dialog');
    dialog.close();
}


function closeDialogIf(id) {
    if (id == 'dialog-box') {
        counter = 3;
    }
    if (--counter < 1) {
        closeDialog();
        counter = 1;
    }
}


function writeDialogBoxContent(i) {
    return `
        <div>
            ${writeDialogBoxDescripton(i)}
            ${writeDialogBoxOption(i)}
        </div>
    `;
}


function writeDialogBoxDescripton(i) {
    return `
        <div class="dialog-box-description column-start-start">
            <p class="dialog-box-ingredients">${getDescription(i)}</p>
            <span class="dialog-box-price"><output id="dialog-box-price">${getDecimalPrice(i)}</output> €</span>
        </div>
    `;
}


function writeDialogBoxOption(i) {
    return `
        <div class="dialog-box-option">
            <div class="dialog-box-option-text">Ihre Option:</div>
            <div class="dialog-box-option-group display-between-center">
                <span>${getOption(i)} (<output id="dialog-box-option-price">${getDecimalOptionPrice(i)}</output> €)</span>
                <button id="option-button" class="option-button" onclick="setOptionSelected(${(i)})">Auswählen</button>
            </div>
        </div>
    `;
}


function getDecimalOptionPrice(i) {
    let optionPrice = getOptionPrice(i);
    return optionPrice.toFixed(2);
}


function getOptionPrice(i) {
    return dishes[i]['option-price'];
}


function setOptionSelected(i) {
    let optionSelected = getOptionSelected(i);
    if (optionSelected) {
        dishes[i]['option-selected'] = false;
    } else {
        dishes[i]['option-selected'] = true;
    }
    // calculateTotalPriceIf(i);
    saveAndRender();
    updateTotalPriceDialog(i);
}


function getOptionSelected(i) {
    return dishes[i]['option-selected'];
}


function calculateTotalPriceIf(i) {
    let inCart = getInCart(i);
    if (inCart) {
        let itemId = getItemId(i);
        let amount = getAmountInCart(itemId);
        document.getElementById('dialog-box-amount').innerHTML = amount;
        let price = getPrice(i);
        let optionPrice = getOptionPriceIf(i);
        let totalPrice = amount * (price + optionPrice);
        let output = document.getElementById('dialog-box-total-price');
        output.innerHTML = totalPrice.toFixed(2);
    } else {
        let price = getPrice(i);
        let output = document.getElementById('dialog-box-total-price');
        output.innerHTML = price.toFixed(2);
    }
}


// function disableButton(id) {
//     let button = document.getElementById(id);
//     button.disabled = true;
// }


// function enableButton(id) {
//     let button = document.getElementById(id);
//     button.disabled = false;
// }


function writeDialogBoxFooter(i) {
    return `
        <div class="dialog-box-footer display-start-center">
            <div class="dialog-box-amount-group display-between-center">
                <button id="dialog-box-plus-button" class="button" onclick="increaseItemDialog(${i})">+</button>
                <span id="dialog-box-item-amount" class="item-amount"><output id="dialog-box-amount">1</output></span>
                <button id="dialog-box-minus-button" class="button" onclick="decreaseItemDialog(${i})">-</button>
            </div>
            <button id="dialog-box-add-button" class="dialog-box-add-button" onclick="confirmAction(${i})">
                <span><output id="dialog-box-total-price">${getDecimalPrice(i)}</output> €</span>
            </button>
        </div>
    `;
}


function increaseItemDialog(i) {
    increaseAmountDialog();
    updateTotalPriceDialog(i);
    enableButtonIf('dialog-box-minus-button');
}


function increaseAmountDialog() {
    let output = document.getElementById('dialog-box-amount');
    let amount = +output.innerHTML;
    output.innerHTML = ++amount;
}


function updateTotalPriceDialog(i) {
    let amount = +document.getElementById('dialog-box-amount').innerHTML;
    let price = getPrice(i);
    let optionPrice = 0;
    let optionSelected = getOptionSelected(i);
    if (optionSelected) {
        optionPrice = getOptionPrice(i);
    } else {
        optionPrice = 0;
    }
    let totalPrice = (amount * (price + optionPrice)).toFixed(2);
    let output = document.getElementById('dialog-box-total-price');
    output.innerHTML = totalPrice;
}


function enableButtonIf(id) {
    let buttondisabled = document.getElementById(id);
    if (buttondisabled) {
        enableButton(id);
    }
}


function enableButton(id) {
    document.getElementById(id).disabled = false;
}


function decreaseItemDialog(i) {
    decreaseAmountDialog();
    updateTotalPriceDialog(i);
    disableButtonIf('dialog-box-minus-button');
}


function decreaseAmountDialog() {
    let output = document.getElementById('dialog-box-amount');
    let amount = +output.innerHTML;
    output.innerHTML = --amount;
}


function disableButtonIf(id) {
    let amount = +document.getElementById('dialog-box-amount').innerHTML;
    if (amount < 2) {
        disableButton(id);
    }
}


function disableButton(id) {
    document.getElementById(id).disabled = true;
}


// ergebnis in shoppingCart (nur) speichern!!!


function getAmountInCartIf(i) {
    let inCart = getInCart(i);
    if (inCart) {
        let itemId = getItemId(i);
        return getAmountInCart(itemId);
    } else {
        return 1;
    }
}


function getInCart(i) {
    return dishes[i]['in-cart'];
}


function getPriceInCartIf(i) {
    let inCart = getInCart(i);
    if (inCart) {
        let itemId = getItemId(i);
        return shoppingCart[itemId]['price'].toFixed(2);
    } else {
        return getDecimalPrice(i);
    }
}


function confirmAction(i) {
    addDishFromDialog(i);
    closeDialog();
}


// Kontroll-Checkpoint ---

function addDishFromDialog(i) {
    let inCart = getInCart(i);
    if (inCart) {
        let itemId = getItemId(i);
        let amount = +document.getElementById('dialog-box-amount').innerHTML;
        shoppingCart[itemId]['amount'] += amount;
        let price = +document.getElementById('dialog-box-total-price').innerHTML;
        shoppingCart[itemId]['price'] += price;

    } else {
        addDish(i);
    }
    sortItems();
    updateId();
    saveAndRender();
}


// function addDishDialog(i) {
//     let optionSelected = getOptionSelected(i);
//     if (optionSelected) {
//         let currentIndex = getCurrentIndex();
//         shoppingCart[currentIndex] = {
//             'dish-id': i,
//             'price': getPrice(i) + getOptionPrice(i),
//             'option': getOption(i),
//             'amount': 1,
//         };

//         dishes[i]['option-in-cart'] = true,
//             dishes[i]['option-id'] = currentIndex;
//     } else {
//         let currentIndex = getCurrentIndex();
//         shoppingCart[currentIndex] = {
//             'dish-id': i,
//             'price': getPrice(i),
//             'amount': 1,
//         };

//         dishes[i]['in-cart'] = true,
//             dishes[i]['item-id'] = currentIndex;
//     }
// }


function calculateTotalDialog(i) {
    let price = getPrice(i);
    let optionPrice = getOptionPriceIf(i);
    let totalPrice = price + optionPrice;
    let amount = getAmountInCartIf(i);
    return (amount * totalPrice).toFixed(2);
}


function getOptionPriceIf(i) {
    let optionSelected = getOptionSelected(i);
    if (optionSelected) {
        return getOptionPrice(i);
    } else {
        return 0;
    }
}

