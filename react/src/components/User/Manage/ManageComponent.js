import React, { useState, useEffect, useContext } from 'react';
import ManageView from './ManageView';
import httpService from './../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { history } from '../../../helpers/history';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';

const ManageComponent = (props) => {
    const globalState = useContext(store);
    //let history = useHistory();
    const [loderFlag, setLoaderFlag] = useState(false);
    const [dataDetails, setDataList] = useState({});
    const [editDataList, setEditDataList] = useState({});
    const [clientType, setClientType] = useState({});
    const [countryDataList, setCountryDataist] = useState([]);
    const [phoneCodeList, setPhoneCodeList] = useState({});
    const [stateDataList, setStateDataist] = useState([]);
    const [cityDataList, setCityDataist] = useState([]);
    const [hoUserDataist, setHoUserDataist] = useState([]); 
    const [roleID, setroleID] = useState(0);    

    const [currentCountry, setcurrentCountry] = useState(null);
    const [currentState, setcurrentState] = useState(null);
    const [currentCity, setcurrentCity] = useState(null);
    const [defaultUserTypeTitle, setDefaultUserTypeTitle] = useState("");
    const [currentCustomerName, setcurrentCustomerName] = useState(null);
    const [currentUserListValues,setcurrentUserListValues] =  useState({
        branch_office_code:"",
        name:"",
        user_name:"",
        phone_code:"",
        phone_number:"",
        address:"",
        zip_code:"",
    });
    const [defaultChange, setDefaultChange] = useState({
        type:"",
        value:"",
    });
    // useEffect(() => {
    //     console.log('enter iseffect')
    //             const fetchData = async () => {
        
    //                 const fetchRoleListDetails = await fetchAPI();
        
    //                 if (fetchRoleListDetails.res.data.status === 'success') {
    //                     setDataList(fetchRoleListDetails.res.data.data);
    //                     const countryDetail = await fetchCountryAPI();
    //                     if (countryDetail.res.data.status === 'success') {
    //                         var countryList = countryDetail.res.data.data;
        
    //                         var countries = countryList.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        
    //                         setCountryDataist(countries); 
                                               
    //                         countryList = countryList.reduce((c, n) => c.find(el => el.phonecode == n.phonecode) ? c : [...c, n], []);
        
    //                         countryList = countryList.sort((a,b) => (a.phonecode > b.phonecode) ? 1 : ((b.phonecode > a.phonecode) ? -1 : 0))
        
    //                         setPhoneCodeList(countryList);
    //                         //console.log('countryList',countryList);                  
                            
    //                     }
    //                     setClientType([
    //                         {"id":"A","name":"Agent"},
    //                         {"id":"Sub","name":"Sub Admin"},
    //                         {"id":"I","name":"Individual User"},
    //                         {"id":"HO","name":"Head Office"},
    //                         {"id":"BO","name":"Branch Office"}
    //                     ]);
    //                 }
        
    //                 if (props.match.params.id) {
    //                     const fetchUserDataDetail = await fetchUserData();
    //                     if (fetchUserDataDetail.res.data.status === 'success') {
    //                         setEditDataList(fetchUserDataDetail.res.data.data);
    //                         setDefaultUserTypeTitle(fetchUserDataDetail.res.data.data.user_type)
                            
    //                         setcurrentUserListValues(oldState=> ({ ...oldState, 
    //                             branch_office_code:fetchUserDataDetail.res.data.data.branch_office_code,
    //                             name:fetchUserDataDetail.res.data.data.name,
    //                             user_name:fetchUserDataDetail.res.data.data.user_name,
    //                             phone_code:fetchUserDataDetail.res.data.data.phone_code,
    //                             phone_number:fetchUserDataDetail.res.data.data.phone_number,
    //                             address:fetchUserDataDetail.res.data.data.address,
    //                             zip_code:fetchUserDataDetail.res.data.data.zip_code
    //                          }));
    //                         if(fetchUserDataDetail.res.data.data.userDetail.country_id!=null)
    //                         {
    //                             setcurrentCountry(fetchUserDataDetail.res.data.data.userDetail.country_id.toString());
    //                             handleChange('country',fetchUserDataDetail.res.data.data.userDetail.country_id);
    //                         }
    //                         if(fetchUserDataDetail.res.data.data.userDetail.state_id!=null)
    //                         {
                                
    //                             setcurrentState(fetchUserDataDetail.res.data.data.userDetail.state_id.toString());
    //                             handleChange('state',fetchUserDataDetail.res.data.data.userDetail.state_id);
    //                         }
        
    //                         if(fetchUserDataDetail.res.data.data.userDetail.city_id!=null)
    //                         {
                                
    //                             setcurrentCity(fetchUserDataDetail.res.data.data.userDetail.city_id.toString());
    //                         }
                           
    //                         console.log(fetchUserDataDetail.res.data.data.user_type,'fetchUserDataDetail.res.data.data.user_type')
    //                         setroleID(fetchUserDataDetail.res.data.data.roleMatch.id)
    //                         if(fetchUserDataDetail.res.data.data.user_type === 'BO'){
    //                             setcurrentCustomerName(parseInt(fetchUserDataDetail.res.data.data.head_office_user_id))
    //                             handleChange('userType','BO');
    //                         }
    //                     }
    //                 }
        
        
    //             };
    //             fetchData();
        
    //         }, []);
    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }
 
    const fetchAPI = async () => {       
        let roleListDetails = await httpService.setModule('role').search({});       
        return roleListDetails;
    }

    const fetchUserData = async () => {
        showLoader();
        let editId = props.match.params.id;
        let userEditData = await httpService.setModule('user').findOne(editId);
        hideLoader();
        return userEditData;
    }
    const formSubmitData = async (submitedData, e) => {

        showLoader();
        
        submitedData['role_id'] = roleID;
        if (props.match.params.id) {
            submitedData.id = props.match.params.id;
            submitedData['created_by'] = commonJsObj.getCurrentUserId();
            var editSubmitData = await httpService.setModule('user').update(submitedData);
            hideLoader();
            if (editSubmitData.res.data.status === 'success') {
                // fetchData();       
                history.push('/user');                  
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
        else {
            
            
            submitedData['created_by'] = commonJsObj.getCurrentUserId();
            var addSubmitData = await httpService.setModule('user').create(submitedData);
            hideLoader();
            if (addSubmitData.res.data.status === 'success') {
                e.target.reset();
                history.push('/user');
                ToastsStore.success('Successfully Added');
            }
            else {

                if (addSubmitData.res.data.errors) {
                    ToastsStore.error(addSubmitData.res.data.errors.user_name.message)
                } else {
                    ToastsStore.error('Internal server error');
                }
            }
        }
    }

    let fetchCountryAPI = async () => {
        showLoader();
        let countryDetail = await httpService.setModule('country').search({});
        hideLoader();
        return countryDetail;
    }
    let fetchStateAPI = async (countryId) => {
        showLoader();
        // setStateDataist([])
        // setCityDataist([])
        let stateDetail = await httpService.setModule('state').search({ country_id: countryId });
        hideLoader();
        return stateDetail;
    }
    let fetchCityAPI = async (stateId) => {
        showLoader();
        // setCityDataist([])
        let cityDetail = await httpService.setModule('city').search({ stateId: stateId });
        hideLoader();
        return cityDetail;
    }
    let fetchHOUserAPI = async (userType) => {
       
        if(userType == 'BO'){
            showLoader();
            let userHODetail = await httpService.setModule('user').search({ type: 'HO',is_active:1 });
             hideLoader();
            return userHODetail;
        }
        
    }
    const handleChange = async (type, value) =>{
        switch (type){
            case "country" :
                
                handleClear("country");
                
                const stateDetail = await fetchStateAPI(value);
                console.log('stateDetail---->1 start->>',stateDetail.res.data)
                if (stateDetail.res.data.status === 'success' && stateDetail.res.data.data.length>0) {
                    var states = stateDetail.res.data.data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                    
                    setStateDataist(states);
                }

                
                setcurrentCountry(value.toString());
                console.log('stateDetail---->1 end->>',stateDetail.res.data)
               
            break;

            case "state" :
                handleClear("state");
                const cityDetail = await fetchCityAPI(value);
                if (cityDetail.res.data.status === 'success' && cityDetail.res.data.data.length>0) {
                    var cities = cityDetail.res.data.data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                    console.log("CITY-----",cities);
                    setCityDataist(cities);
                }
                else{
                    var cities = [{"id":48364,"name":"Other","state_id":0}]; 
                    console.log("CITY2-----",cities);
                    setCityDataist(cities);
                }
                setcurrentState(value.toString());
            break;
            case "city" :
                setcurrentCity(value.toString());
            break;
            case "userType":
                setDefaultUserTypeTitle(value);
                const fetchHOUser = await fetchHOUserAPI(value);
               // console.log('userType---->1 start->>',stateDetail.res.data)
                if (fetchHOUser.res.data.status === 'success') {
                    setHoUserDataist(fetchHOUser.res.data.data);
                }
            break;
            case "notBOuserType":
                handleClear("notBOuserType");
                setDefaultUserTypeTitle(value);
            break;
            default:
                console.log('default')
        }
            
    }

    const handleClear = async (type) =>{
        switch (type){
            case "country" :
                let logs = [];

                console.log('coming to contry')
               
                console.log('city is set' ,cityDataList)

                setStateDataist(prevState => {
                    // Object.assign would also work
                    return {...prevState, ...[]};
                  });
                setCityDataist(prevState => {
                // Object.assign would also work
                return {...prevState, ...[]};
                });

                setcurrentState(prevState => {
                    // Object.assign would also work
                    return {...prevState, ...null};
                  });
                  setcurrentCity(prevState => {
                // Object.assign would also work
                return {...prevState, ...null};
                });
                // setStateDataist([]);
                // setCityDataist([]);
                // setcurrentState(null);
                // setcurrentCity(null);
            break;

            case "state" :
               
                setCityDataist(prevState => {
                // Object.assign would also work
                return {...prevState, ...[]};
                });

                setcurrentCity(prevState => {
                // Object.assign would also work
                return {...prevState, ...null};
                });
               
            break;
            case "notBOuserType":
                setHoUserDataist(prevState => {
                    // Object.assign would also work
                    return {...prevState, ...[]};
                    });
                setDefaultUserTypeTitle(prevState => {
                    // Object.assign would also work
                    return {...prevState, ...""};
                    });
            break;
            default:
                console.log('default')
        }
            
    }

    // React.useEffect(() => {
        
    // }, [cityDataList]);

    const setroleIDInComp = (roleId) =>{
        setroleID(roleId);
    }

    const setttingCurrentCustomerName = (head_office_user_id) =>{
        setcurrentCustomerName(parseInt(head_office_user_id));
    }

    const handleUpdate = (name,value) =>{
        setcurrentUserListValues(oldState=> ({ ...oldState, [name]: value }));
    }
    

   
    
    useEffect(() => {
console.log('enter iseffect')
        const fetchData = async () => {

            const fetchRoleListDetails = await fetchAPI();

            if (fetchRoleListDetails.res.data.status === 'success') {
                setDataList(fetchRoleListDetails.res.data.data);
                const countryDetail = await fetchCountryAPI();
                if (countryDetail.res.data.status === 'success') {
                    var countryList = countryDetail.res.data.data;

                    var countries = countryList.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

                    setCountryDataist(countries); 
                                       
                    countryList = countryList.reduce((c, n) => c.find(el => el.phonecode == n.phonecode) ? c : [...c, n], []);

                    countryList = countryList.sort((a,b) => (a.phonecode > b.phonecode) ? 1 : ((b.phonecode > a.phonecode) ? -1 : 0))

                    setPhoneCodeList(countryList);
                    //console.log('countryList',countryList);                  
                    
                }
                setClientType([
                    {"id":"A","name":"Agent"},
                    {"id":"Sub","name":"Sub Admin"},
                    {"id":"I","name":"Individual User"},
                    {"id":"HO","name":"Head Office"},
                    {"id":"BO","name":"Branch Office"}
                ]);
            }

            if (props.match.params.id) {
                const fetchUserDataDetail = await fetchUserData();
                if (fetchUserDataDetail.res.data.status === 'success') {
                    setEditDataList(fetchUserDataDetail.res.data.data);
                    setDefaultUserTypeTitle(fetchUserDataDetail.res.data.data.user_type)
                    
                    setcurrentUserListValues(oldState=> ({ ...oldState, 
                        branch_office_code:fetchUserDataDetail.res.data.data.branch_office_code,
                        name:fetchUserDataDetail.res.data.data.name,
                        user_name:fetchUserDataDetail.res.data.data.user_name,
                        phone_code:fetchUserDataDetail.res.data.data.phone_code,
                        phone_number:fetchUserDataDetail.res.data.data.phone_number,
                        address:fetchUserDataDetail.res.data.data.address,
                        zip_code:fetchUserDataDetail.res.data.data.zip_code
                     }));
                    if(fetchUserDataDetail.res.data.data.userDetail.country_id!=null)
                    {
                        setcurrentCountry(fetchUserDataDetail.res.data.data.userDetail.country_id.toString());
                        await handleChange('country',fetchUserDataDetail.res.data.data.userDetail.country_id);
                    }
                    if(fetchUserDataDetail.res.data.data.userDetail.state_id!=null)
                    {
                        
                        setcurrentState(fetchUserDataDetail.res.data.data.userDetail.state_id.toString());
                        await handleChange('state',fetchUserDataDetail.res.data.data.userDetail.state_id);
                    }

                    if(fetchUserDataDetail.res.data.data.userDetail.city_id!=null)
                    {
                        await handleChange('city',fetchUserDataDetail.res.data.data.userDetail.city_id.toString()); 
                        //setcurrentCity(fetchUserDataDetail.res.data.data.userDetail.city_id.toString());
                    }
                   
                    console.log(fetchUserDataDetail.res.data.data.user_type,'fetchUserDataDetail.res.data.data.user_type')
                    setroleID(fetchUserDataDetail.res.data.data.roleMatch.id)
                    if(fetchUserDataDetail.res.data.data.user_type === 'BO'){
                        setcurrentCustomerName(parseInt(fetchUserDataDetail.res.data.data.head_office_user_id))
                        handleChange('userType','BO');
                    }
                }
            }


        };
        fetchData();

    }, []);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!loderFlag && (Object.keys(editDataList).length) > 0 && (Object.keys(countryDataList).length) > 0 && (Object.keys(stateDataList).length) > 0 && (Object.keys(cityDataList).length) > 0 && <>
                <ManageView formSubmitData={formSubmitData} dataDetails={dataDetails} editDataList={editDataList}  clientType={clientType} countryDataList={countryDataList} stateDataList={stateDataList} cityDataList={cityDataList} handleChange={handleChange} hoUserDataist={hoUserDataist} phoneCodeList={phoneCodeList} setroleIDInComp={setroleIDInComp} currentCountry={currentCountry} currentState={currentState} currentCity={currentCity} defaultUserTypeTitle={defaultUserTypeTitle} currentCustomerName={currentCustomerName} setttingCurrentCustomerName={setttingCurrentCustomerName} handleUpdate={handleUpdate} currentUserListValues={currentUserListValues} />
            </>}
            {!loderFlag && (Object.keys(editDataList).length) == 0 && <>
                <ManageView formSubmitData={formSubmitData} dataDetails={dataDetails} editDataList={editDataList} clientType={clientType} countryDataList={countryDataList} stateDataList={stateDataList} cityDataList={cityDataList} handleChange={handleChange} hoUserDataist={hoUserDataist} phoneCodeList={phoneCodeList} setroleIDInComp={setroleIDInComp} currentCountry={currentCountry} currentState={currentState} currentCity={currentCity} defaultUserTypeTitle={defaultUserTypeTitle} currentCustomerName={currentCustomerName} setttingCurrentCustomerName={setttingCurrentCustomerName} handleUpdate={handleUpdate} currentUserListValues={currentUserListValues} />
            </>}
        </>
    )
}

export default ManageComponent
