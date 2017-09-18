import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Switch } from 'antd'
import { PicturesWall } from 'components'

const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    // todo: 在这里添加fileList到fileList中
    validateFields((errors) => {
      if (errors) {
        return
      }
      let data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  // todo: 解决初始化和存储image uploader中fileList的问题
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="Title" hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: item.title,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="Content" hasFeedback {...formItemLayout}>
          {getFieldDecorator('content', {
            initialValue: item.content,
            rules: [
              {
                required: true,
              },
            ],
          })(<TextArea autosize={{ minRows: 2, maxRows: 20 }} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="isPublish"
        >
          {getFieldDecorator('isPublish', { initialValue: item.isPublish, valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>
        <FormItem label="Image" hasFeedback {...formItemLayout}>
          {getFieldDecorator('fileList', {
            initialValue: { fileList: item.fileList },
            rules: [
              {
                required: true,
              },
            ],
            getValueFromEvent (e) {
              if (!e || !e.fileList) {
                return e
              }
              const { fileList } = e
              item.fileList = fileList
              return fileList
            },
          })(
            <PicturesWall />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  previewVisible: PropTypes.bool,
  previewImage: PropTypes.string,
  handlePreview: PropTypes.func,
  handleCancel: PropTypes.func,
}

export default Form.create()(modal)
