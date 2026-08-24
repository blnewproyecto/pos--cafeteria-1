// Catálogo de bebidas
const productos = [
  { id: 1, nombre: '01. Espresso Tonic', precio: 55, cafeGramos: 18, mlLeche: 0 },
  { id: 2, nombre: '02. Cold Brew Citrus', precio: 60, cafeGramos: 20, mlLeche: 0 },
  { id: 22, nombre: '22. Cappuccino', precio: 50, cafeGramos: 18, mlLeche: 180 },
  { id: 25, nombre: '25. Mocha Artesanal', precio: 65, cafeGramos: 18, mlLeche: 200 },
  { id: 29, nombre: '29. Matcha Latte', precio: 60, cafeGramos: 0, mlLeche: 220 }
];

// Inicializar inventario en localStorage si no existe
if (!localStorage.getItem('inventario')) {
  const stockInicial = { cafeGramos: 5000, mlLeche: 10000 };
  localStorage.setItem('inventario', JSON.stringify(stockInicial));
}

let carrito = [];
let productoSeleccionado = null;

// Elementos HTML
const gridProductos = document.getElementById('gridProductos');
const listaCarrito = document.getElementById('listaCarrito');
const totalTxt = document.getElementById('totalTxt');
const btnCobrar = document.getElementById('btnCobrar');

const modalOverlay = document.getElementById('modalOverlay');
const modalTitulo = document.getElementById('modalTitulo');
const selectLeche = document.getElementById('selectLeche');
const inputNotas = document.getElementById('inputNotas');
const btnCancelar = document.getElementById('btnCancelar');
const btnAgregar = document.getElementById('btnAgregar');

function cargarCatalogo() {
  gridProductos.innerHTML = '';
  productos.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'card-producto';
    card.innerHTML = `<strong>${prod.nombre}</strong><div>$${prod.precio}</div>`;
    card.onclick = () => abrirModal(prod);
    gridProductos.appendChild(card);
  });
}

function abrirModal(prod) {
  productoSeleccionado = prod;
  modalTitulo.innerText = prod.nombre;
  inputNotas.value = '';
  modalOverlay.style.display = 'flex';
}

btnCancelar.onclick = () => modalOverlay.style.display = 'none';

btnAgregar.onclick = () => {
  const leche = selectLeche.value;
  const extraLeche = leche.includes('+$10') ? 10 : 0;
  
  carrito.push({
    idUnico: Date.now(),
    productoId: productoSeleccionado.id,
    nombre: productoSeleccionado.nombre,
    precio: productoSeleccionado.precio + extraLeche,
    leche: leche,
    notas: inputNotas.value,
    cafeGramos: productoSeleccionado.cafeGramos,
    mlLeche: productoSeleccionado.mlLeche
  });

  modalOverlay.style.display = 'none';
  actualizarCarrito();
};

function actualizarCarrito() {
  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<p class="vacio">No hay bebidas en la orden</p>';
    btnCobrar.disabled = true;
    totalTxt.innerText = '$0';
    return;
  }

  listaCarrito.innerHTML = '';
  let total = 0;

  carrito.forEach(item => {
    total += item.precio;
    const div = document.createElement('div');
    div.className = 'item-carrito';
    div.innerHTML = `
      <div><strong>${item.nombre}</strong> - $${item.precio}</div>
      <small>• ${item.leche}</small>
      ${item.notas ? `<br><small>• Nota: ${item.notas}</small>` : ''}
    `;
    listaCarrito.appendChild(div);
  });

  totalTxt.innerText = `$${total}`;
  btnCobrar.disabled = false;
}

// COBRAR, DESCONTAR INVENTARIO E IMPRIMIR TICKET
btnCobrar.onclick = () => {
  const totalVenta = carrito.reduce((sum, item) => sum + item.precio, 0);

  // 1. Descontar Insumos
  let inventario = JSON.parse(localStorage.getItem('inventario'));
  carrito.forEach(item => {
    inventario.cafeGramos -= item.cafeGramos;
    inventario.mlLeche -= item.mlLeche;
  });
  localStorage.setItem('inventario', JSON.stringify(inventario));

  function imprimirTicket(items, total) {
  const ventana = window.open('', '', 'width=300,height=500');
  ventana.document.write(`
    <html>
      <head>
        <style>
          body { font-family: monospace; width: 58mm; padding: 5px; margin: 0; }
          .centro { text-align: center; }
          .linea { border-bottom: 1px dashed #000; margin: 5px 0; }
          .flex { display: flex; justify-content: space-between; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="centro">
          <strong>CAFETERÍA DE ESPECIALIDAD</strong><br>
          Ticket de Venta
        </div>
        <div class="linea"></div>
        ${items.map(i => `
          <div class="flex"><span>${i.nombre}</span><span>$${i.precio}</span></div>
          <small>• ${i.leche}</small><br>
        `).join('')}
        <div class="linea"></div>
        <div class="flex">
          <span>TOTAL:</span>
          <span>$${total}</span>
        </div>
        <div class="linea"></div>
        <div class="centro"><br>¡Gracias por tu compra!</div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `);
  ventana.document.close();
}

  // 3. Limpiar Orden
  carrito = [];
  actualizarCarrito();
};

function imprimirTicket(items, total) {
  const ventana = window.open('', '', 'width=300,height=500');
  ventana.document.write(`
    <html>
      <head>
        <style>
          body { font-family: monospace; width: 58mm; padding: 5px; margin: 0; }
          .centro { text-align: center; }
          .linea { border-bottom: 1px dashed #000; margin: 5px 0; }
          .flex { display: flex; justify-content: space-between; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="centro">
          <strong>CAFETERÍA DE ESPECIALIDAD</strong><br>
          Ticket de Venta
        </div>
        <div class="linea"></div>
        ${items.map(i => `
          <div class="flex"><span>${i.nombre}</span><span>$${i.precio}</span></div>
          <small>• ${i.leche}</small><br>
        `).join('')}
        <div class="linea"></div>
        <div class="flex">
          <span>TOTAL:</span>
          <span>$${total}</span>
        </div>
        <div class="linea"></div>
        <div class="centro"><br>¡Gracias por tu compra!</div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `);
  ventana.document.close();
}
cargarCatalogo();
