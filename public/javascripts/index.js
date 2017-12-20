import coupon from './coupon';
import '../stylesheets/style.css';

var params = function (param) {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
        // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]], pair[1] ];
            query_string[pair[0]] = arr;
        // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    } 
    return query_string;
} ();

document.addEventListener('DOMContentLoaded', function() {
    if ( params.phoneNo ) {
        var codeEl = document.getElementById('code');
        codeEl.innerHTML = params.phoneNo;
        coupon.init({
	        campaign: {
	            campaignId: 'b46fd1e21b2d7ff50bac2ce6fd5dfdc3',
	            studioId: '51',
	            userId: '3774',
	            code: params.phoneNo // query parameter in the url for the coupon code
	        },
	        multipleRedemption: false,
	        pages: {
	            main: 'mainPage', // main page that has the coupon and a button that brings to confirm redeem page
	            confirm: 'confirmPage', // Redeem Confirmation page which has redeem button and cancel button
	            thankyou: 'thankyouPage', // Thank You page after redemption is successful
	            redeemed: 'redeemedPage' // 'Already redeemed page if the coupon is already readeemed'
	        },
	        buttons: {
	            main: { // main button that bring to confirm redeem page
	                id: 'mainBtn',
	                event: 'click', // event: 'click' || 'swipe'
	            },
	            redeem: { // redeem button on the confirmation page, clicking it will redeem the coupon
	                id: 'confirmBtn'
	            },
	            back: { // back buttons, clicking it will bring back to the main page
	                class: 'cancelBtn'
	            },
	        },
	        pin: { // {{optional}} for pin confirmation on redeem, please remove this if not using
	        	id: 'pinInput', // id of the <input> for code entering
	        	code: '0123' // confirmation pin code
	        },
	        storeSelect: { // {{optional}} for multi store, please remove this if it's single store
	        	id: 'storeInput', // id of the <select> for stores
                stores: ['store1','store2'] // stores to select
	        },
	        extRedeemTracker: ['http://externaltracker'], // {{optional}} for external tracker of redemption, please remove this if not using
	        trackingParam: { // used in the tracking url of redemption
	        	dsp: 'test',
	        	exchange: 'NA',
	        	inventory: 'www.test.com'
	        },
	        isPreview: true // preview mode or real serving mode. On preview mode, there's no actual validation nor tracking.
	    });
    }
    else {
    	alert('url doesn\'t contain phoneNo, please get the correct url with phoneNo');
    }
});

export {
  coupon
}