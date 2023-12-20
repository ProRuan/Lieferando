// Variables
let counter = 0;    // needed for the function closeDialogIf()


// Functions
function showDialog(i) {    // shows the dialog with the content of dish card i
    openDialog();
    addOverflowYHidden();
    showDialogBox(i);
}


function openDialog() {    // opens the dialog
    let dialog = getElement('dialog');
    dialog.show();
}


function addOverflowYHidden() {    // adds overflow-y:hidden to the element 'body'
    body.classList.add('overflowY-hidden');
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
    return `
        <div class="dialog-box-header display-between-center">
            <h2 class="dialog-box-headline">${getTitle(i)}</h2>
            <button id="dialog-box-close-button" class="dialog-box-close-button" onclick="closeDialog()"></button>
        </div>
    `;
}


function closeDialog() {    // closes the dialog
    resetDialogContent();
    removeOverflowYHidden();
    let dialog = getElement('dialog');
    dialog.close();
}


function resetDialogContent() {    // resets the dialog's content
    let output = selectOutput('dialog-box');
    output.innerHTML = '<!-- rendering content of dialog box -->';
}


function removeOverflowYHidden() {    // removes overflow-y:hidden from the element 'body'
    body.classList.remove('overflowY-hidden');
}


function closeDialogIf(id) {    // closes the dialog on one condition
    if (id == 'dialog-box') {    // if the clicked element is 'dialog-box' ...
        counter = 3;    // increase counter to keep the dialog box open
    }
    if (--counter < 1) {    // if counter equals 0 ...
        closeDialog();    // close dialog
        counter = 1;    // set counter = 1
    }
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
    return `
        <div class="dialog-box-description column-start-start">
            <p class="dialog-box-ingredients">${getDescription(i)}</p>
            <span class="dialog-box-price"><output id="dialog-box-price">${getDecimalPrice(i)}</output> €</span>
        </div>
    `;
}


function writeDialogBoxOption(i) {    // writes the option of dialog box
    return `
        <div class="dialog-box-option">
            <div class="dialog-box-option-text">Ihre Option:</div>
            <div class="dialog-box-option-group display-between-center">
                <span>${getOption(i)} (+ <output id="dialog-box-option-price">${getDecimalUpcharge(i)}</output> €)</span>
                <button id="option-button" class="option-button" onclick="setOptionSelected(${(i)})">Auswählen</button>
            </div>
        </div>
    `;
}


function getDecimalUpcharge(i) {    // provides the upcharge of dish i as formatted decimal number
    let upchargeUnformatted = getUpcharge(i);    // contains the upcharge of dish i
    let upcharge = upchargeUnformatted.toFixed(2);    // contains a String number with 2 decimals
    return upcharge.replace('.', ',');    // outputs the upcharge with comma
}


function getUpcharge(i) {    // provides the upcharge of dish i
    return dishes[i]['upcharge'];
}


function setOptionSelected(i) {    // sets 'option-selected' of dish i and related settings
    let optionSelected = getOptionSelected(i);    // contains true or false
    if (optionSelected) {    // if true ...
        setOptionSettingsFalse(i);    // deselect option
    } else {    // else ...
        setOptionSettingsTrue(i);    // add option
    }
    save();
    updateTotalPriceDialog(i);
}


function getOptionSelected(i) {    // provides 'option-selected' from dish i
    return dishes[i]['option-selected'];
}


function setOptionSettingsFalse(i) {    // sets option related settings (false)
    dishes[i]['option-selected'] = false;
    let feedback = getElement('option-button');
    feedback.innerHTML = 'auswählen';
    feedback.classList.remove('option-button-activated');
}


function setOptionSettingsTrue(i) {    // sets option related settings (true)
    dishes[i]['option-selected'] = true;
    let feedback = getElement('option-button');
    feedback.innerHTML = 'aktiviert';
    feedback.classList.add('option-button-activated');
}


function updateTotalPriceDialog(i) {
    let amount = +document.getElementById('dialog-box-amount').innerHTML;
    let price = getPrice(i);
    let upcharge = 0;
    let optionSelected = getOptionSelected(i);
    if (optionSelected) {
        upcharge = getUpcharge(i);
    } else {
        upcharge = 0;
    }
    let totalPriceUnformatted = amount * (price + upcharge);
    let totalPrice = totalPriceUnformatted.toFixed(2)
    let output = document.getElementById('dialog-box-total-price');
    output.innerHTML = totalPrice.replace('.', ',');
}


