const translationArrays = require('./translationArrays');
const priceTable = require('./priceTable');
const moment = require('moment');

exports.checkReservationData = (reservation) => {
    const startingDay = moment(reservation.startingDay);
    const endingDay = moment(reservation.endingDay);

    const datesOk = endingDay.isAfter(startingDay);
    const carCategoryOk = translationArrays.carCategoryArray.includes(reservation.carCategory);
    const driversAgeOk = translationArrays.driverAgeArray.includes(reservation.driverAge);
    const kmPerDayOk = translationArrays.kmPerDayArray.includes(reservation.kmPerDay);
    const extraDriversOk = reservation.extraDrivers >= 0;

    return datesOk && carCategoryOk && driversAgeOk && kmPerDayOk && extraDriversOk;
}

exports.checkPaymentData = (paymentData ,reservation, serverPriceData) => {
    const priceOk = serverPriceData["totalPrice"] === reservation["price"];
    const creditCardOk = paymentData["creditCardNumber"].length === 16;
    const cvvOk = paymentData["cvv"].length === 3;
    return priceOk && creditCardOk && cvvOk;
}

exports.calculatePrice = (reservation, carsForCategory, nonValidCars, userReservations) => {
    const duration = calculateDuration(reservation)
    const basePrice = priceTable.priceTable.category[parseInt(reservation.carCategory)] * duration;
    const kmFee = basePrice * priceTable.priceTable.km[parseInt(reservation.kmPerDay)];
    const ageFee = basePrice * priceTable.priceTable.age[parseInt(reservation.driverAge)];
    const extraDriversFee = basePrice * (reservation.extraDrivers === "0" ? 0 : priceTable.priceTable.extraDrivers);
    const extraInsuranceFee = basePrice * (reservation.extraInsurance ? priceTable.priceTable.extraInsurance : 0);
    const availableCars = carsForCategory - nonValidCars;
    const fewVehiclesFee = basePrice * ((100 * availableCars / carsForCategory) <= 10 ? priceTable.priceTable.less10Vehicles : 0);
    let frequentCustomerFee = 0;
    if (userReservations.length !== 0){
        const pastReservations = userReservations.filter((reservation) => {
            const today = moment().format("YYYY-MM-DD");
            return moment(reservation.endingDay).isBefore(today);
        })
        if (pastReservations.length >= 3)
            frequentCustomerFee = basePrice * priceTable.priceTable.frequentCustomer;
    }

    const totalPrice = basePrice + kmFee + ageFee + extraDriversFee + extraInsuranceFee + fewVehiclesFee + frequentCustomerFee;

    //will be used to show the detail of the totalPrice
    //converted into strings because i'm using only strings data as a standard
    return {
        duration : duration,
        numberOfAvailableCars: (carsForCategory - nonValidCars)+"",
        totalPrice : totalPrice+"",
        fees : {
            basePrice: basePrice+"",
            kmFee: kmFee+"",
            ageFee: ageFee+"",
            extraDriversFee: extraDriversFee+"",
            extraInsuranceFee: extraInsuranceFee+"",
            fewVehiclesFee : fewVehiclesFee+"",
            frequentCustomerFee : frequentCustomerFee+""
        }
    }
}

const calculateDuration = (reservation) => {
    const a = moment(reservation.startingDay);
    const b = moment(reservation.endingDay);
    //converted into strings because i'm using only strings data as a standard
    //+1 because commonly we say 1 day rental even if we return it on the same day and so on...
    return b.diff(a, 'days') + 1 + "";
}

