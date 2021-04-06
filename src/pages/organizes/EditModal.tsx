import React, { Component } from 'react';
import { Col, Form, Row, Select } from 'antd';
import { FormElement, FormRow, IconPicker, ModalContent } from 'ra-lib';
import config from 'commons/config-hoc';
import { Organize, OrganizeCat, updateOrganize } from 'commons/api/organize';
import { FormInstance } from 'antd/lib/form/Form';
import { Option } from 'antd/lib/mentions';
import { purifyResponse } from 'commons/utils';

export const targetOptions = [
    { value: '', label: '项目内部窗口' },
    { value: '_self', label: '替换当前窗口' },
    { value: '_blank', label: '打开新窗口' },
];


type EditModalProp = {
    visible: boolean
    data?: (Partial<Organize> & { parentKey: number })
    cats: OrganizeCat[]
    onOk?: () => void
    onCancel?: () => void
}

@config({
    ajax: true,
    modal: {
        width: 700,
        title: (props: EditModalProp) => {
            const { data } = props;
            if (data?.parentKey) {
                return "添加组织"
            } else {
                return "编辑组织"
            }
        },
    },
})
export default class EditModal extends Component<EditModalProp> {
    state = {
        loading: false,
        iconVisible: false,
    };

    form = React.createRef<FormInstance<any>>()

    handleSubmit = async (values: EditModalProp["data"]) => {
        if (this.state.loading) return;

        console.log('Received values of form: ', values);

        const { id, name, categoryId, parentKey } = values
        let resp = await updateOrganize(id, name, categoryId, parentKey)
        purifyResponse(resp.data)

        this.props.onOk?.call(this);
        this.setState({ loading: true });
    };

    handleCancel = () => {
        this.props.onOk?.call(this)
    };

    render() {
        const { data } = this.props;
        const { loading } = this.state;


        const formProps = {
            width: 300,
            labelWidth: 80,
        };

        console.log(this.props.cats)

        return (
            <ModalContent
                surplusSpace={false}
                loading={loading}
                okText="保存"
                onOk={() => this.form.current.submit()}
                cancelText="重置"
                onCancel={() => this.form.current.resetFields()}
            >
                <Form
                    ref={this.form}
                    onFinish={this.handleSubmit}
                    style={{ padding: 16 }}
                    initialValues={{ ...data, categoryId: "" + (data.categoryId ?? "") }}
                >
                    <FormElement {...formProps} type="hidden" name="id" />
                    <FormElement {...formProps} type="hidden" name="parentKey" />
                    <Row>
                        <Col flex='1'>
                            <FormElement
                                {...formProps}
                                label="名称"
                                name="name"
                                required
                                autoFocus
                            />
                        </Col>
                        <Col flex="1">
                            <FormElement {...formProps} label="组织类型" name="categoryId" required>
                                <Select>
                                    {this.props.cats?.map(cat => <Select.Option value={cat.id.toString()} >{cat.name}</Select.Option>)}
                                </Select>
                            </FormElement>
                        </Col>
                    </Row>
                </Form>
            </ModalContent>
        );
    }
}
