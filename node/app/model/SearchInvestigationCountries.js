const bookshelf = Config('database');

module.exports = bookshelf.model('SearchInvestigationCountries', {

    hasTimestamps: true,

    tableName: process.env.TABLE_PREFIX + 'search_investigation_countries',

    country: function(){
        return this.hasOne(Model('SearchInvestigation'),'country_id')
    },
    
    createData: async function (formData) {
        return await this.save(formData);
    },
    fetchOne: async function (field, value) {
        return await this.where(`${field}`, `${value}`).fetch({ withRelated: [] });
    },
    fetchAllData: async function () {
        return await this.fetchAll(Object.assign(
            { withRelated: ["country"]  }));
    },
    fetchPageData: async function (limit, page) {
        return await this.fetchPage(Object.assign(
            { withRelated: ["country"]  },
            { pageSize: limit, page: page }
        ));
    }

});