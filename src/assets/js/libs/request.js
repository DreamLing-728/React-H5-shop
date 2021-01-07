import ReactDOM from 'react-dom';
let oLoad=ReactDOM.findDOMNode(document.getElementById("page-load"));
function request(pUrl,pType='GET'){
    showLoad();
    return fetch(pUrl,{method: pType}).then(res=> {
            hideLoad();
            return res.json();
        }
    );
}
function showLoad(){
    oLoad.style.display="block";
}
function hideLoad(){
    oLoad.style.display="none";
}
export {
    request
};