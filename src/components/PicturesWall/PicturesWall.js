import React from 'react'
import { Upload, Icon, Modal } from 'antd'

const QINIU_SERVER = 'http://up.qiniu.com'
// noinspection JSAnnotator

class PicturesWall extends React.Component {
  constructor (props) {
    super(props)

    const value = this.props.value || {}
    this.state = {
      previewVisible: value.previewVisible || false,
      previewImage: value.previewImage || '',
      fileList: value.fileList || [],
    }
  }

  onChange = (info) => {
    let fileList = info.fileList

    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = `http://ot0m9zw62.bkt.clouddn.com/${file.response.key}`
      }
      return file
    })

    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.status === 'done'
      }
      return true
    })

    this.setState({ fileList })
    this.triggerChange({ fileList })
  }

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue))
    }
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList })
  }

  handleCancel = () => {
    this.setState({ previewVisible: false })
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.response.url,
      previewVisible: true,
    })
  }

  // data = { upload_preset: 'zwgk00' }
  data = {
    token: '8-WTLAZLPzinycMSBjYU7OFbrqjnvi32SsslLI4K:0oStZ6zErF4JXqVVa_GV5UE5ZdE=:eyJzY29wZSI6Indlbm1pbmciLCJkZWFkbGluZSI6MTg2MDAyMTg4Mn0=',
  }
  render () {
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div className="clearfix">
        <Upload
          action={QINIU_SERVER}
          listType="picture-card"
          className="upload-list-inline"
          onChange={this.onChange}
          onPreview={this.handlePreview}
          fileList={fileList}
          data={this.data}
        >
          {uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

export default PicturesWall
