let materiasElegidas   = [];
let creditosAcumulados = 0;
let nombre             = '';
let nombreOportunidad  = '';
let credito            = 0;
let materiasEspecial   = [];
let materiasRepite     = [];
let materiaClave       = '';
let N                  = [];
let R                  = [];
let E                  = [];
let hlu                = [];
let hma                = [];
let hmi                = [];
let hju                = [];
let hvi                = [];
let hsa                = [];
let hdo                = [];
const tdStyle          = ' background-image: repeating-linear-gradient(45deg, #f8f9fa00 10px, #f8f9fa00 12px, #f8f9fa 20px, #f8f9fa 20px);';
semestre0              = [];
semestre1              = [];
semestre2              = [];
semestre3              = [];
semestre4              = [];
semestre5              = [];
semestre6              = [];
semestre7              = [];
semestre8              = [];
semestre9              = [];
semestre10             = [];
residencia             = false;
residenciaExiste       = false;
servicio               = false;
validador              = true;

$(document).ready(function () {
    $('.materia').each(function () {
        let materiaSeleccionada = $(this);
        let materiaId           = materiaSeleccionada.attr('id');
        let semestre            = materiaSeleccionada[0].cellIndex;
        let materiaHijos        = $(materiaSeleccionada.children());
        let name                = $(materiaHijos[2]).text().trim().split(' ');
        let tipo                = $(materiaHijos[3]?.children?.oportunidad).text();
        let oportunidad         = tipo == '' ? 0 : tipo;
        oportunidad             = Number(oportunidad);
        const nombres           = ['N', 'R', 'R', 'R', 'E', 'E'];
        let seleccionado        = nombres[oportunidad];
        if(seleccionado === 'N'){
            N.push(materiaId);
        }
        if(seleccionado === 'R'){
            R.push(materiaId);
        }
        if(seleccionado === 'E'){
            E.push(materiaId);
        }
        materiaSemestre(semestre, materiaId);
        if(name[0].localeCompare('RESIDENCIA') === 0) {
            residenciaExiste = true;
        }
    });
    $('input[name=mat]').each(function () {
        let materiaId = $(this).val().split(',');
        materiaId     = materiaId[0];
        if (materiaId !== undefined) {
            let tipo = $(this).next()[0];
            if(tipo == undefined) {
                materiasElegidas.push(materiaId);
                let oportunidad = $(this).parent().parent().children()[4];
                oportunidad     = $(oportunidad).children().attr('value');
                if(oportunidad === 'E') {
                    materiasEspecial.push(materiaId);
                }
                if(oportunidad === 'R') {
                    materiasRepite.push(materiaId);
                }
                materiaSemestreEliminar(materiaId);
            }
        }
    });
    $('#materiasSeleccionadas tr').each(function () {
        let materiaSele = this.children;
        if($(this).find('.creditosseleccionados').length === 1){
            let materiaClave = $(materiaSele[1]).text();
            let materia      = $("#"+materiaClave);
            creditosAcumulados += Number($(materiaSele[3]).text());
            let materiaNombre = $(materiaSele[2]).text();
            servicioActivo(materiaNombre);
            residenciaActiva(materiaNombre);
            //Linea para quitar los iconos de borrar al recargar la pagina
            /*if((findElement(E, materiaClave) && E.length < 3) || (findElement(R, materiaClave) && R.length < 4)){
                const td = document.createElement("td");
                this.replaceChild(td, this.firstChild)
            }*/
            if(materia.length === 1){
                materia.attr('style', materia.attr('style')+tdStyle);
            }
            agregarCruces(hlu, $(materiaSele[11]).text().slice(0,8));
            agregarCruces(hma, $(materiaSele[12]).text().slice(0,8));
            agregarCruces(hmi, $(materiaSele[13]).text().slice(0,8));
            agregarCruces(hju, $(materiaSele[14]).text().slice(0,8));
            agregarCruces(hvi, $(materiaSele[15]).text().slice(0,8));
            agregarCruces(hsa, $(materiaSele[16]).text().slice(0,8));
            agregarCruces(hdo, $(materiaSele[17]).text().slice(0,8));
        }
    });
    
});

