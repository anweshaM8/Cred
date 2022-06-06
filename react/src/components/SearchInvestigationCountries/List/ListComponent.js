import React, { useState, useEffect, useContext } from 'react';
import ListView from './ListView';
import httpService from './../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
import AccessErrorView from '../../AccessError/AccessErrorView';


const ListComponent = (props) => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
    const [dataList, setDataList] = useState(false);
    const [contentPermission, setContentPermission] = useState(false);  
    const [addContentPermission, setAddContentPermission] = useState(false);  
    const [editContentPermission, setEditContentPermission] = useState(false);  
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
        let listDetails = await httpService.setModule('SearchInvestigationCountries').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage});
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
    
    const checkPermission = async ()=>{
        if(commonJsObj.checkUrlPermission(['read-search-investigation-countries'])){
            setContentPermission(true);
            fetchAPI();
        }       
        if(commonJsObj.checkUrlPermission(['create-search-investigation-countries'])){
            setAddContentPermission(true);
        }  
        if(commonJsObj.checkUrlPermission(['update-search-investigation-countries'])){
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
        
    }, [globalState, curPage]);
    
    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!contentPermission ? <AccessErrorView /> : ""}
            {!loderFlag && contentPermission && <>
                <ListView   dataList={dataList} addContentPermission={addContentPermission}  editContentPermission={editContentPermission}  handlePageChange={handlePageChange} paginationData={paginationData} paginationPageCount={paginationPageCount} curPage={curPage}  />
            </>}
        </>
    )
}

export default ListComponent
