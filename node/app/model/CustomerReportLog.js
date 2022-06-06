const bookshelf = Config('database');

module.exports = bookshelf.model('CustomerReportLog', {

    hasTimestamps: true,

    tableName: process.env.TABLE_PREFIX + 'customer_report_log',

    user: function(){
        return this.belongsTo(Model('User'),'user_id')
    },

    user_details:function(){
        return this.belongsTo(Model('UserDetail'),'user_id');

    },
    
    createData: async function (formData) {
        return await this.save(formData);
    },
    fetchOne: async function (field, value) {
        return await this.where(`${field}`, `${value}`).fetch({ withRelated: ["user","user_details"] });
    },
    fetchOneWithStartEndPaymentDate: async function (field, value , startDateForPayment ,endDateForPayment ) {

        return await this.query((qb)=>{

            if(field && value)
            {
                qb.where(`${field}`, `${value}`)
            }

            if(startDateForPayment && endDateForPayment)
            {
                qb.where('invoice_date','>=',startDateForPayment)
                qb.where('invoice_date','<=',endDateForPayment)
            }

            console.log('qb',qb.toSQL().toNative())
        }).fetch({ withRelated: [] });

        //return await this.where(`${field}`, `${value}`).where(`payment_date`,'>=',startDateForPayment).where(`payment_date`,'<=',endDateForPayment).fetch({ withRelated: [] });
    },
    fetchAllData: async function (groupByUser,groupByInvoiceDate,checkPaymentDate,checkPaymentOrRebateApprovedate,user_id,startDateForPayment,endDateForPayment) {
        return await this.query((qb)=>{
            if(groupByUser)
            {
                qb.groupBy('user_id')
            }
            if(groupByInvoiceDate)
            {
                qb.groupBy('invoice_date')
            }
            if(checkPaymentDate)
            {
                qb.whereNotNull('payment_date')
            }
            if(checkPaymentOrRebateApprovedate)
            {
                qb.andWhere((qb)=>{
                    qb.orWhere('payment_approve_status','=','0')
                    qb.orWhere('rebate_approve_status','=','0')
                }); 
            }

            if(user_id)
            {
                qb.where('user_id','=',user_id)
            }

            if(startDateForPayment && endDateForPayment)
            {
                qb.where('payment_date','>=',startDateForPayment)
                qb.where('payment_date','<=',endDateForPayment)
            }

            console.log('qb',qb.toSQL().toNative())
        }).orderBy('-id').fetchAll(Object.assign(
            { withRelated: ["user","user_details"]  }));
    },
    fetchPageData: async function (limit, page,groupByUser,groupByInvoiceDate,checkPaymentDate,checkPaymentOrRebateApprovedate,user_id,startDateForPayment,endDateForPayment) {
        return await this.query((qb)=>{

            if(groupByUser)
            {
                qb.groupBy('user_id')
            }

            if(groupByInvoiceDate)
            {
                qb.groupBy('invoice_date')
            }

            if(checkPaymentDate)
            {
                qb.whereNotNull('payment_date')
            }
            if(checkPaymentOrRebateApprovedate)
            {
                qb.andWhere((qb)=>{
                    qb.orWhere('payment_approve_status','=','0')
                    qb.orWhere('rebate_approve_status','=','0')
                }); 
            }

            if(user_id)
            {
                qb.where('user_id','=',user_id)
            }

            if(startDateForPayment && endDateForPayment)
            {
                qb.where('payment_date','>=',startDateForPayment)
                qb.where('payment_date','<=',endDateForPayment)
            }

            console.log('qb',qb.toSQL().toNative())
        }).orderBy('-id').fetchPage(Object.assign(
            { withRelated: ["user","user_details"]  },
            { pageSize: limit, page: page }
        ));
    }

});