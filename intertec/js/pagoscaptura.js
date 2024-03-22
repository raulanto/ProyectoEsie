let receptor     = "";
let linea        = "";
let doc          = "";
let contro       = "";
let passwor      = "";
let cpsie        = "";
let servicio     = "";
let documentonap = "";
let tipo         = "";
let opcion       = "";

//Funcion de Servicios de Linea de Captura
async function pservlca(e, opc) {
    event.preventDefault();
    contro           = $("#Control").val();
    passwor          = $("#Password").val();
    cpsie            = $("#psie").val();
	opcion           = opc;
    let seleccionar  = $(e).parent();
    let tr           = seleccionar.parent().children();
    let sucursal     = $(tr[11]).text().trim();
    let autoriza     = $(tr[12]).text().trim();
    servicio         = seleccionar.prev().children().val();
    let seleccionado = seleccionar.children();
    let documento    = $(seleccionado[1]).val();
    documentonap     = $(seleccionado[2]).val();
    tipo             = $(seleccionado[3]).val();
    let frame        = "";
    const exist      = await fileExist(documentonap)
    if(exist) {
        frame = "<iframe src='"+documento+"' style='width:80%; height:500px;' frameborder='0'></iframe>";
    }
    if(documento != '' && documentonap != '' && tipo != '') {
        $.ajax({ 
            url: '/'+cpsie+'/notas/Banco.html',
            success: async function(data) {
                data    = $.parseJSON(data);
                options = "";
                $.each(data,function(key, registro) {
                    if(key == sucursal) {
                        options = options +'<option value='+key+' selected>'+registro+'</option>';
                    } else {
                        options = options +'<option value='+key+'>'+registro+'</option>';
                    }
                });
                await Swal.fire({
                    title: "Datos del Banco",
                    confirmButtonText: "Guardar",
                    showCancelButton: true,
                    cancelButtonText: "Cancelar",
                    cancelButtonColor: "#d33",
                    width: "50em",
                    html: '<div class="col-md-12"> <div class="form-group required"> <label class="control-label">Receptor del Pago</label><select style="width: 80%; margin: 0em 2em 3px" class="swal2-input" id="swal-receptor" aria-required="true" required>'+options+'</select><div class="help-block"></div> </div> </div>' + '<div class="col-md-12"> <div class="form-group required"> <label class="control-label">L&iacute;nea de Captura</label> <input type="text" style="width:80%; margin: 0em 2em 3px;" class="swal2-input" id="swal-linea" value="' + autoriza + '" maxlength="20" onkeyup="this.value=this.value.toUpperCase()" aria-required="true" required> <div class="help-block"></div></div></div>'+ '<div class="col-md-12"> <div class="form-group required"> <label class="control-label">Documento</label> <input type="file" style="width:80%; margin: 0em 2em 3px;" class="swal2-input" id="swal-file" accept="application/'+tipo+'" value="" required> <div class="help-block"></div></div></div>'+frame,
                    focusConfirm: true,
                    preConfirm: () => {
                        receptor = $("#swal-receptor").val();
                        linea    = $("#swal-linea").val();
                        doc      = $("#swal-file")[0].files[0];
                        if (receptor == "" || receptor == undefined || receptor == null) {
                            Swal.showValidationMessage("Receptor de pago requerido");
                        }
                        if (linea == "" || linea == undefined || linea == null) {
                            Swal.showValidationMessage("L&iacute;nea de captura requerida");
                        }
                        if (doc == "" || doc == undefined || doc == null) {
                            Swal.showValidationMessage("Documento requerido");
                        }
                        return [receptor, linea, doc];
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        enviarDatos();
                    }
                });
            }
        });
    }
}

