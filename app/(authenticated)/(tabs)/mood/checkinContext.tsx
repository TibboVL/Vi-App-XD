import { CompactUserActivityListItem } from "@/types/userActivityList";
import React, { createContext, useContext, useReducer } from "react";

export enum ReviewStage {
  BEFORE = "BEFORE",
  AFTER = "AFTER",
}
export interface UserActivityComment {
  comment: any;
}
interface CheckinContextProps {
  userActivityId: number | null;
  compactUserActivityListItem: CompactUserActivityListItem | null;
  reviewStage: ReviewStage | null;
  moodBefore: number | null;
  moodAfter: number | null;
  energyBefore: number | null;
  energyAfter: number | null;
  comments: UserActivityComment | null;
  isOnboarding: boolean | null;
}
const initialState: CheckinContextProps = {
  userActivityId: null,
  compactUserActivityListItem: null,
  reviewStage: null,
  moodBefore: null,
  moodAfter: null,
  energyBefore: null,
  energyAfter: null,
  comments: null,
  isOnboarding: null,
};

export enum CheckinContextAction {
  SET_USER_ACTIVITY = "SET_USER_ACTIVITY",
  SET_MOOD_BEFORE = "SET_MOOD_BEFORE",
  SET_MOOD_AFTER = "SET_MOOD_AFTER",
  SET_ENERGY_BEFORE = "SET_ENERGY_BEFORE",
  SET_ENERGY_AFTER = "SET_ENERGY_AFTER",
  SET_REVIEW_STAGE = "SET_REVIEW_STAGE",
  SET_ONBOARDING = "SET_ONBOARDING",
}
export interface CheckinContextPayload {
  action: CheckinContextAction;
  payload: any;
}

function reducer(state: CheckinContextProps, action: CheckinContextPayload) {
  switch (action.action) {
    case CheckinContextAction.SET_USER_ACTIVITY:
      return {
        ...state,
        userActivityId: action.payload.userActivityId,
        compactUserActivityListItem: action.payload.compactUserActivityListItem,
        moodBefore: null,
        moodAfter: null,
        energyBefore: null,
        energyAfter: null,
        comments: null,
        reviewStage:
          action.payload.userActivityId != null ? ReviewStage.BEFORE : null,
      } as CheckinContextProps;
    case CheckinContextAction.SET_MOOD_BEFORE:
      return {
        ...state,
        moodBefore: action.payload,
      } as CheckinContextProps;
    case CheckinContextAction.SET_MOOD_AFTER:
      return {
        ...state,
        moodAfter: action.payload,
      } as CheckinContextProps;
    case CheckinContextAction.SET_ENERGY_BEFORE:
      return {
        ...state,
        energyBefore: action.payload,
      } as CheckinContextProps;
    case CheckinContextAction.SET_ENERGY_AFTER:
      return {
        ...state,
        energyAfter: action.payload,
      } as CheckinContextProps;
    case CheckinContextAction.SET_ONBOARDING:
      return {
        ...state,
        isOnboarding: action.payload,
      } as CheckinContextProps;
    case CheckinContextAction.SET_REVIEW_STAGE:
      return { ...state, reviewStage: action.payload } as CheckinContextProps;
    default:
      return state;
  }
}

const CheckinStateContext = createContext<CheckinContextProps | undefined>(
  undefined
);
const CheckinDispatchContext = createContext<
  React.Dispatch<CheckinContextPayload> | undefined
>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export const CheckinProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CheckinStateContext.Provider value={state}>
      <CheckinDispatchContext.Provider value={dispatch}>
        {children}
      </CheckinDispatchContext.Provider>
    </CheckinStateContext.Provider>
  );
};

export const useCheckinState = () => {
  const context = useContext(CheckinStateContext);
  if (!context) throw new Error("useAppState must be used within AppProvider");
  return context;
};

export const useCheckinDispatch = () => {
  const context = useContext(CheckinDispatchContext);
  if (!context)
    throw new Error("useAppDispatch must be used within AppProvider");
  return context;
};
