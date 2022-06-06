const bookshelf   = Config('database');
const jwt         = require('jsonwebtoken');

module.exports = bookshelf.model('User',{
    
    hasTimestamps : true,

    tableName : process.env.TABLE_PREFIX + 'users',
    hidden : [''],
    virtuals: {       
       
    }, 
    createdBy : function(){
        return this.belongsTo(Model('User'),'created_by');
    },
    userDetail: function(){
        return this.hasOne(Model('UserDetail'),'user_id')
    },
    role :function(){
        return this.hasOne(Model('RoleUser'),'user_id');
    },
    roleMatch : function(){
        return this.hasOne(Model('Role'),'short_code','user_type');
    },  
    headOfficeUser : function(){
        return this.belongsTo(Model('User'),'head_office_user_id')
    },    
    createData: async function(formData){
       return await this.save(formData);
    },    
    fetchOne : async function(field,value){        
        return await  this.where(`${field}`, `${value}` ).fetch({ withRelated:[ "userDetail","role.roleName","roleMatch", "createdBy","createdBy.userDetail","headOfficeUser","headOfficeUser.userDetail"] });       
    },
    fetchAllUsersUnderHO: async function(head_office_user_id){
        return await this.query((qb)=>{
            if(head_office_user_id){
                qb.where('head_office_user_id',head_office_user_id)
            }
        }).orderBy('-id').select('id').fetchAll();
        
    },
    fetchAllData: async function(userType, isActive){
        return await this.query((qb)=>{
            if(userType){
                qb.where('user_type',userType)
            }
            if(isActive){
                qb.where('is_active',1)
            }
        }).orderBy('-id').where('id', 'not in', [1]).fetchAll(Object.assign(
            { withRelated: ["userDetail","role","role.roleName", "createdBy","createdBy.userDetail"] }));
        
    },
    fetchPageData: async function(userType,limit,page, isActive, searchKeyword, registrationType, searchStatus, headOfficUserId){
        return await this.query((qb)=>{
            if(userType){
                qb.where('cre_users.user_type',userType)
            }
            if(headOfficUserId){
                qb.where('cre_users.head_office_user_id',headOfficUserId)
            }
            if(searchKeyword){              
                qb.leftJoin('cre_user_details','cre_user_details.user_id','cre_users.id')
                qb.where((qb)=>{
                    qb.orWhere('cre_users.unique_id','like',`%${searchKeyword}%`)
                    qb.orWhere('cre_users.user_name','like',`%${searchKeyword}%`)
                    qb.orWhere('cre_users.phone_number','like',`%${searchKeyword}%`)
                   // qb.orWhere('cre_user_details.customer_bank_name','like',`%${searchKeyword}%`)
                    qb.orWhere('cre_user_details.name','like',`%${searchKeyword}%`)
                });              
            }
            if(registrationType){
                qb.where('cre_users.registration_type',registrationType)
            }    
            if(searchStatus){
                qb.where('cre_users.is_active',searchStatus)
            }       
            if(isActive){
                qb.where('cre_users.is_active',1)
            }
        }).orderBy('-id').where('cre_users.id', 'not in', [1]).fetchPage(Object.assign(
            { withRelated:[ "userDetail","role","role.roleName", "createdBy","createdBy.userDetail","headOfficeUser","headOfficeUser.userDetail"] }, 
            { pageSize: limit, page: page }
        ));
        
    },
    getPermissions : function(user_id){
        return bookshelf.knex('cre_role_users').select('cre_permissions.name').where('user_id',user_id)
            .innerJoin('cre_permission_roles',function(){
                this.on('cre_permission_roles.role_id','=','cre_role_users.role_id');
            })
            .innerJoin('cre_permissions',function(){
                this.on('cre_permissions.id','=','cre_permission_roles.permission_id');
            });
    },
    getRoles: function(user_id){
        return bookshelf.knex('cre_role_users').select('cre_roles.name').where('user_id',user_id)
            .innerJoin('cre_roles',function(){
                this.on('cre_roles.id','=','cre_role_users.role_id');
            })
    },
    getAuthorizeToken: async function(user_id, generateSystemToken){

        let expireIn = '1y';

        let token_data = {
            user        :[],
            permissions :[],
            roles       :[]
        };
  

        await this.where('id',user_id).fetch({
            withRelated:['userDetail'],
        }).then((user)=>{
            token_data.user = user.toJSON()
        });

        await this.getPermissions(user_id).pluck('cre_permissions.name').then((permissions)=>{
            token_data.permissions = permissions;
        }); 

        await this.getRoles(user_id).pluck('cre_roles.name').then((roles)=>{
            token_data.roles = roles
        });

        let token = 'jwt '+ jwt.sign(token_data,appKey(),{expiresIn:expireIn});
       
        await this.tokenUpdate(user_id,token,generateSystemToken);

        await this.where('id',user_id).fetch().then((user)=>{
            token_data.user = user.toJSON()
        });

        let send_data = {           
            // token       :token,
            payload     :token_data,
            expires_in  :expireIn
        };
        return send_data;
    }, 
    tokenUpdate(user_id,token){      
        return this.where('id',user_id).save({"token":token,"is_login":1}, { patch: true})   
    },
    update(user_id,details){      
        return this.where('id',user_id).save(details, { patch: true})   
    },
    count:async function (userType, isActive,headOfficUserId){
        return await this.query((qb)=>{
            if(userType){
                qb.where('user_type',userType)
            }
            if(isActive){
                qb.where('is_active',1)
            }
            if(headOfficUserId){
                qb.where('cre_users.head_office_user_id',headOfficUserId)
            }
            qb.count('id as rowCount');
        }).where('id', 'not in', [1]).fetch();
    },
});



 
