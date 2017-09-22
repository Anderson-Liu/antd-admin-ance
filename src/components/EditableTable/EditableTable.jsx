import React from 'react'
import { Table, Input, Popconfirm, Card } from 'antd'
import PropTypes from 'prop-types'

let tmpData;
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
    console.log('Editable Cell call componentWillReceiveProps nextProps: ', nextProps)
    console.log('Editable Cell call componentWillReceiveProps this.state: ', this.state)
    console.log('Editable Cell call componentWillReceiveProps this.cacheValue: ', this.cacheValue)
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        console.log('Editable Cell call componentWillReceiveProps --save')
        this.props.onChange(this.state.value, nextProps.status)
      } else if (nextProps.status === 'cancel') {
        console.log('Editable Cell call componentWillReceiveProps --cancel')
        this.setState({ value: this.cacheValue })
        this.props.onChange(this.cacheValue, nextProps.status)
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
      nextState.value !== this.state.value
  }

  handleChange (e) {
    const value = e.target.value
    console.log('Editable Cell call onChange: ', value)
    this.setState({ value })
  }

  componentDidUpdate(prevProps, prevState) {
    tmpData = this.state
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
  shouldComponentUpdate (nextProps, nextState) {
    console.log('rerender')
    const { title, subtitle } = this.props.titleData[0]
    const { newTitle, newSubtitle } = nextProps.titleData[0]
    console.log('rerender', title !== newTitle || subtitle !== newSubtitle)
    return title !== newTitle || subtitle !== newSubtitle
  }

  columns = [{
    title: 'title',
    dataIndex: 'title',
    width: '25%',
    render: (text, record, index) => this.renderColumns(this.props.titleData, index, 'title', text),
  }, {
    title: 'subtitle',
    dataIndex: 'subtitle',
    width: '15%',
    render: (text, record, index) => this.renderColumns(this.props.titleData, index, 'subtitle', text),
  }, {
    title: 'operation',
    dataIndex: 'operation',
    render: (text, record, index) => {
      const { editable } = this.props.titleData[index].title
      console.log('operation call render - titleData', this.props.titleData)
      console.log('operation call render - index', index)
      console.log('operation call render - editable', editable)
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

  renderColumns (data, index, key, text) {
    const { editable, status } = data[index][key]
    if (typeof editable === 'undefined') {
      return text
    }
    return (<EditableCell
      editable={editable}
      value={text}
      onChange={(value, newStatus) => this.handleChange(key, index, value, newStatus)}
      status={status}
    />)
  }
  handleChange (key, index, value, newStatus) {
    this.props.titleData[index][key].value = value
    const data = this.props.titleData
    if (newStatus === 'save') {
      // todo: finish it
      Object.keys(this.props.titleData[index]).forEach((item) => {
        if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
          data[index][item].status = undefined
        }
      })
      this.props.onChange(this.props.titleData[0])
    } else {
      console.log('EditableTable call handleChange with value:', value)
      console.log('EditableTable call handleChange with data:', this.props.titleData)
      this.props.onChange(this.props.titleData[0])
    }
    // this.setState({ data })
  }
  edit (index) {
    const data = this.props.titleData
    Object.keys(this.props.titleData[index]).forEach((item) => {
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = true
      }
    })
    // this.setState({ data })
    this.props.onChange(this.props.titleData[0])
  }
  editDone (index, type) {
    let data = this.props.titleData
    console.log('editDone-Data', this.props.titleData)
    Object.keys(this.props.titleData[index]).forEach((item) => {
      console.log('data[index][item]', data[index][item])
      if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
        data[index][item].editable = false
        data[index][item].status = type
      }
    })
    console.log('editDone-Data-2', this.props.titleData)
    this.props.onChange(this.props.titleData[0])
    // data = this.props.titleData
    // Object.keys(this.props.titleData[index]).forEach((item) => {
    //   if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
    //     data[index][item].status = undefined
    //   }
    // })
    // this.props.onChange(this.props.titleData[0])
  }

  render () {
    const dataSource = this.props.titleData.map((item) => {
      const obj = {}
      Object.keys(item).forEach((key) => {
        obj[key] = key === 'key' ? item[key] : item[key].value
      })
      return obj
    })
    return <Card><Table bordered dataSource={dataSource} columns={this.columns} pagination={false} /></Card>
  }
}

EditableCell.propTypes = {
  value: PropTypes.string,
  status: PropTypes.string,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
}

EditableTable.propTypes = {
  titleData: PropTypes.array,
  onChange: PropTypes.func,
}


export default EditableTable
