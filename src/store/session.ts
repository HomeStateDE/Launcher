import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { AppThunk } from '.'
import AuthResponse from '../Models/AuthResponse'
import ConfigResponse from '../Models/Config'

export interface SessionState {
  isAuthenticated: boolean
  user?: AuthResponse
  config: ConfigResponse
}

const initialState: SessionState = {
  isAuthenticated: false,
  config: {} as any
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionLoginSuccess(state, { payload }: PayloadAction<AuthResponse>) {
      state.isAuthenticated = true
      state.user = payload
    },
    sessionLogout(state) {
      state.isAuthenticated = false
      state.user = undefined
    },
    fetchConfigSuccess(state, { payload }: PayloadAction<ConfigResponse>) {
      state.config = payload
    },
  },
})

export const {
    sessionLoginSuccess,
    sessionLogout,
    fetchConfigSuccess
} = sessionSlice.actions

export const fetchConfig = (): AppThunk => async (dispatch) => {
  try {
    var result = await axios.get<ConfigResponse>("https://launcher.homestate.eu/config.json");
    console.log(result.data)
    dispatch(fetchConfigSuccess(result.data))
    localStorage.setItem("config", JSON.stringify(result.data));
  } catch (error) {
    var res = localStorage.getItem("config");
    if (res)
      dispatch(fetchConfigSuccess(JSON.parse(res)));
  }
}

export const sessionReducer = sessionSlice.reducer