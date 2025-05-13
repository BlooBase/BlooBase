const isPasswordStrong = (password) => {
    const minLength = /.{8,}/;
    const hasNumber = /[0-9]/;
    const hasUpperCase = /[A-Z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  
    return minLength.test(password) && hasNumber.test(password) && hasSpecialChar.test(password)&& hasUpperCase.test(password);
  };
  
  module.exports = { isPasswordStrong };
  
