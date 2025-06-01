import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import apiClient from '../../api/apiClient';
import { Post } from '../../api/post';
import { addPost as addPostAction, deletePost as deletePostAction, updatePost as updatePostAction } from './postsSlice';

export const useFetchPosts = (): UseQueryResult<Post[], Error> => useQuery({
  queryKey: ['posts'],
  queryFn: async () => {
    const response = await apiClient.get('/posts');
    return response.data;
  },
  staleTime: 5 * 60 * 1000, // TODO: Make this configurable
  refetchOnWindowFocus: true,
  refetchInterval: 30000, // TODO: Make this configurable
  // onSuccess: (data) => {
  //   logger`onSuccess: ${{data}}`
  //   const dispatch = useDispatch();
  //   // dispatch(setPosts(data));
  // }
})

export const useAddPost = (): UseMutationResult<Post, Error, { title: string }> => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (newPost: { title: string }): Promise<Post> => {
      const response = await apiClient.post('/posts', newPost);
      return response.data;
    },
    // This will only be called if the mutation is successful, 
    // different with onSettled with will be called regardless of whether the mutation was successful or not
    onSuccess: (data) => {
      // Invalidate cache, refresh items after creating
      queryClient.invalidateQueries({ queryKey: ['items'] });
      dispatch(addPostAction(data));
    }
  });
};

export const useUpdatePost = (): UseMutationResult<Post, Error, { id: number; title: string }> => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (updatedPost: { id: number; title: string }): Promise<Post> => {
      const response = await apiClient.put(`/posts/${updatedPost.id}`, updatedPost);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      dispatch(updatePostAction(data));
    }
  });
};

export const useDeletePost = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`/posts/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      dispatch(deletePostAction(id));
    }
  });
};