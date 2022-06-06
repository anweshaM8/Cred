const cron = require('node-cron');
const UtilityController = require('../controller/UtilityController');
const CronController = require('../controller/CronController');
const TestController = require('../controller/TestController');
//const croncontroller=Controller('cron');

const cornExp = {
    everySecond: () => { return '* * * * * *' },                                 //Run the task every second
    everyMinute: () => { return '* * * * *' },                                   //Run the task every minute
    everyFiveMinutes: () => { return '*/5 * * * *' },                                 //Run the task every five minutes
    everyTenMinutes: () => { return '*/10 * * * *' },                                //Run the task every ten minutes
    everyFifteenMinutes: () => { return '*/15 * * * *' },                                //Run the task every fifteen minutes
    everyThirtyMinutes: () => { return '*/30 * * * *' },                                //Run the task every thirty minutes
    hourly: () => { return '0 * * * *' },                                   //Run the task every hour
    hourlyAt: (at = 17) => { return `*/${at} */1 * * *` },                    //Run the task every hour at 17 mins past the hour
    daily: () => { return '0 0 * * *' },                                  //Run the task every day at midnight
    dailyAt: (at = 16) => { return `0 ${at} * * *` },                          //Run the task every day at 13:00
    twiceDaily: (at = '1,13') => { return `0 ${at} * * *` },                      //Run the task daily at 1:00 & 13:00
    weekly: () => { return '0 0 * * 0' },                                   //Run the task every week
    weeklyOn: (day = 1, hr = 8, mn = 0) => { return `${mn} ${hr} * * ${day}` },       //Run the task every week on Monday at 8:00
    monthly: () => { return '0 4 1 * *' },                                   //Run the task every month min,hr,day,month
    monthlyOn: (month = 1, hr = 1, mn = 0) => { return `${mn} ${hr} * ${month} *` },  //Run the task every month on the 1st at 6:00
    quarterly: () => { return '0 0 1 */4 *' },                                 //Run the task every quarter
    yearly: () => { return '0 0 1 1 *' },                                    //Run the task every year  
    firstDayOfMonth: () => { return '0 0 1 * *' },                             //Run the task 1 day of the month
    monToFriEveryHourFromTenToEight : () => { return '0 4-14 * * 1-5' }        //Run the task At minute 0 past every hour from 10 through 20 on every day-of-week from Monday through Friday.                 
}

module.exports = {

    exp: cornExp,
 
    run: (command, expression, message, type) => {
        cron.schedule(expression, () => {
            switch (type) {
                case 'everySecond':                                
                    console.log('everySecond');
                    break;
                case 'everyMinute':
                    console.log('everyMinute23');
                    UtilityController.monthly_invoice();
                    break;
                case 'everyFiveMinutes':
                    UtilityController.monthly_invoice();
                    console.log('everyFiveMinutes');
                    break;
                case 'everyTenMinutes':
                    console.log('everyTenMinutes');
                    break;
                case 'everyFifteenMinutes':
                    console.log('everyFifteenMinutes');
                    break;
                case 'everyThirtyMinutes':
                    console.log('everyThirtyMinutes');
                    break;
                case 'hourly':
                    break;
                case 'hourlyAt':
                    console.log('hourlyAt');
                    break;
                case 'daily':
                    //croncontroller.fnname();
                    console.log('daily');
                    break;
                case 'dailyAt':
                    //generateCreditReport();
                    console.log('dailyAtHelper');
                    UtilityController.monthly_invoice();
                    break;
                case 'twiceDaily':
                    console.log('twiceDaily');
                    break;
                case 'weekly':
                    console.log('weekly');
                    break;
                case 'weeklyOn':
                    console.log('weeklyOn');
                    break;
                case 'monthly':
                    console.log('monthly');
                    UtilityController.monthly_invoice();
                    break;
                case 'monthlyOn':
                    console.log('monthlyOnHelper');
                    //UtilityController.monthly_invoice();
                    break;
                case 'quarterly':
                    console.log('quarterly');
                    break;
                case 'yearly':
                    console.log('yearly');
                    break;
                case 'firstDayOfMonth':
                    break;
                case 'monToFriEveryHourFromTenToEight':
                    console.log('At minute 0 past every hour from 10 through 20 on every day-of-week from Monday through Friday.')
                    CronController.updateProbeStatus();
                    break;
                default:
                    console.log('no action in default');
            }

            console.info(message || `cron runs on ${new Date().toISOString()}`);
        })
    }
}

