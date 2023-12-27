// Functions
function showDialog(i) {    // shows the dialog with the content of dish card i
    openDialog();
    setClassOnCommand('dialog', 'add', 'overflowY-hidden');
    showDialogBox(i);
}


function openDialog() {    // opens the dialog
    document.getElementById('dialog').show();
}


function showDialogBox(i) {    // opens the dialog with the content of dish card i
    let dialogBox = getElement('dialog-box');    // contains the element 'dialog-box'
    dialogBox.innerHTML = '';    // emtpies dialogBox
    fillDialogBox(i, dialogBox);
}


function fillDialogBox(i, dialogBox) {    // fills dialogBox with the content of dish card i
    dialogBox.innerHTML = `
        ${writeDialogBoxHeader(i)}
        ${writeDialogBoxContent(i)}
        ${writeDialogBoxFooter(i)}
    `;
}


function writeDialogBoxHeader(i) {    // writes the header of dialog box
    let title = getDishesObjectValue(i, 'title');    // contains the title of dish i
    return `
        <div class="dialog-box-header display-between-center">
            <output id="hidden-index" hidden>${i}</output>
            <h2 class="dialog-box-headline">${title}</h2>
            <button id="dialog-box-close-button" class="dialog-box-close-button" onclick="closeDialog()"></button>
        </div>
    `;
}


function writeDialogBoxContent(i) {    // writes the content of dialog box
    return `
        <div class="dialog-box-content">
            ${writeDialogBoxDescripton(i)}
            ${writeDialogBoxOption(i)}
        </div>
    `;
}


function writeDialogBoxDescripton(i) {    // writes the description of dialog box
    let description = getDishesObjectValue(i, 'description');    // contains the description of dish i
    let price = getDecimal(dishes, i, 'price');    // contains the price of dish i formatted as a decimal
    return `
        <div class="dialog-box-description column-start-start">
            <p class="dialog-box-ingredients">${description}</p>
            <span class="dialog-box-price"><output id="dialog-box-price">${price}</output> €</span>
        </div>
    `;
}


function writeDialogBoxOption(i) {    // writes the option of dialog box
    let option = getDishesObjectValue(i, 'option')    // contains the option of dish i
    let upcharge = getDecimal(dishes, i, 'upcharge');    // contains the upcharge of dish i formatted as a decimal
    return `
        <div class="dialog-box-option">
            <div class="dialog-box-option-text">Ihre Option:</div>
            <div class="dialog-box-option-group display-between-center">
                <span>${option} (+ <output id="dialog-box-option-price">${upcharge}</output> €)</span>
                <button id="option-button" class="option-button" onclick="upgradeOrDowngradeDish(${(i)})">auswählen</button>
            </div>
        </div>
    `;
}


function writeDialogBoxFooter(i) {    // writes the footer of dialog box
    let price = getDecimal(dishes, i, 'price');    // contains the price of dish i formatted as a decimal
    return `
        <div class="dialog-box-footer display-start-center">
            <div class="dialog-box-amount-group display-between-center">
                <button id="dialog-box-plus-button" class="button" onclick="stepUpDialog(${i})">+</button>
                <span id="dialog-box-item-amount" class="item-amount"><output id="dialog-box-amount">1</output></span>
                <button id="dialog-box-minus-button" class="button" disabled onclick="stepDownDialog(${i})">-</button>
            </div>
            <button id="dialog-box-add-button" class="dialog-box-add-button" onclick="confirmAction(${i})">
                <span><output id="dialog-box-total-price">${price}</output> €</span>
            </button>
        </div>
    `;
}


function stop(event) {    // stops the subsequent onclick function 'closeDialog()'
    event.stopPropagation();
}


function closeDialog() {    // closes the dialog
    resetOptionSelected();
    resetDialogContent();
    setClassOnCommand('body', 'remove', 'overflowY-hidden');
    hideDialog();
}


function resetOptionSelected() {    // resets 'option-selected' of dish i
    let index = getInnerHTMLValue('hidden-index');    // contains the index of dish i
    if (index > -1) {    // if index greater then -1
        setDishesObjectValue(index, 'option-selected', false);    // set 'option-selected' of dish i to false
    }
    save(dishes, 'dishes');
}


function getInnerHTMLValue(id) {    // provides the index of dish i which is hidden at the dialog box
    return +document.getElementById(id).innerHTML;
}


function resetDialogContent() {    // resets the dialog's content
    let comment = '<!-- rendering content of dialog box -->';    // default text
    outputValue('dialog-box', comment);
}


function hideDialog() {    // closes the dialog
    document.getElementById('dialog').close();
}


function upgradeOrDowngradeDish(i) {    // sets the option related settings of dish i
    let optionSelected = getDishesObjectValue(i, 'option-selected');    // contains true or false
    (optionSelected) ? setOriginalDish(i) : setUpgradedDish(i);    // true: original settings | false: upgraded settings
    save(dishes, 'dishes');
    updateTotalPriceDialog(i);
}


function setOriginalDish(i) {    // sets the original settings of dish i
    outputValue('option-button', 'auswählen');
    setClassOnCommand('option-button', 'toggle', 'option-button-activated');
    setDishesObjectValue(i, 'option-selected', false);
}


function setUpgradedDish(i) {    // set the upgraded settings of dish i
    outputValue('option-button', 'aktiviert');
    setClassOnCommand('option-button', 'toggle', 'option-button-activated');
    setDishesObjectValue(i, 'option-selected', true);
}


