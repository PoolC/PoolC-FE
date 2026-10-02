/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActivityResponse } from './ActivityResponse';
import type { Badge } from './Badge';
import type { ProjectResponse } from './ProjectResponse';
export type MemberResponse = {
    badge?: Badge;
    additionalRoles?: Array<string>;
    adminRemarks?: string;
    baseRole?: string;
    department?: string;
    email?: string;
    hostActivities?: Array<ActivityResponse>;
    introduction?: string;
    isActivated?: boolean;
    isAdmin?: boolean;
    isExcepted?: boolean;
    loginID?: string;
    name?: string;
    participantActivities?: Array<ActivityResponse>;
    phoneNumber?: string;
    profileImageURL?: string;
    projects?: Array<ProjectResponse>;
    role?: string;
    studentID?: string;
};
