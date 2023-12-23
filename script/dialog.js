// Functions
function showDialog(i) {    // shows the dialog with the content of dish card i
    openDialog();
    setClassOnCommand('dialog', 'overflowY-hidden', 'add');
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
    let title = getJSONIndexValue(dishes, i, 'title');
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
    setClassOnCommand('body', 'overflowY-hidden', 'remove');
    hideDialog();
}


function resetDialogContent() {    // resets the dialog's content
    let comment = '<!-- rendering content of dialog box -->';
    outputValue('dialog-box', comment);
}


function resetOptionSelected() {    // resets 'option-selected' of dish i
    let index = getInnerHTMLValue('hidden-index');    // contains hidden index
    if (index > -1) {    // if index greater then -1
        setJSONIndexValue(dishes, index, 'object-selected', false);
    }
    save(dishes, 'dishes');
}


function getInnerHTMLValue(id) {    // provides the hidden index of dish i
    return +document.getElementById(id).innerHTML;
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
    let description = getJSONIndexValue(dishes, i, 'description');
    let price = getDecimal(dishes, i, 'price');
    return `
        <div class="dialog-box-description column-start-start">
            <p class="dialog-box-ingredients">${description}</p>
            <span class="dialog-box-price"><output id="dialog-box-price">${price}</output> €</span>
        </div>
    `;
}


function writeDialogBoxOption(i) {    // writes the option of dialog box
    let option = getJSONIndexValue(dishes, i, 'option')
    let upcharge = getDecimal(dishes, i, 'upcharge');
    return `
        <div class="dialog-box-option">
            <div class="dialog-box-option-text">Ihre Option:</div>
            <div class="dialog-box-option-group display-between-center">
                <span>${option} (+ <output id="dialog-box-option-price">${upcharge}</output> €)</span>
                <button id="option-button" class="option-button" onclick="setOptionSelected(${(i)})">Auswählen</button>
            </div>
        </div>
    `;
}


function setOptionSelected(i) {    // sets 'option-selected' of dish i and related settings
    let optionSelected = getJSONIndexValue(dishes, i, 'option-selected');    // contains true or false
    (optionSelected) ? setOptionSettingsFalse(i) : setOptionSettingsTrue(i);
    save(dishes, 'dishes');
    updateTotalPriceDialog(i);
}


function setOptionSettingsFalse(i) {    // sets option related settings (false)
    setJSONIndexValue(dishes, i, 'option-selected', false);
    outputValue('option-button', 'auswählen');
    setClassOnCommand('option-button', 'option-button-activated', 'remove');
}


function setOptionSettingsTrue(i) {    // sets option related settings (true)
    setJSONIndexValue(dishes, i, 'option-selected', true);
    outputValue('option-button', 'aktiviert');
    setClassOnCommand('option-button', 'option-button-activated', 'add');
}


function updateTotalPriceDialog(i) {    // updates the total price of the 'dialog-box-add-button'
    let amount = getInnerHTMLValue('dialog-box-amount');
    let price = getJSONIndexValue(dishes, i, 'price');
    let upcharge = setUpcharge(i);
    let totalPrice = amount * (price + upcharge);
    let totalPriceAsDecimal = formatAsDecimal(totalPrice);
    outputValue('dialog-box-total-price', totalPriceAsDecimal);
}


function setUpcharge(i) {    // sets the value of upcharge
    let optionSelected = getJSONIndexValue(dishes, i, 'option-selected');
    let upcharge = getJSONIndexValue(dishes, i, 'upcharge');
    return (optionSelected) ? upcharge : 0;    // return 0, if option is not selected
}


function selectOutput(id) {    // selects the element 'id' including innerHTML
    return document.getElementById(id).innerHTML;
}


function writeDialogBoxFooter(i) {    // writes the footer of dialog box
    let price = getDecimal(dishes, i, 'price');
    return `
        <div class="dialog-box-footer display-start-center">
            <div class="dialog-box-amount-group display-between-center">
                <button id="dialog-box-plus-button" class="button" onclick="increaseItemDialog(${i})">+</button>
                <span id="dialog-box-item-amount" class="item-amount"><output id="dialog-box-amount">1</output></span>
                <button id="dialog-box-minus-button" class="button" disabled onclick="decreaseItemDialog(${i})">-</button>
            </div>
            <button id="dialog-box-add-button" class="dialog-box-add-button" onclick="confirmAction(${i})">
                <span><output id="dialog-box-total-price">${price}</output> €</span>
            </button>
        </div>
    `;
}


