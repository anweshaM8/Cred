import React, { useState, useEffect, useContext } from 'react';
import ManageView from './ManageView';
import httpService from '../../../services/httpService';
import { ToastsStore } from 'react-toasts';
import CustLoader from '../../../utils/loader/CustLoader';
import { store } from '../../../storage/store';
import { commonJsFuncModule as commonJsObj } from '../../../utils/commonFunc';
import { history } from '../../../helpers/history';
import { encrypdycrypService } from '../../../services/encryp-dycryp.service';


const ManageComponent = (props) => {
    const globalState = useContext(store);
    const [loderFlag, setLoaderFlag] = useState(false);
    const [countryDataList, setCountryDataList] = useState({});
    const [orderInfo, setOrderInfo] = useState({});
    const [userAddressDataList, setUserAddressDataList] = useState({});

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }

    const fetchCountryAPI = async () => {
        showLoader();
        let countryDetail = await httpService.setModule('country').search({});
        hideLoader();
        return countryDetail;
    }
    const fetchUserAddress = async () => {
        showLoader();
        let userAddressDetail = await httpService.setModule('userAddress').findOne(commonJsObj.getCurrentUserId());
        hideLoader();
        return userAddressDetail;
    }
    const formSubmitdata = async (submitedData) => {

        let formData = submitedData;
        formData['orderDetail'] = [];
        var orderPackageItem = [];
        if (orderInfo.addAddonItem.length > 0) {
            orderInfo.addAddonItem.map((e) => {
                orderPackageItem.push({
                    "basic_package_tenure": orderInfo.itemDetail.tenure,
                    "basic_package_amt": orderInfo.itemDetail.payAbleAmt,
                    "addon_package_id": e.addons_id,
                    "addon_package_tenure": e.tenure,
                    "addon_package_amt": e.valueDataForSum,
                    "item_detail": JSON.stringify(orderInfo.itemDetail),
                    "addons_detail": JSON.stringify(orderInfo.addAddonItem)
                })
            })
        }
        else {
            orderPackageItem.push({
                "basic_package_tenure": orderInfo.itemDetail.payAbleAmt,
                "basic_package_amt": orderInfo.itemDetail.tenure,
                "item_detail": JSON.stringify(orderInfo.itemDetail)
            })
        }
        formData['orderId'] = '#WPA-' + props.match.params.checkoutId;
        formData['user_id'] = commonJsObj.getCurrentUserId();
        formData['orderDetail'] = orderPackageItem;
        formData['discount_price'] = 0.00;
        formData['subtotal_price'] = parseFloat(orderInfo.totalAmt.youSave) + parseFloat(orderInfo.totalAmt.payableAmt);
        formData['total_price'] = orderInfo.totalAmt.payableAmt;
        formData['payment_type'] = 'COD';

        let orderSubmitted = await httpService.setModule('order').create(formData);


    }

    useEffect(() => {

        const fetchData = async () => {

            const userAddressDetail = await fetchUserAddress();
            if (userAddressDetail.res.data.status === 'success') {
                setUserAddressDataList(userAddressDetail.res.data.data);
            }
            const countryDetail = await fetchCountryAPI();
            if (countryDetail.res.data.status === 'success') {
                setCountryDataList(countryDetail.res.data.data);
            }
            
        };
        fetchData();
 
    }, [globalState, props.match.params.checkoutId])

    useEffect(() => {
        if (sessionStorage.getItem('orderInfo') === null) {
            history.push('/checkout/' + props.match.params.checkoutId);
        }
        else {
            let o = encrypdycrypService.decryptAES(sessionStorage.getItem('orderInfo'));
            setOrderInfo(JSON.parse(o));
        }

    }, [globalState, props.match.params.checkoutId]);

    return (
        <>
            {loderFlag ? <CustLoader /> : ''}
            {!loderFlag && countryDataList && <>
                <ManageView countryDataList={countryDataList} orderInfo={orderInfo} formSubmitdata={formSubmitdata} userAddressDataList={userAddressDataList} />
            </>}
        </>
    )
}

export default ManageComponent
