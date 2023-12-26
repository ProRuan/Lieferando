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
    let title = getDishesObjectValue(i, 'title');
    return `
        <div class="dialog-box-header display-between-center">
            <output id="hidden-index" hidden>${i}</output>
            <h2 class="dialog-box-headline">${title}</h2>
            <button id="dialog-box-close-button" class="dialog-box-close-button" onclick="closeDialog()"></button>
        </div>
    `;
}


function stop(event) {    // stops the following onclick function 'closeDialog()'
    event.stopPropagation();
}


function closeDialog() {    // closes the dialog
    resetOptionSelected();
    resetDialogContent();
    setClassOnCommand('body', 'remove', 'overflowY-hidden');
    hideDialog();
}


function resetOptionSelected() {    // resets 'option-selected' of dish i
    let index = getInnerHTMLValue('hidden-index');    // contains hidden index
    if (index > -1) {    // if index greater then -1
        setDishesObjectValue(index, 'object-selected', false);
    }
    save(dishes, 'dishes');
}


function getInnerHTMLValue(id) {    // provides the hidden index of dish i
    return +document.getElementById(id).innerHTML;
}


function resetDialogContent() {    // resets the dialog's content
    let comment = '<!-- rendering content of dialog box -->';
    outputValue('dialog-box', comment);
}


function hideDialog() {
    document.getElementById('dialog').close();
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
    let description = getDishesObjectValue(i, 'description');
    let price = getDecimal(dishes, i, 'price');
    return `
        <div class="dialog-box-description column-start-start">
            <p class="dialog-box-ingredients">${description}</p>
            <span class="dialog-box-price"><output id="dialog-box-price">${price}</output> €</span>
        </div>
    `;
}


