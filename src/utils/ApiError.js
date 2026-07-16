// Here we are extending from JS Error Class 
export default class ApiError extends Error {

    constructor(status, message) {

        super(message); // Inheritance of Parent class constructor

        this.status = status;

    }

}