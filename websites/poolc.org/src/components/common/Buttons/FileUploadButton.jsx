import { useCallback, useEffect, useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import ActionButton from './ActionButton';
import * as fileAPI from '../../../lib/api/file';
import FileUploadModal from '../FileUploadModal/FileUploadModal';
import Modal from '../Modal/Modal';
import uploadableTypes from '../../../constants/uploadableTypes';
import { SUCCESS } from '../../../constants/statusCode';
import { publicConfig } from '../../../lib/config/publicConfig';
import { createCardImage, createDetailImage } from '../../../lib/utils/createCardImage';

const FileUploadButton = ({ files, onSubmit, multiple, buttonStyle, optimizeCardImage = false, dropzone = multiple }) => {
  const [file, setFile] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const dropzoneInputRef = useRef(null);

  const prepareFiles = useCallback((fileList) => {
    const selectedFiles = Array.from(fileList ?? []);
    if (selectedFiles.length === 0) return;

    const filesToUpload = multiple ? selectedFiles : selectedFiles.slice(0, 1);
    const invalidFile = filesToUpload.find((selectedFile) => {
      const maxSize = selectedFile.type?.startsWith('image/') ? publicConfig.maxImageFileSize : publicConfig.maxFileSize;
      return selectedFile.size > maxSize || !uploadableTypes.includes(selectedFile.type);
    });

    if (invalidFile) {
      const maxSize = invalidFile.type?.startsWith('image/') ? publicConfig.maxImageFileSize : publicConfig.maxFileSize;
      setErrorMessage(invalidFile.size > maxSize ? '첨부 가능한 최대 크기를 초과하였습니다.' : 'png, jpg, jpeg, pdf, ppt, pptx 형식만 첨부 가능합니다.');
      setErrorModalVisible(true);
      return;
    }

    setFile(filesToUpload[0]);
    setPendingFiles(filesToUpload.slice(1));
    setModalVisible(true);
  }, [multiple]);

  const onBrowseFile = (event) => {
    prepareFiles(event.target.files);
    event.target.value = '';
  };

  const onUploadFile = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (file === null || isUploading) {
      if (file === null) {
        setErrorMessage('파일을 선택해주세요');
        setErrorModalVisible(true);
      }
      return;
    }

    setIsUploading(true);
    try {
      let response;
      if (optimizeCardImage) {
        const [card, detail] = await Promise.all([createCardImage(file), createDetailImage(file)]);
        response = await fileAPI.createImageSet(file, card, detail);
      } else {
        const formData = new FormData();
        formData.append('file', file);
        response = await fileAPI.createFile(formData);
      }

      if (response.status === SUCCESS.OK) {
        if (multiple) {
          onSubmit([...(files ?? []), response.data]);
        } else {
          onSubmit(response.data);
        }

        if (pendingFiles.length > 0) {
          setFile(pendingFiles[0]);
          setPendingFiles(pendingFiles.slice(1));
        } else {
          setFile(null);
          setModalVisible(false);
        }
      }
    } catch (error) {
      setErrorMessage(error.response?.data ?? error.message ?? '파일 업로드에 실패했습니다.');
      setErrorModalVisible(true);
    } finally {
      setIsUploading(false);
    }
  };

  const onPasteFiles = useCallback((event) => {
    if (isUploading) return;
    const clipboard = event.clipboardData;
    const pastedFiles = Array.from(clipboard?.files ?? []);
    if (pastedFiles.length === 0) {
      Array.from(clipboard?.items ?? []).forEach((item) => {
        if (item.kind === 'file') {
          const pastedFile = item.getAsFile();
          if (pastedFile) pastedFiles.push(pastedFile);
        }
      });
    }
    if (pastedFiles.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      prepareFiles(pastedFiles);
    }
  }, [isUploading, prepareFiles]);

  useEffect(() => {
    if (!modalVisible) return undefined;
    const handleWindowPaste = (event) => onPasteFiles(event);
    window.addEventListener('paste', handleWindowPaste);
    return () => window.removeEventListener('paste', handleWindowPaste);
  }, [modalVisible, onPasteFiles]);

  const onDragOver = (event) => {
    event.preventDefault();
    if (!isUploading) setIsDragActive(true);
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget)) setIsDragActive(false);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);
    if (!isUploading) prepareFiles(event.dataTransfer.files);
  };

  const onShowModal = (event) => {
    event.preventDefault();
    setModalVisible(true);
  };

  const onDropzoneClick = (event) => {
    if (dropzone && event.target !== dropzoneInputRef.current) dropzoneInputRef.current?.click();
  };

  const onDropzoneKeyDown = (event) => {
    if (dropzone && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      dropzoneInputRef.current?.click();
    }
  };

  const onCloseErrorModal = (event) => {
    event.preventDefault();
    setErrorModalVisible(false);
  };

  const buttons = <ActionButton onClick={onCloseErrorModal}>확인</ActionButton>;
  const dropTargetStyle = {
    position: 'relative',
    display: dropzone ? 'flex' : 'inline-flex',
    width: dropzone ? '100%' : undefined,
    minHeight: dropzone ? 156 : 42,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: dropzone ? 'column' : undefined,
    gap: 10,
    flexWrap: 'wrap',
    padding: dropzone ? 22 : '6px 10px',
    border: `2px dashed ${isDragActive ? '#47be9b' : '#e3dfda'}`,
    borderRadius: dropzone ? 12 : 8,
    background: isDragActive ? '#f2fbf8' : dropzone ? '#fcfbf9' : 'transparent',
    color: '#4b3827',
    cursor: 'pointer',
    textAlign: 'center',
    boxSizing: 'border-box',
    transition: 'border-color 0.18s ease, background-color 0.18s ease',
    outline: 'none',
  };

  return (
    <>
      <FileUploadModal
        visible={modalVisible}
        file={file}
        pendingCount={pendingFiles.length}
        isUploading={isUploading}
        multiple={multiple}
        onUploadFile={onUploadFile}
        onBrowseFile={onBrowseFile}
        onCancel={() => !isUploading && setModalVisible(false)}
      />
      <Modal contents={errorMessage} buttons={buttons} visible={errorModalVisible} onConfirm={onCloseErrorModal} onCancel={onCloseErrorModal} />
      <div
        tabIndex={0}
        role={dropzone ? 'button' : 'group'}
        aria-label="파일을 끌어 놓거나 복사한 파일을 붙여넣어 첨부"
        onClick={onDropzoneClick}
        onKeyDown={onDropzoneKeyDown}
        onPaste={onPasteFiles}
        onDragEnter={onDragOver}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={dropTargetStyle}
      >
        {dropzone ? (
          <>
            <input
              ref={dropzoneInputRef}
              type="file"
              accept="image/png,image/jpeg,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint"
              multiple={multiple}
              onChange={onBrowseFile}
              disabled={isUploading}
              style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', clipPath: 'inset(50%)' }}
            />
            <InboxOutlined aria-hidden="true" style={{ color: '#47be9b', fontSize: 34 }} />
            <span style={{ color: '#4b3827', fontSize: '0.95rem', fontWeight: 700 }}>{isDragActive ? '여기에 놓아 첨부하세요' : '파일을 여기에 끌어다 놓으세요'}</span>
            <span style={{ color: '#47be9b', fontSize: '0.84rem', fontWeight: 700 }}>또는 파일 선택 · 복사 후 Ctrl/Cmd+V</span>
          </>
        ) : (
          <>
            <ActionButton className="file" onClick={onShowModal} disabled={isUploading} style={buttonStyle ?? { marginBottom: '1rem' }}>
              파일 첨부
            </ActionButton>
            <span style={{ color: '#82776e', fontSize: '0.78rem' }}>파일을 끌어 놓거나, 복사 후 Ctrl/Cmd+V</span>
          </>
        )}
      </div>
    </>
  );
};

export default FileUploadButton;
