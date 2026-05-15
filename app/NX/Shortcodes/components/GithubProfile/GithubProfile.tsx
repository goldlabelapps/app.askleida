'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import {
  Typography,
  Paper,
  
  LinearProgress,
  Alert,
} from '@mui/material';
import { Icon, navigateTo } from '../../../DesignSystem';
import { useDispatch } from '../../../Uberedux';
import { useProfile, init } from '../GithubProfile'

export default function GithubProfile({
  username = '',
}: {
    username?: string;
}) {

  const dispatch = useDispatch();
  const router = useRouter();
  const profile = useProfile();
  const {fetching, error} = profile || {};

  React.useEffect(() => {
    if (!profile?.initted) {
      dispatch(init(username));
    }
  }, [profile?.initted, dispatch, username]);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        @{username}
      </Typography>
      {fetching && (
        <LinearProgress sx={{ mb: 2 }} />
      )}
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : 'An error occurred while fetching the profile.'}
        </Alert>
      )}


      <RichTreeView
        aria-label="github-repos-tree"
        items={buildReposTreeItems(profile?.response)}
        sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}
      />

      {/* <pre>
        {JSON.stringify(profile, null, 2)}
      </pre> */}
    </Paper>
  );
// Helper to map only the repos to RichTreeView items
function buildReposTreeItems(response: any) {
  if (!response || !response.github_repos) return [];
  return [
    {
      id: 'repos',
      label: `Repos (${response.github_repos.count})`,
      children: response.github_repos.rows.map((repo: any) => ({
        id: `repo-${repo.id}`,
        label: repo.name,
        children: [
          { id: `repo-${repo.id}-desc`, label: `Description: ${repo.payload?.description ?? ''}` },
          { id: `repo-${repo.id}-lang`, label: `Language: ${repo.language ?? ''}` },
          { id: `repo-${repo.id}-stars`, label: `Stars: ${repo.stargazers_count ?? 0}` },
          { id: `repo-${repo.id}-forks`, label: `Forks: ${repo.forks_count ?? 0}` },
          { id: `repo-${repo.id}-url`, label: repo.html_url },
        ],
      })),
    },
  ];
}
}

