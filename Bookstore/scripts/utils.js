import CryptoJS from 'cryptojs';

function encryptToBase64(string){
    var toUtf8 = CryptoJS.enc.Utf8.parse(string); 
    var base64 = CryptoJS.enc.Base64.stringify(toUtf8);

    return base64;
}

function encryptToSha1(string){
    var toSha1 = CryptoJS.SHA1(string).toString();

    return toSha1;
}

var utils = { encryptToBase64, encryptToSha1 };
export { utils as UTILS };