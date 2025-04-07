import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TemplateLiteralLogger } from 'utilities';
import styles from './App.module.css';
import { useAddPost, useDeletePost, useUpdatePost } from './features/posts/postsApi';
import { deletePost as deletePostAction, fetchPosts } from './features/posts/postsSlice';
import { AppDispatch, RootState } from './store';

const logger = TemplateLiteralLogger.createLog({ 
  prefix: `🧐[🪵postsApi] ${new Date().toISOString()}`,
  enabled: true, 
  options: { 
    excludeOutputObject: false, 
    skipPrimitivesIncludedInMessage: false, 
    primitivesAllowedInTemplateString: ['function', 'bigint', 'number', 'string', 'boolean'] 
  } 
}, 'log');

function App() {
  const dispatch = useDispatch<AppDispatch>();
     const { posts, loading, error } = useSelector((state: RootState) => state.posts);

    //  const { data: queryPosts } = useFetchPosts();
     const addPostMutation = useAddPost();
     const updatePostMutation = useUpdatePost();
     const deletePostMutation = useDeletePost();

     const [editingPost, setEditingPost] = useState<{ id: number; title: string; body: string; userId: number } | null>(null);
     const [isLoading, setIsLoading] = useState(false);
     const [loadingButton, setLoadingButton] = useState<string | null>(null);

      useEffect(() => {
        logger`App re-rendered - posts: ${posts.length}, loading: ${loading}, error: ${error}`;
        dispatch(fetchPosts());
      }, [dispatch]);

      const handleAddPost = () => {
        setIsLoading(true);
        setLoadingButton('add');
        const newItem = { title: 'New Item' };
        addPostMutation.mutate(newItem, {
          // onSettled is called regardless of whether the query or mutation was successful or resulted in an error. 
          // It is always called after the request has completed.
          onSettled: () => {
            setIsLoading(false);
            setLoadingButton(null);
          },
        });
      };

      const handleUpdatePost = (id: number, title: string) => {
        setIsLoading(true);
        setLoadingButton(`update-${id}`);
        updatePostMutation.mutate({ id, title }, {
          onSettled: () => {
            setIsLoading(false);
            setLoadingButton(null);
            setEditingPost(null);
          },
        });
      };

      const handleDeletePost = (id: number) => {
        setIsLoading(true);
        setLoadingButton(`delete-${id}`);

        // Optimistically update the UI
        // const previousPosts = posts;
        dispatch(deletePostAction(id));

        deletePostMutation.mutate(id, {
          onSettled: () => {
            setIsLoading(false);
            setLoadingButton(null);
          },
          onError: () => {
            // Revert the change if the mutation fails
            dispatch(fetchPosts());
          },
        });
      };

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error}</p>;


  return (
    <div className={styles.container}>
          <h1 className={styles.title}>Items</h1>
          <button onClick={handleAddPost} className={styles.button} disabled={isLoading}>
            Add Item
            {loadingButton === 'add' && <div className={styles.spinner}></div>}
          </button>
          <ul className={styles.list}>
            {(posts).map((post) => (
              <li key={post.id} className={styles.listItem}>
                {editingPost && editingPost.id === post.id ? (
                  <>
                    <input
                    placeholder='Enter new title'
                      type="text"
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      className={styles.input}
                    />
                    <input
                    placeholder='Enter details'
                      type="text"
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      className={styles.input}
                    />
                    <div className={styles.buttonGroup}>
                      <button onClick={() => handleUpdatePost(post.id, editingPost.title)} className={styles.saveButton} disabled={isLoading}>
                        Save
                        {loadingButton === `update-${post.id}` && <div className={styles.spinner}></div>}
                      </button>
                      <button onClick={() => setEditingPost(null)} className={styles.cancelButton} disabled={isLoading}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {post.title}
                    <div className={styles.buttonGroup}>
                      <button onClick={() => setEditingPost(post)} className={styles.editButton} disabled={isLoading}>
                        Edit
                      </button>
                      <button onClick={() => handleDeletePost(post.id)} className={styles.deleteButton} disabled={isLoading}>
                        Delete
                        {loadingButton === `delete-${post.id}` && <div className={styles.spinner}></div>}
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
  )
}

export default App
