import React, { useState, useEffect, useContext } from 'react';
import SiteSettingView from './SiteSettingView';
import httpService from './../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../utils/loader/CustLoader';
import { store } from '../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../utils/commonFunc';
import AccessErrorView from '../AccessError/AccessErrorView';


const SiteSettingComponent = (props) => {
    const globalState = useContext(store); 
    const [loderFlag, setLoaderFlag] = useState(false);
    const [countryDataList,setCountryDataList] = useState([]);
    const [dataDetails, setDataList] = useState([]);
    const [contentPermission, setContentPermission] = useState(false);    

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    let fetchAPI = async () => {
        showLoader();

        let siteSettingData = await httpService.setModule('siteSetting').search({});
        if (siteSettingData.res.data.status === 'success') {
            setDataList(siteSettingData.res.data.data);
            fetchCountryAPI(); 
            hideLoader();
        } else {
            hideLoader();
            ToastsStore.error('Internal Server Error');
        }
    }
    let fetchCountryAPI = async () => {
        showLoader();

        let countryListData = await httpService.setModule('country').search({});
        if (countryListData.res.data.status === 'success') {
            setCountryDataList(countryListData.res.data.data);
            hideLoader();
        } else {
            hideLoader();
            ToastsStore.error('Internal Server Error');
        }
    }

    const formSubmitData = async (submitedData, e) => {
        showLoader();
        let dataSet = [
            { "access_key": "website_name", "value": submitedData.website_name },
            { "access_key": "contact_mail", "value": submitedData.contact_mail },
            { "access_key": "phone_number", "value": submitedData.phone_number },
            { "access_key": "address", "value": submitedData.address },
            { "access_key": "contact_person", "value": submitedData.contact_person },
            { "access_key": "country_code", "value": submitedData.country_code },
            { "access_key": "city", "value": submitedData.city },
            { "access_key": "state", "value": submitedData.state },
            { "access_key": "country", "value": submitedData.country },
            { "access_key": "postal_code", "value": submitedData.postal_code },

        ]
        submitData(dataSet);
    }

    const submitData = async (data) => {
        httpService.setModule('siteSetting')
        .create(data)
            .then(async (response) => {
                hideLoader();
                if (response.res.data.status === 'success') {
                    if (response.res.data.code === 200) {
                        fetchAPI();
                        ToastsStore.success('You have successfully updated your settings');
                    }
                    else {
                        ToastsStore.error('Internal Server Error');
                    }
                }
                else {
                    ToastsStore.error('Internal Server Error');
                }
            }, (error) => {
                hideLoader();
                ToastsStore.error('Internal Server Error');
            });
    }

    const checkPermission = async ()=>{
        if(commonJsObj.checkUrlPermission(['read-setting'])){
            setContentPermission(true);
            fetchCountryAPI();          
            fetchAPI();
            
            
        }       
    } 
    
    useEffect(() => {    
        checkPermission();    
    }, [globalState]);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!contentPermission ? <AccessErrorView /> : ""}
            {!loderFlag && contentPermission && <>
                <SiteSettingView formSubmitData={formSubmitData} dataDetails={dataDetails} countryDataList={countryDataList}  />
            </>}
        </>
    )
}

export default SiteSettingComponent
