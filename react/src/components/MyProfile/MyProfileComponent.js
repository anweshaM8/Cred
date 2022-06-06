import React, { useState, useEffect, useContext,useRef } from 'react';
import MyProfileView from './MyProfileView';
import httpService from './../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../utils/loader/CustLoader';
import { store } from '../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../utils/commonFunc';
import moment from 'moment';
import S3BucketService from '../../services/s3-bucket.service';

const MyProfileComponent = () => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
   
    //const [curPage, setCurPage] = useState(1);
    const [curPageON, setCurPageON] = useState(1);
    const [curPageFI, setCurPageFI] = useState(1);

    const [curPageTab, setCurPageTab] = useState('ON');

    // const [paginationPageCount, setPageinatioPageCount] = useState(0);
    // const [paginationData, setPaginationData] = useState({});

    const [paginationPageCountON, setPageinatioPageCountON] = useState(0);
    const [paginationDataON, setPaginationDataON] = useState({});

    const [paginationPageCountFI, setPageinatioPageCountFI] = useState(0);
    const [paginationDataFI, setPaginationDataFI] = useState({});

    const [dataCountryList, setCountryDataList] = useState(false);
    const [particularCountry, setparticularCountry] = useState(null);

    const [particularCountryON, setparticularCountryON] = useState(null);
    const [particularCountryFI, setparticularCountryFI] = useState(null);

    const [statusON, setstatusON] = useState(null);
    const [statusFI, setstatusFI] = useState(null);

    const [searchKeywordON, setSearchKeywordON] = useState(null);
    const [searchKeywordFI, setSearchKeywordFI] = useState(null);

    const [searchDataListForON, setSearchDataLNstForON] = useState(false);
    const [searchDataListForFI, setSearchDataListForFI] = useState(false);

    const [dataEntitiesByName, setDataEntitiesByName] = useState(false);

    const [noDataFound, setNoDataFound] = useState(false);

    const [search_id, setSearch_id] = useState(0);

    
    const [onlineSearchDetails,setOnlineSearchDetails] = useState(false);
    

    const [submitedData, setSubmitedData] = useState({});
    const [submitedDataON, setSubmitedDataON] = useState({});
    const [submitedDataFI, setSubmitedDataFI] = useState({});

    const [searchDataSetIdentify, setSearchDataSetIdentify] = useState(false) ;
    const [searchDataSetIdentifyON, setSearchDataSetIdentifyON] = useState(false) ;
    const [searchDataSetIdentifyFI, setSearchDataSetIdentifyFI] = useState(false) ;

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [startDateON, setStartDateON] = useState("");
    const [endDateON, setEndDateON] = useState("");

    const [startDateFI, setStartDateFI] = useState("");
    const [endDateFI, setEndDateFI] = useState("");

    const currentUser=  commonJsObj.getUserInfo().user;
    const currentUserType=  commonJsObj.getUserInfo().user.user_type;
    const  currentUserId=  commonJsObj.getCurrentUserId();
    const currentUserDownloadStatus=  commonJsObj.getUserInfo().user.download_status;

    //Fi ------
    const [fileName, setfileName] = useState("");
    const [modalId, setModalId] = useState(0);
    const [modalUserID,setModalUserID] = useState(0);
    const [showModal, setShow] = useState(false);
    const [url, setUrl] = useState('');
    const [pdfError, setPdfError] = useState(false);
    //const [submitedData, setSubmitedData] = useState({});

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

    const searchSubmit1 = async () => {

        var submitedData={}
        submitedData['range_start_date']= startDateON!=""?startDateON:moment().subtract(1, 'months').format('MM/DD/YYYY');
        submitedData['range_end_date']= endDateON!=""?endDateON:moment().format('MM/DD/YYYY');
        submitedData['country_id']= particularCountryON!=null?particularCountryON.value:null;
        submitedData['status']= statusON;
        submitedData['searchKeyword']= searchKeywordON;
        console.log('submitedData', submitedData)
       
        setSubmitedDataON(submitedData)

       // console.log('submitedData searchSubmit',submitedData)
        
         fetchAPI(submitedData,'ON');
    }

    const searchSubmit2 = async () => {

        
        var submitedData={}
        submitedData['range_start_date']= startDateFI!=""?startDateFI:moment().subtract(1, 'months').format('MM/DD/YYYY');
        submitedData['range_end_date']= endDateFI!=""?endDateFI:moment().format('MM/DD/YYYY');
        submitedData['country_id']= particularCountryFI!=null?particularCountryFI.value:null;
        submitedData['status']= statusFI;
        submitedData['searchKeyword']= searchKeywordFI;
        console.log('submitedData', submitedData)
        setSubmitedDataFI(submitedData)

        console.log('submitedData searchSubmit',submitedData)
        
         fetchAPI(submitedData,'FI');
    }

    const onStatusChange = async (e,type) => {
        console.log('evee11',e.target.value,'type',type)
        if(type=='ON')
        {
            setstatusON(e.target.value)
        }
        else
        {
            setstatusFI(e.target.value)
        }

    }

    const onSearchKeywordChange = async (e,type) => {
        console.log('evee11',e.target.value,'type',type)
        if(type=='ON')
        {
            setSearchKeywordON(e.target.value)
        }
        else
        {
            setSearchKeywordFI(e.target.value)
        }

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

    
    //Fi ------

    

    // console.log('currentUser',currentUser)
    const fileInputRef=useRef(null);
    let selectedOnlineSerachId='';

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    const checkPermission = () => {
        // if (commonJsObj.checkUrlPermission(['create-my-profile'])) {
        //     setAddContentPermission(true);           
        // }        
    }

      //Date range Picker
    const handleDateCallbackON =(event, picker) =>{
    // console.log('start',start,'end', end,'label', label);
    setStartDateON(picker.startDate._d);
    setEndDateON(picker.endDate._d);
        console.log("start: ", picker.startDate._d);
        console.log("end: ", picker.endDate._d);
    }

    //Date range Picker
    const handleDateCallbackFI =(event, picker) =>{
        // console.log('start',start,'end', end,'label', label);
        setStartDateFI(picker.startDate._d);
        setEndDateFI(picker.endDate._d);
            console.log("start: ", picker.startDate._d);
            console.log("end: ", picker.endDate._d);
        }

    let fetchAPI = async (submitedData = null,searchType) => {
        showLoader();

        if(submitedData==null)
        {
            var listDetails = await httpService.setModule('searchInvestigation').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPageTab=='ON'?curPageON:curPageFI,curUserType:currentUserType,curUserId:currentUserId,type:searchType});
        }
        else
        {
            var listDetails = await httpService.setModule('searchInvestigation').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPageTab=='ON'?curPageON:curPageFI,type:searchType,status:submitedData.status,searchKeyword:submitedData.searchKeyword,country_id:submitedData.country_id,range_start_date:submitedData.range_start_date,range_end_date:submitedData.range_end_date,curUserType:currentUserType,curUserId:currentUserId});
        }
        
        
        if (listDetails.res.data.status === 'success') {
            if(searchType=='ON')
            {
                // let result = listDetails.res.data.data.filter(function (e) {
                //     return e.onlineSearchDetails !={};
                // });
                 setSearchDataLNstForON(listDetails.res.data.data);
                 setSearchDataSetIdentifyON(true)
                
            }
            else
            {
                setSearchDataListForFI(listDetails.res.data.data)
                setSearchDataSetIdentifyFI(true)
            }
            //setSearchDataList(listDetails.res.data.data);
            if (listDetails.res.data.pagination) {
                if(searchType=='ON')
                {
                    setPageinatioPageCountON(listDetails.res.data.pagination.pageCount);
                    setPaginationDataON(listDetails.res.data.pagination);
                    
                }
                else
                {
                    setPageinatioPageCountFI(listDetails.res.data.pagination.pageCount);
                    setPaginationDataFI(listDetails.res.data.pagination);
                }
              
            }
            setCurPageTab(searchType)
            //setSearchListShow(true)
            hideLoader();
        } else {
            hideLoader();
            ToastsStore.error('Internal Server Error');
        }
    }


    let fetchCountryApi = async () => {
        showLoader();
        let listDetails = await httpService.setModule('SearchInvestigationCountries').search({});
        if (listDetails.res.data.status === 'success') {

            var countryList = [];

            var countries = listDetails.res.data.data.sort((a,b) => (a.country_name > b.country_name) ? 1 : ((b.country_name > a.country_name) ? -1 : 0))

            countries.map((value,index) => {
                countryList.push({ value: value.id, label: value.country_name })
              });
            setCountryDataList(countryList);
            handleChangeCountryON(countryList[0])
            handleChangeCountryFI(countryList[0])
            hideLoader();
        } else {
            hideLoader(); 
            ToastsStore.error('Internal Server Error');
        }
    }

    const handleChangeCountryON =(changedCountryList) => {
        console.log('e-------',changedCountryList)
        setparticularCountryON(changedCountryList);
    }

    const handleChangeCountryFI =(changedCountryList) => {
        console.log('e-------',changedCountryList)
        setparticularCountryFI(changedCountryList);
    }

   
    const handlePageChange = (e,type)=>{

        console.log('event',e,'type',type)
       
        setCurPageTab(type)
        if(type=='ON')
        {
            setCurPageON(e)
        }
        else
        {
            setCurPageFI(e)
        }
        //setCurPage(e);
    }
    const handlePageTab = (event)=>{
        console.log('type111',event)
        //setCurPageTab(type)
    }

   

    const resetSearch = (type) => {

        console.log('resetSearch',type)
        

        if(type=='ON')
        {
            setSubmitedDataON({});
            setSearchDataSetIdentifyON(false);
            setStartDateON("")
            setEndDateON("")
            setstatusON(null)
            setSearchKeywordON(null)
            setparticularCountryON(null)

            if (commonJsObj.checkUrlPermission(['read-my-profile'])) {
                fetchAPI(null,'ON');
                
            }
            
        }
        else
        {
            setSubmitedDataFI({})
            setSearchDataSetIdentifyFI(false);
            setStartDateFI("")
            setEndDateFI("")
            setstatusFI(null)
            setSearchKeywordFI(null)
            setparticularCountryFI(null)

            if (commonJsObj.checkUrlPermission(['read-my-profile'])) {
              
                fetchAPI(null,'FI');
            }
        }
        //setSubmitedData({});

        // if (commonJsObj.checkUrlPermission(['read-my-profile'])) {
        //     fetchAPI(null,'ON');
        //     fetchAPI(null,'FI');
        // }

    }

    
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
            
            getBase64(files[0], (result) => {
                file_link = result;
                let modified_str=result.split(',').pop();
                submitedData.file_link =modified_str;
                //console.log(file_link);
                console.log(submitedData);
                var addSubmitData = httpService.setModule('importexceltoreport').create(submitedData);
                hideLoader();
                if (addSubmitData.res.data.status === 'success') {
                    // e.target.reset();
                    ToastsStore.success('Successfully submitted your file');
                }
                else {

                    ToastsStore.error('Internal server error');
                }
            });

            
           
            
            // var formData = new FormData();

            // formData.append("file_link", files[0]);
            // formData.append("onlinesearchid", onlinesearchid);
            //const response = await axios.get('https://i.imgur.com/8uJcFxW.jpg', { responseType: 'stream' });
            //var url= process.env.REACT_APP_BASEURL + '/probe-api/importexceltoreport';
            // var addSubmitData = await axios.post(url, formData, {
            //     headers: {
            //       'Content-Type': 'multipart/form-data'
                  
            //     }
            // })
            // var addSubmitData = await axios.post(url, submitedData, {
            //     headers: {
            //       'Content-Type': 'multipart/form-data'
                  
            //     }
            // })
            //var addSubmitData = await fetch(url, {method: 'POST', body: submitedData });
            //console.log("RES++",addSubmitData);
            
            
        }
        else {
            //setFileError(true)
            ToastsStore.error('Please upload excel file');
        }
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

    // useEffect(() => {
    //     if(commonJsObj.getCurrentUserId() == 1){
          
    //     }
    // }, [curPage]); 
    // useEffect(() => {
        
    // }, [globalState, curPage]); 

    useEffect(() => {
        fetchAPI(null,curPageTab);
    }, [curPageON]);
    useEffect(() => {
        fetchAPI(null,curPageTab);
    }, [curPageFI]);

    useEffect(() => {

        fetchCountryApi()
        fetchAPI(null,'ON');
        fetchAPI(null,'FI')

    }, []);
 
    return (
        <>
            {loderFlag ? <CustLoader /> : ''}           
            {!loderFlag  && <>
                <MyProfileView  generate_pdf={generate_pdf} send_mail={send_mail}  fileInputRef={fileInputRef} handleExcelfileChange={handleExcelfileChange} ButtonClick={ButtonClick} onlineSearchDetails={onlineSearchDetails}  currentUserType={currentUserType} currentUserId={currentUserId} currentUserDownloadStatus={currentUserDownloadStatus} searchDataListForON={searchDataListForON} searchDataListForFI={searchDataListForFI} dataCountryList={dataCountryList} particularCountryON={particularCountryON} particularCountryFI={particularCountryFI} handleChangeCountryON={handleChangeCountryON} handleChangeCountryFI={handleChangeCountryFI} currentUser={currentUser}  handlePageChange={handlePageChange} paginationDataON={paginationDataON} paginationDataFI={paginationDataFI} paginationPageCountON={paginationPageCountON} paginationPageCountFI={paginationPageCountFI} curPageON={curPageON} curPageFI={curPageFI} 
                pdfError={pdfError} onOrderLink={onOrderLink} showModal={showModal} handleModalClose={handleModalClose} modalShowHide={modalShowHide} resetSearch={resetSearch} submitedDataON={submitedDataON} submitedDataFI={submitedDataFI} onFileChange={onFileChange} url={url} handleDateCallbackON={handleDateCallbackON} handleDateCallbackFI={handleDateCallbackFI} startDateON={startDateON} endDateON={endDateON} startDateFI={startDateFI} endDateFI={endDateFI} formSubmitDataModal={formSubmitDataModal} curPageTab={curPageTab} handlePageTab={handlePageTab} searchSubmit1={searchSubmit1} searchSubmit2={searchSubmit2}
                searchDataSetIdentifyON={searchDataSetIdentifyON} searchDataSetIdentifyFI={searchDataSetIdentifyFI} statusON={statusON} statusFI={statusFI} onStatusChange={onStatusChange} searchKeywordON={searchKeywordON} searchKeywordFI={searchKeywordFI} onSearchKeywordChange={onSearchKeywordChange} />
            </>}
        </>
    )
}

export default MyProfileComponent