import fetch from 'isomorphic-fetch';
import queryString from 'query-string';

/**
 * 原生fetch封装
 * @param api 请求接口
 * @param options 请求参数
 * @returns {Promise<T | void>}
 * @constructor
 */
const XFetch = (api,options)=>{
    let __options = options || {};
    __options.credentials = 'include';
    return fetch(api,__options)
        .then(res => res.json())
        .then(data => data)
        .catch(e=>console.log(e))
};

/**
 * fetch请求
 * @param api 请求接口
 * @param method 请求方式
 * @param opts 请求参数{}
 * @param body 请求参数是否在body中
 * @param loading loading处理 (boolean)=>{}
 * @returns {Promise<any>}
 */
const restFetch = ({api,method = "GET",opts,body,loading = ()=>{}})=>{
    loading(true);
    const _api = body ? api : `${api}?${queryString.stringify(opts)}`;
    let options = {method};
    if(body){
        Object.assign(options,{
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(opts)
        })
    }
  return new Promise((resolve, reject) => {
      XFetch(_api,options)
          .then(({success,result,error})=>{
              loading(false);
              if(success){
                  resolve(result)
              }else{
                  if(error && error.message){
                      reject(error)
                  }else{
                      reject({message:"不好意思，服务器走神了！"})
                  }
              }
          })
          .catch(() => reject({message:"不好意思，服务器走神了！"}))
  })
};

export default restFetch;