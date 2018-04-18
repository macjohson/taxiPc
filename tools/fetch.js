import fetch from 'isomorphic-fetch';
import queryString from 'query-string';

const XFetch = (api,options)=>{
    let __options = options || {};
    __options.credentials = 'include';
    return fetch(api,__options)
        .then(res => res.json())
        .then(data => data)
        .catch(e=>console.log(e))
};

const get = (api,opts)=>{
  return XFetch(`${api}?${queryString.stringify(opts)}`)
};

const post = (api,opts,body = true)=>{
    if(!body){
        return XFetch(`${api}?${queryString.stringify(opts)}`,{
            method:"POST",
        })
    }

    return XFetch(api,{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(opts)
    })
};

const del = (api,opts)=>{
    return XFetch(`${api}?${queryString.stringify(opts)}`,{
        method:"DELETE"
    })
};

const put = (api,opts)=>{
    return XFetch(api,{
        method:"PUT",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(opts)
    })
}

const request = {
    get,
    post,
    del,
    put
};


export default request