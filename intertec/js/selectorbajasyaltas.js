let altaElegidas = [];
let bajaElegidas = []; 

$(document).ready(function () {
    $('#materiasAltasBajas tr').each(function () {
        let materiaSele = this.children;
        if($(this).find('.creditosseleccionados').length === 1){
            let materiaClave = $(materiaSele[1]).text();
            let tipo         = $(materiaSele[1].children[1]).val();
            if(tipo == "A") {
                altaElegidas.push(materiaClave)
                let materia      = $("#"+materiaClave);
                if(materia.length === 1){
                    materia.attr('style', materia.attr('style')+tdStyle);
                }
            }
            if(tipo == "B") {
                bajaElegidas.push(materiaClave)
                selecbaja(materiaClave);
            }
        }
    });
});

$(document).on('click', '.matalta', function (materia) {
    let materiaSeleccionada = materia?.currentTarget;
    let materiaHijos        = materiaSeleccionada.children;
    let materiaId           = materiaSeleccionada?.id;
    materiaClave            = materiaId;
    credito                 = $(materiaHijos[1]).text();
    nombre                  = $(materiaHijos[2]).text();
    let tipo                = $(materiaHijos[3]?.children?.oportunidad).text();
    let oportunidad         = tipo == '' ? 0 : tipo;
    nombreOportunidad       = tipoNombre(oportunidad);
    let control             = $('input[name=Control]').val();
    let password            = $('input[name=Password]').val();
    let psie                = $('input[name=psie]').val();
    if (materiaId !== undefined) {
        if (!findElement(altaElegidas, materiaId)) {
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
    if(findElement(altaElegidas, materiaId)){
        Swal.fire(
            'Materia: '+materiaId,
            'Ya no puede seleccionar la materia: <b>'+materiaId+'</b>, porque ya se encuentra en tu lista de materias.',
            'error'
        )
    }
});

$(document).on('click', '.altaBorrar', function (event) {
    event.preventDefault();
    let materiaSeleccionada = event?.currentTarget?.dataset;
    let materiaId = materiaSeleccionada?.materia;
    if (materiaId !== undefined) {
        $(this).closest('tr').next().remove();
        $(this).closest('tr').remove();
        let materiaEle    = $("#" + materiaId);
        elegalta(materiaEle);
        if(materiaEle.length === 1){
            materiaEle.attr('style', materiaEle.attr('style').split(tdStyle)[0]);
        }
        altaElegidas = altaElegidas.filter((item) => item !== materiaId);
    }
});

$(document).on('click', '.altaAgregar', function (event) {
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
    if (materiaClave !== undefined && !findElement(altaElegidas, materiaClave)) {
        let borrar = '<td class="altaBorrar" data-materia="' + materiaClave + '"><i class="fa-solid fa-square-minus"></i></td>';
        let htmlTags =
            '<tr>' +
            borrar+
            '<td><input type="hidden" name="mat" value="' + materiaClave+','+grupoId+'?' + nombreOportunidad+'" /><input type="hidden" name="tip" value="A" />' + materiaClave + '</td>' +
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
            '</tr>'+
            '<tr>'+
            '<td></td><td width="5%">Motivo</td><td colspan="8" width="45%"><textarea class="form-control" name="mot" rows="2"></textarea></td>'+
            '<td>Respuesta</td><td colspan="7"><textarea class="form-control" name="res" rows="2" disabled></textarea></td><td></td>'+
            '</tr>';
        $("#materiasAltasBajas tbody tr:last-child").after(htmlTags);
        let materiaEle = $("#" + materiaClave);
        selecalta(materiaEle);
        altaElegidas.push(materiaClave);
        if(findElement(altaElegidas, materiaClave)){
            if(materiaEle.length === 1){
                materiaEle.attr('style', materiaEle.attr('style')+tdStyle);
            }
            $(".altaAgregar").each(function(index) {
                $(this).removeClass('altaAgregar');
            });
            Swal.close();
        }
        
    } else {
        Swal.fire(
            'Materia',
            'Ya elegiste previamente la materia con clave: <b>'+materiaClave+'</b>',
            'error'
        )
    }
});

$(document).on('click', '.matbaja', function (event) {
    event.preventDefault();
    let grupoSeleccionado = $(event.currentTarget.parentNode.children);
    let materiaClave      = $(grupoSeleccionado[1]).text();
    let nombre            = $(grupoSeleccionado[2]).text();
    let credito           = $(grupoSeleccionado[3]).text();
    let nombreOportunidad = $(grupoSeleccionado[4]).text();
    let grupoId           = $(grupoSeleccionado[5]).text();
    let dis               = $(grupoSeleccionado[6]).text();
    let bas               = $(grupoSeleccionado[7]).text();
    let pla               = $(grupoSeleccionado[8]).text();
    let paq               = $(grupoSeleccionado[9]).text();
    let spd               = $(grupoSeleccionado[10]).text();
    let lun               = $(grupoSeleccionado[11]).text();
    let mar               = $(grupoSeleccionado[12]).text();
    let mie               = $(grupoSeleccionado[13]).text();
    let jue               = $(grupoSeleccionado[14]).text();
    let vie               = $(grupoSeleccionado[15]).text();
    let sab               = $(grupoSeleccionado[16]).text();
    let dom               = $(grupoSeleccionado[17]).text();
    let doc               = $(grupoSeleccionado[18]).text();
    if (materiaClave !== undefined && !findElement(bajaElegidas, materiaClave)) {
        let borrar = '<td class="bajaBorrar" data-materia="' + materiaClave + '"><i class="fa-solid fa-circle-minus"></i></td>';
        let htmlTags =
            '<tr>' +
            borrar+
            '<td><input type="hidden" name="mat" value="' + materiaClave+','+grupoId+'?' + nombreOportunidad+'" /><input type="hidden" name="tip" value="B" />' + materiaClave + '</td>' +
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
            '</tr>'+
            '<tr>'+
            '<td></td><td width="5%">Motivo</td><td colspan="8" width="45%"><textarea class="form-control" name="mot" rows="2"></textarea></td>'+
            '<td>Respuesta</td><td colspan="7"><textarea class="form-control" name="res" rows="2" disabled></textarea></td><td></td>'+
            '</tr>';
        $("#materiasAltasBajas tbody tr:last-child").after(htmlTags);
        let materiaEle = $("#" + materiaClave);
        selecbaja(materiaClave);
        bajaElegidas.push(materiaClave);
        if(findElement(bajaElegidas, materiaClave)){
            if(materiaEle.length === 1){
                materiaEle.attr('style', materiaEle.attr('style')+tdStyle);
            }
            $(".bajaAgregar").each(function(index) {
                $(this).removeClass('bajaAgregar');
            });
            Swal.close();
        }
        
    } else {
        Swal.fire(
            'Materia',
            'Ya elegiste previamente la materia con clave: <b>'+materiaClave+'</b>',
            'error'
        )
    }
});

$(document).on('click', '.bajaBorrar', function (event) {
    event.preventDefault();
    let materiaSeleccionada = event?.currentTarget?.dataset;
    let materiaId = materiaSeleccionada?.materia;
    if (materiaId !== undefined) {
        $(this).closest('tr').next().remove();
        $(this).closest('tr').remove();
        let materiaEle = $("#" + materiaId);
        elegbaja(materiaId);
        if(materiaEle.length === 1){
            materiaEle.attr('style', materiaEle.attr('style').split(tdStyle)[0]);
        }
        bajaElegidas = bajaElegidas.filter((item) => item !== materiaId);
    }
});

function selecalta(element) {
    let materia = $(element).children('.elegalta');
    if ($(materia).hasClass('elegalta')) {
        $(materia).removeClass('elegalta');
        $(materia).addClass('selecalta');
    }
}

function elegalta(element) {
    let materia = $(element).children('.selecalta');
    if ($(materia).hasClass('selecalta')) {
        $(materia).removeClass('selecalta');
        $(materia).addClass('elegalta');
    }
}

function selecbaja(element) {
    $('#materiasSeleccionadas tr').each(function () {
        if($(this).find('.matbaja').length === 1){
            let materiaEle = $(this.children);
            if($(materiaEle[1]).text() === element) {
                $(materiaEle[0]).html('');
            }
        }
    });
}

function elegbaja(element) {
    $('#materiasSeleccionadas tr').each(function () {
        if($(this).find('.matbaja').length === 1){
            let materiaEle = $(this.children);
            if($(materiaEle[1]).text() === element) {
                $(materiaEle[0]).html('<i class="fa-solid fa-thumbs-down"></i>');
            }
        }
    });
}

function tipoNombre(id) {
    let posicion = Number(id);
    const nombres = ['N', 'R', 'R', 'R', 'E', 'E'];
    return nombres[posicion];
}

$(document).on('click','#altbaj',function(){
        event.preventDefault();
        Swal.fire({
            title: "&iquest;Seguro de guardar tus materias seleccionadas para altas y bajas?",
            html: "<h2>Recuerda, dar de <font color='green'>ALTA</font> o <font color='red'>BAJA</font> una materia ser&aacute; enviado a proceso de revisi&oacute;n.</h2>",
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: "Cancelar",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.value) {
                document.formaAltaBaja.submit();
            }
            return false;
        });
});