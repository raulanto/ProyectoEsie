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
        title: '&iquest;Est&aacute; seguro de importar la instrumentaci&oacute;n de ' + unescape(maestro) + '?',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: 'No',
        text: unescape("Los datos en esta instrumentaci\u00F3n se reemplazar\u00E1n!"),
        icon: 'question',
      }).then((result) => {
        if (result.isConfirmed) {
            // si confirmo el usuario
            var formData = new FormData();
            formData.append("timppdo", timppdo);
            formData.append('timpins',timpins);
            formData.append('Opc',Opc);
            formData.append('Control',Control);
            formData.append('Materia',Materia);
            formData.append('Password',Password);
            formData.append('dummy',dummy);
                $.ajax({
                    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                    method: 'post',
                    url: '/cgi-bin/sie.pl',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (resp) {
                            Swal.fire({
                                title: "Importaci&oacute;n exitosa!",
                                icon: "success",
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Continuar'
                              }).then((result) => {
                                if (result.value) {
                                    window.location.reload();
                                }
                              });                   
                    },
                    error: function() {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ocurri&oacute; un error!',
                        })
                    }
                });
        } else if (result.isDenied) {
          Swal.fire({
                title: "No se realiz&oacute; la importaci&oacute;n!",
                icon: "info",
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar'  
           })
        }
      })

}
