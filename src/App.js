import { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";  // Usamos Material UI para botones

// Constantes físicas
const g = 9.8; // Gravedad en m/s^2

// Función para calcular la trayectoria y velocidad necesaria
function calculateProjectilePath(distance, height, depth) {
  // Calculamos el ángulo óptimo
  const angle = Math.atan(depth / distance); // ángulo en radianes
  const velocity = Math.sqrt((distance ** 2 * g) / (2 * Math.cos(angle) ** 2 * (distance * Math.tan(angle) - height))); // velocidad inicial

  const timeOfFlight = (2 * velocity * Math.sin(angle)) / g; // tiempo de vuelo
  const stepCount = 100; // Resolución de la parábola
  const path = [];

  for (let t = 0; t <= timeOfFlight; t += timeOfFlight / stepCount) {
    const x = velocity * Math.cos(angle) * t; // posición en X
    const y = height + velocity * Math.sin(angle) * t - 0.5 * g * t ** 2; // posición en Y
    path.push({ x, y });
  }

  return { path, velocity, angle: (angle * 180) / Math.PI };
}

export default function App() {
  const [distance, setDistance] = useState(3); // Distancia a la red
  const [depth, setDepth] = useState(6); // Profundidad del ataque
  const [height, setHeight] = useState(2.5); // Altura de lanzamiento
  const [path, setPath] = useState([]); // Trayectoria
  const [velocity, setVelocity] = useState(0); // Velocidad inicial
  const [angle, setAngle] = useState(0); // Ángulo de lanzamiento
  const canvasRef = useRef(null); // Referencia al canvas

  useEffect(() => {
    const { path, velocity, angle } = calculateProjectilePath(distance, height, depth);
    setPath(path);
    setVelocity(velocity);
    setAngle(angle);
  }, [distance, height, depth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(path[0]?.x * 10, canvas.height - path[0]?.y * 10); // Ajustar escala

        // Dibuja la trayectoria
        path.forEach((point, index) => {
          ctx.lineTo(point.x * 10, canvas.height - point.y * 10); // Escalar y dibujar
        });

        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Marcar el punto más alto y el aterrizaje
        const maxHeightPoint = path.reduce((max, p) => (p.y > max.y ? p : max), path[0]);
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(maxHeightPoint.x * 10, canvas.height - maxHeightPoint.y * 10, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // Marcar el punto de aterrizaje
        const landingPoint = path[path.length - 1];
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(landingPoint.x * 10, canvas.height - landingPoint.y * 10, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
      }
    }
  }, [path]);

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center">Vóley + Matemáticas</h1>

      <div className="space-y-4 p-4 border rounded bg-white shadow">
        <h2 className="text-lg font-semibold">Simulación de la Parábola del Ataque</h2>
        <div className="flex gap-4">
          <label>
            Distancia a la red (m):
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="ml-2 border px-2 py-1 rounded w-20"
            />
          </label>
          <label>
            Profundidad del ataque (m):
            <input
              type="number"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="ml-2 border px-2 py-1 rounded w-20"
            />
          </label>
          <label>
            Altura del ataque (m):
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="ml-2 border px-2 py-1 rounded w-20"
            />
          </label>
        </div>
        <p className="mt-2">
          Velocidad inicial: <strong>{velocity.toFixed(2)} m/s</strong>
        </p>
        <p className="mt-2">
          Ángulo de lanzamiento: <strong>{angle.toFixed(2)}°</strong>
        </p>
      </div>

      <div className="space-y-4 p-4 border rounded bg-white shadow">
        <h2 className="text-lg font-semibold">Trayectoria del Balón</h2>
        <canvas
          ref={canvasRef}
          width={500}
          height={300}
          className="w-full border rounded bg-gray-100"
        />
      </div>
    </div>
  );
}
