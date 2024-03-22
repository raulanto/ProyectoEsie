function refrescar2(idDiv,strOpcion,strURL)
{  var pagina     = this;
   var xmlHttpReq = false;

   
   if(window.XMLHttpRequest)     // Mozilla/Safari
   {  pagina.xmlHttpReq = new XMLHttpRequest();
   }else if(window.ActiveXObject)// IE
   { pagina.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
   }
   pagina.xmlHttpReq.open('POST', strURL, true);
   pagina.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   pagina.xmlHttpReq.onreadystatechange = function()
      {  if (pagina.xmlHttpReq.readyState==4) 
         {  var strRespuesta=pagina.xmlHttpReq.responseText;
            document.getElementById(idDiv).innerHTML = strRespuesta;
         }
      }
   pagina.xmlHttpReq.send(strOpcion);
}
function formato2(strOpcion,strClave,strValor,strValor2,strValor3)
{  
return "opc="+strOpcion+";"+strClave+"="+strValor+strValor2+";psie="+strValor3+";dummy=0";
}