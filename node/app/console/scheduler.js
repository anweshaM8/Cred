const schedule = Helper('schedule');

//schedule.run('test',schedule.exp.daily(),'cron for daily at 12 midnight','daily');
//schedule.run('test',schedule.exp.everyMinute(),'MINUTE','everyMinute');
//schedule.run('invoiceMin',schedule.exp.everyFiveMinutes(),'5min','minutegap');

//schedule.run('test',schedule.exp.dailyAt(),'Daily','dailyAt');
schedule.run('invoice',schedule.exp.monthly(),'MONTHLY','monthly');
schedule.run('updateapistatus',schedule.exp.monToFriEveryHourFromTenToEight(),'monToFriEveryHourFromTenToEight','monToFriEveryHourFromTenToEight');


