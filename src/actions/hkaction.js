function addHistoryKeywords(data){
    console.log('hkaction', data)
    return {
        type:"addHk",
        data:data
    }
}
export{
    addHistoryKeywords
}