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
import { getApprovalInstances, getWaitingApprovalInstances } from 'commons/api/approval/instance';



@config({
    path: '/approval/my/wait',
    ajax: true,
})
export default class ApprovalInfoManage extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [] as ApprovalTable[],     // 表格数据
        deleting: false,    // 删除中loading
        visible: false,     // 添加、修改弹框
        data: {} as Partial<ApprovalTable>,
        infoClasses: [] as InfoClass[],
        selectedOrganizes: [] as number[],
        selectTableId: 0,
        selectTableName: null
    };

    form = React.createRef<FormInstance>()

    columns = [
        { title: '审批表', dataIndex: 'prototype', width: 150 },
        { title: '描述', dataIndex: 'desc' },
        { title: '发起人', dataIndex: 'creator', with: 150 },
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
