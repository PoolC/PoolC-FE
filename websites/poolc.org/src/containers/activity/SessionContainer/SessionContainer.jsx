import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Session from '../../../components/activity/Session/Session';
import * as activityAPI from '../../../lib/api/activity';

const SessionContainer = ({ activityID, session, host, onDeleteSession }) => {
  const sessionID = session.id;
  const member = useSelector((state) => state.auth);
  const [attendance, setAttendance] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await activityAPI.getActivitySessionAttendances(sessionID);
      setAttendance(response.data.data);
    })();
  }, [sessionID]);

  if (attendance === null) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await activityAPI.deleteActivitySession(sessionID);
      onDeleteSession(sessionID);
      return true;
    } catch (error) {
      alert(error.response?.data?.message || '회차를 삭제하지 못했습니다.');
      return false;
    }
  };

  return <Session session={session} attendance={attendance} memberInfo={member} activityID={activityID} host={host} onDelete={handleDelete} />;
};

export default SessionContainer;
