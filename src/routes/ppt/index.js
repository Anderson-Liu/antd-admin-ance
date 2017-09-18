import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'


const PPT = ({ location, dispatch, ppt, loading }) => {
  location.query = queryString.parse(location.search)
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys, previewVisible, previewImage } = ppt
  const { pageSize } = pagination

  // noinspection JSAnnotator
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['ppt/update'],
    title: `${modalType === 'create' ? 'Create PPT' : 'Update PPT'}`,
    wrapClassName: 'vertical-center-modal',
    previewVisible,
    previewImage,
    // todo: 使用redux修改
    handleCancel () {
      dispatch({
        type: 'ppt/hidePreview',
      })
    },
    // todo: 使用redux修改
    handlePreview (file) {
      const data = {
        previewImage: file.url || file.thumbUrl,
      }
      dispatch({
        type: 'ppt/showPreview',
        payload: data,
      })
    },
    onOk (data) {
      dispatch({
        type: `ppt/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'ppt/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['ppt/query'],
    pagination,
    location,
    isMotion,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'ppt/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'ppt/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'ppt/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const filterProps = {
    isMotion,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/ppt',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/ppt',
      }))
    },
    onAdd () {
      dispatch({
        type: 'ppt/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'ppt/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'ppt/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      {
        selectedRowKeys.length > 0 &&
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`Selected ${selectedRowKeys.length} items `}
            <Popconfirm title={'Are you sure delete these items?'} placement="left" onConfirm={handleDeleteItems}>
              <Button type="primary" size="large" style={{ marginLeft: 8 }}>Remove</Button>
            </Popconfirm>
          </Col>
        </Row>
      }
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

PPT.propTypes = {
  ppt: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ ppt, loading }) => ({ ppt, loading }))(PPT)
