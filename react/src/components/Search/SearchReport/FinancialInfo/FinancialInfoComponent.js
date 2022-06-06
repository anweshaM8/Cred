import React, { useState, useEffect, useContext,useRef} from 'react';
import FinancialInfoView from './FinancialInfoView';
import CustLoader from '../../../../utils/loader/CustLoader';
import { store } from '../../../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../../../utils/commonFunc';
import AccessErrorView from '../../../AccessError/AccessErrorView';
import httpService from '../../../../services/httpService';
import { ToastsStore } from 'react-toasts';

const FinancialInfoComponent = (props) => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
    const [readContentPermission, setReadContentPermission] = useState(false);
    const [searchFinancialDataList, setSearchFinancialDataList] = useState(false);
    
    const [paginationPageCount, setPageinatioPageCount] = useState(0);
    const [paginationData, setPaginationData] = useState({});
    const [curPage, setCurPage] = useState(1);

    const [noDataFound, setNoDataFound] = useState(false);

    const [search_id, setSearch_id] = useState(0);

    const currentUserType=  commonJsObj.getUserInfo().user.user_type;
    const  currentUserId=  commonJsObj.getCurrentUserId();

   
    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

   
    let fetchAPI = async (submitedData = null) => {
        showLoader();
        //console.log(2);
        const curUserType=  commonJsObj.getUserInfo().user.user_type;
        const curUserId=  commonJsObj.getCurrentUserId();

        let editId = props.match.params.id;

        if(submitedData==null)
        {
            var listDetails = await httpService.setModule('searchFinancialDocs').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage,curUserType:curUserType,curUserId:curUserId,search_investigation_id:editId});
        }
        else
        {
            var listDetails = await httpService.setModule('searchFinancialDocs').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage,curUserType:curUserType,curUserId:curUserId,search_investigation_id:editId});
        }
        
        
        if (listDetails.res.data.status === 'success') {
            setSearchFinancialDataList(listDetails.res.data.data);
            if (listDetails.res.data.pagination) {
                setPageinatioPageCount(listDetails.res.data.pagination.pageCount);
                setPaginationData(listDetails.res.data.pagination);
            }
            //setSearchListShow(true)
            hideLoader();
        } else {
            hideLoader();
            ToastsStore.error('Internal Server Error');
        }
    }

   
    const checkPermission = () => {
        if (commonJsObj.checkUrlPermission(['read-financial-info'])) {
            setReadContentPermission(true);    
            fetchAPI();        
        }        
    }

    const handlePageChange = (e) => {
        setCurPage(e);
    }

  

    useEffect(() => {
        checkPermission();
       
        //fetchAPI();
    }, []);

    useEffect(() => {
        checkPermission(); 
       
    }, [curPage]);

    // useEffect(() => {
    //     removeiframe();
    //   });
    // useEffect(() => {
    //     removeiframe();
    // }, [onlineSearchDetails]);

    // useEffect(() => {
    //     checkPermission();
    // }, [curPage]);


    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!readContentPermission ? <AccessErrorView /> : ""}
            {!loderFlag && readContentPermission && <>
                <FinancialInfoView  currentUserType={currentUserType} paginationPageCount={paginationPageCount} curPage={curPage} paginationData={paginationData} handlePageChange={handlePageChange} searchFinancialDataList={searchFinancialDataList} />
            </>}
        </>
    )
}

export default FinancialInfoComponent
