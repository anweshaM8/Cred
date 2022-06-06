import React from 'react';
import './AccessErrorStyle.scss';
import {MetaTagsView} from '../Common/meta-tags/MetaTagsView';


const AccessErrorView = () => {
    return (
        <div className="list-details">
             <MetaTagsView title="Access Not Found" />
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <div className="content_area card">
                        <div className="box_structure">
                            <div className="box_body">
                                <div className="row">
                                    <div className="col-md-12 col-sm-12">
                                      PermissionErrorStyle
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>

    );

}
export default AccessErrorView;