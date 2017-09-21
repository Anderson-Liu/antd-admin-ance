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

const EditableTable = ({ titleData, onChange }) => {
  const handleChange = (key, index, value) => {
    // todo: deal with value change
    onChange(titleData)
  }

  const renderColumns = (data, index, key, text) => {
    const { editable, status } = data[index][key]
    if (typeof editable === 'undefined') {
      return text
    }
    return (<EditableCell
      editable={editable}
      value={text}
      onChange={value => handleChange(key, index, value)}
      status={status}
    />)
  }

  const edit = (index) => {
    Object.keys(titleData[index]).forEach((item) => {
      if (titleData[index][item] && typeof titleData[index][item].editable !== 'undefined') {
        titleData[index][item].editable = true
      }
    })
    onChange(titleData)
  }

  const editDone = (index, type) => {
    Object.keys(titleData[index]).forEach((item) => {
      if (titleData[index][item] && typeof titleData[index][item].editable !== 'undefined') {
        titleData[index][item].editable = false
        titleData[index][item].status = type
      }
    })
    Object.keys(titleData[index]).forEach((item) => {
      if (titleData[index][item] && typeof titleData[index][item].editable !== 'undefined') {
        delete titleData[index][item].status
      }
    })
    // todo: check if this duplicate with onChange in handleChange?
    onChange(titleData)
  }

  const columns = [{
    title: 'title',
    titleDataIndex: 'title',
    key: 'title',
    width: '25%',
    render: (text, record, index) => renderColumns(titleData, index, 'title', text.title.value),
  }, {
    title: 'subtitle',
    titleDataIndex: 'subtitle',
    key: 'subtitle',
    width: '15%',
    render: (text, record, index) => renderColumns(titleData, index, 'subtitle', text.subtitle.value),
  }, {
    title: 'operation',
    titleDataIndex: 'operation',
    key: 'operation',
    render: (text, record, index) => {
      const { editable } = titleData[index].title
      return (
        <div className="editable-row-operations">
          {
            editable ?
              <span>
                <a onClick={() => editDone(index, 'save')}>Save</a>
                <Popconfirm title="Sure to cancel?" onConfirm={() => editDone(index, 'cancel')}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
              :
              <span>
                <a onClick={() => edit(index)}>Edit</a>
              </span>
          }
        </div>
      )
    },
  }]

  return <Card><Table rowKey="0" bordered dataSource={titleData} columns={columns} pagination={false} /></Card>
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
