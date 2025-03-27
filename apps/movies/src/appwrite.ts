import { Client, Databases, ID, Query } from 'appwrite';

import { TemplateLiteralLogger } from 'utilities';

const logger = TemplateLiteralLogger.createLog({ 
  prefix: '🪵[appwrite-movies-app]:',
  enabled: true, 
  options: { 
    excludeOutputObject: false, 
    skipPrimitivesIncludedInMessage: false, 
    primitivesAllowedInTemplateString: ['function', 'bigint', 'number', 'string', 'boolean'] 
  } 
}, 'log');

const errorLog = TemplateLiteralLogger.createLog({ 
  prefix: '💔[movies-app-error]:',
  enabled: true, 
  options: { 
    excludeOutputObject: false, 
    skipPrimitivesIncludedInMessage: false, 
    primitivesAllowedInTemplateString: ['function', 'bigint', 'number', 'string', 'boolean'] 
  } 
}, 'err');

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_MOVIES_COLLECTION_ID

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const database = new Databases(client)

export const updateSearchCount = async (searchTerm: string, movie: any) => {
  logger`Appwrite initialized`
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('search_term', searchTerm),
    ])
    if (result.documents.length > 0) {
      const document = result.documents[0]
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, document.$id, {
        count: document.count + 1
      })
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        search_term: searchTerm,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        count: 1
      })
    }
  } catch (error: unknown) {
    errorLog`Error updating search count: ${error}`
  }
}

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc('count')
    ])
    return result.documents
  } catch (error: unknown) {
    errorLog`Error getting trending movies: ${error}`
    return []
  }
}
