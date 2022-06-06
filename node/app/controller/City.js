// Newest1 - Start

const City = Model("City");

const CityController = {
  index: function (req, res, next) {

    let stateId = _.toBoolean(req.query.stateId) ? req.query.stateId: false;
    let lang = _.toBoolean(req.query.lang) ? req.query.lang : false;
    let isActive = _.toBoolean(req.query.is_active) ? req.query.is_active : false;
    let isDelete = _.toBoolean(req.query.is_delete) ? req.query.is_delete : false;

    let cityData = City.forge().orderBy('-id');

    if (!stateId)
        return res.status(200).json(res.fnError('', 'Please select a state first!', 400));
    else
        cityData = cityData.where('state_id', stateId);

    if (lang) {
        cityData = cityData.where('lang', lang);
    }

    if (isActive) {
        cityData = cityData.where('is_active', isActive);
    }

    if (isDelete) {
        cityData = cityData.where('is_delete', isDelete);
    }

    cityData = cityData.fetchAll();

    cityData.then((response) => {              
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

module.exports = CityController;

// Newest1 - End
