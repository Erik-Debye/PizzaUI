'use strict';
//Sample Structure Below
// Order {
//     customer : {
//         name: 'James Rake',
//         street: '453 Main St',
//         street2: '',
//         city: 'Chicago',
//         state: 'Illinois',
//         zipcode: '72322',
//         phone: '555-555-5555',
//         comments: 'Deliver to Side Door.'
//     }
//     pizzas: [
//         {
//             size : 12,
//             toppings : [
//                 sausage,
//                 basil,
//                 garlic,
//                 mushroom,
//                 tomato,
//                 olives,
//                 spinach
//             ],
//             sauce : 'white sauce'
//         },
//         {
//             size : 16,
//             toppings : [
//                 sausage,
//                 basil,
//                 olives,
//                 spinach
//             ],
//             sauce : 'olive oil'
//         }
//     ]
// }

//create class for orders
class Order {
  customer = {
    name: '',
    street: '',
    street2: '',
    city: '',
    state: '',
    zipcode: '',
    phone: '',
    comments: '',
  };
  items = [];
  //sample item
  // {
  //   size: '',
  //   toppings: [],
  //   sauce: '',
  // },
  method = '';
  cost = 0;
  tax = 0;

  updateMethod(method) {
    this.method = method;
  }
  updateCustomer(fname, lname, email, comments) {
    this.name = `${fname} ${lname}`;
    this.email = email;
    this.comments = comments;
  }
  updateAddress(street, street2, city, state, zipcode) {
    this.customer.street = street;
    this.customer.street2 = street2;
    this.customer.city = city;
    this.customer.state = state;
    this.customer.zipcode = zipcode;
  }
  addPizza(pizza) {
    this.items.push(pizza);
  }
  updateCost(price) {
    this.cost = price;
  }
  updateTax(tax) {
    this.tax = tax;
  }
}

//controller
(function () {
  //create order
  let order = new Order();
  //grabbing method of delivery
  order = orderInit(order);

  //set up stage 2 (pizza creation)
  document.querySelector('#ready').addEventListener('click', (_) => {
    order = createPizza(order);
  });

  document.querySelector('#form-delivery').addEventListener('submit', (event) => {
    event.preventDefault();
    let form = document.querySelector('#form-delivery');
    const data = new FormData(form);
    const map = new Map();
    const entries = data.entries();

    for (const [key, value] of entries) {
      map.set(key, value);
    }

    order.updateCustomer(map.get('fname'), map.get('lname'), map.get('email'), map.get('comments'));
  });

  document.querySelector('#form-pickup').addEventListener('submit', (event) => {
    event.preventDefault();
    let form = document.querySelector('#form-pickup');
    const data = new FormData(form);
    const map = new Map();
    const entries = data.entries();

    for (const [key, value] of entries) {
      map.set(key, value);
    }

    order.updateAddress(map.get('street'), map.get('street2'), map.get('city'), map.get('state'), map.get('zipcode'));
    order.updateCustomer(map.get('fname'), map.get('lname'), map.get('email'), map.get('comments'));
  });
})();

/**
 * Update local Storage
 */
function updateLocalStorage(order) {
  localStorage.setItem('storedOrder', JSON.stringify(order));
}

function addRemove(action, element) {
  if (action === 'add') {
    element.classList.add('hidden');
  } else {
    element.classList.remove('hidden');
  }
}

/**
 * Fn for stage 1, starting an order
 */
function orderInit(order) {
  //create order in local storage

  //1.Clear previous order
  localStorage.removeItem('storedOrder');
  //create order
  //set current order
  updateLocalStorage(order);

  const startBtn = document.querySelector('#startOrder');
  const methods = document.querySelector('#method');
  const readyBtn = document.querySelector('#ready');

  //add event lisener to start btn -> disable btn -> unhide method selection
  startBtn.addEventListener('click', (_) => {
    addRemove('add', startBtn);

    addRemove('remove', methods);
  });

  //add listener to method
  methods.addEventListener('click', (event) => {
    //firgure out which button they clicked
    const button = event.target.closest('button');

    //if delivery
    if (button.id === 'delivery') {
      //update order
      order.updateMethod('delivery');
      updateLocalStorage(order);
      //if button is showing, hide button
      //if user clicks pickup -> delivery
      if (!readyBtn.classList.contains('hidden')) {
        addRemove('add', readyBtn);
      }
      //show form
      addRemove('remove', document.querySelector('#form'));

      //validate form as user types
      form.addEventListener('input', (event) => {
        dynamicAdressValidation(event);
      });

      //check if all data is valid on submit
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        document.querySelector('#pickup').disabled = 'true';
        const valid = AddressValidation(form);

        //if valid -> show ready btn
        if (valid) {
          //update order with address
          //get all data
          const data = new FormData(form);
          //create an array
          const dataArr = Array.from(data.values());
          //use spread
          order.updateAddress(...dataArr);
          updateLocalStorage(order);
          addRemove('remove', readyBtn);
        }
      });
      //if pickup
    } else if (button.id === 'pickup') {
      //remove form (if user hits delivery -> pickup)
      if (!document.querySelector('#form').classList.contains('hidden')) {
        addRemove('add', document.querySelector('#form'));
      }
      //update method
      order.updateMethod('pickup');
      //remove address
      updateLocalStorage(order);
      //show button -> ready for stage 2
      addRemove('remove', readyBtn);
    } else {
      //error handling
      console.log('Hmm there was an error');
    }
  });

  return order;
}

