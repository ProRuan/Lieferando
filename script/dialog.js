let counter = 0;

function openDialog(i) {
    let dialog = document.getElementById('dialog');
    dialog.show();
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


function closeDialog(id) {
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
                <button id="option-button" class="option-button" onclick="${setOptionSelected(i)}">Auswählen</button>
            </div>
        </div>
    `;
}


// function getOptionAndOptionPrice(i) {
//     let option = getOption(i);
//     let optionPrice = getOptionPrice(i).toFixed(2);
//     return `${option} (+ ${optionPrice} €)`;
// }


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
}


function getOptionSelected(i) {
    return dishes[i]['option-selected'];
}


function writeDialogBoxFooter(i) {
    return `
        <div class="dialog-box-footer display-start-center">
            <div class="dialog-box-amount-group display-between-center">
                <button id="dialog-box-plus-button" class="button">+</button>
                <span id="dialog-box-item-amount" class="item-amount"><output id="dialog-box-amount">${getAmountInCartIf(i)}</output></span>
                <button id="dialog-box-minus-button" class="button">-</button>
            </div>
            <button id="dialog-box-add-button" class="dialog-box-add-button" onclick="confirmAction(${i})">
                <span><output id="dialog-box-total-price">${calculateTotalDialog(i)}</output> €</span>
            </button>
        </div>
    `;
}


function getAmountInCartIf(i) {
    let inCart = getInCart(i);
    if (inCart) {
        let itemId = getItemId(i);    // in Gebrauch?
        return shoppingCart[itemId]['amount'];
    } else {
        return 1;
    }
}


function getInCart(i) {
    return dishes[i]['in-cart'];
}


function confirmAction(i) {
    addDish(i);
    closeDialog();
}


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