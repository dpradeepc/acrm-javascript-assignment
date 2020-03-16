class FingerprintService {

    generateDeviceFingerprint() {

        let options = {}

        return new Promise((resolve) => {
            if (localStorage.uniqueDeviceId) {
                resolve(localStorage.uniqueDeviceId);
            } else {
                Fingerprint2.get(options, function (components) {
                    var values = components.map(function (component) {
                        return component.value
                    });
                    let deviceFingerprint = Fingerprint2.x64hash128(values.join(''), 31);
                    localStorage.setItem("uniqueDeviceId", deviceFingerprint);
                    resolve(Fingerprint2.x64hash128(values.join(''), 31));
                })
            }
        })
    }

}



class UtilityService {

    generateSessionId() {

        if (sessionStorage.sessionId) {
            return (sessionStorage.sessionId);
        } else {
            let newSessionId = Math.round(Date.now() + Math.random());
            sessionStorage.setItem("sessionId", newSessionId);
            return newSessionId;
        }
    }

}

class DataService {

    apiEndpoint = 'https://someapiendpoint/';

    getUserID(uniqueId, sessionId) {
        console.log(uniqueId, sessionId);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', apiEndpoint);
        xhr.send();
        xhr.onload = () => {
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

        xhr.onerror = (e) => {
            console.log(e);
        };

    }
}

dataService = new DataService();
fingerprintService = new FingerprintService();
utilityService = new UtilityService();

window.addEventListener('DOMContentLoaded', () => {
    sessionId = utilityService.generateSessionId();
    fingerprintService.generateDeviceFingerprint().then((uniqueId) => {
        return dataService.getUserID(uniqueId, sessionId)
    });
});