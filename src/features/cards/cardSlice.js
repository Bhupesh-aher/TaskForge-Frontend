import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance";

// Get cards by list
export const fetchCards = createAsyncThunk(
  "cards/fetchCards",
  async (listId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/cards/list/${listId}`);
      return { listId, cards: res.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Create card
export const createCard = createAsyncThunk(
  "cards/createCard",
  async ({ listId, title }, { rejectWithValue }) => {
    try {
      const res = await API.post("/cards", { listId, title });
      return { listId, card: res.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const cardSlice = createSlice({
  name: "cards",
  initialState: { cardsByList: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.fulfilled, (s, a) => {
        s.cardsByList[a.payload.listId] = a.payload.cards;
      })
      .addCase(createCard.fulfilled, (s, a) => {
        s.cardsByList[a.payload.listId].push(a.payload.card);
      });
  },
});

export default cardSlice.reducer;
