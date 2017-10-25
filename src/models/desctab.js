/* global window */
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { create, remove, update } from 'services/desctab'
import { update as updateTitle } from 'services/tabtitle'
import * as desctabsService from 'services/desctabs'
import * as titleService from 'services/tabtitles'
import { pageModel } from './common'

const { query } = desctabsService
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'desctab',

  state: {
    currentItem: {},
    previewVisible: false,
    previewImage: '',
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}desctabIsMotion`) === 'true',
    title: '',
    subTitle: '',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/test') {
          const payload = location.query || { current: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
          // dispatch({ type: 'queryTitle' })
        }
      })
    },
  },

  effects: {

    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            title: data.title,
            subTitle: data.subTitle,
          },
        })
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(remove, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.desctab)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * multiDelete ({ payload }, { call, put }) {
      const data = yield call(payload.remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    // todo: 解决不用id的update问题，解决无法建立tabTitle的不用id的update server监听的问题
    * update ({ payload }, { select, call, put }) {
      // 拿到context中namespace为desctab的值，里面包含了state，进一步获取里面的currentItem来改
      const id = yield select(({ desctab }) => desctab.currentItem.id)
      // 将payload的id改为currentItem的id
      const newdesctab = { ...payload, id }
      // 使用call调用update方法，更新newdesctab进去
      const data = yield call(update, newdesctab)
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * updateTitle ({
      payload,
    }, { call, put }) {
      const newTitle = payload
      // const result = yield call(updateTitle, newTitle)
      console.log('newTitle', payload)
      const result = yield call(update, newTitle)
      const { success } = result
      // if (success) {
      //   yield put({ type: 'query' })
      // }
    },

  },

  reducers: {
    // 传参相关文档
    // http://es6.ruanyifeng.com/#docs/object#%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%A9%E5%B1%95%E8%BF%90%E7%AE%97%E7%AC%A6
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    showPreview (state, { payload }) {
      return { ...state, ...payload, previewVisible: true }
    },

    hidePreview (state) {
      return { ...state, previewVisible: false }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}desctabIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },
})
