class Reservation{

    constructor(startingDay, endingDay, carCategory, driverAge, kmPerDay, extraDrivers, extraInsurance, price) {
        this.startingDay = startingDay;
        this.endingDay = endingDay;
        this.carCategory = carCategory;
        this.driverAge = driverAge;
        this.kmPerDay = kmPerDay;
        this.extraDrivers = extraDrivers;
        this.extraInsurance = extraInsurance;
        this.price = price;
    }

}

export default Reservation
