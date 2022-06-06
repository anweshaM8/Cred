const bookshelf = Config('database');
const moment = require('moment');

module.exports = bookshelf.model('OnlineSearchDetails', {

    hasTimestamps: true,

    tableName: process.env.TABLE_PREFIX + 'online_search_details',
    
    

    // searchInvestigation:async function(){
    //     return await this.belongsTo(Model('SearchInvestigation'),'search_investigation_id')
    // },
    searchInvestigation: function(){
        return this.belongsTo(Model('SearchInvestigation'),'search_investigation_id')
    },

    // searchInvestigation: function(){
    //     return this.this.belongsTo(Model('SearchInvestigation'),'search_investigation_id')
    // },
    
    createData: async function (formData) {
        return await this.save(formData);
    },
    fetchOne: async function (field, value) {
        return await this.where(`${field}`, `${value}`).fetch({ withRelated: [] });
    },
    fetchAllData: async function (search_investigation_id) {
        return await this.query((qb)=>{
                if(search_investigation_id){
                    qb.where('search_investigation_id','=',search_investigation_id)
                }

            }).fetchAll(Object.assign(
            { withRelated: []  }));
    },
    fetchAllDataForUpdateProbeStatus: async function () {
        let dateTimeNow = moment();
        var dateTimeAfter4hour = moment(dateTimeNow).subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
        return await this.query((qb)=>{
               
            qb.where('is_update_requested','=',1)
            qb.where('update_requested_on','<=',dateTimeAfter4hour)
            qb.whereNotNull('cin_or_llp_id')
            //qb.where('cin_or_llp_id','!=',null)
            console.log('qb',qb.toSQL().toNative())
            }).fetchAll(Object.assign(
            { withRelated: ["searchInvestigation"]  }));
    },
    fetchPageData: async function (limit, page,search_investigation_id) {
        return await this.query((qb)=>{
                if(search_investigation_id){
                    qb.where('search_investigation_id','=',search_investigation_id)
                }

            }).fetchPage(Object.assign(
            { withRelated: []  },
            { pageSize: limit, page: page }
        ));
    },
    update: async function(search_investigation_id,details){      
        return await this.where('id',search_investigation_id).save(details, { withRefresh: true,patch:true,})   
    },

});