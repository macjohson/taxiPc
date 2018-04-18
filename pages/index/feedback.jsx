import React from 'react';
import {Row,Col,Table,Input} from 'antd';
import HeadTitle from '../../layouts/headTitle';
import showErr from "../../tools/showErr";
import listDefaultState from "../../common/listDefaultState";
import restFetch from "../../tools/restFetch";

class feedback extends React.PureComponent{
    state = {
        ...listDefaultState,
        loading:false
    }
    columns = [
        {title:"电话号码",dataIndex:"phoneNumber",key:"phoneNumber"},
        {title:"意见/反馈",dataIndex:"remark",key:"remark"},
        {title:"创建时间",dataIndex:"creationTime",key:"creationTime"},
    ];

    fetchList = async (page,maxResultCount,filter)=>{
        const opts = {page,maxResultCount,filter};
        try{
            const result = await restFetch({
                api:"/api/services/app/basic/GetFeedBackPageList",
                method:"POST",
                opts,
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
    };

    componentDidMount(){
        this.fetchList(1,10,null)
    }

    render(){
        return (
            <div>
               <HeadTitle name={"意见反馈"} loading={this.state.loading} reload={()=>this.fetchList(1,10,null)}/>
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

export default feedback;