$(document).on('click', '.materia', function (materia) {
    let materiaSeleccionada = materia?.currentTarget;
    let semestre = materiaSeleccionada.cellIndex;
    let materiaHijos = materiaSeleccionada.children;
    let materiaId = materiaSeleccionada?.id;
    materiaClave   = materiaId;
    credito = $(materiaHijos?.credito).text();
    nombre = $(materiaHijos?.nombre).text();
    let tipo = $(materiaHijos[3]?.children?.oportunidad).text();
    let oportunidad = tipo == '' ? 0 : tipo;
    nombreOportunidad = tipoNombre(oportunidad);
    let condicion = $(materiaHijos[9].children?.condicion).text();
    let maxMateriasV         = Number($("#maxmat").text());
    let maxCreditosV         = Number($("#maxcre").text());
    let minCreditosV         = Number($("#mincre").text());
    let maxCrucesV           = $("#maxcru").text().trim();
    if(servicio) {
        let maxCreditosServicio = maxCreditos;
        let maxCreditosServicioV = maxCreditosV;
        if(validador) {
            if(maxCreditosServicio !== maxCreditos - 10) {
                maxCreditos = maxCreditos + 10;
            }
            validador = false;
        }
        if(maxCreditos - 10 === maxCreditosV) {
            maxCreditosV = maxCreditosV + 10
        }
    }
    if(maxMaterias != maxMateriasV) {
        maxMaterias = 0;
    }
    if(maxCreditos != maxCreditosV) {
        maxCreditos = 0;
    }
    if(minCreditos != minCreditosV) {
        minCreditos = 20;
    }
    if(Number(maxCruces) !== Number(maxCrucesV)) {
        maxCruces = '0000';
    }
    let control  = $('input[name=Control]').val();
    let password = $('input[name=Password]').val();
    let psie     = $('input[name=psie]').val();
    creditosAcumulados = Number($("#creditosFinales").text()) + Number(credito);
    let materiasOrden = true;
    if (materiaId !== undefined) {
        if(!findArray(materiasElegidas, E) && !findElement(E, materiaId)) {
            materiasOrden = false;
            Swal.fire(
                'Materias de Especial',
                'No puede seleccionar la materia: <b>'+materiaId+'</b>, porque tienes materias de especial sin elegir.',
                'error'
            )
        }
        if(findArray(materiasElegidas, E) && !findArray(materiasElegidas, R) && !findElement(R, materiaId)) {
            materiasOrden = false;
            Swal.fire(
                'Materias de Repetici&oacute;n',
                'No puede seleccionar la materia: <b>'+materiaId+'</b>, porque tienes materias de repetici&oacute;n sin elegir.',
                'error'
            )
        }
        if(materiasEspecial.length > 1){
            materiasOrden = false;
            Swal.fire(
                'Materias Especiales',
                'No puede seleccionar la materia: <b>'+materiaId+'</b>, porque solo puedes seleccionar un m&aacute;ximo de 2 materias de especial.',
                'error'
            )
        }
        if(materiasEspecial.length > 0 && nombre.trim().localeCompare('RESIDENCIA') === 0){
            materiasOrden = false;
            Swal.fire(
                'Materias Especiales',
                'No puede seleccionar Residencia, porque adueda materia(s) de especial.',
                'error'
            )
        }
        /*if(materiasRepite.length > 1 && creditosAcumulados > minCreditos){
            materiasOrden = false;
            Swal.fire(
                'Materias Repite',
                'No puede seleccionar la materia: <b>'+materiaId+'</b>, porque solo puedes seleccionar un m&aacute;ximo de <b>'+minCreditos+'</b> cr&eacute;ditos por contar con <b>'+materiasRepite.length+'</b> materia(s) en repetici&oacute;n.',
                'error'
            )
        }*/
        if(E.length == materiasEspecial.length && R.length == materiasRepite.length && validarSemestre(materiaId, semestre, nombre)) {
            materiasOrden = false;
            Swal.fire(
                'Materias Faltantes',
                'No puede seleccionar la materia: <b>'+materiaId+'</b>, porque a&uacute;n te faltan materias de semestres anteriores.',
                'error'
            )
        }
        if (materiasOrden && !findElement(materiasElegidas, materiaId) && materiasElegidas.length < maxMaterias && creditosAcumulados <= (maxCreditos+2)) {
            $.ajax({
                url: '/cgi-bin/sie.pl',
                method: 'GET',
                data: {
                    Opc          : 'ESTREINSCRGET',
                    Control      : control,
					Password     : password,
                    Materia      : materiaId,
                    psie         : psie,
                    dummy        : 0
                },
                success: function (resp) {
                    Swal.fire({
                        title: '<strong>Grupos Disponibles</strong>',
                        width: '95%',
                        icon: 'success',
                        html: '<html lang="es"><head><meta charset="iso-8859-15"></head><body>'+resp+'</body></html>',
                        showCloseButton: true
                    });
                    if($("#noDisponible").length > 0) {
                        materiaSemestreEliminar(materiaClave);
                        if(findElement(E, materiaId)) {
                            E = E.filter((item) => item !== materiaId);
                        }
                        if(findElement(R, materiaId)) {
                            R = R.filter((item) => item !== materiaId);
                        }
                    }
                },
                error: function () {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ocurri&oacute; un error!',
                    })
                }
            });
        }
    }
    creditosFinales();
    if(findElement(materiasElegidas, materiaId)){
        Swal.fire(
            'Materia: '+materiaId,
            'Ya no puede seleccionar la materia: <b>'+materiaId+'</b>, porque ya se encuentra en tu lista de materias.',
            'error'
        )
    }
    if (materiasElegidas.length == maxMaterias || maxMaterias != maxMateriasV) {
        Swal.fire(
            'M&aacute;ximo de materias',
            'Ya no puede seleccionar m&aacute;s materias, porque excede un m&aacute;ximo de <b>' + maxMaterias + '</b> materias.',
            'error'
        )
    }
    if (creditosAcumulados > (maxCreditos+2) || (maxCreditos + 2) != (maxCreditosV + 2)) {
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
        let table = $(this).parent().parent().parent()[0].id;
        if(table == 'materiasSeleccionadas') {
            let creditos = $(this).text();
            if (creditos !== undefined) {
                final += Number(creditos);
            }
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

const findArray = (array1, array2) => {
    let iguales=0;
    for(let i=0;i<array1.length;i++)
    {
        for(let j=0;j<array2.length;j++)
        {
            if(array1[i]==array2[j])
                iguales++;
        }
    }
    return array2.length == iguales;
}

$(document).on('click', '.materiaBorrar', function (event) {
    event.preventDefault();
    let materiaSeleccionada = event?.currentTarget?.dataset;
    let materiaId = materiaSeleccionada?.materia;
    let materiaCreditos = materiaSeleccionada?.creditos;
    let creditos = Number(materiaCreditos);
    if (materiaId !== undefined) {
        $(this).closest('tr').remove();
        let materiaEle    = $("#" + materiaId);
        let semestre      = materiaEle[0].cellIndex;
        let materiaHijos  = materiaEle[0].children; 
        let materiaNombre = $(materiaHijos.nombre).text()
        elegible(materiaEle);
        if(materiaEle.length === 1){
            materiaEle.attr('style', materiaEle.attr('style').split(tdStyle)[0]);
        }
        creditosAcumulados -= creditos;
        materiasElegidas = materiasElegidas.filter((item) => item !== materiaId);
        servicioInactivo(materiaNombre)
        residenciaInactiva(materiaNombre)
        restarCruces(event.currentTarget.parentNode.children);
        if(findElement(E, materiaId)) {
            materiasEspecial = materiasEspecial.filter((item) => item !== materiaId);
        }
        if(findElement(R, materiaId)) {
            materiasRepite = materiasRepite.filter((item) => item !== materiaId);
        }
        materiaSemestre(semestre, materiaId)
    }
    creditosFinales();
});

$(document).on('click', '.materiaAgregar', function (event) {
    event.preventDefault();
    let grupoSeleccionado = event?.currentTarget?.dataset;
    let grupoId           = grupoSeleccionado?.grupo;
    let materiaSel        = event.currentTarget.parentNode.children;
    let dis               =  $(materiaSel.jdis).text();
    let bas               =  $(materiaSel.jbas).text();
    let pla               =  $(materiaSel.jpla).text();
    let paq               =  $(materiaSel.jpaq).text();
    let spd               =  $(materiaSel.jspd).text();
    let lun               =  $(materiaSel.jlun).text();
    let mar               =  $(materiaSel.jmar).text();
    let mie               =  $(materiaSel.jmie).text();
    let jue               =  $(materiaSel.jjue).text();
    let vie               =  $(materiaSel.jvie).text();
    let sab               =  $(materiaSel.jsab).text();
    let dom               =  $(materiaSel.jdom).text();
    let doc               =  $(materiaSel.jdoc).text();
    if (materiaClave !== undefined && !findElement(materiasElegidas, materiaClave)) {
        if(!Cruces(materiaSel)) {
            let borrar = '<td class="materiaBorrar" data-materia="' + materiaClave + '" data-creditos="' + credito + '"><i class="fa-solid fa-trash"></i></td>';
            /*if((findElement(E, materiaClave) && E.length < 3) || (findElement(R, materiaClave) && R.length < 4)){
                borrar = '<td></td>';
            }*/
            let htmlTags =
                '<tr>' +
                borrar+
                '<td><input type="hidden" name="mat" value="' + materiaClave+','+grupoId+'?' + nombreOportunidad+'" />' + materiaClave + '</td>' +
                '<td>' + nombre + '</td>' +
                '<td class="creditosSeleccionados">' + credito + '</td>' +
                '<td><input type="hidden" name="tca" value="' + nombreOportunidad + '">' + nombreOportunidad + '</td>' +
                '<td>' + grupoId + '</td>' +
                '<td>'+disponibleColor(dis)+'</td>' +
                '<td>'+bas+'</td>' +
                '<td>'+pla+'</td>' +
                '<td>'+paq+'</td>' +
                '<td>'+spd+'</td>' +
                '<td>'+lun+'</td>' +
                '<td>'+mar+'</td>' +
                '<td>'+mie+'</td>' +
                '<td>'+jue+'</td>' +
                '<td>'+vie+'</td>' +
                '<td>'+sab+'</td>' +
                '<td>'+dom+'</td>' +
                '<td>'+doc+'</td>' +
                '</tr>';
            $("#materiasSeleccionadas tbody tr:last-child").before(htmlTags);
            let materiaEle = $("#" + materiaClave);
            seleccionado(materiaEle);
            materiasElegidas.push(materiaClave);
            if(findElement(materiasElegidas, materiaClave)){
                if(materiaEle.length === 1){
                    materiaEle.attr('style', materiaEle.attr('style')+tdStyle);
                }
                $(".materiaAgregar").each(function(index) {
                    $(this).removeClass('materiaAgregar');
                });
                if(findElement(E, materiaClave)) {
                    materiasEspecial.push(materiaClave);
                }
                if(findElement(R, materiaClave)) {
                    materiasRepite.push(materiaClave);
                }
                materiaSemestreEliminar(materiaClave);
                servicioActivo(nombre);
                residenciaActiva(nombre);
                Swal.close();
            }
        } else {
            let maxCrucesHr = maxCruces.slice(0,2)+':'+maxCruces.slice(2,4);
            Swal.fire(
                'M&aacute;ximo de cruces',
                'Ya no puede seleccionar el grupo <b>'+grupoId+'</b><br>de la materia <b>'+materiaClave+'</b>, porque se exceder&iacute;a <br>el m&aacute;ximo de <b>' + maxCrucesHr + 'hr(s)</b> de cruces de horario.',
                'error'
            )
        }
    } else {
        Swal.fire(
            'Materia',
            'Ya elegiste previamente la materia con clave: <b>'+materiaClave+'</b>',
            'error'
        )
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
        title: "&iquest;Seguro de guardar tus materias seleccionadas para reinscripci&oacute;n?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: "Cancelar",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
    }).then((result) => {
        if (result.value) {
            let numMaterias  = semestre0.length + semestre1.length + semestre2.length + semestre3.length + semestre4.length + semestre5.length + semestre6.length + semestre7.length + semestre8.length + semestre9.length + semestre10.length;
            let repiteFaltantes = R.length;
            let materiasOrden   = false;
            let semestreDesorden = 0;
            $('#materiasSeleccionadas tr').each(function () {
                if($(this).find('.creditosseleccionados').length === 1){
                    let materiaId = $(this.children[1]).text();
                    let tipo      = $(this.children[4]).text();
                    if(tipo == "R") {
                        repiteFaltantes--;
                    }
                    if(validarSemestreFaltante(materiaId, tipo)) {
                        semestreDesorden++;
                    }
                }
            });
            if(semestreDesorden > 0) {
                materiasOrden = true;
            }
            if(residenciaExiste && !residencia) {
                numMaterias = numMaterias - 1;
            }
            let maxCre = 0;
            let minCre = 0;
            let creditosAcumu = Number($("#creditosFinales").text());
            maxCre = maxCreditos + 2;
            if(residencia) {
                minCre = 10;
            } else if(minCreditos === 20) {
                minCre = minCreditos - 2;
            } else {
                minCre = minCreditos;
            }
            if (E.length > 1 && materiasElegidas.length < 2) {
                Swal.fire(
                    'M&iacute;nimo de materias en Especial',
                    'Debes seleccionar m&aacute;s materias, porque no cumples con el m&iacute;nimo de <b>' + 2 + '</b> materias en Especial.',
                    'error'
                )
            } else if (E.length < 2 && creditosAcumu < minCre && Number(numMaterias) !== 0) {
                if(Number(numMaterias) !== 0){
                    Swal.fire(
                        'M&iacute;nimo de materias',
                        'Debes seleccionar m&aacute;s materias, porque a&uacute;n cuentas con materias disponibles.',
                        'error'
                    )
                } else {
                    Swal.fire(
                        'M&iacute;nimo de cr&eacute;ditos',
                        'Debes seleccionar m&aacute;s materias, porque no cumples con el m&iacute;nimo de <b>' + minCreditos + '</b> cr&eacute;ditos.',
                        'error'
                    )
                }
            }  else if (E.length < 2 && creditosAcumu > maxCre) {
                Swal.fire(
                    'M&aacute;ximo de cr&eacute;ditos',
                    'Debes seleccionar menos materias, porque excedes el m&aacute;ximo de <b>' + maxCreditos + '</b> cr&eacute;ditos.',
                    'error'
                )
            } else if ((E.length == 1 && materiasEspecial.length < E.length) || (E.length > 1 && materiasEspecial.length < 2)) {
                Swal.fire(
                    'Materias en Especial',
                    'No podr&aacute;s guardar tu horario, porque tienes materias de especial sin elegir.',
                    'error'
                )
            } else if (E.length <= 1 && creditosAcumu < minCre && materiasRepite.length <R.length) {
                Swal.fire(
                    'Materias en Repite',
                    'No podr&aacute;s guardar tu horario, porque tienes materias de repite sin elegir1.',
                    'error'
                )
            } else if (E.length <= 1 && creditosAcumu >= minCre+2 && creditosAcumu <= maxCre && repiteFaltantes > 0) {
                Swal.fire(
                    'Materias en Repite',
                    'No podr&aacute;s guardar tu horario, porque tienes materias de repite sin elegir.',
                    'error'
                )
            } else if (materiasOrden) {
                Swal.fire(
                    'Materias en Faltantes',
                    'No podr&aacute;s guardar tu horario, porque tienes materias de semestres anteriores sin elegir.',
                    'error'
                )
            } else {
                document.forma2.submit();
            }
        }
        return false;
    });
}

$(document).on('click','#bloquear',function(){
        event.preventDefault();
        Swal.fire({
            title: "&iquest;Seguro de bloquear tus materias seleccionadas para reinscripci&oacute;n?",
            html: "<h2 style='color:red;'>S&iacute; realizo cambios en su carga, aseg&uacute;rese de guardar primero.<br>Recuerda, este proceso es irreversible.</h2>",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Bloquear',
            cancelButtonText: "Cancelar",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.value) {
                document.formablock.submit();
            }
            return false;
        });
});

const Cruces = (materiaSel) => {
    let cruces = 0;
    cruces += sumarCruces(hlu, $(materiaSel.jlun).text().slice(0,8));
    cruces += sumarCruces(hma, $(materiaSel.jmar).text().slice(0,8));
    cruces += sumarCruces(hmi, $(materiaSel.jmie).text().slice(0,8));
    cruces += sumarCruces(hju, $(materiaSel.jjue).text().slice(0,8));
    cruces += sumarCruces(hvi, $(materiaSel.jvie).text().slice(0,8));
    cruces += sumarCruces(hsa, $(materiaSel.jsab).text().slice(0,8));
    cruces += sumarCruces(hdo, $(materiaSel.jdom).text().slice(0,8));
    return calcularCruces(cruces);
}

function calcularCruces(cruces) {
    let cruceTotal = "";
    horas   = Math.floor(cruces/60);
    minutos = cruces%60;
    cruceTotal = zfill(horas,2)+zfill(minutos,2);
    return Number(cruceTotal) > maxCruces;
}

function StringtoHour(string) {
    let horaInicial = string.slice(0,4);
    let horaFinal   = string.slice(4,8);
    return [horaInicial, horaFinal];
}

function StringtoMin(string) {
    let horaInicial = string.slice(0,2);
    let minInicial  = string.slice(2,4);
    let horaFinal   = string.slice(4,6);
    let minFinal    = string.slice(6,8);
    minFinal        = minFinal == 00 ? 60 : minFinal;
    return [horaInicial, minInicial, horaFinal, minFinal];
}

function zfill(number, width) {
    let numberOutput = Math.abs(number);
    let length       = number.toString().length;
    let zero         = "0";
    if (width <= length) {
        if (number < 0) {
             return ("-" + numberOutput.toString()); 
        } else {
             return numberOutput.toString(); 
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString()); 
        }
    }
}

