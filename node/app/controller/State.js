// Newest1 - Start

const State = Model("State");

const StateController = {
  index: function (req, res, next) {

    // let countryId = _.toBoolean(req.query.countryId) ? req.query.countryId: false;
    let lang = _.toBoolean(req.query.lang) ? req.query.lang : false;
    let isActive = _.toBoolean(req.query.is_active) ? req.query.is_active : false;
    let isDelete = _.toBoolean(req.query.is_delete) ? req.query.is_delete : false;
    let countryId = _.toBoolean(req.query.country_id) ? req.query.country_id : false;


    let stateData = State.forge().orderBy('-id');

    
    if (lang) {
        stateData = stateData.where('lang', lang);
    }

    if (isActive) {
        stateData = stateData.where('is_active', isActive);
    }

    if (isDelete) {
        stateData = stateData.where('is_delete', isDelete);
    }

    if(countryId){
        stateData = stateData.where('country_id',countryId);
    }
    stateData = stateData.fetchAll();

    stateData.then((response) => {              
        return res.status(200).json(res.fnSuccess(response, 'Response Successfully', 200));  
    }).catch((errors) => {           
        return res.status(200).json(res.fnError(errors, 'Internal Server Error', 500));
    });
  },

  store: function (req, res, next) {},

  show: function (req, res, next) {},

  update: function (req, res, next) {},

  destroy: function (req, res, next) {},
};

module.exports = StateController;

// Newest1 - End
