let materiasElegidas = [];
let creditosAcumulados = 0;

$(document).ready(function () {
    $('input[name=mat]').each(function () {
        let materiaId = $(this).val();
        if (materiaId !== undefined) {
            materiasElegidas.push(materiaId);
        }
    });
});

$(document).on('click', '.materia', function (materia) {
    let materiaSeleccionada = materia?.currentTarget;
    let materiaHijos = materiaSeleccionada.children;
    let materiaId = materiaSeleccionada?.id;
    let credito = $(materiaHijos?.credito).text();
    let nombre = $(materiaHijos?.nombre).text();
    let tipo = $(materiaHijos[3]?.children?.oportunidad).text();
    let oportunidad = tipo == '' ? 0 : tipo;
    let nombreOportunidad = tipoNombre(oportunidad);
    let condicion = $(materiaHijos[9].children?.condicion).text();
    //let maxMaterias         = Number($("#maxmat").text());
    //let maxCreditos         = Number($("#maxcre").text());
    let creditosAcumulados = Number($("#creditosFinales").text()) + Number(credito);
    if (materiaId !== undefined) {
        if (!findElement(materiasElegidas, materiaId) && materiasElegidas.length < maxMaterias && creditosAcumulados <= maxCreditos) {
            var htmlTags =
                '<tr>' +
                '<td class="materiaBorrar" data-materia="' + materiaId + '" data-creditos="' + credito + '"><i class="fa-solid fa-trash"></i></td>' +
                '<td><input type="hidden" name="mat" value="' + materiaId + '" />' + materiaId + '</td>' +
                '<td>' + nombre + '</td>' +
                '<td><input type="hidden" name="tca" value="' + nombreOportunidad + '">' + nombreOportunidad + '</td>' +
                '<td style="padding: 0 0 0 0;"><select name="tur" class="form-control" size="1"><option value="M">MATUTINO</option><option value="V">VESPERTINO</option><option value="X">MIXTO</option></select></td>' +
                '<td class="creditosSeleccionados">' + credito + '</td>' +
                '<td><input type="hidden" name="con" value="' + condicion + '">' + condicion + '</td>' +
                '</tr>';
            $("#materiasSeleccionadas tbody tr:last-child").before(htmlTags);
            seleccionado(materiaSeleccionada);
            materiasElegidas.push(materiaId);
        }
    }
    creditosFinales();
    if (materiasElegidas.length == maxMaterias) {
        Swal.fire(
            'M&aacute;ximo de materias',
            'Ya no puede seleccionar m&aacute;s materias, porque excede un m&aacute;ximo de <b>' + maxMaterias + '</b> materias.',
            'error'
        )
    }
    if (creditosAcumulados > maxCreditos) {
        Swal.fire(
            'M&aacute;ximo de cr&eacute;ditos',
            'Ya no puede seleccionar m&aacute;s materias, porque excede un m&aacute;ximo de <b>' + maxCreditos + '</b> cr&eacute;ditos.',
            'error'
        )
    }
});

function creditosFinales() {
    let final = 0;
    let creditosFinales = $("#creditosFinales");
    let creditosOriginal = Number(creditosFinales.text());
    let creditosVal = Number(creditosFinales.text());
    if (creditosVal !== 0 && creditosOriginal !== creditosVal) {
        final += creditosVal;
    }
    $('.creditosSeleccionados').each(function () {
        let creditos = $(this).text();
        if (creditos !== undefined) {
            final += Number(creditos);
        }
    });
    creditosFinales.text(final);
}

function tipoNombre(id) {
    let posicion = Number(id);
    const nombres = ['N', 'R', 'R', 'R', 'E', 'E'];
    return nombres[posicion];
}

const findElement = (array, searched) => {
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element === searched) {
            return true;
        }
    }
    return false;
}

$(document).on('click', '.materiaBorrar', function (event) {
    event.preventDefault();
    let materiaSeleccionada = event?.currentTarget?.dataset;
    let materiaId = materiaSeleccionada?.materia;
    let materiaCreditos = materiaSeleccionada?.creditos;
    let creditos = Number(materiaCreditos);
    if (materiaId !== undefined) {
        $(this).closest('tr').remove();
        elegible($("#" + materiaId));
        creditosAcumulados -= creditos;
        materiasElegidas = materiasElegidas.filter((item) => item !== materiaId);
    }
    creditosFinales();
});

function seleccionado(element) {
    let materia = $(element).children('.elegible');
    if ($(materia).hasClass('elegible')) {
        $(materia).removeClass('elegible');
        $(materia).addClass('seleccionado');
    }
}

function elegible(element) {
    let materia = $(element).children('.seleccionado');
    if ($(materia).hasClass('seleccionado')) {
        $(materia).removeClass('seleccionado');
        $(materia).addClass('elegible');
    }
}

function enviar() {
    event.preventDefault();
    Swal.fire({
        title: "&iquest;Seguro de guardar tu Encuesta de Materias?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: "No",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
    }).then((result) => {
        if (result.value) {
            document.forma1.submit();
        }
        return false;
    });
}