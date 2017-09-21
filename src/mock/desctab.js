const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config

let desctabsListData = Mock.mock({
  'data|4-8': [
    {
      id: '@id',
      title: '@title',
      namespace: 'desctab',
      content: '@paragraph',
      isPublish: '@boolean',
      createTime: '@datetime',
      'fileList|1-10': [{
        name: '@integer(1,960)',
        uid: '-@name',
        url: 'http://7xriwb.com1.z0.glb.clouddn.com/@name',
        status: 'done',
      }],
    },
  ],
  'titleData|1-1': [
    {
      key: '@id',
      id: '@id',
      title: {
        editable: false,
        value: '@title',
      },
      subtitle: {
        editable: false,
        value: '@title',
      },
    },
  ],
})

let database = desctabsListData.data
let titleDB = desctabsListData.titleData

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}

const NOTFOUND = {
  message: 'Not Found',
  documentation_url: 'http://localhost:8000/request',
}

module.exports = {

  [`GET ${apiPrefix}/desctabs`] (req, res) {
    console.log('receive query desctabs request ')
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database

    res.status(200).json({
      data: newData.slice((page - 1) * pageSize, page * pageSize),
      titleData: desctabsListData.titleData,
      total: newData.length,
    })
  },

  [`DELETE ${apiPrefix}/desctabs`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },

  // desctab post add api
  [`POST ${apiPrefix}/desctab`] (req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')
    newData.desctabImage = newData.desctabImage || Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.title.substr(0, 1))
    newData.id = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

  [`GET ${apiPrefix}/desctab/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json(data)
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`DELETE ${apiPrefix}/desctab/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      database = database.filter(item => item.id !== id)
      res.status(204).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PATCH ${apiPrefix}/desctab/:id`] (req, res) {
    const { id } = req.params
    const editItem = req.body
    let isExist = false

    database = database.map((item) => {
    // titleDB = titleDB.map((item) => {
      if (item.id === id) {
        isExist = true
        // Merging objects with same properties
        // The properties are overwritten by other objects that have the same properties later in the parameters order.
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      res.status(404).json(NOTFOUND)
    }
  },

  [`PATCH ${apiPrefix}/tabtitle/:id`] (req, res) {
    console.log('recivie patch')
    const { id } = req.params
    const editItem = req.body
    let isExist = false

    titleDB = titleDB.map((item) => {
      if (item.id === id) {
        isExist = true
        // Merging objects with same properties
        // The properties are overwritten by other objects that have the same properties later in the parameters order.
        return Object.assign({}, item, editItem)
      }
      return item
    })

    if (isExist) {
      res.status(201).end()
    } else {
      console.log('debug not found')
      res.status(404).json(NOTFOUND)
    }
  },
}
