   'use strict';

    if (typeof jQuery === "undefined") {

	   var script = document.createElement('script');
	   script.src = 'https://code.jquery.com/jquery-latest.min.js';
	   script.type = 'text/javascript';
	   document.getElementsByTagName('head')[0].appendChild(script);
   }

	var _pushassist = {};

	_pushassist.appkey		= "AIzaSyAExvLquLphb8ImrLNOz_jo_3F47n__LuQ";
	_pushassist.serverUrl	= "https://api2.pushassist.com";
	_pushassist.safariServerUrl	= "https://pushassist.com/api";
	_pushassist.Url			= "dualmods.pushassist.com";
	_pushassist.subdomain	= "dualmods";
	_pushassist.assetsURL	= "https://cdn.pushassist.com/account";
	_pushassist.linkUrl		= "";
	_pushassist.ipaddress	= "";
	_pushassist.branding = '<div class=\"pushassist_noti_branding top_right psa_animated psa_fadeInUp\" id=\"pushassist_notification_inner_wraper\"> <div class=\"pushassist_noti_branding_inner_wraper\"> <a href=\"javascript:void(0)\" id=\"psa_ssl_branding\" class=\"pushassist_noti_branding_close\"></a> <a class=\"pushassist_noti_branding_message\" target=\"_blank\" href=\"#\"> <span class=\"pushassist_noti_branding_txt\">Notifications Powered By</span> <img src=\"#"> <span class=\"pushassist_noti_branding_brandname\"></span> </a> </div></div>';
	_pushassist.brandingFlag = 0;
	_pushassist.intervalTime = 3;

    var _pa;

    function get_values() {

        var fontURL = "https://fonts.googleapis.com/css?family=Roboto:400,100,300",
        headfonts = document.getElementsByTagName("head")[0],
        fontlink = document.createElement("link");
        fontlink.rel = "stylesheet", fontlink.href = fontURL, headfonts.appendChild(fontlink);

        var cssUrl = _pushassist.assetsURL + "/css/psa-notification.css",
        headcss = document.getElementsByTagName("head")[0],
        link = document.createElement("link");
        link.type = "text/css", link.rel = "stylesheet", link.href = cssUrl, headcss.appendChild(link);

        var parent = document.getElementsByTagName("script")[0];
        var manifest = document.createElement("link");
        manifest.rel = "manifest";
        manifest.href = "/manifest.json";

        var head = parent;
        head.parentNode.insertBefore(manifest,head);

        var script = document.createElement('script');
        script.src = 'https://api.ipify.org?format=jsonp&callback=getIP';
        script.type = 'application/javascript';
        document.getElementsByTagName('body')[0].appendChild(script);
    }

    function push_assist_branding()
    {
	   if(Notification.permission === 'default') {

		   jQuery("body").append(_pushassist.branding);

		   document.getElementById("psa_ssl_branding").addEventListener("click", function () {

			   remove_psa_branding();
		   });
	   }
    }

    function is_mobile() {

		var mobile_device;

		mobile_device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

		return mobile_device;
	}

    function remove_psa_branding(){

        if(_pushassist.brandingFlag === 0){

           var n = document.getElementById("pushassist_notification_inner_wraper");
           n.remove();
       }
    }

    function getIP(json) {

        _pushassist.ipaddress = json.ip;
    }

	function check_browser_version() {

		var nAgt = navigator.userAgent, fullVersion  = '' + parseFloat(navigator.appVersion), majorVersion = parseInt(navigator.appVersion,10), verOffset;

		if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {

			fullVersion = nAgt.substring(verOffset+7);

		} else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {

			fullVersion = nAgt.substring(verOffset+7);

			if ((verOffset=nAgt.indexOf("Version"))!=-1)
				fullVersion = nAgt.substring(verOffset+8);

		} else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {

			fullVersion = nAgt.substring(verOffset+8);

		}

		majorVersion = parseInt('' + fullVersion,10);

		return majorVersion;
	}

	function check_browser() {

		var name 	= navigator.userAgent;
        var browser	= name.match(/(opera|chrome|safari|firefox|msie)\/?\s*/i);

		return browser[1];
	}

	function browser_compatible(){

		if("Chrome" === check_browser()){

			return "Notification" in window && "serviceWorker" in navigator && "showNotification" in ServiceWorkerRegistration.prototype && "PushManager" in window && check_browser_version() >= 42 ? !0 : !1;

		} else if("Firefox" === check_browser()){

			return check_browser_version() > 43 ? !0 : !1;

		} else if("Safari" === check_browser()){

			return "safari" in window && "pushNotification" in window.safari ? !0 : !1;
		}
	}

	function setCookie(name, value, exdays) {
        var n = new Date;
        n.setTime(n.getTime() + 24 * exdays * 60 * 60 * 1e3);
        var a = "; expires=" + n.toUTCString();
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + a + "; path=/"
	}

	function getCookie(name){
        for (var i = name + "=", t = document.cookie.split(";"), n = 0; n < t.length; n++) {
            for (var a = t[n];
                " " == a.charAt(0);) a = a.substring(1);
            if (0 == a.indexOf(i)) return a.substring(i.length, a.length)
        }
        return ""
	}

	function notify() {

		if (!("Notification" in window)) {
			console.warn("This browser does not support desktop notification");
		}else if (Notification.permission === "granted") {
			// console.warn("permission granted");
		}else if (Notification.permission !== "denied") {
			Notification.requestPermission(function (permission) {
				if (permission === "granted") {

                    remove_psa_branding();

					if ("serviceWorker" in navigator) {
                        navigator.serviceWorker.register("/service-worker.js", {scope: "/"})
							.then(initialiseState);
                        subscribe();
                    } else {
						console.warn("Service workers are not supported in this browser.");
					}
				}

				if (permission === "denied") {

					setCookie("pushassist_notification_status", "block", 1e4);

                    remove_psa_branding();
				}
			})
		}
	}

    function _pa_params() {

        var _pa_out = [], i;

        if (typeof _pa === 'undefined') {
            _pa = [];
        }

        var _length = _pa.length;

        if (_length > 0) {

            for (i=0 ; i<_length; ++i) {

             _pa_out.push(encodeURIComponent(_pa[i]));

            }

            return _pa_out;
        }
    }

	function safari_notify() {

		if ("safari" in window && "pushNotification" in window.safari) {
			var permissionData = window.safari.pushNotification.permission(_pushassist.safariWebsitePushId);
			checkRemotePermission(permissionData);
		}
	}

    function checkRemotePermission(permissionData) {

        var segment_string =  '';

        var segment_array =  _pa_params();  //get segment array

        if(segment_array !== undefined){

            segment_string =  segment_array.toString(); // convert array into string
        }

        if (permissionData.permission === "default") {

            window.safari.pushNotification.requestPermission(
               _pushassist.safariServerUrl,
               _pushassist.safariWebsitePushId,
                {
                    'subdomain': _pushassist.subdomain,
                    'ipaddress': _pushassist.ipaddress,
                    'segments': segment_string
                },
                checkRemotePermission
            );
        }
        else if (permissionData.permission === "denied") {

            setCookie("pushassist_notification_status", "block", 1e4);

            remove_psa_branding();
        }
        else if (permissionData.permission === "granted") {

            setCookie("pushassist_notification_status", "subscribe", 1e4);

            remove_psa_branding();
        }
	}

	function initialiseState() {

		if (Notification.permission === "denied") {
			console.warn("The user has blocked notifications.");
			return;
		}

		// We need the service worker registration to check for a subscription
		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			serviceWorkerRegistration.pushManager.getSubscription()
			.then(function(subscription) {
				if (!subscription) {
					return ;
				}
			}).catch(function(err) {
				console.warn("Error during getSubscription()", err);
			});
		});
	}

	function subscribe() {
		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
			.then(function(subscription) {

			    var endpointURL = subscription.endpoint;

				var registration_id = endpointURL.substr(endpointURL.lastIndexOf("/") + 1);

                var send_segment = _pa_params();

				// send update to server
				var json = {
					json: JSON.stringify({
						sub_domain: _pushassist.subdomain,
						registration_id: registration_id,
						browser: check_browser(),
						ip_address: _pushassist.ipaddress,
						segment: send_segment,
						browser_endpoint: endpointURL
					})
				};

				var clickDeliveryURL = _pushassist.serverUrl + "/receiver/";

				// send update to server
				return fetch(clickDeliveryURL, {
					method: 'post',
					body: json.json
				}).then(function(response) {

					if (response.status !== 200) {
						console.log("Looks like there was a problem. Status Code: " + response.status);
						throw new Error();
					}

					// Examine the text in the response
					return response.json().then(function(data) {

						if (data.status != "Success" || !data.notification) {
							console.error("The API returned an error.", data.status);
							throw new Error();
						}

						setCookie("pushassist_notification_status", "subscribe", 1e4);
                        setCookie("pushassist_key", registration_id, 1e4);

                        if(is_mobile() == false){

                            return navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
                                var options = {
                                    body: data.notification.message,
                                    tag: data.notification.tag,
                                    icon: data.notification.icon + '?notificationURL=' + encodeURIComponent(data.notification.url),
                                    url: data.notification.url
                                };

                                return serviceWorkerRegistration.showNotification(data.notification.title, options);
                            });
                        }

					});

				}).catch(function(err) {

					console.error("Unable to retrieve data while subscribing ", err);

				});
			}).catch(function(e) {

				if (Notification.permission === "denied") {
					console.warn("Permission for Notifications was denied");
				} else {
					console.error("Unable to subscribe to push.", e);
				}
			});
		});
	}

	self.addEventListener("load", function() {

	    get_values();

	    if(_pushassist.brandingFlag === 0 && is_mobile() === false){

	        push_assist_branding();
        }

	    var pushassist_prompt = document.getElementsByClassName('psa_show_notification_opt_in');

		if (pushassist_prompt.length === 0) {

            if(!0 === browser_compatible()){

            "subscribe" === getCookie("pushassist_notification_status") || "block" === getCookie("pushassist_notification_status") ? void 0 : "Safari" !== check_browser() ? setTimeout( function() { notify() }, _pushassist.intervalTime * 1000) : setTimeout( function() { safari_notify() }, _pushassist.intervalTime * 1000);

            } else {

                console.warn("This browser does not support push notification.");
            }
        } else {

			 for (var i = 0; i < pushassist_prompt.length; i++) {

				 pushassist_prompt[i].addEventListener('click', function () {

				    if(!0 === browser_compatible()){

                       "subscribe" === getCookie("pushassist_notification_status") || "block" === getCookie("pushassist_notification_status") ? void 0 : "Safari" !== check_browser() ? notify() : safari_notify();

                    } else {

                        console.warn("This browser does not support push notification.");
                    }
				 });
		     }
		}

	});
