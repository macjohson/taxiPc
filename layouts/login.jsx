import React from "react"
import styles from "../less/login.less"
import { Form, Input, Icon, Button, notification } from "antd"

const Login = ({login,loading,form})=>{
    const _handleLogin = ()=>{
        form.validateFields((err,val)=>{
            if(!err){
                login(val)
            }else{
                const errKeys = Object.keys(err);
                const message = err[errKeys[0]].errors[0].message;
                notification.error({ message: "出错了", description: message })
            }
        })
    }

    return (
        <div className={styles.login}>
            <div className="login-box">
                <div className="top-bar">用户登录</div>
                <div className="login-form">
                    <Input
                        placeholder={"用户名"}
                        {...form.getFieldProps("userName", {
                            rules: [{ required: true, message: "请填写用户名" }]
                        })}
                        prefix={<Icon type={"user"} />}
                    />
                    <Input
                        placeholder={"密码"}
                        type={"password"}
                        {...form.getFieldProps("password", {
                            rules: [{ required: true, message: "请填写密码" }]
                        })}
                        prefix={<Icon type="key" />}
                    />
                </div>
                <div className={"btn"}>
                    <Button
                        type={"primary"}
                        size={"large"}
                        loading={loading}
                        onClick={_handleLogin}
                    >
                        登录
                    </Button>
                </div>
                <div className="copy">
                    <p />
                </div>
            </div>
        </div>
    )
}

export default Form.create()(Login)
