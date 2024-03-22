let control  = "";
let password = "";
let psie     = "";
let orden    = "";
let id       = "";
let tipo     = "";
let recargar = false;

async function metodPago() {
  Swal.fire({
    title: "M&eacute;todos de pago",
    confirmButtonText: "Confirmar datos",
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#d33",
    html: "<div class='col-md-12'><img src='/fsie/IM/Bbva.jpg' style='width:400px;height:100px;' onclick='clientPago()'></div><br><div class='col-md-12'><img src='/fsie/IM/Santander.png' style='width:400px;height:100px;' onclick='clientPagoS()'></div>"
  });
}

async function clientPago() {
  event.preventDefault();

  control   = $("#Control").val();
  password  = $("#Password").val();
  psie      = $("[name='psie']").attr("value");
  let name  = $("#nameStudent").val();
  let last  = $("#lastStudent").val();
  let phone = $("#phoneStudent").val();
  let email = $("#emailStudent").val();

  let pagoSeleccionado = [];
  let i = 0;
  // para cada checkbox "chequeado"
  $("input[type=checkbox]:checked").each(function () {
    // buscamos el td más cercano en el DOM hacia "arriba"
    // luego encontramos los td adyacentes a este
    $(this)
      .closest("td")
      .siblings()
      .each(function () {
        // obtenemos el texto del td
        pagoSeleccionado[i] = $(this).text();
        ++i;
      });
  });

  if (pagoSeleccionado != "") {
    const { value: formValues } = await Swal.fire({
      title: "Datos del cliente",
      confirmButtonText: "Confirmar datos",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d33",
      html: '<div class="col-md-12"><div class="form-group required"><label class="control-label">Nombre</label><input type="text" style="width:80%; margin: 0em 2em 3px;" class="swal2-input" id="swal-name" value="' + name + '" maxlength="12" onkeyup="this.value=this.value.toUpperCase()" aria-required="true" required disabled><div class="help-block"></div></div></div>' + '<div class="col-md-12"><div class="form-group required"><label class="control-label">Apellidos</label><input type="text" style="width:80%; margin: 0em 2em 3px;" class="swal2-input" id="swal-last" value="' + last + '" maxlength="12" onkeyup="this.value=this.value.toUpperCase()" aria-required="true" required disabled><div class="help-block"></div></div></div>' + '<div class="col-md-12"><div class="form-group required"><label class="control-label">Correo electronico</label><input type="text" style="width:80%; margin: 0em 2em 3px;" class="swal2-input" id="swal-email" value="' + email + '" aria-required="true" required><div class="help-block"></div></div></div>' + '<div class="col-md-12"><div class="form-group required"><label class="control-label">Telefono</label><input type="number" style="width:80%; margin: 0em 2em 3px;" class="swal2-input" id="swal-phone" value="' + Number(phone) + '" min="10" aria-required="true" required><div class="help-block"></div></div></div>',
      focusConfirm: true,
      preConfirm: () => {
        var nombre = document.getElementById("swal-name").value;
        var apellido = document.getElementById("swal-last").value;
        var correo = document.getElementById("swal-email").value;
        var number = document.getElementById("swal-phone").value;

        if (nombre == "") {
          Swal.showValidationMessage("Nombre requerido");
        }
        if (apellido == "") {
          Swal.showValidationMessage("Apellidos requeridos");
        }
        if (correo == "") {
          Swal.showValidationMessage("Correo electronico requerido");
        }
        if (!validateEmail(correo)) {
          Swal.showValidationMessage("Correo electronico no valido");
        }
        if (number == "") {
          Swal.showValidationMessage("Telefono requerido");
        }
        if (number.length != 10) {
          Swal.showValidationMessage("Telefono debe contener 10 digitos");
        }
        return [nombre, apellido, correo, number];
      },
    });

    if (formValues[0] != undefined && formValues[0] != "" && formValues[1] != undefined && formValues[1] != "" && formValues[2] != undefined && formValues[2] != "" && formValues[3] != undefined && formValues[3] != "") {
      await Swal.fire({
        title: "Confirmaci&oacute;n",
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: "No",
        text: "Los datos ingresados se enviaran para realizar el pago del servicio",
        icon: "question",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: "/cgi-bin/sie.pl",
            method: "GET",
            data: {
              Opc: "PAGOSBBVAGET",
              Control: control,
              Password: password,
              fol: pagoSeleccionado[0].trim(),
              cod: pagoSeleccionado[1].trim(),
              psie: psie,
              dummy: 0,
            },
            success: function (resp) {
              let folio = resp.split('src="/intertec/js/flotante.js"></script>');
              orden = folio[1];
              if (orden.length == 10) {
                // si confirmo el usuario
                var formData = new FormData();
                formData.append("description", pagoSeleccionado[2]);
                formData.append("amount", pagoSeleccionado[3].trim());
                formData.append("order", orden);
                formData.append("control", control.trim());
                formData.append("password", password.trim());
                formData.append("psie", psie.trim());
                formData.append("name", formValues[0].trim());
                formData.append("last_name", formValues[1].trim());
                formData.append("email", formValues[2].trim());
                formData.append("phone_number", formValues[3].trim());
                $.ajax({
                  headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
                    "Content-Security-Policy": "frame-ancestors 'self' https: http:;",
                  },
                  method: "post",
                  url: "/intertec/php/carpay.php", //Pago von Tarjeta
                  //url: '/intertec/php/carpayvpos.php',  //Pago con Puntos VPOS
                  //url: '/intertec/php/carpay3d.php',  //Pago 3D Secure
                  //url: '/intertec/php/carpayreembolso.php', // Reembolso
                  //url: '/intertec/php/carpaymsi.php', // MSI
                  //url: '/intertec/php/carpayskip.php', // SKIP Payment MSI
                  data: formData,
                  processData: false,
                  contentType: false,
                  beforeSend: function () {
                    $(".ajax-loader").css("visibility", "visible");
                  },
                  success: function (resp) {
                    resp = $.parseJSON(resp);
                    id   = resp.id;
                    $.ajax({
                        url: '/cgi-bin/sie.pl',
                        method: 'GET',
                        data: {
                            Opc      : 'PAGOSBBVAPUTID',
                            Control  : control,
                            Password : password,
                            fol      : orden,
                            id       : id,
                            psie     : psie,
                            dummy    : '0',
                        },
                        success: function (res) {
                            let respuesta = res.split('</script>');
                            if (respuesta[1].length == 2 && respuesta[1] == 'OK') {
                                if (resp.url.search("https://sandbox-api.openpay.mx") >= 0) {
                                    popupCenter({ url: resp.url, title: "Pago de servicio", w: 850, h: 800 });
                                    if(recargar) {
                                        parent.frames[1].document.location.reload();
                                    }
                                    $(".ajax-loader").css("visibility", "hidden");
                                    } else {
                                    $(".ajax-loader").css("visibility", "hidden");
                                    Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: "Ya usaste este servicio!",
                                    });
                                }
                            }
                        },
                        error: function () {
                            Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Error',
                            });
                        },
                    });
                  },
                  error: function () {
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Ocurri&oacute; un error!",
                    });
                  },
                });
              }
            },
            error: function () {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Orden no generado",
              });
            },
          });
        } else if (result.isDenied) {
          Swal.fire({
            title: "No se realiz&oacute; la importaci&oacute;n!",
            icon: "info",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Continuar",
          });
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes rellenar todos los campos",
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Debes seleccionar un servicio",
    });
  }
}

