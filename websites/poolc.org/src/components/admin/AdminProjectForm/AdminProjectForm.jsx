/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Editor } from '@dialga/react-editor';
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { Modal as AntModal, Select } from 'antd';
import koKR from 'antd/locale/ko_KR';
import useInput from '../../../hooks/useInput';
import ActionButton from '../../common/Buttons/ActionButton';
import { notEmptyValidation } from '../../../lib/utils/validation';
import {
  Description, EditorWrap, FormContent, FormGrid, FormSection, ImageContainer, Item,
  SectionHeader, SectionSummary, SectionTitle, StyledActionButton, StyledForm, StyledImage, StyledInput, SubmitArea, Title,
  TitleContainer, WideFormSection,
} from '../AdminInfo/AdminInfo.styles';
import {
  ButtonContainer, FieldHeader, MemberBlock, MemberContainer, MemberInfo, MemberSelect, ProjectDatePicker, StyledSelect, ThumbnailHeader,
  GameDropZone, GameUploadFile,
} from './AdminProjectForm.styles';
import { WhiteNarrowBlock } from '../../../styles/common/Block.styles';
import FileUploadButton from '../../common/Buttons/FileUploadButton';
import Modal from '../../common/Modal/Modal';
import getFileUrl from '../../../lib/utils/getFileUrl';
import { dayjs } from '../../../lib/utils/dayjs';
import throttle from '../../../lib/utils/throttle';
import { uploadGameBuildZip } from '../../../lib/api/gameBuild';

const Member = ({ member, onDeleteMember }) => {
  const confirmRemove = () => AntModal.confirm({
    title: '참여자 제거',
    content: `${member.name} 회원을 참여자 목록에서 정말 제거하시겠습니까?`,
    okText: '제거',
    cancelText: '취소',
    okButtonProps: { danger: true },
    onOk: () => onDeleteMember(member),
  });

  return (
    <MemberBlock>
      <MemberInfo><strong>{member.name}</strong><span>{member.studentID}</span><span>{member.department}</span></MemberInfo>
      <ButtonContainer>
        <ActionButton type="button" aria-label={`${member.name} 참여자 제거`} onClick={confirmRemove}><DeleteOutlined /></ActionButton>
      </ButtonContainer>
    </MemberBlock>
  );
};

