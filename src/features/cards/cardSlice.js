import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";


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
  reducers: {
     addCard: (state, action) => {
      const { listId, card } = action.payload;
      if (!state.cardsByList[listId]) state.cardsByList[listId] = [];
      state.cardsByList[listId].push(card);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.fulfilled, (s, a) => {
        s.cardsByList[a.payload.listId] = a.payload.cards;
      })
      .addCase(createCard.fulfilled, (s, a) => {
          const { listId, card } = a.payload;
          if (!s.cardsByList[listId]) s.cardsByList[listId] = [];
          s.cardsByList[listId].push(card);
          toast.success("✅ Card added successfully!");
        })
        .addCase(createCard.rejected, (s, a) => {
          toast.error(a.payload?.message || "❌ Failed to add card");
        });
  },
});

export default cardSlice.reducer;
