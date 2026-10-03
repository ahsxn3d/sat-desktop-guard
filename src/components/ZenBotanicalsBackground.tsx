'use client';

import React, { useEffect, useRef } from 'react';

interface AmbientBlob {
  baseXRatio: number;
  baseYRatio: number;
  radiusRatio: number;
  hue: number;
  sat: number;
  light: number;
  alpha: number;
  // Lava-lamp floating cycle periods (in seconds)
  periodX: number;
  periodY: number;
  phaseX: number;
  phaseY: number;
  ampX: number;
  ampY: number;
  // Morphing & breathing
  breathPeriod: number;
  breathPhase: number;
  aspectRatio: number;
  aspectPeriod: number;
  rotSpeed: number;
  // Soft water-balloon cursor damping physics
  pushX: number;
  pushY: number;
  velX: number;
  velY: number;
}

export const ZenBotanicalsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let rafId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    // Mouse coordinates
    const mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // 6 Large Amorphous Pastel Blobs: Soft Matcha, Creamy Sage, & Warm Pale Amber
    const blobs: AmbientBlob[] = [
      {
        // 1. Soft Matcha Green (Top Left)
        baseXRatio: 0.22,
        baseYRatio: 0.24,
        radiusRatio: 0.38,
        hue: 112,
        sat: 42,
        light: 67,
        alpha: 0.44,
        periodX: 24,
        periodY: 30,
        phaseX: 0.2,
        phaseY: 1.1,
        ampX: 110,
        ampY: 85,
        breathPeriod: 22,
        breathPhase: 0.5,
        aspectRatio: 1.15,
        aspectPeriod: 28,
        rotSpeed: 0.0018,
        pushX: 0,
        pushY: 0,
        velX: 0,
        velY: 0,
      },
      {
        // 2. Creamy Sage (Top Right)
        baseXRatio: 0.78,
        baseYRatio: 0.28,
        radiusRatio: 0.42,
        hue: 138,
        sat: 30,
        light: 75,
        alpha: 0.40,
        periodX: 28,
        periodY: 26,
        phaseX: 2.3,
        phaseY: 0.7,
        ampX: 120,
        ampY: 95,
        breathPeriod: 26,
        breathPhase: 1.8,
        aspectRatio: 1.2,
        aspectPeriod: 32,
        rotSpeed: -0.0014,
        pushX: 0,
        pushY: 0,
        velX: 0,
        velY: 0,
      },
      {
        // 3. Warm Pale Amber / Golden Genmaicha (Center Drift)
        baseXRatio: 0.50,
        baseYRatio: 0.52,
        radiusRatio: 0.34,
        hue: 44,
        sat: 48,
        light: 77,
        alpha: 0.34,
        periodX: 32,
        periodY: 34,
        phaseX: 4.1,
        phaseY: 2.8,
        ampX: 130,
        ampY: 110,
        breathPeriod: 20,
        breathPhase: 3.2,
        aspectRatio: 1.25,
        aspectPeriod: 25,
        rotSpeed: 0.0012,
        pushX: 0,
        pushY: 0,
        velX: 0,
        velY: 0,
      },
      {
        // 4. Whipped Tea Cream (Bottom Left)
        baseXRatio: 0.28,
        baseYRatio: 0.76,
        radiusRatio: 0.40,
        hue: 96,
        sat: 34,
        light: 84,
        alpha: 0.42,
        periodX: 26,
        periodY: 33,
        phaseX: 1.5,
        phaseY: 3.9,
        ampX: 105,
        ampY: 90,
        breathPeriod: 25,
        breathPhase: 4.1,
        aspectRatio: 1.18,
        aspectPeriod: 30,
        rotSpeed: -0.0016,
        pushX: 0,
        pushY: 0,
        velX: 0,
        velY: 0,
      },
      {
        // 5. Deep Ceremonial Jade Whisper (Bottom Right)
        baseXRatio: 0.74,
        baseYRatio: 0.78,
        radiusRatio: 0.44,
        hue: 124,
        sat: 36,
        light: 64,
        alpha: 0.38,
        periodX: 35,
        periodY: 29,
        phaseX: 5.2,
        phaseY: 1.9,
        ampX: 115,
        ampY: 100,
        breathPeriod: 31,
        breathPhase: 2.5,
        aspectRatio: 1.22,
        aspectPeriod: 35,
        rotSpeed: 0.0015,
        pushX: 0,
        pushY: 0,
        velX: 0,
        velY: 0,
      },
      {
        // 6. Warm Amber Glow (Mid-Right Accent)
        baseXRatio: 0.88,
        baseYRatio: 0.48,
        radiusRatio: 0.30,
        hue: 48,
        sat: 42,
        light: 74,
        alpha: 0.28,
        periodX: 29,
        periodY: 31,
        phaseX: 3.7,
        phaseY: 4.6,
        ampX: 90,
        ampY: 80,
        breathPeriod: 24,
        breathPhase: 1.2,
        aspectRatio: 1.12,
        aspectPeriod: 27,
        rotSpeed: -0.0019,
        pushX: 0,
        pushY: 0,
        velX: 0,
        velY: 0,
      },
    ];

    let startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;

      // Smooth mouse interpolation
      if (mouse.targetX > -5000) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }

      ctx.clearRect(0, 0, W, H);

      const minDim = Math.min(W, H);

      for (const blob of blobs) {
        // 1. Organic "Lava Lamp" Floating Motion (Harmonic cycles 20 to 35 seconds)
        const driftX =
          Math.sin((elapsed * 2 * Math.PI) / blob.periodX + blob.phaseX) *
          blob.ampX *
          (W / 1400);
        const driftY =
          Math.cos((elapsed * 2 * Math.PI) / blob.periodY + blob.phaseY) *
          blob.ampY *
          (H / 900);

        const currentCenterX = W * blob.baseXRatio + driftX;
        const currentCenterY = H * blob.baseYRatio + driftY;

        // 2. Subtle Cursor Physics ("Gently pushes them like a balloon through calm water")
        if (mouse.x > -5000) {
          const dx = currentCenterX + blob.pushX - mouse.x;
          const dy = currentCenterY + blob.pushY - mouse.y;
          const dist = Math.hypot(dx, dy);
          const pushRadius = minDim * 0.45; // Generous soft influence radius

          if (dist < pushRadius && dist > 1) {
            // Smooth inverse quadratic repulsion
            const force = Math.pow(1 - dist / pushRadius, 1.8) * 85;
            const targetPushX = (dx / dist) * force;
            const targetPushY = (dy / dist) * force;

            // Spring force towards target push
            blob.velX += (targetPushX - blob.pushX) * 0.035;
            blob.velY += (targetPushY - blob.pushY) * 0.035;
          } else {
            // Spring return back to zero push
            blob.velX += -blob.pushX * 0.025;
            blob.velY += -blob.pushY * 0.025;
          }
        } else {
          // No mouse: gentle damping back to equilibrium
          blob.velX += -blob.pushX * 0.025;
          blob.velY += -blob.pushY * 0.025;
        }

        // Apply damping
        blob.velX *= 0.88;
        blob.velY *= 0.88;
        blob.pushX += blob.velX;
        blob.pushY += blob.velY;

        // Final blob position with physics push
        const finalX = currentCenterX + blob.pushX;
        const finalY = currentCenterY + blob.pushY;

        // 3. Organic Morphing & Breathing (expanding & contracting by ±12%)
        const breathScale =
          1 +
          Math.sin(
            (elapsed * 2 * Math.PI) / blob.breathPeriod + blob.breathPhase
          ) *
            0.12;

        const baseRadius = minDim * blob.radiusRatio * breathScale;

        // Dynamic aspect ratio & rotation for amorphous shape
        const aspectMorph =
          blob.aspectRatio +
          Math.sin((elapsed * 2 * Math.PI) / blob.aspectPeriod) * 0.1;
        const radiusX = baseRadius * aspectMorph;
        const radiusY = baseRadius / aspectMorph;
        const rotation = elapsed * blob.rotSpeed;

        // 4. Render Soft Radial Gradient Blob
        const maxRadius = Math.max(radiusX, radiusY);
        const grad = ctx.createRadialGradient(
          finalX,
          finalY,
          0,
          finalX,
          finalY,
          maxRadius
        );

        const a = blob.alpha;
        grad.addColorStop(0, `hsla(${blob.hue}, ${blob.sat}%, ${blob.light}%, ${a})`);
        grad.addColorStop(0.35, `hsla(${blob.hue}, ${blob.sat - 4}%, ${blob.light + 3}%, ${a * 0.75})`);
        grad.addColorStop(0.70, `hsla(${blob.hue}, ${blob.sat - 8}%, ${blob.light + 6}%, ${a * 0.35})`);
        grad.addColorStop(1, `hsla(${blob.hue}, ${blob.sat - 12}%, ${blob.light + 8}%, 0)`);

        ctx.save();
        ctx.translate(finalX, finalY);
        ctx.rotate(rotation);
        ctx.fillStyle = grad;
        ctx.beginPath();
        // Amorphous ellipse
        ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{
        // Heavy Gaussian blur melts colors into an ambient, silky, borderless glow
        filter: 'blur(95px) saturate(145%)',
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
