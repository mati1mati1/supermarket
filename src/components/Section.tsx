import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  SECTION: 'section'
};

interface SectionProps {
  id: number;
  name: string;
  left: number;
  top: number;
  rotation: number;
  currentOffset: { x: number; y: number } | null;
}

const Section: React.FC<SectionProps> = ({ id, name, left, top, rotation, currentOffset }) => {
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
        fontSize: '10px'
      }}
    >
      <span style={{ transform: `rotate(-${rotation}deg)` }}>{name} {id}</span>
      <div className="arrow" />
    </div>
  );
};

export default Section;
