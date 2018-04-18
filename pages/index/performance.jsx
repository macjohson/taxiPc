import React from 'react';
import {Tabs,Table,Button,Row,Col,message} from 'antd';
import HeadTitle from '../../layouts/headTitle';
import restFetch from "../../tools/restFetch";
import showErr from "../../tools/showErr";
import listDefaultState from "../../common/listDefaultState";
import confirm from "../../tools/confirm";
const {TabPane} = Tabs;

class performance extends React.PureComponent{
    tabs = ["已核销","未核销"];
    state = {
        activeKey:"0",
        loading:false,
        ...listDefaultState,
        amount:0,
        noneAmount:0,
        allAmount:0,
        getLoading:false,
        showAmount:{
            time:null,amount:null
        }
    };

    handleTabChange = async (activeKey)=>{
        await this.setState({activeKey})
        this.fetchList(1,10,null)
    };

    fetchList = async (page,maxResultCount,filter)=>{
        const opts = {
            status:this.state.activeKey === "0" ? 1 : 2,
            driverId:this.props.location.query.id,
            page,
            maxResultCount,
            filter
        };

        try{
            const result = await restFetch({
                api:"/api/services/app/basic/GetDriverPerformancePageList",
                method:"POST",
                loading:loading => this.setState({loading}),
                opts,
                body:true
            })
            const {driverPerformanceOutputes:{items,totalCount},amount,noneAmount,allAmount} = result;
            this.setState({items,totalCount,amount,noneAmount,allAmount,page,maxResultCount,filter})
        }catch(e){
            showErr(e)
        }
    }

    fetchAmount = async ()=>{
        const opts = {
            Id:this.props.location.query.id
        }
        try{
            const result = await restFetch({
                api:"/api/services/app/basic/VerificationDriverAmount",
                method:"POST",
                opts,
                body:false,
                loading:getLoading => this.setState({getLoading})
            })
            const {time,amount} = result
            await this.setState({showAmount:{time,amount}})
            const _alert = await confirm({title:"核销确认",content:`本次核销的时间为${this.state.showAmount.time},核销金额${this.state.showAmount.amount}，请点击确认进行核销！`})
            this.fetchConfirm(_alert)
        }catch (e){
            showErr(e)
        }
    }

    fetchConfirm = async (_confirmModel)=>{
        const opts = {
            Id:this.props.location.query.id
        }
        try {
            await restFetch({
                api:"/api/services/app/basic/SureVerificationDriverAmount",
                method:"POST",
                opts,
                body:false,
                loading:bool => {
                    if(bool){
                       message.loading("核销中",0)
                    }else{
                        message.destroy()
                    }
                }
            })
            message.success("已核销")
            this.fetchList(1,10,null)
            _confirmModel.destroy()
        }catch (e){
            showErr(e)
        }
    }

    columns = [
        {title:"核销金额",dataIndex:"amountText"},
        {title:"核销状态",dataIndex:"statusText"},
        {title:"核销日期",render:(text,record,index)=>this.state.activeKey === "1" ? "无" : record.timeText},
        {title:"创建时间",dataIndex:"creationTime"},
    ];

    componentDidMount(){
        this.fetchList(1,10,null)
    }

    render(){
        return (
            <div>
                <HeadTitle name={"绩效核销"} goBack={true} reload={()=>this.fetchList(1,10,null)} loading={this.state.loading}/>
                <div className="hp-container">
                <Tabs tabBarExtraContent={
                    this.state.activeKey === "1" ?
                        <Button type={"primary"} onClick={this.fetchAmount} loading={this.state.getLoading}>核销</Button> : null
                } onChange={this.handleTabChange} activeKey={this.state.activeKey}>
                    {
                        this.tabs.map((item,key)=>(
                            <TabPane tab={item} key={`${key}`}>
                                <Row gutter={8} style={{marginBottom:30}}>
                                    <Col span={6}>总金额：{this.state.amount}</Col>
                                    <Col span={6}>已核销金额：{this.state.allAmount}</Col>
                                    <Col span={6}>未核销金额：{this.state.noneAmount}</Col>
                                </Row>
                                <Table columns={this.columns} loading={this.state.loading} dataSource={this.state.items} pagination={{
                                    current:this.state.page,
                                    pageSize:this.state.maxResultCount,
                                    total:this.state.totalCount,
                                    onChange:(C)=>this.fetchList(C,this.state.maxResultCount,this.state.filter),
                                    showSizeChanger:true,
                                    onShowSizeChange:(C,S)=>this.fetchList(1,S,this.state.filter),
                                    showTotal:T => `共${T}条`
                                }} rowKey={r => r.id}/>
                            </TabPane>
                        ))
                    }
                </Tabs>
                </div>
            </div>
        )
    }
}

export default performance;