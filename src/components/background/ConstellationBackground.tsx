import { useEffect, useMemo, useRef, useState } from 'react';
import { Star as StarIcon } from 'lucide-react';
import { mockReviews } from '@/data/mockData';

interface StarNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  twinkle: number;
  reviewIndex: number;
}

function useCssHsl(variableName: string, alpha?: number) {
  const [value, setValue] = useState<string>('');
  useEffect(() => {
    const root = document.documentElement;
    const raw = getComputedStyle(root).getPropertyValue(variableName).trim();
    const color = alpha !== undefined ? `hsl(${raw} / ${alpha})` : `hsl(${raw})`;
    setValue(color);
  }, [variableName, alpha]);
  return value;
}

export default function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<{ x: number; y: number; text: string; rating: number } | null>(null);

  const primary = useCssHsl('--primary');
  const secondary = useCssHsl('--secondary');

  const snippets = useMemo(() => {
    return mockReviews.map((r) => ({
      text: r.text.length > 100 ? `${r.text.slice(0, 97)}...` : r.text,
      rating: r.rating,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth * window.devicePixelRatio);
    let height = (canvas.height = window.innerHeight * window.devicePixelRatio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const dpr = window.devicePixelRatio || 1;

    const area = window.innerWidth * window.innerHeight;
    const baseCount = Math.min(200, Math.max(80, Math.floor(area / 16000)));

    let stars: StarNode[] = new Array(baseCount).fill(0).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15 * dpr,
      vy: (Math.random() - 0.5) * 0.15 * dpr,
      size: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
      reviewIndex: i % snippets.length,
    }));

    let last = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    let clusters = new Array(4).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    let clusterTimer = 0;

    const draw = (t: number) => {
      if (!ctx) return;
      if (t - last < frameInterval) {
        requestAnimationFrame(draw);
        return;
      }
      const delta = t - last;
      last = t;

      ctx.clearRect(0, 0, width, height);

      // Update clusters every ~6s for subtle rearrangement
      clusterTimer += delta;
      if (clusterTimer > 6000) {
        clusterTimer = 0;
        clusters = clusters.map(() => ({
          x: Math.random() * width,
          y: Math.random() * height,
        }));
      }

      // Update and draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        // gentle pull toward nearest cluster
        const c = clusters.reduce((prev, curr) => {
          const dp = (s.x - prev.x) ** 2 + (s.y - prev.y) ** 2;
          const dc = (s.x - curr.x) ** 2 + (s.y - curr.y) ** 2;
          return dc < dp ? curr : prev;
        });
        s.vx += ((c.x - s.x) / 10000) * dpr;
        s.vy += ((c.y - s.y) / 10000) * dpr;

        s.x += s.vx;
        s.y += s.vy;

        // bounce softly
        if (s.x < 0 || s.x > width) s.vx *= -1;
        if (s.y < 0 || s.y > height) s.vy *= -1;

        // twinkle
        s.twinkle += 0.02;
        const alpha = 0.6 + Math.sin(s.twinkle) * 0.3;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = secondary ? secondary : 'hsla(0,0%,100%,0.9)';
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw connections
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120 * dpr;
          if (dist < maxDist) {
            const opacity = 1 - dist / maxDist;
            ctx.strokeStyle = primary ? primary : 'rgba(255,255,255,0.6)';
            ctx.globalAlpha = 0.35 * opacity;
            ctx.lineWidth = 1 * dpr;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      requestAnimationFrame(draw);
    };

    let raf = requestAnimationFrame(draw);

    const onResize = () => {
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    window.addEventListener('resize', onResize);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * dpr;
      const my = (e.clientY - rect.top) * dpr;

      let nearest: StarNode | null = null;
      let nearestDist = 999999;
      for (const s of stars) {
        const dx = s.x - mx;
        const dy = s.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < nearestDist) {
          nearestDist = d2;
          nearest = s;
        }
      }
      const threshold = 12 * dpr;
      if (nearest && Math.sqrt(nearestDist) < threshold) {
        const idx = nearest.reviewIndex % snippets.length;
        const data = snippets[idx];
        setHovered({ x: e.clientX + 12, y: e.clientY + 12, text: data.text, rating: data.rating });
      } else {
        setHovered(null);
      }
    };

    canvas.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, [primary, secondary, snippets]);

  return (
    <div>
      {/* Gradient background layer */}
      <div className="fixed inset-0 -z-20 cosmic-background pointer-events-none" aria-hidden="true" />
      {/* Canvas for stars/lines */}
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-auto" />

      {/* Tooltip */}
      {hovered && (
        <div
          ref={tooltipRef}
          className="fixed z-10 max-w-xs px-3 py-2 rounded-md border bg-card/90 backdrop-blur text-foreground text-xs shadow-soft"
          style={{ left: hovered.x, top: hovered.y }}
        >
          <div className="flex items-center gap-1 mb-1 text-primary">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className={`${i < hovered.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} size={12} />
            ))}
          </div>
          <div className="text-muted-foreground">{hovered.text}</div>
        </div>
      )}
    </div>
  );
}
