import client from './client';

export const getProjects = (category) => client.get('/project', { params: category ? { category } : undefined });

export const getProject = (projectId) => client.get(`/project/${projectId}`);

export const createProject = ({ name, description, genre, category, startDate, endDate, thumbnailURL, body, gameURL, downloadURL, memberLoginIDs }) =>
  client.post('/project', {
    name,
    description,
    genre,
    category,
    startDate,
    endDate: endDate || null,
    thumbnailURL,
    body,
    gameURL: gameURL || null,
    downloadURL: downloadURL || null,
    memberLoginIDs,
  });

export const updateProject = ({ projectID, name, description, genre, category, startDate, endDate, thumbnailURL, body, gameURL, downloadURL, memberLoginIDs }) =>
  client.put(`/project/${projectID}`, {
    name,
    description,
    genre,
    category,
    startDate,
    endDate: endDate || null,
    thumbnailURL,
    body,
    gameURL: gameURL || null,
    downloadURL: downloadURL || null,
    memberLoginIDs,
  });

export const deleteProject = (projectID) => client.delete(`/project/${projectID}`);

export const getGameBuildUploadTargets = ({ files, entrypoint }) =>
  client.post('/project/game-build/upload-targets', { files, entrypoint });

export const deleteProjectGameBuild = (projectID) => client.delete(`/project/${projectID}/game-build`);

export const deleteUnattachedGameBuild = (gameURL) => {
  const releaseId = gameURL?.match(/\/games\/([0-9a-f-]{36})(?:\/|$)/i)?.[1];
  if (!releaseId) return Promise.reject(new Error('게임 파일 주소에서 빌드 ID를 찾을 수 없습니다.'));
  return client.delete(`/project/game-build/${releaseId}`);
};
