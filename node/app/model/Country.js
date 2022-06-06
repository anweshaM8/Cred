
const bookshelf = Config('database');

module.exports = bookshelf.model('Country', {

    hasTimestamps: true,

    tableName: process.env.TABLE_PREFIX + 'countries',    

    country_lang: function () {
        return this.hasMany(Model('CountryLang'), 'country_id')
    },

    country: function () {
        return this.hasOne(Model('CountryGroupManagement'), 'country_code')
    }
    ,
    fetchOne: async function (field, value) {
        return await this.where(`${field}`, `${value}`).fetch();
    },

});