async function clientPagoS() {
  $.ajax({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
      "Access-Control-Allow-Credentials": "*",
    },
    method: "post",
    url: "/intertec/php/Scarpay.php",
    data: {},
    processData: false,
    contentType: false,
    success: async function (data0) {
      var res = null;
      var originalString = "xml=<pgs><data0>SNDBX123</data0><data>"+data0+"</data></pgs>";
      var data = encodeURIComponent(originalString);
      var xhr = new XMLHttpRequest();  
      await xhr.open("POST", "https://sandboxpo.mit.com.mx/gen");
      //xhr.withCredentials = true;  
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      await xhr.send(data);
      xhr.onloadend = function() {
        if (xhr.status == 200) {
          if(xhr.readyState === 4) {
            var formData = new FormData();
            formData.append("cifrada", xhr.responseText);
            $.ajax({
              headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
              },
              method: "post",
              url: "/intertec/php/Scardes.php",
              data: formData,
              processData: false,
              contentType: false,
              success: function (resp) {
                let respuesta = $(resp).children('nb_url').text();
                if(respuesta != '') {
                  popupCenter({ url: respuesta, title: "Pago de servicio", w: 850, h: 800 });
                  $(".ajax-loader").css("visibility", "hidden");
                }
              },
              error: function () {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Ocurri&oacute; un error!",
                });
              },
            });
          }
        } else {
          console.log("error " + this.status);
        }
      }
    },
    /*success: function (data0) {
      alert(data0)
      var formData = new FormData();
      formData.append("cifrada", data0);
      $.ajax({
        headers: {
          "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        method: "post",
        url: "/intertec/php/Scargeneracion.php",
        data: formData,
        processData: false,
        contentType: false,
        success: function (resp) {
          alert(resp)
        },
        error: function () {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ocurri&oacute; un error!",
          });
        },
      });
    },*/
    error: function () {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurri&oacute; un error!",
      });
    },
  });
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})|(([a-zA-Z\-0-9]+\.)+(tecnm)+(\.)+(mx)))$/;
  return re.test(email);
}

