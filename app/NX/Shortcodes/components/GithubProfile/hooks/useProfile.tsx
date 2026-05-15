"use client";
import { useSelector } from 'react-redux';

export function useProfile() {
  const slice = useSelector((state: any) => state.redux.githubProfile);
  return slice ?? null;
}
