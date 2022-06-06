const bookshelf = Config('database');

module.exports = bookshelf.model('Log', {

    hasTimestamps: false,

    tableName: process.env.TABLE_PREFIX + 'logs',

    createData: async function (formData) {
        return await this.save(formData);
    },
    fetchOne: async function (field, value) {
        return await this.where(`${field}`, `${value}`).fetch({ withRelated: "" });
    },
    fetchAllData: async function (fromDate, toDate) {
        return await this
            .query(function (qb) {
                qb.whereBetween('date', [fromDate, toDate]);
            })
            .orderBy('-id')
            .fetchAll(Object.assign(
                { withRelated: "" }));
    },
    fetchPageData: async function (limit, page) {
        return await this.fetchPage(Object.assign(
            { withRelated: "" },
            { pageSize: limit, page: page }
        ));
    }


});




