import { useParams, useLocation } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ListTable from '@/components/crud/ListTable';

const BasicTable: React.FC = () => {
  const routeParams: { table: string } = useParams();
  const routeLocation: any = useLocation();

  return (
    <PageContainer>
      <ListTable table={routeParams.table} query={routeLocation.query} />
    </PageContainer>
  );
};

export default BasicTable;
