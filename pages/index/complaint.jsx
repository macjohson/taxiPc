import React from 'react';
import {Row,Col,Table,Input} from 'antd';
import HeadTitle from '../../layouts/headTitle';
import showErr from "../../tools/showErr";
import listDefaultState from "../../common/listDefaultState";
import restFetch from "../../tools/restFetch";
import router from 'umi/router';

class complaint extends React.PureComponent{
    state = {
        ...listDefaultState,
        loading:false
    }
    columns = [
        {title:"司机姓名",dataIndex:"driverName",key:"driverName"},
        {title:"司机电话",dataIndex:"driverMobile",key:"driverMobile"},
        {title:"投诉内容",dataIndex:"content",key:"content"},
        {title:"车牌号",dataIndex:"licensePlate",key:"licensePlate"},
        {title:"操作",render:(text,record)=>(
            <span>
                <a onClick={()=>router.push({pathname:"/index/complaintDetail",query:{id:record.id}})}>查看详情</a>
            </span>
            )}
    ];

    fetchList = async (page,maxResultCount,filter)=>{
        try{
            const result = await restFetch({
                api:"/api/services/app/basic/GetComplaintPageList",
                method:"POST",
                opts:{
                    page,
                    maxResultCount,
                    filter
                },
                body:true,
                loading:bool => this.setState({loading:bool})
            })
            const {items,totalCount} = result;
            this.setState({
                items,
                totalCount,
                page,
                maxResultCount,
                filter
            })
        }catch (e){
            showErr(e)
        }
    }

    componentDidMount(){
        this.fetchList(1,10,null)
    }

    render(){
        return (
            <div>
               <HeadTitle name={"投诉信息"} loading={this.state.loading} reload={()=>this.fetchList(1,10,null)}/>
                <div className="hp-container">
                <Row style={{marginBottom:30}}>
                    <Col span={8} offset={16}>
                        <Input.Search onChange={e => this.setState({filter:e.target.value})} placeholder={"请输入关键字进行搜索"} onSearch={val => this.fetchList(1,10,val)} value={this.state.filter}/>
                    </Col>
                </Row>
                <Table columns={this.columns} dataSource={this.state.items} loading={this.state.loading} pagination={{
                    current:this.state.page,
                    pageSize:this.state.maxResultCount,
                    total:this.state.totalCount,
                    onChange:(C)=>this.fetchList(C,this.state.maxResultCount,this.state.filter),
                    showSizeChanger:true,
                    onShowSizeChange:(C,S)=>this.fetchList(1,S,this.state.filter),
                    showTotal:T => `共${T}条`
                }} rowKey={record => record.id}/>
                </div>
            </div>
        )
    }
}

export default complaint;