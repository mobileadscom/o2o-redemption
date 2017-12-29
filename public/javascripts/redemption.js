import transitions from './transitions'; // contains page transitions animation
import slider from './slider'; // add sliding event
import jammer from './jammer'; // prevent double clicking on buttons, which will cause bugs
import axios from 'axios';

var coupon = {
    'trackRedeem': function (code) {
        var cb = new Date().valueOf();
        var trackingUrl = "";
        if (coupon.stores) { /* Multi store */
            var storeId = code.substr(code.length - 1);
            trackingUrl = 'https://track.richmediaads.com/a/analytic.htm?uid=0&isNew=false&userId=' + coupon.campaign.userId + '&pubUserId=0&rmaId=' + coupon.campaign.studioId + '&domainId=0&p=1&tabId=0&componentId=0&customId=&campaignId=' + coupon.campaign.campaignId + '&dsp=' + coupon.trackingParam.dsp + '&exchange=' + coupon.trackingParam.exchange + '&inventory=' + coupon.trackingParam.inventory +'&uniqueId=' + code + '&domain=&type=' + storeId + '&cb=' + cb + '&pageLoadId=' + cb + '&tt=E';
        }
        else { /* Single store */
            trackingUrl = 'https://track.richmediaads.com/a/analytic.htm?uid=0&isNew=false&userId=' + coupon.campaign.userId + '&pubUserId=0&rmaId=' + coupon.campaign.studioId + '&domainId=0&p=1&tabId=0&componentId=0&customId=&campaignId=' + coupon.campaign.campaignId + '&dsp=' + coupon.trackingParam.dsp + '&exchange=' + coupon.trackingParam.exchange + '&inventory=' + coupon.trackingParam.inventory +'&uniqueId=' + code + '&domain=&type=redeem&cb=' + cb + '&pageLoadId=' + cb + '&tt=E';
        }
        var img = document.createElement('img');
        img.src = trackingUrl;
        img.style.display = 'none';
        var bodyTag = document.getElementsByTagName('body')[0];
        bodyTag.appendChild(img);
        if (coupon.extRedeemTracker) {
            for (var e in coupon.extRedeemTracker) {
                var img = document.createElement('img');
                img.src = coupon.extRedeemTracker[e];
              img.style.display = 'none';
              bodyTag.appendChild(img);
            }
        }
    },
    'showPage': function (page) {
        transitions.fadeOut(this.currentPage);
        setTimeout(function() {
           transitions.slideIn(page); 
           if ( coupon.currentPage == coupon.pages.confirm ) {
                if ( coupon.pin ) {
                    coupon.pin.value = "";
                }
           }
        }, 350);
        this.currentPage = page;
    },
    'redeem': function (apiParam) {
        if (coupon.isPreview) {
            coupon.showPage(coupon.pages.thankyou);
        }
        else {
            if ( !coupon.multipleRedemption ) { /* single redemption */
                var _this = this;
                axios.get('https://www.mobileads.com/api/coupon/redeem_coupon', {
                    params: apiParam
                }).then(function (response) {
                    if (response.data.status == true) {
                        coupon.showPage(coupon.pages.thankyou);
                        coupon.trackRedeem(apiParam.code);
                    }
                    else {
                        coupon.showPage(coupon.pages.redeemed);
                    }
                }).catch(function (error) {
                    alert('Connection error');
                    console.log(error);
                });
            }
            else { /* multiple redemption */
                coupon.showPage(coupon.pages.thankyou);
                coupon.trackRedeem(apiParam.code);
            }
        }
    },
    'validate': function (apiParam) {
        console.log(apiParam);
        if (coupon.isPreview) {
            if ( coupon.stores ) { /* multi store */
                coupon.showPage(coupon.pages.thankyou);
            }
            else { /* single redemption */
                coupon.currentPage.style.display = 'block';
            }
        }
        else {
            axios.get('https://www.mobileads.com/api/coupon/validate_coupon', {
                params: apiParam
            }).then(function (response) {
                if (response.data.status == true) { /* can redeem */
                    if ( coupon.stores ) {
                        if (coupon.multipleRedemption) { // multiple store, multiple redemption
                            coupon.showPage(coupon.pages.thankyou);
                            coupon.trackRedeem(apiParam.code);
                        }
                        else { // multiple store, single redemption
                            coupon.redeem(apiParam);
                        }
                        coupon.storeSelect.value = "n";
                    }
                    else { // single store
                        coupon.currentPage.style.display = 'block';
                    }
                } 
                else { /* already redeemed */
                    if ( response.data.message == 'Coupon not exist.') {
                        coupon.showPage(coupon.pages.invalid);
                    }
                    else {
                        coupon.showPage(coupon.pages.redeemed);
                    }
                }
            }).catch(function (error) {
                alert('Invalid coupon or connection error');
                console.log(error);
            });
        }
    },
    'init': function (options) {
        /* copy options into coupon object */
        for (var i in options) {
            coupon[i] = options[i];
        }
        
        /* pages setup */
        for (var p in coupon.pages) {
            coupon.pages[p] = document.getElementById(coupon.pages[p]);
            coupon.pages[p].style.display = 'none';
        }
        coupon.currentPage = coupon.pages.main;
        
        /* pin setup */
        if ( coupon.pin ) {
            coupon.pinCode = coupon.pin.code;
            coupon.pin = document.getElementById(coupon.pin.id);
            coupon.pin.style.display = 'inline-block';
        }

        /* store selection setup */
        if ( coupon.storeSelect ) {
            coupon.stores = coupon.storeSelect.stores;
            coupon.storeSelect = document.getElementById(coupon.storeSelect.id);
            for ( var s = 0; s < coupon.stores.length; s++ ) {
                var opt = document.createElement('option');
                opt.value = s;
                opt.innerHTML = coupon.stores[s];
                coupon.storeSelect.appendChild(opt);
            }
            coupon.storeSelect.style.display = 'inline-block';
        }

        /* buttons setup */
        var event = options.buttons.main.event;
        coupon.buttons.main = document.getElementsByClassName(coupon.buttons.main.class);
        coupon.buttons.redeem = document.getElementById(coupon.buttons.redeem.id);
        coupon.buttons.back = document.getElementsByClassName(coupon.buttons.back.class);

        // main button
        for ( var m = 0; m < coupon.buttons.main.length; m++ ) {
            if (event == 'swipe') {
                coupon.pages.main.style.display = 'block'; // slider width can't be measured if 'display' is 'none'
                slider.init(coupon.buttons.main[m], function() {
                    coupon.showPage(coupon.pages.confirm);
                });
                coupon.pages.main.style.display = 'none';
            } 
            else {
                // coupon.buttons.main[m].parentElement.className = "";
                coupon.buttons.main[m].addEventListener('click', function () {
                    if ( !jammer.isJammed(this) ) {
                        jammer.jam(this);
                        coupon.showPage(coupon.pages.confirm);
                    }
                });
            }
        }

        // redeem button
        coupon.buttons.redeem.addEventListener('click', function() {
            if ( !jammer.isJammed(this) ) {
                jammer.jam(this);
                if ( !coupon.stores ) { /* single store */
                    var proceed = true
                    if ( coupon.pinCode ) {
                        proceed = coupon.pin.value == coupon.pinCode ? true : false;
                    }
                    if ( proceed ) {
                        coupon.redeem({
                            userId: coupon.campaign.userId,
                            studioId: coupon.campaign.studioId,
                            code: coupon.campaign.code
                        })
                    }
                    else {
                        alert('Please enter the correct pin');
                    }
                }
                else { /* multiple store */
                    var errCount = 0;
                    var errMsg = "";
                    var storeId = 0;
                    if ( coupon.pinCode ) {
                        if ( coupon.pin.value != coupon.pinCode ) {
                            errCount++;
                            errMsg = "Please enter the correct pin";
                        }
                        if ( coupon.stores ) {
                            if ( coupon.storeSelect.value == "n" ) {
                                errCount++;
                                errMsg = "Please select store";
                            }
                        }
                    }
                    
                    if ( coupon.stores ) {
                        if ( coupon.storeSelect.value == "n" ) {
                            errCount++;
                            errMsg = "Please select store";
                        }
                        else {
                            storeId = coupon.storeSelect.value;
                        }
                    }
                    
                    if ( errCount == 0 ) {
                        coupon.validate({
                            userId: coupon.campaign.userId,
                            studioId: coupon.campaign.studioId,
                            code: coupon.campaign.code.toString() + storeId.toString()
                        });
                    }
                    else {
                        alert(errMsg);
                    }
                }
            }
        })

        //back button
        for ( var b = 0; b < coupon.buttons.back.length; b++ ) {
            coupon.buttons.back[b].addEventListener('click', function () {
                if ( !jammer.isJammed(this) ) {
                    jammer.jam(this);
                    coupon.showPage(coupon.pages.main);
                }
            });
        }

        // elements and settings done, start now
        if ( !coupon.stores ) { /* single store */
            console.log('single store');
            coupon.validate({
                userId: coupon.campaign.userId,
                studioId: coupon.campaign.studioId,
                code: coupon.campaign.code
            });
        }
        else { /* multi store */
            console.log('multi store');
            coupon.currentPage.style.display = 'block';
        }
    }
};

window.coupon = coupon;