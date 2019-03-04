
function updateDataType(newDataType) {
    sessionStorage.setItem("dataType", newDataType);
    load();
}