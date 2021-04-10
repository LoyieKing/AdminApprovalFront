import React, { useState, useEffect } from 'react';
import { Form, Row, Col, message, DatePicker, Input } from 'antd';
import config from 'commons/config-hoc';
import { ModalContent, FormItem } from 'ra-lib';
import { useGet, usePost, usePut } from 'commons/ajax';
import { usePromise } from 'commons/utils';
import { getUser, updateUser } from 'commons/api/user';
import moment from 'moment';

const formLayout = {
    labelCol: {
        flex: '100px',
    },
};

export default config({
    modal: {
        title: props => props.isEdit ? '修改用户' : '添加用户',
        width: 600,
    },
})((props: {
    isEdit: boolean
    id: number
    onOk: () => void
}) => {
    console.log(props)
    const { isEdit, id, onOk } = props;
    const [form] = Form.useForm();
    const [data, setData] = useState({});
    const [loading, fetchUser] = usePromise(getUser);
    const [saving, saveUser] = usePromise(updateUser);
    const [validateJson, setVallidateJson] = useState("")

    async function fetchData() {
        if (loading) return;

        const res = await (await fetchUser(id)).data;
        if (res.success) {
            let data = { ...res.data };
            if (data.birthday) {
                data.birthday = moment(data.birthday) as any
            }
            data.password = ""
            setData(data);
            form.setFieldsValue(data);
        } else if (res.success === false) {
            message.error(res.message)
        }

    }

    async function handleSubmit(values) {
        try {
            const json = values.contract
            if (json) {
                JSON.parse(json)
            }
        } catch {
            setVallidateJson("error")
            message.error("联系方式必须为合法的JSON")
            return
        }

        if (isEdit) {
            values.id = id
        } else {
            values.id = 0
        }

        let resp = await (await saveUser(values)).data
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

                <Row>
                    <Col flex={1}>
                        <FormItem
                            {...formLayout}
                            label="用户名"
                            name="userName"
                            required
                            noSpace
                        />
                    </Col>
                    <Col flex={1}>
                        <FormItem
                            {...formLayout}
                            label="真实姓名"
                            name="realName"
                            required
                        />
                    </Col>
                </Row>
                <FormItem
                    {...formLayout}
                    label="生日"
                    name="birthday"
                >
                    <DatePicker />
                </FormItem>
                <Form.Item
                    {...formLayout}
                    label="联系方式"
                    name="contract"
                    validateStatus=""
                    required
                >
                    <Input.TextArea />
                </Form.Item>
                <FormItem
                    {...formLayout}
                    label="密码"
                    name="password"
                    required={!isEdit}
                />
            </Form>
        </ModalContent>
    );
});


