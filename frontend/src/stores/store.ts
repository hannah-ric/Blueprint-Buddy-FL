import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';
import openAiSlice from './openAiSlice';

import usersSlice from './users/usersSlice';
import build_plansSlice from './build_plans/build_plansSlice';
import componentsSlice from './components/componentsSlice';
import hardware_fastenersSlice from './hardware_fasteners/hardware_fastenersSlice';
import joinery_methodsSlice from './joinery_methods/joinery_methodsSlice';
import materialsSlice from './materials/materialsSlice';
import rolesSlice from './roles/rolesSlice';
import permissionsSlice from './permissions/permissionsSlice';
import workshopSlice from './workshop/workshopSlice';

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,
    openAi: openAiSlice,

    users: usersSlice,
    build_plans: build_plansSlice,
    components: componentsSlice,
    hardware_fasteners: hardware_fastenersSlice,
    joinery_methods: joinery_methodsSlice,
    materials: materialsSlice,
    roles: rolesSlice,
    permissions: permissionsSlice,
    workshop: workshopSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
