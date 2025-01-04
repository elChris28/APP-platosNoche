document.addEventListener("DOMContentLoaded", () => {
  const mesasContainer = document.getElementById("mesas-container");
  const menuContainer = document.getElementById("menu-container");
  const menuList = document.getElementById("menu-list");
  const cerrarMenu = document.getElementById("cerrar-menu");
  const mesaIdSpan = document.getElementById("mesa-id");
  const platosList = document.getElementById("platos-list");
  const btnOcupado = document.getElementById("btn-ocupado");
  const btnDisponible = document.getElementById("btn-disponible");
  const confirmarPagoButton = document.getElementById("confirmar-pago");
  const limpiarHistorialButton = document.getElementById("limpiar-historial");

  // Conexión al servidor WebSocket
  const socket = new WebSocket('wss://tu-proyecto.up.railway.app');

  // Escuchar mensajes del servidor WebSocket
  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "actualizarMesas") {
      mesas = data.mesas;
      renderMesas();
    }
  });

  let mesas = cargarDatos();
  let historialVentas = cargarHistorial();
  let mesaSeleccionada = null;

  const categoriasPlatos = {
    Platos_CHICOS: [
      { nombre: "Porción de pancita", precio: 13 },
      { nombre: "Porción de anticucho", precio: 13 },
      { nombre: "Porción de rachi", precio: 15 },
      { nombre: "Porción de mollejita", precio: 13 },
      { nombre: "Porción de pancho", precio: 4 },
      { nombre: "1P.Anti", precio: 7 },
    ],
    Platos_CHICOS_CHOCLO: [
      { nombre: "Porción de pancita + choclo", precio: 13.5 },
      { nombre: "Porción de anticucho + choclo", precio: 13.5 },
      { nombre: "Porción de rachi + choclo", precio: 15.5 },
      { nombre: "Porción de mollejita + choclo", precio: 13.5 },
      { nombre: "Porción de pancho + choclo", precio: 4.5 },
      { nombre: "1P.Anti + choclo", precio: 7.5 },
    ],
    Platos_MIXTOS: [
      { nombre: "Pollo a la parrilla", precio: 15 },
      { nombre: "rachi + Mollejita + choclo", precio: 20 },
      { nombre: "pancita + Mollejita + choclo", precio: 17 },
      { nombre: "pancita + rachi + choclo", precio: 17 },
      { nombre: "1P.Anti + Rachi + choclo", precio: 17 },
      { nombre: "1P.Anti +  Mollejita + choclo", precio: 17 },
      { nombre: "1P.Anti + Pancita + choclo", precio: 17 },
      { nombre: "1P.Anti + 2 panchos + Pancita + choclo", precio: 17 },
    ],
    Platos_Completos_1P: [
      { nombre: "1P.Anti + Pancita + Rachi + Mollejita + choclo", precio: 30 },
      { nombre: "1P.Anti + Rachi + Mollejita + choclo", precio: 23 },
      { nombre: "1P.Anti + Pancita + Mollejita + choclo", precio: 23 },
      { nombre: "1P.Anti + Pancita + Rachi + choclo", precio: 23 },
    ],
    Platos_Completos_2P: [
      { nombre: "Pancita + Mollejita + Rachi + choclo", precio: 22 },
      { nombre: "2P.Anti + Mollejita + choclo", precio: 20 },
      { nombre: "2P.Anti + Rachi + choclo", precio: 20 },
      { nombre: "2P.Anti + Pancita + choclo", precio: 20 },
    ],
    Platos_Familares_2: [
      { nombre: "2P.Anti + P. + R. + M. + choclo + Gaseosa 1/2L", precio: 45 },
      { nombre: "3P.Anti + P. + R. + choclo + Gaseosa Personal", precio: 40 },
    ],
    Platos_Familares_4: [
      { nombre: "6P.Anti + P. + R. + M. + choclos + Gaseosa 1L", precio: 55 },
    ],
    Platos_CARTA: [
      { nombre: "LOMO DE CARNE", precio: 13 },
      { nombre: "SALTADO DE POLLO", precio: 12 },
      { nombre: "LOMO DE CARNE A LO POBRE", precio: 16 },
      { nombre: "SALTADO DE POLLO A LO POBRE", precio: 15 },
      { nombre: "BISTECK A LO POBRE", precio: 16 },
      { nombre: "POLLO A LA PLANCHA A LO POBRE", precio: 16 },
      { nombre: "POLLO A LA PLANCHA ", precio: 12 },
      { nombre: "TALLARIN SALTADO DE CARNE", precio: 13 },
      { nombre: "TALLARIN SALTADO DE POLLO", precio: 12 },
    ],
    Platos_CHAUFA: [
      { nombre: "CHAUFA DE POLLO", precio: 10 },
      { nombre: "CHAUFA DE CARNE", precio: 11 },
      { nombre: "CHAUFA DE CARNE Y POLLO", precio: 13 },
    ],
    Platos_SOPAS: [
      { nombre: "MINUTA DE CARNE C/ LECHE", precio: 10 },
      { nombre: "MINUTA DE POLLO C/LECHE", precio: 10 },
      { nombre: "MINUTA DE CARNE Y POLLO C/LECHE", precio: 11 },
      { nombre: "SUSTANCIA DE POLLO ", precio: 9.50 },
      { nombre: "SUSTANCIA DE CARNE ", precio: 9.50 },
      { nombre: "SUSTANCIA DE CARNE Y POLLO", precio: 10 },
      { nombre: "DIETA", precio: 10 },
    ],
    Platos_BROASTER: [
      { nombre: "ALITA + ARROZ + PAPA", precio: 9 },
      { nombre: "ALITA + PAPA", precio: 9 },
      { nombre: "PIERNA + ARROZ + PAPA", precio: 10 },
      { nombre: "PIERNA + PAPA", precio: 10 },
      { nombre: "ENTREPIERNA + ARROZ + PAPA", precio: 10 },
      { nombre: "ENTREPIERNA + PAPA", precio: 10 },
      { nombre: "PECHO + ARROZ + PAPA", precio: 10 },
      { nombre: "PECHO + PAPA", precio: 10 },
      { nombre: "ALITA + ARROZ + PAPA", precio: 10 },
      { nombre: "BROASTER POBRE (PURA PAPA)", precio: 14 },
      { nombre: "BROASTER POBRE (CON ARROZ)", precio: 14 },
      { nombre: "CHICHARRON DE POLLO POBRE (PURA PAPA)", precio: 13 },
      { nombre: "CHICHARRON DE POLLO POBRE (CON ARROZ)", precio: 13 },
      { nombre: "MOSTRITO BROASTER", precio: 11 },
    ],
    Platos_SALCHIPAPAS: [
      { nombre: "CLASICA", precio: 6.5 },
      { nombre: "MIXTA", precio: 9 },
      { nombre: "A LO POBRE", precio: 10 },
      { nombre: "MIXTA A LO POBRE", precio: 11 },
    ],
    BEBIDAS: [
      { nombre: "personal Inka", precio: 2.5 },
      { nombre: "Personal coka kola", precio: 2.5 },
      { nombre: "Gordita", precio: 5 },
      { nombre: "Yumbo", precio: 5 },
      { nombre: "1LT INKA", precio: 7 },
      { nombre: "1LT Coka kola", precio: 7 },
      { nombre: "1 1/2 LT Inka", precio: 9 },
      { nombre: "1 1/2 LT Coka kola", precio: 9 },
      { nombre: "1 Lt Chicha", precio: 7 },
      { nombre: "Café", precio: 2.5 },
      { nombre: "Té", precio: 2 },
      { nombre: "Anis", precio: 2 },
      { nombre: "Manzanilla", precio: 2 },
      { nombre: "Limonada", precio: 6 },
    ],
  };

  function guardarDatos() {
    localStorage.setItem("mesas", JSON.stringify(mesas));
  }

  function cargarDatos() {
    const datos = localStorage.getItem("mesas");
    return datos
      ? JSON.parse(datos)
      : Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          status: "disponible",
          platos: [],
        }));
  }

  function guardarHistorial() {
    localStorage.setItem("historialVentas", JSON.stringify(historialVentas));
  }

  function cargarHistorial() {
    const datos = localStorage.getItem("historialVentas");
    return datos ? JSON.parse(datos) : [];
  }

  function renderMesas() {
    mesasContainer.innerHTML = "";
    mesas.forEach((mesa) => {
      const mesaDiv = document.createElement("div");
      mesaDiv.classList.add("mesa");
      if (mesa.status === "ocupado") {
        mesaDiv.classList.add("occupied");
      }
      mesaDiv.textContent = `Mesa ${mesa.id}`;
      mesaDiv.addEventListener("click", () => abrirMenu(mesa));
      mesasContainer.appendChild(mesaDiv);
    });
  }

  function renderHistorial() {
    const ventasList = document.getElementById("ventas-list");
    ventasList.innerHTML = "";
    historialVentas.forEach((venta, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span><strong>Mesa:</strong> ${venta.mesa}</span>
        <span><strong>Total:</strong> $${venta.total}</span>
        <span><strong>Fecha:</strong> ${venta.fecha}</span>
        <span><strong>Platos:</strong> ${venta.platos.map((p) => p.nombre).join(", ")}</span>
        <button class="btn-eliminar-venta">Eliminar</button>
      `;
      li.querySelector(".btn-eliminar-venta").addEventListener("click", () =>
        eliminarVenta(index)
      );
      ventasList.appendChild(li);
    });

    mostrarTotalVentas();
    guardarHistorial();
  }

  function mostrarTotalVentas() {
    const total = historialVentas.reduce((sum, venta) => sum + venta.total, 0);
    document.getElementById("total-ventas-amount").textContent = `$${total}`;
  }

  function eliminarVenta(index) {
    historialVentas.splice(index, 1);
    guardarHistorial();
    renderHistorial();
    alert("Venta eliminada.");
  }

  limpiarHistorialButton.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas eliminar todo el historial de ventas?")) {
      historialVentas = [];
      guardarHistorial();
      renderHistorial();
      alert("Todo el historial de ventas ha sido eliminado.");
    }
  });

  function abrirMenu(mesa) {
    mesaSeleccionada = mesa;
    mesaIdSpan.textContent = mesa.id;
    renderPlatos();
    menuContainer.classList.remove("hidden");
    menuList.innerHTML = "";

    Object.keys(categoriasPlatos).forEach((categoria) => {
      const button = document.createElement("button");
      button.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
      button.classList.add("btn-categoria");
      button.addEventListener("click", () => mostrarPlatosDeCategoria(categoria));
      menuList.appendChild(button);
    });
  }

  function mostrarPlatosDeCategoria(categoria) {
    menuList.innerHTML = "";
    const volverBtn = document.createElement("button");
    volverBtn.textContent = "Volver a Categorías";
    volverBtn.classList.add("btn-volver");
    volverBtn.addEventListener("click", () => abrirMenu(mesaSeleccionada));
    menuList.appendChild(volverBtn);

    const platos = categoriasPlatos[categoria];
    platos.forEach((plato) => {
      const button = document.createElement("button");
      button.textContent = `${plato.nombre} - $${plato.precio}`;
      button.classList.add("btn-plato");
      button.addEventListener("click", () => asignarPlato(plato));
      menuList.appendChild(button);
    });
  }

  function renderPlatos() {
    platosList.innerHTML = "";
    mesaSeleccionada.platos.forEach((plato, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${plato.nombre} - $${plato.precio}
        <button class="btn-eliminar">Eliminar</button>
      `;
      li.querySelector(".btn-eliminar").addEventListener("click", () => eliminarPlato(index));
      platosList.appendChild(li);
    });

    const total = calcularTotal();
    const totalDiv = document.createElement("div");
    totalDiv.classList.add("total-mesa");
    totalDiv.textContent = `Total: $${total}`;
    platosList.appendChild(totalDiv);
  }

  function calcularTotal() {
    return mesaSeleccionada.platos.reduce((sum, plato) => sum + plato.precio, 0);
  }

  function asignarPlato(plato) {
    mesaSeleccionada.platos.push(plato);
    mesaSeleccionada.status = "ocupado";
    guardarDatos();

    // Enviar datos al servidor WebSocket
    socket.send(
      JSON.stringify({
        type: "actualizarMesas",
        mesas: mesas,
      })
    );

    renderMesas();
    renderPlatos();
    alert(`Asignado "${plato.nombre}" a la Mesa ${mesaSeleccionada.id}`);
  }

  function eliminarPlato(index) {
    mesaSeleccionada.platos.splice(index, 1);
    guardarDatos();
    renderPlatos();
  }

  btnOcupado.addEventListener("click", () => {
    mesaSeleccionada.status = "ocupado";
    guardarDatos();

    socket.send(
      JSON.stringify({
        type: "actualizarMesas",
        mesas: mesas,
      })
    );

    renderMesas();
    alert(`Mesa ${mesaSeleccionada.id} marcada como ocupada`);
  });

  btnDisponible.addEventListener("click", () => {
    mesaSeleccionada.status = "disponible";
    mesaSeleccionada.platos = [];
    guardarDatos();

    socket.send(
      JSON.stringify({
        type: "actualizarMesas",
        mesas: mesas,
      })
    );

    renderMesas();
    renderPlatos();
    alert(`Mesa ${mesaSeleccionada.id} marcada como disponible`);
  });

  confirmarPagoButton.addEventListener("click", () => {
    if (!mesaSeleccionada || mesaSeleccionada.platos.length === 0) {
      alert("No hay platos para pagar.");
      return;
    }

    const total = calcularTotal();

    historialVentas.push({
      mesa: mesaSeleccionada.id,
      total: total,
      platos: [...mesaSeleccionada.platos],
      fecha: new Date().toLocaleString(),
    });

    mesaSeleccionada.status = "disponible";
    mesaSeleccionada.platos = [];
    guardarDatos();

    socket.send(
      JSON.stringify({
        type: "actualizarMesas",
        mesas: mesas,
      })
    );

    renderMesas();
    renderPlatos();
    renderHistorial();
    alert(`Pago confirmado. Total: $${total}`);
  });

  cerrarMenu.addEventListener("click", () => {
    menuContainer.classList.add("hidden");
  });

  renderMesas();
  renderHistorial();
});