function increaseItemDialog(i) {    // increases the item at the dialog box
    increaseAmountDialog();
    updateTotalPriceDialog(i);
    enableButtonIf('dialog-box-minus-button');
}


function increaseAmountDialog() {    // increases the amount of item at the dialog box
    let amount = getInnerHTMLValue('dialog-box-amount');
    outputValue('dialog-box-amount', ++amount);
}


function enableButtonIf(id) {
    let buttondisabled = getElement(id);    // contains the minus button of the dialog box
    if (buttondisabled) {    // if the minus button is disabled ...
        enableButton(id);    // enable minus button
    }
}


function enableButton(id) {    // enables a button
    document.getElementById(id).disabled = false;
}


function decreaseItemDialog(i) {    // decreases the item at the dialog box
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
        disableButton(id);    // disable minus button
    }
}


function disableButton(id) {    // disables a button
    document.getElementById(id).disabled = true;
}


function confirmAction(i) {    // confirms adding or increasing of items
    addOrIncreaseItemDialog(i);
    closeDialog(i);
}


function addOrIncreaseItemDialog(i) {
    let optionSelected = getJSONIndexValue(dishes, i, 'option-selected');    // contains true or false
    (optionSelected) ? addOrIncreaseUpgradedItem(i) : addOrIncreaseItemOriginalItem(i);
    sortUpdateSaveRender();
}


function addOrIncreaseUpgradedItem(i) {    // adds or increase an upgraded item
    let index = i + 1;    // increase i to get the index of upgraded item
    let inCart = getJSONIndexValue(dishes, index, 'in-cart');    // contains true or false
    (inCart) ? increaseUpgradedItem(index) : addUpgradedItem(index);
}


function increaseUpgradedItem(index) {    // increases the upgraded item in the shopping cart
    let amount = getInnerHTMLValue('dialog-box-amount');
    let totalPrice = getUnformattedNumber('dialog-box-total-price');
    let itemId = getJSONIndexValue(dishes, index, 'item-id');    // contains the item index of this dish
    setJSONIndexValue(shoppingCart, itemId, 'amount', amount);
    setJSONIndexValue(shoppingCart, itemId, 'price', totalPrice);
}


function addUpgradedItem(index) {    // adds an upgraded item including related settings
    let serial = getJSONLength(shoppingCart);
    addJSONObjectDialog(shoppingCart, serial, dishes, index);
    setJSONIndexValue(dishes, index, 'in-cart', true);
    setJSONIndexValue(dishes, index, 'item-id', serial);
}


function addJSONObjectDialog(variable, serial, master, index) {    // adds a new upgraded item to the shopping cart
    variable[serial] = {
        'dish-id': index,
        'amount': getInnerHTMLValue('dialog-box-amount'),
        'title': getJSONIndexValue(master, index, 'title'),
        'price': getUnformattedNumber('dialog-box-total-price')
    };
}


function addOrIncreaseItemOriginalItem(i) {    // adds or increase an original item
    let inCart = getJSONIndexValue(dishes, i, 'in-cart');    // contains true or false
    (inCart) ? increaseOriginalItem(i) : addOriginalItem(i);
}


function increaseOriginalItem(i) {    // increases the original item in the shopping cart
    let amount = getInnerHTMLValue('dialog-box-amount');
    let totalPrice = getUnformattedNumber('dialog-box-total-price');
    let itemId = getJSONIndexValue(dishes, i, 'item-id');
    increaseJSONIndexValue(shoppingCart, itemId, 'amount', amount);
    increaseJSONIndexValue(shoppingCart, itemId, 'price', totalPrice);
}


function addOriginalItem(i) {    // adds an original item including related settings
    let serial = getJSONLength(shoppingCart);
    addJSONObjectDialog(shoppingCart, serial, dishes, i);
    setJSONIndexValue(dishes, i, 'in-cart', true);
    setJSONIndexValue(dishes, i, 'item-id', serial);
}


function submitOrder() {    // opens the final dialog and resets all settings of the website
    openDialog();
    emptyJSON(shoppingCart);
    resetInCart();
    saveAndRender();
    showFinalDialog();
    hideShoppingCart();
    setTimeout(closeDialog, 3000);
}


function resetInCart() {    // sets 'in-cart' of all dishes to false
    for (let i = 0; i < dishes.length; i++) {
        setJSONIndexValue(dishes, i, 'in-cart', false);
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