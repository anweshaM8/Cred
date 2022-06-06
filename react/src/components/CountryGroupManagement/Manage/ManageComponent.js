import React, { useState, useEffect, useContext } from 'react';
import ManageView from './ManageView';
import httpService from './../../../services/httpService';
import { ToastsStore,toast } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { history } from '../../../helpers/history';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
const _ = require("lodash");

const ManageComponent = (props) => {
    const globalState = useContext(store);
    //let history = useHistory();
    const [loderFlag, setLoaderFlag] = useState(false);
    const [dataDetails, setDataList] = useState({});
    const [editDataList, setEditDataList] = useState({});
    const [clientType, setClientType] = useState({});
    const [countryDataList, setCountryDataist] = useState({});
    const [particularCountry, setparticularCountry] = useState(null);
    const [countryError, setCountryError] = useState(false);
    const [cityDataList, setCityDataist] = useState({});

    console.log('props',props)

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    const fetchCountryGroupManagementData = async () => {
        showLoader();
        let editId = props.match.params.id;
        let countryGroupManagementEditData = await httpService.setModule('countryGroupManagement').findOne(editId);
        
        return countryGroupManagementEditData;
    }
    const formSubmitData = async (submitedData, e) => {

        console.log('submitedData',submitedData,'particularCountry',particularCountry)
        

        if(particularCountry==null || particularCountry.length==0)
        {
            setCountryError(true);
            return false;
        }
        else
        {
            setCountryError(false);
        }

        if(particularCountry.length>0)
        {
            var countryIds = _.map(particularCountry, 'value');
            submitedData['country_code'] = countryIds;
        }
        else
        {
            submitedData['country_code'] = particularCountry.value;
        }
        

        console.log('countryIds',countryIds)

        showLoader();
        if (props.match.params.id) {
            submitedData.id = props.match.params.id;
            submitedData['created_by'] = commonJsObj.getCurrentUserId();
            var editSubmitData = await httpService.setModule('countryGroupManagement').update(submitedData);
            hideLoader();
            if (editSubmitData.res.data.status === 'success') {
                // fetchData();       
                history.push('/country-group-management');                  
                ToastsStore.success('Successfully updated');
                
            }
            else {
                // if (editSubmitData.res.data.errors) {
                //     ToastsStore.error('Internal server error');
                //     //ToastsStore.error(editSubmitData.res.data.errors.name.message)
                // }
                // else 
               // console.log()
                if (editSubmitData.res.data.message!=='') {
                   // ToastsStore.success('Successfully Added11');
                    //ToastsStore.warning('Internal server error');
                    ToastsStore.error(editSubmitData.res.data.message)
                }
                 else {
                    //ToastsStore.success('Successfully Added22');
                    ToastsStore.error('Internal server error');
                }
            }
        }
        else {
            
            submitedData['created_by'] = commonJsObj.getCurrentUserId();
            var addSubmitData = await httpService.setModule('countryGroupManagement').create(submitedData);
            hideLoader();
            if (addSubmitData.res.data.status === 'success') {
                e.target.reset();
                history.push('/country-group-management');
                ToastsStore.success('Successfully Added');
            }
            else {
                if (addSubmitData.res.data.message!=='') {
                    // ToastsStore.success('Successfully Added11');
                     //ToastsStore.warning('Internal server error');
                     ToastsStore.error(addSubmitData.res.data.message)
                 }
                  else {
                     //ToastsStore.success('Successfully Added22');
                     ToastsStore.error('Internal server error');
                 }

                // if (addSubmitData.res.data.errors) {
                //     ToastsStore.error('Internal server error');
                //     ToastsStore.error(addSubmitData.res.data.errors.user_name.message)
                // } 
                //  else if (addSubmitData.res.message!=="") {
                //     ToastsStore.error('Internal server error');
                //     ToastsStore.error(addSubmitData.res.message)
                // }
                // else {
                //     ToastsStore.error('Internal server error');
                // }
            }
        }
    }

    let fetchCountryAPI = async () => {
        let countryDetail = await httpService.setModule('country').search({});
        return countryDetail;
    }

    const handleChangeCountry =(changedCountryList) => {
        console.log('e-------',changedCountryList)
        setparticularCountry(changedCountryList)
    }
  
    // const handleChange = async (type, value) =>{
    //     switch (type){
    //         case "country" :
    //             const stateDetail = await fetchStateAPI(value);
    //             if (stateDetail.res.data.status === 'success') {
    //                 setStateDataist(stateDetail.res.data.data);
    //             }
    //         break;

    //         case "state" :
    //             const cityDetail = await fetchCityAPI(value);
    //             if (cityDetail.res.data.status === 'success') {
    //                 setCityDataist(cityDetail.res.data.data);
    //             }
    //         break;
    //         default:
    //             console.log('default')
    //     }
            
    // }

    


    useEffect(() => {

        const fetchData = async () => {
         
                const countryDetail = await fetchCountryAPI();
                if (countryDetail.res.data.status === 'success') {
                    var countryList = [];

                    countryDetail.res.data.data.map((value,index) => {
                        countryList.push({ value: value.id, label: value.name })
                      });
                    setCountryDataist(countryList);                   
                    
                }


            if (props.match.params.id) {
                const fetchCountryGroupManagementDataDetail = await fetchCountryGroupManagementData();
                console.log('fetchCountryGroupManagementDataDetail',fetchCountryGroupManagementDataDetail)
                if (fetchCountryGroupManagementDataDetail.res.data.status === 'success') {
                    
                    setparticularCountry({ value: fetchCountryGroupManagementDataDetail.res.data.data.country_code, label: fetchCountryGroupManagementDataDetail.res.data.data.country.name })
                    setEditDataList(fetchCountryGroupManagementDataDetail.res.data.data);
                }
                hideLoader();
            }


        };
        fetchData();
        

    }, [globalState, props.match.params.id]);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!loderFlag && (Object.keys(editDataList).length) > 0 && (Object.keys(countryDataList).length) > 0 &&  <>
                <ManageView formSubmitData={formSubmitData} dataDetails={dataDetails} editDataList={editDataList}  clientType={clientType} countryDataList={countryDataList} handleChangeCountry={handleChangeCountry} particularCountry={particularCountry} countryError={countryError} idCheck={props.match.params.id?true:false} />
            </>}
            {!loderFlag && (Object.keys(editDataList).length) == 0 && <>
                <ManageView formSubmitData={formSubmitData} dataDetails={dataDetails} editDataList={editDataList}  clientType={clientType} countryDataList={countryDataList}  handleChangeCountry={handleChangeCountry} particularCountry={particularCountry} countryError={countryError} idCheck={props.match.params.id?true:false}/>
            </>}
        </>
    )
}

export default ManageComponent
