const bookshelf   = Config('database');

module.exports = bookshelf.model('CustomerOrderPriceManagement',{
    
    hasTimestamps : true,

    tableName : process.env.TABLE_PREFIX + 'customer_order_price_managements',
  
    
    user: function(){
        return this.belongsTo(Model('User'),'user_id')
    },
    userDetail: function(){
        return this.hasOne(Model('UserDetail'),'user_id','user_id')
    },
    countryGroupManagement: function(){
        return this.belongsTo(Model('CountryGroupManagement'),'group_id')
    },
    group: function(){
        return this.belongsTo(Model('User'),'group_id') //need to change
    },
    createData: async function(formData){
       return await this.save(formData);
    },     
     fetchOne: async function (field, value) {
        return await this.where(`${field}`, `${value}`).fetch({ withRelated:["userDetail","countryGroupManagement"] });
    },
    fetchAllData: async function(search,order_type, user_id, group_id){
        // return await this.orderBy('-id').fetchAll(Object.assign(
        //     { withRelated: "country" }));
     
            return await this.query((qb)=>{
                if(search!==""){
                    qb.where((qb)=>{
                        qb.orWhere('cost_per_report','=',parseFloat(search))
                        qb.orWhere('rebate_amout','=',parseFloat(search))
                    });  
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
                { withRelated:["user","userDetail","countryGroupManagement"] }, 
            ));
      
       
    },
    // fetchAllDataWhereIn: async function(field,value,groupType){
    //     return await this.where('group_type', `${groupType}`).whereIn(`${field}`, value).fetch({ withRelated: ""  });
    // },
    fetchPageData: async function(limit,page,search,order_type, user_id, group_id){
        // return await this.orderBy('-id').fetchPage(Object.assign(
        //     { withRelated: "country" }, 
        //             { pageSize: limit, page: page }
        //         ));

                return await this.query((qb)=>{
                    if(search!==""){
                        qb.where((qb)=>{
                            qb.orWhere('cost_per_report','=',parseFloat(search))
                            qb.orWhere('rebate_amout','=',parseFloat(search))
                        });  
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
                    { withRelated:["user","userDetail","countryGroupManagement"] }, 
                    { pageSize: limit, page: page }
                ));
        
    },
    update(id,details){      
        return this.where('id',id).save(details, { patch: true})   
    },

    
});



 
