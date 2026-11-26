const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;
const PINCODE_PATTERN = /^\d{6}$/;

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value || '').trim());
}

export function validatePassword(value) {
  const password = String(value || '');
  const valid = password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);

  return {
    valid,
    message: valid ? '' : 'Use at least 8 characters, including a letter and a number.',
  };
}

export function validateSignup(data = {}) {
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const password = String(data.password || '');
  const confirm = String(data.confirm || '');
  const errors = {};

  if (name.length < 2 || name.length > 60) {
    errors.name = 'Name must contain between 2 and 60 characters.';
  }
  if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!validatePassword(password).valid) {
    errors.password = validatePassword(password).message;
  }
  if (confirm !== password) {
    errors.confirm = 'Your passwords do not match.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateAddress(address = {}) {
  const errors = {};
  const requiredFields = ['name', 'phone', 'line1', 'city', 'state'];

  requiredFields.forEach((field) => {
    if (!String(address[field] || '').trim()) {
      errors[field] = 'This field is required.';
    }
  });

  if (address.phone && !PHONE_PATTERN.test(String(address.phone).trim())) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  }
  if (address.pincode && !PINCODE_PATTERN.test(String(address.pincode).trim())) {
    errors.pincode = 'Enter a valid 6-digit PIN code.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
