import React, { useState, useEffect, useContext,useRef} from 'react';
import ListView from './ListView';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
import AccessErrorView from '../../AccessError/AccessErrorView';
import httpService from './../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import axios from 'axios';


const ListComponent = (props) => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
    const [addContentPermission, setAddContentPermission] = useState(false);
    const [dataCountryList, setCountryDataList] = useState(false);
    const [particularCountry, setparticularCountry] = useState(null);
    const [searchDataList, setSearchDataList] = useState(false);
    const [searchListShow, setSearchListShow] = useState(false);
    const [paginationPageCount, setPageinatioPageCount] = useState(0);
    const [paginationData, setPaginationData] = useState({});
    const [curPage, setCurPage] = useState(1);
    const [dataEntitiesByName, setDataEntitiesByName] = useState(false);

    const [noDataFound, setNoDataFound] = useState(false);

    const [search_id, setSearch_id] = useState(0);

    const [modalId, setModalId] = useState(0);
    const [onlineSearchDetails,setOnlineSearchDetails] = useState(false);
    const [showModal, setShow] = useState(false);
    const currentUserType=  commonJsObj.getUserInfo().user.user_type;
    const  currentUserId=  commonJsObj.getCurrentUserId();
    const currentUserDownloadStatus=  commonJsObj.getUserInfo().user.download_status;

    const [company_id, setCompany_id] = useState(0);
    const [company_type, setCompany_type] = useState(0);

    const fileInputRef=useRef(null);

    let selectedOnlineSerachId='';

    const [search_company_input, setsearch_company_input] = useState(0);
    const [search_address_input, setsearch_company_address] = useState(0);

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

    
    
    const handleShow = () => setShow(true);
   
    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    const formSubmitData = (data) => {
        //console.log("searchInput",data);
        showLoader();
        /************************************************/
        if(data.company_name)
        {
            //search_company_input=data.company_name;
            localStorage.setItem('search_company_input', data.company_name);
            setsearch_company_input(data.company_name);
        }
        // if(data.company_name)
        // {
        //     search_country_input=data.company_name;
        // }
        if(data.company_address)
        {
            //search_address_input=data.company_address;
            localStorage.setItem('search_address_input', data.company_address);
            setsearch_company_address(data.company_address);
        }
   
        /*************************************************/
        if(particularCountry!==null)
        {
            //const countryIds = _.map(particularCountry, 'value');
           // submitedData['country_code'] = particularCountry.value;
        }
        setSearchListShow(false)
        //setNoDataFound(!noDataFound)
        fetchSearchEntitiesApi(data);
        setTimeout(() => {
            hideLoader();
            
            
        }, 2000)
    }


    let fetchAPI = async (submitedData = null) => {
        showLoader();
        //console.log(2);
        const curUserType=  commonJsObj.getUserInfo().user.user_type;
        const curUserId=  commonJsObj.getCurrentUserId();

        if(submitedData==null)
        {
            var listDetails = await httpService.setModule('searchInvestigation').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage,curUserType:curUserType,curUserId:curUserId,type:'ON'});
        }
        else
        {
            var listDetails = await httpService.setModule('searchInvestigation').search({pagination:true,limit:process.env.REACT_APP_PAGINATION_LIMIT,page:curPage,type:'ON',company_name:submitedData.company_name,company_address:submitedData.company_address,company_contact:submitedData.company_contact,postal_code:submitedData.postal_code,contact_email:submitedData.contact_email,gst_vat_reg_number:submitedData.gst_vat_reg_number,internal_reference_no:submitedData.internal_reference_no,range_start_date:submitedData.range_start_date,range_end_date:submitedData.range_end_date,status:submitedData.status,curUserType:curUserType,curUserId:curUserId});
        }
        
        
        if (listDetails.res.data.status === 'success') {
            setSearchDataList(listDetails.res.data.data);
            if (listDetails.res.data.pagination) {
                setPageinatioPageCount(listDetails.res.data.pagination.pageCount);
                setPaginationData(listDetails.res.data.pagination);
            }
            setSearchListShow(true)
            hideLoader();
        } else {
            hideLoader();
            ToastsStore.error('Internal Server Error');
        }
    }

    let fetchSearchEntitiesApi = async (data) => {
        showLoader();
        let listDetails = await httpService.setModule('getProbeEntitiesByName').search({entityName:data.company_name,user_id:currentUserId});
        if (listDetails.res.data.status === 'success') {
            if(listDetails.res.data.data.length==0)
            {
                setNoDataFound(!noDataFound)
            }

            setDataEntitiesByName(listDetails.res.data.data);
            setSearch_id(listDetails.res.data.data.search_id)
           
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

            handleChangeCountry(countryList[0])
           
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

    const checkPermission = () => {
        if (commonJsObj.checkUrlPermission(['create-search-company'])) {
            setAddContentPermission(true);           
        }        
    }

    const handlePageChange = (e) => {
        setCurPage(e);
    }

    
    let updatedAPI = async (updatedData) => {
        console.log('updatedData',updatedData)
        showLoader();
        
       await httpService.setModule('updateCreditScore').update(updatedData)
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

    const modalShowHide = (modalId,company_id,company_type) => {
        setShow(true);
        setModalId(modalId);
        setCompany_id(company_id)
        setCompany_type(company_type)
        console.log('modalShow',modalId);
        console.log('company_id',company_id)
        console.log('company_type',company_type)
    }

    const formSubmitDataModal = (data) => {
        console.log('modal data', data)

        var updatedData={};
        updatedData.id = modalId;
        //updatedData.search_investigation_id = modalId;
        updatedData['credit_score']=data.credit_score;
        
        console.log('updatedData', updatedData)

        updatedAPI(updatedData)
        handleModalClose()

        // const url= Promise.all([promiseImage]).then((values) => {
        // //     let formSubmitData = submitedData;
        // //     formSubmitData.profile_image = values[0];
        // //    submitData(formSubmitData);
        // console.log(values,'sssssssss')
        // var updatedData={};
        // updatedData.id = modalId;
        // updatedData['user_id']=modalUserID;
        // updatedData['order_link']=values[0];
        // updatedData['status']= 'C';

        // updatedAPI(updatedData)
        //   //console.log('error',error)
        // });
       // console.log('url',url)
        // 
    }

    const removeiframe = () =>{
        //var iframes = document.getElementsByTagName('iframe');
        document.getElementsByTagName('iframe').style.zIndex = -1;
        //console.log('iframes',iframes)
    //     console.log('iframes1',iframes[0].parentNode)
    //     var iframes = document.getElementsByTagName('iframe');
    // for (var i = 0; i < iframes.length; i++) {
    //     iframes[i].parentNode.removeChild(iframes[i]);
    // }
       }

    const handleModalClose = () => {
        setShow(false);
        setModalId(0);
    }

    const onCompanySelect = async (data) => {
        let companyId=company_id;
        let type=company_type;
        let internal_reference_no=data.internal_reference_no;
        console.log('REFi'+internal_reference_no);
        showLoader();

        //console.log('getProbeCompanyDetails companyDetails',companyDetails)

        // if(type=='cin')
        // {
        //     var companyId = companyDetails.cin;
        // }
        // else
        // {
        //     var companyId = companyDetails.llpin;
        // }

        let updatedData ={

            company_id:companyId,
            company_type:type,
            user_id:currentUserId,
            search_investigation_id:search_id,
            internal_reference_no:internal_reference_no
        }

        //console.log('getProbeCompanyDetails updatedData',updatedData)
        
        await httpService.setModule('getProbeCompanyDetails').create(updatedData)
         .then((val) => {
             // Makes .then() return a rejected promise
             //console.log('val',val)
             if (val.res.data.status === 'success') {
                handleModalClose()
                 // fetchData();       
                 //history.push('/search-list');  
                  //window.location.reload();             
                 ToastsStore.success('Request saved successfully we will get back to you by 1 working day');
                 
                 setTimeout(function(){
                    window.location.reload(1);
                 }, 5000);  
                 
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
 
    
    useEffect(() => {
        checkPermission();
        fetchCountryApi();
       
        //fetchAPI();
    }, []);

    // useEffect(() => {
    //     removeiframe();
    //   });
    // useEffect(() => {
    //     removeiframe();
    // }, [onlineSearchDetails]);

    // useEffect(() => {
    //     checkPermission();
    // }, [curPage]);

    useEffect(() => {

    }, [globalState]);

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

    const linkStyle = { color: 'black',cursor:'pointer', 
    "&:hover": {
        textDecoration: "underline"
      }
    };

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!addContentPermission ? <AccessErrorView /> : ""}
            {!loderFlag && addContentPermission && <>
                <ListView currentUserDownloadStatus={currentUserDownloadStatus} modalId={modalId} formSubmitDataModal={formSubmitDataModal} currentUserType={currentUserType} formSubmitData={formSubmitData} searchListShow={searchListShow} particularCountry={particularCountry} handleChangeCountry={handleChangeCountry} dataCountryList={dataCountryList} searchDataList={searchDataList} paginationPageCount={paginationPageCount} curPage={curPage} paginationData={paginationData} handlePageChange={handlePageChange} dataEntitiesByName={dataEntitiesByName} showModal={showModal} onlineSearchDetails={onlineSearchDetails} modalShowHide={modalShowHide} handleModalClose={handleModalClose} onCompanySelect={onCompanySelect} generate_pdf={generate_pdf} send_mail={send_mail} handleShow={handleShow} fileInputRef={fileInputRef} handleExcelfileChange={handleExcelfileChange} ButtonClick={ButtonClick} linkStyle={linkStyle} search_company_input={search_company_input} search_address_input={search_address_input}/>
            </>}
        </>
    )
}

export default ListComponent
