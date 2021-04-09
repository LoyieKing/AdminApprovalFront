import React, { Component } from 'react';
import { Col, Form, FormInstance, Input, InputNumber, message, Row, Select } from 'antd';
import { FormElement } from 'ra-lib';
import config from 'commons/config-hoc';
import { ModalContent } from 'ra-lib';
import { purifyResponse } from 'commons/utils';
import { getInfoClasses, InfoClass, updateInfoClasses } from 'commons/api/approval/info/manage';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { ApprovalTable, updateApprovalTable } from 'commons/api/approval/manage';
import { Option } from 'antd/lib/mentions';


type EditModalProp = {
    infoClasses: InfoClass[]
    data: Partial<ApprovalTable>
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

    handleSubmit = (values) => {
        if (this.state.loading) return;

        const successTip = this.props.data.id ? '修改成功！' : '添加成功！';

        this.setState({ loading: true })
        const data = { ...values, infoClasses: values.infoClasses.map(it => parseInt(it)) }
        data.id ??= 0
        updateApprovalTable(data)
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

        const initialValues = { ...data, infoClasses: data.infoClasses?.map(it => "" + it) }
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
                    <FormElement
                        {...formProps}
                        label="审批表名称"
                        name="name"
                        required
                    />
                    <FormElement {...formProps} label="类型" name="category" required>
                        <Input />
                    </FormElement>
                    <FormElement {...formProps} label="字段" name="infoClasses" required>
                        <Select mode="multiple" showSearch optionFilterProp="children">
                            {this.props.infoClasses.map(it => <Option value={"" + it.id}>{it.name}</Option>)}
                        </Select>
                    </FormElement>
                </Form>
            </ModalContent>
        );
    }
}
