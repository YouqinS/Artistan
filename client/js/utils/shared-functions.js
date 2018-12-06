'use strict';

import { makeRequest } from './network';
import { API } from './constants';

export const checkUserLoggedIn = () => {
	const userInfo = JSON.parse(localStorage.getItem('artisan_user'));
	if (userInfo.user_id) {
		const newElements = '<a class="" href="/upload">Share your art</a><a class="" href="/profile">Profile</a><a class="" href="/logout">Log out</a>';
		const navLinks = document.querySelector('.nav-links');
		navLinks.removeChild(document.querySelector('.login-link'));
		navLinks.insertAdjacentHTML('afterbegin', newElements);
	}
};

const columnWidth = 400; // 400px width for each image
export const calculateGalleryCols = () => {
	const gallery = document.querySelector('.gallery');
	gallery.style.columnCount = Math.floor(document.documentElement.clientWidth / columnWidth);
};

export const initApp = async() => {
	// get categories
	return await makeRequest(API.category.getAllCategories.url, API.category.getAllCategories.method)
		.then(resData => {
			if (resData && resData.length) {
				localStorage.setItem('categories', JSON.stringify(resData));
			}
		});
};
