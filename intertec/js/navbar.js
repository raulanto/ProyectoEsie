function esconder() {
    top.document.body.cols = '0,*';
    const boton = parent.frames[1].document.createElement("button");
    boton.innerHTML = "";
    boton.style = "top: 5px;left: 20px;position: fixed;z-index: 9999;background: url(/intertec/img/logosie.jpg);width: 40px;height: 40px;background-repeat: no-repeat;background-size: cover;border-radius: 50% 50%;border: transparent;"
    boton.setAttribute("onclick", "top.document.body.cols='25%,*'; document.getElementById('flotante').remove(); const seleccionado = parent.frames[0].document.getElementsByClassName('selector-active')[0]; seleccionado.style='top: 4px;left: 0px;height: 45px;width: 100%;';");
    boton.setAttribute("id", "flotante");
    parent.frames[1].document.body.appendChild(boton);
};

$(document).ready(function(){
    $(".active").click();
});
