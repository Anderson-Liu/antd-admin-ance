import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import { FormTemplate, EditableTable } from 'components'

const Test = ({ location, dispatch, desctab, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys, previewVisible, previewImage, titleData } = desctab
  const { pageSize } = pagination
  location.query = queryString.parse(location.search)
  // noinspection JSAnnotator
  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['desctab/update'],
    title: `${modalType === 'create' ? 'Create desctab' : 'Update desctab'}`,
    wrapClassName: 'vertical-center-modal',
    previewVisible,
    previewImage,
    // todo: 使用redux修改
    handleCancel () {
      dispatch({
        type: 'desctab/hidePreview',
      })
    },
    // todo: 使用redux修改
    handlePreview (file) {
      const data = {
        previewImage: file.url || file.thumbUrl,
      }
      dispatch({
        type: 'desctab/showPreview',
        payload: data,
      })
    },
    onOk (data) {
      dispatch({
        type: `desctab/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'desctab/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['desctab/query'],
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
        type: 'desctab/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'desctab/showModal',
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
          type: 'desctab/updateState',
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
        pathname: '/desctab',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/desctab',
      }))
    },
    onAdd () {
      dispatch({
        type: 'desctab/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'desctab/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'desctab/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  const allProps = {
    modalProps,
    listProps,
    filterProps,
    modalVisible,
    selectedRowKeys,
    handleDeleteItems,
  }

  return <div><EditableTable {...titleData} /> <FormTemplate {...allProps} /></div>
}

Test.propTypes = {
  desctab: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ desctab, loading }) => ({ desctab, loading }))(Test)
