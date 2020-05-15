import React from 'react';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';

// Custom format font editor
const Font = ReactQuill.Quill.import('formats/font');
Font.whitelist = ['Times-New-Roman', 'Arial', 'Roboto'];
ReactQuill.Quill.register(Font, true);

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quillModules: {
        toolbar: [
          // heading
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          // font size
          [{ font: Font.whitelist }],
          [{ size: ['small', false, 'large', 'huge'] }],
          // toggled buttons
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          // list
          [{ list: 'ordered' }, { list: 'bullet' }],
          // superscript/subscript
          [{ script: 'sub' }, { script: 'super' }],
          // outdent/indent
          [{ indent: '-1' }, { indent: '+1' }],
          // text direction
          [{ direction: 'rtl' }],
          // dropdown with defaults from theme
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image'],
          // clear format code
          ['clean']
        ],
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
          matchVisual: false
        }
      },
      quillFormats: [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'code-block',
        'list',
        'script',
        'bullet',
        'indent',
        'direction',
        'color',
        'align',
        'background',
        'link',
        'image'
      ]
    };
  }

  render() {
    return (
      <ReactQuill
        bounds=".app-quill"
        className={this.props.className}
        formats={this.state.quillFormats}
        modules={this.state.quillModules}
        onChange={this.props.onChange}
        placeholder={this.props.placeholder}
        theme="snow"
        value={this.props.value}
      />
    );
  }
}
Editor.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string
};
Editor.defaultProps = {
  className: '',
  onChange: null,
  placeholder: '',
  value: ''
};

export default Editor;
