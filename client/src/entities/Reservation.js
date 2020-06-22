class Reservation{

    constructor(id, startingDay, endingDay, carCategory, driverAge, kmPerDay, extraDrivers,
                extraInsurance, price, user) {
        if(id){
            this.id = id;
        }

        this.startingDay = startingDay;
        this.endingDay = endingDay;
        this.carCategory = carCategory;
        this.driverAge = driverAge;
        this.kmPerDay = kmPerDay;
        this.extraDrivers = extraDrivers;
        this.extraInsurance = extraInsurance;
        this.price = price;
        this.user = user;
    }

}

export default Reservation
