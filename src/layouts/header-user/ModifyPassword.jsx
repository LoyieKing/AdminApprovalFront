import React, { Component } from 'react';
import { Form, message } from 'antd';
import config from 'src/commons/config-hoc';
import { FormElement, ModalContent, PageContent } from 'ra-lib';
import { revisePassword } from 'commons/api/user';
import { purifyResponse } from 'commons/utils';

@config({
    ajax: true,
    connect: state => ({ loginUser: state.layout.loginUser }),
    modal: {
        title: '修改密码',
        width: 420,
    },
})
export default class ModifyPassword extends Component {
    state = {
        loading: false,
    };

    handleOk = (values) => {
        if (this.state.loading) return;
        const { onOk } = this.props;

        const { id, oldpwd, newpwd } = values

        this.setState({ loading: true });
        revisePassword(id, oldpwd, newpwd)
            .then(resp => {
                if (resp.data.success) {
                    message.success("修改密码成功！")
                } else {
                    purifyResponse(resp.data)
                }
            })
            .finally(() => this.setState({ loading: false }));
    };

    handleCancel = () => {
        const { onCancel } = this.props;
        if (onCancel) onCancel();
    };

    render() {
        const { loginUser } = this.props;
        const id = loginUser?.id;
        const { loading } = this.state;
        const labelWidth = 100;

        return (
            <ModalContent
                loading={loading}
                surplusSpace={false}
                onOk={() => this.form.submit()}
                onCancel={this.handleCancel}
            >
                <PageContent>
                    <Form ref={form => this.form = form} onFinish={this.handleOk} initialValues={{ id }}>
                        <FormElement type="hidden" name="id" />

                        <FormElement
                            label="当前账号"
                            labelWidth={labelWidth}
                            layout
                            colon
                        >{loginUser?.account}</FormElement>

                        <FormElement
                            label="原密码"
                            labelWidth={labelWidth}
                            type="password"
                            name="oldpwd"
                            autoFocus
                            placeholder="第一次设置密码，原密码可以为空"
                        />
                        <FormElement
                            label="新密码"
                            labelWidth={labelWidth}
                            type="password"
                            name="newpwd"
                            required
                        />
                        <FormElement
                            label="确认密码"
                            labelWidth={labelWidth}
                            type="password"
                            name="reNewPassword"
                            dependencies={['password']}
                            required
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('newpwd') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('新密码与确认新密码不同！');
                                    },
                                }),
                            ]}
                        />
                    </Form>
                </PageContent>
            </ModalContent>
        );
    }
}

