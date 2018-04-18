import React from "react"
import { Tabs, Table, Input, DatePicker, Row, Col } from "antd"
import HeadTitle from "../../layouts/headTitle"
import showErr from "../../tools/showErr"
import listDefaultState from "../../common/listDefaultState"
import restFetch from "../../tools/restFetch"
const { TabPane } = Tabs,
    { RangePicker } = DatePicker

class statistorder extends React.PureComponent {
    state = {
        tabs: ["订单列表"],
        activeKey: "0",
        dateRange: [],
        loading: false,
        ...listDefaultState,
        allAmount: 0,
        chooseAmount: 0
    }

    columns = [
        { title: "付款人姓名/昵称", dataIndex: "name" },
        { title: "付款人电话号码", dataIndex: "mobile" },
        { title: "订单号", dataIndex: "outTradeNo" },
        { title: "订单金额", dataIndex: "amountText" },
        { title: "描述信息", dataIndex: "body" },
        { title: "支付时间", dataIndex: "creationTime" }
    ]

    fetchList = async (page, maxResultCount, filter) => {
        try {
            const opts = {
                page,
                maxResultCount,
                filter,
                startTime: this.state.dateRange.length !== 0 ? this.state.dateRange[0].format("YYYY-MM-DD") : null,
                endTime: this.state.dateRange.length !== 0 ? this.state.dateRange[1].format("YYYY-MM-DD") : null
            }
            const result = await restFetch({
                api: "api/services/app/order/GetPayOrderList",
                method: "POST",
                body: true,
                opts,
                loading: bool => this.setState({ loading: bool })
            })
            const { allAmount, chooseAmount, payOrderDtoOutputes: { items, totalCount } } = result
            this.setState({ allAmount, chooseAmount, items, totalCount, page, maxResultCount, filter })
        } catch (error) {
            showErr(error)
            this.clear()
        }
    }

    clear = () => {
        this.setState({
            ...listDefaultState,
            allAmount: 0,
            chooseAmount: 0
        })
    }

    rangeChange = async dateRange => {
        await this.setState({ dateRange })
        if (dateRange.length === 0) {
            this.clear()
            return
        }
        this.fetchList(1, 10, null)
    }

    componentDidMount() {
        this.fetchList(1, 10, null)
    }

    render() {
        return (
            <div>
                <HeadTitle name={"统计查询"} />
                <div className="hp-container">
                <Tabs
                    tabBarExtraContent={
                        <RangePicker onChange={dateRange => this.rangeChange(dateRange)} value={this.state.dateRange} />
                    }
                    activeKey={this.state.activeKey}
                >
                    {this.state.tabs.map((item, key) => (
                        <TabPane tab={item} key={`${key}`}>
                            <Row style={{ marginTop: 30, marginBottom: 30 }}>
                                <div>
                                    <Col span={5}>订单总金额：{this.state.allAmount}</Col>
                                    <Col span={5}>已选日期区间金额：{this.state.chooseAmount}</Col>
                                </div>
                                <Col offset={6} span={8}>
                                    <Input.Search
                                        onChange={e => this.setState({ filter: e.target.value })}
                                        value={this.state.filter}
                                        onSearch={val => this.fetchList(1, 10, val)}
                                        placeholder={"输入关键词"}
                                    />
                                </Col>
                            </Row>
                            <Table
                                loading={this.state.loading}
                                dataSource={this.state.items}
                                rowKey={record => record.id}
                                locale={{
                                    emptyText: this.state.dateRange.length === 0 ? "请先选择日期区间" : "暂无数据"
                                }}
                                columns={this.columns}
                                pagination={{
                                    current: this.state.page,
                                    pageSize: this.state.maxResultCount,
                                    total: this.state.totalCount,
                                    onChange: C => this.fetchList(C, this.state.maxResultCount, this.state.filter),
                                    showSizeChanger: true,
                                    onShowSizeChange: (C, S) => this.fetchList(1, S, this.state.filter),
                                    showTotal: T => `共${T}条`
                                }}
                            />
                        </TabPane>
                    ))}
                </Tabs>
                </div>
            </div>
        )
    }
}

export default statistorder
