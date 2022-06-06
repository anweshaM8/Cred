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
    const [paginationPageCount, setPageinatioPageCount] = useState(0);
    const [dataList, setDataList] = useState({});
    const [paginationData, setPaginationData] = useState({});
    const [curPage, setCurPage] = useState(1);
    const [contentPermission, setContentPermission] = useState(false);    
    const [addContentPermission, setAddContentPermission] = useState(false);  
    const [branchOfficeContentPermission, setBranchOfficeContentPermission] = useState(false);      
    const [editContentPermission, setEditContentPermission] = useState(false);  
    const [clientType, setClientType] = useState({});
    const [roleDataList, setRoleDataList] = useState({}); 
    const [searchDataSetIdentify, setSearchDataSetIdentify] = useState(false); 
    const [searchData, setSearchData] = useState({}); 
    const [heading,setHeading] =useState('User List');

    console.log('common',commonJsObj.getUserInfo().user.user_type)
    const currentUserType=  commonJsObj.getUserInfo().user.user_type;
    const  currentUserId=  commonJsObj.getCurrentUserId();


    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    let fetchAPI = async (searchKeyword=null, customerType= null, registrationType=null, userStatus=null, headOfficeUserId = null) => {
        showLoader();
        let listDetails = await httpService.setModule('user').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage, search:searchKeyword, registration_type:registrationType, type:customerType, status: userStatus, head_office_user_id:headOfficeUserId });

        if (listDetails.res.data.status === 'success') {      
            setDataList(listDetails.res.data.data);
            if(listDetails.res.data.pagination){
                setPageinatioPageCount(listDetails.res.data.pagination.pageCount);
                setPaginationData(listDetails.res.data.pagination);
                let roleListDetails = await httpService.setModule('role').search({});
                hideLoader();
                if (roleListDetails.res.data.status === 'success') {
                    setRoleDataList(roleListDetails.res.data.data);
                }
            }
            hideLoader();
        } else {
            hideLoader();
            ToastsStore.error('Internal Server Error');
        }
    }
    const checkPermission = ()=>{
        if(commonJsObj.checkUrlPermission(['read-user'])){
            setContentPermission(true);
            fetchAPI();
            setClientType([
                {"id":"A","name":"Agent"},
                {"id":"Sub","name":"Sub Admin"},
                {"id":"I","name":"Individual User"},
                {"id":"HO","name":"Head Office"},
                {"id":"BO","name":"Branch Office"}
            ]);
           
        }   
        if(commonJsObj.checkUrlPermission(['create-user'])){
            setAddContentPermission(true);
        }  
        if(commonJsObj.checkUrlPermission(['update-user'])){
            setEditContentPermission(true);
        }  
        if(commonJsObj.checkUrlPermission(['read-branch-office-listing'])){
            setBranchOfficeContentPermission(true);
            fetchAPI('',"BO","","",commonJsObj.getCurrentUserId() );
        } 
        
    }
    const activeStatusChangeHandler = (id, status) => {
        let data = {
            id: id,
            is_active: status,
            model: "user"
        }

        httpService.setModule('statusChange')
        .update(data)
        .then((response) => { 
            fetchAPI();
            ToastsStore.success('Updated successfully');
        })
        .catch((e)=>{
            ToastsStore.error('Internal Server Error!.');
        })
    }

    const activeDownloadStatusChangeHandler = (id, status) => {
        let data = {
            id: id,
            download_status: status,
            model: "user"
        }

        httpService.setModule('downloadstatusChange')
        .update(data)
        .then((response) => { 
            fetchAPI();
            ToastsStore.success('Updated successfully');
        })
        .catch((e)=>{
            ToastsStore.error('Internal Server Error!.');
        })
    }
    const handlePageChange = (e)=>{
        setCurPage(e);
    }
       
    const searchFormSubmitData = (data)=>{
        setSearchDataSetIdentify(true);
        setSearchData(data);
        if(commonJsObj.checkUrlPermission(['read-user'])){
            fetchAPI(data.search,data.customer_type,data.registration_type,data.status,'');
            
        }    
        else{
            setBranchOfficeContentPermission(true);
           
            fetchAPI(data.search,'BO',"",data.status,commonJsObj.getCurrentUserId());

        }

    }
    const resetSearch = () =>{
        setSearchDataSetIdentify(false);
        setSearchData({});
       
        if(commonJsObj.checkUrlPermission(['read-user'])){
            fetchAPI(); 
        } 
        else{
            
            setBranchOfficeContentPermission(true);
            fetchAPI("",'BO',"","",commonJsObj.getCurrentUserId());

        }

    }
  
    useEffect(() => {
        checkPermission(); 
        var userType = commonJsObj.getUserInfo().user.user_type;
        if(userType=="HO") 
        {
            setHeading('Branch office User List')  
        }      
    }, [curPage]);

    useEffect(() => {
    }, [globalState, curPage]);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {(!contentPermission   && !branchOfficeContentPermission )? <AccessErrorView /> : ""}
            {!loderFlag && (contentPermission || branchOfficeContentPermission) && <>
                <ListView heading={heading} dataList={dataList} activeStatusChangeHandler={activeStatusChangeHandler} activeDownloadStatusChangeHandler={activeDownloadStatusChangeHandler} paginationData={paginationData} paginationPageCount={paginationPageCount} handlePageChange={handlePageChange} addContentPermission={addContentPermission} editContentPermission={editContentPermission} curPage={curPage}  clientType={clientType} roleDataList={roleDataList} searchFormSubmitData={searchFormSubmitData} searchDataSetIdentify={searchDataSetIdentify} resetSearch={resetSearch} searchData={searchData} branchOfficeContentPermission={branchOfficeContentPermission} contentPermission={contentPermission} currentUserType={currentUserType} />
            </>}
        </>
    )
}

export default ListComponent
