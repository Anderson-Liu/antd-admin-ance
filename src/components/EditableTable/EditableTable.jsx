import React from 'react'
import { Table, Input, Popconfirm, Card } from 'antd'
import PropTypes from 'prop-types'

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: this.props.editable || false,
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable })
      if (nextProps.editable) {
        this.cacheValue = this.state.value
      }
    }
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.value)
      } else if (nextProps.status === 'cancel') {
        this.setState({ value: this.cacheValue })
        this.props.onChange(this.cacheValue)
      }
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
      nextState.value !== this.state.value
  }
  handleChange (e) {
    const value = e.target.value
    this.setState({ value })
  }
  render () {
    const { value, editable } = this.state
    return (
      <div>
        {
          editable ?
            <div>
              <Input
                value={value}
                onChange={e => this.handleChange(e)}
              />
            </div>
            :
            <div className="editable-row-text">
              {value.toString() || ' '}
            </div>
        }
      </div>
    )
  }
}

class EditableTable extends React.Component {
  constructor (props) {
    super(props)
    this.columns = [{
      title: 'title',
      dataIndex: 'title',
      width: '25%',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'title', text),
    }, {
      title: 'subtitle',
      dataIndex: 'subtitle',
      width: '15%',
      render: (text, record, index) => this.renderColumns(this.state.data, index, 'subtitle', text),
    }, {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record, index) => {
        const { editable } = this.state.data[index].title
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.editDone(index, 'save')}>Save</a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.editDone(index, 'cancel')}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                :
                <span>
                  <a onClick={() => this.edit(index)}>Edit</a>
                </span>
            }
          </div>
        )
      },
    }]
    this.state = {
      data: [{
        key: '0',
        title: {
          editable: false,
          // value: this.props.title,
          value: 'anderson',
        },
        subtitle: {
          editable: false,
          // value: this.props.subtitle,
          value: 'liu',
        },
      }],
    }
  }
  renderColumns (data, index, key, text) {
    console.log(`调用子组件${key}的render函数`)
    const { editable, status } = data[index][key]
    if (typeof editable === 'undefined') {
      return text
    }
    return (<EditableCell
      editable={editable}
      value={text}
      onChange={value => this.handleChange(key, index, value)}
      status={status}
    />)
  }
  handleChange (key, index, value) {
    console.log(`调用子组件${key}的handleChange传递数据到父组件`)
    const { data } = this.state
    data[index][key].value = value
    this.setState({ data })
  }

  edit (index) {
    const { data } = this.state
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = true
      }
    })
    this.setState({ data })
  }
  editDone (index, type) {
    const { data } = this.state
    Object.keys(data[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = false
        data[index][item].status = type
      }
    })
    this.setState({ data }, () => {
      console.log('调用之后setState之后的函数')
      Object.keys(data[index]).forEach((item) => {
        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
          delete data[index][item].status
        }
      })
      this.props.onChange({
        title: this.state.data[0].title.value,
        subtitle: this.state.data[0].subtitle.value,
      })
    })
  }
  render () {
    console.log('调用父组件的render')
    const { data } = this.state
    const dataSource = data.map((item) => {
      const obj = {}
      Object.keys(item).forEach((key) => {
        obj[key] = key === 'key' ? item[key] : item[key].value
      })
      return obj
    })
    const columns = this.columns
    return <Card><Table bordered dataSource={dataSource} columns={columns} pagination={false} /></Card>
  }
}
EditableCell.propTypes = {
  value: PropTypes.string,
  status: PropTypes.string,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
}
export default EditableTable
