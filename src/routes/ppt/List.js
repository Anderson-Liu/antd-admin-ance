import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'

const confirm = Modal.confirm

const List = ({ onDeleteItem, onEditItem, isMotion, location, ...tableProps }) => {
  location.query = queryString.parse(location.search)

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: 'Are you sure delete this record?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'num',
      key: 'num',
      width: 84,
      render: text => (<span>{text
        ? 0
        : 1}</span>),
    },
    {
      title: '测评项目',
      dataIndex: 'title',
      key: 'title',
      width: 140,
      render: (text, record) => <Link to={`ppt/${record.id}`}>{text}</Link>,
    }, {
      title: '测评项目详情',
      dataIndex: 'content',
      key: 'content',
    }, {
      title: '扣分',
      dataIndex: 'isPublish',
      key: 'isPublish',
      width: 84,
      render: text => (<span>{text
        ? 0.1
        : 0.2}</span>),
    }, {
      title: '扣分原因',
      dataIndex: 'title',
      key: 'reason',
      width: 140,
      render: text => <div>{text}</div>,
    }, {
      title: '地点',
      dataIndex: 'title',
      key: 'location',
      width: 90,
    }, {
      title: '提交者',
      dataIndex: 'title',
      key: 'author',
      width: 90,
    }, {
      title: '截图',
      dataIndex: 'fileList',
      key: 'fileList',
      width: 64,
      className: styles.avatar,
      render: text => <img alt={'avatar'} width={24} src={text[0].url} />,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: 'Update' }, { key: '2', name: 'Delete' }]} />
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = (body) => { return isMotion ? <AnimTableBody {...getBodyWrapperProps} body={body} /> : body }

  return (
    <div>
      <Table
        {...tableProps}
        className={classnames({ [styles.table]: true, [styles.motion]: isMotion })}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
        getBodyWrapper={getBodyWrapper}
        scroll={{ x: true }}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  isMotion: PropTypes.bool,
  location: PropTypes.object,
}

export default List
