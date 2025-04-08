const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const address = document.getElementById('address');
const ccnumber = document.getElementById('ccnumber');
const expiry = document.getElementById('expiry');
const cvv = document.getElementById('cvv');

form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateInputs()) {
        alert("Form submitted successfully!");
        form.reset();

        document.querySelectorAll('.input-control').forEach(control => {
            control.classList.remove('success');
        });
    }
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validateInputs = () => {
    let isValid = true;

    const usernameValue = username.value.trim();
    if (usernameValue === '') {
        setError(username, 'Full Name is required');
        isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(usernameValue)) {
        setError(username, 'Only alphabets and spaces allowed');
        isValid = false;
    } else {
        setSuccess(username);
    }

    const emailValue = email.value.trim();
    if (emailValue === '') {
        setError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Please enter a valid email address');
        isValid = false;
    } else {
        setSuccess(email);
    }

    const phoneValue = phone.value.trim();
    if (phoneValue === '') {
        setError(phone, 'Phone number is required');
        isValid = false;
    } else if (!/^\d{10,15}$/.test(phoneValue)) {
        setError(phone, 'Phone number must be 10–15 digits');
        isValid = false;
    } else {
        setSuccess(phone);
    }

    const addressValue = address.value.trim();
    if (addressValue === '') {
        setError(address, 'Address is required');
        isValid = false;
    } else {
        setSuccess(address);
    }

    const ccValue = ccnumber.value.trim();
    if (ccValue === '') {
        setError(ccnumber, 'Credit card number is required');
        isValid = false;
    } else if (!/^\d{16}$/.test(ccValue)) {
        setError(ccnumber, 'Credit card must be exactly 16 digits');
        isValid = false;
    } else {
        setSuccess(ccnumber);
    }

    const expiryValue = expiry.value;
    if (!expiryValue) {
        setError(expiry, 'Expiry date is required');
        isValid = false;
    } else {
        const [year, month] = expiryValue.split('-').map(Number);
        const expiryDate = new Date(year, month - 1);
        const now = new Date();
        now.setDate(1); 
        now.setHours(0, 0, 0, 0);

        if (expiryDate <= now) {
            setError(expiry, 'Expiry must be a future date');
            isValid = false;
        } else {
            setSuccess(expiry);
        }
    }

    
    const cvvValue = cvv.value.trim();
    if (cvvValue === '') {
        setError(cvv, 'CVV is required');
        isValid = false;
    } else if (!/^\d{3}$/.test(cvvValue)) {
        setError(cvv, 'CVV must be exactly 3 digits');
        isValid = false;
    } else {
        setSuccess(cvv);
    }

    return isValid;
};
