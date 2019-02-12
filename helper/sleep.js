module.exports = async function(interval){
    return new Promise((resolve)=>{
        setTimeout(resolve, interval);
    });
};