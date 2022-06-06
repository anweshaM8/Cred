import React, { useState, useEffect, useContext } from 'react';
import ManageView from './ManageView';
import { useHistory } from "react-router-dom";
import httpService from './../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
// import { history } from '../../../helpers/history';

const ManageComponent = (props) => {
    const globalState = useContext(store);
    let history = useHistory();
    const [loderFlag, setLoaderFlag] = useState(false);
    const [dataDetails, setDataList] = useState({});
    const [editDataList, setEditDataList] = useState({});

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    let fetchData = async () => {
        console.log(props.match.params.id,'props.match.params.id')
        showLoader();
        if (props.match.params.id) {
            let editId = props.match.params.id;
            let roleEditData = await httpService.setModule('role').findOne(editId);
            if (roleEditData.res.data.status === 'success') {
                setEditDataList(roleEditData.res.data.data);
                hideLoader();
            } else {
                hideLoader();
                ToastsStore.error('Internal Server Error');
            }

        }
    }
    let fetchAPI = async () => {
        showLoader();

        let moduleListDetails = await httpService.setModule('moduleList').search({});
        if (moduleListDetails.res.data.status === 'success') {
            setDataList(moduleListDetails.res.data.data);
            hideLoader();
        } else {
            hideLoader();
            ToastsStore.error('Internal Server Error');
        }
    }

    const formSubmitData = async (submitedData, e) => {
       
        showLoader();
        if (props.match.params.id) {
            submitedData.id = props.match.params.id;
            var editSubmitData = await httpService.setModule('role').update(submitedData);
            hideLoader();
            if (editSubmitData.res.data.status === 'success') {
                // fetchData();                         
                history.push('/role');
                ToastsStore.success('Successfully updated');

            }
            else {
                if (editSubmitData.res.data.errors) {
                    ToastsStore.error(editSubmitData.res.data.errors.name.message)
                } else {
                    ToastsStore.error('Internal server error');
                }
            }
        }
        else{
            var addSubmitData = await httpService.setModule('role').create(submitedData);
            hideLoader();
            if (addSubmitData.res.data.status === 'success') {
                e.target.reset();
                ToastsStore.success('Successfully Added');
            }
            else {
                if (addSubmitData.res.data.errors) {
                    ToastsStore.error(addSubmitData.res.data.errors.name.message)
                } else {
                    ToastsStore.error('Internal server error');
                }
            }
        }
        
        

    }
   

    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        fetchAPI();
    }, [globalState]);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!loderFlag && <>
                <ManageView formSubmitData={formSubmitData} dataDetails={dataDetails} editDataList={editDataList} />
            </>}
        </>
    )
}

export default ManageComponent
