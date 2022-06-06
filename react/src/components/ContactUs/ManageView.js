import React, { useContext } from 'react';
import Breadcrumb from '../Common/Breadcrumb';
import './ManageStyle.scss';
import { useForm } from "react-hook-form";
import { MetaTagsView } from '../Common/meta-tags/MetaTagsView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
import { store } from '../../storage/store';
import Pagination from "react-js-pagination";

const ManageView = (props) => {
	const { register, handleSubmit, errors } = useForm();
	const globalState = useContext(store);

	return (
		<div className="list-details">
			<MetaTagsView title="Contact Us" />
			<Breadcrumb pageTitleIcon={faEnvelopeOpenText} pageTitle="Contact Us" />
			<div className="row">
				<div className="col-12">

					{
						(props.isAdmin) ? <><div className="table-wrapper">

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
											<th>Name</th>
											<th>Email</th>
											<th>Phone Number</th>
											<th>Message</th>
										</tr>
									</thead>
									<tbody>
										{props.dataList.length > 0 && props.dataList.map((_item, _index) => (

											<tr key={_index}>
												<td>{_item.id}</td>
												<td>{_item.name}</td>
												<td>{_item.email}</td>
												<td>{_item.phone_number}</td>
												<td>{_item.message}</td>
											</tr>
										))}
										{props.dataList.length == 0 && <tr><td colSpan="10" className="text-center">No Record Found</td></tr>}
									</tbody>
								</table>


							</div>

						</div> <div className="col-12 px-0 pagination-tbl-btm mt-2">
								{(props.dataList.length > 0 && props.paginationPageCount > 0) ?
									<Pagination
										hideDisabled
										activePage={props.curPage}
										itemsCountPerPage={parseInt(process.env.REACT_APP_PAGINATION_LIMIT)}
										totalItemsCount={props.paginationData.rowCount}
										pageRangeDisplayed={5}
										onChange={props.handlePageChange}
									/>
									:
									" "
								}
							</div></> : <div className="form-ui-wrapper white-panel">
							<div className="row">
								<div className='col-6 col-md-6'>
									<h1 class="f16"><span className='txt'>Reach us at</span>
									</h1>
									<div className='help-details'>
										<div className='pt-4 d-flex align-items-center'>
											<div className='pb-4 d-flex align-items-center'>
												<span class="help-icon mr-3"><svg width="24" height="24" viewBox="0 0 24 24">
													<g id="call" transform="translate(-848 -1216)">
														<rect id="Path" width="24" height="24" transform="translate(848 1216)"
															fill="rgba(0,0,0,0)"></rect>
														<path id="Icon"
															d="M868,1237a17,17,0,0,1-17-17,1,1,0,0,1,1-1h3.5a1,1,0,0,1,1,1,11.359,11.359,0,0,0,.57,3.57,1,1,0,0,1-.25,1.02l-2.2,2.2a15.234,15.234,0,0,0,6.59,6.59l2.2-2.2a1.017,1.017,0,0,1,.71-.291.823.823,0,0,1,.31.05,11.356,11.356,0,0,0,3.569.57,1,1,0,0,1,1,1V1236A1,1,0,0,1,868,1237Zm-3.6-3.98-1.2,1.19a15.445,15.445,0,0,0,3.8.751v-1.49a12.859,12.859,0,0,1-2.6-.45ZM853.03,1221h0a14.879,14.879,0,0,0,.76,3.791l1.2-1.2a12.269,12.269,0,0,1-.45-2.59Z"
															fill="#000"></path>
													</g>
												</svg></span>
												<span>{(globalState.state.settingDataSet.length > 0 && (globalState.state.settingDataSet[2])) ? globalState.state.settingDataSet[2].value : ""}</span>
											</div>
										</div>
										<div class="pb-4 d-flex align-items-center"><span class="help-icon mr-3"><svg width="24"
											height="24" viewBox="0 0 24 24">
											<g id="perm_identity" transform="translate(-644 -374)">
												<rect id="Path" width="24" height="24" transform="translate(644 374)"
													fill="rgba(0,0,0,0)"></rect>
												<path id="Icon"
													d="M664,394H648v-3c0-.819.52-2,3-3a12.976,12.976,0,0,1,10,0c2.479.993,3,2.178,3,3v3Zm-8-5c-2.7,0-5.8,1.289-6,2.01V392h12v-1C661.8,390.283,658.7,389,656,389Zm0-3a4,4,0,1,1,4-4A4.005,4.005,0,0,1,656,386Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,656,380Z"
													fill="#000"></path>
											</g>
										</svg></span><span>Contact Person:
												<span class="font-weight-normal"> <span>{(globalState.state.settingDataSet.length > 0 && (globalState.state.settingDataSet[4])) ? globalState.state.settingDataSet[4].value : ""}</span></span>
											</span></div>
										<div class="pb-4 d-flex align-items-center"><span class="help-icon mr-3"><svg width="24"
											height="24" viewBox="0 0 24 24">
											<g id="email" transform="translate(-916 -1216)">
												<rect id="Path" width="24" height="24" transform="translate(916 1216)"
													fill="rgba(0,0,0,0)"></rect>
												<path id="Icon"
													d="M936,1236H920a2,2,0,0,1-2-2v-12a2,2,0,0,1,2-2h16a2,2,0,0,1,2,2v12A2,2,0,0,1,936,1236Zm-16-12h0v10h16v-10l-8,5Zm0-2,8,5,8-5Z"
													fill="#000"></path>
											</g>
										</svg></span><span><span>{(globalState.state.settingDataSet.length > 0 && (globalState.state.settingDataSet[1])) ? globalState.state.settingDataSet[1].value : ""}</span></span></div>
									</div>
								</div>

								<div className='col-6 col-md-6'>
									<form onSubmit={handleSubmit(props.formSubmit)}>
										<div className="row">

											<div className="form-group col-12 col-md-12">
												<label className="mb-1">Name <span className="clr-red">*</span></label>
												<input className="inp form-control" type="text" name="name" ref={register({
													required: "Required",
													pattern: {
														value: /^[a-zA-Z][a-zA-Z\s]*$/,
														message: "Name contains atleast one character without any space in the begining"
													}

												})} />
												{errors.name && <p className="error">{errors.name.message}</p>}

											</div>
											<div className="form-group col-12 col-md-12">
												<label className="mb-1">Email <span className="clr-red">*</span></label>
												<input className="inp form-control icn-email" type="email" name="email" ref={register({
													required: "Required",
													pattern: {
														value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
														message: "invalid email address"
													}
												})} />
												{errors.email && <p className="error">{errors.email.message}</p>}

											</div>
											<div className="form-group col-12 col-md-12">
												<label className="mb-1">Phone Number <span className="clr-red">*</span></label>
												<input className="inp form-control" type="text" name="phone_number" ref={register({
													required: "Required",
													pattern: {
														value: /^[0-9+][0-9\s+]*$/,
														message: "Numbers and + are allowed without any space in the begining"
													},

													minLength: {
														value: 10,
														message: "At least 10 digits required"
													},
													maxLength: {
														value: 25,
														message: "Max 25 digits applicable"
													}

												})} />
												{errors.phone_number && <p className="error">{errors.phone_number.message}</p>}

											</div>
											<div className="form-group col-12">
												<label className="mb-1">Message <span className="clr-red">*</span></label>
												<textarea className="inp form-control" rows="5" name="message" ref={register({
													required: "Required",
													pattern: {
														value: /^[a-zA-Z0-9][a-zA-Z0-9\s\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\>\=\?\@\[\]\{\}\\\\\^\_\`\~]*$/,
														message: "Alpabets/Numbers/special characters are allowed without any space in the begining"
													}

												})} />
												{errors.message && <p className="error">{errors.message.message}</p>}

											</div>
										</div>
										<div className="mt-4 d-flex align-items-center btn__back__to-hld">
											<button className="btn btn-success" type="submit">Submit <FontAwesomeIcon className="ml-1" icon={faFileUpload} /></button>
										</div>

									</form>
								</div>
							</div>
						</div>
					}



				</div>
			</div>


		</div>

	);

}
export default ManageView;