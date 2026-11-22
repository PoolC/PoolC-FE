/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type NotificationResponse = {
    causedById?: number;
    createdAt?: string;
    notificationId?: number;
    notificationType?: 'BADGE' | 'COMMENT' | 'MESSAGE' | 'POST' | 'POKEMON_REWARD' | 'BALL_REWARD';
    readStatus?: boolean;
    rewardName?: string;
    rewardImageUrl?: string;
    rewardBallType?: 'NORMAL' | 'MASTER';
    rewardAmount?: number;
    rewardShiny?: boolean;
    rewardReason?: string;
};

