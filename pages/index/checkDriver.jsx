import React from 'react';
import {Form,Input,Radio,Row,Col,Button,message,Spin} from 'antd';
import HeadTitle from '../../layouts/headTitle';
import defaultFormLayout from "../../common/defaultFormLayout";
import request from "../../tools/fetch";
import showErr from "../../tools/showErr";
import router from 'umi/router';
const {Group} = Radio,{Item} = Form;

class checkDriver extends React.PureComponent{
    state = {
        loading:false,
        detailLoading:false,
        detail:{}
    }

    fetchSubmit = val=>{
        this.setState({loading:true})
        request.post("/api/services/app/user/CreateOrUpdateDriver",val)
            .then(({success,error}) => {
                this.setState({loading:false})
                if(success){
                    message.success("操作成功");
                    router.goBack()
                }else{
                    showErr(error)
                }
            })
    }

    handleSubmit = ()=>{
        this.props.form.validateFields((err,val)=>{
            if(!err){
                const {id = null} = this.props.history.location.query;
                val.id = id;
                this.fetchSubmit(val)
            }
        })
    }

    componentDidMount(){
        const {id} = this.props.history.location.query;
        if(id){
            this.setState({detailLoading:true})
            request.get("/api/services/app/user/GetDriverOutput",{Id:id})
                .then(({success,result,error})=>{
                    this.setState({detailLoading:false})
                    if(success){
                        this.setState({detail:result})
                    }else{
                        showErr(error)
                    }
                })
        }
    }

    componentWillUnmount(){
        this.props.form.resetFields()
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const {id} = this.props.history.location.query;
        return (
            <div>
            <HeadTitle name={"司机信息维护"} goBack={true}/>
                <div className="hp-container">
                <Spin spinning={this.state.detailLoading}>
                    <Form>
                        <Item label="姓名" {...defaultFormLayout}>
                            {getFieldDecorator("name", {
                                rules: [{ required: true, message: "请填写姓名" }],
                                initialValue:this.state.detail.name
                            })(<Input placeholder="请输入" />)}
                        </Item>
                        <Item label="性别" {...defaultFormLayout}>
                            {getFieldDecorator("gender", {
                                rules: [{ required: true, message: "请选择性别" }],
                                initialValue:this.state.detail.gender
                            })(
                                <Group>
                                    <Radio value={1}>男</Radio>
                                    <Radio value={2}>女</Radio>
                                </Group>
                            )}
                        </Item>
                        <Item label="电话号码" {...defaultFormLayout}>
                            {getFieldDecorator("phoneNumber", {
                                rules: [{ required: true, message: "请填写电话号码" }],
                                initialValue:this.state.detail.phoneNumber
                            })(<Input placeholder="请输入" type="number" disabled={id ? true : false} />)}
                        </Item>
                        <Item label="车牌号" {...defaultFormLayout}>
                            {getFieldDecorator("licensePlate", {
                                rules: [{ required: true, message: "请填写车牌号" }],
                                initialValue:this.state.detail.licensePlate
                            })(<Input placeholder="请输入" />)}
                        </Item>
                    </Form>
                    <Row>
                        <Col offset={defaultFormLayout.labelCol.span}>
                            <Button type={"primary"} loading={this.state.loading} style={{marginRight:15}} onClick={this.handleSubmit}>提交</Button>
                            <Button onClick={()=>router.goBack()}>取消</Button>
                        </Col>
                    </Row>
                </Spin>
                </div>
            </div>
        )
    }
}

export default Form.create()(checkDriver)