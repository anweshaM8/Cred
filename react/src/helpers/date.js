
let addDays = (days) => {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

let subDays = (days) => {
    this.setDate(this.getDate() - parseInt(days));
    return this;
};

let toTime = () => {
    return this.getTime();
};

let dateFormat = (dateValue, format = 'yyyy-mm-dd') => {
    var dateFormat = require('dateformat');
    return dateFormat(dateValue,format);
};

export const dateFormatHelper = {
	addDays,
    subDays,
    toTime,
    dateFormat
};