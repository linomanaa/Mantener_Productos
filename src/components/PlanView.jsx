import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function PlanView() {
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("Marzo");

  const months = ["Marzo", "Abril", "Mayo"]; // Opciones de meses disponibles

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(
          "https://api-plan-entrenamiento.com/plan" //API momentanea, la API HU11 no muestra ninguna vista
        );
        const data = await response.json();
        setPlan(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plan:", error);
        setLoading(false);
      }
    };

    fetchPlan();
  }, [selectedMonth]);

  if (loading) {
    return <p>Cargando plan...</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Plan de entrenamiento</h1>
      <div className="flex justify-between items-center mb-4">
        <span>Plan generado: </span>
        <select
          className="p-2 border rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {plan.map((day, index) => (
          <Link key={index} to={`/plan/${index + 1}`}>
            <button className="bg-gray-700 text-white py-2 px-4 rounded">
              Día {index + 1}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
