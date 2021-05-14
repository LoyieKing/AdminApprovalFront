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
    QueryBar,
    Table,
    FormItem,
} from 'ra-lib';
import config from 'commons/config-hoc';
import EditModal from './EditModal';
import { usePromise } from 'commons/utils';
import { deleteUser, deleteUsers, getUsers, UserEntity } from 'commons/api/user';

export default config({
    path: '/users',
})((props) => {
    // 数据定义
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [dataSource, setDataSource] = useState<UserEntity[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    const [total, setTotal] = useState(0);
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState(null);
    const [form] = Form.useForm();

    // 请求相关定义 只是定义，不会触发请求，调用相关函数，才会触发请求
    const [loading, fetchUsers] = usePromise(getUsers)
    const [deleting, deleteUsersAsync] = usePromise(deleteUsers)
    const [deletingOne, deleteUserAsync] = usePromise(deleteUser)

    const columns = [
        { title: '用户名', dataIndex: 'userName', width: 200 },
        { title: '姓名', dataIndex: 'realName', width: 200 },
        {
            title: '生日', dataIndex: 'birthday', width: 200,
            render: value => value ? (new Date(value)).toLocaleDateString() : ""
        },
        { title: '联系方式', dataIndex: 'contract', width: 200 },
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const { id, userName } = record;
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
                            title: `您确定删除"${userName}"?`,
                            onConfirm: () => handleDelete(id),
                        },
                    },
                ];

                return <Operator items={items} />;
            },
        },
    ];

    // 函数定义
    async function handleSearch(options: {
        pageNum?: number,
        pageSize?: number
    } = {}) {
        if (loading) return;

        // 获取表单数据
        const values = form.getFieldsValue();
        const params = {
            ...values,
        };

        // 翻页信息优先从参数中获取
        params.pageNum = options.pageNum || pageNum;
        params.pageSize = options.pageSize || pageSize;

        console.log('params:', params);
        const resp = await (await fetchUsers({ page: pageNum, rows: pageSize, }, params.keyword ?? "")).data;
        if (resp.success) {
            const res = resp.data
            setDataSource(res.rows);
            setTotal(res?.rows?.length || 0);
        } else if (resp.success === false) {
            message.error(resp.message)
        }


    }

    async function handleDelete(id: number) {
        if (deletingOne) return;

        await deleteUserAsync(id);
        await handleSearch();
    }

    async function handleBatchDelete() {
        if (deleting) return;

        await batchDeleteConfirm(selectedRowKeys.length);

        await deleteUsers(selectedRowKeys);
        setSelectedRowKeys([]);
        await handleSearch();
    }

    // 组件初始化完成之后，进行一次查询
    useEffect(() => {
        (async () => {
            await handleSearch({ pageNum, pageSize });
        })();
    }, [pageNum, pageSize]);

    const formLayout = {
        style: { width: 200 },
    };

    const pageLoading = loading || deleting || deletingOne;
    const disabledDelete = !selectedRowKeys?.length || pageLoading;

    return (
        <PageContent loading={pageLoading}>
            <QueryBar>
                <Form
                    layout="inline"
                    form={form}
                    onFinish={() => handleSearch({ pageNum: 1 })}
                >
                    <FormItem
                        {...formLayout}
                        label="关键字"
                        name="keyword"
                    />
                    <FormItem>
                        <Space>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button onClick={() => form.resetFields()}>重置</Button>
                            <Button type="primary" onClick={() => {
                                setVisible(true)
                                setId(null)
                            }}>添加</Button>
                            <Button danger disabled={disabledDelete} onClick={handleBatchDelete}>删除</Button>
                        </Space>
                    </FormItem>
                </Form>
            </QueryBar>
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
                    await handleSearch({ pageNum: 1 });
                }}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
