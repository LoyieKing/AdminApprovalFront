import React, { Component } from 'react';
import { Col, Form, FormInstance, Input, InputNumber, message, Row, Select } from 'antd';
import { FormElement } from 'ra-lib';
import config from 'commons/config-hoc';
import { ModalContent } from 'ra-lib';
import { purifyResponse } from 'commons/utils';
import { InfoClass, updateInfoClasses } from 'commons/api/approval/info/manage';
import Checkbox from 'antd/lib/checkbox/Checkbox';


type EditModalProp = {
    cats: { name: string, value: string }[]
    data: Partial<InfoClass>
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
        updateInfoClasses([data])
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

        const initialValues = { ...data }
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
                        label="信息名称"
                        name="name"
                        required
                    />
                    <Row>
                        <Col flex="2">
                            <FormElement {...formProps} label="信息类型" name="category" required>
                                <Input />
                            </FormElement>
                        </Col>
                        <Col flex="1">
                            <FormElement {...formProps} label="有效时间（天）" name="expiredDays" required>
                                <InputNumber min={0} max={1000} />
                            </FormElement>
                        </Col>
                    </Row>
                    <Row>
                        <Col flex="3">
                            <FormElement {...formProps} label="数据类型" name="inputType" required>
                                <Select showSearch filterOption optionFilterProp="children">
                                    {this.props.cats?.map(cat => <Select.Option value={cat.value.toString()} >{cat.name}</Select.Option>)}
                                </Select>
                            </FormElement>
                        </Col>
                        <Col flex="1">
                            <FormElement {...formProps} label="可复用" name="reusable" valuePropName="checked" required>
                                <Checkbox />
                            </FormElement>
                        </Col>
                    </Row>
                </Form>
            </ModalContent>
        );
    }
}
