import React from 'react';
import { MyProperties } from './MyProperties';

export function MyProjects(props: any) {
  // Map legacy 'projects' prop to new 'properties' prop
  const mappedProps = {
    ...props,
    properties: props.projects || [],
    selectedPropertyId: props.selectedProjectId,
    onSwitch: (id: string, name: string) => props.onSwitch(id, name),
  };
  return <MyProperties {...mappedProps} />;
}
export default MyProjects;
