import React, { Component } from 'react';
import { Button, Form, Row, Col, FormInstance, message, Tag } from 'antd';
import { PageContent } from 'ra-lib';
import config from 'commons/config-hoc';
import {
    QueryBar,
    FormRow,
    FormElement,
    Table,
    Operator,
} from 'ra-lib';
import './style.less'
import { propertyContains, purifyResponse } from 'commons/utils';
import { ApprovalTable, deleteApprovalTable, getApprovalTables, updateApprovalTable } from 'commons/api/approval/manage';
import { getInfoClasses, InfoClass } from 'commons/api/approval/info/manage';
import MenuSelect from 'pages/organizes/MenuSelect';
import { ApprovalInstance, getApprovalInstances, getWaitingApprovalInstances, updateApprovalStatus } from 'commons/api/approval/instance';


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
    path: '/approval/manage/wait',
    ajax: true,
})
export default class ApprovalInfoManage extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [] as ApprovalInstance[],     // 表格数据
        deleting: false,    // 删除中loading
        visible: false,     // 添加、修改弹框
        data: {} as Partial<ApprovalInstance>,
        infoClasses: [] as InfoClass[],
        selectedOrganizes: [] as number[],
        selectTableId: 0,
        selectTableName: null
    };

    form = React.createRef<FormInstance>()

    columns = [
        { title: '审批表', dataIndex: 'prototype', width: 150 },
        { title: '描述', dataIndex: 'desc', with: 150 },
        { title: '发起人', dataIndex: 'creator', with: 150 },
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const { id, name } = record;
                const items = [
                    {
                        label: '通过',
                        color: 'green',
                        onClick: (e) => {
                            this.handleStatus(record, "approve");
                        },
                    },
                    {
                        label: '拒绝',
                        color: 'red',
                        onClick: (e) => {
                            this.handleStatus(record, "reject");
                        },
                    }
                ];

                return <Operator items={items} />;
            },
        },
    ];

    componentDidMount() {
        this.handleSubmit({});
        getInfoClasses()
            .then(resp => {
                const infoClasses = purifyResponse(resp.data)
                this.setState({ infoClasses })
            })
    }

    handleSubmit = (values) => {
        if (this.state.loading) return;
        const value = values?.name ?? ""

        // 一般系统中，角色不会太多，不做分页查询了
        this.setState({ loading: true })
        getWaitingApprovalInstances()
            .then(resp => {
                const dataSource = purifyResponse(resp.data).filter(propertyContains(["prototype", "modifer", "desc", "creator"], value));
                this.setState({ dataSource })
            })
            .finally(() => this.setState({ loading: false }))
    };

    handleStatus(record: ApprovalInstance, state: string) {
        this.setState({ loading: true })
        const table = this.state.dataSource.find(it => it.id == record.id)
        updateApprovalStatus(table.id, state, table.values.map(value => ({ id: value.id, status: state })))
            .then(resp => {
                if (resp.data.success) {
                    message.success("更新状态成功");
                    this.handleSubmit({});
                } else {
                    purifyResponse(resp.data)
                }
            })
            .finally(() => this.setState({ loading: false }))
    }

    render() {
        const {
            loading,
            dataSource,
            visible,
            selectTableId,
            selectTableName
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
            </PageContent>
        );
    }
}
