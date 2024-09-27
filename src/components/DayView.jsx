import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function DayView() {
  const { dayId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(
          `https://api-plan-entrenamiento.com/plan/dia/${dayId}`
        );
        const data = await response.json();
        setExercises(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setLoading(false);
      }
    };

    fetchExercises();
  }, [dayId]);

  if (loading) {
    return <p>Cargando ejercicios...</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <Link to="/verplan" className="text-blue-500">← Regresar</Link>
      <h1 className="text-2xl font-bold mb-4">Día {dayId} - Ejercicios</h1>
      <div className="grid grid-cols-1 gap-4">
        {exercises.map((exercise, index) => (
          <div key={index} className="bg-gray-200 p-4 rounded">
            <h2 className="font-bold">{exercise.name}</h2>
            <p>{exercise.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