function sumarCruces(dia, hora) {
    let minutos = 0;
    dia.forEach(function(diahr) {
        [horaInicialA, horaFinalA] = StringtoHour(diahr);
        [horaInicialS, horaFinalS] = StringtoHour(hora);
        if(horaFinalS > horaInicialA && horaInicialS <= horaFinalA){
            [horaInicialB, minInicialB, horaFinalB, minFinalB] = StringtoMin(diahr);
            [horaInicialC, minInicialC, horaFinalC, minFinalC] = StringtoMin(hora);
            
            if(horaInicialS === horaInicialA && horaFinalS === horaFinalA ||
                horaInicialS === horaInicialA && horaFinalS < horaFinalA ||
                horaInicialS > horaInicialA && horaFinalS < horaFinalA ||
                horaInicialS > horaInicialA && horaFinalS === horaFinalA ||
                horaInicialS < horaInicialA && horaFinalS < horaFinalA
             ){
                minutos = minFinalC - minInicialC;
             }
             
             if(horaInicialS < horaInicialA && horaFinalS > horaFinalA ||
                horaInicialS < horaInicialA && horaFinalS === horaFinalA ||
                horaInicialS === horaInicialA && horaFinalS > horaFinalA
             ){
                 minutos = minFinalB - minInicialB; 
             }
             
             if(horaInicialS < horaInicialA && horaFinalS > horaFinalA){
                 minutos = minFinalB - minInicialC; 
             }
        } else {
            if(hora.trim() !== ''){
                dia.push(hora.trim());
            }
        }
    });
    if(dia.length === 0) {
        if(hora.trim() !== ''){
            dia.push(hora.trim());
        }
    }
    return minutos;
}

