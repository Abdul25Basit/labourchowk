const User = require("../model/user");
const Worker = require("../model/worker");
const ErrorHandler = require("../utils/errorHandlers");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// Variable to store the current user
var currUser;

// Register new User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    addressOne,
    addressTwo,
    pinCode,
    city,
    state,
    contactNo,
    email,
    password,
  } = req.body;

  const user = await User.create({
    firstName,
    lastName,
    addressOne,
    addressTwo,
    pinCode,
    city,
    state,
    contactNo,
    email,
    password,
  });
  currUser = user;

  let queryUrl = {
    pinCode: pinCode * 1,
  };
  const apiFeatures = new ApiFeatures(Worker.find(), queryUrl)
    .search()
    .filter()
    .pagination(100);
  const workers = await apiFeatures.query;

  res.render("userprofile", {
    firstName: user.firstName,
    lastName: user.lastName,
    addressOne: user.addressOne,
    addressTwo: user.addressTwo,
    pinCode: user.pinCode,
    city: user.city,
    state: user.state,
    email: user.email,
    contactNo: user.contactNo,
    workers: workers,
  });
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { contactNo, password } = req.body;

  if (!contactNo || !password) {
    return next(new ErrorHandler("Please enter a correct Contact number and password", 400));
  }

  const user = await User.findOne({ contactNo }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid contact no. or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Password", 401));
  }
  currUser = user;

  let queryUrl = {
    pinCode: user.pinCode * 1,
  };

  const apiFeatures = new ApiFeatures(Worker.find(), queryUrl)
    .search()
    .filter()
    .pagination(100);
  const workers = await apiFeatures.query;

  res.render("userprofile", {
    firstName: user.firstName,
    lastName: user.lastName,
    addressOne: user.addressOne,
    addressTwo: user.addressTwo,
    pinCode: user.pinCode,
    city: user.city,
    state: user.state,
    email: user.email,
    contactNo: user.contactNo,
    workers: workers,
  });
});

// Get random workers near me
exports.getRandomWorker = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 400;

  let query_url = {};
  if (req.body.work_type && req.body.work_type.length > 2) {
    query_url.workType = req.body.work_type;
  }
  if (req.body.price) {
    query_url.wage = { lte: req.body.price * 1 };
  }
  if (req.body.pin_code) {
    query_url.pinCode = req.body.pin_code * 1;
  }

  const user = currUser;
  const apiFeatures = new ApiFeatures(Worker.find(), query_url)
    .search()
    .filter()
    .pagination(resPerPage);
  const workers = await apiFeatures.query;

  res.render("userprofile", {
    firstName: user.firstName,
    lastName: user.lastName,
    addressOne: user.addressOne,
    addressTwo: user.addressTwo,
    pinCode: user.pinCode,
    city: user.city,
    state: user.state,
    email: user.email,
    contactNo: user.contactNo,
    workers: workers,
  });
});
