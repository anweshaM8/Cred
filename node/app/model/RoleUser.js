
const bookshelf = Config('database');

module.exports = bookshelf.model('RoleUser', {

    hasTimestamps: false,

    tableName: process.env.TABLE_PREFIX + 'role_users',    

  
    role :function(){
        return this.belongsTo(Model('Role'),'role_id');
    },
    roleName :function(){
        return this.belongsTo(Model('Role'),'role_id');
    }
});
