import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Dashboard() {
  const [me, setMe] = useState<any>(null);
  const token = localStorage.getItem('mg_access');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMe(data.user);
      } catch (e) {
        setMe({ error: 'No autenticado' });
      }
    })();
  }, [token]);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(me, null, 2)}</pre>
    </div>
  );
}
