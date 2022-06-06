const bookshelf   = Config('database');
const createError = require('http-errors');

module.exports = bookshelf.model('CountryGroupManagement',{
    
    hasTimestamps : true,

    tableName : process.env.TABLE_PREFIX + 'country_group_managements',

    //NotFoundError: createError(bookshelf.Model.NotFoundError, "countryGroupManagementNotFoundError"),
  
    
    country: function(){
        return this.belongsTo(Model('Country'),'country_code')
    },
    createData: async function(formData){
       return await this.save(formData);
    },     
     fetchOne: async function (field, value) {
        return await this.where(`${field}`, `${value}`).fetch({ withRelated:"country" });
    },
    fetchAllData: async function(groupType,countryCode,search,groupBy=false){
        // return await this.orderBy('-id').fetchAll(Object.assign(
        //     { withRelated: "country" }));
     
            return await this.query((qb)=>{
                if(search!==""){
                    qb.where('cre_country_group_managements.group_name','like',`%${search}%`)
                }

                if(groupType!==""){
                    qb.where('cre_country_group_managements.group_type',groupType)
                }
    
                if(countryCode>0){
                    qb.where('cre_country_group_managements.country_code',countryCode)
                }
                if(groupBy)
                {
                    qb.groupBy('cre_country_group_managements.group_name')
                }
            }).orderBy('-id').fetchPage(Object.assign(
                { withRelated:"country" }, 
            ));
      
       
    },
    fetchAllDataWhereIn: async function(field,value,groupType){
        return await this.where('group_type', `${groupType}`).whereIn(`${field}`, value).fetch({ require: true })
        .then( async function(response) { return response })
        .catch( async function(error) { if(error.NotFoundError)return null })

        // .then(user => {
        //     return new Promise((resolve, reject) => {
        //       bcrypt.compare(password, user.get('password'), (err, matched) => {
        //         if (err)      return reject(err);
        //         if (!matched) return reject(new Error('Password didn\'t match!'));
        //         resolve(user);
        //       });
        //     })
        //   });
    },

    fetchAllDataWhere: async function(countryCode,groupType,searchId){
       // let searchArr = []; searchArr.push(searchId);
        return await this.where('group_type', `${groupType}`).where(`country_code`, countryCode).where('id', 'not in', [searchId]).fetch({require:false}).then( async function(response) { return response })
        .catch( async function(error) { if(error.NotFoundError)return null })
    },
    fetchPageData: async function(limit,page,groupType,countryCode,search,groupBy=false){
        // return await this.orderBy('-id').fetchPage(Object.assign(
        //     { withRelated: "country" }, 
        //             { pageSize: limit, page: page }
        //         ));

                return await this.query((qb)=>{
                    if(search!==""){
                        qb.where('cre_country_group_managements.group_name','like',`%${search}%`)
                    }

                    if(groupType!==""){
                        qb.where('cre_country_group_managements.group_type',groupType)
                    }

                    if(countryCode>0){
                        qb.where('cre_country_group_managements.country_code',countryCode)
                    }

                    if(groupBy)
                    {
                        qb.groupBy('cre_country_group_managements.group_name')
                    }
                }).orderBy('-id').fetchPage(Object.assign(
                    { withRelated:"country" }, 
                    { pageSize: limit, page: page }
                ));
        
    },
    update(id,details){      
        return this.where('id',id).save(details, { patch: true})   
    },

    
});



 
