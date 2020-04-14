import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  const addPost = (post) => {
    setPosts([post, ...posts]);
  };
  const deletePost = (postId) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };
  useEffect(() => {
    if (data) setPosts(data.getPosts);
  }, [data]);

  return (
    <Grid>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column mobile='16' computer='8' style={{ marginBottom: 10 }}>
            <PostForm addPost={addPost} />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading posts..</h1>
        ) : (
          <Transition.Group>
            {posts &&
              posts.map((post) => (
                <Grid.Column
                  mobile='16'
                  computer='8'
                  key={post.id}
                  style={{ marginBottom: 20 }}
                >
                  <PostCard post={post} deletePost={deletePost} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
