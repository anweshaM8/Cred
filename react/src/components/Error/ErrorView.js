import React from 'react';
import './ErrorStyle.scss';
import {MetaTagsView} from '../Common/meta-tags/MetaTagsView';

const ErrorView = () => {
    return (
        <div className="list-details">
             <MetaTagsView title="404 Page Not Found" />
            <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                    <div className="content_area card">
                        <div className="box_structure">
                            <div className="box_body">
                                <div className="row">
                                    <div className="col-md-12 col-sm-12">
                                       404 Page Not Found
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
export default ErrorView;