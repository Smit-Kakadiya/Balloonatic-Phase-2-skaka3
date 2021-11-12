var express = require('express');
var app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use('/public', express.static('public'));
const fs = require("fs");
const path = require("path");
app.set("views", path.join(__dirname, "views"));

// Cookie Implemented
const cookieParser = require("cookie-parser");
const cookieEncrypter = require("cookie");
const secretKey = "smitkakadiyasmitkakadiya";
const cookieParams = {
  httpOnly: true,
  signed: true,
  sameSite: "none",
  secure: true,
};
app.use(cookieParser(secretKey));

// Define Authorized and auth with cookies
let authorized = false;
const auth = function (req, res, next) {

  if (req.path == "/login" || req.path == "/register") {
    return next();
  }

  if (req.signedCookies.cookie && req.signedCookies.cookie.auth) {
    authorized = true;
    return next();
  } else {
    authorized = false;
    return next();
  }
};
app.use(auth);

// Home page
app.get('/', function(req, res) {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "balloonatic-quotes.json")
  );
  let quotes = JSON.parse(rawdata);
  res.render("home", { data: quotes.quotes, authorized: authorized });
});

// About page
app.get("/about", (req, res) => {
  res.render("about", { authorized: authorized });
});

// Contact page
app.get("/contact", (req, res) => {
  res.render("contact", { authorized: authorized });
});

// Contact Post Method
app.post("/homee", (req, res) => {
  res.redirect("/");
});

// Product page
app.get("/products", (req, res) => {
  res.render("products", { authorized: authorized });
});

// Registration page
app.get("/register", (req, res) => {
  res.render("register", { error: [], authorized: authorized });
});

// Registration Process
app.post("/register", (req, res) => {
  const smit = req.body;

  let email = smit.email;
  let password1 = smit.password1;
  let password2 = smit.password2;
  let firstName = smit.firstName;
  let lastName = smit.lastName;
  let address = smit.address;
  let city = smit.city;
  let state = smit.state;
  let postalCode = smit.postalCode;
  let phone = smit.phone;

  if (!email) {
    return res.render("register", {
      error: [{ parameter: "Error", message: "Email address is mandatory." }],
      smit,
      authorized: authorized
    });
  }

  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
    return res.render("register", {
      error: [{ parameter: "Error", message: "Format of email address is invalid." }],
      smit,
      authorized: authorized 
    });
  }


  if (!password1) {
    return res.render("register", {
      error: [{ parameter: "Error", message: "Password is mandatory." }],
      smit,
      authorized: authorized
    });
  }

  if (!password2) {
    return res.render("register", {
      error: [{ parameter: "Error", message: "Confirm password is mandatory." }],
      smit,
      authorized: authorized
    });
  }

  if (!firstName) {
    return res.render("register", {
      error: [{ parameter: "Error", message: "First name is mandatory." }],
      smit,
      authorized: authorized
    });
  }

  if (!lastName) {
    return res.render("register", {
      error: [{ parameter: "Error", message: "Last name is mandatory." }],
      smit,
      authorized: authorized
    });
  }

  if (password2 != password1) {
    return res.render("register", {      
      error: [
        { parameter: "Error", message: "Password and Confirm Password has to be same." },
      ],
      smit,
      authorized: authorized
    });
  }


  let jsonData = fs.readFileSync(
    path.resolve(__dirname, "balloonatic-users.json")
  );
  let user = JSON.parse(jsonData);
  
  for (let i = 0; i < user.users.length; i++) {
    if (user.users[i].email == email) {
      return res.render("register", {
        error: [{ parameter: "Error", message: "Email is already registered." }],
        smit,
        authorized: authorized
      });
    }
  }


  let obj = {
    users: user.users,
  };

  let arr = {
    email: email,
    password2: password2,
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    state: state,
    postalCode: postalCode,
    phone: phone
  };

  obj.users.push(arr);
  fs.writeFile("balloonatic-users.json", JSON.stringify(obj), function (err) {
    if (err) throw err;
  });
  res.redirect("/login");
});

// Login page
app.get("/login", (req, res) => {
  res.render("login", {error: [],  authorized: authorized });
});

// Logout process
app.get("/logout", (req, res) => {
  res.clearCookie("cookie");
  authorized = false; // Set authorized value false that illustrate process of logout is done.
  res.redirect("/");
});

// Login Process
app.post("/login", (req, res) => {
  const smitt = req.body;
  let email = smitt.email;
  let password2 = smitt.password2;
  if (!email) {
    return res.render("login", {
      layout: false,
      error: [{ parameter: "Error", message: "Email address is mandatory." }],
      smitt,
      authorized: authorized
    });
  }
  if (!password2) {
    return res.render("login", {
      layout: false,
      error: [{ parameter: "Error", message: "Password is mandatory." }],
      smitt,
      authorized: authorized
    });
  }
  let jsonData = fs.readFileSync(
    path.resolve(__dirname, "balloonatic-users.json")
  );
  let user = JSON.parse(jsonData);
  let flag = 0;
  for (let i = 0; i < user.users.length; i++) {
    if (user.users[i].email == email && user.users[i].password2 == password2) {
      flag = 1;
      break;
    }
  }
  if (flag) {
    let setCookie = {
      auth: true
    };
    res.cookie("cookie", setCookie, cookieParams);
    res.redirect("/");
  }
  else {
    return res.render("login", {
      layout: false,
      error: [{ parameter: "Error", message: "Email or Password is incorrect." }],
      smitt,
      authorized: authorized
    });
  }
});

// Balloon Products
app.get("/products", (req, res) => {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "balloonatic-products.json")
  );
  let products = JSON.parse(rawdata);
  console.log(products);
  res.render("products", { data: products});
});

// Ballon Category
app.get("/balloon-category", (req, res) => {
  let category = req.query.category;
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "balloonatic-products.json")
  );
  let updatedProducts = {
    products: []
  }
  let products = JSON.parse(rawdata);
  for(let i=0;i<products.products.length;i++)
  {
    if(products.products[i].category==category)
    {
      updatedProducts.products.push(products.products[i]);
    }
  }
  res.render("products", { data: updatedProducts, authorized: authorized });
});


// Page not found error
app.use((req, res, next) => {
  res.status(404).render('404', {authorized: authorized});
})

// General URL error
app.use((req, res, next) => {
  res.status(500).render('general_error', {authorized: authorized});
})

app.use((req, res, next) => {
  res.status(403).render('general_error', {authorized: authorized});
})

app.use((req, res, next) => {
  res.status(400).render('general_error', {authorized: authorized});
})
app.listen(8080);
console.log('Server is listening on port 8080');