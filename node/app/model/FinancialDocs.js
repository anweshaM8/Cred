// Newest1 - Start

const bookshelf = Config("database");

module.exports = bookshelf.model("FinancialDocs", {
  hasTimestamps: true,

  tableName: process.env.TABLE_PREFIX + "financial_docs",

    createData: async function (formData) {
     return await this.save(formData);
    },
    fetchOne: async function (field, value) {
     return await this.where(`${field}`, `${value}`).fetch({ withRelated: [] });
    },
    fetchAllData: async function (searchInvestigationId) {
          return await this.query((qb)=>{
          
            if(searchInvestigationId){
                qb.where('search_investigation_id','=',searchInvestigationId)
            }

        }).orderBy('-id').fetchPage(Object.assign(
            { withRelated:[] }, 
        ));
    },
    fetchPageData: async function (limit, page,searchInvestigationId) {
          return await this.query((qb)=>{
           
          if(searchInvestigationId){
              qb.where('search_investigation_id','=',searchInvestigationId)
          }

        }).orderBy('-id').fetchPage(Object.assign(
            { withRelated:[] }, 
            { pageSize: limit, page: page }
        ));
    }
});

// Newest1 - End
