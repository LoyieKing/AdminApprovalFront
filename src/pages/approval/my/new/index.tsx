import React, { Component } from 'react';
import { Button, Form, Row, Col, FormInstance, message, Tag, Select } from 'antd';
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
import { ApprovalTable, getApprovalTables } from 'commons/api/approval/manage';
import { Option } from 'antd/lib/mentions';
import { getInfoClasses, InfoClass } from 'commons/api/approval/info/manage';
import InfoInput from 'pages/approval/InfoInput';
import { newApprovalInstance } from 'commons/api/approval/instance';


@config({
    path: '/approval/my/new',
    ajax: true,
})
export default class ApprovalInfoManage extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        tables: [] as ApprovalTable[],
        table: undefined as ApprovalTable,
        infoClasses: [] as InfoClass[]
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
        getApprovalTables()
            .then(resp => {
                const data = purifyResponse(resp.data)
                this.setState({ tables: data })
            })
            .finally(() => this.setState({ loading: false }))

        getInfoClasses()
            .then(resp => {
                const data = purifyResponse(resp.data)
                this.setState({ infoClasses: data })
            })
    };


    handleSelectTable(id: number) {
        const table = this.state.tables.find(it => it.id == id)
        this.setState({ table })
    }

    handleNewApproval = (formValues: { desc: string, [id: string]: string }) => {
        this.setState({ loading: true })
        const { desc: description, ...idValueMap } = formValues
        const prototypeId = this.state.table.id
        const values: { [id: number]: string } = {}
        for (const strId in idValueMap) {
            const intId = parseInt(strId)
            values[intId] = idValueMap[strId]
        }
        newApprovalInstance({ prototypeId, values, description })
            .then(resp => {
                if (resp.data.success) {
                    message.success("发起审核成功，等待上级审批")
                } else {
                    purifyResponse(resp.data)
                }
            })
            .finally(() => this.setState({ loading: false }))
    }

    render() {
        const {
            loading,
            tables,
            table,
            infoClasses
        } = this.state;

        const formProps = {
            style: { paddingLeft: 16 },
        };

        return (
            <PageContent styleName="root" loading={loading}>
                <QueryBar>
                    <FormRow>
                        <Select placeholder="请选择审批类型" style={{ minWidth: 240, marginBottom: 8 }} onChange={(i) => this.handleSelectTable(parseInt(i.toString()))}>
                            {tables.map(it => <Option value={"" + it.id}>{it.name}</Option>)}
                        </Select>
                    </FormRow>
                </QueryBar>
                <Form onFinish={this.handleNewApproval} initialValues={{}}>
                    {table?.infoClasses
                        .map(id => infoClasses?.find(it => it.id == id))
                        .filter(it => it)
                        .map(it =>
                            <FormElement {...formProps} label={it.name} name={it.id} required>
                                <InfoInput type={it.inputType} />
                            </FormElement>)}

                    {table ? (
                        <>
                            <FormElement {...formProps} label="备注" name="desc" required>
                                <InfoInput type="text" />
                            </FormElement>
                            <FormElement style={{ float: 'right' }}>
                                <Button type="primary" htmlType="submit">发起审批</Button>
                            </FormElement>
                        </>
                    ) : null}
                </Form>
            </PageContent>
        );
    }
}
