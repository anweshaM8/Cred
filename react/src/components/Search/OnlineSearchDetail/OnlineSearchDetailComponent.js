import React, { useState, useEffect, useContext } from 'react';
import OnlineSearchDetailView from './OnlineSearchDetailView';
import httpService from '../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
import AccessErrorView from '../../AccessError/AccessErrorView';


const OnlineSearchDetailComponent = (props) => {
    const globalState = useContext(store); 
    const [loderFlag, setLoaderFlag] = useState(false);
    const [onlineSearchDetails, setOnlineSearchDetails] = useState([]);
    const [contentPermission, setContentPermission] = useState(false);    

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    let fetchAPI = async () => {
        showLoader();

        let editId = props.match.params.id;
        let onlineSearchDetailsEditData = await httpService.setModule('onlineSearchDetails').search({search_investigation_id:editId});

        if (onlineSearchDetailsEditData.res.data.status === 'success') {

            var onlineSearchDetailsEditDataCopy = onlineSearchDetailsEditData.res.data.data[0];
            onlineSearchDetailsEditDataCopy.company_basic_info = JSON.parse(onlineSearchDetailsEditData.res.data.data[0].company_basic_info);
            onlineSearchDetailsEditDataCopy.company_financial_info = JSON.parse(onlineSearchDetailsEditData.res.data.data[0].company_financial_info);
            onlineSearchDetailsEditDataCopy.company_gst_details = JSON.parse(onlineSearchDetailsEditData.res.data.data[0].company_gst_details);
            onlineSearchDetailsEditDataCopy.company_joint_ventures = JSON.parse(onlineSearchDetailsEditData.res.data.data[0].company_joint_ventures);
            onlineSearchDetailsEditDataCopy.company_securities_allotment = JSON.parse(onlineSearchDetailsEditData.res.data.data[0].company_securities_allotment);
            onlineSearchDetailsEditDataCopy.company_shareholdings = JSON.parse(onlineSearchDetailsEditData.res.data.data[0].company_shareholdings);
           // onlineSearchDetailsEditDataCopy.company_basic_info = JSON.parse(onlineSearchDetailsEditData.res.data.data[0].company_basic_info);

            console.log('onlineSearchDetailsEditDataCopy.company_basic_info',onlineSearchDetailsEditDataCopy)
            setOnlineSearchDetails(onlineSearchDetailsEditDataCopy); 
            hideLoader();
        } else {
            hideLoader();
            ToastsStore.error('Internal Server Error');
        }
    }
    
   
    const checkPermission = async ()=>{
        if(commonJsObj.checkUrlPermission(['read-online-search-details'])){
            setContentPermission(true);          
                   
            
        }       
    } 
    
    useEffect(() => {    
        checkPermission();    
    }, [globalState]);

    useEffect(() => {    
        fetchAPI();     
    }, []);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!contentPermission ? <AccessErrorView /> : ""}
            {!loderFlag && contentPermission && <>
                <OnlineSearchDetailView  onlineSearchDetails={onlineSearchDetails}  />
            </>}
        </>
    )
}

export default OnlineSearchDetailComponent
