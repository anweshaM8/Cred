import React, { useState, useEffect, useContext } from 'react';
import ManageView from './ManageView';
import httpService from './../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
import { history } from '../../../helpers/history';

const ManageComponent = (props) => {
    const globalState = useContext(store);
    //let history = useHistory();
    const [loderFlag, setLoaderFlag] = useState(false);
    const [editDataList, setEditDataList] = useState({});

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }    

  
    const fetchContentData = async () => {
        showLoader();
        let editId = props.match.params.id;
        let editData = await httpService.setModule('SearchInvestigationCountries').findOne(editId);
        hideLoader();
        return editData;
    }
    const formSubmitData = async (submitedData, e) => {
        showLoader();
        if (props.match.params.id) {
           
            let formSubmitData = submitedData;
            formSubmitData.id = props.match.params.id;            
           
            submitData(formSubmitData);           
            
        }
        else
        {
            addSubmitData(submitedData);
        }
       
    }

    const addSubmitData = async (data) => {
      
        var addSubmitData = await httpService.setModule('SearchInvestigationCountries').create(data);
        hideLoader();
        if (addSubmitData.res.data.status === 'success') {                                       
            ToastsStore.success('Successfully added');
            history.push('/search-countries');
        }
        else {
            if (addSubmitData.res.data.errors) {
                ToastsStore.error(addSubmitData.res.data.errors.title.message)
            } else {
                ToastsStore.error('Internal server error');
            }
        }
      
        
    }

    const submitData = async (data) => {
        data['created_by'] = commonJsObj.getCurrentUserId();
      
        var editSubmitData = await httpService.setModule('SearchInvestigationCountries').update(data);
        hideLoader();
        if (editSubmitData.res.data.status === 'success') {                                       
            ToastsStore.success('Successfully updated');
            history.push('/search-countries');
        }
        else {
            if (editSubmitData.res.data.errors) {
                ToastsStore.error(editSubmitData.res.data.errors.title.message)
            } else {
                ToastsStore.error('Internal server error');
            }
        }
      
        
    }


    useEffect(() => {

        const fetchData = async () => {

           
            
            if (props.match.params.id) {
                const fetchSiteDataDetail = await fetchContentData();
                if (fetchSiteDataDetail.res.data.status === 'success') {
                    setEditDataList(fetchSiteDataDetail.res.data.data);
                }
            }
           
            


        };
        fetchData();

    }, [globalState, props.match.params.id]);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!loderFlag && (Object.keys(editDataList).length) > 0 && <>
                <ManageView formSubmitData={formSubmitData}  editDataList={editDataList}  />
            </>}
            {!loderFlag && (Object.keys(editDataList).length) == 0 && <>
                <ManageView formSubmitData={formSubmitData}  editDataList={editDataList}  />
            </>}
        </>
    )
}

export default ManageComponent
