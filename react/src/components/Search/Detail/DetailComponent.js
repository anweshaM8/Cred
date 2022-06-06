import React, { useState, useEffect, useContext,useRef } from 'react';
import DetailView from './DetailView';
import httpService from './../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
import AccessErrorView from '../../AccessError/AccessErrorView';
import moment from 'moment';
import S3BucketService from './../../../services/s3-bucket.service';
import { history } from '../../../helpers/history';


const ListComponent = (props) => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
    const [contentPermission, setContentPermission] = useState(false);   
    const [searchDataList, setSearchDataList] = useState(false);
    const [noDataFound, setNoDataFound] = useState(false);
    const [paginationPageCount, setPageinatioPageCount] = useState(0);
    const [paginationData, setPaginationData] = useState({});
    const [curPage, setCurPage] = useState(1);
    const [url, setUrl] = useState('');
    const [pdfError, setPdfError] = useState(false);
    const [submitedData, setSubmitedData] = useState({});
    const [searchDataSetIdentify, setSearchDataSetIdentify] = useState(false) ;
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const currentUserDownloadStatus=  commonJsObj.getUserInfo().user.download_status;
    const currentUserType=  commonJsObj.getUserInfo().user.user_type;
    const  currentUserId=  commonJsObj.getCurrentUserId();

    console.log('startDate',startDate,'type of startDate',typeof startDate,'endDate',endDate,'typeof endDate',typeof endDate)
    const [fileName, setfileName] = useState("");
    const [modalId, setModalId] = useState(0);
    const [modalUserID,setModalUserID] = useState(0);
    const [showModal, setShow] = useState(false);

    

    // Handle the `onChange` event of the `file` input
    const onFileChange = (e) => {
        const files = e.target.files;
        console.log('files', files, 'URL.createObjectURL(files[0])', URL.createObjectURL(files[0]))
        files.length > 0 && setUrl(files[0]);
        if (files[0].type == 'application/pdf' || files[0].type == '.pdf') {
            setPdfError(false)
            setfileName(e.target.files[0]['name']);
        }
        else {
            setPdfError(true) 
        }
    };

    //Date range Picker
    const handleDateCallback =(event, picker) =>{
       // console.log('start',start,'end', end,'label', label);
       setStartDate(picker.startDate._d);
       setEndDate(picker.endDate._d);
        console.log("start: ", picker.startDate._d);
        console.log("end: ", picker.endDate._d);
      }

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

   

    let fetchAPI = async (submitedData = null) => {
        showLoader();

        const curUserType=  commonJsObj.getUserInfo().user.user_type;
        const curUserId=  commonJsObj.getCurrentUserId();

        if(submitedData==null)
        {
            //var listDetails = await httpService.setModule('searchInvestigation').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage,curUserType:curUserType,curUserId:curUserId,type:'FI'});
            var listDetails = await httpService.setModule('searchInvestigation').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage,curUserType:curUserType,curUserId:curUserId,showList:true});
        }
        else
        {
           // var listDetails = await httpService.setModule('searchInvestigation').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage,company_name:submitedData.company_name,company_address:submitedData.company_address,company_contact:submitedData.company_contact,postal_code:submitedData.postal_code,contact_email:submitedData.contact_email,gst_vat_reg_number:submitedData.gst_vat_reg_number,internal_reference_no:submitedData.internal_reference_no,range_start_date:submitedData.range_start_date,range_end_date:submitedData.range_end_date,status:submitedData.status,curUserType:curUserType,curUserId:curUserId,type:'FI'});
            var listDetails = await httpService.setModule('searchInvestigation').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage,company_name:submitedData.company_name,company_address:submitedData.company_address,company_contact:submitedData.company_contact,postal_code:submitedData.postal_code,contact_email:submitedData.contact_email,gst_vat_reg_number:submitedData.gst_vat_reg_number,internal_reference_no:submitedData.internal_reference_no,range_start_date:submitedData.range_start_date,range_end_date:submitedData.range_end_date,status:submitedData.status,curUserType:curUserType,curUserId:curUserId,showList:true});
        }

        console.log('listDetails',listDetails)
        
        
        if (listDetails.res.data.status === 'success') {
            setSearchDataList(listDetails.res.data.data);
            if (listDetails.res.data.pagination) {
                setPageinatioPageCount(listDetails.res.data.pagination.pageCount);
                setPaginationData(listDetails.res.data.pagination);
            }
            hideLoader();
        } else {
            hideLoader();
            ToastsStore.error('Internal Server Error');
        }
    }


    let updatedAPI = async (updatedData) => {
        console.log('updatedData',updatedData)
        showLoader();
        
        httpService.setModule('uploadOrder').update(updatedData)
        .then((val) => {
            // Makes .then() return a rejected promise
            console.log('val',val)
            if (val.res.data.status === 'success') {
                // fetchData();       
                //history.push('/search-list');  
                window.location.reload();                
                ToastsStore.success('Successfully updated');
                
            }
            else
            {
                if (val.res.data.message!=='')  {
                    ToastsStore.error(val.res.data.message)
                }
                else if (val.res.data.errors) {
                    
                    ToastsStore.error(val.res.data.errors.name.message)
                }
                 else {
                    ToastsStore.error('Internal server error');
                }
            }
          })
          .catch(error => {
            console.error('onRejected function called: ' + error.message);
            ToastsStore.error(error.message);
          })

        hideLoader();
       
    }

    const formSubmitData = (data) => {
        showLoader();
        setTimeout(() => {
            hideLoader();
            setNoDataFound(!noDataFound)
        }, 2000)
    }

    const formSubmitDataModal = (data) => {
        console.log(fileName,'fileName')
        console.log('modal data', data)
        const fullFileDetails = data.search_result_upload[0];
        //return false;
        const promiseImage = new Promise((resolve, reject) => {                
            S3BucketService.fileUpload(fullFileDetails, 'fresh_investigation_pdf',"").send((err, data) => {
                if (err) {
                    console.log(err);
                    hideLoader();
                    ToastsStore.error('Some issue occured in image upload');
                } else {
                    
                    resolve(data.Location)
                    console.log('data.Location',data.Location)
                }
            });

        });
        const url= Promise.all([promiseImage]).then((values) => {
        //     let formSubmitData = submitedData;
        //     formSubmitData.profile_image = values[0];
        //    submitData(formSubmitData);
        console.log(values,'sssssssss')
        var updatedData={};
        updatedData.id = modalId;
        updatedData['user_id']=modalUserID;
        updatedData['order_link']=values[0];
        updatedData['status']= 'C';

        updatedAPI(updatedData)
          //console.log('error',error)
        });
       // console.log('url',url)
        // 
    }

    const searchSubmit = async (submitedData) => {

        submitedData['range_start_date']= startDate!=""?startDate:moment().subtract(1, 'months').format('MM/DD/YYYY');
        submitedData['range_end_date']= endDate!=""?endDate:moment().format('MM/DD/YYYY');
        console.log('submitedData', submitedData)
        setSubmitedData(submitedData)
        setSearchDataSetIdentify(true);
         fetchAPI(submitedData);
    }

    const resetSearch = () => {
        setSearchDataSetIdentify(false);
        setSubmitedData({});

        if (commonJsObj.checkUrlPermission(['read-search-company'])) {
            fetchAPI();
        }

    }

    const checkPermission = () => {
      
        if (commonJsObj.checkUrlPermission(['read-search-company'])) {
            setContentPermission(true);
            fetchAPI();
        }
    }

    const handlePageChange = (e) => {
        setCurPage(e);
    }

    const modalShowHide = (modalId,modalUserID) => {
        setShow(true);
        setModalId(modalId);
        setModalUserID(modalUserID);
        console.log('modalShow')
    }

    const handleModalClose = () => {
        setShow(false);
        setModalId(0);
        setModalUserID(0);
    }

    const onOrderLink = async (orderId,userId,orderLink) => {
        console.log('getting clicked');
        showLoader();
        var submitedData = {};
        submitedData.id = orderId;
        submitedData['user_id'] = userId;
        submitedData['order_link'] = orderLink;
        submitedData['order_id'] = orderId;

            var editSubmitData = await httpService.setModule('customerCreditCount').update(submitedData);
            hideLoader();
            
    }

    /************************function to generate pdf report*******************/
    const generate_pdf = async (search_investigation_id,online_search_id) => {
        let data={};
        data.id=search_investigation_id;
        data.online_search_id=online_search_id;
        //console.log(search_investigation_id);
        //console.log(online_search_id);
        if(data)
        {
            //console.log(data);
            var pdfresdata = await httpService.setModule('generatepdfreport').update(data);
            hideLoader();
            if (pdfresdata.res.data.status === 'success') {                                       
                ToastsStore.success('PDF generated Successfully');

                setTimeout(function(){
                    window.location.reload(1);
                 }, 5000); 
            }
            else {
                if (pdfresdata.res.data.message!=='')  {
                    ToastsStore.error(pdfresdata.res.data.message)
                }
                else if (pdfresdata.res.data.errors) {
                    
                    ToastsStore.error(pdfresdata.res.data.errors.name.message)
                }
                 else {
                    ToastsStore.error('Internal server error');
                }
            }
        }
        
       
       
      
        
    }
    //function to send mail
    const send_mail = async (search_investigation_id) => {
        let data={};

        data.id=search_investigation_id;
        //console.log(search_investigation_id);
        var editSubmitData = await httpService.setModule('sendmailreport').update(data);
        hideLoader();
        if (editSubmitData.res.data.status === 'success') {                                       
            ToastsStore.success('Mail send Successfully');
        }
        else {
            if (editSubmitData.res.data.errors) {
                ToastsStore.error(editSubmitData.res.data.errors.title.message)
            } else {
                ToastsStore.error('Internal server error');
            }
        }
      
        
    }

    //for excel file import
    const fileInputRef=useRef(null);
    let selectedOnlineSerachId='';

    let getBase64= async (file,cb)=>{
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const ButtonClick = (e,onlinesearchid) => {
        console.log('ON',onlinesearchid);
      
        fileInputRef.current.click();
    
        selectedOnlineSerachId=onlinesearchid;

      };
      const handleExcelfileChange =async (fileuploaded) => {
          
        const files = fileuploaded.target.files;
        let onlinesearchid=selectedOnlineSerachId;
        console.log('ID',onlinesearchid);
        //console.log(files[0]);
        var fileExtension = files[0].name.split('.').pop();
        if (fileExtension == 'xls'||fileExtension=='xlsx') {
            //setFileError(false)
            showLoader();
            let submitedData={};
            let file_link='';
            submitedData.onlinesearchid = onlinesearchid;
            submitedData.file_name = files[0].name;
            
            getBase64 (files[0], (result) => {
                file_link = result;
                let modified_str=result.split(',').pop();
                submitedData.file_link =modified_str;
                //console.log(file_link);
                //httpService.setModule('importexceltoreport').create(submitedData);
                
               httpService.setModule('importexceltoreport').create(submitedData)
                .then(function (addSubmitData) { 
                    hideLoader(); 
                    //console.log("EXCELRES",addSubmitData);
                    if (addSubmitData.res.data.status === 'success') {
                        // e.target.reset();
                        ToastsStore.success('Successfully submitted your file');
                    }
                    
                    
                }, function (error) {
                    // hideLoader();
                     //console.error(error);
                    ToastsStore.error('Internal server error');
                });
                
                
                
               
            });

        }
        else {
            //setFileError(true)
            ToastsStore.error('Please upload excel file');
        }
    }

    /************update Probe Status Api For Admin ***************************** */
    let updateProbeStatusApiForAdmin = async () => {
        console.log('coming here------------------')
        showLoader();
        let listDetails = await httpService.setModule('updateProbeStatusApi').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage});
        if (listDetails.res.data.status === 'success') {

            ToastsStore.success('It is synced to Probe')
           
            hideLoader();
        } else {
            hideLoader(); 
            ToastsStore.error('Internal Server Error');
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
                <DetailView updateProbeStatusApiForAdmin={updateProbeStatusApiForAdmin} currentUserType={currentUserType} currentUserDownloadStatus={currentUserDownloadStatus} pdfError={pdfError} onOrderLink={onOrderLink} showModal={showModal} handleModalClose={handleModalClose} modalShowHide={modalShowHide} resetSearch={resetSearch} submitedData={submitedData} searchDataSetIdentify={searchDataSetIdentify} searchSubmit={searchSubmit} formSubmitData={formSubmitData} formSubmitDataModal={formSubmitDataModal}  noDataFound={noDataFound} curPage={curPage} paginationData={paginationData} paginationPageCount={paginationPageCount} handlePageChange={handlePageChange} searchDataList={searchDataList} onFileChange={onFileChange} url={url} handleDateCallback={handleDateCallback} startDate={startDate} endDate={endDate} generate_pdf={generate_pdf} send_mail={send_mail} fileInputRef={fileInputRef} handleExcelfileChange={handleExcelfileChange} ButtonClick={ButtonClick} />
            </>}
        </>
    )
}

export default ListComponent
