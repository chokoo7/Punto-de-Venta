const productoSelect = document.getElementById("productoId");
const cantidadInput = document.getElementById("cantidad");
const carritoTabla = document.getElementById("carrito");
const totalCompraSpan = document.getElementById("totalCompra");

// Botón volver al main
const volverBtn = document.createElement("button");
volverBtn.innerText = "← Volver al Main";
volverBtn.className = "volver-btn";
volverBtn.addEventListener("click", () => {
  window.location.href = "Dashboard.html"; // Ajusta si tu main tiene otro nombre
});
document.querySelector(".container").prepend(volverBtn);

let productos = [];
let carrito = [];

// 🔄 Cargar productos desde backend
async function cargarProductos() {
  try {
    const res = await fetch(
      "http://localhost:4000/api/proveedores/productos/lista",
    );
    productos = await res.json();

    productoSelect.innerHTML =
      '<option value="">-- Selecciona un artículo --</option>';
    productos.forEach((p, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${p.nombresProductos} (Stock: ${p.cantidadProductos})`;
      productoSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// ➕ Agregar producto al carrito
document.getElementById("agregarBtn").addEventListener("click", () => {
  const index = productoSelect.value;
  const cantidad = parseInt(cantidadInput.value);

  if (index === "" || cantidad <= 0) {
    alert("Selecciona un producto y cantidad válida");
    return;
  }

  const producto = productos[index];

  if (cantidad > producto.cantidadProductos) {
    alert("No hay suficiente stock disponible");
    return;
  }

  const subtotal = producto.costeProductos * cantidad;

  carrito.push({
    id: producto._id,
    nombre: producto.nombresProductos,
    cantidad,
    costo: producto.costeProductos,
    subtotal,
  });

  renderCarrito();
});

// 🛒 Renderizar carrito y calcular total
function renderCarrito() {
  carritoTabla.innerHTML = "";
  let total = 0;

  carrito.forEach((item) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>$${item.costo}</td>
      <td>$${item.subtotal}</td>
    `;
    carritoTabla.appendChild(fila);
    total += item.subtotal;
  });

  totalCompraSpan.innerText = `$${total.toLocaleString("es-MX")}`;
}

// 💳 Procesar venta (pagar)
document.getElementById("formVenta").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (carrito.length === 0) {
    alert("Agrega productos al carrito antes de pagar");
    return;
  }

  const ticket = document.getElementById("ticket");
  const ticketTitle = document.getElementById("ticketTitle");
  const ticketBody = document.getElementById("ticketBody");
  const totalCaja = document.getElementById("totalCaja");

  try {
    const respuesta = await fetch("http://localhost:4000/api/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos: carrito }),
    });

    const datos = await respuesta.json();

    if (datos.OK) {
      ticket.className = "ticket-box success";
      ticketTitle.innerText = "✓ Venta Exitosa";
      ticketBody.innerHTML = `
        <p><strong>Productos vendidos:</strong></p>
        <ul>
          ${datos.detalleVenta.productos
            .map(
              (item) =>
                `<li>${item.nombreProducto} x${item.cantidad} - $${item.subtotal}</li>`,
            )
            .join("")}
        </ul>
        <p><strong>Total Cobrado:</strong> $${datos.detalleVenta.totalCompra.toLocaleString("es-MX")}</p>
        <p><strong>Fecha:</strong> ${new Date(datos.detalleVenta.fecha).toLocaleString("es-MX")}</p>
      `;
      totalCaja.innerText = `$${datos.totalCajaActual.toLocaleString("es-MX")}`;

      carrito = [];
      renderCarrito();

      // 🔄 Refrescar productos para mostrar stock actualizado
      cargarProductos();
    } else {
      ticket.className = "ticket-box error";
      ticketTitle.innerText = "✕ Error en la Venta";
      ticketBody.innerText = datos.mensaje;
    }
  } catch (error) {
    ticket.className = "ticket-box error";
    ticketTitle.innerText = "✕ Error de Conexión";
    ticketBody.innerText = "No se pudo procesar la venta.";
  }
});

// 🚀 Inicializar
cargarProductos();
