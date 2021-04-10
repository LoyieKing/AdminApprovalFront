import React, { Component } from 'react';
import { Col, Form, FormInstance, Input, InputNumber, message, Row, Select } from 'antd';
import { FormElement } from 'ra-lib';
import config from 'commons/config-hoc';
import { ModalContent } from 'ra-lib';
import { purifyResponse } from 'commons/utils';
import { InfoClass, updateInfoClasses } from 'commons/api/approval/info/manage';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { UserEntity } from 'commons/api/user';
import { Organize } from 'commons/api/organize';
import { Option } from 'antd/lib/mentions';
import { updateUserOrganize, UserOrganize } from 'commons/api/userorganize';


type EditModalProp = {
    users: UserEntity[],
    orgs: Organize[],
    data: Partial<UserOrganize>
    visible: boolean
    onOk?: () => void
    onCancel?: () => void
}

@config({
    ajax: true,
    modal: {
        title: props => props.isEdit ? '修改' : '添加',
    },
})
export default class EditModal extends Component<EditModalProp> {
    state = {
        loading: false,     // 页面加载loading
    };

    form = React.createRef<FormInstance>()

    componentDidUpdate(oldState, newState) {
        if (oldState.visible === false && newState.visible === true) {
            this.setState({ data: this.props.data })
        }
    }

    handleSubmit = (values) => {
        if (this.state.loading) return;

        const successTip = this.props.data.id ? '修改成功！' : '添加成功！';

        this.setState({ loading: true })
        const data = values
        data.id ??= 0
        updateUserOrganize(data)
            .then(resp => {
                if (resp.data.success) {
                    message.success(successTip)
                    this.props.onOk?.call(this)
                } else {
                    purifyResponse(resp.data)
                }
            })
            .finally(() => this.setState({ loading: false }))
    };

    render() {
        const { data, users, orgs } = this.props;
        const { loading } = this.state;
        const formProps = {
            labelWidth: 100,
        };

        const initialValues = { ...data, userId: "" + (data.userId ?? ""), organizeId: "" + (data.organizeId ?? "") }
        console.log(initialValues)
        return (
            <ModalContent
                loading={loading}
                okText="保存"
                cancelText="重置"
                onOk={() => this.form.current.submit()}
                onCancel={() => this.form.current.resetFields()}
            >
                <Form
                    ref={this.form}
                    onFinish={this.handleSubmit}
                    initialValues={initialValues}
                >
                    <FormElement {...formProps} type="hidden" name="id" />
                    <FormElement {...formProps} label="用户" name="userId" required>
                        <Select>
                            {users.map(it => <Option value={"" + it.id}>{it.realName}</Option>)}
                        </Select>
                    </FormElement>
                    <FormElement {...formProps} label="组织" name="organizeId" required >
                        <Select>
                            {orgs.map(it => <Option value={"" + it.id}>{it.name}</Option>)}
                        </Select>
                    </FormElement>
                    <FormElement {...formProps} label="级别" name="dutyLevel" required>
                        <InputNumber min={0} max={100} />
                    </FormElement>
                </Form>
            </ModalContent>
        );
    }
}
