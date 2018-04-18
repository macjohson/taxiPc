import React from 'react';
import {Form,Input,Button,Row,Col,message} from 'antd';
import HeadTitle from '../../layouts/headTitle';
import defaultFormLayout from "../../common/defaultFormLayout";
import restFetch from "../../tools/restFetch";
import showErr from "../../tools/showErr";
const {Item}  = Form;

class changepassword extends React.PureComponent{
    validate = (rule,value,callback) => {
        const _val  = this.props.form.getFieldValue("newPwd");
        if(value && value !== _val){
            callback("两次输入的密码不一致")
        }
        callback()
    };

    state = {
        loading:false
    }

    submit = ()=>{
        this.props.form.validateFields((err,val)=>{
            if(!err){
                const opts = {
                    oldPassword:val.pwd,
                    newPassword:val.newPwd
                }
                this.fetchSubmit(opts)
            }
        })
    }

    fetchSubmit = async (opts)=>{
        try {
            await restFetch({
                api:"/api/services/app/user/ChangePassword",
                method:"POST",
                opts,
                body:true,
                loading:loading => this.setState({loading,})
            });
            await message.success("密码修改成功，请重新登录",1,()=>{
                sessionStorage.clear();
                window.location.assign('/')
            });
        }catch (e){
            showErr(e)
        }
    }

    render(){
        return (
            <div>
                <HeadTitle name={"修改密码"}/>
                <div className="hp-container">
                <Form>
                    <Item label={"原始密码"} {...defaultFormLayout}>
                        {
                            this.props.form.getFieldDecorator("pwd",{
                                rules:[{required:true,message:"请输入原始密码"}]
                            })(
                                <Input placeholder={"请输入"} type={"password"}/>
                            )
                        }
                    </Item>
                    <Item label={"新密码"} {...defaultFormLayout}>
                        {
                            this.props.form.getFieldDecorator("newPwd",{
                                rules:[{required:true,message:"请设置新密码"}]
                            })(
                                <Input placeholder={"请输入"} type={"password"}/>
                            )
                        }
                    </Item>
                    <Item label={"重复新密码"} {...defaultFormLayout}>
                        {
                            this.props.form.getFieldDecorator("retryPwd",{
                                rules:[{required:true,message:"请重复新密码"},{validator:this.validate}]
                            })(
                                <Input placeholder={"请输入"} type={"password"}/>
                            )
                        }
                    </Item>
                </Form>
                <Row>
                    <Col offset={defaultFormLayout.labelCol.span}>
                        <Button type={"primary"} onClick={this.submit} loading={this.state.loading}>提交</Button>
                    </Col>
                </Row>
                </div>
            </div>
        )
    }
}

export default Form.create()(changepassword)