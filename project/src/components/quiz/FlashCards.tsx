import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import PythonQuiz from './PythonQuiz';

interface FlashCard {
  front: string;
  back: string;
}

interface FlashCardsProps {
  cards?: FlashCard[];
  title?: string;
  questions?: any[];
}

// Enhanced vertex shader with color support
const vertexShader = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;

  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

// Enhanced fragment shader with colorful fluid simulation
const fragmentShader = `
  precision highp float;
  precision highp sampler2D;

  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  uniform sampler2D uColor;
  uniform vec2 texelSize;
  uniform vec2 pointer;
  uniform vec2 pointerDelta;
  uniform float time;
  uniform float dissipation;
  uniform float curl;
  uniform float splatForce;

  // HSV to RGB conversion
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float C = texture2D(uPressure, vUv).x;

    // Calculate fluid dynamics
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    float divergence = texture2D(uPressure, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    
    // Calculate distance to pointer
    vec2 coord = vUv - pointer;
    float dist = length(coord);
    
    // Generate dynamic color based on velocity and pressure
    float hue = mod(time * 0.1 + length(velocity) * 2.0, 1.0);
    float sat = min(length(velocity) * 2.0, 1.0);
    float val = 0.8 + pressure * 0.2;
    vec3 color = hsv2rgb(vec3(hue, sat, val));

    // Add splat effect near pointer
    if (dist < 0.1) {
      float force = (0.1 - dist) * splatForce;
      color += force * hsv2rgb(vec3(
        mod(time * 0.2 + dist * 10.0, 1.0),
        0.8,
        0.8
      ));
    }

    // Apply curl noise for more interesting motion
    float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
    vec2 curl = vec2(
      noise * 2.0 - 1.0,
      fract(noise * 7.13) * 2.0 - 1.0
    ) * curl;
    
    // Combine everything
    vec3 finalColor = mix(
      color,
      texture2D(uColor, vUv + curl * texelSize).rgb,
      dissipation
    );

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const FlashCards: React.FC<FlashCardsProps> = ({ 
  cards = [], 
  title = "Python Basics Flashcards",
  questions = []
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, dx: 0, dy: 0, pressed: false });
  const timeRef = useRef(0);
  const frameRef = useRef<number>(0);

  // Simulation parameters
  const params = {
    dissipation: 0.97,
    curl: 0.2,
    splatForce: 6000,
    pressure: 0.8,
    velocityDissipation: 0.98
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      antialias: true
    });
    if (!gl) return;

    contextRef.current = gl;

    // Create and initialize shader program
    const program = createShaderProgram(gl, vertexShader, fragmentShader);
    if (!program) return;
    programRef.current = program;

    // Initialize textures and framebuffers
    initializeResources(gl);

    // Set up canvas size with device pixel ratio
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Animation loop
    const animate = (timestamp: number) => {
      if (!gl || !program) return;
      
      timeRef.current = timestamp * 0.001; // Convert to seconds
      
      // Update simulation
      updateSimulation(gl, program, pointerRef.current);
      
      frameRef.current = requestAnimationFrame(animate);
    };
    animate(0);

    // Event listeners
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
      
      pointerRef.current = {
        ...pointerRef.current,
        x: x / rect.width,
        y: 1 - y / rect.height,
        dx: x - pointerRef.current.x,
        dy: y - pointerRef.current.y
      };
    };

    const handlePointerDown = () => {
      pointerRef.current.pressed = true;
    };

    const handlePointerUp = () => {
      pointerRef.current.pressed = false;
    };

    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('touchmove', handlePointerMove);
    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('touchstart', handlePointerDown);
    canvas.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('touchmove', handlePointerMove);
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('touchstart', handlePointerDown);
      canvas.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('touchend', handlePointerUp);
      cancelAnimationFrame(frameRef.current);
      if (gl && program) gl.deleteProgram(program);
    };
  }, []);

  // Initialize WebGL resources
  const initializeResources = (gl: WebGLRenderingContext) => {
    // Create textures for velocity, pressure, and color
    const createTexture = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return texture;
    };

    // Create framebuffers
    const createFramebuffer = (texture: WebGLTexture) => {
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      return fbo;
    };

    // Initialize all required textures and framebuffers
    const textures = {
      velocity: createTexture(),
      pressure: createTexture(),
      color: createTexture()
    };

    const framebuffers = {
      velocity: createFramebuffer(textures.velocity),
      pressure: createFramebuffer(textures.pressure),
      color: createFramebuffer(textures.color)
    };

    return { textures, framebuffers };
  };

  // Update simulation state
  const updateSimulation = (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    pointer: { x: number; y: number; dx: number; dy: number; pressed: boolean }
  ) => {
    gl.useProgram(program);
    
    // Set uniforms
    const uniforms = {
      resolution: gl.getUniformLocation(program, 'resolution'),
      texelSize: gl.getUniformLocation(program, 'texelSize'),
      pointer: gl.getUniformLocation(program, 'pointer'),
      pointerDelta: gl.getUniformLocation(program, 'pointerDelta'),
      time: gl.getUniformLocation(program, 'time'),
      dissipation: gl.getUniformLocation(program, 'dissipation'),
      curl: gl.getUniformLocation(program, 'curl'),
      splatForce: gl.getUniformLocation(program, 'splatForce')
    };

    gl.uniform2f(uniforms.resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(uniforms.texelSize, 1.0 / gl.canvas.width, 1.0 / gl.canvas.height);
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
    gl.uniform2f(uniforms.pointerDelta, pointer.dx, pointer.dy);
    gl.uniform1f(uniforms.time, timeRef.current);
    gl.uniform1f(uniforms.dissipation, params.dissipation);
    gl.uniform1f(uniforms.curl, params.curl);
    gl.uniform1f(uniforms.splatForce, pointer.pressed ? params.splatForce : 0);

    // Draw fullscreen quad
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  // Helper function to create shader program
  const createShaderProgram = (
    gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string
  ) => {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return null;

    gl.shaderSource(vertexShader, vertexSource);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  };

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setDirection(0);
  }, [cards]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = (score: number) => {
    console.log('Quiz completed with score:', score);
  };

  if (showQuiz) {
    return <PythonQuiz questions={questions} onComplete={handleQuizComplete} />;
  }

  if (!cards.length) {
    return <div>No flashcards available.</div>;
  }

  return (
    <div className="relative max-w-2xl mx-auto p-8">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1 }}
      />

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-sm text-gray-400">
          {currentIndex + 1} / {cards.length}
        </div>
      </div>

      <div className="relative perspective-1000 h-96">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ 
              x: direction > 0 ? 300 : -300,
              opacity: 0,
              rotateY: 0
            }}
            animate={{ 
              x: 0,
              opacity: 1,
              rotateY: isFlipped ? 180 : 0
            }}
            exit={{ 
              x: direction < 0 ? 300 : -300,
              opacity: 0
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 preserve-3d cursor-pointer"
            onClick={handleFlip}
          >
            {/* Front of Card */}
            <div 
              className={`absolute inset-0 backface-hidden transition-opacity duration-300 ${
                isFlipped ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <h3 className="text-xl font-bold text-blue-400 mb-2">Question</h3>
                  <p className="text-xl">{cards[currentIndex].front}</p>
                  <p className="text-sm text-gray-400 mt-4">Click to reveal answer</p>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div 
              className={`absolute inset-0 backface-hidden rotate-y-180 transition-opacity duration-300 ${
                isFlipped ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="h-full backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20">
                <div className="flex flex-col justify-center h-full text-center">
                  <h3 className="text-xl font-bold text-green-400 mb-4">Answer</h3>
                  <p className="text-lg leading-relaxed whitespace-pre-line">
                    {cards[currentIndex].back}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          Next Card
          <ChevronRight className="w-5 h-5" />
        </motion.button>

        {currentIndex === cards.length - 1 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartQuiz}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300"
          >
            Start Quiz
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default FlashCards;
