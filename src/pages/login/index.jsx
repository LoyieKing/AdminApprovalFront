import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Input, Button, Form, Image, Popover } from 'antd';
import { LockOutlined, ReloadOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { setLoginUser, toHome } from 'src/commons';
import config from 'src/commons/config-hoc';
import Banner from './banner';
import './style.less';
import { getAuthCode, login } from '../../commons/api/user';
// import { getAuthCode } from 'src/commons/api';

@config({
    path: '/login',
    ajax: true,
    noFrame: true,
    noAuth: true,
})
export default class Login extends Component {
    state = {
        loading: false,
        message: '',
        isMount: false,
        codeImage: null
    };

    vcodeSession = "";

    componentDidMount() {
        // 开发时方便测试，填写表单
        if (process.env.NODE_ENV === 'development' || process.env.PREVIEW) {
            this.form.setFieldsValue({ userName: 'admin', password: '111' });
        }

        this.getVerifyCodeImage();
        setTimeout(() => this.setState({ isMount: true }), 300);
    }

    getVerifyCodeImage = async () => {
        this.setState({ codeImage: null })
        let resp = await getAuthCode()
        var codeImage = window.URL.createObjectURL(resp.data)
        console.log(resp.headers)
        this.vcodeSession = resp.headers["vcode-session"]
        this.setState({ codeImage })
    }

    handleSubmit = (values) => {
        if (this.state.loading) return;

        const { username, password, code } = values;


        this.setState({ loading: true, message: '' });
        login(username, password, code, this.vcodeSession ?? "")
            .then(res => {
                if (res.data.success) {
                    var token = res.data.data;
                    console.log(token)
                    let payloadStr = window.atob(token.split('.')[1])
                    let payload = JSON.parse(payloadStr)
                    console.log("payload:")
                    console.log(payload)
                    setLoginUser({ username, password, token, id: payload.id, permissions: payload.permissions })
                    toHome();
                } else {
                    this.setState({ message: res.data.message })
                }
            })
            .catch((res) => this.setState({ message: '网络错误！' }))
            .finally(() => this.setState({ loading: false }));

    };

    render() {
        const { loading, message, isMount } = this.state;
        const formItemStyleName = isMount ? 'form-item active' : 'form-item';

        return (
            <div styleName="root">
                <Helmet title="欢迎登录" />
                <div styleName="banner">
                    <Banner />
                </div>
                <div styleName="box">
                    <Form
                        ref={form => this.form = form}
                        name="login"
                        className='inputLine'
                        onFinish={this.handleSubmit}
                    >
                        <div styleName={formItemStyleName}>
                            <div styleName="header">欢迎登录</div>
                        </div>
                        <div styleName={formItemStyleName}>
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: '请输入用户名' }]}
                            >
                                <Input allowClear autoFocus prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                            </Form.Item>
                        </div>
                        <div styleName={formItemStyleName}>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: '请输入密码' }]}
                            >
                                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="密码" />
                            </Form.Item>
                        </div>
                        <div styleName={formItemStyleName}>
                            <Form.Item
                                name="code"
                                rules={[{ required: true, message: '请输入验证码' }]}
                            >
                                <Input
                                    prefix={<RobotOutlined className="site-form-item-icon" />}
                                    placeholder="验证码"
                                    suffix={<Popover
                                        content={<Button
                                            shape="circle"
                                            icon={<ReloadOutlined />}
                                            type="primary"
                                            onClick={() => this.getVerifyCodeImage()}
                                            loading={this.state.codeImage === null} />}
                                        placement="right"
                                        trigger="hover">
                                        <Image
                                            src={this.state.codeImage}
                                            className="site-form-item-icon"
                                            placeholder />
                                    </Popover>} />
                            </Form.Item>
                        </div>
                        <div styleName={formItemStyleName}>
                            <Form.Item shouldUpdate={true} style={{ marginBottom: 0 }}>
                                {() => (
                                    <Button
                                        styleName="submit-btn"
                                        loading={loading}
                                        type="primary"
                                        htmlType="submit"
                                        disabled={
                                            !this.form?.isFieldsTouched(true) ||
                                            this.form?.getFieldsError().filter(({ errors }) => errors.length).length
                                        }
                                    >
                                        登录
                                    </Button>
                                )}
                            </Form.Item>
                        </div>
                    </Form>
                    <div styleName="error-tip">{message}</div>
                </div>
            </div>
        );
    }
}

