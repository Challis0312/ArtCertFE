import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import staticBreadcrumbs from "../config/breadcrumbsConfig";
import { profileApi, registryApi, marketplaceApi } from "../services/api";

/**************************************************************************************************/

/**
 * @file        breadcrumbs.jsx
 * @description Breadcrumb navigation component
 *
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Chi-Yuan Yang, David Relacion]
 * @created     xx/08/2025
 * @license     -- tbd
 */

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x !== '');

  // Cache of resolved labels per absolute path ("to").
  const [dynamicLabels, setDynamicLabels] = useState({});

  // Heuristic: UUID-like or long hex-ish IDs with dashes
  const isLikelyId = (segment) => {
    return /[0-9a-fA-F-]{16,}/.test(segment);
  };

  const getContextForIndex = (segments, index) => {
    const prev = segments[index - 1];
    const prev2 = segments[index - 2];

    // Artist contexts
    if (prev === 'public' || prev === 'artist' || prev2 === 'artist') return 'artist';
    
    // Default to artwork for IDs under marketplace/all, registry, or at end
    if (prev === 'all' || prev === 'registry' || segments.includes('registry')) return 'artwork';
    
    // Fallback
    return 'artwork';
  };

  const resolveArtworkLabel = async (artworkId) => {
    try {
      const data = await registryApi.getById(artworkId);
      
      // Try common title fields across backends
      const label = data?.title || data?.artworkName || data?.artwork_name || data?.name;
      if (label) return label;
    } catch (_) {}
    try {
      const data = await marketplaceApi.getByArtworkId(artworkId);
      const label = data?.title || data?.artworkName || data?.artwork_name || data?.name;
      if (label) return label;
    } catch (_) {}
    return null;
  };

  const resolveArtistLabel = async (artistId) => {
    try {
      const data = await profileApi.get(artistId);
      const first = data?.firstName || data?.first_name;
      const last = data?.lastName || data?.last_name;
      const name = [first, last].filter(Boolean).join(' ');
      if (name) return name;
    } catch (_) {}
    return null;
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const updates = {};
      for (let i = 0; i < pathnames.length; i++) {
        const value = pathnames[i];
        if (!isLikelyId(value)) continue;
        const to = `/${pathnames.slice(0, i + 1).join('/')}`;
        if (dynamicLabels[to]) continue; // already resolved/cached
        const context = getContextForIndex(pathnames, i);
        let label = null;
        if (context === 'artist') {
          label = await resolveArtistLabel(value);
        } else {
          label = await resolveArtworkLabel(value);
        }
        if (!cancelled && label) {
          updates[to] = label;
        }
      }
      if (!cancelled && Object.keys(updates).length) {
        setDynamicLabels((prev) => ({ ...prev, ...updates }));
      }
    };
    run();
    return () => {
      cancelled = true;
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <ul className="flex space-x-4 font-sans">
        <li key={'home'} className="flex space-x-4">
          <Link to="/">
            <span className="text-heading">Home</span>
          </Link>
          <span className="text-heading">{'\u2022'}</span>
        </li>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          // Decode URL params (e.g. %20 → space, dashes → spaces)
          const decodedValue = decodeURIComponent(value).replace(/-/g, ' ');
          
          // Build absolute path for this segment
          const toPath = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Use static config if available, then dynamic resolved labels, otherwise decoded string
          const breadcrumb = staticBreadcrumbs[value] || dynamicLabels[toPath] || decodedValue;

          return (
            <li key={to} className="flex space-x-4">
              {isLast ? (
                <span className="text-body-text">{breadcrumb}</span>
              ) : (
                <>
                  <Link to={to}>
                    <span className="text-heading">{breadcrumb}</span>
                  </Link>
                  <span className="text-heading">{'\u2022'}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Breadcrumbs;