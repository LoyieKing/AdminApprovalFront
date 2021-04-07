import React, { Component } from 'react';
import { Col, Form, FormInstance, InputNumber, message, Row, Select } from 'antd';
import { FormElement } from 'ra-lib';
import config from 'commons/config-hoc';
import { ModalContent } from 'ra-lib';
import { OrganizeCat } from 'commons/api/organize';
import { Role, updateRole } from 'commons/api/role';
import { purifyResponse } from 'commons/utils';


type EditModalProp = {
    cats: OrganizeCat[]
    data: Partial<Role>
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
        updateRole(data)
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
        const { data } = this.props;
        const { loading } = this.state;
        const formProps = {
            labelWidth: 100,
        };
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
                    initialValues={{ ...data, organizeCategoryId: "" + (data.organizeCategoryId ?? "") }}
                >
                    <FormElement {...formProps} type="hidden" name="id" />
                    <FormElement
                        {...formProps}
                        label="角色名称"
                        name="name"
                        required
                    />
                    <Row>
                        <Col flex="2">
                            <FormElement {...formProps} label="组织类型" name="organizeCategoryId" required>
                                <Select showSearch filterOption optionFilterProp="children">
                                    {this.props.cats?.map(cat => <Select.Option value={cat.id.toString()} >{cat.name}</Select.Option>)}
                                </Select>
                            </FormElement>
                        </Col>
                        <Col flex="1">
                            <FormElement {...formProps} label="角色级别" name="organizeDutyLevel" required>
                                <InputNumber min={0} max={100} />
                            </FormElement>
                        </Col>
                    </Row>
                    <FormElement {...formProps} label="审批类型" name="availableApprovals">
                        <Select mode="tags" tokenSeparators={[',', ' ']} />
                    </FormElement>

                    <FormElement
                        {...formProps}
                        label="描述"
                        name="description"
                    />
                </Form>
            </ModalContent>
        );
    }
}
