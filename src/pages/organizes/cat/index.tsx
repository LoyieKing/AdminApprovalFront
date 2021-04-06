import React, { useEffect, useState } from 'react';
import {
    Button,
    Form,
    message,
    Space,
} from 'antd';
import {
    PageContent,
    batchDeleteConfirm,
    Operator,
    Pagination,
    ToolBar,
    Table,
    FormItem,
} from 'ra-lib';
import config from 'commons/config-hoc';
import EditModal from './EditModal';
import { usePromise } from 'commons/utils';
import { deleteOrganizeCat, getOrganizeCats, OrganizeCat } from 'commons/api/organize';

export default config({
    path: '/organize/cat',
})((props) => {
    // 数据定义
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [dataSource, setDataSource] = useState<OrganizeCat[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    const [total, setTotal] = useState(0);
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState(null);
    const [form] = Form.useForm();

    // 请求相关定义 只是定义，不会触发请求，调用相关函数，才会触发请求
    const [loading, fetchOrganizeCatsAsync] = usePromise(getOrganizeCats)
    const [deleting, deleteOrganizeCatsAsync] = usePromise(deleteOrganizeCat)

    const columns = [
        { title: '组织类型名', dataIndex: 'name', width: 200 },
        {
            title: '组织类型', dataIndex: 'category', width: 200,
            render: (value, records) => {
                if (value === 0) return "长期"
                else if (value === 1) return "短期"
            }
        },
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const { id, name } = record;
                const items = [
                    {
                        label: '编辑',
                        onClick: () => {
                            setVisible(true)
                            setId(id)
                        },
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: () => handleDelete([id], false),
                        },
                    },
                ];

                return <Operator items={items} />;
            },
        },
    ];

    // 函数定义
    async function handleSearch() {
        if (loading) return;

        const resp = await (await fetchOrganizeCatsAsync()).data;
        if (resp.success) {
            const res = resp.data
            setDataSource(res);
            setTotal(res.length);
        } else if (resp.success === false) {
            message.error(resp.message)
        }

    }

    async function handleDelete(ids: number[], confirm: boolean = true) {
        if (deleting) return;

        if (confirm)
            await batchDeleteConfirm(ids.length);

        await deleteOrganizeCatsAsync(ids);
        setSelectedRowKeys([]);
        await handleSearch();
    }

    // 组件初始化完成之后，进行一次查询
    useEffect(() => {
        (async () => {
            await handleSearch();
        })();
    }, [pageNum, pageSize]);

    const formLayout = {
        style: { width: 200 },
    };

    const pageLoading = loading || deleting;
    const disabledDelete = !selectedRowKeys?.length || pageLoading;

    return (
        <PageContent loading={pageLoading}>
            <ToolBar>
                <Space>
                    <Button type="primary" onClick={() => {
                        setVisible(true)
                        setId(null)
                    }}>添加</Button>
                    <Button danger disabled={disabledDelete} onClick={() => handleDelete(selectedRowKeys)}>删除</Button>
                </Space>
            </ToolBar>
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                serialNumber
                pageNum={pageNum}
                pageSize={pageSize}
            />
            <Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={pageNum => setPageNum(pageNum)}
                onPageSizeChange={pageSize => {
                    setPageNum(1);
                    setPageSize(pageSize);
                }}
            />
            <EditModal
                visible={visible}
                id={id}
                isEdit={id !== null}
                onOk={async () => {
                    setVisible(false);
                    await handleSearch();
                }}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
