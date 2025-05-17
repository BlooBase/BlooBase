    const isPasswordStrong = (password) => {
    const minLength = /.{8,}/;
    const hasNumber = /[0-9]/;
    const hasUpperCase = /[A-Z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) {
        console.log("Password must be at least 8 characters long.");
        return false;
    }
    if (!hasNumber.test(password)) {
        console.log("Password must contain at least one number.");
        return false;
    }
    if (!hasUpperCase.test(password)) {
        console.log("Password must contain at least one uppercase letter.");
        return false;
    }
    if (!hasSpecialChar.test(password)) {
        console.log("Password must contain at least one special character.");
        return false;
    }
    return true;
};

module.exports = { isPasswordStrong };