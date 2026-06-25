"use client";

import { useEffect, useRef, useState } from "react";

/*
  Tamed WebGL nebula background for the hero.
  Original shader by Matthias Hurrle (@atzedent), recoloured toward BNB gold.

  Guardrails (vs. the raw version):
   - desktop only (skips on small screens / coarse pointers)
   - respects prefers-reduced-motion
   - pauses rendering when the hero scrolls out of view or the tab is hidden
   - capped device-pixel-ratio (cheap to render)
   - no pointer uniforms — the shader only needs time + resolution
   - renders null when ineligible, so the hero falls back to its static glow
*/

const FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);
  for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;}
float clouds(vec2 p){float d=1.,t=.0;
  for(float i=.0;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
  t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.45,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.45+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    // warm gold-biased sparkle palette
    col+=.0045/d*(cos(sin(i)*vec3(1.0,1.6,2.6))+1.)*vec3(1.0,0.72,0.30);
    float b=noise(i+p+bg*1.731);
    col+=.0060*b/length(max(p,vec2(b*p.x*.02,p.y)));
    // gold/amber cloud tint (R > G >> B)
    col=mix(col,vec3(bg*.95,bg*.58,bg*.14),d);
  }
  O=vec4(col,1);
}`;

const VERT = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

function createRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("shader compile failed:", gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  };

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("program link failed:", gl.getProgramInfoLog(program));
    return null;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "resolution");
  const uTime = gl.getUniformLocation(program, "time");

  return {
    render(now: number) {
      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    resize(dpr: number) {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    dispose() {
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    },
  };
}

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [eligible, setEligible] = useState(false);
  const [ready, setReady] = useState(false);

  // Decide eligibility on the client only (desktop + motion allowed).
  useEffect(() => {
    const ok =
      window.matchMedia("(min-width: 768px)").matches &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEligible(ok);
  }, []);

  useEffect(() => {
    if (!eligible || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const renderer = createRenderer(canvas);
    if (!renderer) return;

    const dpr = Math.min(1, Math.max(0.35, 0.4 * window.devicePixelRatio));
    renderer.resize(dpr);

    let raf = 0;
    let visible = true;
    let onScreen = true;

    const frame = (now: number) => {
      renderer.render(now);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible && onScreen) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onResize = () => renderer.resize(dpr);
    const onVisibility = () => {
      visible = !document.hidden;
      visible ? start() : stop();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        onScreen ? start() : stop();
      },
      { threshold: 0.01 },
    );

    io.observe(canvas);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    requestAnimationFrame(() => setReady(true));
    start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.dispose();
    };
  }, [eligible]);

  if (!eligible) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-1000"
      style={{ opacity: ready ? 1 : 0 }}
    />
  );
}