async function pservaub(e,opc) {
    event.preventDefault();
	opcion           = opc;
    contro           = $("#Control").val();
    passwor          = $("#Password").val();
    cpsie            = $("#psie").val();
    let seleccionar  = $(e).parent();
    let tr           = seleccionar.parent().children();
    let sucursal     = $(tr[11]).text().trim();
    let autoriza     = $(tr[12]).text().trim();
    servicio         = seleccionar.prev().children().val();
    let seleccionado = seleccionar.children();
    let documento    = $(seleccionado[1]).val();
    documentonap     = $(seleccionado[2]).val();
    tipo             = $(seleccionado[3]).val();
    let frame        = "";
    const exist      = await fileExist(documentonap)
    if(exist) {
        frame = "<iframe src='"+documento+"' style='width:80%; height:500px;' frameborder='0'></iframe>";
    }
    if(documento != '' && documentonap != '' && tipo != '') {
        await Swal.fire({
            title: "Datos del Banco",
            confirmButtonText: "Guardar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#d33",
            width: "50em",
            html: '<div class="col-md-12"><div class="form-group required"><label class="control-label" style="display: block;">Sucursal</label><input type="text" style="width:80%; margin: 0em 2em 3px;" class="swal2-input" id="swal-receptor" value="' + sucursal + '" maxlength="10" onkeyup="this.value=this.value.toUpperCase()" aria-required="true" required><div class="help-block"></div></div></div>' + '<div class="col-md-12"> <div class="form-group required"> <label class="control-label">Folio de autorizaci&oacute;n</label> <input type="text" style="width:80%; margin: 0em 2em 3px;" class="swal2-input" id="swal-linea" value="' + autoriza + '" maxlength="20" onkeyup="this.value=this.value.toUpperCase()" aria-required="true" required> <div class="help-block"></div></div></div>'+ '<div class="col-md-12"> <div class="form-group required"> <label class="control-label">Documento</label> <input type="file" style="width:80%; margin: 0em 2em 3px;" class="swal2-input" id="swal-file" accept="application/'+tipo+'" value="" required> <div class="help-block"></div></div></div>'+frame,
            focusConfirm: true,
            preConfirm: () => {
                receptor = $("#swal-receptor").val();
                linea    = $("#swal-linea").val();
                doc      = $("#swal-file")[0].files[0];
                if (receptor == "" || receptor == undefined || receptor == null) {
                    Swal.showValidationMessage("Receptor de pago requerido");
                }
                if (linea == "" || linea == undefined || linea == null) {
                    Swal.showValidationMessage("L&iacute;nea de captura requerida");
                }
                if (doc == "" || doc == undefined || doc == null) {
                    Swal.showValidationMessage("Documento requerido");
                }
                return [receptor, linea, doc];
            },
        }).then((result) => {
            if (result.isConfirmed) {
                enviarDatos();
            }
        });
    }
}

//Revisa la extensión del archivo
function checarArchivo(file){  
    return new Promise( (resolve) => {
        const reader1 = new FileReader()
        reader1.onload = (e) => {
            var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
            var header = [];
            arr.forEach(function (chunk) {
                chunk = chunk.toString(16).padStart(2, '0').toUpperCase();
                header.push(chunk);
            });
            var cadena = header.join(' ');
            resolve(cadena);
        }
        reader1.readAsArrayBuffer(file);
    })
}

async function fileExist(file) {
    const result = await $.ajax({
      url: '/intertec/php/exist.php',
      type: 'POST',
      data: {url: file},
    })
    return result
}

function enviarDatos() {
    if (doc) {
        checarArchivo(doc).then( respuesta => {
        const reader = new FileReader()
        reader.readAsDataURL(doc)
        var formData = new FormData();
        formData.append("upfile", doc);
        formData.append('documentonap',documentonap);
        formData.append('tipo',tipo);
        formData.append('button',true);
        formData.append('tipo2', respuesta);
            $.ajax({
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                method: 'post',
                url: '/intertec/php/uploadi.php',
                data: formData,
                processData: false,
                contentType: false,
                success: function (resp) {
                    if(resp==1){
                        $.get( '/cgi-bin/sie.pl', {
                            Opc      : opcion.toUpperCase(),
                            Control  : contro              ,
                            Password : passwor             ,
                            servicio : servicio            ,
                            tsub     : receptor            ,
                            taub     : linea               ,
                            psie     : cpsie               ,
                            dummy    : '0'   
                        });
                        parent.frames[1].document.location.reload();
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ocurrio un error 1!',
                          })
                    }
                },
                error: function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ocurrio un error!',
                      })
                }
            });
    
        }).catch(() => {
            console.log('Algo salió mal');
        });     
    }
}