import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import { FormTemplate, EditableTable } from 'components'

/**
 *
 * @param location 来自react-route,https://github.com/ReactTraining/react-router/blob/v3/docs/API.md#injected-props
 * @param dispatch 来自react-redux的connect默认引入的prop，https://github.com/reactjs/react-redux/blob/master/docs/api.md#inject-just-dispatch-and-dont-listen-to-store
 * @param desctab  来自执行connect时带入的参数
 * @param loading 来自执行connect时带入的参数
 * @returns {XML}
 * @constructor
 */
// connect带来dispatch,desctab,loading,详见《深入浅出React和Redux》3.2.5
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

  const onChange = (data) => {
    console.log('onChange', data)
    dispatch({
      type: 'desctab/updateTitle',
      payload: data,
    })
  }

  const tableProps = {
    titleData,
    onChange,
  }

  return <div><EditableTable {...tableProps} /> <FormTemplate {...allProps} /></div>
}

Test.propTypes = {
  desctab: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

/**
 * 深入浅出React和Redux》5.1.3文末讲解mapDispatchToProps=(dispatch, ownProps)=>{}中,ownProps是指父组件传递过来的props
 *
 * [mapStateToProps(state, [ownProps]): stateProps] (Function): If this argument is specified, the new component will subscribe
 * to Redux store updates. This means that any time the store is updated, mapStateToProps will be called. The results of
 * mapStateToProps must be a plain object, which will be merged into the component’s props. If you don't want to subscribe to
 * store updates, pass null or undefined in place of mapStateToProps.
 *
 * It does not modify the component class passed to it; instead, it returns a new, connected component class for you to use.
 */
export default connect(({ desctab, loading }) => ({ desctab, loading }))(Test)

