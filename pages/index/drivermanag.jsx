import React from 'react';
import {Button,Row,Col,Table,Input,Divider,message,Modal} from 'antd';
import listDefaultState from "../../common/listDefaultState";
import request from "../../tools/fetch";
import showErr from "../../tools/showErr";
import HeadTitle from '../../layouts/headTitle';
import router from 'umi/router';

class drivermanag extends React.Component{
    state = {
        ...listDefaultState
    }

    columns = [
        { title: "用户名", dataIndex: "userName", key: "userName" },
        { title: "姓名", dataIndex: "name", key: "name" },
        { title: "生日", dataIndex: "birthdayText", key: "birthdayText" },
        { title: "性别", dataIndex: "genderText", key: "genderText" },
        { title: "车牌", dataIndex: "licensePlate", key: "licensePlate" },
        {
            title: "当前状态",
            dataIndex: "currentStatusText",
            key: "currentStatusText"
        },
        {
            title: "创建时间",
            dataIndex: "creationTimeText",
            key: "creationTimeText"
        },
        {
            title:"操作",
            key:"action",
            render:(text,record,index)=>(
                <span>
                    <a onClick={()=>router.push({pathname:"/index/checkDriver",query:{id:record.id}})}>编辑</a>
                    <Divider type={"vertical"}/>
                    <a onClick={()=>this.handleDelete(record.id,index)}>删除</a>
                    <Divider type={"vertical"}/>
                    <a onClick={()=>router.push({pathname:"/index/performance",query:{id:record.id}})}>绩效</a>
                </span>
            )
        }
    ];

    fetchList = (page,maxResultCount,filter)=>{
        this.setState({loading:true})
        request.post("/api/services/app/user/GetDriverList",{
            page,
            maxResultCount,
            filter
        })
            .then(res => {
                this.setState({loading:false})
                const {success,result,error} = res;
                if(success){
                    const {items,totalCount} = result;
                    this.setState({
                        items,
                        totalCount,
                        page,
                        maxResultCount,
                        filter
                    })
                }else{
                    showErr(error)
                }
            })
    }

    handleDelete = (Id,key)=>{
        const confirm = Modal.confirm({
            title:"操作提示",
            content:"确定要删除该司机？",
            onOk:()=>this.fetchDel({Id},key,confirm)
        })
    }

    fetchDel = (opts,key,confirm)=>{
        message.loading("删除中",0);
        request.del("/api/services/app/user/DeleteDriver",opts)
        .then(({success,result,error})=>{
            message.destroy()
            confirm.destroy()
            if(success){
                message.success("操作成功");
                const items = this.state.items;
                items.splice(key,1)
                this.setState({items})
            }else{
                showErr(error)
            }
        })
    }


    componentDidMount(){
        this.fetchList(1,10,null)
    }

    render(){
        return (
            <div>
                <HeadTitle name={"司机管理"} loading={this.state.loading} reload={()=>this.fetchList(1,10,null)}/>
                <div className="hp-container">
                <Row style={{marginBottom:30}}>
                    <Col span={4}>
                        <Button type={"primary"} onClick={()=>router.push('/index/checkDriver')}>新增</Button>
                    </Col>
                    <Col span={8} offset={12}>
                        <Input.Search placeholder={"输入关键词进行搜索"} value={this.state.filter} onChange={e => this.setState({filter:e.target.value})} onSearch={val => this.fetchList(1,10,val)}/>
                    </Col>
                </Row>
                <Table columns={this.columns} loading={this.state.loading} dataSource={this.state.items} rowKey={record=>record.id} pagination={{
                    current:this.state.page,
                    pageSize:this.state.maxResultCount,
                    total:this.state.totalCount,
                    onChange:(C)=>this.fetchList(C,this.state.maxResultCount,this.state.filter),
                    showSizeChanger:true,
                    onShowSizeChange:(C,S)=>this.fetchList(1,S,this.state.filter),
                    showTotal:T => `共${T}条`
                }}/>
                </div>
            </div>
        )
    }
}

export default drivermanag;