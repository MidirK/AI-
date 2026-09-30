import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <EmptyState
      title="페이지를 찾을 수 없어요"
      description="주소를 다시 확인하거나 홈으로 돌아가주세요."
      action={{ label: '홈으로 가기', onClick: () => navigate('/') }}
    />
  );
}
