import React, { useState, useEffect } from 'react';
import { Form, Row, Col, message, DatePicker, Input, Select } from 'antd';
import config from 'commons/config-hoc';
import { ModalContent, FormItem } from 'ra-lib';
import { usePromise } from 'commons/utils';
import { getOrganizeCat, updateOrganizeCat } from 'commons/api/organize';
import { Option } from 'antd/lib/mentions';

const formLayout = {
    labelCol: {
        flex: '100px',
    },
};

export default config({
    modal: {
        title: props => props.isEdit ? '修改组织类型定义' : '添加组织类型定义',
        width: 600,
    },
})((props: {
    isEdit: boolean
    id: number
    onOk: () => void
}) => {
    const { isEdit, id, onOk } = props;
    const [form] = Form.useForm();
    const [data, setData] = useState({});
    const [loading, fetchCat] = usePromise(getOrganizeCat);
    const [saving, updateCat] = usePromise(updateOrganizeCat);

    async function fetchData() {
        if (loading) return;

        const res = await (await fetchCat(id)).data;
        if (res.success) {
            res.data.category = "" + res.data.category as any
            setData(res.data);
            form.setFieldsValue(res.data);
        } else if (res.success === false) {
            message.error(res.message)
        }

    }

    async function handleSubmit(values) {
        let { name, category } = values

        let resp = await (await updateCat(id, name, category)).data
        if (resp.success) {
            onOk && onOk();
        } else if (resp.success === false) {
            message.error(resp.message)
        }

    }

    useEffect(() => {
        (async () => {
            if (isEdit) await fetchData();
        })();
    }, []);

    const modalLoading = loading || saving;
    return (
        <ModalContent
            loading={modalLoading}
            okText="保存"
            cancelText="重置"
            onOk={() => form.submit()}
            onCancel={() => form.resetFields()}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                initialValues={data}
            >
                {isEdit ? <FormItem {...formLayout} hidden name="id" /> : null}
                <FormItem
                    {...formLayout}
                    label="组织类型名"
                    name="name"
                    required
                    noSpace
                />
                <FormItem
                    {...formLayout}
                    label="组织类型"
                    name="category"
                    required
                >
                    <Select>
                        <Option key="0" value="0">长期</Option>
                        <Option key="1" value="1">短期</Option>
                    </Select>
                </FormItem>
            </Form>
        </ModalContent>
    );
});


