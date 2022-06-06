import React, { useState, useEffect, useContext } from 'react';
import ChangePasswordView from './ChangePasswordView';
import httpService from './../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../utils/loader/CustLoader';
import { store } from '../../storage/store';
import { encrypdycrypService } from '../../helpers/encryp-dycryp';
import { commonJsFuncModule as commonJsObj } from '../../utils/commonFunc';


const ChangePasswordComponent = (props) => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);    
    const [userUniqueId, setUniqueId] = useState(false);    


    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

   
    const formSubmitData = async (submitedData) => {
       
        showLoader();
        
        if(props.match.params.uniqueId){
            submitedData['user_id'] = encrypdycrypService.decryptAES(decodeURIComponent(props.match.params.uniqueId));
        }
        else{          
            submitedData['user_id'] =commonJsObj.getCurrentUserId();
        }
       
      
        let userChnagePassword = await httpService.setModule('changePassword').create(submitedData);
        if (userChnagePassword.res.data.status == 'success') {
            hideLoader();             
            ToastsStore.success('Password changed successfully');         
        } else {
            hideLoader();           
            ToastsStore.error(userChnagePassword.res.data.message)
        }
        
    }
    
   

    
   
    
    useEffect(() => {
        if(props.match.params.uniqueId){
            setUniqueId(props.match.params.uniqueId)
        }
      
    }, [globalState, props.match.params.uniqueId]);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!loderFlag && <>
                <ChangePasswordView formSubmitData={formSubmitData} userUniqueId={userUniqueId} />
            </>}
        </>
    )
}

export default ChangePasswordComponent
