const fs = require('fs');
const moment = require('moment');
const axios = require('axios');
const CircularJSON = require('circular-json');
const ProbeApiDatas = Model('ProbeApiDatas');
const headers = {
  'x-api-key':process.env.PROBE_KEY,
  'x-api-version':'1.3',
  'accept': 'application/json'
  };


const cronHelper = {

    /*******************Get Status of Update request of CIN from PROBE**************** */
    probeGetUpdateStatusCINORLLP:async  function (cinOrPanorORllpinOrPan,requestId,type) {
        
      try {
        if(type=='cin')
        {
            var url = process.env.PROBE_API_URL+'/companies/'+cinOrPanorORllpinOrPan+'/get-update-status';
        }

        if(type=='llp')
        {
            var url = process.env.PROBE_API_URL+'/llps/'+cinOrPanorORllpinOrPan+'/get-update-status';
        }
         
        let res =  await  axios({
            method: 'get',
            url: url,
            headers:headers,
            params: {
                'request_id':requestId,
            },
          });
          if(res.status == 200){
            // test for status you want, etc
            console.log('---res---',res.data.data)
        }    
        // Don't forget to return something   
        return res.data.data
    }
    catch (err) {
        console.error(err);
        return err;
    }


          // .then(function (response) {

          //   console.log('-----response-------',response.data.data)
              
          //   return response.data.data;
           
          // })
          // .catch(function (error) {
          //   console.log(error);

          //   return error;
          // })

        
    },

    /*******************Get Status of Update request of LLP from PROBE**************** */
    // probeGetUpdateStatusLLP:  function (llpinOrPan,requestId) {
        
         
    //     axios({
    //         method: 'get',
    //         url: process.env.PROBE_API_URL+'/llps/'+llpinOrPan+'/get-update-status',
    //         headers:headers,
    //         params: {
    //             'request_id':requestId,
    //         },
    //       })

    //       .then(function (response) {
              
    //         return response;
           
    //       })
    //       .catch(function (error) {
    //         console.log(error);

    //         return error;
    //       })

        
    // },
    
}

module.exports = cronHelper;

