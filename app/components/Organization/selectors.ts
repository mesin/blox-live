import { State } from './types';

export const getIsLoading = (organizationState: State) => organizationState.isLoading;

export const getIsUpdateLoading = (organizationState: State) => organizationState.isUpdateLoading;

export const getOrganization = (organizationState: State) => organizationState.data;