const AdminProjectForm = ({ onCreateProject, onSearchMember, onUpdateProject, members, searchMembers, onAddMember, onDeleteMember, project, errorMessage, buttons, errorModalVisible, onCloseErrorModal }) => {
  const editorRef = useRef();
  const gameFileInputRef = useRef();
  const [searchMember, setSearchMember] = useState('');
  const [name, onChangeName] = useInput(project ? project.name : '', notEmptyValidation);
  const [thumbnailURL, setThumbnailURL] = useState(project ? project.thumbnailURL : '');
  const [genre, onChangeGenre] = useInput(project ? project.genre : '', notEmptyValidation);
  const [category, onChangeCategory] = useInput(project ? project.category ?? '' : '', notEmptyValidation);
  const [startDate, setStartDate] = useState(project ? project.startDate ?? '' : '');
  const [endDate, setEndDate] = useState(project ? project.endDate ?? '' : '');
  const [description, onChangeDescription] = useInput(project ? project.description : '', notEmptyValidation);
  const [body, setBody] = useState(project ? project.body : '');
  const [gameURL, setGameURL] = useState(project ? project.gameURL ?? '' : '');
  const [gameUploadState, setGameUploadState] = useState('');
  const [isUploadingGame, setIsUploadingGame] = useState(false);
  const [isGameDragActive, setIsGameDragActive] = useState(false);
  const [selectedGameFile, setSelectedGameFile] = useState(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    const timeoutId = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 100);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => onSearchMember(searchMember.trim()), 250);
    return () => window.clearTimeout(timeoutId);
  }, [onSearchMember, searchMember]);

  const submitProject = throttle((event) => {
    event.preventDefault();
    onCreateProject({ name, genre, category, startDate, endDate, thumbnailURL, description, body, gameURL });
  }, 1000);
  const updateProject = (event) => {
    event.preventDefault();
    onUpdateProject({ name, description, genre, category, startDate, endDate, thumbnailURL, body, gameURL });
  };
  const selectMember = (loginId) => {
    const member = searchMembers.find((item) => item.loginID === loginId);
    if (member) onAddMember(member);
    setSearchMember('');
  };
  const onEditorChange = () => setBody(editorRef.current.getInstance().getMarkdown());
  const uploadGameBuildFile = async (zipFile) => {
    if (!zipFile) return;

    setSelectedGameFile(zipFile);
    setIsUploadingGame(true);
    setGameUploadState('압축을 확인하고 S3에 업로드하는 중입니다. 파일 크기에 따라 시간이 걸릴 수 있습니다.');
    try {
      const uploadedURL = await uploadGameBuildZip(zipFile);
      setGameURL(uploadedURL);
      setGameUploadState('게임 빌드가 업로드되었습니다. 저장하면 프로젝트에 연결됩니다.');
    } catch (error) {
      setGameUploadState(error.response?.data?.message || error.message || '게임 빌드 업로드에 실패했습니다.');
    } finally {
      setIsUploadingGame(false);
    }
  };
  const onGameBuildSelected = async (event) => {
    const [zipFile] = event.target.files ?? [];
    event.target.value = '';
    await uploadGameBuildFile(zipFile);
  };
  const onGameDragOver = (event) => {
    event.preventDefault();
    if (!isUploadingGame) setIsGameDragActive(true);
  };
  const onGameDragLeave = (event) => {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget)) setIsGameDragActive(false);
  };
  const onGameDrop = async (event) => {
    event.preventDefault();
    setIsGameDragActive(false);
    if (isUploadingGame) return;
    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length !== 1) {
      setGameUploadState('ZIP 파일 하나를 선택해 주세요.');
      return;
    }
    await uploadGameBuildFile(files[0]);
  };

  return (
    <>
      <Modal contents={errorMessage} buttons={buttons} visible={errorModalVisible} onConfirm={onCloseErrorModal} onCancel={onCloseErrorModal} />
      <WhiteNarrowBlock>
        <FormContent>
          <TitleContainer><Title>{project ? '프로젝트 수정' : '프로젝트 생성'}</Title></TitleContainer>
          <StyledForm>
            <FormGrid>
              <FormSection>
                <SectionTitle>기본 정보</SectionTitle>
                <Item><label htmlFor="project-name">프로젝트 이름</label><StyledInput id="project-name" value={name} onChange={onChangeName} placeholder="프로젝트 이름" /></Item>
                <Item>
                  <label htmlFor="project-category">카테고리</label>
                  <StyledSelect id="project-category" value={category} onChange={onChangeCategory}>
                    <option value="" disabled>카테고리를 선택하세요</option><option value="WEB_APP">웹앱</option><option value="GAME">게임</option><option value="OTHER">기타</option>
                  </StyledSelect>
                </Item>
                <Item><label htmlFor="project-genre">장르</label><StyledInput id="project-genre" value={genre} onChange={onChangeGenre} placeholder="예: 모바일 게임, 슈팅, 웹" /></Item>
                <Item>
                  <label htmlFor="project-start-date">프로젝트 시작일</label>
                  <ProjectDatePicker id="project-start-date" locale={koKR.DatePicker} format="YYYY년 MM월 DD일" value={startDate ? dayjs(startDate) : null} onChange={(date) => setStartDate(date ? date.format('YYYY-MM-DD') : '')} />
                </Item>
                <Item>
                  <label htmlFor="project-end-date">프로젝트 종료일</label>
                  <ProjectDatePicker id="project-end-date" locale={koKR.DatePicker} format="YYYY년 MM월 DD일" value={endDate ? dayjs(endDate) : null} onChange={(date) => setEndDate(date ? date.format('YYYY-MM-DD') : '')} />
                </Item>
              </FormSection>
              <FormSection>
                <SectionTitle>참여자</SectionTitle>
                <Item>
                  <label htmlFor="member-search">회원 검색</label>
                  <MemberSelect
                    id="member-search"
                    showSearch
                    allowClear
                    filterOption={false}
                    searchValue={searchMember}
                    value={null}
                    placeholder="회원 이름으로 검색"
                    open={searchMember.trim().length > 0}
                    onSearch={setSearchMember}
                    onSelect={selectMember}
                    onClear={() => setSearchMember('')}
                    options={searchMembers.map((member) => ({ value: member.loginID, label: `${member.name} · ${member.studentID} · ${member.department}` }))}
                  />
                </Item>
                <MemberContainer><h4>참여자 목록</h4>{members.length === 0 ? <p>참여자를 추가하세요.</p> : members.map((member) => <Member key={member.loginID} member={member} onDeleteMember={onDeleteMember} />)}</MemberContainer>
              </FormSection>
              <WideFormSection>
                <SectionHeader><SectionTitle>플레이 가능한 게임</SectionTitle></SectionHeader>
                <Item>
                  <GameDropZone
                    htmlFor="game-build-zip"
                    data-active={isGameDragActive}
                    data-disabled={isUploadingGame}
                    onDragEnter={onGameDragOver}
                    onDragOver={onGameDragOver}
                    onDragLeave={onGameDragLeave}
                    onDrop={onGameDrop}
                  >
                    <input ref={gameFileInputRef} id="game-build-zip" type="file" accept=".zip,application/zip" onChange={onGameBuildSelected} disabled={isUploadingGame} />
                    <InboxOutlined aria-hidden="true" />
                    <span className="drop-title">{isGameDragActive ? '여기에 놓아 업로드하세요' : 'ZIP 파일을 여기에 끌어다 놓으세요'}</span>
                    <span className="drop-action">또는 파일 선택</span>
                  </GameDropZone>
                  {selectedGameFile && <GameUploadFile>{selectedGameFile.name}</GameUploadFile>}
                  {gameURL && <GameUploadFile>게임 연결됨 · <a href={gameURL} target="_blank" rel="noreferrer">새 탭에서 열기</a> <button type="button" onClick={() => { setGameURL(''); setSelectedGameFile(null); setGameUploadState('게임 연결을 해제했습니다. 수정 내용을 저장하면 반영됩니다.'); }}>연결 해제</button></GameUploadFile>}
                  {gameUploadState && <p role="status">{gameUploadState}</p>}
                </Item>
              </WideFormSection>
              <WideFormSection>
                <ThumbnailHeader>
                  <SectionHeader><SectionTitle>썸네일 이미지</SectionTitle><SectionSummary>프로젝트 목록 카드에 표시됩니다.</SectionSummary></SectionHeader>
                  <FileUploadButton onSubmit={setThumbnailURL} optimizeCardImage buttonStyle={{ margin: 0 }} />
                </ThumbnailHeader>
                <Item>
                  <ImageContainer data-image-type="location">{thumbnailURL ? <StyledImage src={getFileUrl(thumbnailURL)} alt="프로젝트 썸네일 미리보기" /> : '현재 이미지가 없습니다.'}</ImageContainer>
                </Item>
              </WideFormSection>
              <WideFormSection>
                <SectionTitle>프로젝트 소개</SectionTitle>
                <Item>
                  <FieldHeader><label htmlFor="project-description">설명 요약</label><span>프로젝트 목록에 표시되는 짧은 소개입니다.</span></FieldHeader>
                  <StyledInput id="project-description" value={description} onChange={onChangeDescription} placeholder="공백 포함 30자 이내" />
                </Item>
                <Item><label>프로젝트 내용</label><EditorWrap><Editor initialEditType="wysiwyg" initialValue={body} ref={editorRef} onChange={onEditorChange} /></EditorWrap></Item>
              </WideFormSection>
            </FormGrid>
            <SubmitArea><StyledActionButton disabled={isUploadingGame} onClick={project ? updateProject : submitProject}>{project ? '수정' : '생성'}</StyledActionButton></SubmitArea>
          </StyledForm>
        </FormContent>
      </WhiteNarrowBlock>
    </>
  );
};

export default AdminProjectForm;
