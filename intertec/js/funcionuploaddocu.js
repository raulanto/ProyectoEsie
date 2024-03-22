async function fileevid(valor) {

    documento = document.getElementById("documento"+valor).value;
    documentonap = document.getElementById("documentonap"+valor).value;
    tipo = document.getElementById("tipo"+valor).value;
    boton = document.getElementById("boton"+valor).value;

    event.preventDefault();
    const { value: file } = await Swal.fire({
    title: 'Seleccione un archivo '+tipo,
    input: 'file',
    inputAttributes: {
        'accept': tipo=='pdf'?'.pdf':'.jpg',
		
        'aria-label': 'Subir archivo'
    }
    })

    if (file) {
    //agregado
    checarArchivo(file).then( respuesta => {

    const reader = new FileReader()
    reader.readAsDataURL(file)
    var formData = new FormData();
    formData.append("upfile", file);
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
                   $("#unii"+valor).html("<img src='/intertec/img/trueok.png'>");
				   $("#unii"+valor).html("<iframe src='"+documento+"' style='width:250px; height:300px;' frameborder='0'></iframe>");
				   $('#unii'+valor).attr('onclick',"javascript:parent.principal.location='"+documento+"'");
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

//agregado
function checarArchivo(file){   
    return new Promise( (resolve, reject) => {
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
