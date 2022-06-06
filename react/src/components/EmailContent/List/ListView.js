import React from 'react';
import Breadcrumb from '../../Common/Breadcrumb';
import { Link } from 'react-router-dom';
import './ListStyle.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt,faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { MetaTagsView } from '../../Common/meta-tags/MetaTagsView';
import { encrypdycrypService } from '../../../helpers/encryp-dycryp';


const ListView = (props) => {
    return (
        <div className="list-details">
            <Breadcrumb pageTitleIcon={faEnvelope} pageTitle="Email Content List" />
            <MetaTagsView title="Email Content List" />

            <div className="table-wrapper">

                <div className="table-heading bg-white">
                    <div className="d-flex align-items-center">
                        <span className="mr-auto"><strong className="title-bor-l">Showing:</strong> {(props.dataList.length > 0) ? props.dataList.length : 0} items</span>
                    </div>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Title</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.dataList.length > 0 && props.dataList.map((_item, _index) => (

                                <tr key={_index}>
                                    <td>{_item.id}</td>
                                    <td>{_item.title}</td>
                                    <td> {(new Date(_item.created_at)).toLocaleDateString('en-US')}</td>

                                    <td>
                                        {
                                            (props.editContentPermission) ? <Link className="btn-edit-rouned" to={`/email-content/manage/${_item.id}`}>  <FontAwesomeIcon icon={faPencilAlt} /></Link> : "-"
                                        }

                                    </td>
                                </tr>
                            ))}
                            {props.dataList.length == 0 && <tr><td colSpan="10" className="text-center">No Record Found</td></tr>}
                        </tbody>
                    </table>


                </div>
           
            </div>


        </div>

    );

}
export default ListView;