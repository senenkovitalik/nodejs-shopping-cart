var stripe = Stripe('pk_test_M9uwKfwYmRg5cYNxjLQROdbt008dD0n03n');
var elements = stripe.elements();

var cardNumber = elements.create('cardNumber');
var cardExpiry = elements.create('cardExpiry');
var cardCvc = elements.create('cardCvc');

cardNumber.mount('#card-number');
cardExpiry.mount('#card-expiry');
cardCvc.mount('#card-cvc');

cardNumber.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
        displayError.style.display = 'block';
    } else {
        displayError.style.display = 'none';
    }
});

var form = document.getElementById('checkout-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();

    var cardholderName = document.getElementById('cardholder-name').value;
    stripe.createToken(cardNumber, {name: cardholderName}).then(function(result) {
        if (result.error) {
            var displayError = document.getElementById('card-errors');
            displayError.textContent = result.error.message;
            displayError.style.display = 'block';
        } else {
            stripeTokenHandler(result.token);
        }
    });
});

function stripeTokenHandler(token) {
    var form = document.getElementById('checkout-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    form.submit();
}