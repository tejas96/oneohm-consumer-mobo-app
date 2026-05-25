export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  milestones: (projectId: string) =>
    [...propertyKeys.all, 'milestones', projectId] as const,
};

// Maintain compatibility alias if needed, or we can just update all references
export const projectKeys = propertyKeys;
