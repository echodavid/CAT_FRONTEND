const url = API_URL + "/cats";

function postCat() {
  const myCat = {
    name: $('#name').val(),
    breed: $('#breed').val(),
    age: $('#age').val(),
    color: $('#color').val(),
    image_url: $('#image_url').val(),
    description: $('#description').val(),
  };

  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(myCat),
    success: function (data) {
      console.log("Gato creado:", data);
      showAlert("¡Gato creado exitosamente!", "success");
      clearForm();
      getCats();
    },
    error: function () {
      showAlert("Error al crear el gato. Inténtalo de nuevo.", "danger");
    },
  });
}

function deleteCat(catId) {
  if (!confirm("¿Estás seguro de que deseas eliminar este gato?")) return;

  $.ajax({
    url: `${url}/${catId}`,
    type: 'DELETE',
    success: function (data) {
      console.log("Gato eliminado:", data);
      showAlert("¡Gato eliminado exitosamente!", "success");
      getCats();
    },
    error: function () {
      showAlert("Error al eliminar el gato. Inténtalo de nuevo.", "danger");
    },
  });
}

function updateCat() {
  const myId = $('#id').val();
  const myCat = {
    name: $('#name').val(),
    breed: $('#breed').val(),
    age: $('#age').val(),
    color: $('#color').val(),
    image_url: $('#image_url').val(),
    description: $('#description').val(),
  };

  $.ajax({
    url: `${url}/${myId}`,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(myCat),
    success: function (data) {
      console.log("Gato actualizado:", data);
      showAlert("¡Gato actualizado exitosamente!", "success");
      clearForm();
      getCats();
    },
    error: function () {
      showAlert("Error al actualizar el gato. Inténtalo de nuevo.", "danger");
    },
  });
}
function getCats() {
  $.getJSON(url, function (json) {
    console.log("Gatos obtenidos:", json);

    const arrCats = json.cats;
    let htmlRows = '';

    if (arrCats.length === 0) {
      htmlRows = `
        <tr>
          <td colspan="7" class="text-center">No se encontraron gatos</td>
        </tr>`;
    } else {
      arrCats.forEach(function (item) {
        htmlRows += `
          <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.breed}</td>
            <td>${item.age}</td>
            <td>${item.color}</td>
            <td>
              ${item.image_url ? `<img src="${item.image_url}" alt="Imagen de ${item.name}" style="width: 50px; height: 50px; object-fit: cover; cursor: pointer;" onclick="showImageModal('${item.image_url}', '${item.name}')">` : 'Sin imagen'}
            </td>
            <td>${item.description || 'Sin descripción'}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="prepareUpdate(${item.id})">Actualizar</button>
              <button class="btn btn-danger btn-sm" onclick="deleteCat(${item.id})">Eliminar</button>
            </td>
          </tr>`;
      });
    }

    $('#resultado-body').html(htmlRows);
  }).fail(function () {
    $('#resultado-body').html(`
      <tr>
        <td colspan="7" class="text-center text-danger">Error al obtener los gatos</td>
      </tr>`);
  });
}

function showImageModal(imageUrl, name) {
  const modalHtml = `
    <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="imageModalLabel">Imagen de ${name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body text-center">
            <img src="${imageUrl}" alt="Imagen de ${name}" class="img-fluid">
          </div>
        </div>
      </div>
    </div>`;

  // Append the modal to the body and show it
  $('body').append(modalHtml);
  const modal = new bootstrap.Modal($('#imageModal')[0]);
  modal.show();

  // Remove the modal from the DOM after it's hidden
  $('#imageModal').on('hidden.bs.modal', function () {
    $(this).remove();
  });
}

function prepareUpdate(catId) {
  console.log("Preparando para actualizar gato con ID:", catId);

  $.ajax({
    url: `${url}/${catId}`,
    type: 'GET',
    success: function (data) {
      console.log("Gato obtenido para actualización:", data);

      const cat = data.cat;

      $('#id').val(cat.id);
      $('#name').val(cat.name);
      $('#breed').val(cat.breed);
      $('#age').val(cat.age);
      $('#color').val(cat.color);
      $('#image_url').val(cat.image_url);
      $('#description').val(cat.description);

      $('#catModal').modal('show');

      showAlert("Datos del gato cargados para edición.", "info");
    },
    error: function () {
      showAlert("Error al obtener el gato para actualización. Inténtalo de nuevo.", "danger");
    },
  });
}

function showAlert(message, type) {
  const toastHtml = `
    <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
      </div>
    </div>`;
  
  $('#toast-container').append(toastHtml);

  const toastElement = $('#toast-container .toast').last();
  const toast = new bootstrap.Toast(toastElement[0]);
  toast.show();
}

function clearForm() {
  $('#id').val('');
  $('#name').val('');
  $('#breed').val('');
  $('#age').val('');
  $('#color').val('');
  $('#image_url').val('');
  $('#description').val('');
  $('#catModal').modal('hide');
}

function saveCat() {
  const catId = $('#id').val();
  if (catId) {
    updateCat();
  } else {
    postCat();
  }
}