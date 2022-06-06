import React, { useState, useEffect, useContext } from 'react';
import ManageReportFieldView from './ManageReportFieldView';
import { useHistory } from "react-router-dom";
import httpService from '../../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../../utils/loader/CustLoader';
import { store } from '../../../../storage/store';
import { history } from '../../../../helpers/history';

const ManageComponent = (props) => {
    const globalState = useContext(store);
    let history = useHistory();
    const [loderFlag, setLoaderFlag] = useState(false);
    const [editDataList, setEditDataList] = useState({});
    const [editcompanyFinancialInfoData, setEditcompanyFinancialInfoData] = useState([]);
    const [editorValue, setEditorValue] = useState("");
    const [editFormValues, setEditFormValues] = useState({});

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

   const fetchContentData = async () => {
        showLoader();
        let editId = props.match.params.id;
        let editData = await httpService.setModule('onlineSearchDetails').findOne(editId);
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
       
    }

    const submitData = async (data) => {
        //data['created_by'] = commonJsObj.getCurrentUserId();

        var editSubmitData = await httpService.setModule('riskScoreUpdate').update(data);
        hideLoader();
        if (editSubmitData.res.data.status === 'success') {                                       
            ToastsStore.success('Successfully updated');
            history.push('/search');
        }
        else {
            if (editSubmitData.res.data.errors) {
                ToastsStore.error(editSubmitData.res.data.errors.title.message)
            } else {
                ToastsStore.error('Internal server error');
            }
        }
      
        
    }

    const onChangeEditField = async (type) => {
        
    }


    useEffect(() => {

        const fetchData = async () => {

           
            
            if (props.match.params.id) {
                const fetchSiteDataDetail = await fetchContentData();
                if (fetchSiteDataDetail.res.data.status === 'success') {
                    setEditDataList(fetchSiteDataDetail.res.data.data);
                    if(fetchSiteDataDetail.res.data.data.company_financial_info!=null)
                    {
                        var editdata={};
                        if(fetchSiteDataDetail.res.data.data.company_type=="llp")
                        {
                            var company_financial=JSON.parse(fetchSiteDataDetail.res.data.data.company_financial_info);
                              if(company_financial.length>0)
                              {
                                company_financial.map((el1,index1) => {
                                    editdata['contribution_received'+index1]= el1.statement_of_assets_and_liabilities.liabilities.contribution_received;
                                    editdata['reserves_and_surplus'+index1]= el1.statement_of_assets_and_liabilities.liabilities.reserves_and_surplus;
                                  });
                              }

                              console.log('editdata',editdata)


                        }

                        setEditFormValues(editdata);
                       
                        setEditcompanyFinancialInfoData(JSON.parse(fetchSiteDataDetail.res.data.data.company_financial_info))
                        
                        console.log('JSON.parse(fetchSiteDataDetail.res.data.data.company_financial_info)',JSON.parse(fetchSiteDataDetail.res.data.data.company_financial_info))
                    }
                    
                    
                }
            }
           
            


        };
        fetchData();

    }, [globalState, props.match.params.id]);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!loderFlag && (Object.keys(editDataList).length) > 0 && <>
                <ManageReportFieldView editFormValues={editFormValues} formSubmitData={formSubmitData}  editDataList={editDataList} editcompanyFinancialInfoData={editcompanyFinancialInfoData}  />
            </>}
            {!loderFlag && (Object.keys(editDataList).length) == 0 && <>
                <ManageReportFieldView editFormValues={editFormValues} formSubmitData={formSubmitData}  editDataList={editDataList} editcompanyFinancialInfoData={editcompanyFinancialInfoData} />
            </>}
        </>
    )
}

export default ManageComponent