function writeDialogBoxOption(i) {    // writes the option of dialog box
    let option = getDishesObjectValue(i, 'option')
    let upcharge = getDecimal(dishes, i, 'upcharge');
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

// Bitte bearbeiten!!!
function upgradeOrDowngradeDish(i) {    // sets 'option-selected' of dish i and related settings
    let optionSelected = getDishesObjectValue(i, 'option-selected');    // contains true or false
    (optionSelected) ? setOriginalDish(i) : setUpgradedDish(i);
    save(dishes, 'dishes');
    updateTotalPriceDialog(i);
}


function setOriginalDish(i) {    // sets option related settings (false)
    outputValue('option-button', 'auswählen');
    setClassOnCommand('option-button', 'remove', 'option-button-activated');
    setDishesObjectValue(i, 'option-selected', false);
}


function setUpgradedDish(i) {    // sets option related settings (true)
    outputValue('option-button', 'aktiviert');
    setClassOnCommand('option-button', 'add', 'option-button-activated');
    setDishesObjectValue(i, 'option-selected', true);
}


function updateTotalPriceDialog(i) {    // updates the total price of the 'dialog-box-add-button'
    let amount = getInnerHTMLValue('dialog-box-amount');
    let price = getDishesObjectValue(i, 'price');
    let upcharge = setUpcharge(i);
    let totalPrice = amount * (price + upcharge);
    let totalPriceAsDecimal = formatAsDecimal(totalPrice);
    outputValue('dialog-box-total-price', totalPriceAsDecimal);
}


function setUpcharge(i) {    // sets the value of upcharge
    let optionSelected = getDishesObjectValue(i, 'option-selected');
    let upcharge = getDishesObjectValue(i, 'upcharge');
    return (optionSelected) ? upcharge : 0;    // return 0, if option is not selected
}

// Umbenennen?
function selectOutput(id) {    // selects the element 'id' including innerHTML
    return document.getElementById(id).innerHTML;
}


function writeDialogBoxFooter(i) {    // writes the footer of dialog box
    let price = getDecimal(dishes, i, 'price');
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


function stepUpDialog(i) {    // increases the item at the dialog box
    increaseAmountDialog();
    updateTotalPriceDialog(i);
    setButtonIf('dialog-box-minus-button', false);
}


function increaseAmountDialog() {    // increases the amount of item at the dialog box
    let amount = getInnerHTMLValue('dialog-box-amount');
    outputValue('dialog-box-amount', ++amount);
}


function setButtonIf(id, value) {
    let buttondisabled = getElement(id).disabled;    // contains the minus button of the dialog box
    if (buttondisabled) {    // if the minus button is disabled ...
        setButton(id, false);    // enable minus button
    } else {
        setButton(id, true);
    }
}


function setButton(id, value) {    // enables a button
    document.getElementById(id).disabled = value;
}


function stepDownDialog(i) {    // decreases the item at the dialog box
    decreaseAmountDialog();
    updateTotalPriceDialog(i);
    disableButtonIf('dialog-box-minus-button');
}


function decreaseAmountDialog() {    // decreases the amount of item at the dialog box
    let amount = getInnerHTMLValue('dialog-box-amount');
    outputValue('dialog-box-amount', --amount);
}


function disableButtonIf(id) {
    let amount = getInnerHTMLValue('dialog-box-amount');    // contains the amount
    if (amount < 2) {    // if amount less than 2 ...
        setButton(id, true);    // disable minus button
    }
}


function confirmAction(i) {    // confirms adding or increasing of items
    updateItemDialog(i);
    closeDialog(i);
}


function updateItemDialog(i) {
    let amount = getInnerHTMLValue('dialog-box-amount');
    let price = getInnerHTMLValue('dialog-box-total-price');
    let inCart = getDishesObjectValue(i, 'in-cart');
    (inCart) ? increaseItemDialog(i, amount, price) : addItemDialog(i, amount, price);
}


function increaseItemDialog(i, amount, price) {
    let optionSelected = getDishesObjectValue(i, 'option-selected');
    (optionSelected) ? increaseUpgraded(i, amount, price) : increaseOriginal(i, amount, price);
    saveAndRender();
}


function increaseUpgraded(i, amount, price) {
    let iUp = upgradeIndex(i);
    let itemId = getDishesObjectValue(iUp, 'item-id');
    increaseCartObjectValue(itemId, 'amount', amount);
    increaseCartObjectValue(itemId, 'price', price);
}


function upgradeIndex(i) {
    return i + 1;
}


function increaseOriginal(i, amount, price) {
    let itemId = getDishesObjectValue(i, 'item-id');
    increaseCartObjectValue(itemId, 'amount', amount);
    increaseCartObjectValue(itemId, 'price', price);
}


function addItemDialog(i, amount, price) {
    let optionSelected = getDishesObjectValue(i, 'option-selected');
    (optionSelected) ? addUpgraded(i, amount, price) : addOriginal(i, amount, price);
    sortUpdateSaveRender();
}


function addUpgraded(i, amount, price) {
    let serial = getJSONLength(shoppingCart);
    let iUp = upgradeIndex(i);
    let title = getDishesObjectValue(iUp, 'title');
    let values = [iUp, amount, title, price];
    addCartObject(serial, values);
    setDishesObjectValue(iUp, 'in-cart', true);
    setDishesObjectValue(iUp, 'item-id', serial);
}


function addOriginal(i, amount, price) {
    let serial = getJSONLength(shoppingCart);
    let title = getDishesObjectValue(i, 'title');
    let values = [i, amount, title, price];
    addCartObject(serial, values);
    setDishesObjectValue(i, 'in-cart', true);
    setDishesObjectValue(i, 'item-id', serial);
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


function emptyShoppingCart() {
    shoppingCart = [];
}


function resetInCart() {    // sets 'in-cart' of all dishes to false
    for (let i = 0; i < dishes.length; i++) {
        setDishesObjectValue(i, 'in-cart', false);
    }
}


function showFinalDialog() {    // shows the final dialog
    dialogBox = getElement('dialog-box');
    dialogBox.innerHTML = '';
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