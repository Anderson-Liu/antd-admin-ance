import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'


const FormTemplate = ({ filterProps, selectedRowKeys, listProps, modalVisible, modalProps, handleDeleteItems }) => {
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

FormTemplate.propTypes = {
  filterProps: PropTypes.object,
  selectedRowKeys: PropTypes.array,
  listProps: PropTypes.object,
  modalProps: PropTypes.object,
  modalVisible: PropTypes.bool,
  handleDeleteItems: PropTypes.func,
}

// export default connect(({ ppt, loading }) => ({ ppt, loading }))(PPT)
export default FormTemplate
