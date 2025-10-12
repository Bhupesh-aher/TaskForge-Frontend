import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchLists, createList } from "../features/lists/listSlice";
import { fetchCards, createCard } from "../features/cards/cardSlice";
import { socket } from "../socket";
import { addBoardMember } from "../features/boards/boardSlice";
import { fetchBoardById } from "../features/boards/boardSlice";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { addCard, setCardsForList } from "../features/cards/cardSlice";
import { motion } from "framer-motion";
import API from "../api/axiosInstance";







export default function BoardDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { lists } = useSelector((s) => s.lists);
  const { cardsByList } = useSelector((s) => s.cards);
  const [newList, setNewList] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const { loading } = useSelector((s) => s.boards);
  const { currentBoard } = useSelector((s) => s.boards);



  useEffect(() => { 
      dispatch(fetchBoardById(id));
      dispatch(fetchLists(id));
      // 🔌 Connect to board room
      socket.emit("joinBoard", id);

      // Cleanup on unmount
      return () => socket.emit("leaveBoard", id); 
    }, [dispatch, id]);

    // ✅ When lists are fetched, get cards for each list
      useEffect(() => {
        if (lists && lists.length > 0) {
          lists.forEach((list) => {
            dispatch(fetchCards(list._id));
          });
        }
      }, [lists, dispatch]);



    useEffect(() => {
        // 🧩 When a new list is created in this board (by any user)
        socket.on("listCreated", (newList) => {
            dispatch({ type: "lists/addList", payload: newList });
        });

        // 🧩 When a new card is created in any list
        socket.on("cardCreated", ({ listId, card }) => {
            dispatch({
            type: "cards/addCard",
            payload: { listId, card },
            });
        });

        // ✅ Clean up event listeners when component unmounts
        return () => {
            socket.off("listCreated");
            socket.off("cardCreated");
        };
        }, [dispatch]);


    const handleInvite = async (e) => {
          e.preventDefault();
          if (!inviteEmail.trim()) return;
          await dispatch(addBoardMember({ boardId: id, email: inviteEmail }));
          setInviteEmail("");
    };

      const handleCreateList = async (e) => {
        e.preventDefault();
        if (!newList.trim()) return;
        await dispatch(createList({ boardId: id, title: newList }));
        setNewList("");
      };

      const handleCreateCard = async (listId, title) => {
        if (!title.trim()) return;
        await dispatch(createCard({ listId, title, boardId: id }));
      };

      const handleDragEnd = async (result) => {
          const { destination, source, draggableId } = result;

          if (!destination) return; // Dropped outside any list
          if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
          )
            return; // No position change

          // Prepare source/target list arrays
          const sourceListId = source.droppableId;
          const destListId = destination.droppableId;
          const draggedCard = cardsByList[sourceListId][source.index];

          // Update Redux optimistically
          const updatedSource = [...cardsByList[sourceListId]];
          updatedSource.splice(source.index, 1);

          const updatedDest =
            sourceListId === destListId
              ? updatedSource
              : [...(cardsByList[destListId] || [])];

          if (sourceListId === destListId) {
            updatedDest.splice(destination.index, 0, draggedCard);
            dispatch({
              type: "cards/setCardsForList",
              payload: { listId: destListId, cards: updatedDest },
            });
          } else {
            updatedDest.splice(destination.index, 0, draggedCard);
            dispatch({
              type: "cards/setCardsForList",
              payload: { listId: sourceListId, cards: updatedSource },
            });
            dispatch({
              type: "cards/setCardsForList",
              payload: { listId: destListId, cards: updatedDest },
            });
          }

          // Persist move to backend
          try {
            console.log("Persisting move:", { draggableId, destListId, position: destination.index });
 
            const res = await API.patch(`/cards/${draggableId}/move`, {
              destinationListId: destListId,
              position: destination.index,
            });
            // console.log("Move persisted:", res.data);
          } catch (error) {
            console.error("Failed to persist move:",  error);
          }
        };


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center md:text-left">  {currentBoard ? currentBoard.title : "Loading..."}</h1>
        {!loading && lists.length === 0 && (
          <div className="text-center text-gray-500 mb-6">
            <p>No lists yet — start by creating one!</p>
          </div>
        )}

      {/*  Invite Member Section —  UI */}
      <form onSubmit={handleInvite} className="flex gap-2 mb-6">
        <input
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="Invite member by email"
          className="border p-2 rounded w-64"
        />
        <button
          type="submit"
            disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Inviting..." : "Invite"}
        </button>
      </form>


      <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-6 overflow-x-auto">
            {loading ? (
              <>
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </>
            ) : (
              lists.map((list) => (
                <Droppable droppableId={list._id} key={list._id}>
                  {(provided) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white shadow rounded-lg p-4 min-w-[250px]"
                    >
                      <h2 className="font-semibold text-gray-700 mb-3">{list.title}</h2>
                      <div className="space-y-3">
                        {(cardsByList[list._id] || []).map((card, index) => (
                          <Draggable
                            key={card._id}
                            draggableId={card._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-gray-100 p-2 rounded text-sm hover:shadow-md hover:scale-[1.01] transition-transform duration-150"
                              >
                                {card.title}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                      <AddCardForm onAdd={(title) => handleCreateCard(list._id, title)} />
                    </motion.div>
                  )}
                </Droppable>
              ))
            )}

            {/* Create List */}
            {!loading && (
              <form
                onSubmit={handleCreateList}
                className="bg-indigo-50 p-4 rounded-lg min-w-[250px]"
              >
                <input
                  type="text"
                  placeholder="New list title"
                  value={newList}
                  onChange={(e) => setNewList(e.target.value)}
                  className="w-full border px-3 py-2 rounded mb-3 focus:outline-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                >
                  + Add List
                </button>
              </form>
            )}
          </div>
        </DragDropContext>
    </div>
  );
}

function AddCardForm({ onAdd }) {
  const [title, setTitle] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(title);
        setTitle("");
      }}
      className="mt-4"
    >
      <input
        type="text"
        placeholder="Add card..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-3 py-1 rounded text-sm focus:outline-indigo-500"
      />
    </form>
  );
}
