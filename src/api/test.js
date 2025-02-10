// 1. Car Object with `this` usage
class Car {
  constructor(brand, model, year) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  getCarInfo() {
    return `${this.brand} ${this.model}`;
  }

  updateYear(newYear) {
    this.year = newYear;
  }

  displayInfo() {
    setTimeout(() => {
      console.log(`Car: ${this.getCarInfo()}, Year: ${this.year}`);
    }, 1000);
  }
}

const myCar = new Car("Toyota", "Camry", 2022);
myCar.displayInfo();

function modifyText(text, callback) {
  return callback(text);
}

const toLowerCase = (text) => text.toLowerCase();
const removeSpaces = (text) => text.toLowerCase();
const capitalizeWords = (text) =>
  text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
const addExclamation = (text) => text + "!";

function modifyNumber(num, callback) {
  return callback(num);
}

const doubleNumber = (num) => num * 2;
const halfNumber = (num) => num / 2;
const squareRoot = (num) => Math.sqrt(num);
const absoluteValue = (num) => Math.abs(num);

function transformArray(arr, callback) {
  return arr.map(callback);
}

const incrementNumbers = (num) => num + 1;
const negateNumbers = (num) => -num;
const modThree = (num) => num % 3;

function findInArray(arr, callback) {
  return arr.find(callback);
}

const firstEven = (num) => num % 2 === 0;
const greaterThanTen = (num) => num > 10;
const startsWithA = (word) => word.startsWith("A");

function processUserData(user, callback) {
  return callback(user);
}

const fullName = (user) => `${user.firstName} ${user.lastName}`;
const isAdult = (user) => user.age >= 18;
const maskEmail = (user) => {
  let parts = user.email.split("@");
  if (parts.length > 1) {
    return "*****@" + parts[1];
  }
  return u.email;
};

console.log(
  processUserData(
    {
      firstName: "John",
      lastName: "Doe",
      age: 25,
    },
    fullName
  )
);

console.log(
  processUserData({
    firstName: "John",
    lastName: "Doe",
    age: 25,
    email: "sadiq@gmail.com",
  })
);
