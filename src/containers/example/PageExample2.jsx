import React from 'react';
import PropTypes from 'prop-types';
import {
  Table
} from 'antd';
import {
  get,
  isFunction
} from 'lodash';
import {
  Container
} from 'components/common';

export default function pageExample2(props) {
  const dataSource = [
    {
      id: 1,
      name: 'Mike',
      age: 32,
      address: '10 Downing Street'
    },
    {
      id: 2,
      name: 'John',
      age: 42,
      address: '10 Downing Street'
    }
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    }
  ];

  const goBackExample = () => {
    const goBack = get(props.history, 'push');
    if (!isFunction(goBack)) {
      return;
    }
    goBack('/');
  };

  return (
    <Container
      goBack={{
        onClick: goBackExample
      }}
      title="Tạo mới báo cáo"
    >
      <div
        style={{
          width: '100%',
          minHeight: '300px',
          textAlign: 'center'
        }}
      >
        <h1 style={{ padding: '50px 0 20px', fontWeight: 600, fontSize: '18px' }}>This is the example page</h1>
        <Table
          bordered
          className="table-wrapper-custom"
          columns={columns}
          dataSource={dataSource}
          loading={false}
          pagination={false}
          rowKey={record => record.id}
        />
      </div>
    </Container>
  );
}

pageExample2.displayName = 'PageExample2';

pageExample2.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired
};
