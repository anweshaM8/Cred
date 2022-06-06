const bookshelf   = Config('database');

module.exports = bookshelf.model('SearchInvestigation',{
    
    hasTimestamps : true,

    tableName : process.env.TABLE_PREFIX + 'search_investigation',

    user: function(){
        return this.belongsTo(Model('User'),'user_id')
    },
  
    userDetail: function(){
        return this.hasOne(Model('UserDetail'),'user_id','user_id')
    },

    onlineSearchDetails: function(){
        return this.hasOne(Model('OnlineSearchDetails'),'search_investigation_id')
       // this.belongsTo(Model('OnlineSearchDetails'),'search_investigation_id')
    },
    countrydet: function(){
        //return this.belongsTo(Model('SearchInvestigationCountries'),'id')
        return this.belongsTo(Model('SearchInvestigationCountries'),'country_id')
    },

    financialDoc: function(){
        return this.hasOne(Model('FinancialDocs'),'search_investigation_id')
       // this.belongsTo(Model('OnlineSearchDetails'),'search_investigation_id')
    },

    createData: async function(formData){
       return await this.save(formData);
    },     
    fetchOne : async function(id){
        return await this.where("id", id).fetch({ withRelated: "userDetail" });
    },
    fetchAllData: async function(type,company_name,company_address,company_contact
        ,postal_code,contact_email,gst_vat_reg_number,internal_reference_no
        ,status,range_start,range_end,curUserType,curUserId,allHoBoUser,country_id,searchKeyword,showList){
        return await this.query((qb)=>{
            if(curUserType && curUserId)
            {
                if(curUserType=='MO')
                {
                    qb.where('cre_search_investigation.user_id',' IN ',allHoBoUser)
                    // qb.leftJoin('cre_users','cre_users.head_office_user_id','cre_search_investigation.user_id')
                    // qb.where((qb)=>{
                    //     qb.orWhere('cre_users.head_office_user_id','=',curUserId)
                    //     qb.orWhere('cre_search_investigation.user_id','=',curUserId)
                    // });  

                }

                if(curUserType!='SA' && curUserType!='MO')
                {
                    qb.where('cre_search_investigation.user_id','=',curUserId)
                }
            }

            if(type){
                qb.where('cre_search_investigation.type','=',type)
            }

            if(country_id){
               
                qb.leftJoin('cre_search_investigation_countries',function(){
                this.on('cre_search_investigation.country_id','=','cre_search_investigation_countries.id');
            })

                qb.where('cre_search_investigation_countries.id','=',country_id)

            }

            if(searchKeyword)
            {
                qb.where((qb)=>{
                    qb.orWhere('cre_search_investigation.company_name','like',`%${searchKeyword}%`)
                   qb.orWhere('cre_search_investigation.id','=',searchKeyword)
                }); 
            }

            if(company_name){
                qb.where('cre_search_investigation.company_name','like',`%${company_name}%`)
            }

            if(company_address){
                qb.where('cre_search_investigation.company_address','like',`%${company_address}%`)
            }

            if(company_contact){
                qb.where('cre_search_investigation.company_contact','like',`%${company_contact}%`)
            }

            if(postal_code){
                qb.where('cre_search_investigation.postal_code','like',`%${postal_code}%`)
            }

            if(contact_email){
                qb.where('cre_search_investigation.contact_email','like',`%${contact_email}%`)
            }

            if(gst_vat_reg_number){
                qb.where('cre_search_investigation.gst_vat_reg_number','like',`%${gst_vat_reg_number}%`)
            }

            if(internal_reference_no){
                qb.where('cre_search_investigation.internal_reference_no','like',`%${internal_reference_no}%`)
            }

            if(status){
                qb.where('cre_search_investigation.status','like',`%${status}%`)
            }
            

            if(range_start && range_end){
                qb.where('cre_search_investigation.created_at','>=',range_start)
                qb.where('cre_search_investigation.created_at','<',range_end)
            }

            if(showList)
            {
                qb.where('cre_search_investigation.search_list','=','show')
            }

            // qb.leftJoin('cre_search_investigation_countries',function(){
            //     this.on('cre_search_investigation.country_id','=','cre_search_investigation_countries.id');
            // })

           
        }).orderBy('-id').fetchAll(Object.assign(
                     { withRelated: ["countrydet","onlineSearchDetails","user","userDetail","financialDoc"] }));
    },
    fetchPageData: async function(limit,page,type,company_name,company_address,company_contact
        ,postal_code,contact_email,gst_vat_reg_number,internal_reference_no
        ,status,range_start,range_end,curUserType,curUserId,allHoBoUser,country_id,searchKeyword,showList){
        return await this.query((qb)=>{

            if(curUserType && curUserId)
            {
                if(curUserType=='HO')
                {
                    qb.where('cre_search_investigation.user_id',' IN ',allHoBoUser)
                    // qb.raw(' cre_search_investigation* from cre_search_investigation full outer join cre_users on cre_users.head_office_user_id = cre_search_investigation.user_id');
                    // //qb.fullOuterJoin('cre_users','cre_users.head_office_user_id','cre_search_investigation.user_id')
                    // qb.where((qb)=>{
                        //qb.orWhere('cre_users.head_office_user_id','=',curUserId)
                       // qb.orWhere('cre_search_investigation.user_id','=',curUserId)
                    // });  

                }
                

                if(curUserType!='SA' && curUserType!='HO')
                {
                    qb.where('cre_search_investigation.user_id','=',curUserId)
                }
            }

            if(type){
                qb.where('cre_search_investigation.type','=',type)
                if(type=='ON')
                {
                    qb.innerJoin('cre_online_search_details',function(){
                        this.on('cre_search_investigation.id','=','cre_online_search_details.search_investigation_id');
                    })
                }
            }

            if(country_id){
               
                qb.leftJoin('cre_search_investigation_countries',function(){
                this.on('cre_search_investigation.country_id','=','cre_search_investigation_countries.id');
            })

                qb.where('cre_search_investigation_countries.id','=',country_id)

            }

            if(searchKeyword)
            {
                 qb.where((qb)=>{
                        qb.orWhere('cre_search_investigation.company_name','like',`%${searchKeyword}%`)
                        qb.orWhere('cre_search_investigation.id','=',searchKeyword)
                    }); 

            }

            if(company_name){
                qb.where('cre_search_investigation.company_name','like',`%${company_name}%`)
            }

            if(company_address){
                qb.where('cre_search_investigation.company_address','like',`%${company_address}%`)
            }

            if(company_contact){
                qb.where('cre_search_investigation.company_contact','like',`%${company_contact}%`)
            }

            if(postal_code){
                qb.where('cre_search_investigation.postal_code','like',`%${postal_code}%`)
            }

            if(contact_email){
                qb.where('cre_search_investigation.contact_email','like',`%${contact_email}%`)
            }

            if(gst_vat_reg_number){
                qb.where('cre_search_investigation.gst_vat_reg_number','like',`%${gst_vat_reg_number}%`)
            }

            if(internal_reference_no){
                qb.where('cre_search_investigation.internal_reference_no','like',`%${internal_reference_no}%`)
            }

            if(status){
                qb.where('cre_search_investigation.status','like',`%${status}%`)
            }

            if(range_start && range_end){
                qb.where('cre_search_investigation.created_at','>=',range_start)
                qb.where('cre_search_investigation.created_at','<',range_end)
            }

            if(showList)
            {
                qb.where('cre_search_investigation.search_list','=','show')
            }

            // qb.leftJoin('cre_search_investigation_countries',function(){
            //     this.on('cre_search_investigation.country_id','=','cre_search_investigation_countries.id');
            // })

            console.log('qb',qb.toSQL().toNative())
            
        }).orderBy('-id').fetchPage(Object.assign(
                    { withRelated: ["countrydet","onlineSearchDetails","user","userDetail","financialDoc"] }, 
                    { pageSize: limit, page: page }
                ));

                
    },

     /*************************new fn to get data fr details excel report********/
     walletLog: function(){
        return this.hasOne(Model('CustomerWalletLog'),'search_investigation_id','id')
    },

    //fn fr invoice excel report
    fetchAllDataReport: async function(range_start,range_end,curUserType,curUserId,allHoBoUser){
        return await this.query((qb)=>{
            if(range_start && range_end){
                qb.where('cre_search_investigation.created_at','>=',range_start)
                qb.where('cre_search_investigation.created_at','<',range_end)
            }

            if(curUserType && curUserId)
            {
                if(curUserType=='HO')
                {
                    qb.where('cre_search_investigation.user_id',' IN ',allHoBoUser)
                    

                }
                

                if(curUserType!='SA' && curUserType!='HO')
                {
                    qb.where('cre_search_investigation.user_id','=',curUserId)
                }
            }

                qb.where('cre_search_investigation.status','=',"C")
           
        }).orderBy('user_id').fetchAll(Object.assign(
                     { withRelated: ["userDetail","walletLog"] }));
    },

    
});



 
