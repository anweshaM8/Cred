import React, { useState, useEffect, useContext } from 'react';
import ProfileView from './ProfileView';
import httpService from './../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../utils/loader/CustLoader';
import { store } from '../../storage/store';
import { history } from '../../helpers/history';
import { commonJsFuncModule as commonJsObj } from '../../utils/commonFunc';


const ProfileComponent = (props) => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
    const [dataDetails, setDataList] = useState({});
    const [countryDataList, setCountryDataist] = useState({});
    const [stateDataList, setStateDataist] = useState({});
    const [cityDataList, setCityDataist] = useState({});
    const [phoneCodeList, setPhoneCodeList] = useState({});

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }



    let fetchAPI = async () => {
        let userDetail = await httpService.setModule('user').findOne(commonJsObj.getCurrentUserId());
        return userDetail;

    }
    let fetchCountryAPI = async () => {
        let countryDetail = await httpService.setModule('country').search({});
        return countryDetail;
    }

    let fetchStateAPI = async (countryId) => {
        setStateDataist({})
        setCityDataist({})
        let stateDetail = await httpService.setModule('state').search({ country_id: countryId });
        return stateDetail;
    }
    let fetchCityAPI = async (stateId) => {
        setCityDataist({})
        let cityDetail = await httpService.setModule('city').search({ stateId: stateId });
        return cityDetail;
    }
    const handleChange = async (type, value) =>{
        switch (type){
            case "country" :
                const stateDetail = await fetchStateAPI(value);
                if (stateDetail.res.data.status === 'success') {
                    setStateDataist(stateDetail.res.data.data);
                    
                }
            break;

            case "state" :
                const cityDetail = await fetchCityAPI(value);
                if (cityDetail.res.data.status === 'success') {
                    setCityDataist(cityDetail.res.data.data);
                }
            break;
            default:
                console.log('default')
        }
            
    }

    const formSubmitData = async (submitedData, e) => {

        showLoader();
        submitData(submitedData); 

    }

    const submitData = async (data) => {
        // console.log(data,'commonJsObjcommonJsObj');
        // return false;
        //showLoader();
        // let info = commonJsObj.getUserInfo();
        // if (info) {            
        data.id = commonJsObj.getCurrentUserId();
        data.created_by = commonJsObj.getCurrentUserId();;
      

        httpService.setModule('user').update(data).then(async (response) => {
            hideLoader();
            if (response.res.data.status === 'success') {
                if (response.res.data.code === 200) {

                    
                    history.push('/dashboard');
                    ToastsStore.success('You have successfully updated your profile');

                }
                else {
                    ToastsStore.error('Internal Server Error');
                }
            }
            else {
                ToastsStore.error('Internal Server Error');
            }


        }, (error) => {
            hideLoader();
            ToastsStore.error('Internal Server Error');
        });


    }

    const fetchData = async () => {

        const userDetail = await fetchAPI();
        if (userDetail.res.data.status === 'success') {
            setDataList(userDetail.res.data.data);
            const countryDetail = await fetchCountryAPI();
            if (countryDetail.res.data.status === 'success') {

                setCountryDataist(countryDetail.res.data.data);
                var countryList = countryDetail.res.data.data;
                countryList = countryList.reduce((c, n) => c.find(el => el.phonecode == n.phonecode) ? c : [...c, n], []);

                countryList = countryList.sort((a,b) => (a.phonecode > b.phonecode) ? 1 : ((b.phonecode > a.phonecode) ? -1 : 0))

                setPhoneCodeList(countryList);

                const stateDetail = await fetchStateAPI(userDetail.res.data.data.userDetail.country_id);
                if (stateDetail.res.data.status === 'success') {
                    setStateDataist(stateDetail.res.data.data);
                }
                const cityDetail = await fetchCityAPI(userDetail.res.data.data.userDetail.state_id);
                if (cityDetail.res.data.status === 'success') {
                    setCityDataist(cityDetail.res.data.data);
                }
            }
        }
        hideLoader();
    };

    useEffect(() => {

        showLoader();


        fetchData();

    }, []);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!loderFlag && <>
                <ProfileView formSubmitData={formSubmitData} dataDetails={dataDetails} phoneCodeList={phoneCodeList} countryDataList={countryDataList} stateDataList={stateDataList} cityDataList={cityDataList} handleChange={handleChange} />
            </>}
        </>
    )
}

export default ProfileComponent