async function enviarPago() {
  var description = $("#description").val();
  var amount = $("#amount").val();
  var currency = $("#currency").val();
  var order = $("#order").val();

  var holder_name = $("#holder_name").val();
  var card_number = $("#card_number").val();
  var expiration_year = $("#expiration_year").val();
  var expiration_month = $("#expiration_month").val();
  var cvv2 = $("#cvv2").val();

  var name = $("#name").val();
  var last_name = $("#last_name").val();
  var email = $("#email").val();
  var phone_number = $("#phone_number").val();

  var dummy = 0;

  event.preventDefault();
  Swal.fire({
    title: "&iquest;Est&aacute; seguro de realizar el pago ?",
    showDenyButton: true,
    confirmButtonText: "Si",
    denyButtonText: "No",
    text: unescape("Los datos en se enviaran!"),
    icon: "question",
  }).then((result) => {
    if (result.isConfirmed) {
      // si confirmo el usuario
      var formData = new FormData();
      formData.append("description", description);
      formData.append("amount", amount);
      formData.append("order", order);
      formData.append("holder_name", holder_name);
      formData.append("card_number", card_number);
      formData.append("expiration_month", expiration_month);
      formData.append("expiration_year", expiration_year);
      formData.append("cvv2", cvv2);
      formData.append("name", name);
      formData.append("last_name", last_name);
      formData.append("email", email);
      formData.append("phone_number", phone_number);
      $.ajax({
        headers: { "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content") },
        method: "post",
        url: "/intertec/php/carpay.php",
        data: formData,
        processData: false,
        contentType: false,
        success: function (resp) {
          window.location.href = resp;
        },
        error: function () {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ocurri&oacute; un error!",
          });
        },
      });
    } else if (result.isDenied) {
      Swal.fire({
        title: "No se realiz&oacute; la importaci&oacute;n!",
        icon: "info",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Continuar",
      });
    }
  });
}

