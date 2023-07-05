const validator = {

    // Validate the username
    validateUsername: (username) => {
      if (!username) {
        return [
          {
            message: "Username is required",
          },
        ];
      }
  
      if (username.length < 3) {
        return [
          {
            message: "Username must be at least 3 characters long",
          },
        ];
      }
  
      return [];
    },
  
    // Validate the email address
    validateEmail: (email) => {
      if (!email) {
        return [
          {
            message: "Email is required",
          },
        ];
      }
  
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
      if (!regex.test(email)) {
        return [
          {
            message: "Invalid email address",
          },
        ];
      }
  
      return [];
    },
  
    // Validate the unique email address
    validateUniqueEmail: (email, existingUsers) => {
      if (!email) {
        return;
      }
  
      const user = existingUsers.find(u => u.email === email);
  
      if (user) {
        return [
          {
            message: "Email address already exists",
          },
        ];
      }
  
      return [];
    },
  
    // Validate the password
    validatePassword: (password) => {
      if (!password) {
        return [
          {
            message: "Password is required",
          },
        ];
      }
  
      if (password.length < 6) {
        return [
          {
            message: "Password must be at least 6 characters long",
          },
        ];
      }
  
      return [];
    },
    
    //validate newsPreferencesCategories
    validateNewsPreferences : (newsPreferences) => {
        if(!newsPreferences){
            return [
              {
                message: "News Preferences Category is required",
              },
            ];
          }    
          return [];
    }
  };

function 
  export default validator;