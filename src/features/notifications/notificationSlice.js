import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance"; // <- use your existing axios instance

// Fetch notifications (expects backend response { total, page, totalPages, notifications })
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/notifications");
      return res.data.notifications || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch" });
    }
  }
);

// Mark a notification read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.put(`/notifications/${id}/read`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to mark read" });
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // for real-time arrival via socket
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      state.unreadCount = state.list.filter((n) => !n.isRead).length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
        s.unreadCount = a.payload.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || "Failed to fetch notifications";
      })
      .addCase(markNotificationAsRead.fulfilled, (s, a) => {
        const updated = a.payload;
        const idx = s.list.findIndex((n) => n._id === updated._id);
        if (idx !== -1) s.list[idx] = updated;
        s.unreadCount = s.list.filter((n) => !n.isRead).length;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
