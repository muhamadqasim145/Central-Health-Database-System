const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._-]{2,29}$/i;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

export function validateUsername(value) {
  const username = typeof value === "string" ? value.trim() : "";
  if (!username) return "Enter a username.";
  if (username.length < 3 || username.length > 30) {
    return "Username must be between 3 and 30 characters.";
  }
  if (!USERNAME_PATTERN.test(username)) {
    return "Use letters, numbers, periods, underscores, or hyphens; start with a letter or number.";
  }
  return "";
}

export function validatePassword(value, { registration = false } = {}) {
  if (typeof value !== "string" || !value) return "Enter a password.";
  if (new TextEncoder().encode(value).length > 72) {
    return "Password must be 72 UTF-8 bytes or fewer.";
  }
  if (registration && value.length < 8) return "Password must be at least 8 characters.";
  return "";
}

export function validateLogin(input) {
  return {
    username: validateUsername(input?.username),
    password: validatePassword(input?.password),
  };
}

export function validateRegistration(input) {
  const name = typeof input?.name === "string" ? input.name.trim() : "";
  const password = typeof input?.password === "string" ? input.password : "";
  const confirmPassword = typeof input?.confirmPassword === "string" ? input.confirmPassword : "";
  const errors = {
    name: "",
    role: "",
    username: validateUsername(input?.username),
    password: validatePassword(password, { registration: true }),
    confirmPassword: "",
  };

  if (input?.role !== "DOCTOR" && input?.role !== "LAB") {
    errors.role = "Choose Doctor or Laboratory staff.";
  }

  if (!name) errors.name = "Enter your full name.";
  else if (name.length < 2 || name.length > 80 || CONTROL_CHARACTERS.test(name)) {
    errors.name = "Name must be 2 to 80 characters and contain no control characters.";
  }

  if (!confirmPassword) errors.confirmPassword = "Confirm your password.";
  else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";

  return errors;
}

export function hasValidationErrors(errors) {
  return Object.values(errors).some(Boolean);
}
