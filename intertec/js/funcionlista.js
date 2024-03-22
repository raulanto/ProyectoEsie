
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    $('#area').on('input change keyup', function () {
        if (this.value.length) {
          suma();
        }
    });
    return true;
}

function suma(){
    var suma=0;
    var lines = $('#area').val().split('\n');
        for(var i = 0;i < lines.length;i++){
            suma = suma + Number(lines[i]);
        }
        if (suma>100){
            $("#total").html("<h4 style='color:red'>"+ suma + "</h4>");
        }else if(suma==100){
            $("#total").html("<h4 style='color:green'>" + suma +"</h4>");
        }else{
            $("#total").html(suma);
        }
}
function isNumberCaja(evt, IDCuadroTexto, CuadroTexto, IdValor, IdSumador) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    $('#' + IDCuadroTexto).on('input change keyup', function () {
        if (this.value.length) {
          calcular(CuadroTexto, IdValor, IdSumador);
        }
    });
    return true;
}

function calcular(CuadroTexto, IdValor, IdSumador){
    var suma=0; 
	var dato1=0;
    $("input[name=c]").each(function() {
		
       suma += parseFloat($(this).val());
		
//        suma += Number($( this ).val());
    });
	alert(suma);

    dato1= Number($("#"+IdValor).text());
    if (suma>dato1){
        $("#" + IdSumador).html("<span style='color:red'>"+ suma + "</span>");
    }else if(sum==dato1){
        $("#" + IdSumador).html("<span style='color:green'>" + suma +"</span>");
    }else{
        $("#" + IdSumador).html(suma);
    }

}