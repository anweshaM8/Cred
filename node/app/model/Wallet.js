const bookshelf = Config('database');

module.exports = bookshelf.model('Wallet', {

    hasTimestamps: true,

    tableName: process.env.TABLE_PREFIX + 'wallets',

    CustomerOrderPriceManagement: function(){
        return this.hasOne(Model('CustomerOrderPriceManagement'),'user_id','user_id')
    },

    CustomerOrderPriceManagementOnline: function(){
        return this.hasMany(Model('CustomerOrderPriceManagement'),'user_id','user_id')
    },

    user: function(){
        return this.belongsTo(Model('User'),'user_id')
    },

    user_details:function(){
        return this.belongsTo(Model('UserDetail'),'user_id');

    },

    country_details:function(){
        //return this.hasOne(Model('Country')).through(Model('UserDetail'),'id','country_id')
        return this.belongsTo(Model('Country')).through(Model('UserDetail'),'user_id','country_id','user_id')
    },
    state_details:function(){
        //return this.hasOne(Model('State')).through(Model('UserDetail'),'id','state_id')
        return this.belongsTo(Model('State')).through(Model('UserDetail'),'user_id','state_id','user_id')
    },
    city_details:function(){
       // return this.hasOne(Model('City')).through(Model('UserDetail'),'id','city_id')
        return this.belongsTo(Model('City')).through(Model('UserDetail'),'user_id','city_id','user_id')
    },

    createData: async function (formData) {
        return await this.save(formData);
    },
    fetchOne: async function (field, value) {
        return await this.where(`${field}`, `${value}`).fetch({ withRelated: ["user","CustomerOrderPriceManagement","user_details"] });
    },
    fetchAllData: async function (user_id,search,order_type,group_id) {
        return await this.query((qb)=>{
            if(search!==""){
                // qb.where((qb)=>{
                //     qb.orWhere('cost_per_report','=',parseFloat(search))
                //     qb.orWhere('rebate_amout','=',parseFloat(search))
                // });  
            }

            if(order_type){
                qb.where('order_type','like',`%${order_type}%`)
            }

            if(user_id){
                qb.where('user_id','=', user_id)
            }

            if(group_id){
                qb.where('group_id','=', group_id)
            }

        }).orderBy('-id').fetchPage(Object.assign(
            { withRelated:["user","user_details","CustomerOrderPriceManagement"] }, 
        ));
    },
    fetchPageData: async function (limit, page,user_id,search,order_type,group_id) {
        return await this.query((qb)=>{

            if(search!==""){
                // qb.where((qb)=>{
                //     qb.orWhere('cost_per_report','=',parseFloat(search))
                //     qb.orWhere('rebate_amout','=',parseFloat(search))
                // });  
            }

            if(order_type){
                qb.where('order_type','like',`%${order_type}%`)
            }

            if(user_id){
                qb.where('user_id','=', user_id)
            }

            if(group_id){
                qb.where('group_id','=', group_id)
            }

        }).orderBy('-id').fetchPage(Object.assign(
            { withRelated:["user","user_details","CustomerOrderPriceManagement"] }, 
            { pageSize: limit, page: page }
        ));
    },
    sumAmount: async function(userId,amount){
        console.log(userId,amount,'ssss')
        return this.query((qb)=>{
            qb.where('user_id', userId).increment('credit', amount).increment('total_amount', amount)
        }).save()
         
    },

    update(id,details){      
        return this.where('id',id).save(details, { patch: true})   
    },

    //added fr getting group name
    group_details:function(){
        //return this.hasOne(Model('Country')).through(Model('UserDetail'),'country_id')
        return this.belongsTo(Model('CountryGroupManagement')).through(Model('CustomerOrderPriceManagement'),'id','group_id')
    },

});
