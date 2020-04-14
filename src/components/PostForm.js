import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm({ addPost }) {
  const [error, setError] = useState('');
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: '',
  });
  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      setError('');
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = '';
      addPost(result.data.createPost);
    },
    onError(err) {
      setError(err.graphQLErrors[0].message);
    },
  });
  function createPostCallback() {
    createPost();
  }
  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <Form.Input
            type='text'
            name='body'
            placeholder='Hi World!'
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type='submit' color='teal'>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className='ui error message' style={{ marginBottom: 15 }}>
          <ul className='list'>
            <li>{error}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

export default PostForm;
