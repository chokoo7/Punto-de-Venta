// 📊 Gráfica de gastos fijos
function cargarGastos() {
  const ctx = document.getElementById("graficaGastos").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Luz", "Agua", "Renta", "Insumos", "Otros"],
      datasets: [
        {
          data: [1200, 800, 5000, 3000, 700], // valores estáticos de ejemplo
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffcd56",
            "#4bc0c0",
            "#9966ff",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}

// 📊 Gráfica de entradas vs salidas
function cargarEntradasSalidas() {
  const ctx = document
    .getElementById("graficaEntradasSalidas")
    .getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
      datasets: [
        {
          label: "Entradas",
          data: [15000, 18000, 20000, 22000, 21000],
          backgroundColor: "#28a745",
        },
        {
          label: "Salidas",
          data: [8000, 9000, 9500, 10000, 11000],
          backgroundColor: "#dc3545",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

// 🚀 Inicializar gráficas
cargarGastos();
cargarEntradasSalidas();
