import React, { createContext, useReducer, useEffect, useState } from 'react';
import CustLoader  from '../utils/loader/CustLoader';
import axios from 'axios';

let initialState = { "lang": {} };
const store = createContext(initialState);
const { Provider } = store;
let settingDataSet = {};


const StateProvider = ({ children }) => {
    const [loderFlag, setLoaderFlag] = useState(false);

    let showLoader = () => {
        setLoaderFlag(true);
    }
    let hideLoader = () => {
        setLoaderFlag(false);
    }
    
    useEffect(() => {
        showLoader(); 
        const fetchSettingData = () => {
           return axios.get(process.env.REACT_APP_BASEURL + '/site-setting', { headers: {'Content-Type': 'application/json'} })           
          .then(res => {
            hideLoader();     
              if(res.data.status === 'success'){               
                settingDataSet = res.data.data;
                initialState = { ...initialState, settingDataSet: settingDataSet };
                dispatch({ type: 'storeData' })
              }
          })          
          .catch(err => {
            hideLoader();     
              console.log(err);
          });
      };
      fetchSettingData();
    }, []);
    

    const [state, dispatch] = useReducer((state, action) => {

            switch (action.type) {
                    case 'storeData':
                        let newState = {};
                        if (localStorage.getItem('lang') === 'en') {
                            newState = { ...initialState, lang:"en","settingDataSet":settingDataSet, };// do something with the action
                        } 
                        
                        return newState;
                    default:
                        throw new Error();
                };
            }, initialState);

    return (<>
         {loderFlag ? <CustLoader /> : ''}
        {!loderFlag && <Provider value={{ state, dispatch }}>
            {children}
        </Provider>}
    </>);
};

export { store, StateProvider }