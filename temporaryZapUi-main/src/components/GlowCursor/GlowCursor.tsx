import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Polyline, Vec3, Vec2, Color } from 'ogl';
import './GlowCursor.css';

interface GlowCursorProps {
  primary?: string;
  secondary?: string;
  trailLength?: number;
  trailWidth?: number;
}

const GlowCursor: React.FC<GlowCursorProps> = ({
  primary = '#FFFFFF',
  secondary = '#BDBDBD',
  trailLength = 40,
  trailWidth = 8,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use refs for colors so we can mutate them inside the animation loop 
  // without needing to destroy and recreate the WebGL context
  const color1 = useRef(new Color(primary));
  const color2 = useRef(new Color(secondary));

  // Sync prop changes to refs smoothly
  useEffect(() => {
    color1.current.set(primary);
    color2.current.set(secondary);
  }, [primary, secondary]);

  useEffect(() => {
    // 14, 15: Accessibility & Mobile: Disable on touch or reduced motion
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (isReduced || !hasFinePointer) return;

    const containerNode = containerRef.current;
    if (!containerNode) return;

    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;
    containerNode.appendChild(gl.canvas);

    const camera = new Camera(gl);
    camera.position.z = 3;

    const scene = new Transform();

    const vertex = `
      attribute vec3 position;
      attribute vec3 next;
      attribute vec3 prev;
      attribute vec2 uv;
      attribute float side;

      uniform vec2 uResolution;
      uniform float uThickness;

      varying vec2 vUv;

      void main() {
          vUv = uv;

          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 currentScreen = position.xy * aspect;
          vec2 prevScreen = prev.xy * aspect;
          vec2 nextScreen = next.xy * aspect;

          vec2 dir1 = prevScreen - currentScreen;
          vec2 dir2 = currentScreen - nextScreen;

          float len1 = length(dir1);
          float len2 = length(dir2);

          if (len1 > 0.0) dir1 /= len1;
          else dir1 = vec2(0.0);

          if (len2 > 0.0) dir2 /= len2;
          else dir2 = vec2(0.0);

          vec2 dir = dir1 + dir2;
          float lenDir = length(dir);
          
          if (lenDir > 0.0) {
              dir /= lenDir;
          } else {
              dir = vec2(1.0, 0.0);
          }

          vec2 normal = vec2(-dir.y, dir.x);
          
          float dotDir = max(dot(dir1, dir), 0.5);
          float miter = 1.0 / dotDir;

          normal /= aspect;
          
          // NDC offset: thickness is in pixels, divide by resolution.y
          vec2 offset = normal * side * miter * (uThickness / uResolution.y);
          
          gl_Position = vec4(position.xy + offset, position.z, 1.0);
      }
    `;

    const fragment = `
      precision highp float;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec2 vUv;

      void main() {
          // Trail fade out towards the tail
          float fade = pow(1.0 - vUv.x, 1.2);
          
          // Distance from the center of the line (0 at center, 1 at edge)
          float dist = abs(vUv.y - 0.5) * 2.0;
          
          // Core is bright and sharp, halo is soft and wide
          float core = exp(-dist * 8.0);
          float halo = exp(-dist * 3.0);
          
          // Base color gradient
          vec3 color = mix(uColor2, uColor1, fade);
          
          // Combine core (white-ish) and halo (colored)
          vec3 finalColor = color * halo + vec3(1.0) * core * 0.5;
          
          // Smooth alpha transparency
          float alpha = (halo * 0.7 + core * 0.3) * fade;

          gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const points: Vec3[] = [];
    for (let i = 0; i < trailLength; i++) {
        points.push(new Vec3(0, 0, 0));
    }

    const polyline = new Polyline(gl, {
        points,
        vertex,
        fragment,
        uniforms: {
            uColor1: { value: color1.current },
            uColor2: { value: color2.current },
            uResolution: { value: new Vec2(window.innerWidth, window.innerHeight) },
            uThickness: { value: trailWidth },
        },
    });

    polyline.mesh.program.transparent = true;
    polyline.mesh.setParent(scene);

    const mouse = new Vec3(-1, -1, 0);
    
    let isFirstMove = true;

    const onMove = (e: MouseEvent | PointerEvent) => {
        mouse.set(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1,
            0
        );

        if (isFirstMove) {
            console.log("GLOW CURSOR FIRST MOVE INITIATED!");
            isFirstMove = false;
            for (let i = 0; i < points.length; i++) {
                points[i].copy(mouse);
            }
        }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('mousemove', onMove);

    let requestID: number;
    const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (polyline.mesh.program.uniforms.uResolution) {
            polyline.mesh.program.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
    };
    window.addEventListener('resize', resize);
    resize();

    // Physics parameters for the smooth organic trail
    const spring = 0.5;
    const friction = 0.45;
    const velocities = points.map(() => new Vec3());

    const update = () => {
        requestID = requestAnimationFrame(update);
        
        // Pass dynamic colors into uniform each frame smoothly
        polyline.mesh.program.uniforms.uColor1.value = color1.current;
        polyline.mesh.program.uniforms.uColor2.value = color2.current;

        for (let i = 0; i < points.length; i++) {
            const target = i === 0 ? mouse : points[i - 1];
            const p = points[i];
            const v = velocities[i];

            v.x += (target.x - p.x) * spring;
            v.y += (target.y - p.y) * spring;
            v.x *= friction;
            v.y *= friction;

            p.x += v.x;
            p.y += v.y;
        }

        polyline.updateGeometry();
        renderer.render({ scene, camera });
    };
    update();

    return () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(requestID);
        if (containerNode && gl.canvas) {
            containerNode.removeChild(gl.canvas);
        }
    };
  }, [trailLength, trailWidth]);

  return <div ref={containerRef} className="glow-cursor-canvas-wrapper" style={{ pointerEvents: 'none' }} />;
};

export default GlowCursor;
