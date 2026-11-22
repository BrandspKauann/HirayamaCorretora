import CrmApp from './crm-app';
import { requireChatGPTUser } from './chatgpt-auth';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await requireChatGPTUser('/');
  return <CrmApp user={{ name: user.displayName, email: user.email }} />;
}
