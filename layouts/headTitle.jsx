import React from 'react';
import styles from '../less/headTitle.less';
import {Icon} from 'antd';
import router from 'umi/router';

export default ({name,loading = false,reload,goBack = false})=>(
    <div className={styles.headTitle}>
        <div>
            <Icon type={goBack ? "arrow-left" : "bars"} style={goBack ? {cursor:"pointer"} : null} onClick={()=>router.goBack()}/> {name}
        </div>
        <div>
            {
                reload ?
                    <Icon type={loading ? "loading" : "reload"} style={loading ? null : {cursor:"pointer"}} onClick={loading ? null : reload}/> : null
            }
        </div>
    </div>
)