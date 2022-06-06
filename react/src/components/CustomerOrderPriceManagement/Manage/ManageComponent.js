import React, { useState, useEffect, useContext } from 'react';
import ManageView from './ManageView';
import httpService from './../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { history } from '../../../helpers/history';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
const _ = require("lodash");

const ManageComponent = (props) => {
    const globalState = useContext(store);
    //let history = useHistory();
    const [loderFlag, setLoaderFlag] = useState(false);
    const [dataDetails, setDataList] = useState({});
    const [editDataList, setEditDataList] = useState({});
    const [dataUserList, setUserDataList] = useState(false);
    const [changedUser, setChangedUser] = useState(0);
    const [userError , setUserError] = useState(false);
    const [dataCountryGroupList, setCountryGroupDataList] = useState(false);
    const [changedCountryGroup, setChangedCountryGroup] = useState(0);
    const [countryGroupError , setCountryGroupError] = useState(false);


    console.log('props',props)

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

    const fetchCustomerOrderPricData = async () => {
        showLoader();
        let editId = props.match.params.id;
        let customerOrderPriceManagementEditData = await httpService.setModule('customerOrderPriceManagement').findOne(editId);
        
        return customerOrderPriceManagementEditData;
    }
    
    const formSubmitData = async (submitedData, e) => {

        console.log('submitedData',submitedData)

        if(changedUser!=0)
        {
            submitedData['user_id'] = parseInt(changedUser.value);
            setUserError(false);
        }
        else
        {
            setUserError(true)
            return false;
        }

        if(changedCountryGroup!=0)
        {
            submitedData['group_id'] = parseInt(changedCountryGroup.value);
            setCountryGroupError(false);
        }
        else
        {
            setCountryGroupError(true)
            return false;
        }
       
        showLoader();
        if (props.match.params.id) {
            submitedData.id = props.match.params.id;
            submitedData['created_by'] = commonJsObj.getCurrentUserId();
            var editSubmitData = await httpService.setModule('customerOrderPriceManagement').update(submitedData);
            hideLoader();
            if (editSubmitData.res.data.status === 'success') {
                fetchCustomerOrderPricData();       
                history.push('/customer-order-price-management');                  
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
        else {
            
            submitedData['created_by'] = commonJsObj.getCurrentUserId();
            var addSubmitData = await httpService.setModule('customerOrderPriceManagement').create(submitedData);
            hideLoader();
            if (addSubmitData.res.data.status === 'success') {
                e.target.reset();
                history.push('/customer-order-price-management');
                ToastsStore.success('Successfully Added');
            }
            else {

                if (addSubmitData.res.data.errors) {
                    ToastsStore.error(addSubmitData.res.data.errors.user_name.message)
                } 
                 else if (addSubmitData.res.message!=="") {
                    ToastsStore.error(addSubmitData.res.message)
                }
                else {
                    ToastsStore.error('Internal server error');
                }
            }
        }
    }


    const handleUserChange = async (userId) =>{
        setChangedUser(userId);
    }

    const handleCountryGroupChange = async (groupId) =>{
        console.log('groupId',groupId)
        setChangedCountryGroup(groupId);
    }

    useEffect(() => {

        const fetchData = async () => {
         

            if (props.match.params.id) {
                var customerOrderPriceDetail = await fetchCustomerOrderPricData();
                console.log('customerOrderPriceDetail',customerOrderPriceDetail)
                if (customerOrderPriceDetail.res.data.status === 'success') {
                    setChangedUser({ value: customerOrderPriceDetail.res.data.data.user_id, label: customerOrderPriceDetail.res.data.data.userDetail.name });
                    setChangedCountryGroup({ value: customerOrderPriceDetail.res.data.data.group_id, label: customerOrderPriceDetail.res.data.data.countryGroupManagement.group_name });

                     customerOrderPriceDetail.res.data.data['userDet']={ value: customerOrderPriceDetail.res.data.data.user_id, label: customerOrderPriceDetail.res.data.data.userDetail.name };
                     customerOrderPriceDetail.res.data.data['groupDet']={ value: customerOrderPriceDetail.res.data.data.group_id, label: customerOrderPriceDetail.res.data.data.countryGroupManagement.group_name };
                     console.log('customerOrderPriceDetail111111',customerOrderPriceDetail)
                     setEditDataList(customerOrderPriceDetail.res.data.data);
                }
                hideLoader();
            }


        };
        fetchData();

    }, [globalState, props.match.params.id]);

    useEffect(() => {
        fetchUserApi();
        fetchCountryGroupApi();

    },[])

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!loderFlag && (Object.keys(editDataList).length) > 0 && (Object.keys(dataUserList).length) > 0 &&  <>
                <ManageView formSubmitData={formSubmitData} dataDetails={dataDetails} editDataList={editDataList} dataUserList={dataUserList} handleUserChange={handleUserChange} userError={userError} changedUser={changedUser} dataCountryGroupList={dataCountryGroupList} handleCountryGroupChange={handleCountryGroupChange} countryGroupError={countryGroupError} changedCountryGroup={changedCountryGroup}  />
            </>}
            {!loderFlag && (Object.keys(editDataList).length) == 0 && <>
                <ManageView formSubmitData={formSubmitData} dataDetails={dataDetails} editDataList={editDataList} dataUserList={dataUserList} handleUserChange={handleUserChange} userError={userError} changedUser={changedUser} dataCountryGroupList={dataCountryGroupList} handleCountryGroupChange={handleCountryGroupChange} countryGroupError={countryGroupError} changedCountryGroup={changedCountryGroup} />
            </>}
        </>
    )
}

export default ManageComponent
