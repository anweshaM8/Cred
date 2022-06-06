const Validator = Helper('validator');
const Country = Model('Country');

const CountryController = {

    index: function (req, res, next) {
        
        let has_pagination = _.toBoolean(req.query.pagination);
        let limit          = _.toBoolean(req.query.limit) ? _.toInteger(req.query.limit) : 10;
        let page           = _.toBoolean(req.query.page) ? _.toInteger(req.query.page) : 1;

        let isActive = _.toBoolean(req.query.is_active) ? req.query.is_active : false;
        let isDelete = _.toBoolean(req.query.is_delete) ? req.query.is_delete : false;
        let getlangData  = _.toBoolean(req.query.lang) ? req.query.lang : false;
        let orderByAsc  = _.toBoolean(req.query.orderByAsc) ? req.query.orderByAsc : false;


        let countryData = Country.forge();
 
        if (isActive) {
            countryData = countryData.where('is_active', isActive);
        }
        if (isDelete) {
            countryData = countryData.where('is_delete', isDelete);
        }

        if(orderByAsc)
        {
            countryData = countryData.orderBy('id','Asc');
        }
        else
        {
            countryData = countryData.orderBy('id','Desc');
        }
        

        if (has_pagination) {
            let relation_params = Object.assign(
                { withRelated: [] },                               
                { pageSize: limit, page: page },              
            );
            countryData = countryData.fetchPage(relation_params);
        } else {
            countryData = countryData.fetchAll(Object.assign(
                { withRelated: [] })) 
        }

        countryData.then((response) => {  
            return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 ));   
        }).catch((errors) => {           
            return res.status(200).json(res.fnError(errors,'Internal Server Error',500));
        });           
       
    },

    store: async function (req, res, next) {
        
        
    },
 
    show: function (req, res, next) {
        
        try{
            let findFor = req.params.id;       
            let isActive = _.toBoolean(req.query.is_active) ? req.query.is_active : false;
            let getlangData  = _.toBoolean(req.query.lang) ? req.query.lang : false;
    
            let country = Country;
    
            if (isActive) {
                country = country.where('is_active', isActive);
            }            
    
            country.forge({id: findFor})
            .fetch()
            .then(function (response) {
                if (!response) {
                    return res.status(200).json(res.fnError(errors,'Internal Server Error',500));  
                }
                else {
                    return res.status(200).json(res.fnSuccess(response , 'Response Successfully', 200 ));  
                }
            })
            .catch(function (err) {
                return res.status(200).json(res.fnSuccess(err , 'No Data Found', 200 ));  
            }); 
        }
        catch(e){
            return res.status(200).json(res.fnError('','Internal Server Error',422)); 
        }
    },
  

    update: async function (req, res, next) { 

      
    },

    destroy: function (req, res, next) {
       
    },
}

module.exports = CountryController;


