async function fileInput() {
	documento = document.getElementById("documento").value;
	documentonap = document.getElementById("documentonap").value;	
    tipo = document.getElementById("tipo").value;
	//alert(documento);
	
    const { value: file } = await Swal.fire({
    title: 'Seleccione una Imagen '+tipo,
    input: 'file',
    inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Subir de imagen de perfil'
    }
    })

    if (file) {
    //agregado
    checarArchivo(file).then( respuesta => { 

    const reader = new FileReader()
    reader.onload = (e) => {
        Swal.fire({
        title: 'Imagen subida',
        imageUrl: e.target.result,
        imageAlt: 'The uploaded picture'
        })
    }
    reader.readAsDataURL(file)
    var formData = new FormData();
    formData.append("upfile", file);
	formData.append('documentonap',documentonap);
    formData.append('tipo',tipo);
	formData.append('button',true);
    //agregado
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
                   $('#foto').html("<img src='" + documento + "' width='100' height='100' />");
                   $('#botonFoto').prop('disabled',true);
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Ocurrio un error!',
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
        //agregado
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