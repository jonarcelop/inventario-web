const form = document.getElementById('form-producto');
const tablaBody = document.querySelector('#tabla-inventario tbody');
const ctx = document.getElementById('grafica').getContext('2d');

let chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Cantidad disponible',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.7)'
    }]
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  }
});

// Obtener productos existentes al cargar
function cargarProductos() {
  fetch('obtener_productos.php')
    .then(res => res.json())
    .then(productos => {
      tablaBody.innerHTML = '';
      chart.data.labels = [];
      chart.data.datasets[0].data = [];

      productos.forEach(p => {
        agregarProductoTabla(p);
        agregarProductoGrafica(p);
      });

      chart.update();
    });
}

function agregarProductoTabla(producto) {
  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td>${producto.nombre}</td>
    <td>${producto.cantidad}</td>
    <td>$${producto.precio.toFixed(2)}</td>
  `;
  tablaBody.appendChild(fila);
}

function agregarProductoGrafica(producto) {
  chart.data.labels.push(producto.nombre);
  chart.data.datasets[0].data.push(producto.cantidad);
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const nuevoProducto = {
    nombre: document.getElementById('nombre').value,
    cantidad: parseInt(document.getElementById('cantidad').value),
    precio: parseFloat(document.getElementById('precio').value)
  };

  fetch('guardar_producto.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoProducto)
  })
    .then(res => res.json())
    .then(respuesta => {
      if (respuesta.success) {
        agregarProductoTabla(nuevoProducto);
        agregarProductoGrafica(nuevoProducto);
        chart.update();
        form.reset();
      } else {
        alert('Error al guardar el producto');
      }
    });
});

cargarProductos();