function restarCruces(materiaSele) {
    hlu = hlu.filter((item) => item !== $(materiaSele[11]).text().slice(0,8));
    hma = hma.filter((item) => item !== $(materiaSele[12]).text().slice(0,8));
    hmi = hmi.filter((item) => item !== $(materiaSele[13]).text().slice(0,8));
    hju = hju.filter((item) => item !== $(materiaSele[14]).text().slice(0,8));
    hvi = hvi.filter((item) => item !== $(materiaSele[15]).text().slice(0,8));
    hsa = hsa.filter((item) => item !== $(materiaSele[16]).text().slice(0,8));
    hdo = hdo.filter((item) => item !== $(materiaSele[17]).text().slice(0,8));
}

function agregarCruces(dia, hora) {
    dia.push(hora.trim());
}

function materiaSemestre(semestre, materia) {
    switch (semestre+1) {
        case 1:
            semestre1.push(materia)
            break;
        case 2:
            semestre2.push(materia)
            break;
        case 3:
            semestre3.push(materia)
            break;
        case 4:
            semestre4.push(materia)
            break;
        case 5:
            semestre5.push(materia)
            break;
        case 6:
            semestre6.push(materia)
            break;
        case 7:
            semestre7.push(materia)
            break;
        case 8:
            semestre8.push(materia)
            break;
        case 9:
            semestre9.push(materia)
            break;
        case 10:
            semestre10.push(materia)
            break;
        default:
            semestre0.push(materia)
            break;
    }
}

