import { api } from '../services/apiClient';
import { useContext, useEffect } from 'react';
import { setupApiClient } from '../services/api';
import { withSSRAuth } from '../utils/withSRRAuth';
import { AuthContext } from "../contexts/AuthContext";

import { useCan } from '../hooks/useCan';
import { Can } from '../components/Can';

export default function Dashboard() {

  const { user, signOut } = useContext(AuthContext);

  useEffect(() => {
    api.get('/me')
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }, [])

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>

      <button onClick={signOut}>Sing Out</button>

      <Can permissions={["metrics.list"]}>
        <div>Métricas</div>
      </Can>
    </>
  )
}

// Redirecionamento quando o usuário nao esta autenticado,
// como a verificação é feita no lado serivor, o component nem é renderizado
export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);
  const response = await apiClient.get('/me');

  console.log(response.data);

  return {
    props: {}
  }
})