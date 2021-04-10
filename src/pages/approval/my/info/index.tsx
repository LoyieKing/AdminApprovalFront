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
import { getInfoInstances, InfoInstance } from 'commons/api/approval/info/instance';


@config({
    path: '/approval/my/info',
    ajax: true,
})
export default class ApprovalInfoManage extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [] as (InfoInstance["infoClass"] & InfoInstance)[],     // 表格数据
        deleting: false,    // 删除中loading
        visible: false,     // 添加、修改弹框
        selectedOrganizes: [] as number[],
        selectTableId: 0,
        selectTableName: null
    };

    form = React.createRef<FormInstance>()

    columns = [
        { title: '名称', dataIndex: 'name', width: 150 },
        { title: '分类', dataIndex: 'category', with: 150 },
        { title: '过期时间', dataIndex: 'expired', with: 150 },
        { title: '值', dataIndex: 'value', with: 150 },
        { title: '状态', dataIndex: 'status', with: 150 }
    ];

    componentDidMount() {
        this.handleSubmit({});
    }

    handleSubmit = (values) => {
        if (this.state.loading) return;
        const value = values?.name ?? ""

        // 一般系统中，角色不会太多，不做分页查询了
        this.setState({ loading: true })
        getInfoInstances()
            .then(resp => {
                const dataSource = purifyResponse(resp.data)
                    .map(it => ({ ...it.infoClass, ...it }))
                    .filter(propertyContains(["name", "value", "category"], value));
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
