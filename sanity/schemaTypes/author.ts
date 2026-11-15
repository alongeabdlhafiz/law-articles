import {defineType, defineField} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'institution', title: 'University / Institution', type: 'string'}),
    defineField({
      name: 'interests',
      title: 'Areas of legal interest',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({name: 'bio', type: 'text', rows: 4}),
  ],
})