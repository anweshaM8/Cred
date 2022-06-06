import React, { useState, useEffect, useContext } from 'react';
import ManageView from './ManageView';
import httpService from './../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../utils/loader/CustLoader';
import { store } from '../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../utils/commonFunc';

const ManageComponent = () => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [dataList, setDataList] = useState(false);
    const [curPage, setCurPage] = useState(1);
    const [paginationPageCount, setPageinatioPageCount] = useState(0);
    const [paginationData, setPaginationData] = useState({});

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    let fetchAPI = async () => {
        showLoader();

        let listDetails = await httpService.setModule('contactUs').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage});
        if (listDetails.res.data.status === 'success') {
            setDataList(listDetails.res.data.data);
            if(listDetails.res.data.pagination){
                setPageinatioPageCount(listDetails.res.data.pagination.pageCount);
                setPaginationData(listDetails.res.data.pagination);               
            }
            hideLoader();
        } else {
            hideLoader();
            ToastsStore.error('Internal Server Error');
        }
    }
    const formSubmit = async (submitedData) => {
        showLoader();
        let submitData = await httpService.setModule('contactUs').create(submitedData);        
        if (submitData.res.data.status == 'success') {
            hideLoader();  
            ToastsStore.success('Submitted Successfully');
        } else {
            hideLoader();           
            ToastsStore.error('Internal Server Error');
        }
    }
    const handlePageChange = (e)=>{
        setCurPage(e);
    }
    useEffect(() => {
        if(commonJsObj.getCurrentUserId() == 1){
            fetchAPI();
            
            setIsAdmin(true);
        }
    }, [curPage]); 
    useEffect(() => {
        
    }, [globalState, curPage]); 
 
    return (
        <>
            {loderFlag ? <CustLoader /> : ''}           
            {!loderFlag  && <>
                <ManageView  formSubmit={formSubmit} isAdmin={isAdmin} dataList={dataList} handlePageChange={handlePageChange} paginationData={paginationData} paginationPageCount={paginationPageCount} curPage={curPage} />
            </>}
        </>
    )
}

export default ManageComponent