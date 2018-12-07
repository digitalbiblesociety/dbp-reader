export default (userProfile) => {
	if (typeof document !== 'undefined') {
		localStorage.setItem('bible_is_user_id', userProfile.userId);
		localStorage.setItem('bible_is_user_email', userProfile.userEmail);
		localStorage.setItem('bible_is_user_name', userProfile.userName);
		localStorage.setItem('bible_is_user_nickname', userProfile.userName);

		document.cookie = `bible_is_user_id=${userProfile.userId};path=/`;
		document.cookie = `bible_is_name=${userProfile.userName};path=/`;
		document.cookie = `bible_is_email=${userProfile.userEmail};path=/`;
		document.cookie = `bible_is_first_name=${userProfile.userName};path=/`;
	}
};
