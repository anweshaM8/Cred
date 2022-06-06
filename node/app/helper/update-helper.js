const Bookshelf = Config('database');

const updateHelper = {

    statusUpdate: function (data,table) {
        
        let sqlString = `UPDATE ${table} SET is_active = ${data.is_active} where id =${data.id}; Select * from ${table}  where id =${data.id}`;                
        return Bookshelf.knex.raw(sqlString);      
    },

    downloadstatusUpdate: function (data,table) {
        
        let sqlString = `UPDATE ${table} SET download_status = '${data.download_status}' where id =${data.id}; Select * from ${table}  where id =${data.id}`;                
        return Bookshelf.knex.raw(sqlString);      
    },
    
}

module.exports = updateHelper;

