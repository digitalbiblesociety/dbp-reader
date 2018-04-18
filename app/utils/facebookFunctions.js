// Make FB equal undefined to avoid issues
const FB = { getLoginStatus() {}, api() {} };
// This is called with the results from from FB.getLoginStatus().
export function statusChangeCallback(response) {
	// console.log('statusChangeCallback');
	// console.log(response);
	// The response object is returned with a status field that lets the
	// app know the current login status of the person.
	// Full docs on the response object can be found in the documentation
	// for FB.getLoginStatus().
	if (response.status === 'connected') {
		// Logged into your app and Facebook.
		testAPI(response);
	}
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
export function checkLoginState() {
	FB.getLoginStatus((response) => {
		statusChangeCallback(response);
	});
}

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
export function testAPI(fbData) {
	// console.log('Welcome!  Fetching your information.... ');
	FB.api('/me',
		{
			fields: 'name,last_name,about,birthday,email',
			access_token: fbData.authResponse.accessToken,
		},
		(/* response */) => {
			// console.log('Successful login for:', response.name);
			// console.log('response for userId', response);
		// FB.api(`/${response.id}`, (r) => console.log('response for userId', r));
		});
}
