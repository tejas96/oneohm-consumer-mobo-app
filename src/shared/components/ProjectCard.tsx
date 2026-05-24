import React from 'react';
import { PropertyCard } from './PropertyCard';

export function ProjectCard(props: any) {
  // Map legacy 'proj' prop to new 'property' prop
  const mappedProps = {
    ...props,
    property: props.proj,
  };
  return <PropertyCard {...mappedProps} />;
}
export default ProjectCard;
