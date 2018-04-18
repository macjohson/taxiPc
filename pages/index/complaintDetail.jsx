import React from 'react';
import {Row,Col,Modal,Spin} from 'antd';
import HeadTitle from '../../layouts/headTitle';
import restFetch from "../../tools/restFetch";
import showErr from "../../tools/showErr";

class complaintDetail extends React.PureComponent{
    state ={
        detail:{},
        loading:false,
        visible:false,
        key:null,
        imgLoading:true
    };

    fetchDetail = async ()=>{
        const opts = {
            Id:this.props.location.query.id
        }
        try{
            const detail  = await restFetch({
                api:"/api/services/app/basic/GetComplaintDetails",
                method:"GET",
                opts,
                body:false,
                loading:loading => this.setState({loading})
            });
            this.setState({detail})
        }catch (e){
            showErr(e)
        }
    }

    componentDidMount(){
        this.fetchDetail()
    }

    render(){
        return (
            <div>
                <HeadTitle name={"投诉详情"} goBack={true} loading={this.state.loading} reload={this.fetchDetail}/>
                <div className="hp-container">
                <Row>
                    <Col span={6} style={{textAlign:"right",color:"#888",marginBottom:10}}>
                        司机姓名：
                    </Col>
                    <Col span={8}>
                        {this.state.detail.driverName}
                    </Col>
                </Row>
                <Row>
                    <Col span={6} style={{textAlign:"right",color:"#888",marginBottom:10}}>
                        司机电话：
                    </Col>
                    <Col span={8}>
                        {this.state.detail.driverMobile}
                    </Col>
                </Row>
                <Row>
                    <Col span={6} style={{textAlign:"right",color:"#888",marginBottom:10}}>
                        投诉内容：
                    </Col>
                    <Col span={8}>
                        {this.state.detail.content}
                    </Col>
                </Row>
                <Row>
                    <Col span={6} style={{textAlign:"right",color:"#888",marginBottom:10}}>
                        车牌号：
                    </Col>
                    <Col span={8}>
                        {this.state.detail.licensePlate}
                    </Col>
                </Row>
                <Row>
                    <Col span={6} style={{textAlign:"right",color:"#888",marginBottom:10}}>
                        附件：
                    </Col>
                    <Col span={8}>
                        {
                            this.state.detail.enclosures && this.state.detail.enclosures instanceof Array && this.state.detail.enclosures.length !== 0 ? this.state.detail.enclosures.map((item,key)=>(
                                <img src={item} style={{width:50,height:50,marginRight:5,cursor:"pointer"}} onClick={()=>this.setState({visible:true,key})} key={key} alt=""/>
                            )) : null
                        }
                    </Col>
                </Row>
                </div>
                <Modal title={"查看原图"} visible={this.state.visible} onCancel={()=>this.setState({visible:false,imgLoading:true})} footer={false}>
                    <Spin spinning={this.state.imgLoading}>
                        {
                            this.state.detail.enclosures && this.state.detail.enclosures instanceof Array && this.state.detail.enclosures.length !== 0 ?
                                <img src={this.state.detail.enclosures[this.state.key]} style={{width:"100%"}} onLoad={()=>this.setState({imgLoading:false})} alt=""/> : null
                        }
                    </Spin>
                </Modal>
            </div>
        )
    }
}

  export default complaintDetail