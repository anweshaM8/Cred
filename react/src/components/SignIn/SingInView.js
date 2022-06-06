import React, { useContext } from 'react'
import { useForm } from "react-hook-form";
import './SignIn.scss';
import { MetaTagsView } from '../Common/meta-tags/MetaTagsView';
import { store } from '../../storage/store';
import { Link } from 'react-router-dom';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../assets/images/logo.png';


const SingInView = ({ loginSubmit }) => {
	const globalState = useContext(store);
	console.log(globalState, 'globalState')
	const { register, handleSubmit, watch, errors } = useForm();
	const togglePW = (e) => {
		let x = document.getElementById("pwLogin");

		if (x.type === "password") {
			x.type = "text";
			e.target.classList.add('showPW');
		} else {
			x.type = "password";
			e.target.classList.remove('showPW');
		}
	}
	return (
		<div className="login py-4">
			<MetaTagsView title="Login Panel" />
			<div className="login-page">
				<div className="container App">


					<div className="row align-items-center">
						<div className="col-md-7 login-logo">
							<img
								alt="interlinkages"
								src={logo}
							/>
						</div>
						<div className="d-flex login-form bg-white p-5 col-md-5 m-auto flex-column">
							<p className="f-16 mb-1">Welcome Back</p>
							<h3 className="f-24 pb-2">Log into your account</h3>
							<form onSubmit={handleSubmit(loginSubmit)} className="w-100 pt-4">
								<div className="form-group">
									<label className="mb-1">Email <span className="clr-red">*</span></label>
									<div className="input__icon">
										<input className="inp form-control icn-email" type="email" name="user_name" ref={register({
											required: "Required",
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
												message: "invalid email address"
											}
										})} />
										<i class="input__icon__field icon-email"></i>
									</div>

									{errors.user_name && <p className="error">{errors.user_name.message}</p>}

								</div>
								<div className="form-group">
									<label className="mb-1">Password <span className="clr-red">*</span></label>
									<div className="position-relative">
										<div className="input__icon">
											
											<input className="inp form-control icn-pw" type="password" id="pwLogin" name="password" ref={register({
												required: "Required"
											})} />
											<i class="input__icon__field icon-pw"></i>
										</div>
										{errors.password && <p className="error">{errors.password.message}</p>}

										<span className="password-eye d-inline-block" onClick={(e) => togglePW(e)}>
											<svg className="icon-hidePw" width="20" height="20" enableBackground="new 0 0 297 297" version="1.1" viewBox="0 0 297 297">
												<path fill="#707070" d="m296.29 144.92c-0.36-0.869-9.072-21.511-31.772-42.015-20.738-18.733-57.701-41.064-116.02-41.064-24.88 0-45.841 4.029-63.325 10.089l-34.398-34.399c-3.66-3.658-9.59-3.658-13.25 0-3.659 3.659-3.659 9.591 0 13.25l28.951 28.951c-14.429 7.13-25.721 15.461-34.24 23.184-22.638 20.524-31.197 41.194-31.55 42.063-0.909 2.24-0.918 4.744-0.024 6.99 0.347 0.871 8.75 21.569 31.327 42.112 20.599 18.744 57.533 41.087 116.51 41.087 24.73 0 45.647-4.113 63.133-10.281l34.59 34.59c1.83 1.829 4.227 2.744 6.625 2.744s4.795-0.915 6.625-2.744c3.659-3.659 3.659-9.591 0-13.25l-29.22-29.22c14.124-7.06 25.278-15.267 33.768-22.88 22.823-20.466 31.843-41.054 32.215-41.92 1.001-2.322 1.018-4.95 0.051-7.287zm-250.99 35.932c-14.511-13.007-22.379-26.193-25.55-32.315 3.216-6.126 11.183-19.332 25.764-32.359 10.402-9.294 22.08-16.777 34.965-22.445l0.505 0.505c-11.97 14.863-19.147 33.741-19.147 54.267 0 21.131 7.605 40.515 20.217 55.571-13.628-5.752-25.905-13.498-36.754-23.224zm103.2 35.579c-37.454 0-67.926-30.471-67.926-67.926 0-15.356 5.128-29.533 13.753-40.922l19.852 19.852c-3.78 6.135-5.966 13.351-5.966 21.07 0 22.214 18.073 40.287 40.287 40.287 7.719 0 14.936-2.186 21.07-5.966l19.852 19.852c-11.389 8.624-25.566 13.753-40.922 13.753zm7.094-47.583c-2.223 0.777-4.609 1.205-7.093 1.205-11.882 0-21.549-9.666-21.549-21.549 0-2.485 0.428-4.87 1.205-7.093l27.437 27.437zm-14.187-40.687c2.223-0.777 4.609-1.205 7.093-1.205 11.882 0 21.549 9.666 21.549 21.549 0 2.485-0.428 4.87-1.205 7.093l-27.437-27.437zm61.266 61.266-19.852-19.852c3.78-6.135 5.967-13.351 5.967-21.07 0-22.214-18.073-40.287-40.287-40.287-7.719 0-14.936 2.186-21.07 5.966l-19.852-19.852c11.39-8.625 25.566-13.753 40.922-13.753 37.453 0 67.925 30.471 67.925 67.926 0 15.356-5.128 29.533-13.753 40.922zm13.491 13.492-0.148-0.148c11.97-14.863 19.147-33.741 19.147-54.267 0-20.964-7.484-40.212-19.918-55.217 13.277 5.723 25.308 13.365 36.026 22.91 14.541 12.949 22.596 26.074 25.899 32.251-5.43 9.905-23.356 37.644-61.006 54.471z" />
											</svg>
											<svg className="icon-showPw" width="20" height="20" enableBackground="new 0 0 297 297" version="1.1" viewBox="0 0 297 297">
												<path fill="#707070" d="m296.29 144.92c-0.36-0.869-9.072-21.511-31.772-42.015-20.738-18.733-57.701-41.064-116.02-41.064-58.645 0-95.593 22.337-116.26 41.076-22.637 20.523-31.196 41.193-31.549 42.063-0.909 2.24-0.918 4.744-0.024 6.99 0.347 0.871 8.75 21.569 31.327 42.112 20.599 18.744 57.533 41.087 116.51 41.087 57.653 0 94.643-22.318 115.52-41.041 22.823-20.466 31.843-41.054 32.215-41.92 1.001-2.322 1.018-4.951 0.051-7.288zm-250.99 35.932c-14.511-13.007-22.379-26.193-25.55-32.315 3.216-6.126 11.183-19.332 25.764-32.359 10.787-9.637 22.941-17.335 36.396-23.073-12.526 15.031-20.073 34.35-20.073 55.4 0 21.13 7.605 40.515 20.217 55.571-13.628-5.752-25.905-13.498-36.754-23.224zm103.2 35.579c-37.455 0-67.926-30.472-67.926-67.926s30.471-67.926 67.926-67.926 67.926 30.472 67.926 67.926-30.471 67.926-67.926 67.926zm67.249-13.327c12.131-14.914 19.415-33.92 19.415-54.599 0-20.964-7.484-40.212-19.918-55.217 13.277 5.723 25.308 13.365 36.026 22.91 14.541 12.949 22.596 26.074 25.899 32.251-5.451 9.94-23.488 37.847-61.422 54.655z" />
												<path fill="#707070" d="m148.5 108.21c-22.214 0-40.287 18.073-40.287 40.287s18.073 40.287 40.287 40.287 40.287-18.073 40.287-40.287-18.073-40.287-40.287-40.287zm0 61.836c-11.883 0-21.549-9.666-21.549-21.549s9.667-21.549 21.549-21.549 21.549 9.666 21.549 21.549-9.666 21.549-21.549 21.549z" />
											</svg>

										</span>
									</div>

								</div>
								<div className="mt-4 text-center">
									<input className="btn btn-success w-100" type="submit" value="Login" />
								</div>
								<div class="m-0 d-flex justify-content-between form-group">
									<div class="link py-4"><Link to="/forget-password" class="pr-2">Forgot Password</Link></div></div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SingInView
