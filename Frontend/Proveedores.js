const form = document.getElementById("form-proveedor");
const cuerpoTabla = document.getElementById("cuerpo-tabla");

let editMode = false;
let editId = null;

// Manejo único del submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const proveedor = {
    nombreProveedor: document.getElementById("nombre").value,
    nombresProductos: document.getElementById("productos").value,
    cantidadProductos: document.getElementById("cantidad").value,
    costeProductos: document.getElementById("total").value,
  };

  if (editMode) {
    // Actualizar proveedor
    try {
      const res = await fetch(
        `http://localhost:4000/api/proveedores/${editId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(proveedor),
        },
      );
      const data = await res.json();
      if (res.ok) {
        alert("Proveedor actualizado correctamente");
        resetForm();
        cargarProveedores();
      } else {
        alert("Error: " + data.mensaje);
      }
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
    }
  } else {
    // Insertar proveedor
    try {
      const res = await fetch("http://localhost:4000/api/proveedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proveedor),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Proveedor guardado correctamente");
        resetForm();
        cargarProveedores();
      } else {
        alert("Error: " + data.mensaje);
      }
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
    }
  }
});

// Mostrar proveedores
async function cargarProveedores() {
  try {
    const res = await fetch("http://localhost:4000/api/proveedores");
    const data = await res.json();
    cuerpoTabla.innerHTML = "";

    data.forEach((p) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p._id}</td>
        <td>${p.nombreProveedor}</td>
        <td>${p.nombresProductos}</td>
        <td>${p.cantidadProductos}</td>
        <td>$${p.costeProductos}</td>
        <td>
          <button class="btn editar" data-id="${p._id}">Editar</button>
          <button class="btn eliminar" data-id="${p._id}">Eliminar</button>
        </td>
      `;
      cuerpoTabla.appendChild(fila);
    });

    // Eventos
    document.querySelectorAll(".eliminar").forEach((btn) => {
      btn.addEventListener("click", () => eliminarProveedor(btn.dataset.id));
    });
    document.querySelectorAll(".editar").forEach((btn) => {
      btn.addEventListener("click", () => editarProveedor(btn.dataset.id));
    });
  } catch (error) {
    console.error("Error al cargar proveedores:", error);
  }
}

// Eliminar proveedor
async function eliminarProveedor(id) {
  if (!confirm("¿Seguro que deseas eliminar este proveedor?")) return;
  try {
    const res = await fetch(`http://localhost:4000/api/proveedores/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.mensaje);
      cargarProveedores();
    } else {
      alert("Error: " + data.mensaje);
    }
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
  }
}

// Editar proveedor
async function editarProveedor(id) {
  try {
    const res = await fetch(`http://localhost:4000/api/proveedores/${id}`);
    const proveedor = await res.json();

    document.getElementById("nombre").value = proveedor.nombreProveedor;
    document.getElementById("productos").value = proveedor.nombresProductos;
    document.getElementById("cantidad").value = proveedor.cantidadProductos;
    document.getElementById("total").value = proveedor.costeProductos;

    editMode = true;
    editId = id;
  } catch (error) {
    console.error("Error al editar proveedor:", error);
  }
}

// Resetear formulario
function resetForm() {
  form.reset();
  editMode = false;
  editId = null;
}

cargarProveedores();
