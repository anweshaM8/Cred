import React, { useState, useEffect, useContext } from 'react';
import DashboardView from './DashboardView';
import AccessErrorView from '../AccessError/AccessErrorView';
import { ToastsStore } from 'react-toasts';
import httpService from '../../services/httpService';
import CustLoader from '../../utils/loader/CustLoader';
import { store } from '../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../utils/commonFunc';

const DashboardComponent = (props) => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
    const [contentPermission, setContentPermission] = useState(false);    
    const [userDataRowCount, setDataRowCount] = useState({});
    const [userWalletDetails, setUserWalletDetails] = useState(null);
    const [curPage, setCurPage] = useState(1);

    const curUserType=  commonJsObj.getUserInfo().user.user_type;
    const curUserId=  commonJsObj.getCurrentUserId();

   console.log(globalState,'globalState')
    const checkPermission = async ()=>{
        if(commonJsObj.checkUrlPermission(['read-dashboard'])){
            setContentPermission(true);
        }       
    }

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    let onPayNow = (walletId) => {
        console.log('walletId',walletId)
        var confirm = window.confirm('Are you sure you want to pay?');
        if(confirm==true)
        {
            var updatedData={};
            updatedData.id = walletId;
            updatedData['user_id']=curUserId;
            updatedData['total_amount']=0;
            updatedData['rebet_amount']=0;
            updatedData['paid_status']= '0';

            updateWalletAPI(updatedData);
        }
    }

    let updateWalletAPI = async (updatedData) => {
        showLoader();
        let listDetails = await httpService.setModule('wallet').update(updatedData);

        if (listDetails.res.data.status === 'success') {      
           // console.log('listDetails.res.data',listDetails.res.data)
            hideLoader();
            window.location.reload();                
            ToastsStore.success('Payment done successfully');
        } else {
            hideLoader();

            ToastsStore.error(listDetails.res.data.message);
            
        }
    }

    let fetchUserAPI = async () => {
        showLoader();
        let listDetails = await httpService.setModule('getUserListCount').search({});

        if (listDetails.res.data.status === 'success') {      
           // console.log('listDetails.res.data',listDetails.res.data)
            setDataRowCount(listDetails.res.data.data.rowCount);
            hideLoader();
        } else {
            hideLoader();
            
        }
    }

    let fetchWalletAPI = async () => {
        showLoader();
        let listDetails = await httpService.setModule('wallet').search({user_id:curUserId});
        if (listDetails.res.data.status === 'success') {      
           // console.log('listDetails.res.data',listDetails.res.data)
            setUserWalletDetails(listDetails.res.data.data[0]);
            hideLoader();
        } else {
            hideLoader();
            
        }
    }

    useEffect(() => {
       if(curUserType=='SA' || curUserType=='Sub')
       {
        fetchUserAPI()
       }
        
        fetchWalletAPI()
    }, []);

    useEffect(() => {
        checkPermission();  
       // fetchUserAPI();     
    }, [globalState]);
    return (
        
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!contentPermission ? <AccessErrorView /> : ""}
            {!loderFlag && contentPermission && <>
                <DashboardView  userDataRowCount={userDataRowCount} curUserType={curUserType} userWalletDetails={userWalletDetails} onPayNow={onPayNow}/>
            </>}
        </>
    )
}

export default DashboardComponent
