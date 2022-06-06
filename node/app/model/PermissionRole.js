const bookshelf   = Config('database');

module.exports = bookshelf.model('PermissionRole',{
    
    hasTimestamps : false,

    tableName : process.env.TABLE_PREFIX + 'permission_roles',
  
    
});


 

