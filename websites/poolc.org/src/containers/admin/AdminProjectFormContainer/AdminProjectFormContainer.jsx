import { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import AdminProjectForm from '../../../components/admin/AdminProjectForm/AdminProjectForm';
import * as projectAPI from '../../../lib/api/project';
import * as memberAPI from '../../../lib/api/member';
import { MENU } from '../../../constants/menus';
import ActionButton from '../../../components/common/Buttons/ActionButton';
import { SUCCESS } from '../../../constants/statusCode';
import { useMessage } from '../../../hooks/useMessage';

const getProjectRequestErrorMessage = (error) => {
  const responseData = error.response?.data;
  if (typeof responseData === 'string' && responseData.trim()) return responseData;
  if (typeof responseData?.message === 'string' && responseData.message.trim()) return responseData.message;
  return '오류가 발생했습니다';
};

const getMissingProjectFields = ({ name, category, genre, description, startDate, thumbnailURL, body }) => [
  [name, '프로젝트 이름'],
  [category, '카테고리'],
  [genre, '장르'],
  [description, '설명 요약'],
  [startDate, '프로젝트 시작일'],
  [thumbnailURL, '썸네일 이미지'],
  [body, '프로젝트 내용'],
].filter(([value]) => !String(value ?? '').trim())
  .map(([, label]) => label);

const AdminProjectFormContainer = ({ match, history }) => {
  const message = useMessage();
  const { projectID } = match.params;

  const [members, setMembers] = useState([]);
  const [searchMembers, setSearchMembers] = useState([]);
  const [project, setProject] = useState(null);

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (projectID) {
      (async () => {
        const response = await projectAPI.getProject(projectID);
        setProject(response.data.data);
        setMembers(response.data.data.members);
      })();
    }
  }, [projectID]);

  const onCreateProject = ({ name, thumbnailURL, genre, category, startDate, endDate, description, body, gameURL, downloadURL }) => {
    const missingFields = getMissingProjectFields({ name, category, genre, description, startDate, thumbnailURL, body });
    if (missingFields.length > 0) {
      setErrorMessage(`입력하지 않은 항목: ${missingFields.join(', ')}`);
      onShowErrorModal();
      return;
    }
    projectAPI
      .createProject({
        name,
        genre,
        category,
        startDate,
        endDate,
        thumbnailURL,
        description,
        body,
        gameURL,
        downloadURL,
        memberLoginIDs: members.map((member) => member.loginID),
      })
      .then((res) => {
        if (res.status === SUCCESS.OK) {
          message.success('프로젝트가 생성되었습니다.');
          history.push('/admin/projects');
        }
      })
      .catch((error) => {
        if (error.response?.data?.status === 403) {
          history.push(`/${MENU.FORBIDDEN}`);
        }
        setErrorMessage(getProjectRequestErrorMessage(error));
        onShowErrorModal();
      });
  };

  const onUpdateProject = ({ name, description, genre, category, startDate, endDate, thumbnailURL, body, gameURL, downloadURL }) => {
    const missingFields = getMissingProjectFields({ name, category, genre, description, startDate, thumbnailURL, body });
    if (missingFields.length > 0) {
      setErrorMessage(`입력하지 않은 항목: ${missingFields.join(', ')}`);
      onShowErrorModal();
      return;
    }
    projectAPI
      .updateProject({
        projectID,
        name,
        description,
        genre,
        category,
        startDate,
        endDate,
        thumbnailURL,
        body,
        gameURL,
        downloadURL,
        memberLoginIDs: members.map((member) => member.loginID),
      })
      .then((res) => {
        if (res.status === SUCCESS.OK) {
          message.success('프로젝트가 수정되었습니다.');
          history.push('/admin/projects');
        }
      })
      .catch((error) => {
        if (error.response?.data?.status === 403) {
          history.push(`/${MENU.FORBIDDEN}`);
        }
        setErrorMessage(getProjectRequestErrorMessage(error));
        onShowErrorModal();
      });
  };

  const onSearchMember = useCallback((name) => {
    if (!name) {
      setSearchMembers([]);
      return;
    }

    memberAPI.searchMember({ name }).then((res) => {
      if (res.status === SUCCESS.OK) {
        setSearchMembers(res.data.data);
      }
    });
  }, []);

  const onAddMember = useCallback((member) => {
    setMembers((currentMembers) => currentMembers.some((item) => item.loginID === member.loginID) ? currentMembers : [...currentMembers, member]);
  }, []);

  const onDeleteMember = useCallback((member) => {
    setMembers((currentMembers) => currentMembers.filter((item) => item.loginID !== member.loginID));
  }, []);

  const onShowErrorModal = () => {
    setErrorModalVisible(true);
  };

  const onCloseErrorModal = (e) => {
    e.preventDefault();
    setErrorModalVisible(false);
  };

  const buttons = <ActionButton onClick={onCloseErrorModal}>확인</ActionButton>;

  if (projectID && project === null) {
    return null;
  }

  return (
    <AdminProjectForm
      onCreateProject={onCreateProject}
      onSearchMember={onSearchMember}
      onUpdateProject={onUpdateProject}
      members={members}
      searchMembers={searchMembers}
      onAddMember={onAddMember}
      onDeleteMember={onDeleteMember}
      project={project}
      errorMessage={errorMessage}
      buttons={buttons}
      errorModalVisible={errorModalVisible}
      onCloseErrorModal={onCloseErrorModal}
    />
  );
};

export default withRouter(AdminProjectFormContainer);
