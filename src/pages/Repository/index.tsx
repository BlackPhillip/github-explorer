import React, { useState, useEffect } from 'react';
import { useRouteMatch, Link } from 'react-router-dom'; // com esse objeto eu tenho os parâmetros da minha rota
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Header, RepositoryInfo, Issues } from './styles';
import githubSmallLogo from '../../assets/images/githubSmallLogo.svg';
import api from '../../services/api';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  id: string;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();

  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  // Não podemos usar async dentro do useEffect
  useEffect(() => {
    // As duas chamadas serão realizadas paralemamente
    api.get(`/repos/${params.repository}`).then((response) => {
      setRepository(response.data);
    });

    api.get(`/repos/${params.repository}/issues`).then((response) => {
      setIssues(response.data);
    });

    // aqui vamos reproduzir o mesmo efeito de chamada em paralelo porém usando async - await
    async function loadData() {
      // Assim isses só vai ser executada apenas depois do repository.
      // Mas temos um problema, a requisição da issue não depende de repository, portanto elas devem ser executadas em paralelo
      // const repository = await api.get(`/repos/${params.repository}`);
      // const issues = await api.get(`/repos/${params.repository}/issues`);
      // assim teremos o mesmo efeito de paralelismo
      // Podemos pegar o retorno de cada recusicao por meio do index do array
      // const [repository, issues] = await Promise.all([
      //   api.get(`/repos/${params.repository}`),
      //   api.get(`/repos/${params.repository}/issues`),
      // ]);
      // promise.race()
      // Podemos usar o Promise.race() para retornar a requisição que responder primeiro.
      // USO: Podemos utilizar esse método em busca de cep na qual podemos ter diferentes serviços, aquele que responder primeiro ganha.
    }

    loadData();
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={githubSmallLogo} alt="Github Exploter" />
        <Link to="/">
          <FiChevronLeft />
          Voltar
        </Link>
      </Header>
      {repository && (
        <RepositoryInfo>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Starts</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}
      <Issues>
        {issues.map((issue) => (
          <a key={issue.id} href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={20}> </FiChevronRight>
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
