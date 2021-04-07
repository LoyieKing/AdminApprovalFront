import React, { Component } from 'react';
import { Button } from 'antd';
import { Icon } from 'ra-lib';
import config from 'commons/config-hoc';
import { PageContent } from 'ra-lib';
import { tree } from 'ra-lib';
import { Table, ToolBar, Operator } from 'ra-lib';
import getMenus from 'menus';
import './style.less';

export const targetOptions = [
    { value: '', label: '项目内部窗口' },
    { value: '_self', label: '替换当前窗口' },
    { value: '_blank', label: '打开新窗口' },
];

@config({
    path: '/menus',
})
export default class index extends Component {
    state = {
        loading: false,
        menus: [],
        visible: false,
        batchAddVisible: false,
        record: {},
        iconVisible: false,
        data: {}
    };

    columns = [
        {
            title: '名称', dataIndex: 'text', key: 'text', width: 300,
            render: (value, record) => {
                const { icon } = record;

                if (icon) return <span><Icon type={icon} /> {value}</span>;

                return value;
            },
        },
        { title: '基础路径', dataIndex: 'basePath', key: 'basePath', width: 150 },
        { title: '路径', dataIndex: 'path', key: 'path' },
        { title: 'url', dataIndex: 'url', key: 'url', width: 100 },
        {
            title: 'target', dataIndex: 'target', key: 'target', width: 60,
            render: value => {
                const option = targetOptions.find(item => item.value === value);

                return option?.label;
            },
        },
        {
            title: '类型', dataIndex: 'type', key: 'type', width: 60,
            render: (value, record) => {
                const { url } = record;
                if (url) return <span style={{ color: 'purple' }}>外站</span>;
                if (value === '1') return <span style={{ color: 'green' }}>菜单</span>;
                if (value === '2') return <span style={{ color: 'orange' }}>功能</span>;

                return <span style={{ color: 'green' }}>菜单</span>;
            },
        },
        // { title: '功能编码', dataIndex: 'code', key: 'code', width: 100 },
        { title: '排序', dataIndex: 'order', key: 'order', width: 60 }
    ];

    componentDidMount() {
        this.handleSearch();
    }

    handleSearch() {
        this.setState({ loading: true });
        getMenus()
            .then(res => {
                const menus = res.map(item => ({ key: item.id, parentKey: item.parentId, ...item }));
                // 菜单根据order 排序
                const orderedData = [...menus].sort((a, b) => {
                    const aOrder = a.order || 0;
                    const bOrder = b.order || 0;

                    // 如果order都不存在，根据 text 排序
                    if (!aOrder && !bOrder) {
                        return a.text > b.text ? 1 : -1;
                    }

                    return bOrder - aOrder;
                });

                const menuTreeData = tree.convertToTree(orderedData);
                console.log(menuTreeData)

                this.setState({ menus: menuTreeData });
            })
            .finally(() => this.setState({ loading: false }));
    }

    render() {
        const {
            menus,
            visible,
            batchAddVisible,
            loading,
            data,
        } = this.state;

        return (
            <PageContent styleName="root">

                <Table
                    loading={loading}
                    columns={this.columns}
                    dataSource={menus}
                    pagination={false}
                />
            </PageContent>
        );
    }
}

