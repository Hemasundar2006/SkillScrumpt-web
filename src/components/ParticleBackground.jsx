import React, { useEffect, useRef } from 'react';

export const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const particles = [];
    const particleCount = 250;
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#9333EA', '#2563EB'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    class Particle {
      constructor() {
        this.init();
      }

      init() {
        this.x = mouse.x;
        this.y = mouse.y;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.size = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        
        // Random offset from mouse
        const offset = Math.random() * 20;
        this.x += Math.cos(angle) * offset;
        this.y += Math.sin(angle) * offset;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }

      update() {
        // Magnetic attraction to mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) {
          const force = (300 - distance) / 300;
          this.vx += dx * force * 0.02;
          this.vy += dy * force * 0.02;
        }

        this.x += this.vx;
        this.y += this.vy;
        
        // Add some friction to keep speeds manageable
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        this.alpha -= this.decay;

        if (this.alpha <= 0) {
          this.init();
        }
      }
    }

    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ filter: 'blur(1px)' }}
    />
  );
};
