import React, { useState } from "react";
import DraggableItem from "./DraggableItem";
import styled from "@emotion/styled";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const ItemList = styled.div`
  height: 400px;
  flex-grow: 1;
  transition: background-color 0.2s ease;
  overflow: scroll;

  ${(props) => (props.isDraggingOver ? `background-color: 'black'` : "")};
`;

const Container = styled.div`
  width: 300px;
  margin: 8px;
  border: 1px solid gray;
  padding: 8px;
`;
function DraggableList() {
  const [listData, setListData] = useState([
    {
      listId: "list1",
      listName: "List 1",
      items: [
        { id: "item1", content: "Item 1" },
        { id: "item2", content: "Item 2" },
        { id: "item3", content: "Item 3" },
        { id: "item4", content: "Item 4" },
        { id: "item5", content: "Item 5" },
        { id: "item6", content: "Item 6" },
      ],
    },
    {
      listId: "list2",
      listName: "List 2",
      items: [],
    },
  ]);

  const [multiDragActive, setMultiDragActive] = useState(false);
  const [dragged, setDragged] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItemSelection = (item, isCtrlKey) => {
    const isSelected = selectedItems.includes(item);

    if (isCtrlKey) {
      // Toggle selection without clearing other selections
      setSelectedItems((prevSelected) =>
        isSelected
          ? prevSelected.filter((selectedItem) => selectedItem.id !== item.id)
          : [...prevSelected, item]
      );
    } else {
      // Clear previous selections and select the current Item
      setSelectedItems(isSelected ? [] : [item]);
    }
  };

  const onDragStart = (start) => {
    if (
      selectedItems.length <= 1 ||
      !selectedItems.filter(
        (selectedItem) => selectedItem.id === start.draggableId
      ).length
    ) {
      setMultiDragActive(false);
      setSelectedItems([]);
    } else {
      setMultiDragActive(true);
      setDragged({ id: start.draggableId, count: selectedItems.length });
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside a valid droppable area or dropped back into its original position
    if (!destination || source.droppableId === destination.droppableId) {
      setMultiDragActive(false);
      return;
    }
    // Move Item between lists
    if (source.droppableId !== destination.droppableId) {
      let sourceList =
        source.droppableId === listData[0].listId
          ? [...listData[0].items]
          : [...listData[1].items];
      let destinationList =
        destination.droppableId === listData[0].listId
          ? [...listData[0].items]
          : [...listData[1].items];

      if (selectedItems.length > 1) {
        //drag with multiselect

        let ids = selectedItems.map((item) => item.id);
        sourceList = sourceList.filter((item) => !ids.includes(item.id));
        destinationList.splice(destination.index, 0, ...selectedItems);
      } else {
        //drag without multiselect

        let item = sourceList.splice(result.source.index, 1);
        destinationList.splice(destination.index, 0, ...item);
      }

      let newList = [...listData];
      newList[0].items =
        destination.droppableId === listData[0].listId
          ? [...destinationList]
          : [...sourceList];
      newList[1].items =
        destination.droppableId === listData[1].listId
          ? [...destinationList]
          : [...sourceList];

      setListData(newList);
    }

    //stop dragging multiple
    setMultiDragActive(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <div className="flex">
        {listData.map((list) => (
          <Container>
            <h3>{list.listName}</h3>
            <Droppable
              key={list.listId}
              droppableId={list.listId}
              type="COLUMN"
              direction="vertical"
            >
              {(provided) => (
                <ItemList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver
                >
                  {list.items.map((item, i) => (
                    <DraggableItem
                      key={item.id}
                      item={item}
                      index={i}
                      dragged={dragged}
                      isDisabled={
                        multiDragActive &&
                        selectedItems.some(
                          (listItem) =>
                            JSON.stringify(listItem) === JSON.stringify(item)
                        ) &&
                        dragged.id !== item.id
                      }
                      isSelected={selectedItems.includes(item)}
                      onSelect={toggleItemSelection}
                    />
                  ))}
                  {provided.placeholder}
                </ItemList>
              )}
            </Droppable>
          </Container>
        ))}
      </div>
    </DragDropContext>
  );
}

export default DraggableList;
