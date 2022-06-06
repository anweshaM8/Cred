import React, { useContext } from 'react';
import { Helmet } from "react-helmet";
import { store } from '../../../storage/store';


const MetaTagsView = ({ title,description,keywords }) => {
    const globalState = useContext(store);


    return (
        <>
            {
                 <Helmet>
                    <meta charSet="utf-8" />
                    <title> Credence| {title}</title>                    
                    <meta property="og:locale" content={localStorage.getItem('lang') }/>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, shrink-to-fit=no" /> 
                    <link rel="canonical" href={process.env.REACT_SITE_URL} />
                </Helmet>
            }

        </>
    );

}

export { MetaTagsView }