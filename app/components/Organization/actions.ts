import * as actionTypes from './actionTypes';

export const setOrganizationName = (organizationName: string) => ({
  type: actionTypes.SET_ORGANIZATION_NAME,
  payload: organizationName,
});

export const loadOrganization = () => ({ type: actionTypes.LOAD_ORGANIZATION });

export const loadOrganizationSuccess = (organization: Record<string, any>) => ({
  type: actionTypes.LOAD_ORGANIZATION_SUCCESS,
  payload: { ...organization },
});

export const loadOrganizationFailure = (error: Record<string, any>) => ({
  type: actionTypes.LOAD_ORGANIZATION_FAILURE,
  payload: { ...error },
});

export const updateOrganization = (orgName: string) => ({
  type: actionTypes.UPDATE_ORGANIZATION,
  payload: orgName,
});

export const updateOrganizationSuccess = (
  organization: Record<string, any>
) => ({
  type: actionTypes.UPDATE_ORGANIZATION_SUCCESS,
  payload: { ...organization },
});

export const updateOrganizationFailure = (error: Record<string, any>) => ({
  type: actionTypes.UPDATE_ORGANIZATION_FAILURE,
  payload: { ...error },
});
