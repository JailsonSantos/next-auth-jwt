import { setupApiClient } from '../services/api';
import { withSSRAuth } from '../utils/withSRRAuth';

export default function Metrics() {


  return (
    <>
      <div>Métricas</div>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupApiClient(context);
  const response = await apiClient.get('/me');

  console.log(response.data);

  return {
    props: {}
  }
}, {
  permissions: ['metrics.list'],
  roles: ['administrator']
});