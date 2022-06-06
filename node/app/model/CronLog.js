const bookshelf = Config('database');

module.exports = bookshelf.model('CronLog', {

    hasTimestamps: true,

    tableName: process.env.TABLE_PREFIX + 'cron_logs',

    
    createData: async function (formData) {
        return await this.save(formData);
    },
    fetchOne: async function (field, value) {
        return await this.where(`${field}`, `${value}`).fetch({ withRelated: [] });
    },
    fetchAllData: async function () {
        return await this.fetchAll(Object.assign(
            { withRelated: []  }));
    },
    fetchPageData: async function (limit, page) {
        return await this.fetchPage(Object.assign(
            { withRelated: []  },
            { pageSize: limit, page: page }
        ));
    }

});