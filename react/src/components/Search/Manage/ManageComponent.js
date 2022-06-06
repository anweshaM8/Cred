import React, { useState, useEffect, useContext } from 'react';
import ManageView from './ManageView';
import httpService from './../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
import S3BucketService from './../../../services/s3-bucket.service';
import { history } from '../../../helpers/history';


const ManageComponent = (props) => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);  
    const [fileError, setFileError] = useState(false);
    const [url, setUrl] = useState(''); 
    const [dataCountryList, setCountryDataList] = useState(false);
    const [particularCountry, setparticularCountry] = useState(null);
    const [particularCountryError, setparticularCountryError] = useState('');

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    const [search_company_input, setsearch_company_input] = useState(0);
    const [search_address_input, setsearch_company_address] = useState(0);
    //let search_company_input=localStorage.getItem("search_company_input");
    //let search_address_input=localStorage.getItem("search_address_input");
    //console.log("search_company_input",search_company_input);
    //console.log("search_address_input",search_address_input);

    const createSearchInvestigation= async (submitedData) => {
       
        setsearch_company_input(submitedData.company_name);
        setsearch_company_address(submitedData.company_address);

        showLoader();
        var addSubmitData = await httpService.setModule('searchInvestigation').create(submitedData);
        hideLoader();
        if (addSubmitData.res.data.status === 'success') {
            // e.target.reset();
            ToastsStore.success('Your order has been successfully placed. You will be able to access the report within 3 working days.');
            //history.push('/search-list');
        }
        else {

            ToastsStore.error('Internal server error');
        }
        
    }

    
    let fetchCountryApi = async () => {
        
        // if(stored_search_address_input)
        // {
        //     search_address_input=stored_search_address_input;
        // }

        /************************************************/
        showLoader();
        let listDetails = await httpService.setModule('SearchInvestigationCountries').search({});
        if (listDetails.res.data.status === 'success') {

            var countryList = [];

            var countries = listDetails.res.data.data.sort((a,b) => (a.country_name > b.country_name) ? 1 : ((b.country_name > a.country_name) ? -1 : 0))

            countries.map((value,index) => {
                countryList.push({ value: value.id, label: value.country_name })
              });
            setCountryDataList(countryList);
            handleChangeCountry(countryList[0])
            hideLoader();
        } else {
            hideLoader(); 
            ToastsStore.error('Internal Server Error');
        }
    }

    const handleChangeCountry =(changedCountryList) => {
        console.log('e-------',changedCountryList)
        setparticularCountry(changedCountryList);
    }



    const formSubmitData = async (submitedData, e) => {

        if(particularCountry==null)
        {
            setparticularCountryError('required')
            return false;
        }
        else
        {
            setparticularCountryError('');
            
        }

       

        showLoader();

        const fullFileDetails = submitedData.pi_link[0];

        if(fullFileDetails)
        {
            const promiseImage = new Promise((resolve, reject) => {                
                S3BucketService.fileUpload(fullFileDetails, 'fresh_investigation_pdf',"").send((err, data) => {
                    if (err) {
                        console.log(err);
                        hideLoader();
                        ToastsStore.error('Some issue occured in image upload');
                    } else {
                        
                        resolve(data.Location)
                        console.log('data.Location',data.Location)
                    }
                });
    
            });

            const url= Promise.all([promiseImage]).then((values) => {
       
                console.log(values,'sssssssss')
                submitedData['user_id'] = commonJsObj.getCurrentUserId();
                submitedData['country_id'] = particularCountry!=null?particularCountry.value:null;
                submitedData['type'] = 'FI';
                submitedData.pi_link =values[0];
        
                createSearchInvestigation(submitedData)
                  //console.log('error',error)
                });
        }
        else{
            submitedData['user_id'] = commonJsObj.getCurrentUserId();
            submitedData['country_id'] = particularCountry!=null?particularCountry.value:null;;
            submitedData['type'] = 'FI';
            submitedData.pi_link ='';
            console.log('submitedData',submitedData)
    
            createSearchInvestigation(submitedData)
        }
        
        

        // var addSubmitData = await httpService.setModule('searchInvestigation').create(submitedData);
        // hideLoader();
        // if (addSubmitData.res.data.status === 'success') {
        //     e.target.reset();
        //     ToastsStore.success('Successfully submitted your investigation');
        // }
        // else {

        //     ToastsStore.error('Internal server error');
        // }
    }



    const onFileChange = (e) => { 
        const files = e.target.files;
        console.log('files', files, 'URL.createObjectURL(files[0])', URL.createObjectURL(files[0]))
        files.length > 0 && setUrl(files[0]);
        if (files[0].type == 'application/pdf' || files[0].type == '.pdf' ||
         files[0].type == 'application/msword' || files[0].type == '.doc' ||
         files[0].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || files[0].type == '.docx' ||
         files[0].type == 'text/plain' || files[0].type == '.txt' ||
         files[0].type == 'image/jpg' || files[0].type == '.jpg' ||
         files[0].type == 'image/jpeg' || files[0].type == '.jpeg' ||
         files[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || files[0].type == 'application/vnd.ms-exce'
          ) {
            setFileError(false)
        }
        else {
            setFileError(true)
        }
    };

    useEffect(() => {

        fetchCountryApi();
        setsearch_company_input(localStorage.getItem("search_company_input"));
        setsearch_company_address(localStorage.getItem("search_address_input"));
       

    }, []);

    useEffect(() => {

    }, [globalState]);


    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!loderFlag && <>
                <ManageView particularCountryError={particularCountryError} formSubmitData={formSubmitData} particularCountry={particularCountry} handleChangeCountry={handleChangeCountry} dataCountryList={dataCountryList}  onFileChange={onFileChange} fileError={fileError} search_company_input={search_company_input} search_address_input={search_address_input}/>
            </>}

        </>
    )
}

export default ManageComponent
