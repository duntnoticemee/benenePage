import React, { useState, useRef, useEffect, useCallback } from 'react';
import './RetroCard.css'; 
import useHoverSound from './useHoverSound';



const RetroCard = ({
  id,
  title,
  children,
  onClose,
  initialPosition = { x: 50, y: 50 },
  draggable = true,
  onFocus,
  zIndex = 1000,
  width = {width},
  height = {height}, // fixed height ensures overflow detection
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const contentRef = useRef(null);

  const playonClose = useHoverSound('/minecraft_click.mp3', 0.6);

  // --- Drag: only start when header is mousedowned ---
  const handleHeaderMouseDown = (e) => {
    if (!draggable) return;
    e.preventDefault(); // avoid text selection
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    if (onFocus) onFocus(id);
  };

  // Bring to front when clicking anywhere inside the card (but not start drag)
  const handleCardMouseDown = (e) => {
    // avoid interfering with header mousedown which already calls onFocus
    if (onFocus) onFocus(id);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      const maxX = window.innerWidth - width;
      const maxY = window.innerHeight - height;
      let newX = e.clientX - dragStart.current.x;
      let newY = e.clientY - dragStart.current.y;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      setPosition({ x: newX, y: newY });
    };
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, width, height]);

  // --- Wheel handling: prevent page scroll when content can scroll ---
  const handleContentWheel = (e) => {
    const el = contentRef.current;
    if (!el) return;
    const delta = e.deltaY;
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    // If the content can be scrolled in the wheel direction, stop propagation
    if ((delta < 0 && !atTop) || (delta > 0 && !atBottom)) {
      // allow the content to scroll normally but prevent the wheel from
      // bubbling to parent/page which would scroll the page
      e.stopPropagation();
      // do NOT call preventDefault() here — letting the browser handle the scroll prevents janky behavior
    }
    // otherwise do nothing, allow page-level scrolling
  };

  const cardStyle = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: width,
    height: height,
    backgroundColor: '#9ae1e2',
    border: '1px solid #424242',
    boxShadow: '8px 8px 0px 0px rgba(2, 0, 54, 0.15)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex,
    userSelect: 'none',
  };

  return (
    <div
      role="dialog"
      aria-label={title}
      style={cardStyle}
      onMouseDown={handleCardMouseDown}
    >
      <div className='retro-card-header' onMouseDown={handleHeaderMouseDown}>
        <span className='retro-card-title'>{title.toUpperCase()}</span>
        {onClose && (
          <button
            aria-label="close"
            className='grow-on-hover'
            onClick={(e) => {
              playonClose();
              e.stopPropagation();
              onClose(id);
            }}
          >
            [ x ]
          </button>
        )}
      </div>

      <div
        ref={contentRef}
        className='retro-card-content'
        onWheel={handleContentWheel}
      >
        {children}
      </div>
    </div>
  );
};
export default RetroCard;