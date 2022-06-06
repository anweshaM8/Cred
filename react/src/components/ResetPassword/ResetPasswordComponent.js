import React, { useState, useEffect, useContext } from 'react';
import ResetPasswordView from './ResetPasswordView';
import httpService from './../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../utils/loader/CustLoader';
import { store } from '../../storage/store';
import { encrypdycrypService } from '../../helpers/encryp-dycryp';
import { commonJsFuncModule as commonJsObj } from '../../utils/commonFunc';


const ResetPasswordComponent = (props) => {
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
            submitedData['user_name_enc'] = props.match.params.uniqueId;
        }
        else{          
            submitedData['user_name_enc'] =commonJsObj.getCurrentUserId();
        }
       
      
        let userResetPassword = await httpService.setModule('resetPassword').create(submitedData);
        if (userResetPassword.res.data.status == 'success') {
            hideLoader();             
            ToastsStore.success('Password updated Sucessfully');         
        } else {
            hideLoader();           
            ToastsStore.error(userResetPassword.res.data.message)
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
                <ResetPasswordView formSubmitData={formSubmitData} />
            </>}
        </>
    )
}

export default ResetPasswordComponent
