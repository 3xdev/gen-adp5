import { useState, useEffect } from 'react';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import type { EditorState } from 'braft-editor';
import { connect } from '@formily/react';
import { uploadImages } from '@/services/ant-design-pro/api';

const CustomRichText = connect((props: any) => {
  const [editor, setEditor] = useState<EditorState>(null);
  useEffect(() => {
    if (props.value !== undefined) {
      setEditor(BraftEditor.createEditorState(props.value));
    }
  }, [props.value]);
  const handleUploadFn = (param: any) => {
    uploadImages(param.file)
      .then((res) => param.success({ url: res.url }))
      .catch(() => param.error({ msg: '上传失败！' }));
  };
  const handleChange = (editorState: any) => {
    props.onChange(editorState.toHTML());
    setEditor(editorState);
  };

  return (
    <div style={{ border: '1px solid rgba(0,0,0,0.12)' }}>
      {/* @ts-ignore */}
      <BraftEditor
        controls={[
          'font-size',
          'line-height',
          'letter-spacing',
          'text-color',
          'bold',
          'italic',
          'underline',
          'remove-styles',
          'separator',
          'text-align',
          'separator',
          'list-ul',
          'list-ol',
          'blockquote',
          'hr',
          'separator',
          'emoji',
          'media',
          'fullscreen',
        ]}
        contentStyle={{ height: 300 }}
        placeholder="请输入内容"
        value={editor}
        media={{ uploadFn: handleUploadFn }}
        onChange={handleChange}
      />
    </div>
  );
});

export default CustomRichText;
