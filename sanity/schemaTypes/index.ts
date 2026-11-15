import { type SchemaTypeDefinition } from 'sanity'
import {category} from './category'
import {author} from './author'
import {article} from './article'
import {blockContent} from './blockContent'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [article, category, author, blockContent],
}
