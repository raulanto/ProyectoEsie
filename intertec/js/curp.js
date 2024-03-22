function curpValida(curp) {
    var re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
        validado = curp.match(re);
        if (!validado)  //Coincide con el formato general?
    	return false;

        function buscarEnDiccionario(caracter) {
            var diccionario  = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            if (caracter === 'Ñ') {
                return 24;
            } else {
                const indice = diccionario.indexOf(caracter);
                return indice >= 24 ? indice + 1 : indice;
            }
        }

        function digitoVerificador(curp17) {
            lngSuma      = 0.0,
            lngDigito    = 0.0;
            for(var i=0; i<17; i++) {
                lngSuma = lngSuma + buscarEnDiccionario(curp17.charAt(i)) * (18 - i);
            }
            lngDigito = 10 - lngSuma % 10;
            if (lngDigito == 10) return 0;
        return lngDigito;
    }
  
    if (validado[2] != digitoVerificador(validado[1])) 
    	return false;
    
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    const controlInput = document.querySelector('input[name="Control"]');
    const botonSubmit = document.querySelector('input[name="aceptar"]');
    controlInput.addEventListener('input', validarInput);
    function validarInput() {
        const curp = controlInput.value.trim();
        if (!curpValida(curp)) {
            controlInput.style.borderColor = 'red';
            botonSubmit.disabled = true;
        } else {
            controlInput.style.borderColor = '';
            botonSubmit.disabled = false;
        }
    }
});