function materiaSemestreEliminar(materiaId) {
    let materia      = $("#"+materiaId);
    if(materia.length > 0) {
        let semestre     = materia[0].cellIndex;
        switch (semestre+1) {
            case 1:
                semestre1 = semestre1.filter((item) => item !== materiaId);
                break;
            case 2:
                semestre2 = semestre2.filter((item) => item !== materiaId);
                break;
            case 3:
                semestre3 = semestre3.filter((item) => item !== materiaId);
                break;
            case 4:
                semestre4 = semestre4.filter((item) => item !== materiaId);
                break;
            case 5:
                semestre5 = semestre5.filter((item) => item !== materiaId);
                break;
            case 6:
                semestre6 = semestre6.filter((item) => item !== materiaId);
                break;
            case 7:
                semestre7 = semestre7.filter((item) => item !== materiaId);
                break;
            case 8:
                semestre8 = semestre8.filter((item) => item !== materiaId);
                break;
            case 9:
                semestre9 = semestre9.filter((item) => item !== materiaId);
                break;
            case 10:
                semestre10 = semestre10.filter((item) => item !== materiaId);
                break;
            default:
                semestre0 = semestre0.filter((item) => item !== materiaId);
                break;
        }
    }
}

function validarSemestre(materiaId, semestre, nombre) {
    if(nombre.trim().localeCompare('SERV. SOCIAL') !== 0) {
        for (let index = 1; index < semestre+1; index++) {
            if(window["semestre"+index].length > 0) {
                return true;
            }
        }
    }
    return false;
}