function writeDialogBoxFooter(i) {
    return `
        <div class="dialog-box-footer display-start-center">
            <div class="dialog-box-amount-group display-between-center">
                <button id="dialog-box-plus-button" class="button" onclick="increaseItemDialog(${i})">+</button>
                <span id="dialog-box-item-amount" class="item-amount"><output id="dialog-box-amount">1</output></span>
                <button id="dialog-box-minus-button" class="button" disabled onclick="decreaseItemDialog(${i})">-</button>
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


function confirmAction(i) {
    addOrIncreaseItem(i);
    resetOptionSelected(i);
    closeDialog();
}


function addOrIncreaseItem(i) {
    let optionSelected = getOptionSelected(i);
    if (optionSelected) {
        let index = i + 1;
        let inCart = getInCart(index);
        if (inCart) {
            increaseOptionalItem(index);
        } else {
            addOptionalItem(index)
        }
    } else {
        let inCart = getInCart(i);
        if (inCart) {
            increaseItem(i);
        } else {
            addItem(i);
        }
    }
    sortItems();
    updateItemId();
    saveAndRender();
}


function increaseOptionalItem(index) {
    let amount = getAmountOfDialog();
    let totalPrice = getTotalPriceOfDialog();
    // let optionalId = getOptionalId(index);
    // shoppingCart[optionalId]['amount'] += amount;
    // shoppingCart[optionalId]['price'] += totalPrice;
    let itemId = getItemId(index);
    shoppingCart[itemId]['amount'] += amount;
    shoppingCart[itemId]['price'] += totalPrice;
}


function getAmountOfDialog() {
    return +document.getElementById('dialog-box-amount').innerHTML;
}


function getTotalPriceOfDialog() {
    let totalPriceUnformatted = document.getElementById('dialog-box-total-price').innerHTML;
    let totalPrice = Number(totalPriceUnformatted.replace(',', '.'));
    return totalPrice;
}


// function getOptionalId(index) {
//     return dishes[index]['option-id'];
// }

// getItemId() ... here!!!


function addOptionalItem(index) {
    let newIndex = getNewIndex();
    shoppingCart[newIndex] = {
        'dish-id': index,
        'amount': getAmountOfDialog(),
        'title': getTitle(index),
        'price': getTotalPriceOfDialog()
    };
    dishes[index]['in-cart'] = true;
    // dishes[index]['option-id'] = newIndex;
    dishes[index]['item-id'] = newIndex;
}


function increaseItem(i) {
    let amount = getAmountOfDialog();
    let totalPrice = getTotalPriceOfDialog();
    let itemId = getItemId(i);
    shoppingCart[itemId]['amount'] += amount;
    shoppingCart[itemId]['price'] += totalPrice;
}


function addItem(i) {
    let newIndex = getNewIndex();
    shoppingCart[newIndex] = {
        'dish-id': i,
        'amount': getAmountOfDialog(),
        'title': getTitle(i),
        'price': getTotalPriceOfDialog()
    };
    dishes[i]['in-cart'] = true;
    dishes[i]['item-id'] = newIndex;
}


function resetOptionSelected(i) {
    dishes[i]['option-selected'] = false;
}


function submitOrder() {
    let dialog = document.getElementById('dialog');
    dialog.show();
    emptyShoppingCart();
    resetInCart();
    saveAndRender();
    showFinalDialog();
    hideShoppingCart();
    setTimeout(closeDialog, 2500);
}


function showFinalDialog() {
    dialogBox = document.getElementById('dialog-box');
    dialogBox.innerHTML = '';
    writeOrderConfirmation(dialogBox);
}


function writeOrderConfirmation() {
    dialogBox.innerHTML = `
        <div class="dialog-box-header">
            <h2 class="dialog-box-headline ta-center">Vielen Dank, dass Sie Ruanizer nutzen!</h2>
        </div>
        <div class="dialog-box-description">
            <p class="dialog-box-ingredients ta-center">
                Wir werden Ihre Bestellung so rasch wie möglich bearbeiten!
            </p>
        </div>
    `;
}


function emptyShoppingCart() {
    shoppingCart = [];
}


function resetInCart() {
    for (let i = 0; i < dishes.length; i++) {
        dishes[i]['in-cart'] = false;
    }
}