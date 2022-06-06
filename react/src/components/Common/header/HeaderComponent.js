import React,{useContext,useEffect} from 'react';
import HeaderView from './HeaderView';
import httpService from '../../../services/httpService';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
import { history } from '../../../helpers/history';
import { store } from '../../../storage/store';

const HeaderComponent =({type}) =>{ 

    const globalState = useContext(store);
    const { dispatch } = globalState;
    useEffect(()=>{
        
        dispatch({ type: 'storeData' })
        
    },[])

    const logoutHandler = async (e) =>{
        e.preventDefault();
        let userId = commonJsObj.getCurrentUserId();
        let ee =await httpService.setModule('logout').create({user_id:userId});
        commonJsObj.removeTokenFromLocStorage();
        history.push('/secure-panel/login')

    }
   
    return (
        <>
            <HeaderView logoutHandler={logoutHandler} type={type}/>
        </>
        
    )
}

export default HeaderComponent;
