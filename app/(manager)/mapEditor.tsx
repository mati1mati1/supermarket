import React, { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import WebSection from '../../src/components/WebSection';
import WebEntrance from '../../src/components/WebEntrance';
import '../../src/styles/MapEditor.css';
import { getSupermarketByUserId, updateMap } from '../../src/api/api';
import { useAuth } from '../../src/context/AuthContext';

const ItemTypes = {
  SECTION: 'section',
  ENTRANCE: 'entrance'
};

const ManagerMapEditor: React.FC = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [entrance, setEntrance] = useState<{ left: number; top: number } | null>(null);
  const [shelfCounter, setShelfCounter] = useState(1);
  const [currentOffset, setCurrentOffset] = useState<{ x: number; y: number } | null>(null);
  const [supermarket, setSupermarket] = useState<any | null>(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const mapRef = useRef<HTMLDivElement | null>(null);
  const {authState} = useAuth();
  const token = authState?.token;
  const mapWidth = 800;
  const mapHeight = 600;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.error('Token not found');
        return;
      }
      try {
        const fetchedSupermarket = (await getSupermarketByUserId(token || ''))[0];
        if (fetchedSupermarket) {
          setSupermarket(fetchedSupermarket);
          const branchMap = JSON.parse(fetchedSupermarket.BranchMap);
          setSections(branchMap.sections || []);
          setEntrance(branchMap.entrance || null);
          setShelfCounter(branchMap.sections.length + 1);
        }
        setIsDataFetched(true);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, [token]);

  const [, drop] = useDrop({
    accept: [ItemTypes.SECTION, ItemTypes.ENTRANCE],
    hover: (item: any, monitor: DropTargetMonitor) => {
      const delta = monitor.getClientOffset();
      const mapRect = mapRef.current?.getBoundingClientRect();
      if (delta && mapRect) {
        const left = Math.round(delta.x - mapRect.left);
        const top = Math.round(delta.y - mapRect.top);

        setCurrentOffset({ x: left, y: top });
      }
    },
    drop: (item: any, monitor: DropTargetMonitor) => {
      const delta = monitor.getClientOffset();
      const mapRect = mapRef.current?.getBoundingClientRect();
      if (delta && mapRect) {
        const left = Math.round(delta.x - mapRect.left);
        const top = Math.round(delta.y - mapRect.top);

        setCurrentOffset(null); // Reset current offset after drop

        if (item.type === ItemTypes.ENTRANCE) {
          moveEntrance(left, top);
        } else if (item.type === ItemTypes.SECTION) {
          const existingSection = sections.find(section => section.id === item.id);
          if (existingSection) {
            moveSection(item.id, left, top, item.rotation);
          } else {
            addSection(left, top, item.rotation);
          }
        }
      }
      return undefined;
    },
  });

  const addSection = (left: number, top: number, rotation: number) => {
    const adjustedPosition = adjustPosition(shelfCounter, left, top, rotation);
    setSections((sections) => [
      ...sections,
      { id: shelfCounter, name: `מדף`, left: adjustedPosition.left, top: adjustedPosition.top, rotation: rotation, width: 80, height: 40 }
    ]);
    setShelfCounter(shelfCounter + 1);
  };

  const adjustPosition = (id: number, left: number, top: number, rotation: number) => {
    let adjustedLeft = left;
    let adjustedTop = top;
    let overlap = true;
    const itemWidth = rotation % 180 === 0 ? 80 : 40;
    const itemHeight = rotation % 180 === 0 ? 40 : 80;

    while (overlap) {
      overlap = false;
      sections.forEach(section => {
        if (section.id !== id) {
          const sectionWidth = section.rotation % 180 === 0 ? 80 : 40;
          const sectionHeight = section.rotation % 180 === 0 ? 40 : 80;
          const sectionRight = section.left + sectionWidth;
          const sectionBottom = section.top + sectionHeight;

          const itemRight = adjustedLeft + itemWidth;
          const itemBottom = adjustedTop + itemHeight;

          const isOverlapping = !(sectionRight <= adjustedLeft || section.left >= itemRight || sectionBottom <= adjustedTop || section.top >= itemBottom);

          if (isOverlapping) {
            overlap = true;
            let newLeft = adjustedLeft;
            let newTop = adjustedTop;

            if (adjustedTop < section.top) {
              newTop = section.top - itemHeight;
            } else if (adjustedTop > section.top) {
              newTop = section.top + sectionHeight;
            }

            if (adjustedLeft < section.left) {
              newLeft = section.left - itemWidth;
            } else if (adjustedLeft > section.left) {
              newLeft = section.left + sectionWidth;
            }

            adjustedLeft = newLeft;
            adjustedTop = newTop;
          }
        }
      });
    }

    return { left: adjustedLeft, top: adjustedTop };
  };

  const rotateSection = (id: number) => {
    setSections((sections) =>
      sections.map((section) =>
        section.id === id ? { ...section, rotation: (section.rotation + 90) % 360 } : section
      )
    );
  };

  const moveSection = (id: number, left: number, top: number, rotation: number) => {
    const adjustedPosition = adjustPosition(id, left, top, rotation);
    setSections((sections) =>
      sections.map((section) =>
        section.id === id ? { ...section, left: Math.max(0, Math.min(adjustedPosition.left, mapWidth - (rotation % 180 === 0 ? 80 : 40))), top: Math.max(0, Math.min(adjustedPosition.top, mapHeight - (rotation % 180 === 0 ? 40 : 80))) } : section
      )
    );
  };

  const moveEntrance = (left: number, top: number) => {
    const adjustedLeft = Math.max(0, Math.min(left, mapWidth - 50));
    const adjustedTop = (adjustedLeft === 0 || adjustedLeft === mapWidth - 50) ? Math.max(0, Math.min(top, mapHeight - 50)) : (top <= 25 || top >= mapHeight - 25 ? top : (top < mapHeight / 2 ? 0 : mapHeight - 50));
    setEntrance({ left: adjustedLeft, top: adjustedTop });
  };

  const saveMapToDB = async () => {
    const mapData = { sections, entrance, mapWidth, mapHeight };
    await updateMap(token || '', supermarket.SupermarketID, JSON.stringify(mapData));
  };

  if (isLoading) {
    return <div>Loading...</div>; // Loading indicator
  }

  return (
    <div>
      <div ref={(node) => { if (node) { mapRef.current = node; drop(node); } }} className="map-editor" style={{ position: 'relative', width: `${mapWidth}px`, height: `${mapHeight}px`, border: '1px solid black' }}>
        {sections.map(({ id, left, top, rotation, width, height }) => (
          <div key={`section-${id}`} onDoubleClick={() => rotateSection(id)}>
            <WebSection id={id} left={left} top={top} rotation={rotation} currentOffset={currentOffset} />
          </div>
        ))}
        {entrance && <WebEntrance left={entrance.left} top={entrance.top} />}
      </div>
      <div className="sidebar">
        <button  onClick={saveMapToDB}>שמור מפה</button>
        <div onClick={() => addSection(0, 0, 0)}>מדף</div>
        <div onClick={() => !entrance && setEntrance({ left: 0, top: 0 })}>כניסה</div>
      </div>
    </div>
  );
};

export default ManagerMapEditor;