function updateTotalPriceDialog(i) {    // updates the total price of the output element 'dialog-box-add-button'
    let amount = getInnerHTMLValue('dialog-box-amount');    // contains the amount of item
    let price = getDishesObjectValue(i, 'price');    // contains the price of dish i
    let upcharge = setUpcharge(i);    // contains 0 (if no option selected)
    let totalPrice = amount * (price + upcharge);    // contains the total price
    let totalPriceAsDecimal = formatAsDecimal(totalPrice);    // contains the total price formatted as decimal
    outputValue('dialog-box-total-price', totalPriceAsDecimal);
}


function setUpcharge(i) {    // sets the value of upcharge
    let optionSelected = getDishesObjectValue(i, 'option-selected');    // contains true or false
    let upcharge = getDishesObjectValue(i, 'upcharge');    // contains the upcharge of dish i
    return (optionSelected) ? upcharge : 0;    // true: upcharge | false: 0
}


function stepUpDialog(i) {    // increases the item at the dialog box
    increaseAmountDialog(true);
    updateTotalPriceDialog(i);
    enableButtonIf('dialog-box-minus-button');
}


function increaseAmountDialog(increase) {    // increases the amount of item at the dialog box
    let amount = getInnerHTMLValue('dialog-box-amount');    // contains the amount of item
    (increase) ? ++amount : --amount;    // true: amount + 1 | false: amount - 1
    outputValue('dialog-box-amount', amount);
}


function enableButtonIf(id) {    // enables a button on one condition
    let buttondisabled = getElement(id).disabled;    // contains a button element
    if (buttondisabled) {    // if the button is disabled ...
        setButton(id, false);    // enable button
    }
}


function setButton(id, value) {    // sets a button enabled or disabled
    document.getElementById(id).disabled = value;
}


function stepDownDialog(i) {    // decreases the item at the dialog box
    increaseAmountDialog(false);
    updateTotalPriceDialog(i);
    disableButtonIf('dialog-box-minus-button');
}


function disableButtonIf(id) {    // disables a button on one condition
    let amount = getInnerHTMLValue('dialog-box-amount');    // contains the amount of item
    if (amount < 2) {    // if amount is less than 2 ...
        setButton(id, true);    // disable button
    }
}


function confirmAction(i) {    // executes the increasing or adding of items and closes the dialog
    updateItemDialog(i);
    closeDialog(i);
}


function updateItemDialog(i) {    // updates an upgraded or orignal item on one condition
    let amount = getInnerHTMLValue('dialog-box-amount');    // contains the amount of item
    let price = getUnformattedNumber('dialog-box-total-price');    // contains the total price of item
    let optionSelected = getDishesObjectValue(i, 'option-selected');    // contains true or false
    (optionSelected) ? updateUpgradedItem(i, amount, price) : updateOriginalItem(i, amount, price);    // true: update upgraded item | false: update original item
}


function updateUpgradedItem(i, amount, price) {    // increases or adds an upgraded item on one condition
    let iUp = upgradeIndex(i);    // contains the index of upgraded dish
    let inCart = getDishesObjectValue(iUp, 'in-cart');    // contains true or false
    (inCart) ? increaseItemDialog(iUp, amount, price) : addItemDialog(iUp, amount, price);    // true: increase item | false: add item
}


function upgradeIndex(i) {    // provides the index of upgraded dish
    return i + 1;
}


function increaseItemDialog(index, amount, price) {    // increases amount and price of an item in the shopping cart
    let itemId = getDishesObjectValue(index, 'item-id');    // contains the item-id of item
    increaseCartObjectValue(itemId, 'amount', amount);
    increaseCartObjectValue(itemId, 'price', price);
    saveAndRender();
}


function addItemDialog(index, amount, price) {    // adds an item to th shopping cart
    let serial = getJSONLength(shoppingCart);    // contains the serial number of the item
    let title = getDishesObjectValue(index, 'title');    // contains the title of item
    let values = [index, amount, title, price];    // contains index, amount, title and price of item
    addCartObject(serial, values);
    setDishesObjectValue(index, 'in-cart', true);
    setDishesObjectValue(index, 'item-id', serial);
    sortUpdateSaveRender();
}


function updateOriginalItem(i, amount, price) {    // increases or adds an original item on one condition
    let inCart = getDishesObjectValue(i, 'in-cart');    // contains true or false
    (inCart) ? increaseItemDialog(i, amount, price) : addItemDialog(i, amount, price);    // true: increase item | false: add item
}


function submitOrder() {    // opens the final dialog and resets all settings of the website
    openDialog();
    emptyShoppingCart();
    resetInCart();
    saveAndRender();
    showFinalDialog();
    hideShoppingCart();
    setTimeout(closeDialog, 3000);
}


function emptyShoppingCart() {    // empties the shopping cart
    shoppingCart = [];
}


function resetInCart() {    // sets 'in-cart' of all dishes to false
    for (let i = 0; i < dishes.length; i++) {
        setDishesObjectValue(i, 'in-cart', false);
    }
}


function showFinalDialog() {    // shows the final dialog
    dialogBox = getElement('dialog-box');    // contains the element 'dialog-box'
    dialogBox.innerHTML = '';    // empties dialogBox
    writeOrderConfirmation(dialogBox);
}


function writeOrderConfirmation(dialogBox) {    // writes the order confirmation at the dialog box
    dialogBox.innerHTML = `
        <div class="dialog-box-header">
        <output id="hidden-index" hidden>-1</output>
            <h2 class="dialog-box-headline ta-center">Vielen Dank, dass Sie Ruanizer nutzen!</h2>
        </div>
        <div class="dialog-box-description">
            <p class="dialog-box-ingredients ta-center">
                Wir werden Ihre Bestellung so rasch wie möglich bearbeiten!
            </p>
        </div>
    `;
}