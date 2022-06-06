import React, { useState, useEffect, useContext } from 'react'
import SingInView from './SingInView';
import httpService from './../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../utils/loader/CustLoader';
import { store } from './../.././storage/store';
import { encrypdycrypService } from '../../helpers/encryp-dycryp';
import {history} from '../../helpers/history';

function SignInComponent() {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
    let showLoader = () => {
        setLoaderFlag(true);
    } 
    let hideLoader = () => {
        setLoaderFlag(false);
    } 
    const loginSubmit = async (submitedData) => {
        showLoader();      
        let registerUser = await httpService.setModule('login').create(submitedData);
        
        if (registerUser.res.data.status == 'success') {
            hideLoader();  
            if(registerUser.res.data.data.is_first_time_login === 1){
                history.push(`/set-password/${encodeURIComponent(encrypdycrypService.encryptAES(registerUser.res.data.data.unique_id))}`)
            }
            else{
                console.log("USER",registerUser.res.data.data.payload);
                let user = JSON.stringify({ creAdminUser: encrypdycrypService.encryptAES(JSON.stringify(registerUser.res.data.data.payload)) });
                //console.log("USER",user);
                localStorage.setItem('creAdminUser', user);
                hideLoader();
                if(registerUser.res.data.data.payload.user.user_type=='SA')
                {
                    history.push('/dashboard')
                }
                else
                {
                    history.push('/search')
                }
                
            }
           
        } else {
            hideLoader();           
            ToastsStore.error(registerUser.res.data.message)
        }
    }


    useEffect(() => {       
    }, [globalState]);
    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {<><SingInView loginSubmit={loginSubmit} /></>}
        </>
    )
}

export default SignInComponent
