let hasEncryptedResult=false;

function showPopup(message,type="info"){
let existingPopup=document.getElementById("app-popup");

if(existingPopup){
existingPopup.remove();
}

let popup=document.createElement("div");
popup.id="app-popup";
popup.className="app-popup "+type;
popup.textContent=message;

document.body.appendChild(popup);

setTimeout(function(){
popup.classList.add("show");
},10);

setTimeout(function(){
popup.classList.remove("show");
setTimeout(function(){
if(popup.parentNode){
popup.remove();
}
},250);
},2200);
}

function encryptMessage(){

let message=document.getElementById("message").value;
let password=document.getElementById("password").value;

if(message==""||password==""){
showPopup("Enter message and password","warning");
return;
}

let encrypted=CryptoJS.AES.encrypt(message,password).toString();

document.getElementById("result").value=encrypted;
hasEncryptedResult=true;

}

function decryptMessage(){

let messageValue=document.getElementById("message").value.trim();
let resultValue=document.getElementById("result").value.trim();
let password=document.getElementById("password").value;

if(password==""){
showPopup("Enter password","warning");
return;
}

let encrypted=messageValue;

if(hasEncryptedResult&&resultValue!=""){
encrypted=resultValue;
}

if(encrypted==""){
showPopup("Enter encrypted message","warning");
return;
}

try{

let bytes=CryptoJS.AES.decrypt(encrypted,password);
let decrypted=bytes.toString(CryptoJS.enc.Utf8);

if(decrypted==""){
showPopup("Wrong password or invalid message","error");
}else{
document.getElementById("result").value=decrypted;
hasEncryptedResult=false;
showPopup("Message decrypted successfully","success");
}

}catch{

showPopup("Invalid encrypted message","error");

}

}

function copyEncryptedMessage(){

let result=document.getElementById("result").value;
let copyButton=document.getElementById("copy-btn");

if(result==""){
showPopup("No encrypted message to copy","warning");
return;
}

if(!hasEncryptedResult){
showPopup("Please encrypt a message first","warning");
return;
}

navigator.clipboard.writeText(result).then(function(){
if(copyButton){
copyButton.textContent="Copied ✅";
setTimeout(function(){
copyButton.textContent="Copy Encrypted";
},1500);
}
document.getElementById("message").value="";
document.getElementById("password").value="";
document.getElementById("result").value="";
hasEncryptedResult=false;
showPopup("Encrypted message copied","success");
}).catch(function(){
showPopup("Copy failed. Please try again.","error");
});

}

if("serviceWorker" in navigator){
window.addEventListener("load",function(){
navigator.serviceWorker.register("./service-worker.js?v=3");
});
}
