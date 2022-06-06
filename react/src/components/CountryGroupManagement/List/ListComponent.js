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
    const [dataCountryList, setCountryDataList] = useState(false);
    const [paginationData, setPaginationData] = useState({});
    const [curPage, setCurPage] = useState(1);
    const [contentPermission, setContentPermission] = useState(false);    
    const [addContentPermission, setAddContentPermission] = useState(false);  
    const [editContentPermission, setEditContentPermission] = useState(false);  
    const [clientType, setClientType] = useState({});
    const [roleDataList, setRoleDataList] = useState({}); 
    const [submitedData,setSubmitedData] = useState({});
    const [particularCountry, setparticularCountry] = useState(null);
    const [searchDataSetIdentify, setSearchDataSetIdentify] = useState(false); 

    let userObj = commonJsObj.getUserInfo();

    console.log('userObj',userObj)



    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    let fetchCountryApi = async () => {
        showLoader();
        let listDetails = await httpService.setModule('country').search({});
        if (listDetails.res.data.status === 'success') {

            var countryList = [];

            listDetails.res.data.data.map((value,index) => {
                countryList.push({ value: value.id, label: value.name })
              });
            setCountryDataList(countryList);
           
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
            var listDetails = await httpService.setModule('countryGroupManagement').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage});
        }
        else
        {
            var listDetails = await httpService.setModule('countryGroupManagement').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage,search:submitedData.search,group_type:submitedData.group_type,country_code:submitedData.country_code});
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

    const handleChangeCountry =(changedCountryList) => {
        console.log('e-------',changedCountryList)
        setparticularCountry(changedCountryList);
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
        if(commonJsObj.checkUrlPermission(['read-country-group-management'])){
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
        if(commonJsObj.checkUrlPermission(['create-country-group-management'])){
            setAddContentPermission(true);
        }  
        if(commonJsObj.checkUrlPermission(['update-country-group-management'])){
            setEditContentPermission(true);
        }  

        fetchCountryApi();
        
    }
    // const activeStatusChangeHandler = (id, status) => {
    //     let data = {
    //         id: id,
    //         is_active: status,
    //         model: "user"
    //     }

    //     httpService.setModule('statusChange')
    //     .update(data)
    //     .then((response) => { 
    //         fetchAPI();
    //         ToastsStore.success('Updated successfull');
    //     })
    //     .catch((e)=>{
    //         ToastsStore.error('Internal Server Error!.');
    //     })
    // }
    const handlePageChange = (e)=>{
        setCurPage(e);
    }

    const formSubmitData = async (submitedData) => {

        console.log('particularCountry',particularCountry)

        if(particularCountry!==null)
        {
            //const countryIds = _.map(particularCountry, 'value');
            submitedData['country_code'] = particularCountry.value;
        }
        console.log('submitedData',submitedData)
        setSubmitedData(submitedData)
        setSearchDataSetIdentify(true);
        fetchAPI(submitedData);
    }

    const resetSearch = () =>{
        setSearchDataSetIdentify(false);
        setSubmitedData({});
        setparticularCountry(null);
        if(commonJsObj.checkUrlPermission(['read-country-group-management'])){
            fetchAPI(); 
        } 

    }

       
  
    useEffect(() => {
        checkPermission();        
    }, [curPage]);

    useEffect(() => {
    }, [globalState, curPage]);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!contentPermission ? <AccessErrorView /> : ""}
            {!loderFlag && contentPermission && <>
                <ListView resetSearch={resetSearch} searchDataSetIdentify={searchDataSetIdentify} particularCountry={particularCountry} submitedData={submitedData} handleChangeCountry={handleChangeCountry}  formSubmitData={formSubmitData} dataList={dataList} dataCountryList={dataCountryList} paginationData={paginationData} paginationPageCount={paginationPageCount} handlePageChange={handlePageChange} addContentPermission={addContentPermission} editContentPermission={editContentPermission} curPage={curPage}  clientType={clientType} roleDataList={roleDataList}/>
            </>}
        </>
    )
}

export default ListComponent
