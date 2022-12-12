import { createSelector } from 'reselect';

const getState = state => state;

export const getHomeItems = createSelector(getState, state => state.homeItems);
export const getLists = createSelector(getState, state => state.lists);
export const getNotifications = createSelector(getState, state => state.notifications);
export const getTransactions = createSelector(getState, state => state.transactions);
export const getSettings = createSelector(getState, state => state.settings);
export const getPlatform = createSelector(getState, state => state.platform);
export const getRouter = createSelector(getState, state => state.router);
export const getLanguage = createSelector(getState, state => state.settings.language);
export const getAccount = createSelector(getState, state => state.account);
export const getIsDarkTheme = createSelector(getState, state => state.settings.darkTheme);
