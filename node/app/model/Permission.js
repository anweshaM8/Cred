
const bookshelf = Config('database');

module.exports = bookshelf.model('Permission', {

    hasTimestamps: false,

    tableName: process.env.TABLE_PREFIX + 'permissions',    

});
