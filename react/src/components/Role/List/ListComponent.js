import React, { useState, useEffect, useContext } from 'react';
import ListView from './ListView';
import httpService from './../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
import AccessErrorView from '../../AccessError/AccessErrorView';


const ListComponent = () => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
    const [dataList, setDataList] = useState(false);
    const [curPage, setCurPage] = useState(1);
    const [contentPermission, setContentPermission] = useState(false);    
    const [addContentPermission, setAddContentPermission] = useState(false); 
    const [editContentPermission, setEditContentPermission] = useState(false);  
    const [submitedData,setSubmitedData] = useState({});
    const [particularCountry, setparticularCountry] = useState(null);
    const [searchDataSetIdentify, setSearchDataSetIdentify] = useState(false); 

    let showLoader = () => {
        setLoaderFlag(true); 
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }
    
    let fetchAPI = async (submitedData=null) => {
        showLoader();
        if(submitedData==null)
        {
            var listDetails = await httpService.setModule('role').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage});
        }
        else
        {
            var listDetails = await httpService.setModule('role').search({search:submitedData.search});
        }   
       // let listDetails = await httpService.setModule('role').search({});
        if (listDetails.res.data.status === 'success') {
            setDataList(listDetails.res.data.data);
            hideLoader();
        } else {
            hideLoader();
            ToastsStore.error('Internal Server Error');
        }
    }

    const formSubmitData = async (submitedData) => {
      
        console.log('submitedData',submitedData)
        setSubmitedData(submitedData)
        setSearchDataSetIdentify(true);
        fetchAPI(submitedData);
    }

    const resetSearch = () =>{
        setSearchDataSetIdentify(false);
        setSubmitedData({});
       
        if(commonJsObj.checkUrlPermission(['read-role'])){
            fetchAPI(); 
        } 

    }

    
   const checkPermission = async ()=>{
        if(commonJsObj.checkUrlPermission(['read-role'])){
            setContentPermission(true);
            fetchAPI();
        }       
        if(commonJsObj.checkUrlPermission(['create-role'])){
            setAddContentPermission(true);
        }  
        if(commonJsObj.checkUrlPermission(['update-role'])){
            setEditContentPermission(true);
        }
    }
    
    const handlePageChange = (e)=>{
        setCurPage(e);
    }
  
    useEffect(() => {
        checkPermission();
    }, []);
    useEffect(() => {
    }, [globalState]);
    
    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!contentPermission ? <AccessErrorView /> : ""}
            {!loderFlag && contentPermission && <>
                <ListView handlePageChange={handlePageChange} resetSearch={resetSearch} formSubmitData={formSubmitData} searchDataSetIdentify={searchDataSetIdentify} submitedData={submitedData}  dataList={dataList} addContentPermission={addContentPermission} editContentPermission={editContentPermission}/>
            </>}
        </>
    )
}

export default ListComponent
