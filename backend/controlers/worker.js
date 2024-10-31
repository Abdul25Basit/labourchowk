const Worker = require("../model/worker");
const ErrorHandler = require("../utils/errorHandlers");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

// Register new Worker
exports.registerWorker = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    addressOne,
    addressTwo,
    pinCode,
    city,
    state,
    wage,
    workType,
    adharNo,
    contactNo,
    password,
  } = req.body;
  
  const worker = await Worker.create({
    firstName,
    lastName,
    dateOfBirth,
    addressOne,
    addressTwo,
    pinCode,
    city,
    state,
    wage,
    workType,
    adharNo,
    contactNo,
    password,
  });

  res.render("labourprofile", {
    firstName: worker.firstName,
    lastName: worker.lastName,
    addressOne: worker.addressOne,
    addressTwo: worker.addressTwo,
    pinCode: worker.pinCode,
    wage: worker.wage,
    city: worker.city,
    state: worker.state,
    workType: worker.workType,
    adharNo: worker.adharNo,
    contactNo: worker.contactNo,
  });
});

// Login Worker
exports.loginWorker = catchAsyncErrors(async (req, res, next) => {
  const { contactNo, password } = req.body;

  if (!contactNo || !password) {
    return next(new ErrorHandler("Please enter a correct contact number and password", 400));
  }

  const worker = await Worker.findOne({ contactNo }).select("+password");
  if (!worker) {
    return next(new ErrorHandler("Invalid contact number or password", 401));
  }

  const isPasswordMatched = await worker.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid password", 401));
  }

  res.render("labourprofile", {
    firstName: worker.firstName,
    lastName: worker.lastName,
    addressOne: worker.addressOne,
    addressTwo: worker.addressTwo,
    pinCode: worker.pinCode,
    city: worker.city,
    state: worker.state,
    wage: worker.wage,
    workType: worker.workType,
    adharNo: worker.adharNo,
    contactNo: worker.contactNo,
  });
});
