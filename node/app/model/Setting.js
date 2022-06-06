const bookshelf   = Config('database');

module.exports = bookshelf.model('Setting',{
    
    hasTimestamps : false,

    tableName : process.env.TABLE_PREFIX + 'site_settings',

    createData: async function(formData){
       return await this.save(formData);
    },    
    fetchOne : async function(id){
        return await this.where("id", id).fetch({ withRelated: "" });
    },
    fetchAllData: async function(){
        return await this.fetchAll(Object.assign(
                     { withRelated: "" }));
    },
    fetchPageData: async function(limit,page){
        return await this.fetchPage(Object.assign(
                    { withRelated: "" }, 
                    { pageSize: limit, page: page }
                ));
    }

    
});



 
