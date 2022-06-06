const bookshelf   = Config('database');

module.exports = bookshelf.model('Module',{
    
    hasTimestamps : false,

    tableName : process.env.TABLE_PREFIX + 'modules',        
    
    permissions: function(){
    
        return this.hasMany(Model('Permission'),'module_id');
    },

    fetchAllData: async function(){
        return await this.fetchAll(Object.assign(
                     { withRelated: "permissions" }));
    }
    
    
});



 
