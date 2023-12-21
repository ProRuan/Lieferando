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
            <button id="dialog-box-close-button" class="dialog-box-close-button" onclick="closeDialog(${i})"></button>
        </div>
    `;
}


function closeDialog(i) {    // closes the dialog
    resetDialogContent();
    resetOptionSelected(i);
    removeOverflowYHidden();
    let dialog = getElement('dialog');
    dialog.close();
}


function resetDialogContent() {    // resets the dialog's content
    let output = selectOutput('dialog-box');
    output.innerHTML = '<!-- rendering content of dialog box -->';
}


function resetOptionSelected(i) {    // resets 'option-selected' of dish i
    dishes[i]['option-selected'] = false;
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
}    // funktioniert nicht mehr!!!


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
    let button = getElement('option-button');
    button.innerHTML = 'auswählen';
    button.classList.remove('option-button-activated');
}


function setOptionSettingsTrue(i) {    // sets option related settings (true)
    dishes[i]['option-selected'] = true;
    let button = getElement('option-button');
    button.innerHTML = 'aktiviert';
    button.classList.add('option-button-activated');
}


function updateTotalPriceDialog(i) {    // updates the total price of the 'dialog-box-add-button'
    let amount = getAmountOfDialog();
    let price = getPrice(i);
    let upcharge = setUpcharge(i);
    let totalPriceUnformatted = amount * (price + upcharge);    // contains the total price as number
    let totalPrice = totalPriceUnformatted.toFixed(2);    // contains the total price as String number with 2 decimals
    let output = selectOutput('dialog-box-total-price');    // contains the output element 'dialog-box-total-price'
    output = totalPrice.replace('.', ',');    // outputs total price with comma
}


function getAmountOfDialog() {    // provides the current amount of dish i at the dialog
    return +document.getElementById('dialog-box-amount').innerHTML;
}


function setUpcharge(i) {    // sets the value of upcharge
    let optionSelected = getOptionSelected(i);
    let upcharge = getUpcharge(i);
    return (optionSelected) ? upcharge : 0;    // return 0, if option is not selected
}


function selectOutput(id) {    // selects the element 'id' including innerHTML
    return document.getElementById(id).innerHTML;
}


function writeDialogBoxFooter(i) {    // writes the footer of dialog box
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


function increaseItemDialog(i) {    // increases the item at the dialog box
    increaseAmountDialog();
    updateTotalPriceDialog(i);
    enableButtonIf('dialog-box-minus-button');
}


function increaseAmountDialog() {    // increases the amount of item at the dialog box
    let output = selectOutput('dialog-box-amount');    // contains the output element
    let amount = +output;    // contains the amount
    output = ++amount;    // outputs amount + 1
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
    let output = selectOutput('dialog-box-amount');    /// contains the output element
    let amount = +output;    // contains the amount
    output = --amount;    // outputs amount - 1
}


function disableButtonIf(id) {
    let input = getElement('dialog-box-amount');    // contains the element 'dialog-box-amount'
    let amount = +input.innerHTML;    // contains the amount
    if (amount < 2) {    // if amount less than 2 ...
        disableButton(id);    // disable minus button
    }
}


function disableButton(id) {    // disables a button
    document.getElementById(id).disabled = true;
}


function confirmAction(i) {    // confirms adding or increasing of items
    addOrIncreaseItem(i);
    closeDialog(i);
}


function addOrIncreaseItem(i) {
    let optionSelected = getOptionSelected(i);    // contains true or false
    if (optionSelected) {    // if option is selected ...
        addOrIncreaseUpgradedItem(i);    // add or increase the upgraded item
    } else {    // else ...
        addOrIncreaseItemOriginalItem(i);    // add or increase the original item
    }
    sortItems();
    updateItemId();
    saveAndRender();
}


function addOrIncreaseUpgradedItem(i) {    // adds or increase an upgraded item
    let index = i + 1;    // increase i to get the index of upgraded item
    let inCart = getInCart(index);    // contains true or false
    (inCart) ? increaseUpgradedItem() : addUpgradedItem();
}


function increaseUpgradedItem(index) {    // increases the upgraded item in the shopping cart
    let amount = getAmountOfDialog();
    let totalPrice = getTotalPriceOfDialog();
    let itemId = getItemId(index);    // contains the item index of this dish
    shoppingCart[itemId]['amount'] += amount;    // increases the amount of upgraded item
    shoppingCart[itemId]['price'] += totalPrice;    // increases the total price of upgraded item
}


function getTotalPriceOfDialog() {    // provides the total price of item from the dialog box
    let totalPriceUnformatted = selectOutput('dialog-box-total-price');    // contains the total price as String
    return Number(totalPriceUnformatted.replace(',', '.'));    // contains the total price as number
}


function addUpgradedItem(index) {    // adds an upgraded item including related settings
    let newIndex = getNewIndex();
    addNewUpgradedItem(index);
    setInCartTrue(index);
    setItemId(index, newIndex);
}


function addNewUpgradedItem(newIndex) {    // adds a new upgraded item to the shopping cart
    shoppingCart[newIndex] = {
        'dish-id': index,
        'amount': getAmountOfDialog(),
        'title': getTitle(index),
        'price': getTotalPriceOfDialog()
    };
}


function addOrIncreaseItemOriginalItem(i) {    // adds or increase an original item
    let inCart = getInCart(i);    // contains true or false
    (inCart) ? increaseOriginalItem(i) : addOriginalItem(i);
}


function increaseOriginalItem(i) {    // increases the original item in the shopping cart
    let amount = getAmountOfDialog();
    let totalPrice = getTotalPriceOfDialog();
    let itemId = getItemId(i);
    shoppingCart[itemId]['amount'] += amount;    // increases the amount of original item
    shoppingCart[itemId]['price'] += totalPrice;    // increases the amount of orignial item
}


function addOriginalItem(i) {    // adds an original item including related settings
    let newIndex = getNewIndex();
    addNewOriginalItem(i, newIndex);
    setInCartTrue(i);
    setItemId(i, newIndex);
}


function addNewOriginalItem(i, newIndex) {    // adds a new original item to the shopping cart
    shoppingCart[newIndex] = {
        'dish-id': i,
        'amount': getAmountOfDialog(),
        'title': getTitle(i),
        'price': getTotalPriceOfDialog()
    };
}


function submitOrder() {    // opens the final dialog and resets all settings of the website
    openDialog();
    emptyShoppingCart();
    resetInCart();
    saveAndRender();
    showFinalDialog();
    hideShoppingCart();
    setTimeout(closeDialog, 2500);
}


function emptyShoppingCart() {    // empties the shopping cart
    shoppingCart = [];
}


function resetInCart() {    // sets 'in-cart' of all dishes to false
    for (let i = 0; i < dishes.length; i++) {
        dishes[i]['in-cart'] = false;
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
            <h2 class="dialog-box-headline ta-center">Vielen Dank, dass Sie Ruanizer nutzen!</h2>
        </div>
        <div class="dialog-box-description">
            <p class="dialog-box-ingredients ta-center">
                Wir werden Ihre Bestellung so rasch wie möglich bearbeiten!
            </p>
        </div>
    `;
}