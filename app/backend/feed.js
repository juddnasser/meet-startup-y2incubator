import { tablesDB } from './appwrite.js';
import { ID } from 'appwrite';

async function createPost(post, userId) {
  try {
    const response = await tablesDB.createRow({
      databaseId: 'main',
      tableId: 'posts',
      rowId: ID.unique(),
      data: {
        title: post.title,
        content: post.content,
        authorId: userId,
      },
    });

    console.log('Post created:', response);
    return response; // return real data
  } catch (error) {
    console.error('Create post error:', error);
    return null;
  }
}

async function deletePost(postID) {
  try {
    const response = await tablesDB.deleteRow({
      databaseId: 'main',
      tableId: 'posts',
      rowId: postID,
    });

    console.log('Post deleted:', response);
    return true;
  } catch (error) {
    console.error('Delete post error:', error);
    return false;
  }
}

export { createPost, deletePost };