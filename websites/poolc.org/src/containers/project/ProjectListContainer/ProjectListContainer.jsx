import { useEffect, useMemo, useState } from 'react';
import ProjectList from '../../../components/projects/ProjectList/ProjectList';
import * as projectAPI from '../../../lib/api/project';

const ProjectListContainer = () => {
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await projectAPI.getProjects();
      setProjects(response.data.data);
      setLoading(false);
    })();
  }, []);

  const categoryProjects = useMemo(() => {
    const filteredProjects = category === 'ALL'
      ? projects
      : projects?.filter((project) => project.category === category);

    if (category !== 'GAME' || !filteredProjects) return filteredProjects;

    return [...filteredProjects].sort((first, second) => Number(Boolean(second.gameURL)) - Number(Boolean(first.gameURL)));
  }, [category, projects]);

  return <ProjectList projects={categoryProjects} loading={loading} category={category} onCategoryChange={setCategory} />;
};

export default ProjectListContainer;