/**
 * Fn to dynamically validate init address form
 * address only
 */
function dynamicAdressValidation(event) {
  //get the target element of the event
  const target = event.target;

  if (target.validity.valid === false) {
    //check if the fieldset already has an error message
    if (!target.closest('fieldset').querySelector('.error')) {
      //if not, insert an error message
      target
        .closest('fieldset')
        .insertAdjacentHTML('beforeend', `<span class="error">${target.validationMessage}</span>`);
    }
  } else {
    //if the input is valid & error exist, remove any error messages
    if (target.closest('fieldset').querySelector('.error')) {
      target.closest('fieldset').querySelector('.error').remove();
    }
  }
}

/**
 * Validate Address form on submit
 */
function AddressValidation(form) {
  //get all input elements in the form
  const formInputs = form.querySelectorAll('input');

  //loop over inputs and return false if any input is not valid
  for (const input of formInputs) {
    if (!input.checkValidity()) {
      return false;
    }
  }

  //if here, all inputs are valid
  return true;
}

/**Create the pizza stage */
function createPizza(order) {
  //get pizza wrapper and form elements
  const pizzaWrapper = document.querySelector('#pizza-wrapper');
  const pizzaForm = document.querySelector('#pizza-form');

  //hide init wrapper and show pizza wrapper
  addRemove('add', document.querySelector('#init-wrapper'));
  addRemove('remove', pizzaWrapper);

  //dynamically change cost with inputs
  pizzaForm.addEventListener('input', (_) => {
    order = calcCost(order, pizzaForm);
  });

  //add event listener to form
  pizzaForm.addEventListener('submit', (event) => {
    event.preventDefault();
    //validate form
    if (validatePizza(pizzaForm)) {
      //get form data and create pizza order
      const data = new FormData(pizzaForm);
      const pizza = createPizzaOrder(data);
      //add pizza to order and update local storage
      order.addPizza(pizza);
      updateLocalStorage(order);
      //reset or checkout
      order = resetOrCheckout(order);
      return order;
    }
  });
}

function validatePizza(form) {
  const sizeEl = form.querySelector('input[name="size"]');
  const sauceEl = form.querySelector('input[name="sauce"]');
  const checkedSize = form.querySelector('input[name="size"]:checked');
  const checkedSauce = form.querySelector('input[name="sauce"]:checked');

  if (checkedSize && checkedSauce) {
    if (checkedSize) {
      removeError(sizeEl);
    }
    if (checkedSauce) {
      removeError(sauceEl);
    }
    return true;
  } else {
    //if size
    if (!checkedSize) {
      const fieldset = sizeEl.closest('fieldset');
      fieldset.style.border = 'solid .2rem red';
      fieldset.insertAdjacentHTML(
        'afterbegin',
        `<p style="color: red; font-size:2rem; padding: 2rem;">Please enter a size!</p>`
      );
    }
    //if sauce
    if (!checkedSauce) {
      const fieldset = sauceEl.closest('fieldset');
      fieldset.style.border = 'solid .2rem red';
      fieldset.insertAdjacentHTML(
        'afterbegin',
        `<p style="color: red; font-size:2rem; padding: 2rem;">Please enter a sauce!</p>`
      );
    }
    return false;
  }
}

function removeError(element) {
  element.closest('fieldset').style.border = 'none';
  element.closest('fieldset').querySelector('p').remove();
}

/**
 * Validate Pizza Form
 */
