import React, { useState, useEffect, useContext } from 'react';
import SetPasswordView from './SetPasswordView';
import { ToastsStore } from 'react-toasts';
import { store } from './../.././storage/store';
import { encrypdycrypService } from '../../helpers/encryp-dycryp';
import CustLoader from '../../utils/loader/CustLoader';
import httpService from './../../services/httpService';
import {history} from '../../helpers/history';

const SetPasswordComponent = (props) => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);

    let showLoader = () => {
        setLoaderFlag(true); 
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }
    const formSubmitData = async (submitedData) =>{
        showLoader();
        submitedData['unique_id'] = encrypdycrypService.decryptAES(decodeURIComponent(props.match.params.uniqueId));
        let userSetPassword = await httpService.setModule('setPassword').create(submitedData);
        if (userSetPassword.res.data.status == 'success') {
            hideLoader();             
            let user = JSON.stringify({ wpaAdminUser: encrypdycrypService.encryptAES(JSON.stringify(userSetPassword.res.data.data.payload)) });
            localStorage.setItem('wpaAdminUser', user);
            hideLoader();
            history.push('/secure-panel/dashboard')
        } else {
            hideLoader();           
            ToastsStore.error(userSetPassword.res.data.message)
        }
        
    }
   

    
    useEffect(() => {
       
    }, [globalState, props.match.params.uniqueId]);
    
    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!loderFlag && <>
                <SetPasswordView  formSubmitData={formSubmitData} />
            </>}
        </>
    )
}

export default SetPasswordComponent
