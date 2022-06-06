const knex = require('knex')({
    client: 'mysql',
    connection: {
        timezone: 'UTC',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        charset: 'utf8',
        multipleStatements: true,
       // debug: true,
    }
});

const Bookshelf = require('bookshelf')(knex);


Bookshelf.plugin(require('bookshelf-eloquent'));
Bookshelf.plugin(Helper('bookshelf-extends'));
Bookshelf.plugin('bookshelf-virtuals-plugin');
// Bookshelf.plugin(require('bookshelf-bulk-save'));
 
module.exports = Bookshelf;
