import {Modal} from 'antd';

/**
 * 确认提示modal
 * @param title
 * @param content
 * @returns {Promise<any>}
 */
export default ({title,content})=>{
    return new Promise((resolve, reject) => {
        const confirm = Modal.confirm({
            title,
            content,
            onOk:()=>resolve(confirm)
        })
    })
}