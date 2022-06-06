import React, { useState, useEffect, useContext } from 'react';
import ListView from './ListView';
import httpService from './../../../services/httpService';
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
    



    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    let fetchCustomerReportLogApi = async () => {
        showLoader();
        let listDetails = await httpService.setModule('getCustomerReportLogForAdmin').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage,groupByUser:true,groupByInvoiceDate:true,checkPaymentDate:true,checkPaymentOrRebateApprovedate:true});
        if (listDetails.res.data.status === 'success') {

              setCustomerReportLogList(listDetails.res.data.data);

              console.log('listDetails.res.data.data.length',listDetails.res.data.data.length)
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


    const checkPermission = ()=>{
        if(commonJsObj.checkUrlPermission(['read-customer-report-log'])){
            setContentPermission(true);
            fetchCustomerReportLogApi();
           
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


    const updateCustomerReportLog =async (submitedData) =>{
       
        var editSubmitData = await httpService.setModule('updatePaymentInfoForAdmin').update(submitedData);
        hideLoader();
        if (editSubmitData.res.data.status === 'success') {
            // fetchData();       
            window.location.reload()                
            ToastsStore.success('Successfully updated');
            
        }
        else {
            if (editSubmitData.res.data.errors) {
                ToastsStore.error(editSubmitData.res.data.errors.name.message)
            }
            else if (editSubmitData.res.message!=='') {
                ToastsStore.error(editSubmitData.res.message)
            }
             else {
                ToastsStore.error('Internal server error');
            }
        }
    }

    const updatePaymentInfo = (logId,apiType)=>{

        showLoader();

        var submitedData={};

        submitedData.id = logId;

        submitedData['apiType'] = apiType;
        
        if(apiType == 'payment_approve')
        {
            submitedData['payment_approve_status'] = '1';
            submitedData['payment_approve_date'] = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        else
        { 
            
            submitedData['rebate_approve_status'] = '1';
            submitedData['rebate_approve_date'] = moment().format('YYYY-MM-DD HH:mm:ss');
        }

        updateCustomerReportLog(submitedData)
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
                <ListView dataCustomerReportLogList={dataCustomerReportLogList} months={months} updatePaymentInfo={updatePaymentInfo} paginationData={paginationData} paginationPageCount={paginationPageCount} handlePageChange={handlePageChange} curPage={curPage}/>
            </>}
        </>
    )
}

export default ListComponent
