import client from './client';

export const getProjects = (category) => client.get('/project', { params: category ? { category } : undefined });

export const getProject = (projectId) => client.get(`/project/${projectId}`);

export const createProject = ({ name, description, genre, category, startDate, endDate, thumbnailURL, body, gameURL, memberLoginIDs }) =>
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
    memberLoginIDs,
  });

export const updateProject = ({ projectID, name, description, genre, category, startDate, endDate, thumbnailURL, body, gameURL, memberLoginIDs }) =>
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
    memberLoginIDs,
  });

export const deleteProject = (projectID) => client.delete(`/project/${projectID}`);

export const getGameBuildUploadTargets = ({ files, entrypoint }) =>
  client.post('/project/game-build/upload-targets', { files, entrypoint });
