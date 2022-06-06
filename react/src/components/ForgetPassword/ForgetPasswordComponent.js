import React, { useState, useEffect, useContext } from 'react';
import ForgetPasswordView from './ForgetPasswordView';
import httpService from './../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../utils/loader/CustLoader';
import { store } from '../../storage/store';
import { encrypdycrypService } from '../../helpers/encryp-dycryp';
import { commonJsFuncModule as commonJsObj } from '../../utils/commonFunc';


const ForgetPasswordComponent = (props) => {
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
        
        // if(props.match.params.uniqueId){
        //     submitedData['user_id'] = encrypdycrypService.decryptAES(decodeURIComponent(props.match.params.uniqueId));
        // }
        // else{          
        //     submitedData['user_id'] =commonJsObj.getCurrentUserId();
        // }
       
      
        let userForgetPassword = await httpService.setModule('forgetPassword').create(submitedData);
        if (userForgetPassword.res.data.status == 'success') {
            hideLoader();             
            ToastsStore.success('A link has been sent to you in your email.Please proceed for further action.',10000);         
        } else {
            hideLoader();           
            ToastsStore.error(userForgetPassword.res.data.message)
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
                <ForgetPasswordView formSubmitData={formSubmitData} />
            </>}
        </>
    )
}

export default ForgetPasswordComponent
