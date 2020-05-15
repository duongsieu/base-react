import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import MobileDetect from 'mobile-detect';

let isTouchDevice;
const md = new MobileDetect(window.navigator.userAgent);

/**
 * Định nghĩa backend table cho sắp xếp trong table
 */
function getBackEndTable() {
  isTouchDevice = false;
  if (md.mobile()) {
    isTouchDevice = true;
  }
  let backend = HTML5Backend;
  let options;
  if (isTouchDevice) {
    backend = TouchBackend;
    options = {
      enableMouseEvents: true,
      enableTouchEvents: true,
      enableKeyboardEvents: true,
      delayTouchStart: 100,
      scrollAngleRanges: [{ start: 30, end: 150 }, { start: 210, end: 330 }]
    };
  }
  return { backend, options };
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  }
};

const dragDirection = (
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) => {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
  return '';
};

const BodyRow = (props) => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: 'move' };
  let { className } = restProps;
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }

  return connectDragSource(
    connectDropTarget(
      <tr
        {...restProps}
        className={className}
        style={style}
      />
    )
  );
};

const rowTarget = {
  drop(props, monitor) {
    const newMonitor = monitor;
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveRow(dragIndex, hoverIndex);
    newMonitor.getItem().index = hoverIndex;
  }
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(BodyRow)
);

const components = {
  body: {
    row: DragableBodyRow
  }
};

export {
  DragableBodyRow,
  components,
  getBackEndTable
};

export default DragableBodyRow;
