import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  SECTION: 'section'
};

interface SectionProps {
  id: number;
  left: number;
  top: number;
  rotation: number;
  currentOffset: { x: number; y: number } | null;
  style?: React.CSSProperties;
}

const WebSection: React.FC<SectionProps> = ({ id, left, top, rotation, currentOffset, style }) => {
  const [{ isDraggingItem }, drag] = useDrag(() => ({
    type: ItemTypes.SECTION,
    item: { id, type: ItemTypes.SECTION, left, top, rotation },
    collect: (monitor) => ({
      isDraggingItem: monitor.isDragging(),
    }),
  }), [id, left, top, rotation]);

  const currentLeft = currentOffset && isDraggingItem ? currentOffset.x : left;
  const currentTop = currentOffset && isDraggingItem ? currentOffset.y : top;

  return (
    <div
      ref={drag}
      className="section"
      style={{
        position: 'absolute',
        left: currentLeft,
        top: currentTop,
        width: '80px',
        height: '40px',
        transform: `rotate(${rotation}deg)`,
        opacity: isDraggingItem ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        borderWidth: 1,
        borderStyle: 'solid',
        fontSize: '10px',
        ...style,
      }}
    >
      <span style={{ transform: `rotate(-${rotation}deg)` }}>{id}</span>
      
      <div
        className="arrow"
        style={{
          position: 'absolute',
          bottom: '-10px', 
          width: '0',
          height: '0',
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '10px solid green', 
        }}
      />
    </div>
  );
};

export default WebSection;
