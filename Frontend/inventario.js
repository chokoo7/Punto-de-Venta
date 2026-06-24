// 📌 Cargar inventario inicial
async function cargarInventario() {
  const res = await fetch(
    "http://localhost:4000/api/proveedores/productos/lista",
  );
  const data = await res.json();
  renderTabla(data);
}

// 📌 Calcular métricas
function calcularMetricas(data) {
  const valorTotal = data.reduce(
    (acc, prod) => acc + prod.cantidadProductos * prod.costeProductos,
    0,
  );
  const totalProductos = data.length;
  const bajoStock = data.filter((prod) => prod.cantidadProductos <= 5).length;

  document.getElementById("valorInventario").textContent =
    `$${valorTotal.toLocaleString()}`;
  document.getElementById("totalProductos").textContent = totalProductos;
  document.getElementById("bajoStock").textContent = bajoStock;
}

// 📌 Renderizar tabla con acciones
function renderTabla(data) {
  const tabla = document.getElementById("tablaInventario");
  tabla.innerHTML = "";

  data.forEach((prod) => {
    const fila = document.createElement("tr");
    fila.className = prod.cantidadProductos <= 5 ? "low-stock" : "";

    fila.innerHTML = `
      <td>${prod.nombresProductos}</td>
      <td>${prod.cantidadProductos}</td>
      <td>$${prod.costeProductos}</td>
      <td>
        <button class="btn modificar" onclick="modificarProducto('${prod._id}', '${prod.nombresProductos}', ${prod.cantidadProductos}, ${prod.costeProductos})">Modificar</button>
        <button class="btn visualizar" onclick="visualizarProducto('${prod._id}')">Visualizar</button>
        <button class="btn eliminar" onclick="eliminarProducto('${prod._id}')">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });

  document.getElementById("contador").textContent =
    `Mostrando ${data.length} de ${data.length}`;

  // 🔎 Calcular métricas
  calcularMetricas(data);
}

// 🔄 Acción de Modificar (usa actualizarProveedor)
async function modificarProducto(id, nombre, cantidad, costo) {
  const nuevoNombre = prompt("Nuevo nombre:", nombre);
  const nuevaCantidad = prompt("Nueva cantidad:", cantidad);
  const nuevoCosto = prompt("Nuevo costo:", costo);

  if (nuevoNombre && nuevaCantidad && nuevoCosto) {
    const res = await fetch(`http://localhost:4000/api/proveedores/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombresProductos: nuevoNombre,
        cantidadProductos: parseInt(nuevaCantidad),
        costeProductos: parseFloat(nuevoCosto),
      }),
    });

    if (res.ok) {
      alert("Producto modificado correctamente");
      cargarInventario();
    } else {
      alert("Error al modificar producto");
    }
  }
}

// 👁️ Visualizar producto en modal/card
async function visualizarProducto(id) {
  const res = await fetch(`http://localhost:4000/api/proveedores/${id}`);
  if (res.ok) {
    const prod = await res.json();
    document.getElementById("modalBody").innerHTML = `
      <p><strong>Producto:</strong> ${prod.nombresProductos}</p>
      <p><strong>Cantidad:</strong> ${prod.cantidadProductos}</p>
      <p><strong>Costo:</strong> $${prod.costeProductos}</p>
    `;
    document.getElementById("modalVisualizar").style.display = "flex";
  }
}

// 📌 Cerrar modal
function cerrarModal() {
  document.getElementById("modalVisualizar").style.display = "none";
}

// ❌ Eliminar producto
async function eliminarProducto(id) {
  if (confirm("¿Seguro que quieres eliminar este producto?")) {
    const res = await fetch(`http://localhost:4000/api/proveedores/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      alert("Producto eliminado correctamente");
      cargarInventario();
    } else {
      alert("Error al eliminar producto");
    }
  }
}

// 🔎 Búsqueda en tiempo real
document.getElementById("searchInput").addEventListener("keyup", async (e) => {
  const filtro = e.target.value.trim();

  if (filtro.length > 0) {
    const res = await fetch(
      `http://localhost:4000/api/proveedores/productos/buscar?nombre=${filtro}`,
    );
    if (res.ok) {
      const data = await res.json();
      renderTabla(data);
    } else {
      document.getElementById("tablaInventario").innerHTML =
        "<tr><td colspan='4'>No se encontraron productos</td></tr>";
    }
  } else {
    cargarInventario();
  }
});

// 📌 Inicializar
cargarInventario();
