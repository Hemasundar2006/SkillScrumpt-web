import React, { useEffect, useState } from 'react';

export const MouseTrail = () => {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newDot = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
        color: '#146ef5'
      };
      
      setDots((prevDots) => [...prevDots.slice(-20), newDot]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {dots.map((dot, index) => (
        <div
          key={dot.id}
          className="absolute rounded-full transition-all duration-500 ease-out"
          style={{
            left: dot.x,
            top: dot.y,
            width: `${(index + 1) * 2}px`,
            height: `${(index + 1) * 2}px`,
            backgroundColor: dot.color,
            boxShadow: `0 0 10px ${dot.color}`,
            opacity: index / dots.length,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};
