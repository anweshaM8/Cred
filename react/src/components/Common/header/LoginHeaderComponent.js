import React,{useContext,useEffect} from 'react';

import { store } from '../../../storage/store';


const LoginHeaderComponent =() =>{ 
    const globalState = useContext(store);

    const { dispatch } = globalState;
    useEffect(()=>{
        //console.log('header')
        dispatch({ type: 'storeData' })
        
    },[])
   
    

    return (
        <>
            
        </>
        
    )
}

export default LoginHeaderComponent;
