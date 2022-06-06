const bookshelf = Config('database');

module.exports = bookshelf.model('EmailContent', {

    hasTimestamps: true,

    tableName: process.env.TABLE_PREFIX + 'email_contents',

    createdBy : function(){
        return this.belongsTo(Model('User'),'created_by');
    },
    createData: async function (formData) {
        return await this.save(formData);
    },
    fetchOne: async function (field, value) {
        return await this.where(`${field}`, `${value}`).fetch({ withRelated: ["createdBy","createdBy.userDetail" ] });
    },
    fetchAllData: async function () {
        return await this.fetchAll(Object.assign(
            { withRelated: ["createdBy","createdBy.userDetail" ]  }));
    },
    fetchPageData: async function (limit, page) {
        return await this.fetchPage(Object.assign(
            { withRelated: ["createdBy","createdBy.userDetail" ]  },
            { pageSize: limit, page: page }
        ));
    }

});