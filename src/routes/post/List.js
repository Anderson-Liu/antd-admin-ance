import React from 'react'
import { Table } from 'antd'
import styles from './List.less'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: '序号',
      dataIndex: 'image',
      className: styles.image,
      width: 64,
      render: text => <img alt="Feture" width={26} src={text} />,
    }, {
      title: '测评项目',
      dataIndex: 'title',
      width: 140,
    }, {
      title: '测评项目详情',
      dataIndex: 'author',
      width: 360,
    }, {
      title: '扣分',
      dataIndex: 'categories',
      width: 60,
    }, {
      title: '扣分原因',
      dataIndex: 'tags',
      width: 120,
    }, {
      title: '地点描述',
      dataIndex: 'visibility',
      width: 320,
    }, {
      title: '照片',
      dataIndex: 'views',
      width: 220,
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        className={styles.table}
        rowKey={record => record.id}
      />
    </div>
  )
}

export default List
