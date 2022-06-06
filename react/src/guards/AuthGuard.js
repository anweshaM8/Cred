import { commonJsFuncModule as commonJsObj } from '../utils/commonFunc';
import { history } from '../helpers/history';

const AuthGuard = () => {
    return commonJsObj.getUserInfo() ? true : false;
}

const AuthGuardForInactive = async() => {
    let res=await commonJsObj.getRealTimeUserInfo();
    console.log('res--->',res)

    if(res==true)
    {
        history.push('/login')
    }
    return res;
}



export { AuthGuard,AuthGuardForInactive };