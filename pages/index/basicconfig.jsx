import React from "react"
import { Form, Input, Button,message } from "antd"
import showErr from "../../tools/showErr"
import HeadTitle from "../../layouts/headTitle"
import restFetch from "../../tools/restFetch";
const {Item} = Form;

class basicconfig extends React.PureComponent {
    state = {
        configs: [],
        getLoading: false,
        loading:false
    }

    fetchConfig = async ()=>{
        this.setState({ getLoading: true });
        try {
            const result = await restFetch({
                api:"/api/services/app/basic/GetConfigList",
                loading:bool => this.setState({getLoading:bool})
            });
            this.setState({ configs: result,getLoading: false })
        }catch (e){
            showErr(e);
            this.setState({getLoading:false})
        }
    };

    submit = ()=>{
        this.props.form.validateFields((err,val)=>{
            if(!err){
                const keys = Object.keys(val);
                const opts = keys.map(item => {
                    return {id:item,value:val[item]}
                })
                this.fetchSave(opts)
            }
        })
    }

    fetchSave = async (opts)=>{
        this.setState({loading:true});
        try{
            await restFetch({
                api:"/api/services/app/basic/UpdateConfigInfo",
                method:"PUT",
                opts,
                body:true,
                loading:bool => this.setState({loading:bool})
            })
            this.setState({loading:false});
            message.success("保存成功");
            this.fetchConfig()
        }catch (e){
            showErr(e)
            this.setState({loading:false});
        }
    }

    componentDidMount() {
       this.fetchConfig();
    }
    render() {
        return (
            <div>
                <HeadTitle name={"数据配置"} loading={this.state.getLoading} reload={this.fetchConfig}/>
                <div className="hp-container">
                <Form>
                    {
                        this.state.configs.map((item,key)=>(
                            <Item label={item.name} key={key}>
                                {
                                    this.props.form.getFieldDecorator(`${item.id}`,{
                                        rules:[{required:true,message:"请填写"}],
                                        initialValue:item.value
                                    })(
                                        <Input placeholder={"请输入"} type={"number"} style={{width:520}}/>
                                    )
                                }
                            </Item>
                        ))
                    }
                </Form>
                <div>
                    {
                        this.state.configs.length !== 0 ?
                            <Button loading={this.state.loading} type={"primary"} onClick={this.submit}>保存</Button> :
                            null
                    }
                </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(basicconfig)
