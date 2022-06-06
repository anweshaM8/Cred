import React, { useState, useEffect, useContext } from 'react';
import ListView from './ListView';
import httpService from './../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
import AccessErrorView from '../../AccessError/AccessErrorView';
const _ = require("lodash");

const ListComponent = (props) => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
    const [paginationPageCount, setPageinatioPageCount] = useState(0);
    const [dataList, setDataList] = useState({});
    // const [dataUserList, setUserDataList] = useState(false);
    const [paginationData, setPaginationData] = useState({});
    const [curPage, setCurPage] = useState(1);
    const [contentPermission, setContentPermission] = useState(false);    
    const [addContentPermission, setAddContentPermission] = useState(false);  
    const [editContentPermission, setEditContentPermission] = useState(false);  
    const [submitedData,setSubmitedData] = useState({});
    const [searchDataSetIdentify, setSearchDataSetIdentify] = useState(false); 
    const [dataUserList, setUserDataList] = useState(false);
    const [changedUser, setChangedUser] = useState(0);
    const [dataCountryGroupList, setCountryGroupDataList] = useState(false);
    const [changedCountryGroup, setChangedCountryGroup] = useState(0);



    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    let fetchUserApi = async () => {
        showLoader();
        let listDetails = await httpService.setModule('user').search({});
        if (listDetails.res.data.status === 'success') {

            var userList = [];

            listDetails.res.data.data.map((value,index) => {
                userList.push({ value: value.id, label: value.userDetail.name })
              });
            setUserDataList(userList);
           
            hideLoader();
        } else {
            hideLoader(); 
            ToastsStore.error('Internal Server Error');
        }
    }

    let fetchCountryGroupApi = async () => {
        showLoader();
        let listDetails = await httpService.setModule('countryGroupManagement').search({groupBy:true});
        if (listDetails.res.data.status === 'success') {

            var countryGroupList = [];

            listDetails.res.data.data.map((value,index) => {
                countryGroupList.push({ value: value.id, label: value.group_name })
              });
            setCountryGroupDataList(countryGroupList);
           
            hideLoader();
        } else {
            hideLoader(); 
            ToastsStore.error('Internal Server Error');
        }
    }


    let fetchAPI = async (submitedData=null) => {
        showLoader();

        if(submitedData==null)
        {
            var listDetails = await httpService.setModule('customerOrderPriceManagement').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage});
        }
        else
        {
            var listDetails = await httpService.setModule('customerOrderPriceManagement').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage,search:submitedData.search,group_id:submitedData.group_id,user_id:submitedData.user_id,order_type:submitedData.order_type});
        }   
        if (listDetails.res.data.status === 'success') {
            setDataList(listDetails.res.data.data);
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


    // let fetchSearchAPI = async (search,group_type,country_code) => {
    //     showLoader();

        
    //     if (listDetails.res.data.status === 'success') {
    //         setDataList(listDetails.res.data.data);
    //         if(listDetails.res.data.pagination){
    //             setPageinatioPageCount(listDetails.res.data.pagination.pageCount);
    //             setPaginationData(listDetails.res.data.pagination);
    //             // let roleListDetails = await httpService.setModule('role').search({});
    //             // hideLoader();
    //             // if (roleListDetails.res.data.status === 'success') {
    //             //     setRoleDataList(roleListDetails.res.data.data);
    //             // }
    //         }
    //         hideLoader();
    //     } else {
    //         hideLoader();
    //         ToastsStore.error('Internal Server Error');
    //     }
    // }

    const checkPermission = ()=>{
        if(commonJsObj.checkUrlPermission(['read-customer-order-price-management'])){
            setContentPermission(true);
            fetchAPI();
           
        }   
        if(commonJsObj.checkUrlPermission(['create-customer-order-price-management'])){
            setAddContentPermission(true);
        }  
        if(commonJsObj.checkUrlPermission(['update-customer-order-price-management'])){
            setEditContentPermission(true);
        }  
        
    }
 
    const handlePageChange = (e)=>{
        setCurPage(e);
    }

    const handleUserChange = async (userId) =>{
        setChangedUser(userId);
    }

    const handleCountryGroupChange = async (groupId) =>{
        setChangedCountryGroup(groupId);
    }

    const formSubmitData = async (submitedData) => {

        console.log('submitedData',submitedData)
        if(changedUser!=0)
        {
            submitedData['user_id'] = parseInt(changedUser.value);
        }

        if(changedCountryGroup!=0)
        {
            submitedData['group_id'] = parseInt(changedCountryGroup.value);
        }
        
        setSubmitedData(submitedData)
        setSearchDataSetIdentify(true);
        fetchAPI(submitedData);
    }
    

    const resetSearch = () =>{
        setSearchDataSetIdentify(false);
        setSubmitedData({});
        setChangedUser(0);
        setChangedCountryGroup(0);
        //setparticularCountry(null);
        if(commonJsObj.checkUrlPermission(['read-customer-order-price-management'])){
            fetchAPI(); 
        } 

    }

       
  
    useEffect(() => {
        checkPermission(); 
        fetchUserApi();
        fetchCountryGroupApi();       
    }, [curPage]);

    useEffect(() => {
    }, [globalState, curPage]);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!contentPermission ? <AccessErrorView /> : ""}
            {!loderFlag && contentPermission && <>
                <ListView paginationData={paginationData} resetSearch={resetSearch} searchDataSetIdentify={searchDataSetIdentify}  submitedData={submitedData}  formSubmitData={formSubmitData} dataList={dataList} paginationPageCount={paginationPageCount} handlePageChange={handlePageChange} addContentPermission={addContentPermission} editContentPermission={editContentPermission} curPage={curPage} dataUserList={dataUserList} handleUserChange={handleUserChange} dataCountryGroupList={dataCountryGroupList} handleCountryGroupChange={handleCountryGroupChange} changedUser={changedUser} changedCountryGroup={changedCountryGroup} />
            </>}
        </>
    )
}

export default ListComponent
