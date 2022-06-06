const bookshelf   = Config('database');

module.exports = bookshelf.model('Role',{
    
    hasTimestamps : true,

    tableName : process.env.TABLE_PREFIX + 'roles',
  
    permission_roles:function () {
        return this.hasMany(Model('PermissionRole'),'role_id');
    },

    createData: async function(formData){
       return await this.save(formData);
    },    
    fetchOne : async function(id){
        return await this.where("id", id).fetch({ withRelated: "permission_roles" });
    },
    fetchAllData: async function(search){

        return await this.query((qb)=>{
            if(search!==""){
                qb.where('name','like',`%${search}%`)
            }
        }).orderBy('-id').fetchAll(Object.assign(
            { withRelated: "permission_roles" }));
    },
    fetchPageData: async function(limit,page,search){
        return await this.query((qb)=>{
            if(search!==""){
                qb.where('name','like',`%${search}%`)
            }
        }).orderBy('-id').fetchPage(Object.assign(
                    { withRelated: "permission_roles" }, 
                    { pageSize: limit, page: page }
                ));
    }

    
});



 
