
function updateDataType(newDataType) {
    setSessionStorage("dataType", newDataType);
    load();
}

function getSessionStorage(key) {
    return sessionStorage.getItem(key);
}

function setSessionStorage(key,value) {
    sessionStorage.setItem(key, value);
}