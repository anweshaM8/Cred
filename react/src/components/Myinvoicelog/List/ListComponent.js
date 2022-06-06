import React, { useState, useEffect, useContext } from 'react';
import ListView from './ListView';
import httpService from '../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
import AccessErrorView from '../../AccessError/AccessErrorView';
import { history } from '../../../helpers/history';
import moment from 'moment';
const _ = require("lodash");

const ListComponent = (props) => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
    const [paginationPageCount, setPageinatioPageCount] = useState(0);
    //const [dataList, setDataList] = useState({});
    // const [dataUserList, setUserDataList] = useState(false);
    const [paginationData, setPaginationData] = useState({});
    const [curPage, setCurPage] = useState(1);
    const [contentPermission, setContentPermission] = useState(false);    
    const [addContentPermission, setAddContentPermission] = useState(false);  
    const [editContentPermission, setEditContentPermission] = useState(false);  
    const [submitedData,setSubmitedData] = useState({});
    // const [searchDataSetIdentify, setSearchDataSetIdentify] = useState(false); 
    const [dataCustomerReportLogList, setCustomerReportLogList] = useState(false);
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const  currentUserId=  commonJsObj.getCurrentUserId();



    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }


    /************to get invoice list ***************************** */
    let fetchCustomerInvoiceData = async () => {
        showLoader();
        let req_data={};
        req_data.user_id=currentUserId;
        let listDetails = await httpService.setModule('getMyInvoiceList').create(req_data);
        console.log(listDetails.res);
        if (listDetails.res.data.status === 'success') {

              setCustomerReportLogList(listDetails.res.data.data);

              //console.log('listDetails.res.data.data.length',listDetails.res.data.data.length)
              if(listDetails.res.data.pagination){
                setPageinatioPageCount(listDetails.res.data.pagination.pageCount);
                setPaginationData(listDetails.res.data.pagination);
                // let roleListDetails = await httpService.setModule('role').search({});
                // hideLoader();
                // if (roleListDetails.res.data.status === 'success') {
                //     setRoleDataList(roleListDetails.res.data.data);
                // }
            }
           
            hideLoader();
        } else {
            hideLoader(); 
            ToastsStore.error('Internal Server Error');
        }
    }
    /*************************************************************** */
    const checkPermission = ()=>{
        if(commonJsObj.checkUrlPermission(['read-my-invoice-log'])){
            setContentPermission(true);
            //fetchCustomerReportLogApi();
            fetchCustomerInvoiceData();
           
        }   
        // if(commonJsObj.checkUrlPermission(['create-customer-order-price-management'])){
        //     setAddContentPermission(true);
        // }  
        // if(commonJsObj.checkUrlPermission(['update-customer-order-price-management'])){
        //     setEditContentPermission(true);
        // }  
        
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
                <ListView dataCustomerReportLogList={dataCustomerReportLogList} paginationData={paginationData} paginationPageCount={paginationPageCount} handlePageChange={handlePageChange} curPage={curPage} />
            </>}
        </>
    )
}

export default ListComponent
