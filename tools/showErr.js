import {notification} from 'antd';

/**
 * 错误提示
 * @param error {message:string}
 */
const showErr = (error)=>{
    try{
        notification.error({message:"出错了",description:error.message})
    }catch (e){
        notification.error({message:"出错了",description:"服务器错误"})
    }
};

export default showErr;