async function ConfirmarSubida() {
  var timppdo = $("#timppdo option:selected").val();
  var timpins = $("#timpins option:selected").val();
  var maestro = $("#timpins option:selected").text();
  var Opc = $("#Opc").val();
  var Control = $("#Control").val();
  var Materia = $("#Materia").val();
  var Password = $("#Password").val();
  var dummy = 0;
  event.preventDefault();
  Swal.fire({
    title: "&iquest;Est&aacute; seguro de importar la instrumentaci&oacute;n de " + unescape(maestro) + "?",
    showDenyButton: true,
    confirmButtonText: "Si",
    denyButtonText: "No",
    text: unescape("Los datos en esta instrumentaci\u00F3n se reemplazar\u00E1n!"),
    icon: "question",
  }).then((result) => {
    if (result.isConfirmed) {
      // si confirmo el usuario
      var formData = new FormData();
      formData.append("timppdo", timppdo);
      formData.append("timpins", timpins);
      formData.append("Opc", Opc);
      formData.append("Control", Control);
      formData.append("Materia", Materia);
      formData.append("Password", Password);
      formData.append("dummy", dummy);
      $.ajax({
        headers: { "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content") },
        method: "post",
        url: "/cgi-bin/sie.pl",
        data: formData,
        processData: false,
        contentType: false,
        success: function (resp) {
          Swal.fire({
            title: "Importaci&oacute;n exitosa!",
            icon: "success",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Continuar",
          }).then((result) => {
            if (result.value) {
              window.location.reload();
            }
          });
        },
        error: function () {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ocurri&oacute; un error!",
          });
        },
      });
    } else if (result.isDenied) {
      Swal.fire({
        title: "No se realiz&oacute; la importaci&oacute;n!",
        icon: "info",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Continuar",
      });
    }
  });
}

const popupCenter = ({ url, title, w, h }) => {
  let tiempo = 0;
  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  const newWindow = window.open(
    url,
    title,
    `
      scrollbars=yes,
      width=${w / systemZoom},
      height=${h / systemZoom},
      top=${top},
      left=${left}
      `
  );
  if (window.focus) newWindow.focus();
  var interval = setInterval(async function () {
    //Comprobamos que la ventana no este cerrada
    if (newWindow.closed !== false) {
      //Si la ventana ha sido cerrada, limpiamos el contador
      window.clearInterval(interval);
      $.ajax({
        url: '/cgi-bin/sie.pl',
        method: 'GET',
        data: {
            Opc      : 'PAGOSBBVAGETS',
            Control  : control,
            Password : password,
            fol      : orden,
            psie     : psie,
            dummy    : '0',
        },
        success: function (resp) {
            let respuesta = resp.split('</script>');
            if(respuesta[1].trim() != 'completed' || respuesta[1].trim() == '') {
                recargar = true;
                var formData = new FormData();
                formData.append("control", control.trim());
                formData.append("password", password.trim());
                formData.append("psie", psie.trim());
                formData.append("id", id);
                $.ajax({
                    headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
                    },
                    method: "post",
                    url: "/intertec/php/carrevision.php",
                    data: formData,
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                    $(".ajax-loader").css("visibility", "visible");
                    },
                    success: function (resp) {
                        resp = $.parseJSON(resp);
                        $.get( '/cgi-bin/sie.pl', {
                            Opc          : resp.Opc          ,
                            Control      : resp.Control      ,
                            Password     : resp.Password     ,
                            psie         : resp.psie         ,
                            id           : resp.id           ,
                            authorization: resp.authorization,
                            method       : resp.method       ,
                            transaction  : resp.transaction  ,
                            status       : resp.status       ,
                            type         : resp.type         ,
                            brand        : resp.brand        ,
                            number       : resp.number       ,
                            holder_name  : resp.holder_name  ,
                            bank         : resp.bank         ,
                            order        : resp.order        ,
                            dummy        : resp.dummy        ,
                        });
                        Swal.fire({
                            title: 'Estatus del Pago',
                            text: "Se ha realizado la verificaci\xF3n de la transacci\xF3n",
                            icon: 'success',
                            confirmButtonText: 'Continuar',
                            allowOutsideClick: false,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                parent.frames[1].document.location.reload();
                            } 
                        })
                    },
                    error: function () {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Ocurri&oacute; un error!",
                    });
                    },
                });
            } else {
                parent.frames[1].document.location.reload();
            }
        },
        error: function () {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ocurri&oacute; un error!",
          });
        },
      });
    } else {
      //Mientras no se cierra la ventana sumamos los segundos
      tiempo += 1;
    }
  }, 1000);
};
