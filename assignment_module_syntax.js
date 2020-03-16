const ACRM = {};

(function (context) {

    var FingerPrintService = {};

    FingerPrintService.generateDeviceFingerprint = function () {
        var options = {}

        return new Promise((resolve) => {

            if (localStorage.uniqueDeviceId) {
                resolve(localStorage.uniqueDeviceId);
            } else {
                Fingerprint2.get(options, function (components) {
                    var values = components.map(function (component) {
                        return component.value
                    });
                    var deviceFingerprint = Fingerprint2.x64hash128(values.join(''), 31);
                    localStorage.setItem("uniqueDeviceId", deviceFingerprint);
                    resolve(Fingerprint2.x64hash128(values.join(''), 31));
                })
            }

        })

    }

    context.FingerPrintService = FingerPrintService;

})(ACRM);



(function (context) {

    var UtilityService = {};

    UtilityService.generateSessionId = function () {

        if (sessionStorage.sessionId) {
            return (sessionStorage.sessionId);
        } else {
            var newSessionId = Math.round(Date.now() + Math.random());
            sessionStorage.setItem("sessionId", newSessionId);
            return newSessionId;
        }

    }

    context.UtilityService = UtilityService;

})(ACRM);

(function (context) {

    var DataService = {};
    const apiEndpoint = 'https://someapiendpoint/';

    DataService.getUserID = (uniqueId, sessionId) => {
        console.log(uniqueId, sessionId);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', apiEndpoint);
        xhr.send();
        xhr.onload = function () {
            if (xhr.status != 200) {
                //handle error
            } else {
                try {
                    console.log(JSON.parse(xhr.response));
                } catch (e) {
                    console.log(e);
                }

            }
        };

        xhr.onerror = function (e) {
            console.log(e);
        };

    }

    context.DataService = DataService;

})(ACRM);

(function (context) {

    var InitService = {};

    window.addEventListener('DOMContentLoaded', function (event) {
        sessionId = ACRM.UtilityService.generateSessionId();
        ACRM.FingerPrintService.generateDeviceFingerprint().then((uniqueId) => {
            return ACRM.DataService.getUserID(uniqueId, sessionId)
        });
    });

    context.InitService = InitService;

})(ACRM);