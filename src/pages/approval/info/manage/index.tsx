import React, { Component } from 'react';
import { Button, Form, Row, Col, FormInstance, message } from 'antd';
import { PageContent } from 'ra-lib';
import config from 'commons/config-hoc';
import MenuSelect from 'pages/menus/MenuSelect';
import {
    QueryBar,
    FormRow,
    FormElement,
    Table,
    Operator,
} from 'ra-lib';
import EditModal from './EditModal';
import './style.less';
import { purifyResponse } from 'commons/utils';
import { deleteInfoClass, getInfoClasses, InfoClass } from 'commons/api/approval/info/manage';

const cats = [
    {
        name: "文字",
        value: "text"
    }, {
        name: "图片",
        value: "pic"
    }, {
        name: "时间",
        value: "time"
    }, {
        name: "时间间隔",
        value: "times"
    },
]


@config({
    path: '/approval/info/manage',
    ajax: true,
})
export default class ApprovalInfoManage extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [] as InfoClass[],     // 表格数据
        deleting: false,    // 删除中loading
        visible: false,     // 添加、修改弹框
        data: {} as Partial<InfoClass>
    };

    form = React.createRef<FormInstance>()

    columns = [
        { title: '信息名称', dataIndex: 'name', width: 150 },
        { title: '类型', dataIndex: 'category' },
        { title: '有效时间（天）', dataIndex: 'expiredDays' },
        {
            title: '数据类型', dataIndex: 'inputType', render: (value) => {
                return cats.find(it => it.value == value)?.name ?? value
            }
        },
        {
            title: '可复用', dataIndex: 'reusable',
            render: (value) => value ? "是" : "否"
        },
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const { id, name } = record;
                const items = [
                    {
                        label: '修改',
                        onClick: (e) => {
                            e.stopPropagation();
                            console.log(record);
                            this.setState({ visible: true, data: record });
                        },
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: (e) => {
                                e.stopPropagation();
                                this.handleDelete(id);
                            },
                        },
                    },
                ];

                return <Operator items={items} />;
            },
        },
    ];

    componentDidMount() {
        this.handleSubmit({});
    }

    handleSubmit = (values) => {
        if (this.state.loading) return;
        const params = {
            ...values,
        };

        // 一般系统中，角色不会太多，不做分页查询了
        this.setState({ loading: true })
        getInfoClasses()
            .then(resp => {
                const dataSource = purifyResponse(resp.data)
                this.setState({ dataSource })
            })
            .finally(() => this.setState({ loading: false }))
    };

    handleDelete = (id) => {
        if (this.state.deleting) return;

        this.setState({ deleting: true });
        deleteInfoClass(id)
            .then(resp => {
                if (resp.data.success) {
                    message.success("删除成功")
                    this.handleSubmit({})
                } else {
                    purifyResponse(resp.data)
                }
            })
            .finally(() => this.setState({ deleting: false }))
    };

    render() {
        const {
            loading,
            dataSource,
            visible,
        } = this.state;

        const formProps = {
            width: 220,
            style: { paddingLeft: 16 },
        };

        return (
            <PageContent styleName="root" loading={loading}>
                <QueryBar>
                    <Form onFinish={this.handleSubmit} ref={this.form}>
                        <FormRow>
                            <FormElement
                                {...formProps}
                                label="信息名"
                                name="name"
                            />
                            <FormElement layout>
                                <Button type="primary" htmlType="submit">查询</Button>
                                <Button onClick={() => this.form.current.resetFields()}>重置</Button>
                                <Button type="primary" onClick={() => this.setState({ visible: true, data: {} })}>添加</Button>
                            </FormElement>
                        </FormRow>
                    </Form>
                </QueryBar>
                <Table
                    rowClassName="role-table"
                    serialNumber
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                />
                <EditModal
                    cats={cats}
                    visible={visible}
                    data={this.state.data}
                    onOk={() => this.setState({ visible: false }, this.form.current.submit)}
                    onCancel={() => this.setState({ visible: false })}
                />
            </PageContent>
        );
    }
}
