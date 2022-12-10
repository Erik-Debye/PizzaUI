'use strict';

//Will need following
//#1. A Customer class containing name, address, phone number, comments
//      [Initialized with no values]
//#2. A Pizza class containing size, and toppings (array)
//#3. An Order Class merging the two. Customer Object imported directly & Pizza objects imported into "pizzas" array

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

  updateMethod(method) {
    this.method = method;
  }
  updateAddress(street, street2, city, state, zipcode) {
    this.customer.street = street;
    this.customer.street2 = street2;
    this.customer.city = city;
    this.customer.state = state;
    this.customer.zipcode = zipcode;
  }
}

//controller
(function () {
  //save order
  let order = orderInit();

  //set up stage 2 (pizza creation)
  document.querySelector('#ready').addEventListener('click', (_) => {
    createPizza(order);
  });
})();

/**
 * Update local Storage
 */
function updateLocalStorage(order) {
  localStorage.setItem('storedOrder', JSON.stringify(order));
}

/**
 * Fn for stage 1, starting an order
 */
function orderInit() {
  //create order in local storage

  //1.Clear previous order
  localStorage.removeItem('order');
  //create order
  let order = new Order();
  //set current order
  updateLocalStorage(order);

  //add event lisener to start btn -> disable btn -> unhide method selection
  document.querySelector('#startOrder').addEventListener('click', (_) => {
    document.querySelector('#startOrder').disabled = 'true';

    document.querySelector('#method').classList.remove('hidden');
  });

  //add listener to method
  document.querySelector('#method').addEventListener('click', (event) => {
    //firgure out which button they clicked
    const button = event.target.closest('button');

    //if delivery
    if (button.id === 'delivery') {
      //update order
      order.updateMethod('delivery');
      updateLocalStorage(order);
      //if button is showing, hide button
      //if user clicks pickup -> delivery
      if (!document.querySelector('#ready').classList.contains('hidden')) {
        document.querySelector('#ready').classList.add('hidden');
      }
      //show form
      document.querySelector('#form').classList.remove('hidden');

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
          document.querySelector('#ready').classList.remove('hidden');
        }
      });
      //if pickup
    } else if (button.id === 'pickup') {
      //update method
      order.updateMethod('pickup');
      //remove address
      updateLocalStorage(order);
      //show button -> ready for stage 2
      document.querySelector('#ready').classList.remove('hidden');
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
  const target = event.target;

  if (target.validity.valid === false) {
    if (!target.closest('fieldset').querySelector('.error')) {
      target
        .closest('fieldset')
        .insertAdjacentHTML('beforeend', `<span class="error">${target.validationMessage}</span>`);
    }
  } else {
    target.closest('fieldset').querySelector('.error').remove();
  }
}

/**
 * Validate Address form on submit
 */
function AddressValidation(form) {
  //grab all input elements in the form
  const formInputs = form.querySelectorAll('input');
  //rotate through, return false if not valid
  formInputs.forEach((input) => {
    if (!input.checkValidity()) {
      return false;
    }
  });

  //if here, all inputs are valid
  return true;
}

/**Create the pizza stage */
function createPizza(order) {
  //Empty the page of the init
  // document.querySelector('#init-wrapper').classList.add('hidden');
  // document.querySelector('#pizza-wrapper').classList.remove('hidden');
}
