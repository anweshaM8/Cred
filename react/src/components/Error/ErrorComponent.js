import React, { useState, useEffect, useContext } from 'react';
import ErrorView from './ErrorView';
import CustLoader from '../../utils/loader/CustLoader';
import { store } from '../../storage/store';


const DashboardComponent = () => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);

    // let showLoader = () => {
    //     setLoaderFlag(true); 
    // }
    let hideLoader = () => {
        setLoaderFlag(false);
    }
   
    
    useEffect(() => {
        hideLoader();
    }, [globalState]);
    
    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!loderFlag && <>
                <ErrorView   />
            </>}
        </>
    )
}

export default DashboardComponent
