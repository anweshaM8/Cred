const bookshelf = Config('database');

module.exports = bookshelf.model('CompanyProbeinfo', {

    hasTimestamps: true,

    tableName: process.env.TABLE_PREFIX + 'company_probeinfo',

    
    fetchOne: async function (field, value) {
        return await this.where(`${field}`, `${value}`).fetch();
    },
    // fetchAllData: async function (user_id,search,order_type,group_id) {
    //     return await this.query((qb)=>{
    //         if(search!==""){
    //             // qb.where((qb)=>{
    //             //     qb.orWhere('cost_per_report','=',parseFloat(search))
    //             //     qb.orWhere('rebate_amout','=',parseFloat(search))
    //             // });  
    //         }

    //         if(order_type){
    //             //qb.where('order_type','like',`%${order_type}%`)
    //         }

    //         if(user_id){
    //             //qb.where('user_id','=', user_id)
    //         }

    //         if(group_id){
    //             //qb.where('group_id','=', group_id)
    //         }

    //     }).orderBy('-id').fetchPage();
    // },
    // fetchPageData: async function (limit, page,user_id,search,order_type,group_id) {
    //     return await this.query((qb)=>{

    //         if(search!==""){
    //             // qb.where((qb)=>{
    //             //     qb.orWhere('cost_per_report','=',parseFloat(search))
    //             //     qb.orWhere('rebate_amout','=',parseFloat(search))
    //             // });  
    //         }

    //         if(order_type){
    //             //qb.where('order_type','like',`%${order_type}%`)
    //         }

    //         if(user_id){
    //             //qb.where('user_id','=', user_id)
    //         }

    //         if(group_id){
    //             //qb.where('group_id','=', group_id)
    //         }

    //     }).orderBy('-id').fetchPage(Object.assign(
    //         { pageSize: limit, page: page }
    //     ));
    // },

    createData: async function (formData) {
        return await this.save(formData);
    },
    
    update(id,details){      
        return this.where('id',id).save(details, { patch: true})   
    },

});
