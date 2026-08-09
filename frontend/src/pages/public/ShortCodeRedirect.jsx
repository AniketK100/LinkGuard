import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

export function ShortCodeRedirect() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!shortCode) return;

    let isMounted = true;
    const resolveRedirect = async () => {
      try {
        // First try fetching metadata / API redirect
        const response = await api.get(`/api/v1/redirects/${shortCode}`);
        const data = response.data?.data;

        if (data?.passwordProtected) {
          if (isMounted) navigate(`/${shortCode}/verify`, { replace: true });
          return;
        }

        if (data?.originalUrl) {
          window.location.replace(data.originalUrl);
          return;
        }

        // Fallback to direct backend redirect URL
        const backendBase = import.meta.env.VITE_API_BASE_URL || '';
        window.location.replace(`${backendBase}/${shortCode}`);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.data?.data?.passwordRequired) {
          if (isMounted) navigate(`/${shortCode}/verify`, { replace: true });
          return;
        }
        if (isMounted) setError(true);
      }
    };

    resolveRedirect();

    return () => { isMounted = false; };
  }, [shortCode, navigate]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
        <h1 className="text-3xl font-extrabold text-text-primary">404 - Link Not Found</h1>
        <p className="text-sm text-text-secondary max-w-md">
          The short link you are trying to access does not exist, has expired, or was disabled by the owner.
        </p>
        <a href="/" className="px-6 py-2.5 bg-text-primary text-canvas rounded-full font-bold text-xs uppercase tracking-wider">
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-semibold text-text-secondary">Redirecting to destination…</p>
    </div>
  );
}

export default ShortCodeRedirect;
