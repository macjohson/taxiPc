import React from "react"
import { Layout, Menu, message,LocaleProvider } from "antd"
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Login from "./login"
import showErr from "../tools/showErr"
import router from 'umi/router';
import withRouter from 'umi/withRouter';
import restFetch from "../tools/restFetch";
import "../less/style.less";

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

class MainLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loginLoading: false,
            login: sessionStorage.getItem("user") ? true : false,
            menu: localStorage.getItem("menu") ? JSON.parse(localStorage.getItem("menu")) : [],
            openKeys:["0"],
            selectedKeys:["/index/statistorder"]
        }
    }

    handleLogin = async val => {
        try{
            const result = await restFetch({
                api:"/api/services/app/user/Login",
                method:"POST",
                opts:val,
                body:true,
                loading:bool => this.setState({loginLoading:bool})
            })
            sessionStorage.setItem("user", JSON.stringify(result))
            this.fetchMenu()
        }catch (e){
            showErr(e)
        }
    }

    fetchMenu = async () => {
        try{
            const result = await restFetch({
                api:"/api/Menu",
                loading:bool => {
                    if(bool){
                        message.loading("获取权限中", 0)
                    }else{
                        message.destroy()
                    }
                }
            })
            localStorage.setItem("menu", JSON.stringify(result))
            this.setState({ menu: result, login: true })
        }catch (e){
            showErr(e)
        }
    }

    handelMenuClick = ({key})=>{
        this.setState({selectedKeys:[key]})
        if(key === this.props.location.pathname){
            return
        }
        router.push(key)
    }

    handleTitleClick = ({key})=>{
        this.setState({openKeys:[key]})
    }

    logout = async ()=>{
        try{
            await restFetch({
                api:"/api/services/app/user/Logout",
                method:"POST",
                loading:bool => {
                    if(bool){
                        message.loading("注销中",0)
                    }else{
                        message.destroy()
                    }
                }
            })
            message.success("成功退出系统，请重新登录",1,()=>{
                sessionStorage.clear();
                window.location.assign('/')
            })
        }catch (e){
            showErr(e)
        }
    }

    render() {
        if (this.state.login) {
            return (
                <LocaleProvider locale={zhCN}>
                <Layout style={{ height: "100vh" }}>
                    <Header className="header">
                        <div style={{color:"white"}}>
                            <img src={require('../less/logo.jpg')} style={{width:40,borderRadius:40,display:"inline-block",marginRight:10}} alt=""/>
                            砚山的士云服务平台
                            <div style={{float:"right",color:"white",cursor:"pointer"}} onClick={this.logout}>注销登录</div>
                        </div>
                    </Header>
                    <Layout>
                        <Sider width={200} style={{ background: "#fff",boxShadow:"0 0 5px rgba(0,0,0,.3)" }}>
                            <Menu
                                mode="inline"
                                style={{ height: "100%", borderRight: 0 }}
                                onClick={this.handelMenuClick}
                                openKeys={this.state.openKeys}
                                selectedKeys={this.state.selectedKeys}
                            >
                                {this.state.menu.map(
                                    (item, key) =>
                                        item.items.length !== 0 ? (
                                            <SubMenu onTitleClick={this.handleTitleClick} key={`${key}`} title={<span>{item.displayName}</span>}>
                                                {item.items.map((_item, _key) => (
                                                    <Menu.Item key={_item.url}>{_item.displayName}</Menu.Item>
                                                ))}
                                            </SubMenu>
                                        ) : (
                                            <Menu.Item key={item.url}>{item.displayName}</Menu.Item>
                                        )
                                )}
                            </Menu>
                        </Sider>
                        <Layout style={{ padding: "0 24px 24px" }}>
                            <Content
                                style={{ background: "#fff",margin: 0,boxShadow:"0 0 5px rgba(0,0,0,.3)",marginTop:24}}
                            >
                                    {this.props.children}
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
                </LocaleProvider>
            )
        } else {
            return <Login login={this.handleLogin} loading={this.state.loginLoading} />
        }
    }
}

export default withRouter(MainLayout)
