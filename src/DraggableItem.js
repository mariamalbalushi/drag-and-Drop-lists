import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Draggable } from "react-beautiful-dnd";

const Item = styled("div")`
  border: 1px solid lightgrey;
  margin-bottom: 8px;
  border-radius: 2px;
  padding: 4px;
  ${(props) => (props.isSelected ? `background-color: #ebf1f7` : "")};
  ${(props) => (props.isDisabled ? `background-color: #E8E8E8` : "")};
`;
const SelectionCount = styled.div`
  border-radius: 50%;
  width: 15px;
  height: 15px;
  padding: 1px;
  position: absolute;
  top: 0;
  right: 0;
  background: red;
  color: white;
  text-align: center;
  font-size: 0.8rem;
`;
const DraggableItem = ({ item, index, isSelected, onSelect, isDisabled, dragged }) => {
  const [
    wasToggleInSelectionGroupKeyUsed,
    setWasToggleInSelectionGroupKeyUsed,
  ] = useState(false);
  const isToggleInSelectionGroupKeyUsed = (event) => {
    const isUsingWindows = navigator.platform.indexOf("Win") >= 0;
    return isUsingWindows ? event.ctrlKey : event.metaKey;
  };

  const onClick = (event) => {
    event.preventDefault();
    onSelect(item, wasToggleInSelectionGroupKeyUsed);
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      setWasToggleInSelectionGroupKeyUsed(
        isToggleInSelectionGroupKeyUsed(event)
      );
    };

    const handleKeyUp = (event) => {
      setWasToggleInSelectionGroupKeyUsed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <Draggable draggableId={item.id} index={index} type="item">
      {(provided, snapshot) => (
          <Item
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            onClick={onClick}
            isSelected={isSelected}
            isDisabled={isDisabled}
          >
            {item.content}
            {isSelected && snapshot.isDragging && (
              <SelectionCount>{dragged.count}</SelectionCount>
            )}
          </Item>

      )}
    </Draggable>
  );
};

export default DraggableItem;