function validatePizza(form) {
  const checkedSize = form.querySelector('input[name="size"]:checked');
  const checkedSauce = form.querySelector('input[name="sauce"]:checked');

  if (checkedSize && checkedSauce) {
    //remove error border
    document.querySelector('input[name="size"]').closest('fieldset').style.border = 'none';
    //remove error msg
    const sizeErr = document.querySelector('input[name="size"]').closest('fieldset').querySelector('p');
    if (sizeErr) {
      sizeErr.remove();
    }
    //remove error border
    document.querySelector('input[name="sauce"]').closest('fieldset').style.border = 'none';
    //remove error msg
    const sauceErr = document.querySelector('input[name="sauce"]').closest('fieldset').querySelector('p');
    if (sauceErr) {
      sauceErr.remove();
    }
    return true;
  } else {
    //if size
    if (!checkedSize) {
      const fieldset = document.querySelector('input[name="size"]').closest('fieldset');
      fieldset.style.border = 'solid .2rem red';
      fieldset.insertAdjacentHTML(
        'afterbegin',
        `<p style="color: red; font-size:2rem; padding: 2rem;">Please enter a size!</p>`
      );
    }
    //if sauce
    if (!checkedSauce) {
      const fieldset = document.querySelector('input[name="sauce"]').closest('fieldset');
      fieldset.style.border = 'solid .2rem red';
      fieldset.insertAdjacentHTML(
        'afterbegin',
        `<p style="color: red; font-size:2rem; padding: 2rem;">Please enter a sauce!</p>`
      );
    }
    return false;
  }
}

/**
 * Update Pizza Order
 */
function createPizzaOrder(data) {
  //convert FormData to map
  const dataMap = new Map();
  //get iterator for entries in data
  const entries = data.entries();

  //loop over data and add entries to map
  for (const [key, value] of entries) {
    if (dataMap.has(key)) {
      dataMap.get(key).push(value);
    } else {
      dataMap.set(key, [value]);
    }
  }

  //de-array size and sauce (but keep toppings as an array)
  dataMap.forEach((value, key) => {
    if (value.length === 1 && key !== 'toppings') {
      dataMap.set(key, value[0]);
    }
  });

  //convert dataMap into an object
  const pizza = Object.fromEntries(dataMap);
  return pizza;
}

function calcCost(order, form) {
  //create price & tax
  let price = 0;
  let premium = 0;
  const tax = 0.1;
  //convert form
  const pizzaData = new FormData(form);
  //create pizza (standerizes data)
  const pizza = createPizzaOrder(pizzaData);

  //calculate cost - size
  switch (pizza.size) {
    case '16': {
      price = 26;
      premium = 2;
      break;
    }
    case '18': {
      price += 29;
      premium = 2.75;
      break;
    }
    case '20': {
      price += 33;
      premium = 3.25;
      break;
    }
    default: {
      price += 38;
      premium = 3.75;
      break;
    }
  }

  //add toppings if they exists
  if (pizza.toppings) {
    pizza.toppings.forEach((topping) => {
      price += premium;
    });
  }

  //update order
  order.updateCost(price);
  order.updateTax(price * tax);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const priceStr = formatter.format(price);
  const priceTaxStr = formatter.format(price * 0.1 + price);

  document.querySelector('#price-regular').innerHTML = priceStr;
  document.querySelector('#price-tax').innerHTML = priceTaxStr;

  updateLocalStorage(order);
  return order;
}

function resetOrCheckout(order) {
  const pizzaCont = document.querySelector('#pizza-wrapper');
  const checkoutCont = document.querySelector('#checkout-wrapper');
  const customerCont = document.querySelector('#customer-wrapper');

  //show checkout container and hide pizza container
  addRemove('add', pizzaCont);
  addRemove('remove', checkoutCont);

  //add listener to reset button
  const resetButton = document.querySelector('#resetform');
  resetButton.addEventListener('click', (_) => {
    //reset form and hide checkout container
    document.querySelector('#pizza-form').reset();
    addRemove('add', checkoutCont);
    //show pizza container
    addRemove('remove', pizzaCont);
  });

  //add listener to checkout button
  const checkoutButton = document.querySelector('#checkout');
  checkoutButton.addEventListener('click', (_) => {
    //hide checkout container and show customer container
    addRemove('add', checkoutCont);
    addRemove('remove', customerCont);

    if (order.customer.street && order.customer.city && order.customer.state && order.customer.zipcode) {
      addRemove('remove', document.querySelector('#form-delivery'));
    } else {
      addRemove('remove', document.querySelector('#form-pickup'));
    }

    return order;
  });
}