function validarSemestreFaltante(materiaId, tipo) {
    let materia = $("#"+materiaId);
    let semestre = materia[0].cellIndex;
    if(tipo == "N") {
        for (let index = 1; index < semestre+1; index++) {
            if(window["semestre"+index].length > 0) {
                return true;
            }
        }
    }
    return false;
}

function semestreLength(semestre) {
    return semestre.length;
}

function disponibleColor(disponible) {
    if(disponible >= 35) {
        return "<font color='blue'><b>"+disponible+"</b></font>";
    } else if(disponible < 35 && disponible >= 20) {
        return "<font color='green'><b>"+disponible+"</b></font>";
    } else if(disponible < 20 && disponible >= 5) {
        return "<font color='orange'><b>"+disponible+"</b></font>";
    } else {
        return "<font color='red'><b>"+disponible+"</b></font>";
    }
}

function residenciaActiva(nombre) {
    let name = nombre.trim().split(' ');
    if(name[0].localeCompare('RESIDENCIA') === 0) {
        residencia = true;
    }
}

function residenciaInactiva(nombre) {
    let name = nombre.trim().split(' ');
    if(name[0].localeCompare('RESIDENCIA') === 0) {
        residencia = false;
    }
}

function servicioActivo(nombre) {
    if(nombre.trim().localeCompare('SERV. SOCIAL') === 0) {
        servicio = true;
    }
}

function servicioInactivo(nombre) {
    if(nombre.trim().localeCompare('SERV. SOCIAL') === 0) {
        servicio = false;
    }
}