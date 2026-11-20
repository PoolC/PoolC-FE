import { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import AdminProjectForm from '../../../components/admin/AdminProjectForm/AdminProjectForm';
import * as projectAPI from '../../../lib/api/project';
import * as memberAPI from '../../../lib/api/member';
import { MENU } from '../../../constants/menus';
import ActionButton from '../../../components/common/Buttons/ActionButton';
import { SUCCESS } from '../../../constants/statusCode';
import { useMessage } from '../../../hooks/useMessage';

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

  const onCreateProject = ({ name, thumbnailURL, genre, category, startDate, endDate, description, body, gameURL }) => {
    if (!name || !category || !description || !startDate || !thumbnailURL || !body) {
      setErrorMessage('모든 항목을 입력하세요');
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
        setErrorMessage('오류가 발생했습니다');
        onShowErrorModal();
      });
  };

  const onUpdateProject = ({ name, description, genre, category, startDate, endDate, thumbnailURL, body, gameURL }) => {
    if (!name || !category || !description || !startDate || !thumbnailURL || !body) {
      setErrorMessage('모든 항목을 입력하세요');
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
        setErrorMessage('오류가 발생했습니다');
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
