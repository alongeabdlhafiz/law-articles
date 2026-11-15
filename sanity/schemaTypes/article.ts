import {defineType, defineField} from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / short description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Alt text'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'publishedAt', type: 'datetime'}),
    defineField({
      name: 'categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({name: 'body', type: 'blockContent'}),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Publication status',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Pending Review', value: 'pending'},
          {title: 'Approved', value: 'approved'},
          {title: 'Published', value: 'published'},
          {title: 'Rejected', value: 'rejected'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'adminFeedback',
      title: 'Admin feedback',
      type: 'text',
      rows: 3,
    }),
    defineField({name: 'seoTitle', type: 'string', validation: (Rule) => Rule.max(60)}),
    defineField({name: 'seoDescription', type: 'text', rows: 2, validation: (Rule) => Rule.max(160)}),
  ],
  preview: {
    select: {title: 'title', author: 'author.name', media: 'coverImage', status: 'status'},
    prepare: ({title, author, media, status}) => ({
      title,
      subtitle: `${status ?? 'draft'} · ${author ?? 'no author'}`,
      media,
    }),
  },
})