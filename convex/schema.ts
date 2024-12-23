import { defineSchema, defineTable } from 'convex/server';
import { type Infer, v } from 'convex/values';

const schema = defineSchema({
	repositories: defineTable({
		id: v.string(),
		name: v.string(),
	}).index('id', ['id']),
});
export default schema;

const repository = schema.tables.repositories.validator;

export const updateRepositorySchema = v.object({
	id: repository.fields.id,
	name: v.optional(repository.fields.name),
	color: v.optional(v.string()),
});

export const deleteRepositorySchema = v.object({
	id: repository.fields.id,
});

export type Repository = Infer<typeof repository>;
