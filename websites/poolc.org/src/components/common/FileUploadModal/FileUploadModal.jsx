import { CloseOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import colors from '~/lib/styles/colors.js';
import {
  ButtonContainer,
  ContentContainer,
  FileLabel,
  FileName,
  FileNameContainer,
  HeaderBar,
  ModalBlock,
  ModalContainer,
  ModalName,
  StyledActionButton,
  StyledFileButton,
  StyledFileInput,
  StyledForm,
  FileSizeAlert,
} from './FileUploadModal.styles.js';

const FileUploadModal = ({ visible, file, pendingCount = 0, isUploading = false, multiple = false, onUploadFile, onBrowseFile, onCancel }) => {
  const [animate, setAnimate] = useState(false);
  const [localVisible, setLocalVisible] = useState(visible);

  useEffect(() => {
    if (localVisible && !visible) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 250);
    }
    setLocalVisible(visible);
  }, [localVisible, visible]);

  if (!localVisible && !animate) return null;

  return (
    <ModalBlock disappear={!visible} onClick={onCancel}>
      <ModalContainer disappear={!visible} onClick={(e) => e.stopPropagation()}>
        <HeaderBar>
          <CloseOutlined twoToneColor={colors.brown[1]} style={{ marginRight: '15px', cursor: 'pointer' }} onClick={onCancel} />
        </HeaderBar>
        <ContentContainer>
          <ModalName>파일 업로드</ModalName>
          <StyledForm encType="multipart/form-data" onSubmit={onUploadFile}>
            <FileNameContainer>
              <FileLabel>선택된 파일</FileLabel>
              {file ? <FileName>{file?.name}{pendingCount > 0 && ` 외 ${pendingCount}개`}</FileName> : <FileName>선택된 파일이 없습니다</FileName>}
            </FileNameContainer>
            <FileSizeAlert>* 파일 업로드는 50mb까지 가능합니다.</FileSizeAlert>
            <ButtonContainer>
              <StyledFileButton className="browse-file" htmlFor="my_file" onChange={onBrowseFile}>
                파일 찾기
              </StyledFileButton>
              <StyledActionButton className="upload-file" disabled={isUploading}>{isUploading ? '업로드 중…' : '이 파일 첨부'}</StyledActionButton>
            </ButtonContainer>
            <StyledFileInput type="file" accept="image/png,image/jpeg,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint" multiple={multiple} disabled={isUploading} onChange={onBrowseFile} id="my_file" />
          </StyledForm>
        </ContentContainer>
      </ModalContainer>
    </ModalBlock>
  );
};

export default FileUploadModal;
